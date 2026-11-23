/**
 * 나의 첫 게임 제작소 - 2D 미니 플랫포머 게임 엔진 & 공통 렌더러
 */
(function (global) {
  'use strict';

  var TILE = 32;

  function drawSpriteGrid(ctx, grid, x, y, w, h, flipX) {
    if (!Array.isArray(grid)) return;
    var rows = grid.length;
    var cols = grid[0] ? grid[0].length : 12;
    var pw = w / cols;
    var ph = h / rows;

    ctx.save();
    if (flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }

    for (var r = 0; r < rows; r++) {
      var row = grid[r];
      for (var c = 0; c < cols; c++) {
        var color = row[c];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(x + c * pw),
          Math.floor(y + r * ph),
          Math.ceil(pw),
          Math.ceil(ph)
        );
      }
    }
    ctx.restore();
  }

  function renderSpriteToCanvas(grid, size) {
    var c = document.createElement('canvas');
    c.width = size || 24;
    c.height = size || 24;
    var cctx = c.getContext('2d');
    drawSpriteGrid(cctx, grid, 0, 0, c.width, c.height, false);
    return c;
  }

  function drawThemeBackground(ctx, width, height, theme, timeSec) {
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, theme.skyTop);
    grad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    var t = timeSec || 0;
    ctx.save();
    if (theme.id === 'space') {
      // 반짝이는 별 + 행성
      for (var i = 0; i < 28; i++) {
        var sx = ((i * 97 + 23) % width);
        var sy = ((i * 53 + 17) % Math.max(80, height - 80));
        var alpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 2 + i));
        ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';
        var size = i % 3 === 0 ? 3 : 2;
        ctx.fillRect(sx, sy, size, size);
      }
      ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
      ctx.beginPath();
      ctx.arc(width * 0.82, height * 0.24, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(width * 0.82, height * 0.24, 44, 10, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    } else if (theme.id === 'volcano') {
      // 동굴 바위 실루엣 & 불티
      ctx.fillStyle = 'rgba(28, 25, 23, 0.35)';
      for (var m = 0; m < 5; m++) {
        var mx = m * (width / 4) - 20;
        ctx.beginPath();
        ctx.moveTo(mx, height);
        ctx.lineTo(mx + 95, height * 0.48 + (m % 2) * 26);
        ctx.lineTo(mx + 190, height);
        ctx.closePath();
        ctx.fill();
      }
      for (var e = 0; e < 14; e++) {
        var ex = (e * 73 + t * 14) % width;
        var ey = height - ((e * 41 + t * 32) % (height * 0.8));
        ctx.fillStyle = theme.decorColor;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // 구름 (초원 / 과자 왕국)
      ctx.fillStyle = theme.decorColor;
      for (var k = 0; k < 4; k++) {
        var cx = ((k * 210 + t * 12) % (width + 120)) - 60;
        var cy = 42 + (k % 2) * 34;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.arc(cx + 18, cy - 6, 20, 0, Math.PI * 2);
        ctx.arc(cx + 38, cy, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawTile(ctx, tileId, x, y, size, theme, sprites, timeSec, flagLocked) {
    var t = timeSec || 0;
    if (tileId === 1) {
      // 땅 블록
      ctx.fillStyle = theme.groundFill;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = theme.groundTop;
      ctx.fillRect(x, y, size, Math.max(5, Math.round(size * 0.24)));
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(x + 4, y + size * 0.48, 5, 4);
      ctx.fillRect(x + size * 0.58, y + size * 0.65, 6, 4);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    } else if (tileId === 2) {
      // 구름 발판 (위에서만 밟음)
      ctx.fillStyle = theme.platformFill;
      ctx.strokeStyle = theme.platformBorder;
      ctx.lineWidth = 2;
      var h = Math.round(size * 0.42);
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x + 1, y + 1, size - 2, h, 6);
      } else {
        ctx.rect(x + 1, y + 1, size - 2, h);
      }
      ctx.fill();
      ctx.stroke();
    } else if (tileId === 3) {
      // 가시 함정
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      var half = size / 2;
      for (var s = 0; s < 2; s++) {
        var sx = x + s * half;
        ctx.beginPath();
        ctx.moveTo(sx + 2, y + size);
        ctx.lineTo(sx + half / 2, y + size * 0.34);
        ctx.lineTo(sx + half - 2, y + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (tileId === 4) {
      // 점프대 스프링
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + 4, y + size - 6, size - 8, 6);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x + 9, y + size - 6);
      ctx.lineTo(x + size - 9, y + size - 12);
      ctx.lineTo(x + 9, y + size - 17);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + 3, y + size - 22, size - 6, 7);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(x + 5, y + size - 22, size - 10, 2);
    } else if (tileId === 5 && sprites && sprites.enemy) {
      drawSpriteGrid(ctx, sprites.enemy, x + 3, y + 5, size - 6, size - 5, false);
    } else if (tileId === 6 && sprites && sprites.collectible) {
      var bob = Math.sin(t * 4 + x * 0.05) * 2.5;
      drawSpriteGrid(ctx, sprites.collectible, x + 5, y + 5 + bob, size - 10, size - 10, false);
    } else if (tileId === 7) {
      // 출발 마커 (에디터 전용)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      if (sprites && sprites.hero) {
        drawSpriteGrid(ctx, sprites.hero, x + 4, y + 4, size - 8, size - 6, false);
      }
    } else if (tileId === 8) {
      // 도착 깃발
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + size * 0.25, y + 3, 4, size - 3);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + size * 0.25 + 2, y + 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      var wave = Math.sin(t * 5) * 2;
      ctx.fillStyle = flagLocked ? '#94a3b8' : '#22c55e';
      ctx.beginPath();
      ctx.moveTo(x + size * 0.25 + 4, y + 5);
      ctx.lineTo(x + size - 3, y + 10 + wave);
      ctx.lineTo(x + size * 0.25 + 4, y + 19);
      ctx.closePath();
      ctx.fill();

      if (flagLocked) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('🔒', x + size * 0.45, y + size - 4);
      }
    }
  }

  function buildSandboxLevel() {
    return global.GameData.parseLevelMap([
      '................',
      '................',
      '.........*......',
      '........===.....',
      '....*...........',
      '...===......E...',
      '.P......J..====.',
      '################'
    ].map(function (r) {
      return r + '........';
    })).map(function (row) {
      return row.slice(0, 16);
    });
  }

  function buildQaLevel() {
    return global.GameData.parseLevelMap([
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '.P..........F.',
      '##############'
    ].map(function (r) {
      return r + '..........';
    })).map(function (row) {
      return row.slice(0, 14);
    });
  }

  function MiniPlatformerEngine(canvas, project, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.project = project;
    this.options = options || {};
    this.mode = this.options.mode || 'play';
    this.qaBug = this.options.qaBug || null;
    this.qaFixed = Boolean(this.options.qaFixed);
    this.autoDemo = Boolean(this.options.autoDemo);

    this.destroyed = false;
    this.rafId = null;
    this.lastTs = 0;
    this.elapsed = 0;
    this.keys = { left: false, right: false, jump: false };
    this.virtualKeys = { left: false, right: false, jump: false };
    this.jumpJustPressed = false;
    this.particles = [];
    this.popups = [];
    this.shakeTimer = 0;
    this.statusBanner = '';
    this.qaTimer = 0;
    this.sandboxHealTimer = 0;

    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = this._handleKeyUp.bind(this);
    global.addEventListener('keydown', this._onKeyDown);
    global.addEventListener('keyup', this._onKeyUp);

    this.reset();
  }

  MiniPlatformerEngine.prototype.setProject = function (project) {
    this.project = project;
  };

  MiniPlatformerEngine.prototype.setQaState = function (qaBug, qaFixed) {
    this.qaBug = qaBug;
    this.qaFixed = Boolean(qaFixed);
    this.reset();
  };

  MiniPlatformerEngine.prototype.setVirtualInput = function (key, isDown) {
    var prev = this.virtualKeys[key];
    this.virtualKeys[key] = Boolean(isDown);
    if (key === 'jump' && isDown && !prev) {
      this.jumpJustPressed = true;
    }
  };

  MiniPlatformerEngine.prototype._isTypingTarget = function (el) {
    if (!el) return false;
    var tag = el.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (tag === 'INPUT') {
      var type = (el.type || 'text').toLowerCase();
      return type !== 'range' && type !== 'checkbox' && type !== 'button';
    }
    return false;
  };

  MiniPlatformerEngine.prototype._handleKeyDown = function (e) {
    if (this.destroyed) return;
    if (this._isTypingTarget(document.activeElement)) return;

    var isRange = document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'range';

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      if (isRange && e.code === 'ArrowLeft') return;
      if (e.code === 'ArrowLeft') e.preventDefault();
      this.keys.left = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      if (isRange && e.code === 'ArrowRight') return;
      if (e.code === 'ArrowRight') e.preventDefault();
      this.keys.right = true;
    } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      if (!this.keys.jump) {
        this.jumpJustPressed = true;
      }
      this.keys.jump = true;
    }
  };

  MiniPlatformerEngine.prototype._handleKeyUp = function (e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keys.left = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keys.right = false;
    } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.keys.jump = false;
    }
  };

  MiniPlatformerEngine.prototype.reset = function () {
    var sourceMap;
    if (this.mode === 'sandbox') {
      sourceMap = buildSandboxLevel();
    } else if (this.mode === 'qa') {
      sourceMap = buildQaLevel();
    } else {
      sourceMap = this.project.level;
    }

    this.rows = sourceMap.length;
    this.cols = sourceMap[0].length;
    this.canvas.width = this.cols * TILE;
    this.canvas.height = this.rows * TILE;

    this.map = [];
    this.collectibles = [];
    this.enemies = [];
    this.spawn = { x: TILE * 1.2, y: (this.rows - 3) * TILE };
    this.goalPos = null;

    for (var r = 0; r < this.rows; r++) {
      var rowCopy = [];
      for (var c = 0; c < this.cols; c++) {
        var t = sourceMap[r][c];
        if (t === 7) {
          this.spawn = { x: c * TILE + 5, y: r * TILE + (TILE - 26) };
          rowCopy.push(0);
        } else if (t === 6) {
          this.collectibles.push({
            id: r + '_' + c,
            x: c * TILE + 6,
            y: r * TILE + 6,
            w: 20,
            h: 20,
            collected: false
          });
          rowCopy.push(0);
        } else if (t === 5) {
          this.enemies.push({
            x: c * TILE + 4,
            y: r * TILE + 8,
            w: 24,
            h: 24,
            vx: 66,
            vy: 0,
            alive: true
          });
          rowCopy.push(0);
        } else {
          if (t === 8) {
            this.goalPos = { x: c * TILE, y: r * TILE };
          }
          rowCopy.push(t);
        }
      }
      this.map.push(rowCopy);
    }

    this.hero = {
      x: this.spawn.x,
      y: this.spawn.y,
      w: 22,
      h: 26,
      vx: 0,
      vy: 0,
      facingLeft: false,
      onGround: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      doubleJumpUsed: false,
      invincibleTimer: 0,
      speedBoostTimer: 0,
      hearts: this.project.rules.maxHearts || 3,
      walkPhase: 0
    };

    this.score = 0;
    this.collectedCount = 0;
    this.totalCollectibles = this.collectibles.length;
    this.timeLeft = this.project.goal === 'time_attack' ? 30.0 : 0;
    this.elapsed = 0;
    this.state = 'playing'; // playing | won | lost
    this.particles = [];
    this.popups = [];
    this.shakeTimer = 0;
    this.qaTimer = 0;
    this.statusBanner = '';
    this._emitHud();
  };

  MiniPlatformerEngine.prototype.start = function () {
    if (this.rafId) return;
    this.lastTs = performance.now();
    var self = this;
    function frame(ts) {
      if (self.destroyed) return;
      var dt = Math.min(0.04, Math.max(0.001, (ts - self.lastTs) / 1000));
      self.lastTs = ts;
      self.update(dt);
      self.render();
      self.rafId = global.requestAnimationFrame(frame);
    }
    this.rafId = global.requestAnimationFrame(frame);
  };

  MiniPlatformerEngine.prototype.destroy = function () {
    this.destroyed = true;
    if (this.rafId) {
      global.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    global.removeEventListener('keydown', this._onKeyDown);
    global.removeEventListener('keyup', this._onKeyUp);
  };

  MiniPlatformerEngine.prototype._addParticles = function (x, y, color, count) {
    for (var i = 0; i < (count || 10); i++) {
      var angle = (Math.PI * 2 * i) / (count || 10) + Math.random() * 0.4;
      var spd = 50 + Math.random() * 110;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 40,
        life: 0.45 + Math.random() * 0.25,
        maxLife: 0.7,
        size: 3 + Math.random() * 3,
        color: color || '#fde047'
      });
    }
  };

  MiniPlatformerEngine.prototype._addPopup = function (x, y, text, color) {
    this.popups.push({
      x: x,
      y: y,
      text: text,
      color: color || '#ffffff',
      life: 0.9
    });
  };

  MiniPlatformerEngine.prototype._isSolidAt = function (col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return false;
    return this.map[row][col] === 1;
  };

  MiniPlatformerEngine.prototype._isPlatformAt = function (col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return false;
    return this.map[row][col] === 2;
  };

  MiniPlatformerEngine.prototype._damageHero = function (knockDir) {
    if (this.hero.invincibleTimer > 0 || this.state !== 'playing') return;
    if (this.mode === 'qa') return;

    var sfx = this.project.audio && this.project.audio.sfx;
    if (global.SoundEngine && this.mode !== 'qa') {
      global.SoundEngine.playHit(sfx ? sfx.hit : 'bonk');
    }

    this.hero.hearts -= 1;
    this.hero.invincibleTimer = 1.25;
    this.shakeTimer = 0.22;
    this._addParticles(this.hero.x + this.hero.w / 2, this.hero.y + this.hero.h / 2, '#ef4444', 10);
    this._addPopup(this.hero.x + 10, this.hero.y - 6, '💔 -1', '#fca5a5');

    if (this.mode === 'sandbox') {
      if (this.hero.hearts <= 0) {
        this.hero.hearts = this.project.rules.maxHearts || 3;
      }
      if (this.project.rules.enemyHit === 'respawn') {
        this.hero.x = this.spawn.x;
        this.hero.y = this.spawn.y;
        this.hero.vx = 0;
        this.hero.vy = 0;
      } else {
        this.hero.vy = -240;
        this.hero.vx = (knockDir || -1) * 180;
      }
      this._emitHud();
      return;
    }

    if (this.hero.hearts <= 0) {
      this.hero.hearts = 0;
      this.state = 'lost';
      if (global.SoundEngine) global.SoundEngine.playLose();
      this._emitHud();
      if (typeof this.options.onLose === 'function') {
        this.options.onLose({ reason: '하트가 모두 소진되었어요!', score: this.score });
      }
      return;
    }

    if (this.project.rules.enemyHit === 'respawn') {
      this.hero.x = this.spawn.x;
      this.hero.y = this.spawn.y;
      this.hero.vx = 0;
      this.hero.vy = 0;
    } else {
      this.hero.vy = -260;
      this.hero.vx = (knockDir || -1) * 190;
    }
    this._emitHud();
  };

  MiniPlatformerEngine.prototype._emitHud = function () {
    if (typeof this.options.onHudUpdate === 'function') {
      this.options.onHudUpdate({
        hearts: this.hero.hearts,
        maxHearts: this.project.rules.maxHearts || 3,
        score: this.score,
        collected: this.collectedCount,
        totalCollectibles: this.totalCollectibles,
        timeLeft: this.timeLeft,
        elapsed: this.elapsed,
        speedBoost: this.hero.speedBoostTimer > 0,
        state: this.state
      });
    }
  };

  MiniPlatformerEngine.prototype.update = function (dt) {
    this.elapsed += dt;

    // 파티클 & 팝업 업데이트
    for (var p = this.particles.length - 1; p >= 0; p--) {
      var pt = this.particles[p];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 280 * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(p, 1);
    }
    for (var u = this.popups.length - 1; u >= 0; u--) {
      var pp = this.popups[u];
      pp.y -= 32 * dt;
      pp.life -= dt;
      if (pp.life <= 0) this.popups.splice(u, 1);
    }
    if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);

    if (this.state !== 'playing') return;

    // QA 모드 전용 시뮬레이션 처리
    if (this.mode === 'qa') {
      this._updateQa(dt);
      return;
    }

    // 타임 어택 처리
    if (this.mode === 'play' && this.project.goal === 'time_attack') {
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      if (this.timeLeft <= 0) {
        this.state = 'lost';
        if (global.SoundEngine) global.SoundEngine.playLose();
        this._emitHud();
        if (typeof this.options.onLose === 'function') {
          this.options.onLose({ reason: '30초 제한 시간이 끝났어요!', score: this.score });
        }
        return;
      }
    }

    var rules = this.project.rules;
    var baseSpeed = 120 + (rules.speed - 1) * 26;
    if (this.hero.speedBoostTimer > 0) {
      this.hero.speedBoostTimer = Math.max(0, this.hero.speedBoostTimer - dt);
      baseSpeed *= 1.4;
    }

    var moveLeft = this.keys.left || this.virtualKeys.left;
    var moveRight = this.keys.right || this.virtualKeys.right;

    if (moveLeft && !moveRight) {
      this.hero.vx = -baseSpeed;
      this.hero.facingLeft = true;
      this.hero.walkPhase += dt * 12;
    } else if (moveRight && !moveLeft) {
      this.hero.vx = baseSpeed;
      this.hero.facingLeft = false;
      this.hero.walkPhase += dt * 12;
    } else {
      this.hero.vx *= Math.pow(0.001, dt);
      if (Math.abs(this.hero.vx) < 8) this.hero.vx = 0;
    }

    // 점프 물리
    var gravityPx = 700 + (rules.gravity - 1) * 140;
    var jumpVel = -(360 + (rules.jumpPower - 1) * 35);

    if (this.hero.onGround) {
      this.hero.coyoteTimer = 0.1;
      this.hero.doubleJumpUsed = false;
    } else {
      this.hero.coyoteTimer = Math.max(0, this.hero.coyoteTimer - dt);
    }

    if (this.jumpJustPressed) {
      this.hero.jumpBufferTimer = 0.11;
      this.jumpJustPressed = false;
    } else {
      this.hero.jumpBufferTimer = Math.max(0, this.hero.jumpBufferTimer - dt);
    }

    if (this.hero.jumpBufferTimer > 0) {
      if (this.hero.coyoteTimer > 0) {
        this.hero.vy = jumpVel;
        this.hero.onGround = false;
        this.hero.coyoteTimer = 0;
        this.hero.jumpBufferTimer = 0;
        if (global.SoundEngine) {
          global.SoundEngine.playJump(this.project.audio && this.project.audio.sfx ? this.project.audio.sfx.jump : 'boing');
        }
      } else if (rules.doubleJump && !this.hero.doubleJumpUsed) {
        this.hero.vy = jumpVel * 0.92;
        this.hero.doubleJumpUsed = true;
        this.hero.jumpBufferTimer = 0;
        this._addParticles(this.hero.x + this.hero.w / 2, this.hero.y + this.hero.h, '#ffffff', 6);
        if (global.SoundEngine) {
          global.SoundEngine.playJump(this.project.audio && this.project.audio.sfx ? this.project.audio.sfx.jump : 'boing');
        }
      }
    }

    if (this.hero.invincibleTimer > 0) {
      this.hero.invincibleTimer = Math.max(0, this.hero.invincibleTimer - dt);
    }

    this.hero.vy = Math.min(720, this.hero.vy + gravityPx * dt);

    // X축 이동 & 충돌
    this.hero.x += this.hero.vx * dt;
    if (this.hero.x < 0) this.hero.x = 0;
    if (this.hero.x + this.hero.w > this.cols * TILE) {
      this.hero.x = this.cols * TILE - this.hero.w;
    }
    this._resolveHorizontalCollisions();

    // Y축 이동 & 충돌
    var prevBottom = this.hero.y + this.hero.h;
    this.hero.y += this.hero.vy * dt;
    this.hero.onGround = false;
    this._resolveVerticalCollisions(prevBottom);

    // 아래로 추락 처리
    if (this.hero.y > this.rows * TILE + 24) {
      if (this.mode === 'sandbox') {
        this.hero.x = this.spawn.x;
        this.hero.y = this.spawn.y;
        this.hero.vx = 0;
        this.hero.vy = 0;
      } else {
        this.hero.x = this.spawn.x;
        this.hero.y = this.spawn.y;
        this.hero.vx = 0;
        this.hero.vy = 0;
        this._damageHero(1);
        if (this.state !== 'playing') return;
      }
    }

    // 타일 상호작용 (가시, 점프대, 깃발)
    this._checkTileInteractions(jumpVel);
    if (this.state !== 'playing') return;

    // 보물 수집
    this._updateCollectibles();

    // 몬스터 업데이트 & 충돌
    this._updateEnemies(dt, jumpVel);

    // 샌드박스에서는 보물 다시 채우기
    if (this.mode === 'sandbox') {
      var anyLeft = this.collectibles.some(function (it) { return !it.collected; });
      if (!anyLeft) {
        this.sandboxHealTimer += dt;
        if (this.sandboxHealTimer > 1.5) {
          this.sandboxHealTimer = 0;
          this.collectibles.forEach(function (it) { it.collected = false; });
        }
      }
      var anyEnemy = this.enemies.some(function (en) { return en.alive; });
      if (!anyEnemy && this.enemies.length > 0) {
        this.sandboxHealTimer += dt;
        if (this.sandboxHealTimer > 1.8) {
          this.sandboxHealTimer = 0;
          this.enemies.forEach(function (en) { en.alive = true; });
        }
      }
    }

    this._emitHud();
  };

  MiniPlatformerEngine.prototype._updateQa = function (dt) {
    this.qaTimer += dt;
    var h = this.hero;
    var hasUserInput = this.keys.left || this.keys.right || this.keys.jump;

    if (this.qaBug === 'inverted_gravity') {
      var grav = 900;
      if (!this.qaFixed) {
        this.statusBanner = '🐛 버그 발생: 중력이 위로 작용해서 하늘로 날아가고 있어요!';
        h.vy -= grav * dt;
        h.y += h.vy * dt;
        if (h.y < 8) {
          h.y = 8;
          h.vy = 40;
          this._addPopup(h.x, h.y + 34, '앗! 천장!', '#fde047');
        }
        if (this.qaTimer > 2.4) {
          this.qaTimer = 0;
          h.x = this.spawn.x;
          h.y = this.spawn.y;
          h.vy = 0;
        }
      } else {
        this.statusBanner = '✅ 수정 완료: 중력이 아래로 정상 작동해요!';
        if (this.autoDemo && !hasUserInput && h.onGround && Math.floor(this.elapsed * 1.4) % 2 === 0 && this.qaTimer > 0.9) {
          h.vy = -340;
          this.qaTimer = 0;
        }
        h.vy += grav * dt;
        var prevB = h.y + h.h;
        h.y += h.vy * dt;
        h.onGround = false;
        this._resolveVerticalCollisions(prevB);
      }
    } else if (this.qaBug === 'no_collision') {
      h.vy += 1050 * dt;
      if (!this.qaFixed) {
        this.statusBanner = '🐛 버그 발생: 바닥 충돌 검사가 꺼져서 땅을 뚫고 떨어져요!';
        h.y += h.vy * dt;
        if (h.y > this.rows * TILE + 12) {
          this._addPopup(h.x, this.rows * TILE - 32, '으악! 바닥 뚫림!', '#fca5a5');
          h.x = this.spawn.x;
          h.y = 32;
          h.vy = 0;
        }
      } else {
        this.statusBanner = '✅ 수정 완료: 땅 블록을 안전하게 밟고 서 있어요!';
        var prevB2 = h.y + h.h;
        h.y += h.vy * dt;
        h.onGround = false;
        this._resolveVerticalCollisions(prevB2);
        if (this.autoDemo && !hasUserInput && h.onGround && this.qaTimer > 1.1) {
          h.vy = -320;
          this.qaTimer = 0;
        }
      }
    } else if (this.qaBug === 'broken_goal') {
      h.vy += 1050 * dt;
      var prevB3 = h.y + h.h;
      h.y += h.vy * dt;
      h.onGround = false;
      this._resolveVerticalCollisions(prevB3);

      if (this.autoDemo && !hasUserInput) {
        h.vx = 140;
        h.walkPhase += dt * 10;
      } else if (this.keys.left) {
        h.vx = -160;
      } else if (this.keys.right) {
        h.vx = 160;
      } else {
        h.vx = 0;
      }
      h.x += h.vx * dt;
      if (h.x > (this.cols - 1) * TILE) {
        h.x = this.spawn.x;
      }

      if (this.goalPos && Math.abs(h.x - this.goalPos.x) < 22) {
        if (!this.qaFixed) {
          this.statusBanner = '🐛 버그 발생: 깃발에 닿았는데 클리어 이벤트가 안 떠요!';
          if (this.qaTimer > 0.8) {
            this._addPopup(this.goalPos.x, this.goalPos.y - 8, '???', '#fde047');
            this.qaTimer = 0;
          }
        } else {
          this.statusBanner = '✅ 수정 완료: 깃발에 닿자마자 클리어 파티클이 터져요!';
          if (this.qaTimer > 0.9) {
            this._addParticles(this.goalPos.x + 16, this.goalPos.y + 12, '#34d399', 16);
            this._addPopup(this.goalPos.x - 10, this.goalPos.y - 8, '🎉 CLEAR!', '#34d399');
            this.qaTimer = 0;
          }
        }
      }
    }
  };

  MiniPlatformerEngine.prototype._resolveHorizontalCollisions = function () {
    var h = this.hero;
    var topRow = Math.floor((h.y + 2) / TILE);
    var bottomRow = Math.floor((h.y + h.h - 2) / TILE);
    var leftCol = Math.floor(h.x / TILE);
    var rightCol = Math.floor((h.x + h.w) / TILE);

    if (h.vx > 0) {
      for (var r = topRow; r <= bottomRow; r++) {
        if (this._isSolidAt(rightCol, r)) {
          h.x = rightCol * TILE - h.w - 0.01;
          h.vx = 0;
          break;
        }
      }
    } else if (h.vx < 0) {
      for (var r2 = topRow; r2 <= bottomRow; r2++) {
        if (this._isSolidAt(leftCol, r2)) {
          h.x = (leftCol + 1) * TILE + 0.01;
          h.vx = 0;
          break;
        }
      }
    }
  };

  MiniPlatformerEngine.prototype._resolveVerticalCollisions = function (prevBottom) {
    var h = this.hero;
    var leftCol = Math.floor((h.x + 2) / TILE);
    var rightCol = Math.floor((h.x + h.w - 2) / TILE);
    var topRow = Math.floor(h.y / TILE);
    var bottomRow = Math.floor((h.y + h.h) / TILE);

    if (h.vy >= 0) {
      for (var c = leftCol; c <= rightCol; c++) {
        if (this._isSolidAt(c, bottomRow)) {
          h.y = bottomRow * TILE - h.h;
          h.vy = 0;
          h.onGround = true;
          return;
        }
        if (this._isPlatformAt(c, bottomRow)) {
          var platTop = bottomRow * TILE;
          if (prevBottom <= platTop + 6) {
            h.y = platTop - h.h;
            h.vy = 0;
            h.onGround = true;
            return;
          }
        }
      }
    } else if (h.vy < 0) {
      for (var c2 = leftCol; c2 <= rightCol; c2++) {
        if (this._isSolidAt(c2, topRow)) {
          h.y = (topRow + 1) * TILE + 0.01;
          h.vy = 0;
          return;
        }
      }
    }
  };

  MiniPlatformerEngine.prototype._checkTileInteractions = function (jumpVel) {
    var h = this.hero;
    var c1 = Math.floor((h.x + 4) / TILE);
    var c2 = Math.floor((h.x + h.w - 4) / TILE);
    var r1 = Math.floor((h.y + 4) / TILE);
    var r2 = Math.floor((h.y + h.h - 2) / TILE);

    for (var r = r1; r <= r2; r++) {
      for (var c = c1; c <= c2; c++) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) continue;
        var t = this.map[r][c];
        if (t === 3) {
          // 가시 히트박스 (타일 하단)
          var spikeTop = r * TILE + TILE * 0.45;
          if (h.y + h.h > spikeTop) {
            this._damageHero(h.facingLeft ? 1 : -1);
            return;
          }
        } else if (t === 4) {
          // 점프대
          var padTop = r * TILE + TILE * 0.35;
          if (h.y + h.h >= padTop && h.vy >= -40) {
            var mult = this.project.rules.springPower === 'super' ? 2.05 : 1.68;
            h.vy = jumpVel * mult;
            h.onGround = false;
            h.doubleJumpUsed = false;
            var pColor = this.project.rules.springPower === 'super' ? '#fde047' : '#38bdf8';
            this._addParticles(c * TILE + 16, r * TILE + 12, pColor, this.project.rules.springPower === 'super' ? 14 : 7);
            if (global.SoundEngine) global.SoundEngine.playSpring();
          }
        } else if (t === 8 && this.mode !== 'sandbox') {
          var locked = this.project.goal === 'collect_all' && this.collectedCount < this.totalCollectibles;
          if (locked) {
            if (this.popups.length === 0) {
              this._addPopup(c * TILE - 18, r * TILE - 10, '보물을 다 모아야 해요!', '#fde047');
            }
          } else {
            this.state = 'won';
            this._addParticles(c * TILE + 16, r * TILE + 16, '#34d399', 22);
            if (global.SoundEngine) {
              global.SoundEngine.playWin(this.project.audio && this.project.audio.sfx ? this.project.audio.sfx.win : 'fanfare');
            }
            this._emitHud();
            if (typeof this.options.onWin === 'function') {
              this.options.onWin({
                score: this.score + Math.round(this.hero.hearts * 100),
                elapsed: this.elapsed,
                collected: this.collectedCount,
                totalCollectibles: this.totalCollectibles
              });
            }
            return;
          }
        }
      }
    }
  };

  MiniPlatformerEngine.prototype._updateCollectibles = function () {
    var h = this.hero;
    for (var i = 0; i < this.collectibles.length; i++) {
      var item = this.collectibles[i];
      if (item.collected) continue;
      if (
        h.x < item.x + item.w &&
        h.x + h.w > item.x &&
        h.y < item.y + item.h &&
        h.y + h.h > item.y
      ) {
        item.collected = true;
        this.collectedCount += 1;
        this.score += 100;
        var eff = this.project.rules.collectEffect;
        if (eff === 'speed') {
          this.hero.speedBoostTimer = 3.0;
          this._addPopup(item.x, item.y - 8, '⚡ 스피드 업!', '#38bdf8');
        } else if (eff === 'heal') {
          var maxH = this.project.rules.maxHearts || 3;
          if (this.hero.hearts < maxH) {
            this.hero.hearts += 1;
            this._addPopup(item.x, item.y - 8, '💖 +1 회복!', '#f472b6');
          } else {
            this._addPopup(item.x, item.y - 8, '+100', '#fde047');
          }
        } else {
          this._addPopup(item.x, item.y - 8, '+100', '#fde047');
        }
        this._addParticles(item.x + 10, item.y + 10, '#fde047', 10);
        if (global.SoundEngine) {
          global.SoundEngine.playCollect(this.project.audio && this.project.audio.sfx ? this.project.audio.sfx.collect : 'coin');
        }
      }
    }
  };

  MiniPlatformerEngine.prototype._updateEnemies = function (dt, jumpVel) {
    var h = this.hero;
    for (var i = 0; i < this.enemies.length; i++) {
      var en = this.enemies[i];
      if (!en.alive) continue;

      en.vy = Math.min(600, en.vy + 1100 * dt);
      en.x += en.vx * dt;

      // 벽이나 절벽 만나면 방향 전환
      var hitEdge = en.x < 0 || en.x + en.w > this.cols * TILE;
      var frontCol = Math.floor((en.vx > 0 ? en.x + en.w : en.x) / TILE);
      var midRow = Math.floor((en.y + en.h / 2) / TILE);
      var belowRow = Math.floor((en.y + en.h + 3) / TILE);

      if (hitEdge || this._isSolidAt(frontCol, midRow)) {
        en.vx *= -1;
        en.x = Math.max(0, Math.min(this.cols * TILE - en.w, en.x));
      } else if (belowRow < this.rows && !this._isSolidAt(frontCol, belowRow) && !this._isPlatformAt(frontCol, belowRow)) {
        // 땅 끝에 도달하면 돌아서기 (먼저 땅에 서 있을 때만)
        var centerCol = Math.floor((en.x + en.w / 2) / TILE);
        if (this._isSolidAt(centerCol, belowRow) || this._isPlatformAt(centerCol, belowRow)) {
          en.vx *= -1;
        }
      }

      en.y += en.vy * dt;
      var enBottomRow = Math.floor((en.y + en.h) / TILE);
      var enLeftCol = Math.floor((en.x + 2) / TILE);
      var enRightCol = Math.floor((en.x + en.w - 2) / TILE);
      for (var c = enLeftCol; c <= enRightCol; c++) {
        if (this._isSolidAt(c, enBottomRow) || this._isPlatformAt(c, enBottomRow)) {
          en.y = enBottomRow * TILE - en.h;
          en.vy = 0;
          break;
        }
      }

      // 주인공과 충돌 체크
      if (
        h.x < en.x + en.w - 2 &&
        h.x + h.w > en.x + 2 &&
        h.y < en.y + en.h - 2 &&
        h.y + h.h > en.y + 2
      ) {
        var stompAllowed = this.project.rules.enemyHit === 'damage_stomp';
        var fromAbove = h.vy > 20 && (h.y + h.h - en.y) <= 15;
        if (stompAllowed && fromAbove) {
          en.alive = false;
          h.vy = jumpVel * 0.7;
          this.score += 150;
          this._addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f97316', 14);
          this._addPopup(en.x, en.y - 8, '💥 처치 +150!', '#fde047');
          if (global.SoundEngine) global.SoundEngine.playStomp();
        } else {
          var knockDir = h.x + h.w / 2 < en.x + en.w / 2 ? -1 : 1;
          this._damageHero(knockDir);
        }
      }
    }
  };

  MiniPlatformerEngine.prototype.render = function () {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;
    var theme = (global.GameData.THEMES[this.project.theme]) || global.GameData.THEMES.meadow;

    ctx.save();
    if (this.shakeTimer > 0) {
      ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }

    drawThemeBackground(ctx, w, h, theme, this.elapsed);

    var flagLocked = this.mode !== 'sandbox' &&
      this.mode !== 'qa' &&
      this.project.goal === 'collect_all' &&
      this.collectedCount < this.totalCollectibles;

    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        var t = this.map[r][c];
        if (t !== 0) {
          drawTile(ctx, t, c * TILE, r * TILE, TILE, theme, this.project.sprites, this.elapsed, flagLocked);
        }
      }
    }

    // 보물 그리기
    for (var i = 0; i < this.collectibles.length; i++) {
      var item = this.collectibles[i];
      if (item.collected) continue;
      var bob = Math.sin(this.elapsed * 4.5 + i) * 3;
      drawSpriteGrid(ctx, this.project.sprites.collectible, item.x, item.y + bob, item.w, item.h, false);
    }

    // 몬스터 그리기
    for (var e = 0; e < this.enemies.length; e++) {
      var en = this.enemies[e];
      if (!en.alive) continue;
      drawSpriteGrid(ctx, this.project.sprites.enemy, en.x, en.y, en.w, en.h, en.vx < 0);
    }

    // 주인공 그리기 (무적 시 깜박임)
    var showHero = this.hero.invincibleTimer <= 0 || Math.floor(this.elapsed * 16) % 2 === 0;
    if (showHero) {
      var walkHop = this.hero.onGround && Math.abs(this.hero.vx) > 20
        ? Math.abs(Math.sin(this.hero.walkPhase)) * -2.5
        : 0;
      if (this.hero.speedBoostTimer > 0) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.arc(this.hero.x + this.hero.w / 2, this.hero.y + this.hero.h / 2, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      drawSpriteGrid(
        ctx,
        this.project.sprites.hero,
        this.hero.x - 2,
        this.hero.y - 2 + walkHop,
        this.hero.w + 4,
        this.hero.h + 2,
        this.hero.facingLeft
      );
    }

    // 파티클 그리기
    for (var p = 0; p < this.particles.length; p++) {
      var pt = this.particles[p];
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    }
    ctx.globalAlpha = 1;

    // 텍스트 팝업
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    for (var u = 0; u < this.popups.length; u++) {
      var pp = this.popups[u];
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillText(pp.text, pp.x + 11, pp.y + 1);
      ctx.fillStyle = pp.color;
      ctx.fillText(pp.text, pp.x + 10, pp.y);
    }
    ctx.textAlign = 'left';

    // QA 상태 배너
    if (this.mode === 'qa' && this.statusBanner) {
      ctx.fillStyle = this.qaFixed ? 'rgba(5, 150, 105, 0.88)' : 'rgba(220, 38, 38, 0.88)';
      ctx.fillRect(10, 10, w - 20, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(this.statusBanner, 18, 29);
    }

    ctx.restore();
  };

  MiniPlatformerEngine.drawSpriteGrid = drawSpriteGrid;
  MiniPlatformerEngine.renderSpriteToCanvas = renderSpriteToCanvas;
  MiniPlatformerEngine.drawThemeBackground = drawThemeBackground;
  MiniPlatformerEngine.drawTile = drawTile;
  MiniPlatformerEngine.TILE = TILE;

  global.MiniPlatformerEngine = MiniPlatformerEngine;
})(window);
