/**
 * 나의 첫 게임 제작소 - Web Audio API 기반 칩튠 & 신스 사운드 엔진
 * 외부 오디오 파일 없이 100% 브라우저 내장 오디오 합성으로 동작합니다.
 */
(function (global) {
  'use strict';

  var ctx = null;
  var muted = false;
  var bgmTimer = null;
  var bgmStep = 0;
  var bgmConfigRef = null;
  var bgmStepCallback = null;

  var TIMBRE_WAVE = {
    chiptune: 'square',
    synth: 'triangle',
    musicbox: 'sine'
  };

  var TEMPO_MS = {
    slow: 240,
    normal: 175,
    fast: 130
  };

  function getContext() {
    if (muted) return null;
    try {
      if (!ctx) {
        var AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(function () {});
      }
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function playTone(freq, duration, wave, volume, delaySec, endFreq) {
    var audio = getContext();
    if (!audio) return;
    try {
      var now = audio.currentTime + (delaySec || 0);
      var osc = audio.createOscillator();
      var gain = audio.createGain();
      osc.type = wave || 'square';
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq && endFreq > 0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
      }

      var vol = volume || 0.12;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      // ignore audio scheduling errors
    }
  }

  function setMuted(val) {
    muted = Boolean(val);
    if (muted) {
      // keep sequencer timer silent while muted
    }
  }

  function isMuted() {
    return muted;
  }

  function playUiClick() {
    playTone(680, 0.045, 'triangle', 0.08, 0, 820);
  }

  function playJump(style) {
    if (style === 'laser') {
      playTone(720, 0.14, 'sawtooth', 0.09, 0, 260);
    } else if (style === 'retro') {
      playTone(300, 0.07, 'square', 0.09, 0, 520);
      playTone(520, 0.08, 'square', 0.08, 0.05, 760);
    } else {
      // boing
      playTone(260, 0.15, 'triangle', 0.14, 0, 620);
    }
  }

  function playCollect(style) {
    if (style === 'sparkle') {
      playTone(659.25, 0.08, 'sine', 0.11, 0);
      playTone(783.99, 0.08, 'sine', 0.11, 0.05);
      playTone(1046.5, 0.14, 'sine', 0.12, 0.10);
    } else if (style === 'power') {
      playTone(440, 0.07, 'square', 0.09, 0);
      playTone(554.37, 0.07, 'square', 0.09, 0.06);
      playTone(659.25, 0.09, 'square', 0.09, 0.12);
      playTone(880, 0.16, 'square', 0.10, 0.18);
    } else {
      // coin
      playTone(987.77, 0.07, 'square', 0.09, 0);
      playTone(1318.51, 0.18, 'square', 0.10, 0.065);
    }
  }

  function playHit(style) {
    if (style === 'zap') {
      playTone(420, 0.14, 'sawtooth', 0.11, 0, 95);
    } else if (style === 'ouch') {
      playTone(360, 0.1, 'triangle', 0.12, 0, 210);
      playTone(210, 0.16, 'triangle', 0.12, 0.08, 110);
    } else {
      // bonk
      playTone(180, 0.16, 'square', 0.11, 0, 75);
    }
  }

  function playSpring() {
    playTone(240, 0.2, 'triangle', 0.13, 0, 880);
  }

  function playStomp() {
    playTone(320, 0.08, 'square', 0.10, 0, 140);
    playTone(480, 0.09, 'triangle', 0.11, 0.04, 680);
  }

  function playWin(style) {
    if (style === 'levelup') {
      var notesA = [523.25, 587.33, 659.25, 783.99, 1046.5];
      notesA.forEach(function (f, idx) {
        playTone(f, 0.13, 'triangle', 0.12, idx * 0.085);
      });
    } else {
      // fanfare
      playTone(523.25, 0.1, 'square', 0.09, 0);
      playTone(659.25, 0.1, 'square', 0.09, 0.1);
      playTone(783.99, 0.1, 'square', 0.09, 0.2);
      playTone(1046.5, 0.32, 'square', 0.11, 0.31);
    }
  }

  function playLose() {
    playTone(392, 0.14, 'triangle', 0.11, 0);
    playTone(349.23, 0.14, 'triangle', 0.11, 0.14);
    playTone(311.13, 0.16, 'triangle', 0.11, 0.28);
    playTone(261.63, 0.28, 'triangle', 0.12, 0.44);
  }

  function playBugFixed() {
    playTone(523.25, 0.08, 'triangle', 0.11, 0);
    playTone(659.25, 0.08, 'triangle', 0.11, 0.07);
    playTone(783.99, 0.1, 'triangle', 0.12, 0.14);
    playTone(1046.5, 0.2, 'sine', 0.14, 0.21);
  }

  function playNote(rowIndex, timbre) {
    var notes = global.GameData && global.GameData.BGM_NOTES;
    if (!notes || !notes[rowIndex]) return;
    var wave = TIMBRE_WAVE[timbre] || 'square';
    var vol = wave === 'square' ? 0.05 : 0.09;
    playTone(notes[rowIndex].freq, 0.14, wave, vol, 0);
  }

  function tickBgm() {
    if (!bgmConfigRef) return;
    var grid = bgmConfigRef.bgm;
    var timbre = bgmConfigRef.timbre || 'chiptune';
    if (Array.isArray(grid)) {
      for (var r = 0; r < grid.length; r++) {
        if (grid[r] && grid[r][bgmStep]) {
          playNote(r, timbre);
        }
      }
    }
    if (typeof bgmStepCallback === 'function') {
      bgmStepCallback(bgmStep);
    }
    bgmStep = (bgmStep + 1) % 8;
  }

  function startBgm(bgmConfig, onStep) {
    stopBgm();
    bgmConfigRef = bgmConfig;
    bgmStepCallback = onStep || null;
    bgmStep = 0;
    var ms = TEMPO_MS[(bgmConfig && bgmConfig.tempo) || 'normal'] || 175;
    tickBgm();
    bgmTimer = global.setInterval(tickBgm, ms);
  }

  function restartBgmWithTempo(bgmConfig, onStep) {
    if (!bgmTimer) return;
    startBgm(bgmConfig, onStep);
  }

  function stopBgm() {
    if (bgmTimer !== null) {
      global.clearInterval(bgmTimer);
      bgmTimer = null;
    }
    bgmStepCallback = null;
    bgmConfigRef = null;
    bgmStep = 0;
  }

  function isBgmPlaying() {
    return bgmTimer !== null;
  }

  global.SoundEngine = {
    setMuted: setMuted,
    isMuted: isMuted,
    playUiClick: playUiClick,
    playJump: playJump,
    playCollect: playCollect,
    playHit: playHit,
    playSpring: playSpring,
    playStomp: playStomp,
    playWin: playWin,
    playLose: playLose,
    playBugFixed: playBugFixed,
    playNote: playNote,
    startBgm: startBgm,
    restartBgmWithTempo: restartBgmWithTempo,
    stopBgm: stopBgm,
    isBgmPlaying: isBgmPlaying
  };
})(window);
