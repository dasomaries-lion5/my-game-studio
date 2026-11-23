/**
 * 나의 첫 게임 제작소 - 게임 데이터, 프리셋, 저장/불러오기 유틸리티
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'game_maker_studio_v1';

  var STAGES = [
    {
      id: 1,
      key: 'plan',
      shortTitle: '1. 기획',
      title: '게임 기획하기',
      role: '📋 게임 기획자',
      accent: '#4f46e5',
      tip: '어떤 세상에서 무슨 목표를 이루는 게임일까요? 멋진 제목과 분위기, 규칙을 먼저 정해요!'
    },
    {
      id: 2,
      key: 'art',
      shortTitle: '2. 그래픽',
      title: '픽셀 아트 그리기',
      role: '🎨 픽셀 아티스트',
      accent: '#ec4899',
      tip: '점(픽셀)을 하나씩 찍어서 나만의 주인공, 몬스터, 보물을 그려 보아요! 좌우 대칭 도구도 써 보세요.'
    },
    {
      id: 3,
      key: 'level',
      shortTitle: '3. 맵디자인',
      title: '스테이지 맵 만들기',
      role: '🗺️ 레벨 디자이너',
      accent: '#10b981',
      tip: '발판과 함정, 보물을 배치해 재미있는 코스를 만들어요. "지금 바로 테스트!" 버튼으로 바로 뛰어볼 수 있어요!'
    },
    {
      id: 4,
      key: 'code',
      shortTitle: '4. 규칙코딩',
      title: '물리 & 규칙 코딩하기',
      role: '💻 게임 프로그래머',
      accent: '#0ea5e9',
      tip: '슬라이더와 블록으로 점프 높이, 중력, 충돌 규칙을 코딩해요. 오른쪽 테스트 화면에서 실시간으로 느껴보세요!'
    },
    {
      id: 5,
      key: 'sound',
      shortTitle: '5. 사운드',
      title: '배경음악 & 효과음',
      role: '🎵 사운드 디자이너',
      accent: '#8b5cf6',
      tip: '칸을 눌러 8박자 멜로디를 작곡하고, 점프와 보물 효과음을 골라 게임에 생기를 불어넣어 보세요!'
    },
    {
      id: 6,
      key: 'qa',
      shortTitle: '6. QA버그잡기',
      title: 'QA 버그 테스트 & 수정',
      role: '🐛 QA 테스터',
      accent: '#f59e0b',
      tip: '출시 전 마지막 점검! 테스트 리포트를 보고 고장 난 코드 3개를 찾아 알맞게 고쳐 주세요.'
    },
    {
      id: 7,
      key: 'launch',
      shortTitle: '7. 출시&플레이',
      title: '게임 출시 & 플레이',
      role: '🚀 게임 디렉터',
      accent: '#ef4444',
      tip: '축하합니다! 직접 기획하고 코딩한 게임이 완성되었어요. 직접 클리어하고 플레이어 리뷰와 수료증을 받아 보세요!'
    }
  ];

  var THEMES = {
    meadow: {
      id: 'meadow',
      name: '푸른 초원',
      emoji: '🌿',
      desc: '맑은 하늘과 초록 잔디가 펼쳐진 모험 세계',
      skyTop: '#38bdf8',
      skyBottom: '#bae6fd',
      groundFill: '#854d0e',
      groundTop: '#22c55e',
      cloudFill: '#ffffff',
      platformFill: '#f1f5f9',
      platformBorder: '#94a3b8',
      decorColor: 'rgba(255, 255, 255, 0.7)'
    },
    space: {
      id: 'space',
      name: '신비한 우주',
      emoji: '🚀',
      desc: '반짝이는 별과 행성이 떠다니는 은하수',
      skyTop: '#0f172a',
      skyBottom: '#312e81',
      groundFill: '#334155',
      groundTop: '#38bdf8',
      cloudFill: '#6366f1',
      platformFill: '#818cf8',
      platformBorder: '#c7d2fe',
      decorColor: 'rgba(253, 224, 71, 0.85)'
    },
    volcano: {
      id: 'volcano',
      name: '용암 동굴',
      emoji: '🌋',
      desc: '붉은 바위와 뜨거운 불꽃이 타오르는 던전',
      skyTop: '#450a0a',
      skyBottom: '#9a3412',
      groundFill: '#292524',
      groundTop: '#f97316',
      cloudFill: '#78716c',
      platformFill: '#a8a29e',
      platformBorder: '#fb923c',
      decorColor: 'rgba(251, 146, 60, 0.65)'
    },
    candy: {
      id: 'candy',
      name: '과자 왕국',
      emoji: '🍭',
      desc: '달콤한 솜사탕 구름과 딸기 크림이 가득한 나라',
      skyTop: '#f472b6',
      skyBottom: '#fbcfe8',
      groundFill: '#92400e',
      groundTop: '#fb7185',
      cloudFill: '#fff1f2',
      platformFill: '#fef08a',
      platformBorder: '#f43f5e',
      decorColor: 'rgba(255, 255, 255, 0.85)'
    }
  };

  var GOALS = {
    collect_all: {
      id: 'collect_all',
      name: '보물 모두 모으고 깃발!',
      emoji: '⭐',
      desc: '맵에 있는 모든 보물을 모아야 깃발이 열립니다.'
    },
    reach_flag: {
      id: 'reach_flag',
      name: '깃발까지 빨리 도착!',
      emoji: '🚩',
      desc: '장애물을 뛰어넘어 깃발에 닿으면 바로 클리어!'
    },
    time_attack: {
      id: 'time_attack',
      name: '30초 타임 어택!',
      emoji: '⏱️',
      desc: '30초가 다 지나기 전에 깃발까지 달려야 합니다!'
    }
  };

  var RANDOM_TITLES = [
    '모험을 떠나는 고양이',
    '별빛 점프 대작전',
    '초코 쿠키 구출 작전',
    '용암 동굴 탈출기',
    '우주 로켓 점프!',
    '전설의 황금 별 찾기',
    '점프왕 미니 히어로',
    '무지개 구름 대모험',
    '몬스터 성의 비밀',
    '두근두근 첫 게임'
  ];

  // 16가지 픽셀 아트 팔레트 색상
  var PALETTE = [
    '#0f172a', // 0 검정
    '#ffffff', // 1 흰색
    '#94a3b8', // 2 회색
    '#ef4444', // 3 빨강
    '#f97316', // 4 주황
    '#fbbf24', // 5 노랑
    '#fde047', // 6 밝은노랑
    '#22c55e', // 7 초록
    '#10b981', // 8 청록
    '#38bdf8', // 9 하늘
    '#3b82f6', // 10 파랑
    '#6366f1', // 11 남보라
    '#a855f7', // 12 보라
    '#ec4899', // 13 분홍
    '#fbcfe8', // 14 연분홍
    '#92400e'  // 15 갈색
  ];

  function parseSpriteGrid(rows, colorMap) {
    return rows.map(function (row) {
      var arr = [];
      for (var i = 0; i < 12; i++) {
        var ch = row.charAt(i) || '.';
        arr.push(ch === '.' ? null : (colorMap[ch] || '#0f172a'));
      }
      return arr;
    });
  }

  var SPRITE_PRESETS = {
    hero: [
      {
        id: 'cat',
        name: '모험 고양이',
        rows: [
          '..OO....OO..',
          '.OYYO..OYYO.',
          '.OYPYYYYPYO.',
          '.OYYYYYYYYO.',
          '.OYBYYYYBYO.',
          '.OYYYPYYYYO.',
          '..OOOOOOOO..',
          '..OCCCCCCCO.',
          '.OOCCCCCCOO.',
          '..OCCCCCCOO.',
          '..OYY..YYO..',
          '..OOO..OOO..'
        ],
        colors: {
          O: '#0f172a',
          Y: '#fbbf24',
          P: '#ec4899',
          B: '#0f172a',
          C: '#ef4444'
        }
      },
      {
        id: 'robot',
        name: '피코 로봇',
        rows: [
          '.....YY.....',
          '.....OO.....',
          '..OOOOOOOO..',
          '.OCCCCCCCCO.',
          '.OCWWOOWWCO.',
          '.OCBBOOBBCO.',
          '.OCCCCCCCCO.',
          '..OOOOOOOO..',
          '.OOSSSSSSOO.',
          '.OOSSSSSSOO.',
          '..OSS..SSO..',
          '..OOO..OOO..'
        ],
        colors: {
          O: '#0f172a',
          Y: '#fde047',
          C: '#38bdf8',
          W: '#ffffff',
          B: '#3b82f6',
          S: '#94a3b8'
        }
      },
      {
        id: 'knight',
        name: '꼬마 용사',
        rows: [
          '....RRRR....',
          '..OOOOOOOO..',
          '.OSSSSSSSSO.',
          '.OSPPPPPPPO.',
          '.OSPBPPSPBO.',
          '.OSPPPPPPPO.',
          '..OOOOOOOO..',
          '.OOBBBBBBOO.',
          '.OOBBYYBBOO.',
          '..OBBBBBBO..',
          '..OSS..SSO..',
          '..OOO..OOO..'
        ],
        colors: {
          O: '#0f172a',
          R: '#ef4444',
          S: '#94a3b8',
          P: '#fbcfe8',
          B: '#3b82f6',
          Y: '#fbbf24'
        }
      },
      {
        id: 'slime',
        name: '초록 슬라임',
        rows: [
          '............',
          '....OOOO....',
          '..OOGGGGOO..',
          '.OGGGGGGGGO.',
          '.OGWGGGGWGO.',
          '.OGGGGGGGGO.',
          'OGGGBGGBGGGO',
          'OGGGGGGGGGGO',
          'OGGGRRRRGGGO',
          'OGGGGGGGGGGO',
          '.OOOOOOOOOO.',
          '............'
        ],
        colors: {
          O: '#0f172a',
          G: '#22c55e',
          W: '#ffffff',
          B: '#0f172a',
          R: '#ec4899'
        }
      }
    ],
    enemy: [
      {
        id: 'spiky',
        name: '가시 몬스터',
        rows: [
          '..O......O..',
          '.ORO....ORO.',
          '.ORROOOORRO.',
          '..ORRRRRRO..',
          '.ORWWORWWRO.',
          '.ORBWORBWRO.',
          '.ORRRRRRRRO.',
          '.OROWWWOWRO.',
          '..ORRRRRRO..',
          '..OOOOOOOO..',
          '..OR....RO..',
          '..OO....OO..'
        ],
        colors: {
          O: '#0f172a',
          R: '#ef4444',
          W: '#ffffff',
          B: '#0f172a'
        }
      },
      {
        id: 'ufo',
        name: '우주 UFO',
        rows: [
          '....OOOO....',
          '...OCCCCO...',
          '..OCWWWWCO..',
          '..OCCCCCCO..',
          '.OOOOOOOOOO.',
          'OPPPPPPPPPPO',
          'OPYPPYYPPYPO',
          'OPPPPPPPPPPO',
          '.OOOOOOOOOO.',
          '...OO..OO...',
          '............',
          '............'
        ],
        colors: {
          O: '#0f172a',
          C: '#38bdf8',
          W: '#ffffff',
          P: '#a855f7',
          Y: '#fde047'
        }
      },
      {
        id: 'flame',
        name: '불꽃 도깨비',
        rows: [
          '.....OO.....',
          '....ORRO....',
          '...ORRRRO...',
          '..OROYYORO..',
          '.ORROYYORRO.',
          '.ORWBWWBWRO.',
          '.ORRRRRRRRO.',
          '.OROYYYYORO.',
          '..ORRRRRRO..',
          '...OOOOOO...',
          '..OO....OO..',
          '............'
        ],
        colors: {
          O: '#0f172a',
          R: '#f97316',
          Y: '#fde047',
          W: '#ffffff',
          B: '#0f172a'
        }
      }
    ],
    collectible: [
      {
        id: 'star',
        name: '황금 별',
        rows: [
          '.....OO.....',
          '....OYYO....',
          '....OYYO....',
          '.OOOYYYYOOO.',
          'OYYYYWWYYYYO',
          '.OYYYYYYYYO.',
          '..OYYYYYYO..',
          '..OYYOOYYO..',
          '.OYYO..OYYO.',
          '.OOO....OOO.',
          '............',
          '............'
        ],
        colors: {
          O: '#92400e',
          Y: '#fbbf24',
          W: '#ffffff'
        }
      },
      {
        id: 'gem',
        name: '마법 보석',
        rows: [
          '............',
          '...OOOOOO...',
          '..OCCCCCCO..',
          '.OCWWCCCCCO.',
          'OCWCCCCCCCCO',
          'OCCCCCCCCCCO',
          '.OCCBBBBCCO.',
          '..OCBBBBCO..',
          '...OCBBCO...',
          '....OCCO....',
          '.....OO.....',
          '............'
        ],
        colors: {
          O: '#0f172a',
          C: '#38bdf8',
          W: '#ffffff',
          B: '#6366f1'
        }
      },
      {
        id: 'donut',
        name: '딸기 도넛',
        rows: [
          '............',
          '...OOOOOO...',
          '..OPPPPPPO..',
          '.OPWPPPPWPO.',
          'OPPPPOOPPPPO',
          'OPPPODDOPPPO',
          'OBBBODDOBBO.',
          '.OBBBOOBBBO.',
          '..OBBBBBBO..',
          '...OOOOOO...',
          '............',
          '............'
        ],
        colors: {
          O: '#0f172a',
          P: '#ec4899',
          W: '#ffffff',
          D: '#fbcfe8',
          B: '#f97316'
        }
      }
    ]
  };

  function getSpritePresetGrid(category, index) {
    var list = SPRITE_PRESETS[category] || [];
    var preset = list[index] || list[0];
    return parseSpriteGrid(preset.rows, preset.colors);
  }

  var TILE_TYPES = [
    { id: 0, name: '지우개', emoji: '🧹', desc: '빈 공간으로 지우기' },
    { id: 1, name: '땅 블록', emoji: '🟫', desc: '밟고 서는 단단한 땅' },
    { id: 2, name: '구름 발판', emoji: '☁️', desc: '아래에서 위로 뛰어오르는 발판' },
    { id: 3, name: '가시 함정', emoji: '🔺', desc: '닿으면 하트가 줄어드는 함정' },
    { id: 4, name: '점프대', emoji: '🌀', desc: '밟으면 높이 튀어 오르는 스프링' },
    { id: 5, name: '몬스터', emoji: '👾', desc: '땅 위를 왔다갔다 순찰하는 적' },
    { id: 6, name: '보물', emoji: '⭐', desc: '먹으면 점수가 오르는 반짝 보물' },
    { id: 7, name: '출발점', emoji: '🚩', desc: '주인공이 시작하는 위치 (1개)' },
    { id: 8, name: '도착 깃발', emoji: '🏁', desc: '여기에 도착하면 게임 클리어! (1개)' }
  ];

  var CHAR_TO_TILE = {
    '.': 0,
    '#': 1,
    '=': 2,
    '^': 3,
    'J': 4,
    'E': 5,
    '*': 6,
    'P': 7,
    'F': 8
  };

  function parseLevelMap(rows) {
    return rows.map(function (row) {
      var arr = [];
      for (var c = 0; c < 24; c++) {
        var ch = row.charAt(c) || '.';
        arr.push(CHAR_TO_TILE[ch] !== undefined ? CHAR_TO_TILE[ch] : 0);
      }
      return arr;
    });
  }

  var LEVEL_TEMPLATES = {
    starter: {
      id: 'starter',
      name: '초보자 모험 코스',
      rows: [
        '........................',
        '........................',
        '........................',
        '...............*..*.....',
        '.............======.....',
        '.........*..............',
        '........===..........*..',
        '....*...............===.',
        '...===..................',
        '.P.......*...E...J....F.',
        '#####..######..#########',
        '#####..######..#########'
      ]
    },
    jump_heaven: {
      id: 'jump_heaven',
      name: '점프대 하늘 섬',
      rows: [
        '........................',
        '........................',
        '...........*.......*....',
        '..........====....===.F.',
        '.....................###',
        '......*.................',
        '.....===.........J......',
        '................###.....',
        '..*........===..........',
        '.P...J....E.......*.....',
        '######..#######.######..',
        '######..#######.######..'
      ]
    },
    monster_castle: {
      id: 'monster_castle',
      name: '몬스터 성 대모험',
      rows: [
        '........................',
        '........................',
        '.................*......',
        '................===.....',
        '..........*.............',
        '.........===........*...',
        '...................===..',
        '....*...................',
        '...===........E.........',
        '.P.....^^...######..J.F.',
        '##########..############',
        '##########..############'
      ]
    },
    empty: {
      id: 'empty',
      name: '빈 도화지 (바닥만)',
      rows: [
        '........................',
        '........................',
        '........................',
        '........................',
        '........................',
        '........................',
        '........................',
        '........................',
        '........................',
        '.P....................F.',
        '########################',
        '########################'
      ]
    }
  };

  var RULES_CONFIG = {
    enemyHit: [
      {
        id: 'damage_stomp',
        label: '위에서 밟으면 몬스터 처치! / 옆에 닿으면 하트 -1',
        short: '밟아서 처치 + 옆은 피해',
        code: 'if (발아래) monster.defeat(); else player.hp -= 1;'
      },
      {
        id: 'knockback',
        label: '부딪히면 하트 -1 & 잠깐 무적 튕겨나기',
        short: '피해 + 잠깐 무적',
        code: 'player.hp -= 1; player.bounceBack(); player.invincible = 1.2s;'
      },
      {
        id: 'respawn',
        label: '부딪히면 하트 -1 & 출발점으로 돌아가기',
        short: '출발점으로 리스폰',
        code: 'player.hp -= 1; player.teleport(startPoint);'
      }
    ],
    collectEffect: [
      {
        id: 'score',
        label: '점수 +100점 얻고 반짝이 파티클 터지기',
        short: '+100점 반짝이',
        code: 'score += 100; spawnSparkles(item.x, item.y);'
      },
      {
        id: 'speed',
        label: '점수 +100점 & 3초 동안 이동 속도 1.4배 빨라지기',
        short: '3초 스피드 업!',
        code: 'score += 100; player.speedBoostTimer = 3.0s;'
      },
      {
        id: 'heal',
        label: '점수 +100점 & 줄어든 하트 1개 회복하기',
        short: '하트 +1 회복',
        code: 'score += 100; player.hp = min(maxHp, player.hp + 1);'
      }
    ],
    springPower: [
      {
        id: 'normal',
        label: '신나는 일반 탄력 (1.7배 높이 점프)',
        short: '일반 탄력 (1.7배)',
        code: 'player.vy = jumpPower * 1.7;'
      },
      {
        id: 'super',
        label: '슈퍼 로켓 탄력 (2.1배 높이 점프 + 별빛 폭발)',
        short: '슈퍼 탄력 (2.1배)',
        code: 'player.vy = jumpPower * 2.1; spawnStars();'
      }
    ]
  };

  var BGM_NOTES = [
    { name: '높은 도', freq: 523.25 },
    { name: '라', freq: 440.00 },
    { name: '솔', freq: 392.00 },
    { name: '미', freq: 329.63 },
    { name: '레', freq: 293.66 },
    { name: '도', freq: 261.63 }
  ];

  var BGM_PRESETS = {
    adventure: {
      name: '신나는 모험',
      timbre: 'chiptune',
      tempo: 'normal',
      grid: [
        [false, false, false, false, true, false, false, false],
        [false, false, false, false, false, true, false, false],
        [false, false, true, false, false, false, true, false],
        [false, true, false, true, false, false, false, true],
        [false, false, false, false, false, false, false, false],
        [true, false, false, false, false, false, false, false]
      ]
    },
    space: {
      name: '신비한 우주',
      timbre: 'musicbox',
      tempo: 'slow',
      grid: [
        [false, false, false, true, false, false, false, false],
        [false, true, false, false, false, true, false, false],
        [false, false, true, false, false, false, true, false],
        [true, false, false, false, true, false, false, false],
        [false, false, false, false, false, false, false, true],
        [false, false, false, false, false, false, false, false]
      ]
    },
    dash: {
      name: '신속 달리기',
      timbre: 'synth',
      tempo: 'fast',
      grid: [
        [false, false, true, false, false, false, true, false],
        [false, true, false, true, false, false, false, true],
        [true, false, false, false, true, false, false, false],
        [false, false, false, false, false, true, false, false],
        [false, false, false, false, false, false, false, false],
        [true, false, true, false, true, false, false, false]
      ]
    }
  };

  var SFX_OPTIONS = {
    jump: [
      { id: 'boing', label: '뽀잉~ (통통)' },
      { id: 'laser', label: '슈웅! (레이저)' },
      { id: 'retro', label: '뿅! (레트로 8비트)' }
    ],
    collect: [
      { id: 'coin', label: '띠링~ (동전)' },
      { id: 'sparkle', label: '차르르~ (별빛)' },
      { id: 'power', label: '따단! (파워업)' }
    ],
    hit: [
      { id: 'bonk', label: '쿵! (부딪힘)' },
      { id: 'zap', label: '지지직! (전기)' },
      { id: 'ouch', label: '으악~ (하강음)' }
    ],
    win: [
      { id: 'fanfare', label: '빠바밤~! (팡파레)' },
      { id: 'levelup', label: '레벨 업! (상승음)' }
    ]
  };

  var QA_BUGS = [
    {
      id: 'bug1',
      bugFlag: 'inverted_gravity',
      tabTitle: '버그 #1 중력 오류',
      reporter: '테스터 민준',
      report: '주인공이 땅으로 내려오지 않고 자꾸 천장 위로 날아가 버려요! 코드에서 중력 방향이 반대로 되어 있는 것 같아요.',
      choices: [
        {
          id: 'c1',
          code: 'player.vy = player.vy - gravity; // 위로 당기기',
          desc: '중력을 빼서 하늘로 계속 날아가게 만듭니다.',
          correct: false,
          hint: '아쉬워요! 속도(vy)에서 중력을 빼면 위로(-) 계속 올라가게 돼요. 아래 방향(+)으로 더해야 해요!'
        },
        {
          id: 'c2',
          code: 'player.vy = player.vy + gravity; // 아래로 당기기',
          desc: '중력을 더해서 아래(땅) 방향으로 내려오게 고칩니다.',
          correct: true,
          hint: '정답이에요! 화면 아래쪽이 +방향이므로 중력은 속도에 +로 더해야 자연스럽게 떨어집니다!'
        },
        {
          id: 'c3',
          code: 'player.vx = 0; // 가로 이동 멈추기',
          desc: '주인공이 왼쪽 오른쪽으로 못 움직이게 막습니다.',
          correct: false,
          hint: '이건 좌우 이동(vx) 코드예요. 하늘로 날아가는 중력(vy) 문제를 고쳐야 해요!'
        }
      ]
    },
    {
      id: 'bug2',
      bugFlag: 'no_collision',
      tabTitle: '버그 #2 바닥 충돌 오류',
      reporter: '테스터 서연',
      report: '으악! 주인공이 바닥 블록을 뚫고 아래로 끝없이 떨어져 버려요. 블록과 부딪혔는지 확인하는 코드가 꺼져 있어요!',
      choices: [
        {
          id: 'c1',
          code: 'if (checkTileCollision(player) === true) { player.stopFalling(); }',
          desc: '땅 블록과 닿으면 떨어지는 것을 멈추도록 충돌 검사를 켭니다.',
          correct: true,
          hint: '완벽해요! 충돌 검사(Collision)가 켜져서 이제 주인공이 바닥을 밟고 서 있을 수 있어요!'
        },
        {
          id: 'c2',
          code: 'player.color = "transparent"; // 투명하게 만들기',
          desc: '주인공의 색깔을 투명하게 숨깁니다.',
          correct: false,
          hint: '주인공이 안 보일 뿐, 여전히 바닥을 뚫고 떨어져요! 충돌(Collision) 코드를 찾아보세요.'
        },
        {
          id: 'c3',
          code: 'gravity = 0; // 중력 없애기',
          desc: '중력을 0으로 만들어서 우주처럼 둥둥 뜨게 합니다.',
          correct: false,
          hint: '중력이 없으면 땅에 발을 딛고 점프를 할 수 없어요! 바닥 블록과 닿았는지 검사하는 코드가 필요해요.'
        }
      ]
    },
    {
      id: 'bug3',
      bugFlag: 'broken_goal',
      tabTitle: '버그 #3 깃발 클리어 오류',
      reporter: '테스터 지호',
      report: '도착 깃발에 딱 닿았는데도 아무 일도 안 일어나고 게임이 끝나지 않아요! 깃발 이벤트 코드를 확인해 주세요.',
      choices: [
        {
          id: 'c1',
          code: 'if (touchGoalFlag) { player.hp = 0; }',
          desc: '깃발에 닿으면 체력을 0으로 만듭니다.',
          correct: false,
          hint: '앗! 그러면 깃발에 닿자마자 게임 오버가 돼 버려요! 승리(Win) 함수를 불러야 해요.'
        },
        {
          id: 'c2',
          code: 'if (touchGoalFlag) { restartStage(); }',
          desc: '깃발에 닿으면 처음부터 다시 시작합니다.',
          correct: false,
          hint: '열심히 도착했는데 다시 처음으로 돌아가면 아쉽겠죠? 클리어 축하 화면을 띄우는 코드를 골라 보세요!'
        },
        {
          id: 'c3',
          code: 'if (touchGoalFlag && goalConditionMet) { triggerGameClear(); }',
          desc: '목표 조건을 채우고 깃발에 닿으면 게임 클리어를 실행합니다!',
          correct: true,
          hint: '대단해요! 이제 깃발에 닿으면 멋지게 게임 클리어가 작동합니다!'
        }
      ]
    }
  ];

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function createDefaultProject() {
    return {
      title: '모험을 떠나는 고양이',
      theme: 'meadow',
      goal: 'collect_all',
      developerName: '꼬마 개발자',
      sprites: {
        hero: getSpritePresetGrid('hero', 0),
        enemy: getSpritePresetGrid('enemy', 0),
        collectible: getSpritePresetGrid('collectible', 0)
      },
      level: parseLevelMap(LEVEL_TEMPLATES.starter.rows),
      rules: {
        speed: 5,
        jumpPower: 5,
        gravity: 5,
        doubleJump: false,
        maxHearts: 3,
        enemyHit: 'damage_stomp',
        collectEffect: 'score',
        springPower: 'normal'
      },
      audio: {
        bgm: deepClone(BGM_PRESETS.adventure.grid),
        timbre: 'chiptune',
        tempo: 'normal',
        sfx: {
          jump: 'boing',
          collect: 'coin',
          hit: 'bonk',
          win: 'fanfare'
        }
      },
      qaFixed: {
        bug1: false,
        bug2: false,
        bug3: false
      },
      meta: {
        visitedStages: { 1: true },
        artEdited: false,
        levelEdited: false,
        codeEdited: false,
        soundEdited: false,
        playedLaunch: false,
        clearedLaunch: false
      }
    };
  }

  function createDemoProject() {
    var proj = createDefaultProject();
    proj.title = '슈퍼 우주 고양이의 별빛 모험';
    proj.theme = 'space';
    proj.goal = 'collect_all';
    proj.sprites.hero = getSpritePresetGrid('hero', 0);
    proj.sprites.enemy = getSpritePresetGrid('enemy', 1);
    proj.sprites.collectible = getSpritePresetGrid('collectible', 0);
    proj.level = parseLevelMap(LEVEL_TEMPLATES.jump_heaven.rows);
    proj.rules.doubleJump = true;
    proj.rules.speed = 6;
    proj.rules.jumpPower = 6;
    proj.rules.springPower = 'super';
    proj.audio.bgm = deepClone(BGM_PRESETS.space.grid);
    proj.audio.timbre = 'chiptune';
    proj.audio.tempo = 'normal';
    proj.qaFixed = { bug1: true, bug2: true, bug3: true };
    proj.meta = {
      visitedStages: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true },
      artEdited: true,
      levelEdited: true,
      codeEdited: true,
      soundEdited: true,
      playedLaunch: false,
      clearedLaunch: false
    };
    return proj;
  }

  function saveProject(project) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadProject() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return sanitizeProject(JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }

  function clearSavedProject() {
    try {
      global.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  function sanitizeProject(raw) {
    var base = createDefaultProject();
    if (!raw || typeof raw !== 'object') return base;
    if (typeof raw.title === 'string' && raw.title.trim()) base.title = raw.title.trim().slice(0, 30);
    if (THEMES[raw.theme]) base.theme = raw.theme;
    if (GOALS[raw.goal]) base.goal = raw.goal;
    if (typeof raw.developerName === 'string' && raw.developerName.trim()) {
      base.developerName = raw.developerName.trim().slice(0, 20);
    }
    if (raw.sprites) {
      ['hero', 'enemy', 'collectible'].forEach(function (k) {
        if (Array.isArray(raw.sprites[k]) && raw.sprites[k].length === 12) {
          base.sprites[k] = raw.sprites[k];
        }
      });
    }
    if (Array.isArray(raw.level) && raw.level.length === 12 && Array.isArray(raw.level[0]) && raw.level[0].length === 24) {
      base.level = raw.level;
    }
    if (raw.rules && typeof raw.rules === 'object') {
      Object.assign(base.rules, raw.rules);
    }
    if (raw.audio && typeof raw.audio === 'object') {
      if (Array.isArray(raw.audio.bgm) && raw.audio.bgm.length === 6) {
        base.audio.bgm = raw.audio.bgm;
      }
      if (raw.audio.timbre) base.audio.timbre = raw.audio.timbre;
      if (raw.audio.tempo) base.audio.tempo = raw.audio.tempo;
      if (raw.audio.sfx) Object.assign(base.audio.sfx, raw.audio.sfx);
    }
    if (raw.qaFixed && typeof raw.qaFixed === 'object') {
      Object.assign(base.qaFixed, raw.qaFixed);
    }
    if (raw.meta && typeof raw.meta === 'object') {
      Object.assign(base.meta, raw.meta);
    }
    return base;
  }

  function encodeProjectCode(project) {
    var json = JSON.stringify(project);
    // UTF-8 safe base64 encoding
    var utf8Bytes = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, function (_, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    });
    return btoa(utf8Bytes);
  }

  function decodeProjectCode(code) {
    var trimmed = (code || '').trim();
    if (!trimmed) throw new Error('빈 코드입니다.');
    if (trimmed.charAt(0) === '{') {
      return sanitizeProject(JSON.parse(trimmed));
    }
    var binStr = atob(trimmed);
    var percentStr = Array.prototype.map.call(binStr, function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('');
    var jsonStr = decodeURIComponent(percentStr);
    return sanitizeProject(JSON.parse(jsonStr));
  }

  function computeEvaluation(project) {
    var themeName = (THEMES[project.theme] || THEMES.meadow).name;
    var goalName = (GOALS[project.goal] || GOALS.collect_all).name;

    var planScore = project.title.trim().length >= 2 ? 1.0 : 0.7;
    var artScore = project.meta.artEdited ? 1.0 : 0.85;

    var stars = 0;
    var hasSpawn = false;
    var hasGoal = false;
    var enemies = 0;
    for (var r = 0; r < project.level.length; r++) {
      for (var c = 0; c < project.level[r].length; c++) {
        var t = project.level[r][c];
        if (t === 6) stars++;
        if (t === 7) hasSpawn = true;
        if (t === 8) hasGoal = true;
        if (t === 5) enemies++;
      }
    }
    var levelScore = (hasSpawn && hasGoal && stars >= 1) ? (project.meta.levelEdited ? 1.0 : 0.9) : 0.6;
    var codeScore = project.meta.codeEdited ? 1.0 : 0.85;
    var qaCount = (project.qaFixed.bug1 ? 1 : 0) + (project.qaFixed.bug2 ? 1 : 0) + (project.qaFixed.bug3 ? 1 : 0);
    var soundAndQaScore = ((project.meta.soundEdited ? 0.5 : 0.4) + (qaCount / 3) * 0.5);

    var total = Math.min(5.0, Number((planScore + artScore + levelScore + codeScore + soundAndQaScore).toFixed(1)));

    var reviews = [
      {
        author: '초등 5학년 민수',
        stars: total >= 4.5 ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐⭐',
        text: '「' + project.title + '」의 ' + themeName + ' 배경이 정말 멋져요! ' +
          (project.rules.doubleJump ? '이단 점프로 날아다니는 손맛이 최고예요!' : '점프 타이밍 맞추는 재미가 쏠쏠해요!')
      },
      {
        author: '픽셀 장인 하은',
        stars: '⭐⭐⭐⭐⭐',
        text: '직접 그린 캐릭터와 ' + (enemies > 0 ? '몬스터 ' + enemies + '마리의 ' : '') + '움직임이 너무 귀여워요! "' + goalName + '" 목표도 딱 좋아요.'
      },
      {
        author: '게임 평론가 피코',
        stars: qaCount === 3 ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐⭐',
        text: qaCount === 3
          ? 'QA 버그 3개를 완벽히 잡아서 완성도가 프로 게임 같아요! 음악도 중독성 최고!'
          : '재미있는 아이디어예요! QA 버그까지 모두 고치면 완벽한 별 5개 명작이 될 거예요!'
      }
    ];

    return {
      total: total,
      breakdown: [
        { label: '📋 기획', score: planScore.toFixed(1) + ' / 1.0' },
        { label: '🎨 그래픽', score: artScore.toFixed(1) + ' / 1.0' },
        { label: '🗺️ 맵디자인', score: levelScore.toFixed(1) + ' / 1.0' },
        { label: '💻 규칙코딩', score: codeScore.toFixed(1) + ' / 1.0' },
        { label: '🎵 사운드&QA', score: soundAndQaScore.toFixed(1) + ' / 1.0' }
      ],
      reviews: reviews
    };
  }

  global.GameData = {
    STAGES: STAGES,
    THEMES: THEMES,
    GOALS: GOALS,
    RANDOM_TITLES: RANDOM_TITLES,
    PALETTE: PALETTE,
    SPRITE_PRESETS: SPRITE_PRESETS,
    TILE_TYPES: TILE_TYPES,
    LEVEL_TEMPLATES: LEVEL_TEMPLATES,
    RULES_CONFIG: RULES_CONFIG,
    BGM_NOTES: BGM_NOTES,
    BGM_PRESETS: BGM_PRESETS,
    SFX_OPTIONS: SFX_OPTIONS,
    QA_BUGS: QA_BUGS,
    getSpritePresetGrid: getSpritePresetGrid,
    parseLevelMap: parseLevelMap,
    deepClone: deepClone,
    createDefaultProject: createDefaultProject,
    createDemoProject: createDemoProject,
    saveProject: saveProject,
    loadProject: loadProject,
    clearSavedProject: clearSavedProject,
    encodeProjectCode: encodeProjectCode,
    decodeProjectCode: decodeProjectCode,
    computeEvaluation: computeEvaluation
  };
})(window);
