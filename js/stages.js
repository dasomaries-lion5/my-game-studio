/**
 * 나의 첫 게임 제작소 - 7개 제작 단계 UI 및 인터랙션 구현
 */
(function (global) {
  'use strict';

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ========================================================================
     Stage 1: 게임 기획하기
     ======================================================================== */
  function renderPlanStage(root, ctx) {
    var project = ctx.project;

    function renderCoverPreview() {
      var theme = global.GameData.THEMES[project.theme] || global.GameData.THEMES.meadow;
      var goal = global.GameData.GOALS[project.goal] || global.GameData.GOALS.collect_all;
      var skyEl = root.querySelector('#gdd-cover-sky');
      var groundEl = root.querySelector('#gdd-cover-ground');
      var titleEl = root.querySelector('#gdd-cover-title');
      var goalTextEl = root.querySelector('#gdd-spec-goal');
      var themeTextEl = root.querySelector('#gdd-spec-theme');
      if (skyEl) {
        skyEl.style.background = 'linear-gradient(180deg, ' + theme.skyTop + ', ' + theme.skyBottom + ')';
      }
      if (groundEl) {
        groundEl.style.background = 'linear-gradient(180deg, ' + theme.groundTop + ' 35%, ' + theme.groundFill + ' 35%)';
      }
      if (titleEl) titleEl.textContent = project.title || '이름 없는 모험';
      if (goalTextEl) goalTextEl.textContent = goal.emoji + ' ' + goal.name;
      if (themeTextEl) themeTextEl.textContent = theme.emoji + ' ' + theme.name;

      var heroPreview = root.querySelector('#gdd-hero-canvas');
      var starPreview = root.querySelector('#gdd-star-canvas');
      if (heroPreview) {
        var hctx = heroPreview.getContext('2d');
        hctx.clearRect(0, 0, heroPreview.width, heroPreview.height);
        global.MiniPlatformerEngine.drawSpriteGrid(hctx, project.sprites.hero, 0, 0, 64, 64, false);
      }
      if (starPreview) {
        var sctx = starPreview.getContext('2d');
        sctx.clearRect(0, 0, starPreview.width, starPreview.height);
        global.MiniPlatformerEngine.drawSpriteGrid(sctx, project.sprites.collectible, 0, 0, 44, 44, false);
      }
    }

    var themeCardsHtml = Object.keys(global.GameData.THEMES).map(function (key) {
      var t = global.GameData.THEMES[key];
      var selected = project.theme === t.id ? 'is-selected' : '';
      return (
        '<button type="button" class="choice-card ' + selected + '" data-theme="' + t.id + '">' +
        '  <div class="theme-swatch" style="background:linear-gradient(180deg,' + t.skyTop + ',' + t.skyBottom + ')">' +
        '    <div class="theme-swatch-ground" style="background:linear-gradient(180deg,' + t.groundTop + ' 35%,' + t.groundFill + ' 35%)"></div>' +
        '  </div>' +
        '  <div class="choice-title">' + t.emoji + ' ' + escHtml(t.name) + '</div>' +
        '  <div class="choice-desc">' + escHtml(t.desc) + '</div>' +
        '</button>'
      );
    }).join('');

    var goalCardsHtml = Object.keys(global.GameData.GOALS).map(function (key) {
      var g = global.GameData.GOALS[key];
      var selected = project.goal === g.id ? 'is-selected' : '';
      return (
        '<button type="button" class="choice-card ' + selected + '" data-goal="' + g.id + '">' +
        '  <div class="choice-title">' + g.emoji + ' ' + escHtml(g.name) + '</div>' +
        '  <div class="choice-desc">' + escHtml(g.desc) + '</div>' +
        '</button>'
      );
    }).join('');

    root.innerHTML =
      '<div class="two-col-grid">' +
      '  <div class="card">' +
      '    <h2 class="card-title">1. 게임 제목과 컨셉 정하기</h2>' +
      '    <p class="card-subtitle">플레이어가 가장 먼저 보게 될 멋진 게임 제목을 지어 주세요.</p>' +
      '    <div class="title-input-row" style="margin-bottom:18px;">' +
      '      <input id="plan-title-input" class="text-input" type="text" maxlength="30" value="' + escHtml(project.title) + '" placeholder="예: 모험을 떠나는 고양이" />' +
      '      <button id="btn-random-title" class="btn btn-primary" type="button">🎲 랜덤 제목</button>' +
      '    </div>' +
      '    <h2 class="card-title">2. 게임 배경 세계 고르기</h2>' +
      '    <div class="option-grid-2" style="margin-bottom:18px;">' + themeCardsHtml + '</div>' +
      '    <h2 class="card-title">3. 승리 목표 정하기</h2>' +
      '    <div class="option-grid-3">' + goalCardsHtml + '</div>' +
      '  </div>' +
      '  <div class="card">' +
      '    <h2 class="card-title">📦 실시간 게임 패키지 표지 (기획서)</h2>' +
      '    <p class="card-subtitle">기획한 내용이 게임 박스 디자인으로 바로 나타나요!</p>' +
      '    <div class="gdd-box-art">' +
      '      <div id="gdd-cover-sky" class="gdd-cover-sky">' +
      '        <span class="gdd-cover-badge">INDIE GAME STUDIO EDITION</span>' +
      '        <h3 id="gdd-cover-title" class="gdd-cover-title"></h3>' +
      '        <div style="display:flex;align-items:flex-end;gap:14px;margin-top:4px;">' +
      '          <canvas id="gdd-hero-canvas" class="pixel-canvas" width="64" height="64"></canvas>' +
      '          <canvas id="gdd-star-canvas" class="pixel-canvas" width="44" height="44"></canvas>' +
      '        </div>' +
      '      </div>' +
      '      <div id="gdd-cover-ground" class="gdd-cover-ground"></div>' +
      '      <div class="gdd-spec-list">' +
      '        <div class="gdd-spec-row"><span><strong>장르</strong></span><span>2D 점프 어드벤처</span></div>' +
      '        <div class="gdd-spec-row"><span><strong>배경 테마</strong></span><span id="gdd-spec-theme"></span></div>' +
      '        <div class="gdd-spec-row"><span><strong>클리어 목표</strong></span><span id="gdd-spec-goal"></span></div>' +
      '        <div class="gdd-spec-row" style="border-bottom:none;"><span><strong>제작자</strong></span><span>' + escHtml(project.developerName) + '</span></div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    var titleInput = root.querySelector('#plan-title-input');
    titleInput.addEventListener('input', function () {
      project.title = titleInput.value;
      ctx.onProjectChange({ silent: true });
      renderCoverPreview();
    });

    root.querySelector('#btn-random-title').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      var list = global.GameData.RANDOM_TITLES;
      var next = list[Math.floor(Math.random() * list.length)];
      if (next === project.title) {
        next = list[(list.indexOf(next) + 1) % list.length];
      }
      project.title = next;
      titleInput.value = next;
      ctx.onProjectChange();
      renderCoverPreview();
    });

    root.querySelectorAll('[data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        project.theme = btn.getAttribute('data-theme');
        root.querySelectorAll('[data-theme]').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        ctx.onProjectChange();
        renderCoverPreview();
      });
    });

    root.querySelectorAll('[data-goal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        project.goal = btn.getAttribute('data-goal');
        root.querySelectorAll('[data-goal]').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        ctx.onProjectChange();
        renderCoverPreview();
      });
    });

    renderCoverPreview();
  }

  /* ========================================================================
     Stage 2: 픽셀 아트 그리기
     ======================================================================== */
  function renderArtStage(root, ctx) {
    var project = ctx.project;
    var activeCat = 'hero';
    var activeTool = 'pen'; // pen | eraser | fill
    var mirrorMode = false;
    var selectedColor = global.GameData.PALETTE[3];
    var undoStack = [];
    var isDrawing = false;
    var drawEraseMode = false;
    var previewRaf = null;
    var previewTime = 0;

    var CATEGORIES = [
      { key: 'hero', label: '🐱 주인공 캐릭터' },
      { key: 'enemy', label: '👾 몬스터' },
      { key: 'collectible', label: '⭐ 보물 아이템' }
    ];

    function pushUndo() {
      undoStack.push({
        cat: activeCat,
        grid: global.GameData.deepClone(project.sprites[activeCat])
      });
      if (undoStack.length > 25) undoStack.shift();
    }

    function floodFill(grid, startR, startC, targetColor, replacementColor) {
      if (targetColor === replacementColor) return;
      var queue = [[startR, startC]];
      var visited = {};
      while (queue.length > 0) {
        var cell = queue.shift();
        var r = cell[0];
        var c = cell[1];
        if (r < 0 || r >= 12 || c < 0 || c >= 12) continue;
        var key = r + ',' + c;
        if (visited[key]) continue;
        visited[key] = true;
        if (grid[r][c] !== targetColor) continue;
        grid[r][c] = replacementColor;
        queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
      }
    }

    function drawPixelBoard() {
      var canvas = root.querySelector('#pixel-editor-canvas');
      if (!canvas) return;
      var pctx = canvas.getContext('2d');
      var cellSize = canvas.width / 12;
      var grid = project.sprites[activeCat];

      pctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var r = 0; r < 12; r++) {
        for (var c = 0; c < 12; c++) {
          var x = c * cellSize;
          var y = r * cellSize;
          pctx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#f1f5f9';
          pctx.fillRect(x, y, cellSize, cellSize);
          if (grid[r][c]) {
            pctx.fillStyle = grid[r][c];
            pctx.fillRect(x, y, cellSize, cellSize);
          }
          pctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          pctx.lineWidth = 1;
          pctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        }
      }
      if (mirrorMode) {
        pctx.strokeStyle = 'rgba(236, 72, 153, 0.75)';
        pctx.lineWidth = 2;
        pctx.setLineDash([5, 4]);
        pctx.beginPath();
        pctx.moveTo(canvas.width / 2, 0);
        pctx.lineTo(canvas.width / 2, canvas.height);
        pctx.stroke();
        pctx.setLineDash([]);
      }
    }

    function renderPresetsRow() {
      var wrap = root.querySelector('#art-presets-row');
      if (!wrap) return;
      var list = global.GameData.SPRITE_PRESETS[activeCat] || [];
      wrap.innerHTML = '';
      list.forEach(function (preset, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset-btn';
        var mini = global.MiniPlatformerEngine.renderSpriteToCanvas(
          global.GameData.getSpritePresetGrid(activeCat, idx),
          24
        );
        mini.className = 'pixel-canvas';
        btn.appendChild(mini);
        var span = document.createElement('span');
        span.textContent = preset.name;
        btn.appendChild(span);
        btn.addEventListener('click', function () {
          global.SoundEngine.playUiClick();
          pushUndo();
          project.sprites[activeCat] = global.GameData.getSpritePresetGrid(activeCat, idx);
          project.meta.artEdited = true;
          ctx.onProjectChange();
          drawPixelBoard();
        });
        wrap.appendChild(btn);
      });
    }

    function buildUi() {
      var tabsHtml = CATEGORIES.map(function (cat) {
        return '<button type="button" class="btn ' + (activeCat === cat.key ? 'btn-active' : '') + '" data-cat="' + cat.key + '">' + cat.label + '</button>';
      }).join('');

      var swatchesHtml = global.GameData.PALETTE.map(function (hex) {
        return '<button type="button" class="color-swatch-btn ' + (selectedColor === hex ? 'is-selected' : '') + '" data-color="' + hex + '" style="background:' + hex + '" aria-label="색상 ' + hex + '"></button>';
      }).join('');

      root.innerHTML =
        '<div class="two-col-grid">' +
        '  <div class="card">' +
        '    <div class="art-tabs">' + tabsHtml + '</div>' +
        '    <div class="pixel-studio-wrap">' +
        '      <div class="pixel-board-box">' +
        '        <canvas id="pixel-editor-canvas" class="pixel-canvas" width="312" height="312"></canvas>' +
        '        <div style="font-size:0.8rem;color:#64748b;">클릭/드래그로 그리기 · 오른쪽 클릭으로 지우기</div>' +
        '      </div>' +
        '      <div class="tool-palette-col">' +
        '        <div>' +
        '          <div style="font-weight:800;font-size:0.88rem;margin-bottom:6px;">그리기 도구</div>' +
        '          <div class="tool-btn-grid">' +
        '            <button type="button" class="btn btn-sm ' + (activeTool === 'pen' ? 'btn-active' : '') + '" data-tool="pen">✏️ 펜</button>' +
        '            <button type="button" class="btn btn-sm ' + (activeTool === 'eraser' ? 'btn-active' : '') + '" data-tool="eraser">🧹 지우개</button>' +
        '            <button type="button" class="btn btn-sm ' + (activeTool === 'fill' ? 'btn-active' : '') + '" data-tool="fill">🪣 채우기</button>' +
        '            <button type="button" id="btn-mirror-toggle" class="btn btn-sm ' + (mirrorMode ? 'btn-active' : '') + '">🪞 좌우대칭</button>' +
        '            <button type="button" id="btn-pixel-undo" class="btn btn-sm">↩️ 실행취소</button>' +
        '            <button type="button" id="btn-pixel-clear" class="btn btn-sm">🗑️ 비우기</button>' +
        '          </div>' +
        '        </div>' +
        '        <div>' +
        '          <div style="font-weight:800;font-size:0.88rem;margin-bottom:6px;">색상 팔레트 (16색)</div>' +
        '          <div class="color-palette-grid">' + swatchesHtml + '</div>' +
        '        </div>' +
        '        <div>' +
        '          <div style="font-weight:800;font-size:0.88rem;margin-bottom:6px;">예쁜 도안 불러와서 꾸미기</div>' +
        '          <div id="art-presets-row" class="preset-row"></div>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="card">' +
        '    <h2 class="card-title">🎬 움직이는 게임 속 모습 미리보기</h2>' +
        '    <p class="card-subtitle">방금 그린 픽셀 아트가 실제 게임 배경에서 움직여요!</p>' +
        '    <div class="art-live-preview-box">' +
        '      <canvas id="art-preview-canvas" width="360" height="220"></canvas>' +
        '      <div style="background:#f8fafc;border:1px solid #dbe3f0;border-radius:12px;padding:12px;font-size:0.86rem;color:#334155;">' +
        '        <strong>💡 픽셀 아트 꿀팁!</strong><br/>' +
        '        • 검은색 테두리를 먼저 둘러주면 캐릭터가 배경에서 훨씬 뚜렷하게 보여요.<br/>' +
        '        • <b>🪞 좌우대칭</b>을 켜면 양쪽이 똑같은 캐릭터를 순식간에 그릴 수 있어요!' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      renderPresetsRow();
      drawPixelBoard();
      bindEvents();
    }

    function applyCellPaint(clientX, clientY, isRightClick) {
      var canvas = root.querySelector('#pixel-editor-canvas');
      if (!canvas) return;
      var rect = canvas.getBoundingClientRect();
      var x = (clientX - rect.left) * (canvas.width / rect.width);
      var y = (clientY - rect.top) * (canvas.height / rect.height);
      var c = Math.floor(x / (canvas.width / 12));
      var r = Math.floor(y / (canvas.height / 12));
      if (r < 0 || r >= 12 || c < 0 || c >= 12) return;

      var grid = project.sprites[activeCat];
      if (activeTool === 'fill' && !isRightClick) {
        var target = grid[r][c];
        floodFill(grid, r, c, target, selectedColor);
        if (mirrorMode) {
          floodFill(grid, r, 11 - c, grid[r][11 - c], selectedColor);
        }
      } else {
        var color = (isRightClick || activeTool === 'eraser') ? null : selectedColor;
        grid[r][c] = color;
        if (mirrorMode) {
          grid[r][11 - c] = color;
        }
      }
      project.meta.artEdited = true;
      ctx.onProjectChange({ silent: true });
      drawPixelBoard();
    }

    function bindEvents() {
      root.querySelectorAll('[data-cat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          global.SoundEngine.playUiClick();
          activeCat = btn.getAttribute('data-cat');
          buildUi();
        });
      });

      root.querySelectorAll('[data-tool]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          global.SoundEngine.playUiClick();
          activeTool = btn.getAttribute('data-tool');
          root.querySelectorAll('[data-tool]').forEach(function (b) { b.classList.remove('btn-active'); });
          btn.classList.add('btn-active');
        });
      });

      root.querySelector('#btn-mirror-toggle').addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        mirrorMode = !mirrorMode;
        this.classList.toggle('btn-active', mirrorMode);
        drawPixelBoard();
      });

      root.querySelector('#btn-pixel-undo').addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        if (undoStack.length === 0) return;
        var prev = undoStack.pop();
        project.sprites[prev.cat] = prev.grid;
        activeCat = prev.cat;
        ctx.onProjectChange();
        buildUi();
      });

      root.querySelector('#btn-pixel-clear').addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        pushUndo();
        var empty = [];
        for (var r = 0; r < 12; r++) {
          empty.push(new Array(12).fill(null));
        }
        project.sprites[activeCat] = empty;
        project.meta.artEdited = true;
        ctx.onProjectChange();
        drawPixelBoard();
      });

      root.querySelectorAll('[data-color]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedColor = btn.getAttribute('data-color');
          if (activeTool === 'eraser') {
            activeTool = 'pen';
            root.querySelectorAll('[data-tool]').forEach(function (b) {
              b.classList.toggle('btn-active', b.getAttribute('data-tool') === 'pen');
            });
          }
          root.querySelectorAll('[data-color]').forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
        });
      });

      var canvas = root.querySelector('#pixel-editor-canvas');
      canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      canvas.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        pushUndo();
        isDrawing = true;
        drawEraseMode = e.button === 2;
        if (canvas.setPointerCapture) {
          try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        }
        applyCellPaint(e.clientX, e.clientY, drawEraseMode);
      });
      canvas.addEventListener('pointermove', function (e) {
        if (!isDrawing || activeTool === 'fill') return;
        applyCellPaint(e.clientX, e.clientY, drawEraseMode);
      });
      function stopDraw() {
        if (isDrawing) {
          isDrawing = false;
          ctx.onProjectChange();
        }
      }
      canvas.addEventListener('pointerup', stopDraw);
      canvas.addEventListener('pointercancel', stopDraw);
    }

    function animatePreview(ts) {
      var prevCanvas = root.querySelector('#art-preview-canvas');
      if (!prevCanvas) return;
      previewTime = ts / 1000;
      var pctx = prevCanvas.getContext('2d');
      var w = prevCanvas.width;
      var h = prevCanvas.height;
      var theme = global.GameData.THEMES[project.theme] || global.GameData.THEMES.meadow;

      global.MiniPlatformerEngine.drawThemeBackground(pctx, w, h, theme, previewTime);
      // 땅 그리기
      for (var c = 0; c < 12; c++) {
        global.MiniPlatformerEngine.drawTile(pctx, 1, c * 32, h - 36, 32, theme, project.sprites, previewTime, false);
      }
      // 주인공 걷기 & 점프 애니메이션
      var heroX = 56 + Math.sin(previewTime * 1.4) * 32;
      var heroHop = Math.abs(Math.sin(previewTime * 4.5)) * 18;
      var facingLeft = Math.cos(previewTime * 1.4) < 0;
      global.MiniPlatformerEngine.drawSpriteGrid(pctx, project.sprites.hero, heroX, h - 76 - heroHop, 40, 40, facingLeft);

      // 보물 반짝 위아래
      var bob = Math.sin(previewTime * 4) * 6;
      global.MiniPlatformerEngine.drawSpriteGrid(pctx, project.sprites.collectible, 168, h - 102 + bob, 32, 32, false);

      // 몬스터 순찰
      var enemyX = 250 + Math.cos(previewTime * 1.8) * 34;
      global.MiniPlatformerEngine.drawSpriteGrid(pctx, project.sprites.enemy, enemyX, h - 72, 36, 36, Math.sin(previewTime * 1.8) > 0);

      previewRaf = global.requestAnimationFrame(animatePreview);
    }

    buildUi();
    previewRaf = global.requestAnimationFrame(animatePreview);

    return function cleanup() {
      if (previewRaf) global.cancelAnimationFrame(previewRaf);
    };
  }

  /* ========================================================================
     Stage 3: 스테이지 맵 만들기
     ======================================================================== */
  function renderLevelStage(root, ctx) {
    var project = ctx.project;
    var selectedTile = 1;
    var isTesting = false;
    var testEngine = null;
    var isPainting = false;
    var erasePaint = false;
    var editorRaf = null;

    function countMapStats() {
      var hasSpawn = false;
      var hasGoal = false;
      var stars = 0;
      var enemies = 0;
      for (var r = 0; r < 12; r++) {
        for (var c = 0; c < 24; c++) {
          var t = project.level[r][c];
          if (t === 7) hasSpawn = true;
          if (t === 8) hasGoal = true;
          if (t === 6) stars++;
          if (t === 5) enemies++;
        }
      }
      return { hasSpawn: hasSpawn, hasGoal: hasGoal, stars: stars, enemies: enemies };
    }

    function updateChecklist() {
      var box = root.querySelector('#level-checklist');
      if (!box) return;
      var s = countMapStats();
      box.innerHTML =
        '<span class="check-pill ' + (s.hasSpawn ? 'ok' : 'warn') + '">' + (s.hasSpawn ? '✓ 출발점 있음' : '⚠ 출발점(🚩) 배치 필요') + '</span>' +
        '<span class="check-pill ' + (s.hasGoal ? 'ok' : 'warn') + '">' + (s.hasGoal ? '✓ 도착 깃발 있음' : '⚠ 깃발(🏁) 배치 필요') + '</span>' +
        '<span class="check-pill ok">⭐ 보물 ' + s.stars + '개</span>' +
        '<span class="check-pill ok">👾 몬스터 ' + s.enemies + '마리</span>';
    }

    function drawEditorCanvas(ts) {
      if (isTesting) return;
      var canvas = root.querySelector('#level-editor-canvas');
      if (!canvas) return;
      var lctx = canvas.getContext('2d');
      var timeSec = (ts || 0) / 1000;
      var theme = global.GameData.THEMES[project.theme] || global.GameData.THEMES.meadow;

      global.MiniPlatformerEngine.drawThemeBackground(lctx, canvas.width, canvas.height, theme, timeSec);

      // 그리드 선
      lctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      lctx.lineWidth = 1;
      for (var c = 0; c <= 24; c++) {
        lctx.beginPath();
        lctx.moveTo(c * 32, 0);
        lctx.lineTo(c * 32, 384);
        lctx.stroke();
      }
      for (var r = 0; r <= 12; r++) {
        lctx.beginPath();
        lctx.moveTo(0, r * 32);
        lctx.lineTo(768, r * 32);
        lctx.stroke();
      }

      for (var r2 = 0; r2 < 12; r2++) {
        for (var c2 = 0; c2 < 24; c2++) {
          var t = project.level[r2][c2];
          if (t !== 0) {
            global.MiniPlatformerEngine.drawTile(lctx, t, c2 * 32, r2 * 32, 32, theme, project.sprites, timeSec, false);
          }
        }
      }

      editorRaf = global.requestAnimationFrame(drawEditorCanvas);
    }

    function paintTileAt(clientX, clientY, forceErase) {
      var canvas = root.querySelector('#level-editor-canvas');
      if (!canvas) return;
      var rect = canvas.getBoundingClientRect();
      var x = (clientX - rect.left) * (canvas.width / rect.width);
      var y = (clientY - rect.top) * (canvas.height / rect.height);
      var col = Math.floor(x / 32);
      var row = Math.floor(y / 32);
      if (row < 0 || row >= 12 || col < 0 || col >= 24) return;

      var val = forceErase ? 0 : selectedTile;
      if (val === 7 || val === 8) {
        // 출발점과 깃발은 맵에 1개만 유지
        for (var r = 0; r < 12; r++) {
          for (var c = 0; c < 24; c++) {
            if (project.level[r][c] === val) {
              project.level[r][c] = 0;
            }
          }
        }
      }
      project.level[row][col] = val;
      project.meta.levelEdited = true;
      ctx.onProjectChange({ silent: true });
      updateChecklist();
    }

    function stopTestEngine() {
      if (testEngine) {
        testEngine.destroy();
        testEngine = null;
      }
    }

    function toggleTestMode(enable) {
      isTesting = enable;
      stopTestEngine();
      if (editorRaf) {
        global.cancelAnimationFrame(editorRaf);
        editorRaf = null;
      }

      var editCanvas = root.querySelector('#level-editor-canvas');
      var testCanvas = root.querySelector('#level-test-canvas');
      var paletteWrap = root.querySelector('#level-palette-wrap');
      var testBtn = root.querySelector('#btn-toggle-test');
      var restartBtn = root.querySelector('#btn-restart-test');
      var hintEl = root.querySelector('#level-mode-hint');

      if (isTesting) {
        editCanvas.classList.add('hidden');
        testCanvas.classList.remove('hidden');
        paletteWrap.classList.add('hidden');
        restartBtn.classList.remove('hidden');
        testBtn.textContent = '✏️ 맵 편집으로 돌아가기';
        testBtn.classList.remove('btn-success');
        testBtn.classList.add('btn-warning');
        hintEl.textContent = '테스트 중! 방향키/WASD로 이동하고 스페이스바로 점프해 보세요.';

        testEngine = new global.MiniPlatformerEngine(testCanvas, project, {
          mode: 'test',
          onWin: function () {
            ctx.toast('🎉 테스트 코스 클리어 성공! 정말 멋진 맵이에요!', 'is-success');
            global.setTimeout(function () {
              if (testEngine) testEngine.reset();
            }, 1300);
          },
          onLose: function () {
            ctx.toast('💡 아차! 다시 시도해 보거나 발판을 고쳐 보세요.', 'is-warn');
            global.setTimeout(function () {
              if (testEngine) testEngine.reset();
            }, 1100);
          }
        });
        testEngine.start();
      } else {
        testCanvas.classList.add('hidden');
        editCanvas.classList.remove('hidden');
        paletteWrap.classList.remove('hidden');
        restartBtn.classList.add('hidden');
        testBtn.textContent = '▶ 지금 바로 테스트!';
        testBtn.classList.remove('btn-warning');
        testBtn.classList.add('btn-success');
        hintEl.textContent = '타일을 고른 뒤 맵을 클릭하거나 드래그해서 그려 보세요. (오른쪽 클릭 = 지우개)';
        editorRaf = global.requestAnimationFrame(drawEditorCanvas);
      }
    }

    var tilesHtml = global.GameData.TILE_TYPES.map(function (t) {
      return '<button type="button" class="tile-btn ' + (selectedTile === t.id ? 'is-selected' : '') + '" data-tile="' + t.id + '" title="' + escHtml(t.desc) + '">' + t.emoji + ' ' + escHtml(t.name) + '</button>';
    }).join('');

    var templatesHtml = Object.keys(global.GameData.LEVEL_TEMPLATES).map(function (key) {
      var tpl = global.GameData.LEVEL_TEMPLATES[key];
      return '<button type="button" class="btn btn-sm" data-template="' + tpl.id + '">' + escHtml(tpl.name) + '</button>';
    }).join('');

    root.innerHTML =
      '<div class="card">' +
      '  <div class="level-toolbar">' +
      '    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
      '      <strong style="font-size:0.9rem;">기본 맵 불러오기:</strong>' +
      templatesHtml +
      '    </div>' +
      '    <div style="display:flex;align-items:center;gap:8px;">' +
      '      <button id="btn-restart-test" class="btn hidden" type="button">🔄 테스트 다시 시작</button>' +
      '      <button id="btn-toggle-test" class="btn btn-success" type="button">▶ 지금 바로 테스트!</button>' +
      '    </div>' +
      '  </div>' +
      '  <div id="level-palette-wrap" class="tile-palette">' + tilesHtml + '</div>' +
      '  <div class="level-canvas-wrap">' +
      '    <canvas id="level-editor-canvas" width="768" height="384"></canvas>' +
      '    <canvas id="level-test-canvas" class="hidden" width="768" height="384"></canvas>' +
      '  </div>' +
      '  <div class="level-bottom-bar">' +
      '    <div id="level-checklist" class="checklist-pills"></div>' +
      '    <div id="level-mode-hint" style="font-size:0.86rem;color:#64748b;font-weight:600;">타일을 고른 뒤 맵을 클릭하거나 드래그해서 그려 보세요. (오른쪽 클릭 = 지우개)</div>' +
      '  </div>' +
      '</div>';

    root.querySelectorAll('[data-tile]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        selectedTile = Number(btn.getAttribute('data-tile'));
        root.querySelectorAll('[data-tile]').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
      });
    });

    root.querySelectorAll('[data-template]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        var key = btn.getAttribute('data-template');
        var tpl = global.GameData.LEVEL_TEMPLATES[key];
        if (!tpl) return;
        project.level = global.GameData.parseLevelMap(tpl.rows);
        project.meta.levelEdited = true;
        ctx.onProjectChange();
        updateChecklist();
        if (isTesting && testEngine) {
          testEngine.reset();
        }
        ctx.toast('🗺️ "' + tpl.name + '" 맵을 불러왔어요!');
      });
    });

    root.querySelector('#btn-toggle-test').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      toggleTestMode(!isTesting);
    });

    root.querySelector('#btn-restart-test').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      if (testEngine) testEngine.reset();
    });

    var editCanvas = root.querySelector('#level-editor-canvas');
    editCanvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    editCanvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      isPainting = true;
      erasePaint = e.button === 2;
      if (editCanvas.setPointerCapture) {
        try { editCanvas.setPointerCapture(e.pointerId); } catch (_) {}
      }
      paintTileAt(e.clientX, e.clientY, erasePaint);
    });
    editCanvas.addEventListener('pointermove', function (e) {
      if (!isPainting) return;
      paintTileAt(e.clientX, e.clientY, erasePaint);
    });
    function finishPaint() {
      if (isPainting) {
        isPainting = false;
        ctx.onProjectChange();
      }
    }
    editCanvas.addEventListener('pointerup', finishPaint);
    editCanvas.addEventListener('pointercancel', finishPaint);

    updateChecklist();
    editorRaf = global.requestAnimationFrame(drawEditorCanvas);

    return function cleanup() {
      stopTestEngine();
      if (editorRaf) global.cancelAnimationFrame(editorRaf);
    };
  }

  /* ========================================================================
     Stage 4: 물리 & 규칙 코딩하기
     ======================================================================== */
  function renderCodeStage(root, ctx) {
    var project = ctx.project;
    var rules = project.rules;
    var sandboxEngine = null;

    function updateCodePreview() {
      var panel = root.querySelector('#code-preview-panel');
      if (!panel) return;
      var eRule = global.GameData.RULES_CONFIG.enemyHit.find(function (x) { return x.id === rules.enemyHit; });
      var cRule = global.GameData.RULES_CONFIG.collectEffect.find(function (x) { return x.id === rules.collectEffect; });
      var sRule = global.GameData.RULES_CONFIG.springPower.find(function (x) { return x.id === rules.springPower; });

      panel.innerHTML =
        '<span class="code-cmt">// 내가 코딩한 게임 규칙 코드</span>\n' +
        '<span class="code-kw">const</span> moveSpeed = <span class="code-val">' + rules.speed + '</span>;\n' +
        '<span class="code-kw">const</span> jumpPower = <span class="code-val">' + rules.jumpPower + '</span>;\n' +
        '<span class="code-kw">const</span> gravity = <span class="code-val">' + rules.gravity + '</span>;\n' +
        '<span class="code-kw">const</span> doubleJump = <span class="code-val">' + (rules.doubleJump ? 'true' : 'false') + '</span>;\n' +
        '<span class="code-kw">const</span> maxHearts = <span class="code-val">' + rules.maxHearts + '</span>;\n\n' +
        '<span class="code-kw">when</span> (몬스터와_충돌) {\n  ' + escHtml(eRule ? eRule.code : '') + '\n}\n' +
        '<span class="code-kw">when</span> (보물_획득) {\n  ' + escHtml(cRule ? cRule.code : '') + '\n}\n' +
        '<span class="code-kw">when</span> (점프대_밟음) {\n  ' + escHtml(sRule ? sRule.code : '') + '\n}';
    }

    function renderScratchGroup(title, blockClass, field, options) {
      var buttonsHtml = options.map(function (opt) {
        var sel = rules[field] === opt.id ? 'is-selected' : '';
        return '<button type="button" class="scratch-choice-btn ' + sel + '" data-rule-field="' + field + '" data-rule-val="' + opt.id + '">' + escHtml(opt.label) + '</button>';
      }).join('');
      return (
        '<div class="scratch-block ' + blockClass + '">' +
        '  <div class="scratch-block-header">' + title + '</div>' +
        '  <div class="scratch-choice-list">' + buttonsHtml + '</div>' +
        '</div>'
      );
    }

    root.innerHTML =
      '<div class="two-col-equal">' +
      '  <div class="card">' +
      '    <h2 class="card-title">⚙️ 주인공 움직임(물리) 코딩</h2>' +
      '    <div class="slider-group">' +
      '      <div class="slider-label-row"><span>🏃 이동 속도 (Speed)</span><span id="val-speed" class="slider-val-badge">' + rules.speed + '</span></div>' +
      '      <input id="range-speed" class="range-input" type="range" min="1" max="10" value="' + rules.speed + '" />' +
      '    </div>' +
      '    <div class="slider-group">' +
      '      <div class="slider-label-row"><span>🦘 점프 높이 (Jump)</span><span id="val-jump" class="slider-val-badge">' + rules.jumpPower + '</span></div>' +
      '      <input id="range-jump" class="range-input" type="range" min="1" max="10" value="' + rules.jumpPower + '" />' +
      '    </div>' +
      '    <div class="slider-group">' +
      '      <div class="slider-label-row"><span>🍎 중력 세기 (Gravity)</span><span id="val-gravity" class="slider-val-badge">' + rules.gravity + '</span></div>' +
      '      <input id="range-gravity" class="range-input" type="range" min="1" max="10" value="' + rules.gravity + '" />' +
      '    </div>' +
      '    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">' +
      '      <button id="btn-double-jump" type="button" class="btn ' + (rules.doubleJump ? 'btn-active' : '') + '">✨ 이단 점프: ' + (rules.doubleJump ? 'ON' : 'OFF') + '</button>' +
      '      <div style="display:flex;align-items:center;gap:6px;">' +
      '        <strong style="font-size:0.88rem;">❤️ 하트:</strong>' +
      '        <button type="button" class="btn btn-sm ' + (rules.maxHearts === 1 ? 'btn-active' : '') + '" data-hearts="1">1개</button>' +
      '        <button type="button" class="btn btn-sm ' + (rules.maxHearts === 3 ? 'btn-active' : '') + '" data-hearts="3">3개</button>' +
      '        <button type="button" class="btn btn-sm ' + (rules.maxHearts === 5 ? 'btn-active' : '') + '" data-hearts="5">5개</button>' +
      '      </div>' +
      '    </div>' +
      '    <h2 class="card-title">🧩 이벤트 규칙 블록 코딩</h2>' +
      renderScratchGroup('👾 만약 [몬스터]에 닿았을 때:', 'block-red', 'enemyHit', global.GameData.RULES_CONFIG.enemyHit) +
      renderScratchGroup('⭐ 만약 [보물]을 먹었을 때:', 'block-amber', 'collectEffect', global.GameData.RULES_CONFIG.collectEffect) +
      renderScratchGroup('🌀 만약 [점프대]를 밟았을 때:', 'block-sky', 'springPower', global.GameData.RULES_CONFIG.springPower) +
      '  </div>' +
      '  <div class="card">' +
      '    <h2 class="card-title">🧪 실시간 물리 테스트 놀이터</h2>' +
      '    <p class="card-subtitle">왼쪽 값을 바꾸고 바로 아래에서 점프하며 변화를 실험해 보세요! (WASD / 스페이스바)</p>' +
      '    <canvas id="sandbox-canvas" width="512" height="256"></canvas>' +
      '    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap;gap:8px;">' +
      '      <div class="touch-controls">' +
      '        <button type="button" class="touch-btn" id="sb-left">◀</button>' +
      '        <button type="button" class="touch-btn" id="sb-right">▶</button>' +
      '        <button type="button" class="touch-btn touch-jump" id="sb-jump">점프!</button>' +
      '      </div>' +
      '      <button type="button" class="btn btn-sm" id="sb-reset">🔄 위치 초기화</button>' +
      '    </div>' +
      '    <pre id="code-preview-panel" class="code-preview-panel"></pre>' +
      '  </div>' +
      '</div>';

    var sandboxCanvas = root.querySelector('#sandbox-canvas');
    sandboxEngine = new global.MiniPlatformerEngine(sandboxCanvas, project, {
      mode: 'sandbox'
    });
    sandboxEngine.start();

    function bindRange(id, valId, field) {
      var input = root.querySelector(id);
      var badge = root.querySelector(valId);
      input.addEventListener('input', function () {
        rules[field] = Number(input.value);
        badge.textContent = rules[field];
        project.meta.codeEdited = true;
        ctx.onProjectChange({ silent: true });
        updateCodePreview();
      });
      input.addEventListener('change', function () {
        input.blur();
        ctx.onProjectChange();
      });
    }

    bindRange('#range-speed', '#val-speed', 'speed');
    bindRange('#range-jump', '#val-jump', 'jumpPower');
    bindRange('#range-gravity', '#val-gravity', 'gravity');

    root.querySelector('#btn-double-jump').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      rules.doubleJump = !rules.doubleJump;
      this.textContent = '✨ 이단 점프: ' + (rules.doubleJump ? 'ON' : 'OFF');
      this.classList.toggle('btn-active', rules.doubleJump);
      project.meta.codeEdited = true;
      ctx.onProjectChange();
      updateCodePreview();
    });

    root.querySelectorAll('[data-hearts]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        rules.maxHearts = Number(btn.getAttribute('data-hearts'));
        root.querySelectorAll('[data-hearts]').forEach(function (b) { b.classList.remove('btn-active'); });
        btn.classList.add('btn-active');
        project.meta.codeEdited = true;
        if (sandboxEngine) sandboxEngine.hero.hearts = rules.maxHearts;
        ctx.onProjectChange();
        updateCodePreview();
      });
    });

    root.querySelectorAll('[data-rule-field]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        var field = btn.getAttribute('data-rule-field');
        var val = btn.getAttribute('data-rule-val');
        rules[field] = val;
        root.querySelectorAll('[data-rule-field="' + field + '"]').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        project.meta.codeEdited = true;
        ctx.onProjectChange();
        updateCodePreview();
      });
    });

    function bindVirtualBtn(sel, key) {
      var el = root.querySelector(sel);
      if (!el) return;
      el.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        sandboxEngine.setVirtualInput(key, true);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        el.addEventListener(ev, function () {
          sandboxEngine.setVirtualInput(key, false);
        });
      });
    }
    bindVirtualBtn('#sb-left', 'left');
    bindVirtualBtn('#sb-right', 'right');
    bindVirtualBtn('#sb-jump', 'jump');

    root.querySelector('#sb-reset').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      if (sandboxEngine) sandboxEngine.reset();
    });

    updateCodePreview();

    return function cleanup() {
      if (sandboxEngine) sandboxEngine.destroy();
    };
  }

  /* ========================================================================
     Stage 5: 사운드 & 배경음악
     ======================================================================== */
  function renderSoundStage(root, ctx) {
    var project = ctx.project;
    var audio = project.audio;
    var isPlaying = false;
    var currentStep = -1;

    function highlightPlayhead(step) {
      currentStep = step;
      root.querySelectorAll('.seq-cell').forEach(function (cell) {
        var c = Number(cell.getAttribute('data-col'));
        cell.classList.toggle('is-playhead', isPlaying && c === currentStep);
      });
    }

    function togglePlay() {
      var btn = root.querySelector('#btn-bgm-toggle');
      if (isPlaying) {
        isPlaying = false;
        global.SoundEngine.stopBgm();
        highlightPlayhead(-1);
        if (btn) btn.textContent = '▶ 음악 재생';
      } else {
        isPlaying = true;
        if (btn) btn.textContent = '⏹ 음악 정지';
        global.SoundEngine.startBgm(audio, function (step) {
          highlightPlayhead(step);
        });
      }
    }

    function renderGrid() {
      var wrap = root.querySelector('#sequencer-grid');
      if (!wrap) return;
      wrap.innerHTML = '';
      global.GameData.BGM_NOTES.forEach(function (note, r) {
        var rowEl = document.createElement('div');
        rowEl.className = 'seq-row';
        var label = document.createElement('div');
        label.className = 'seq-note-label';
        label.textContent = note.name;
        rowEl.appendChild(label);

        for (var c = 0; c < 8; c++) {
          (function (rowIdx, colIdx) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'seq-cell ' + (audio.bgm[rowIdx][colIdx] ? 'is-on' : '');
            btn.setAttribute('data-row', rowIdx);
            btn.setAttribute('data-col', colIdx);
            btn.setAttribute('aria-label', note.name + ' ' + (colIdx + 1) + '박자');
            btn.addEventListener('click', function () {
              audio.bgm[rowIdx][colIdx] = !audio.bgm[rowIdx][colIdx];
              btn.classList.toggle('is-on', audio.bgm[rowIdx][colIdx]);
              if (audio.bgm[rowIdx][colIdx]) {
                global.SoundEngine.playNote(rowIdx, audio.timbre);
              }
              project.meta.soundEdited = true;
              ctx.onProjectChange();
            });
            rowEl.appendChild(btn);
          })(r, c);
        }
        wrap.appendChild(rowEl);
      });
    }

    function renderSfxGroup(title, key, options) {
      var btns = options.map(function (opt) {
        var sel = audio.sfx[key] === opt.id ? 'btn-active' : '';
        return '<button type="button" class="btn btn-sm ' + sel + '" data-sfx-key="' + key + '" data-sfx-val="' + opt.id + '">' + escHtml(opt.label) + '</button>';
      }).join('');
      return (
        '<div class="sfx-group">' +
        '  <div class="sfx-group-title">' + title + '</div>' +
        '  <div class="sfx-btn-row">' + btns + '</div>' +
        '</div>'
      );
    }

    var presetBtns = Object.keys(global.GameData.BGM_PRESETS).map(function (key) {
      var p = global.GameData.BGM_PRESETS[key];
      return '<button type="button" class="btn btn-sm" data-bgm-preset="' + key + '">' + escHtml(p.name) + '</button>';
    }).join('');

    root.innerHTML =
      '<div class="two-col-grid">' +
      '  <div class="card">' +
      '    <h2 class="card-title">🎹 8박자 배경음악 작곡기</h2>' +
      '    <p class="card-subtitle">네모 칸을 눌러 나만의 게임 배경음악(BGM)을 만들어 보세요!</p>' +
      '    <div class="sequencer-controls">' +
      '      <div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '        <button id="btn-bgm-toggle" type="button" class="btn btn-primary">▶ 음악 재생</button>' +
      '        <button id="btn-bgm-random" type="button" class="btn">🎲 랜덤 작곡</button>' +
      '        <button id="btn-bgm-clear" type="button" class="btn">🧹 비우기</button>' +
      '      </div>' +
      '      <div style="display:flex;gap:6px;flex-wrap:wrap;">' + presetBtns + '</div>' +
      '    </div>' +
      '    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;">' +
      '      <label style="font-size:0.86rem;font-weight:700;">악기 소리: ' +
      '        <select id="select-timbre" class="btn btn-sm">' +
      '          <option value="chiptune" ' + (audio.timbre === 'chiptune' ? 'selected' : '') + '>🎮 8비트 칩튠</option>' +
      '          <option value="synth" ' + (audio.timbre === 'synth' ? 'selected' : '') + '>🎹 부드러운 신스</option>' +
      '          <option value="musicbox" ' + (audio.timbre === 'musicbox' ? 'selected' : '') + '>🎵 반짝 오르골</option>' +
      '        </select>' +
      '      </label>' +
      '      <label style="font-size:0.86rem;font-weight:700;">빠르기(템포): ' +
      '        <select id="select-tempo" class="btn btn-sm">' +
      '          <option value="slow" ' + (audio.tempo === 'slow' ? 'selected' : '') + '>🐢 느리게</option>' +
      '          <option value="normal" ' + (audio.tempo === 'normal' ? 'selected' : '') + '>🚶 보통</option>' +
      '          <option value="fast" ' + (audio.tempo === 'fast' ? 'selected' : '') + '>⚡ 빠르게</option>' +
      '        </select>' +
      '      </label>' +
      '    </div>' +
      '    <div id="sequencer-grid" class="sequencer-grid"></div>' +
      '  </div>' +
      '  <div class="card">' +
      '    <h2 class="card-title">🔊 게임 효과음(SFX) 고르기</h2>' +
      '    <p class="card-subtitle">버튼을 누르면 바로 효과음을 미리 들어볼 수 있어요!</p>' +
      renderSfxGroup('🦘 점프할 때', 'jump', global.GameData.SFX_OPTIONS.jump) +
      renderSfxGroup('⭐ 보물을 먹을 때', 'collect', global.GameData.SFX_OPTIONS.collect) +
      renderSfxGroup('💥 가시/몬스터에 부딪혔을 때', 'hit', global.GameData.SFX_OPTIONS.hit) +
      renderSfxGroup('🏆 게임 클리어 했을 때', 'win', global.GameData.SFX_OPTIONS.win) +
      '  </div>' +
      '</div>';

    renderGrid();

    root.querySelector('#btn-bgm-toggle').addEventListener('click', togglePlay);

    root.querySelector('#btn-bgm-random').addEventListener('click', function () {
      for (var r = 0; r < 6; r++) {
        for (var c = 0; c < 8; c++) {
          audio.bgm[r][c] = false;
        }
      }
      for (var c2 = 0; c2 < 8; c2++) {
        if (Math.random() < 0.72) {
          var rowPick = Math.floor(Math.random() * 6);
          audio.bgm[rowPick][c2] = true;
        }
      }
      project.meta.soundEdited = true;
      ctx.onProjectChange();
      renderGrid();
      if (!isPlaying) togglePlay();
    });

    root.querySelector('#btn-bgm-clear').addEventListener('click', function () {
      for (var r = 0; r < 6; r++) {
        for (var c = 0; c < 8; c++) {
          audio.bgm[r][c] = false;
        }
      }
      ctx.onProjectChange();
      renderGrid();
    });

    root.querySelectorAll('[data-bgm-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-bgm-preset');
        var p = global.GameData.BGM_PRESETS[key];
        if (!p) return;
        audio.bgm = global.GameData.deepClone(p.grid);
        audio.timbre = p.timbre;
        audio.tempo = p.tempo;
        root.querySelector('#select-timbre').value = audio.timbre;
        root.querySelector('#select-tempo').value = audio.tempo;
        project.meta.soundEdited = true;
        ctx.onProjectChange();
        renderGrid();
        if (isPlaying) {
          global.SoundEngine.restartBgmWithTempo(audio, highlightPlayhead);
        } else {
          togglePlay();
        }
      });
    });

    root.querySelector('#select-timbre').addEventListener('change', function () {
      audio.timbre = this.value;
      project.meta.soundEdited = true;
      ctx.onProjectChange();
    });

    root.querySelector('#select-tempo').addEventListener('change', function () {
      audio.tempo = this.value;
      project.meta.soundEdited = true;
      ctx.onProjectChange();
      if (isPlaying) {
        global.SoundEngine.restartBgmWithTempo(audio, highlightPlayhead);
      }
    });

    root.querySelectorAll('[data-sfx-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-sfx-key');
        var val = btn.getAttribute('data-sfx-val');
        audio.sfx[key] = val;
        root.querySelectorAll('[data-sfx-key="' + key + '"]').forEach(function (b) {
          b.classList.remove('btn-active');
        });
        btn.classList.add('btn-active');
        if (key === 'jump') global.SoundEngine.playJump(val);
        if (key === 'collect') global.SoundEngine.playCollect(val);
        if (key === 'hit') global.SoundEngine.playHit(val);
        if (key === 'win') global.SoundEngine.playWin(val);
        project.meta.soundEdited = true;
        ctx.onProjectChange();
      });
    });

    return function cleanup() {
      global.SoundEngine.stopBgm();
    };
  }

  /* ========================================================================
     Stage 6: QA 버그 테스트 & 수정
     ======================================================================== */
  function renderQaStage(root, ctx) {
    var project = ctx.project;
    var activeBugIdx = 0;
    var qaEngine = null;
    var feedbackMap = {};

    function allFixed() {
      return project.qaFixed.bug1 && project.qaFixed.bug2 && project.qaFixed.bug3;
    }

    function renderQaContent() {
      if (qaEngine) {
        qaEngine.destroy();
        qaEngine = null;
      }

      var bug = global.GameData.QA_BUGS[activeBugIdx];
      var fixed = Boolean(project.qaFixed[bug.id]);

      var bannerHtml = allFixed()
        ? '<div class="qa-all-clear-banner"><span>🎉 축하해요! QA 버그 3개를 모두 해결해 출시 준비가 끝났어요!</span><button id="btn-qa-go-launch" type="button" class="btn" style="color:#065f46;">🚀 게임 출시하러 가기 →</button></div>'
        : '';

      var tabsHtml = global.GameData.QA_BUGS.map(function (b, idx) {
        var isDone = Boolean(project.qaFixed[b.id]);
        var cls = (idx === activeBugIdx ? 'is-active ' : '') + (isDone ? 'is-fixed' : '');
        return '<button type="button" class="qa-tab-btn ' + cls + '" data-qa-idx="' + idx + '">' +
          '<span>' + escHtml(b.tabTitle) + '</span>' +
          '<span>' + (isDone ? '✅ 해결!' : '🐛 미해결') + '</span>' +
          '</button>';
      }).join('');

      var choicesHtml = bug.choices.map(function (ch) {
        var cls = '';
        if (fixed && ch.correct) cls = 'is-correct';
        else if (feedbackMap[bug.id] && feedbackMap[bug.id].choiceId === ch.id && !ch.correct) cls = 'is-wrong';
        return (
          '<button type="button" class="fix-choice-card ' + cls + '" data-choice-id="' + ch.id + '">' +
          '  <div class="fix-code-line">' + escHtml(ch.code) + '</div>' +
          '  <div style="font-size:0.84rem;color:#475569;">' + escHtml(ch.desc) + '</div>' +
          '</button>'
        );
      }).join('');

      var hintMsg = '';
      if (fixed) {
        var correctChoice = bug.choices.find(function (c) { return c.correct; });
        hintMsg = '<div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:#d1fae5;color:#065f46;font-weight:700;font-size:0.88rem;">✅ ' + escHtml(correctChoice.hint) + '</div>';
      } else if (feedbackMap[bug.id]) {
        hintMsg = '<div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:#fee2e2;color:#991b1b;font-weight:700;font-size:0.88rem;">💡 ' + escHtml(feedbackMap[bug.id].hint) + '</div>';
      }

      root.innerHTML =
        bannerHtml +
        '<div class="qa-tabs">' + tabsHtml + '</div>' +
        '<div class="two-col-equal">' +
        '  <div class="card">' +
        '    <h2 class="card-title">📺 버그 재현 화면 <button id="btn-qa-replay" type="button" class="btn btn-sm">🔄 다시 보기</button></h2>' +
        '    <p class="card-subtitle">테스터가 발견한 문제가 화면에 그대로 나타나고 있어요. 코드를 고치면 바로 정상 작동해요!</p>' +
        '    <canvas id="qa-preview-canvas" width="448" height="256"></canvas>' +
        '  </div>' +
        '  <div class="card">' +
        '    <div class="bug-report-box ' + (fixed ? 'is-fixed' : '') + '">' +
        '      <div style="font-weight:800;font-size:0.9rem;margin-bottom:4px;">📋 ' + escHtml(bug.reporter) + '의 버그 제보</div>' +
        '      <div style="font-size:0.93rem;color:#1e293b;">"' + escHtml(bug.report) + '"</div>' +
        '    </div>' +
        '    <h3 style="margin:0 0 10px;font-size:0.96rem;">🔧 아래 3개 코드 중 알맞은 수정 코드를 골라주세요!</h3>' +
        choicesHtml +
        hintMsg +
        '  </div>' +
        '</div>';

      var qaCanvas = root.querySelector('#qa-preview-canvas');
      qaEngine = new global.MiniPlatformerEngine(qaCanvas, project, {
        mode: 'qa',
        qaBug: bug.bugFlag,
        qaFixed: fixed,
        autoDemo: true
      });
      qaEngine.start();

      var goLaunch = root.querySelector('#btn-qa-go-launch');
      if (goLaunch) {
        goLaunch.addEventListener('click', function () {
          ctx.goToStage(7);
        });
      }

      root.querySelector('#btn-qa-replay').addEventListener('click', function () {
        global.SoundEngine.playUiClick();
        if (qaEngine) qaEngine.reset();
      });

      root.querySelectorAll('[data-qa-idx]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          global.SoundEngine.playUiClick();
          activeBugIdx = Number(btn.getAttribute('data-qa-idx'));
          renderQaContent();
        });
      });

      root.querySelectorAll('[data-choice-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cid = btn.getAttribute('data-choice-id');
          var chosen = bug.choices.find(function (c) { return c.id === cid; });
          if (!chosen) return;
          if (chosen.correct) {
            project.qaFixed[bug.id] = true;
            delete feedbackMap[bug.id];
            global.SoundEngine.playBugFixed();
            ctx.onProjectChange();
            renderQaContent();
            ctx.toast('✅ 버그를 완벽하게 고쳤어요!', 'is-success');
          } else {
            global.SoundEngine.playHit('bonk');
            feedbackMap[bug.id] = { choiceId: cid, hint: chosen.hint };
            renderQaContent();
          }
        });
      });
    }

    renderQaContent();

    return function cleanup() {
      if (qaEngine) qaEngine.destroy();
    };
  }

  /* ========================================================================
     Stage 7: 게임 출시 & 플레이 + 수료증 생성
     ======================================================================== */
  function downloadCertificatePng(project, evalData) {
    var c = document.createElement('canvas');
    c.width = 900;
    c.height = 600;
    var g = c.getContext('2d');

    // 배경 그라데이션
    var bg = g.createLinearGradient(0, 0, 900, 600);
    bg.addColorStop(0, '#fefce8');
    bg.addColorStop(0.55, '#ffffff');
    bg.addColorStop(1, '#eef2ff');
    g.fillStyle = bg;
    g.fillRect(0, 0, 900, 600);

    // 장식 테두리
    g.strokeStyle = '#4f46e5';
    g.lineWidth = 10;
    g.strokeRect(22, 22, 856, 556);
    g.strokeStyle = '#fbbf24';
    g.lineWidth = 4;
    g.strokeRect(36, 36, 828, 528);

    // 상단 타이틀
    g.textAlign = 'center';
    g.fillStyle = '#4f46e5';
    g.font = 'bold 22px sans-serif';
    g.fillText('MY FIRST GAME MAKER STUDIO', 450, 92);

    g.fillStyle = '#0f172a';
    g.font = 'bold 42px sans-serif';
    g.fillText('🏆 꼬마 게임 개발자 수료증', 450, 148);

    g.fillStyle = '#64748b';
    g.font = '20px sans-serif';
    g.fillText('기획 · 그래픽 · 맵디자인 · 규칙코딩 · 사운드 · QA 과정 완료', 450, 186);

    // 구분선
    g.strokeStyle = '#cbd5e1';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(150, 210);
    g.lineTo(750, 210);
    g.stroke();

    // 학생 이름 & 게임 제목
    g.fillStyle = '#1e293b';
    g.font = 'bold 34px sans-serif';
    g.fillText(project.developerName || '꼬마 개발자', 450, 266);

    g.fillStyle = '#334155';
    g.font = '22px sans-serif';
    g.fillText('위 학생은 게임 제작의 모든 과정을 직접 체험하고', 450, 316);
    g.fillStyle = '#4f46e5';
    g.font = 'bold 26px sans-serif';
    g.fillText('「' + (project.title || '나의 첫 게임') + '」', 450, 356);
    g.fillStyle = '#334155';
    g.font = '22px sans-serif';
    g.fillText('게임을 성공적으로 완성 및 출시하였기에 이 수료증을 드립니다.', 450, 396);

    // 직접 그린 주인공 픽셀 아트 도장!
    g.fillStyle = '#eef2ff';
    g.fillRect(105, 425, 110, 110);
    g.strokeStyle = '#6366f1';
    g.lineWidth = 3;
    g.strokeRect(105, 425, 110, 110);
    global.MiniPlatformerEngine.drawSpriteGrid(g, project.sprites.hero, 120, 440, 80, 80, false);

    // 평점 & 날짜
    g.textAlign = 'left';
    g.fillStyle = '#0f172a';
    g.font = 'bold 22px sans-serif';
    g.fillText('종합 평점: ⭐ ' + evalData.total.toFixed(1) + ' / 5.0', 250, 466);

    var today = new Date();
    var dateStr = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일';
    g.fillStyle = '#475569';
    g.font = '20px sans-serif';
    g.fillText('발급일: ' + dateStr, 250, 504);

    // 피코 디렉터 도장
    g.textAlign = 'center';
    g.fillStyle = '#ef4444';
    g.beginPath();
    g.arc(745, 480, 44, 0, Math.PI * 2);
    g.strokeStyle = '#ef4444';
    g.lineWidth = 4;
    g.stroke();
    g.font = 'bold 16px sans-serif';
    g.fillText('피코 디렉터', 745, 476);
    g.fillText('공식 인증', 745, 498);

    var link = document.createElement('a');
    link.download = '나의첫게임_수료증.png';
    link.href = c.toDataURL('image/png');
    link.click();
  }

  function renderLaunchStage(root, ctx) {
    var project = ctx.project;
    var engine = null;
    var bgmActive = false;

    function openLaunchReportModal(winInfo) {
      var evalData = global.GameData.computeEvaluation(project);
      var breakdownHtml = evalData.breakdown.map(function (b) {
        return '<div class="score-mini-card"><div style="font-size:0.82rem;color:#64748b;font-weight:700;">' + escHtml(b.label) + '</div><div style="font-size:1rem;font-weight:900;color:#4f46e5;">' + escHtml(b.score) + '</div></div>';
      }).join('');

      var reviewsHtml = evalData.reviews.map(function (r) {
        return '<div class="review-card"><div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:3px;"><span>💬 ' + escHtml(r.author) + '</span><span>' + r.stars + '</span></div><div>' + escHtml(r.text) + '</div></div>';
      }).join('');

      var clearBanner = winInfo
        ? '<div style="background:#d1fae5;color:#065f46;padding:10px 14px;border-radius:12px;font-weight:800;margin-bottom:12px;">🎉 클리어 기록: ' + winInfo.elapsed.toFixed(1) + '초 · 최종 점수 ' + winInfo.score + '점!</div>'
        : '';

      var html =
        clearBanner +
        '<div style="text-align:center;margin-bottom:8px;">' +
        '  <div style="font-size:0.9rem;color:#64748b;font-weight:700;">출시 게임 종합 평점</div>' +
        '  <div style="font-size:1.7rem;font-weight:900;color:#f59e0b;">⭐ ' + evalData.total.toFixed(1) + ' / 5.0</div>' +
        '</div>' +
        '<div class="score-breakdown-grid">' + breakdownHtml + '</div>' +
        '<h3 style="margin:0 0 8px;font-size:0.98rem;">📰 플레이어 출시 후기</h3>' +
        '<div class="review-list">' + reviewsHtml + '</div>' +
        '<div class="certificate-card">' +
        '  <div style="font-weight:900;font-size:1.15rem;color:#312e81;margin-bottom:8px;">🏆 꼬마 게임 개발자 수료증</div>' +
        '  <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">' +
        '    <label style="font-weight:700;font-size:0.9rem;">개발자 이름:</label>' +
        '    <input id="cert-dev-name" class="text-input" style="max-width:200px;padding:6px 10px;font-size:0.95rem;" type="text" maxlength="20" value="' + escHtml(project.developerName) + '" />' +
        '  </div>' +
        '  <p style="margin:0 0 12px;font-size:0.9rem;color:#334155;">「<strong>' + escHtml(project.title) + '</strong>」 제작의 7단계를 완주한 것을 축하합니다!</p>' +
        '  <button id="btn-download-cert" type="button" class="btn btn-primary">🖼️ 수료증 이미지 저장 (PNG)</button>' +
        '</div>';

      ctx.openModal('🎉 게임 출시 축하 & 개발자 수료증', html, function (modalBody) {
        var devInput = modalBody.querySelector('#cert-dev-name');
        devInput.addEventListener('input', function () {
          project.developerName = devInput.value.trim() || '꼬마 개발자';
          ctx.onProjectChange({ silent: true });
        });
        modalBody.querySelector('#btn-download-cert').addEventListener('click', function () {
          global.SoundEngine.playUiClick();
          downloadCertificatePng(project, evalData);
          ctx.toast('🖼️ 수료증 이미지가 저장되었어요!', 'is-success');
        });
      });
    }

    root.innerHTML =
      '<div class="arcade-shell">' +
      '  <div class="arcade-hud">' +
      '    <div class="hud-stats">' +
      '      <span class="hud-pill" style="color:#fde68a;">🎮 ' + escHtml(project.title) + '</span>' +
      '      <span id="hud-hearts" class="hud-pill">❤️❤️❤️</span>' +
      '      <span id="hud-stars" class="hud-pill">⭐ 0/0</span>' +
      '      <span id="hud-score" class="hud-pill">🏆 0</span>' +
      '      <span id="hud-timer" class="hud-pill">⏱️ 0.0초</span>' +
      '    </div>' +
      '    <div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '      <button id="btn-launch-bgm" type="button" class="btn btn-sm">🎵 배경음악 켜기</button>' +
      '      <button id="btn-launch-restart" type="button" class="btn btn-sm">🔄 다시 시작</button>' +
      '      <button id="btn-open-report" type="button" class="btn btn-sm btn-warning">🏆 출시 리뷰 & 수료증</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="arcade-canvas-wrap">' +
      '    <canvas id="launch-game-canvas" width="768" height="384"></canvas>' +
      '    <div id="arcade-overlay" class="arcade-overlay hidden">' +
      '      <div class="arcade-overlay-card">' +
      '        <h3 id="overlay-result-title"></h3>' +
      '        <p id="overlay-result-desc" style="color:#475569;margin:0 0 14px;"></p>' +
      '        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
      '          <button id="btn-overlay-retry" type="button" class="btn btn-primary">🔄 다시 플레이</button>' +
      '          <button id="btn-overlay-cert" type="button" class="btn btn-success">🏆 리뷰 & 수료증 보기</button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="arcade-bottom-bar">' +
      '    <div class="touch-controls">' +
      '      <button id="tc-left" type="button" class="touch-btn">◀</button>' +
      '      <button id="tc-right" type="button" class="touch-btn">▶</button>' +
      '      <button id="tc-jump" type="button" class="touch-btn touch-jump">점프!</button>' +
      '    </div>' +
      '    <div class="quick-edit-pills">' +
      '      <span style="font-size:0.8rem;color:#94a3b8;align-self:center;">키보드: ← → / WASD 이동 · 스페이스바 점프</span>' +
      '      <button type="button" class="quick-pill-btn" data-jump-stage="2">🎨 그래픽 수정</button>' +
      '      <button type="button" class="quick-pill-btn" data-jump-stage="3">🗺️ 맵 수정</button>' +
      '      <button type="button" class="quick-pill-btn" data-jump-stage="4">💻 규칙 수정</button>' +
      '      <button type="button" class="quick-pill-btn" data-jump-stage="5">🎵 음악 수정</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    var hudHearts = root.querySelector('#hud-hearts');
    var hudStars = root.querySelector('#hud-stars');
    var hudScore = root.querySelector('#hud-score');
    var hudTimer = root.querySelector('#hud-timer');
    var overlay = root.querySelector('#arcade-overlay');
    var overlayTitle = root.querySelector('#overlay-result-title');
    var overlayDesc = root.querySelector('#overlay-result-desc');
    var lastWinInfo = null;

    var gameCanvas = root.querySelector('#launch-game-canvas');
    project.meta.playedLaunch = true;
    ctx.onProjectChange({ silent: true });

    engine = new global.MiniPlatformerEngine(gameCanvas, project, {
      mode: 'play',
      onHudUpdate: function (hud) {
        var heartsStr = '';
        for (var i = 0; i < hud.maxHearts; i++) {
          heartsStr += i < hud.hearts ? '❤️' : '🤍';
        }
        hudHearts.textContent = heartsStr;
        hudStars.textContent = '⭐ ' + hud.collected + '/' + hud.totalCollectibles;
        hudScore.textContent = '🏆 ' + hud.score + (hud.speedBoost ? ' ⚡' : '');
        if (project.goal === 'time_attack') {
          hudTimer.textContent = '⏱️ 남은시간 ' + hud.timeLeft.toFixed(1) + '초';
        } else {
          hudTimer.textContent = '⏱️ ' + hud.elapsed.toFixed(1) + '초';
        }
      },
      onWin: function (res) {
        lastWinInfo = res;
        project.meta.clearedLaunch = true;
        ctx.onProjectChange();
        overlayTitle.textContent = '🎉 스테이지 클리어!';
        overlayDesc.textContent = '기록: ' + res.elapsed.toFixed(1) + '초 · 보물 ' + res.collected + '/' + res.totalCollectibles + ' · 총점 ' + res.score + '점!';
        overlay.classList.remove('hidden');
      },
      onLose: function (res) {
        lastWinInfo = null;
        overlayTitle.textContent = '😢 아쉽지만 다시 도전해 볼까요?';
        overlayDesc.textContent = res.reason;
        overlay.classList.remove('hidden');
      }
    });
    engine.start();

    function restartGame() {
      overlay.classList.add('hidden');
      engine.reset();
    }

    root.querySelector('#btn-launch-restart').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      restartGame();
    });
    root.querySelector('#btn-overlay-retry').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      restartGame();
    });
    root.querySelector('#btn-overlay-cert').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      openLaunchReportModal(lastWinInfo);
    });
    root.querySelector('#btn-open-report').addEventListener('click', function () {
      global.SoundEngine.playUiClick();
      openLaunchReportModal(lastWinInfo);
    });

    var bgmBtn = root.querySelector('#btn-launch-bgm');
    bgmBtn.addEventListener('click', function () {
      if (bgmActive) {
        bgmActive = false;
        global.SoundEngine.stopBgm();
        bgmBtn.textContent = '🎵 배경음악 켜기';
        bgmBtn.classList.remove('btn-active');
      } else {
        bgmActive = true;
        global.SoundEngine.startBgm(project.audio);
        bgmBtn.textContent = '🔇 배경음악 끄기';
        bgmBtn.classList.add('btn-active');
      }
    });

    function bindTouch(sel, key) {
      var el = root.querySelector(sel);
      if (!el) return;
      el.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        el.classList.add('is-pressed');
        engine.setVirtualInput(key, true);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        el.addEventListener(ev, function () {
          el.classList.remove('is-pressed');
          engine.setVirtualInput(key, false);
        });
      });
    }
    bindTouch('#tc-left', 'left');
    bindTouch('#tc-right', 'right');
    bindTouch('#tc-jump', 'jump');

    root.querySelectorAll('[data-jump-stage]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ctx.goToStage(Number(btn.getAttribute('data-jump-stage')));
      });
    });

    return function cleanup() {
      if (engine) engine.destroy();
      global.SoundEngine.stopBgm();
    };
  }

  global.Stages = {
    1: renderPlanStage,
    2: renderArtStage,
    3: renderLevelStage,
    4: renderCodeStage,
    5: renderSoundStage,
    6: renderQaStage,
    7: renderLaunchStage
  };
})(window);
