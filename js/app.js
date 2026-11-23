/**
 * 나의 첫 게임 제작소 - 메인 앱 컨트롤러
 */
(function (global) {
  'use strict';

  var saved = global.GameData.loadProject();
  var state = {
    currentStage: 0, // 0 = 로비, 1..7 = 제작 단계
    hasSavedOnBoot: Boolean(saved),
    project: saved || global.GameData.createDefaultProject(),
    stageCleanup: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(msg, variant) {
    var container = $('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (variant || '');
    el.textContent = msg;
    container.appendChild(el);
    global.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  }

  function openModal(title, bodyHtml, onReady) {
    $('modal-title').textContent = title;
    var body = $('modal-body');
    body.innerHTML = bodyHtml;
    $('modal-overlay').classList.remove('hidden');
    if (typeof onReady === 'function') {
      onReady(body);
    }
  }

  function closeModal() {
    $('modal-overlay').classList.add('hidden');
    $('modal-body').innerHTML = '';
  }

  function updateHeader() {
    $('header-game-title').textContent = state.project.title || '이름 없는 게임';
    var muteBtn = $('btn-mute');
    var muted = global.SoundEngine.isMuted();
    muteBtn.textContent = muted ? '🔇 소리 OFF' : '🔊 소리 ON';
    muteBtn.classList.toggle('is-muted', muted);
  }

  function renderStepper() {
    var nav = $('pipeline-stepper');
    nav.innerHTML = '';
    global.GameData.STAGES.forEach(function (st, idx) {
      var visited = Boolean(state.project.meta.visitedStages && state.project.meta.visitedStages[st.id]);
      var isActive = state.currentStage === st.id;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'step-pill' + (isActive ? ' is-active' : (visited ? ' is-done' : ''));
      btn.innerHTML =
        '<span class="step-num">' + (visited && !isActive ? '✓' : st.id) + '</span>' +
        '<span>' + st.shortTitle.replace(/^\d+\.\s*/, '') + '</span>';
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        goToStage(st.id);
      });
      nav.appendChild(btn);

      if (idx < global.GameData.STAGES.length - 1) {
        var arrow = document.createElement('span');
        arrow.className = 'step-arrow';
        arrow.textContent = '›';
        nav.appendChild(arrow);
      }
    });
  }

  function updateMentorAndFooter() {
    var stageInfo = global.GameData.STAGES[state.currentStage - 1];
    if (!stageInfo) return;

    document.documentElement.style.setProperty('--stage-accent', stageInfo.accent);
    $('mentor-role').textContent = stageInfo.role;
    $('mentor-tip').textContent = stageInfo.tip;

    var visitedCount = Object.keys(state.project.meta.visitedStages || {}).length;
    $('mentor-progress').textContent = '진행도: ' + visitedCount + ' / 7 단계';

    $('footer-stage-info').textContent = stageInfo.id + ' / 7 단계 · ' + stageInfo.title;
    $('btn-prev-stage').disabled = state.currentStage <= 1;

    var nextBtn = $('btn-next-stage');
    if (state.currentStage >= 7) {
      nextBtn.textContent = '🏠 스튜디오 첫 화면으로';
    } else {
      nextBtn.textContent = '다음 단계 (' + (state.currentStage + 1) + '. ' + global.GameData.STAGES[state.currentStage].shortTitle.replace(/^\d+\.\s*/, '') + ') →';
    }
  }

  function renderLobby() {
    if (state.stageCleanup) {
      state.stageCleanup();
      state.stageCleanup = null;
    }

    $('pipeline-stepper').classList.add('hidden');
    $('mentor-bar').classList.add('hidden');
    $('stage-root').classList.add('hidden');
    $('studio-footer').classList.add('hidden');

    var lobby = $('lobby-screen');
    lobby.classList.remove('hidden');

    var cardsHtml = global.GameData.STAGES.map(function (st) {
      return (
        '<div class="pipeline-preview-card" style="border-top:4px solid ' + st.accent + ';">' +
        '  <span class="p-num" style="color:' + st.accent + ';">STEP ' + st.id + ' · ' + st.role + '</span>' +
        '  <div class="p-title">' + st.title + '</div>' +
        '  <div class="p-desc">' + st.tip + '</div>' +
        '</div>'
      );
    }).join('');

    var continueBtnHtml = state.hasSavedOnBoot
      ? '<button id="btn-lobby-continue" type="button" class="cta-big cta-continue">📂 이어서 만들기 (' + escapeText(state.project.title) + ')</button>'
      : '';

    lobby.innerHTML =
      '<section class="lobby-hero">' +
      '  <div>' +
      '    <span class="lobby-badge">초등 게임 개발 파이프라인 체험</span>' +
      '    <h1>내가 직접 기획하고 코딩해서<br/>세상에 하나뿐인 게임을 출시하자!</h1>' +
      '    <p>기획자, 픽셀 아티스트, 레벨 디자이너, 프로그래머, 사운드 디자이너, QA 테스터까지! 게임 회사의 7가지 직업을 순서대로 체험하고 내가 만든 게임을 직접 플레이해 보세요.</p>' +
      '    <div class="lobby-cta-row">' +
      '      <button id="btn-lobby-start" type="button" class="cta-big cta-primary">🚀 새 게임 만들기 시작!</button>' +
      continueBtnHtml +
      '      <button id="btn-lobby-demo" type="button" class="cta-big cta-secondary">✨ 완성 샘플 바로 플레이</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="lobby-preview-box">' +
      '    <div style="font-size:0.86rem;font-weight:700;color:#fde68a;margin-bottom:8px;">내 픽셀 캐릭터 미리보기</div>' +
      '    <canvas id="lobby-hero-canvas" class="pixel-canvas" width="96" height="96" style="background:rgba(255,255,255,0.12);border-radius:16px;padding:8px;"></canvas>' +
      '    <div style="font-size:0.85rem;color:#e0e7ff;margin-top:8px;">완성 후 <strong>개발자 수료증(PNG)</strong>도 받을 수 있어요!</div>' +
      '  </div>' +
      '</section>' +
      '<section class="lobby-pipeline-grid">' + cardsHtml + '</section>';

    var heroCanvas = $('lobby-hero-canvas');
    if (heroCanvas) {
      var hctx = heroCanvas.getContext('2d');
      global.MiniPlatformerEngine.drawSpriteGrid(hctx, state.project.sprites.hero, 8, 8, 80, 80, false);
    }

    $('btn-lobby-start').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      if (state.hasSavedOnBoot) {
        state.project = global.GameData.createDefaultProject();
        global.GameData.saveProject(state.project);
      }
      goToStage(1);
    });

    var contBtn = $('btn-lobby-continue');
    if (contBtn) {
      contBtn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        goToStage(1);
      });
    }

    $('btn-lobby-demo').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      state.project = global.GameData.createDemoProject();
      state.hasSavedOnBoot = true;
      global.GameData.saveProject(state.project);
      goToStage(7);
      showToast('✨ 완성 샘플 게임을 불러왔어요! 직접 플레이하거나 위 단계를 눌러 수정해 보세요!', 'is-success');
    });
  }

  function escapeText(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function goToStage(stageId) {
    if (stageId === 0) {
      state.currentStage = 0;
      updateHeader();
      renderLobby();
      return;
    }

    var target = Math.max(1, Math.min(7, stageId));
    if (state.stageCleanup) {
      state.stageCleanup();
      state.stageCleanup = null;
    }

    state.currentStage = target;
    if (!state.project.meta.visitedStages) state.project.meta.visitedStages = {};
    state.project.meta.visitedStages[target] = true;
    global.GameData.saveProject(state.project);
    state.hasSavedOnBoot = true;

    $('lobby-screen').classList.add('hidden');
    $('pipeline-stepper').classList.remove('hidden');
    $('mentor-bar').classList.remove('hidden');
    $('stage-root').classList.remove('hidden');
    $('studio-footer').classList.remove('hidden');

    updateHeader();
    renderStepper();
    updateMentorAndFooter();

    var root = $('stage-root');
    root.innerHTML = '';

    var stageRenderer = global.Stages[target];
    if (typeof stageRenderer === 'function') {
      var cleanup = stageRenderer(root, {
        project: state.project,
        onProjectChange: function (opts) {
          global.GameData.saveProject(state.project);
          state.hasSavedOnBoot = true;
          updateHeader();
          if (!opts || !opts.silent) {
            renderStepper();
            updateMentorAndFooter();
          }
        },
        goToStage: goToStage,
        toast: showToast,
        openModal: openModal
      });
      if (typeof cleanup === 'function') {
        state.stageCleanup = cleanup;
      }
    }
  }

  function openSaveShareModal() {
    var code = global.GameData.encodeProjectCode(state.project);
    var html =
      '<div style="display:flex;flex-direction:column;gap:14px;">' +
      '  <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:10px 12px;font-size:0.88rem;color:#065f46;font-weight:700;">' +
      '    ✅ 작업한 내용은 현재 브라우저에 자동으로 저장되고 있어요!' +
      '  </div>' +
      '  <div>' +
      '    <div style="font-weight:800;font-size:0.95rem;margin-bottom:6px;">📤 친구에게 내 게임 공유하기 (공유 코드)</div>' +
      '    <textarea id="share-export-code" class="code-textarea" readonly>' + escapeText(code) + '</textarea>' +
      '    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' +
      '      <button id="btn-copy-code" type="button" class="btn btn-primary btn-sm">📋 공유 코드 복사</button>' +
      '      <button id="btn-download-json" type="button" class="btn btn-sm">💾 파일(.json)로 저장</button>' +
      '    </div>' +
      '  </div>' +
      '  <hr style="border:none;border-top:1px solid #e2e8f0;margin:4px 0;" />' +
      '  <div>' +
      '    <div style="font-weight:800;font-size:0.95rem;margin-bottom:6px;">📥 공유 코드 또는 파일로 게임 불러오기</div>' +
      '    <textarea id="share-import-code" class="code-textarea" placeholder="여기에 친구가 보낸 공유 코드를 붙여넣어 주세요..."></textarea>' +
      '    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center;">' +
      '      <button id="btn-import-code" type="button" class="btn btn-success btn-sm">📥 코드 불러오기</button>' +
      '      <label class="btn btn-sm" style="cursor:pointer;">📂 .json 파일 열기<input id="input-import-file" type="file" accept=".json,application/json" style="display:none;" /></label>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    openModal('💾 내 게임 저장 & 공유하기', html, function (body) {
      body.querySelector('#btn-copy-code').addEventListener('click', function () {
        var ta = body.querySelector('#share-export-code');
        ta.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ta.value).then(function () {
            showToast('📋 공유 코드가 복사되었어요!', 'is-success');
          }).catch(function () {
            document.execCommand('copy');
            showToast('📋 공유 코드가 복사되었어요!', 'is-success');
          });
        } else {
          document.execCommand('copy');
          showToast('📋 공유 코드가 복사되었어요!', 'is-success');
        }
      });

      body.querySelector('#btn-download-json').addEventListener('click', function () {
        var blob = new Blob([JSON.stringify(state.project, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = (state.project.title || 'my_game').replace(/[\\/:*?"<>|]/g, '_') + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('💾 게임 파일이 저장되었어요!', 'is-success');
      });

      function applyImportedProject(proj) {
        state.project = proj;
        state.hasSavedOnBoot = true;
        global.GameData.saveProject(state.project);
        closeModal();
        goToStage(state.currentStage === 0 ? 7 : state.currentStage);
        showToast('🎉 "' + state.project.title + '" 게임을 불러왔어요!', 'is-success');
      }

      body.querySelector('#btn-import-code').addEventListener('click', function () {
        var val = body.querySelector('#share-import-code').value;
        try {
          var proj = global.GameData.decodeProjectCode(val);
          applyImportedProject(proj);
        } catch (err) {
          showToast('⚠️ 올바른 공유 코드가 아니에요. 다시 확인해 주세요.', 'is-warn');
        }
      });

      body.querySelector('#input-import-file').addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var proj = global.GameData.decodeProjectCode(String(reader.result || ''));
            applyImportedProject(proj);
          } catch (err) {
            showToast('⚠️ 읽을 수 없는 게임 파일이에요.', 'is-warn');
          }
        };
        reader.readAsText(file);
      });
    });
  }

  function openResetConfirmModal() {
    var html =
      '<p style="margin:0 0 16px;font-size:0.96rem;color:#334155;">' +
      '  현재 작업 중인 <strong>「' + escapeText(state.project.title) + '」</strong> 게임을 지우고 처음부터 새 게임을 만들까요?' +
      '</p>' +
      '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '  <button id="btn-cancel-reset" type="button" class="btn">취소</button>' +
      '  <button id="btn-confirm-reset" type="button" class="btn btn-warning">🔄 새로 만들기</button>' +
      '</div>';

    openModal('🔄 새 게임 만들기', html, function (body) {
      body.querySelector('#btn-cancel-reset').addEventListener('click', closeModal);
      body.querySelector('#btn-confirm-reset').addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        global.GameData.clearSavedProject();
        state.project = global.GameData.createDefaultProject();
        state.hasSavedOnBoot = false;
        global.GameData.saveProject(state.project);
        closeModal();
        goToStage(1);
        showToast('✨ 새로운 게임 제작을 시작했어요!', 'is-success');
      });
    });
  }

  function init() {
    $('btn-go-lobby').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      goToStage(0);
    });

    $('btn-load-demo').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      state.project = global.GameData.createDemoProject();
      state.hasSavedOnBoot = true;
      global.GameData.saveProject(state.project);
      goToStage(7);
      showToast('✨ 완성 샘플 게임을 불러왔어요! 자유롭게 수정하거나 플레이해 보세요.', 'is-success');
    });

    $('btn-save-share').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      openSaveShareModal();
    });

    $('btn-reset-project').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      openResetConfirmModal();
    });

    $('btn-mute').addEventListener('click', function () {
      global.SoundEngine.setMuted(!global.SoundEngine.isMuted());
      updateHeader();
      if (!global.SoundEngine.isMuted()) {
        global.SoundEngine.playUiClick();
      }
    });

    $('btn-prev-stage').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      if (state.currentStage > 1) {
        goToStage(state.currentStage - 1);
      }
    });

    $('btn-next-stage').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      if (state.currentStage < 7) {
        goToStage(state.currentStage + 1);
      } else {
        goToStage(0);
      }
    });

    $('modal-close').addEventListener('click', closeModal);
    $('modal-overlay').addEventListener('click', function (e) {
      if (e.target === $('modal-overlay')) closeModal();
    });
    global.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('modal-overlay').classList.contains('hidden')) {
        closeModal();
      }
    });

    updateHeader();
    renderLobby();
  }

  document.addEventListener('DOMContentLoaded', init);

  global.App = {
    goToStage: goToStage,
    getState: function () { return state; }
  };
})(window);
