// ==================== 01. 基本設定 ====================

const BASE_W = 1366;
const BASE_H = 768;

let sceneScale = 1;
let offsetX = 0;
let offsetY = 0;

let characterScale = 1;
let sakuraScale = 1;
let wolfScale = 1;

// ==================== 02. 背景設定 ====================

let backgroundImage;
const backgroundCount = 3;

let tileWidth = 0;
let tileHeight = 0;
let backgroundCameraX = 0;
let maxCameraX = 0;

const sakuraFollowX = BASE_W * 0.3;
const moonFollowX = BASE_W * 0.7;

let cameraOwner = null;
let movementKeys = [];
let pressedKeys = new Set();

// ==================== 03. 雷擊與音效 ====================

let lightningActive = false;
let lightningStartedAt = -1;
let lightningWorldX = 0;

const lightningDuration = 1000;
const lightningCycleDuration = 4000;

let lastThunderStrike = -1;

let thunderSound;
let soundEnabled = true;
let audioUnlocked = false;
let audioAvailable = true;
let audioUnlocking = false;

// 音檔與 sketch.js 放在同一個資料夾
const thunderPath = "雷聲.mp3";

// ==================== 04. 角色圖片 ====================

const moonSprites = {
  stand: {
    path: "月/stand/stand.png",
    count: 3, height: 136
  },
  start: {
    path: "月/jump/起步.png",
    count: 2, height: 134
  },
  fly: {
    path: "月/jump/飛行.png",
    count: 1, height: 134
  },
  landing: {
    path: "月/jump/降落.png",
    count: 1, height: 129
  },
  attack: {
    path: "月/手刀/手刀.png",
    count: 5, height: 170
  },
  card: {
    path: "月/使用卡牌/使用卡牌.png",
    count: 7, height: 144
  },
  block: {
    path: "月/擋/擋.png",
    count: 2, height: 124
  },
  fall: {
    path: "月/跌倒/跌倒.png",
    count: 4, height: 156
  }
};

const sakuraSprites = {
  stand: {
    path: "櫻/站著/站.png",
    count: 4, height: 95
  },
  walk: {
    path: "櫻/走路/走路.png",
    count: 3, height: 92
  },
  fall: {
    path: "櫻/跌倒/跌倒.png",
    count: 3, height: 98
  },
  card: {
    path: "櫻/使用卡牌/使用卡牌.png",
    count: 11, height: 133
  }
};

const wolfSprites = {
  stand: {
    path: "小狼/站立/站立.png",
    count: 10, height: 86
  },
  attack: {
    path: "小狼/攻擊/攻擊.png",
    count: 13, height: 130
  },
  lightning: {
    path: "小狼/雷/雷.png",
    count: 6, height: 184
  },
  fly: {
    path: "小狼/飛/飛.png",
    count: 3, height: 157
  }
};

// ==================== 05. 月 ====================

let characterX, characterY;
let facing = -1;

const moveSpeed = 9.6;
const animationSpeed = 150;

let characterState = "stand";
let stateStartTime = 0;

let spaceHeld = false;
let cardHeld = false;
let moonBlocking = false;

let attackStartTime = 0;
let cardStartTime = 0;
let lastAttackCycle = -1;

const attackFrameSpeed = 120;
const attackPauseTime = 350;

const cardFrameSpeed = 120;
const cardPauseTime = 350;

let moonFallStartTime = 0;

// ==================== 06. 櫻 ====================

let sakuraX, sakuraY;
let sakuraFacing = 1;

const sakuraSpeed = 9.6;
const sakuraAnimationSpeed = 150;

let sakuraState = "stand";
let sakuraStateStartTime = 0;

let sakuraIsMoving = false;
let sakuraManualCard = false;
let sakuraDefense = false;

// ==================== 07. 小狼 ====================

let wolfX, wolfY;
let wolfFacing = 1;

const wolfFollowDistance = 220;
const wolfFollowSpeed = 0.18;
const wolfFrameSpeed = 120;

let wolfState = "stand";
let wolfAttackStartTime = 0;
let wolfAttackSequence = [];
let wolfWasAttacking = false;

let wolfFlyStartTime = 0;
let wolfFlyLandTime = 0;

// ==================== 08. 遊戲設定 ====================

let gameState = "play";

const WIN_SCORE = 5;
const COLLISION_DISTANCE = 115;
const RESULT_DURATION = 3000;

let sakuraScore = 0;
let moonScore = 0;
let collisionReady = true;

let currentQuestion = null;
let lastQuestionIndex = -1;

let sakuraChoice = 0;
let moonChoice = 0;

let sakuraAnswered = false;
let moonAnswered = false;

let sakuraWrong = false;
let moonWrong = false;

let resultMessage = "";
let resultStartTime = 0;
let resultHasWinner = false;
let roundWinner = "";
let gameWinner = "";

let moonResultFalling = false;
let sakuraResultFalling = false;

// ==================== 09. 震動與彩帶 ====================

const SHAKE_DURATION = 500;
const SHAKE_POWER = 16;

let shakeStartTime = -10000;
let confettiParticles = [];

const confettiColors = [
  "#FF91C4",
  "#78C6FF",
  "#FFE17B",
  "#B9A2FF",
  "#FFFFFF",
  "#9DE8CB"
];

// ==================== 10. 題庫 ====================

const questionBank = [
  {
    question: "一年有幾個月？",
    options: ["10 個", "11 個", "12 個", "13 個"],
    answer: 2
  },
  {
    question: "下列哪一個是哺乳類動物？",
    options: ["鯊魚", "海豚", "章魚", "水母"],
    answer: 1
  },
  {
    question: "太陽從哪個方向升起？",
    options: ["東方", "西方", "南方", "北方"],
    answer: 0
  },
  {
    question: "下列哪一個是質數？",
    options: ["9", "15", "17", "21"],
    answer: 2
  },
  {
    question: "水在標準大氣壓下幾度沸騰？",
    options: ["50°C", "80°C", "100°C", "120°C"],
    answer: 2
  },
  {
    question: "三角形的內角和是多少度？",
    options: ["90°", "180°", "270°", "360°"],
    answer: 1
  },
  {
    question: "哪個行星最接近太陽？",
    options: ["地球", "火星", "金星", "水星"],
    answer: 3
  },
  {
    question: "Apple 的中文是什麼？",
    options: ["蘋果", "香蕉", "葡萄", "橘子"],
    answer: 0
  },
  {
    question: "1 公里等於多少公尺？",
    options: ["10", "100", "1000", "10000"],
    answer: 2
  },
  {
    question: "臺灣最高的山是哪一座？",
    options: ["陽明山", "雪山", "玉山", "阿里山"],
    answer: 2
  },
  {
    question: "24 ÷ 6 等於多少？",
    options: ["3", "4", "5", "6"],
    answer: 1
  },
  {
    question: "植物透過什麼作用製造養分？",
    options: [
      "呼吸作用",
      "蒸散作用",
      "光合作用",
      "分解作用"
    ],
    answer: 2
  }
];

// ==================== 11. 載入圖片 ====================

function preload() {

  backgroundImage = loadImage("背景.png");

  for (const sprites of [
    moonSprites,
    sakuraSprites,
    wolfSprites
  ]) {
    for (const sprite of Object.values(sprites)) {
      sprite.img = loadImage(sprite.path);
    }
  }
}

// ==================== 12. 初始化 ====================

function setup() {

  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  calculateScale();
  calculateBackgroundSize();
  resetCharacterPositions();
  createWolfAttackSequence();
  setupThunderSound();

  // 防止切換視窗後按鍵卡住
  window.addEventListener("blur", () => {

    pressedKeys.clear();
    movementKeys = [];
    cameraOwner = null;

    clearAttackStates();

    wolfState = "stand";

    stopThunderSound();
  });
}

// ==================== 13. 雷擊音效 ====================

function setupThunderSound() {

  thunderSound = new Audio();

  thunderSound.preload = "auto";
  thunderSound.volume = 0.5;
  thunderSound.loop = false;

  // 音效載入失敗時仍可正常遊玩
  thunderSound.addEventListener("error", () => {

    audioAvailable = false;

    console.warn(
      "無法載入雷聲.mp3，請確認檔名及副檔名。"
    );
  });

  thunderSound.src = thunderPath;
}

// ==================== 14. 啟用音訊 ====================

function unlockThunderAudio() {

  if (
    audioUnlocked ||
    audioUnlocking ||
    !audioAvailable ||
    !thunderSound
  ) return;

  audioUnlocking = true;

  // 瀏覽器需要使用者先操作才能播放音效
  thunderSound.muted = true;

  thunderSound.play().then(() => {

    thunderSound.pause();
    thunderSound.currentTime = 0;
    thunderSound.muted = false;

    audioUnlocked = true;
    audioUnlocking = false;

  }).catch(() => {

    thunderSound.muted = false;

    audioUnlocked = false;
    audioUnlocking = false;
  });
}

// ==================== 15. 播放雷聲 ====================

function playThunderSound() {

  if (
    !soundEnabled ||
    !audioAvailable ||
    !audioUnlocked ||
    !thunderSound
  ) return;

  // 每次播放前停止上一個雷聲
  // 避免音效重疊
  thunderSound.pause();
  thunderSound.currentTime = 0;

  thunderSound.play().catch(() => {

    console.warn("雷擊音效暫時無法播放。");
  });
}

// ==================== 16. 停止雷聲 ====================

function stopThunderSound() {

  if (!thunderSound) return;

  thunderSound.pause();

  if (thunderSound.readyState > 0) {
    thunderSound.currentTime = 0;
  }
}

// ==================== 17. 音效開關 ====================

function toggleSound() {

  soundEnabled = !soundEnabled;

  if (!soundEnabled) {
    stopThunderSound();
  } else {
    unlockThunderAudio();
  }
}

function drawSoundButton() {

  const x = BASE_W / 2 - 85;
  const y = 20;

  push();

  rectMode(CORNER);
  noStroke();

  fill(10, 15, 40, 190);
  rect(x, y, 170, 42, 12);

  fill("#FFFFFF");
  textSize(16);
  textAlign(CENTER, CENTER);

  let message;

  if (!audioAvailable) {
    message = "音效未載入";
  } else {
    message = soundEnabled
      ? "音效：開啟（M）"
      : "音效：關閉（M）";
  }

  text(message, BASE_W / 2, y + 21);

  pop();
}

function mousePressed() {

  unlockThunderAudio();

  const x = (mouseX - offsetX) / sceneScale;
  const y = (mouseY - offsetY) / sceneScale;

  if (
    x >= BASE_W / 2 - 85 &&
    x <= BASE_W / 2 + 85 &&
    y >= 20 &&
    y <= 62
  ) {
    toggleSound();
  }
}

// ==================== 18. 角色縮放 ====================

function calculateScale() {

  sceneScale = min(
    width / BASE_W,
    height / BASE_H
  );

  offsetX = (width - BASE_W * sceneScale) / 2;
  offsetY = (height - BASE_H * sceneScale) / 2;

  // 月的站立高度為畫布高度三分之一
  const targetHeight = (height / 3) / sceneScale;

  characterScale = targetHeight / 136;

  // 三個角色採用相同縮放比例
  sakuraScale = characterScale;
  wolfScale = characterScale;
}

// ==================== 19. 背景尺寸 ====================

function calculateBackgroundSize() {

  const ratio =
    backgroundImage.width / backgroundImage.height;

  tileWidth = max(BASE_W, BASE_H * ratio);
  tileHeight = tileWidth / ratio;

  maxCameraX = max(
    0,
    tileWidth * backgroundCount - BASE_W
  );

  backgroundCameraX = constrain(
    backgroundCameraX,
    0,
    maxCameraX
  );
}

// ==================== 20. 重設角色位置 ====================

function resetCharacterPositions() {

  sakuraX = sakuraFollowX;
  sakuraY = BASE_H / 2;

  characterX = moonFollowX;
  characterY = BASE_H / 2;

  sakuraFacing = 1;
  facing = -1;

  wolfX = sakuraX - wolfFollowDistance;
  wolfY = sakuraY;
  wolfFacing = 1;

  sakuraState = "stand";
  characterState = "stand";
  wolfState = "stand";

  sakuraStateStartTime = millis();
  stateStartTime = millis();

  sakuraIsMoving = false;

  backgroundCameraX = maxCameraX / 2;
  cameraOwner = null;

  stopEndLightning();
  keepCharactersOnScreen();
}

// ==================== 21. 繪製背景 ====================

function drawBackground() {

  push();

  imageMode(CORNER);

  const backgroundY = (BASE_H - tileHeight) / 2;

  // 將三張背景橫向排列
  for (let i = 0; i < backgroundCount; i++) {

    const x = i * tileWidth - backgroundCameraX;

    image(
      backgroundImage,
      x,
      backgroundY,
      tileWidth,
      tileHeight
    );
  }

  pop();
}

// ==================== 22. 共用精靈圖繪製 ====================

function drawSprite(
  sprite,
  frame,
  x,
  y,
  scaleValue,
  direction = 1
) {

  if (!sprite || !sprite.img) return;

  const frameWidth = sprite.img.width / sprite.count;
  const frameHeight = sprite.height;

  const safeFrame = constrain(
    floor(frame),
    0,
    sprite.count - 1
  );

  push();

  translate(x, y);
  scale(direction, 1);
  imageMode(CENTER);

  image(
    sprite.img,
    0,
    0,
    frameWidth * scaleValue,
    frameHeight * scaleValue,
    safeFrame * frameWidth,
    0,
    frameWidth,
    frameHeight
  );

  pop();
}

// ==================== 23. 動畫影格計算 ====================

// 循環播放動畫
function loopFrame(sprite, startTime, speed) {

  return floor(
    (millis() - startTime) / speed
  ) % sprite.count;
}

// 只播放一次動畫
function onceFrame(sprite, startTime, speed) {

  return min(
    floor((millis() - startTime) / speed),
    sprite.count - 1
  );
}

// 播放動畫後暫停，再重新播放
function pausedFrame(
  sprite,
  startTime,
  speed,
  pauseTime
) {

  const cycleDuration =
    sprite.count * speed + pauseTime;

  const totalElapsed = millis() - startTime;
  const elapsed = totalElapsed % cycleDuration;

  return {
    frame: min(
      floor(elapsed / speed),
      sprite.count - 1
    ),
    cycle: floor(totalElapsed / cycleDuration)
  };
}

// ==================== 24. 取得角色目前圖片 ====================

function getMoonSprite() {

  if (gameState === "result") {
    return moonResultFalling
      ? moonSprites.fall
      : moonSprites.stand;
  }

  if (gameState !== "play") {
    return moonSprites.stand;
  }

  if (moonBlocking) return moonSprites.block;
  if (cardHeld) return moonSprites.card;
  if (spaceHeld) return moonSprites.attack;

  return moonSprites[characterState]
    || moonSprites.stand;
}

function getSakuraSprite() {

  if (gameState === "result") {
    return sakuraResultFalling
      ? sakuraSprites.fall
      : sakuraSprites.stand;
  }

  if (gameState !== "play") {
    return sakuraSprites.stand;
  }

  return sakuraSprites[sakuraState]
    || sakuraSprites.stand;
}

function getWolfSprite() {

  if (gameState !== "play") {
    return wolfSprites.stand;
  }

  if (wolfState === "attack") {
    return wolfSprites.attack;
  }

  if (
    wolfState === "flyStart" ||
    wolfState === "flyLoop" ||
    wolfState === "flyLand"
  ) {
    return wolfSprites.fly;
  }

  return wolfSprites.stand;
}

// ==================== 25. 限制角色移動範圍 ====================

function getHalfWidth(sprite, scaleValue) {

  return min(
    sprite.img.width / sprite.count *
    scaleValue / 2,
    BASE_W / 2
  );
}

function keepCharactersOnScreen() {

  const moonHalfWidth = getHalfWidth(
    getMoonSprite(),
    characterScale
  );

  const sakuraHalfWidth = getHalfWidth(
    getSakuraSprite(),
    sakuraScale
  );

  const wolfHalfWidth = getHalfWidth(
    getWolfSprite(),
    wolfScale
  );

  characterX = constrain(
    characterX,
    moonHalfWidth,
    BASE_W - moonHalfWidth
  );

  sakuraX = constrain(
    sakuraX,
    sakuraHalfWidth,
    BASE_W - sakuraHalfWidth
  );

  wolfX = constrain(
    wolfX,
    wolfHalfWidth,
    BASE_W - wolfHalfWidth
  );
}

// ==================== 26. 記錄按鍵順序 ====================

function isMovementKey(code) {

  return (
    code === 37 ||
    code === 39 ||
    code === 65 ||
    code === 68
  );
}

function registerMovementKey(code) {

  if (!isMovementKey(code)) return;

  if (!movementKeys.includes(code)) {
    movementKeys.push(code);
  }
}

function unregisterMovementKey(code) {

  movementKeys = movementKeys.filter(
    item => item !== code
  );
}

// ==================== 27. 取得角色移動方向 ====================

function getMoonDirection() {

  for (const code of movementKeys) {
    if (code === 37) return -1;
    if (code === 39) return 1;
  }

  return 0;
}

function getSakuraDirection() {

  if (
    sakuraState === "fall" ||
    sakuraState === "card" ||
    sakuraManualCard ||
    sakuraDefense
  ) {
    return 0;
  }

  for (const code of movementKeys) {
    if (code === 65) return -1;
    if (code === 68) return 1;
  }

  return 0;
}

// ==================== 28. 鏡頭控制權 ====================

function updateCameraOwner() {

  cameraOwner = null;

  const moonDirection = getMoonDirection();
  const sakuraDirection = getSakuraDirection();

  // 先按下有效背景捲動按鍵的角色優先
  for (const code of movementKeys) {

    if (code === 65 && sakuraDirection === -1) {
      cameraOwner = "sakura";
      break;
    }

    if (code === 39 && moonDirection === 1) {
      cameraOwner = "moon";
      break;
    }
  }
}

// ==================== 29. 移動背景 ====================

function moveCamera(distance, owner) {

  const oldCameraX = backgroundCameraX;

  backgroundCameraX = constrain(
    backgroundCameraX + distance,
    0,
    maxCameraX
  );

  const actualMovement =
    backgroundCameraX - oldCameraX;

  // 月控制背景時，櫻與小狼跟隨
  if (owner === "moon") {

    sakuraX -= actualMovement;
    wolfX -= actualMovement;
  }

  // 櫻控制背景時，月與小狼跟隨
  if (owner === "sakura") {

    characterX -= actualMovement;
    wolfX -= actualMovement;
  }

  keepCharactersOnScreen();

  return actualMovement;
}

// ==================== 30. 雙角色移動 ====================

function updateMovement() {

  const moonDirection = getMoonDirection();
  const sakuraDirection = getSakuraDirection();

  updateCameraOwner();

  let moonRemaining =
    moonDirection === 0 ? 0 : moveSpeed;

  let sakuraRemaining =
    sakuraDirection === 0 ? 0 : sakuraSpeed;

  if (moonDirection !== 0) {
    facing = moonDirection;
  }

  if (sakuraDirection !== 0) {
    sakuraFacing = sakuraDirection;
  }

  // 月向右控制背景
  if (
    cameraOwner === "moon" &&
    moonDirection === 1
  ) {

    if (characterX < moonFollowX) {

      const distance = min(
        moonRemaining,
        moonFollowX - characterX
      );

      characterX += distance;
      moonRemaining -= distance;
    }

    if (
      characterX >= moonFollowX - 0.001 &&
      moonRemaining > 0
    ) {

      const moved = moveCamera(
        moonRemaining,
        "moon"
      );

      moonRemaining -= abs(moved);
    }
  }

  // 櫻向左控制背景
  if (
    cameraOwner === "sakura" &&
    sakuraDirection === -1
  ) {

    if (sakuraX > sakuraFollowX) {

      const distance = min(
        sakuraRemaining,
        sakuraX - sakuraFollowX
      );

      sakuraX -= distance;
      sakuraRemaining -= distance;
    }

    if (
      sakuraX <= sakuraFollowX + 0.001 &&
      sakuraRemaining > 0
    ) {

      const moved = moveCamera(
        -sakuraRemaining,
        "sakura"
      );

      sakuraRemaining -= abs(moved);
    }
  }

  // 背景到達盡頭後，改由角色移動
  characterX += moonDirection * moonRemaining;
  sakuraX += sakuraDirection * sakuraRemaining;

  sakuraIsMoving = sakuraDirection !== 0;

  if (sakuraIsMoving) {

    if (sakuraState !== "walk") {
      sakuraState = "walk";
      sakuraStateStartTime = millis();
    }

  } else if (sakuraState === "walk") {

    sakuraState = "stand";
    sakuraStateStartTime = millis();
  }

  keepCharactersOnScreen();
}

// ==================== 31. 月動畫狀態 ====================

function updateCharacterState() {

  if (
    moonBlocking ||
    cardHeld ||
    spaceHeld
  ) return;

  const moving = getMoonDirection() !== 0;
  const elapsed = millis() - stateStartTime;

  if (characterState === "stand") {

    if (moving) {
      characterState = "start";
      stateStartTime = millis();
    }

  } else if (characterState === "start") {

    if (elapsed >= animationSpeed * 2) {

      characterState = moving
        ? "fly"
        : "landing";

      stateStartTime = millis();
    }

  } else if (characterState === "fly") {

    if (!moving) {
      characterState = "landing";
      stateStartTime = millis();
    }

  } else if (characterState === "landing") {

    if (moving) {

      characterState = "start";
      stateStartTime = millis();

    } else if (elapsed >= animationSpeed) {

      characterState = "stand";
      stateStartTime = millis();
    }
  }
}

// ==================== 32. 月手刀攻擊 ====================

function checkAttackHit() {

  if (gameState !== "play") return;
  if (sakuraState === "fall") return;
  if (sakuraState === "card") return;

  const distanceBetween =
    abs(characterX - sakuraX);

  const facingSakura =
    (sakuraX < characterX && facing === -1) ||
    (sakuraX > characterX && facing === 1);

  if (
    distanceBetween <= 125 * characterScale &&
    facingSakura
  ) {

    sakuraState = "fall";
    sakuraStateStartTime = millis();

    sakuraManualCard = false;
    sakuraDefense = false;
  }
}

function updateMoonAttack() {

  if (!spaceHeld) return;
  if (cardHeld || moonBlocking) return;

  const data = pausedFrame(
    moonSprites.attack,
    attackStartTime,
    attackFrameSpeed,
    attackPauseTime
  );

  if (
    data.frame >= 2 &&
    data.frame <= 3 &&
    data.cycle !== lastAttackCycle
  ) {

    lastAttackCycle = data.cycle;
    checkAttackHit();
  }
}

// ==================== 33. 繪製月 ====================

function drawCharacter() {

  const sprite = getMoonSprite();
  let frame = 0;

  if (sprite === moonSprites.stand) {

    frame = loopFrame(
      sprite, 0, animationSpeed
    );

  } else if (sprite === moonSprites.fall) {

    frame = onceFrame(
      sprite,
      moonFallStartTime,
      animationSpeed
    );

  } else if (sprite === moonSprites.block) {

    frame = 1;

  } else if (sprite === moonSprites.card) {

    frame = pausedFrame(
      sprite,
      cardStartTime,
      cardFrameSpeed,
      cardPauseTime
    ).frame;

  } else if (sprite === moonSprites.attack) {

    frame = pausedFrame(
      sprite,
      attackStartTime,
      attackFrameSpeed,
      attackPauseTime
    ).frame;

  } else if (sprite === moonSprites.start) {

    frame = onceFrame(
      sprite,
      stateStartTime,
      animationSpeed
    );
  }

  drawSprite(
    sprite,
    frame,
    characterX,
    characterY,
    characterScale,
    facing
  );
}

// ==================== 34. 櫻動畫狀態 ====================

function updateSakuraState() {

  const elapsed = millis() - sakuraStateStartTime;

  if (sakuraState === "fall") {

    if (
      elapsed >=
      sakuraSprites.fall.count *
      sakuraAnimationSpeed
    ) {

      sakuraState = "stand";
      sakuraStateStartTime = millis();
    }

    return;
  }

  if (sakuraDefense) {

    if (sakuraState !== "card") {
      sakuraStateStartTime = millis();
    }

    sakuraState = "card";
    sakuraFacing = characterX < sakuraX ? -1 : 1;

    return;
  }

  if (sakuraManualCard) {

    sakuraState = "card";
    return;
  }

  if (sakuraState === "card") {

    sakuraState = "stand";
    sakuraStateStartTime = millis();
  }
}

// ==================== 35. 櫻自動防禦 ====================

function updateSakuraDefense() {

  if (!cardHeld) {
    sakuraDefense = false;
    return;
  }

  const moonFacingSakura =
    (characterX < sakuraX && facing === 1) ||
    (characterX > sakuraX && facing === -1);

  sakuraDefense =
    moonFacingSakura &&
    sakuraState !== "fall";
}

// ==================== 36. 月自動格擋 ====================

function updateMoonBlock() {

  if (
    !sakuraManualCard ||
    sakuraState === "fall"
  ) {

    moonBlocking = false;
    return;
  }

  const sakuraFacingMoon =
    (sakuraX > characterX && sakuraFacing === -1) ||
    (sakuraX < characterX && sakuraFacing === 1);

  moonBlocking = sakuraFacingMoon;

  if (moonBlocking) {
    facing = sakuraX > characterX ? 1 : -1;
  }
}

// ==================== 37. 繪製櫻 ====================

function drawSakura() {

  const sprite = getSakuraSprite();
  let frame = 0;

  if (sprite === sakuraSprites.stand) {

    frame = loopFrame(
      sprite, 0, sakuraAnimationSpeed
    );

  } else if (sprite === sakuraSprites.fall) {

    frame = onceFrame(
      sprite,
      sakuraStateStartTime,
      sakuraAnimationSpeed
    );

  } else {

    frame = loopFrame(
      sprite,
      sakuraStateStartTime,
      sakuraAnimationSpeed
    );
  }

  drawSprite(
    sprite,
    frame,
    sakuraX,
    sakuraY,
    sakuraScale,
    sakuraFacing
  );
}

// ==================== 38. 小狼攻擊順序 ====================

function createWolfAttackSequence() {

  wolfAttackSequence = [];

  for (let i = 0; i < 11; i++) {
    wolfAttackSequence.push(i);
  }

  // 第 11、12 格重複四次
  for (let i = 0; i < 4; i++) {
    wolfAttackSequence.push(11, 12);
  }
}

// ==================== 39. 小狼跟隨櫻 ====================

function updateWolfPosition() {

  let targetX =
    sakuraX - sakuraFacing * wolfFollowDistance;

  const halfWidth = getHalfWidth(
    getWolfSprite(),
    wolfScale
  );

  targetX = constrain(
    targetX,
    halfWidth,
    BASE_W - halfWidth
  );

  wolfX = lerp(
    wolfX,
    targetX,
    wolfFollowSpeed
  );

  wolfY = lerp(
    wolfY,
    sakuraY,
    wolfFollowSpeed
  );

  wolfFacing = sakuraFacing;
}

// ==================== 40. 小狼飛行 ====================

function updateWolfFlight() {

  if (wolfWasAttacking) return;

  if (sakuraIsMoving) {

    if (
      wolfState !== "flyStart" &&
      wolfState !== "flyLoop"
    ) {

      wolfState = "flyStart";
      wolfFlyStartTime = millis();
    }

    if (
      wolfState === "flyStart" &&
      millis() - wolfFlyStartTime >=
      wolfFrameSpeed * 2
    ) {

      wolfState = "flyLoop";
    }

  } else {

    if (
      wolfState === "flyStart" ||
      wolfState === "flyLoop"
    ) {

      wolfState = "flyLand";
      wolfFlyLandTime = millis();
    }

    if (
      wolfState === "flyLand" &&
      millis() - wolfFlyLandTime >=
      wolfFrameSpeed * 3
    ) {

      wolfState = "stand";
    }
  }
}

// ==================== 41. 小狼攻擊 ====================

function updateWolfAttack() {

  const shouldAttack =
    sakuraManualCard &&
    sakuraState !== "fall";

  if (shouldAttack) {

    if (!wolfWasAttacking) {

      wolfAttackStartTime = millis();
      wolfWasAttacking = true;
    }

    wolfState = "attack";
    wolfFacing = characterX < wolfX ? -1 : 1;

  } else if (wolfWasAttacking) {

    wolfWasAttacking = false;

    wolfState = sakuraIsMoving
      ? "flyLoop"
      : "stand";
  }
}

// ==================== 42. 小狼攻擊影格 ====================

function getWolfAttackFrame() {

  const elapsed = millis() - wolfAttackStartTime;

  const duration =
    wolfAttackSequence.length * wolfFrameSpeed;

  const sequenceTime = elapsed % duration;

  const index = floor(
    sequenceTime / wolfFrameSpeed
  );

  return {
    frame: wolfAttackSequence[index],
    sequenceIndex: index,
    sequenceTime: sequenceTime
  };
}

// ==================== 43. 繪製小狼 ====================

function drawWolf() {

  const sprite = getWolfSprite();
  let frame = 0;

  if (sprite === wolfSprites.stand) {

    frame = loopFrame(
      sprite, 0, wolfFrameSpeed
    );

  } else if (sprite === wolfSprites.attack) {

    frame = getWolfAttackFrame().frame;

  } else if (sprite === wolfSprites.fly) {

    if (wolfState === "flyStart") {

      frame = min(
        floor(
          (millis() - wolfFlyStartTime) /
          wolfFrameSpeed
        ),
        1
      );

    } else if (wolfState === "flyLoop") {

      frame = 2;

    } else if (wolfState === "flyLand") {

      frame = 2 - min(
        floor(
          (millis() - wolfFlyLandTime) /
          wolfFrameSpeed
        ),
        2
      );
    }
  }

  drawSprite(
    sprite,
    frame,
    wolfX,
    wolfY,
    wolfScale,
    wolfFacing
  );
}

// ==================== 44. 小狼原本的雷擊 ====================

function getWolfLightningFrame() {

  const data = getWolfAttackFrame();

  if (data.sequenceIndex < 11) {

    return min(
      floor(data.sequenceIndex / 4),
      2
    );
  }

  const elapsed =
    data.sequenceTime - 11 * wolfFrameSpeed;

  return 3 + floor(
    (elapsed % (3 * wolfFrameSpeed)) /
    wolfFrameSpeed
  );
}

function drawWolfLightning() {

  if (gameState !== "play") return;
  if (!wolfWasAttacking) return;

  drawSprite(
    wolfSprites.lightning,
    getWolfLightningFrame(),
    characterX,
    characterY - 45 * characterScale,
    wolfScale,
    1
  );
}

// ==================== 45. 啟動背景雷擊 ====================

function startEndLightning() {

  lightningActive = true;
  lightningStartedAt = millis();
  lastThunderStrike = -1;

  // 只在觸發時記錄世界座標
  lightningWorldX =
    backgroundCameraX + BASE_W * 0.75;
}

// ==================== 46. 停止背景雷擊 ====================

function stopEndLightning() {

  lightningActive = false;
  lightningStartedAt = -1;
  lastThunderStrike = -1;

  stopThunderSound();
}

// ==================== 47. 更新背景雷擊 ====================

function updateEndLightning() {

  if (gameState !== "play") {

    if (lightningActive) {
      stopEndLightning();
    }

    return;
  }

  // 背景到達最右端時觸發
  const atRightEnd =
    backgroundCameraX >= maxCameraX - 0.001;

  if (!lightningActive && atRightEnd) {
    startEndLightning();
  }

  if (!lightningActive) return;

  // 世界座標轉換成畫面座標
  const effectX =
    lightningWorldX - backgroundCameraX;

  // 計算閃電實際顯示寬度
  const sprite = wolfSprites.lightning;

  const frameWidth =
    sprite.img.width / sprite.count;

  const lightningScale =
    BASE_H / sprite.height;

  const effectDisplayWidth = max(
    frameWidth * lightningScale,
    BASE_H * 0.2
  );

  // 閃電完全離開畫面才停止
  const effectHasExited =
    effectX - effectDisplayWidth / 2 > BASE_W;

  if (effectHasExited) {

    stopEndLightning();
    return;
  }

  // 計算動畫經過時間
  const elapsed =
    millis() - lightningStartedAt;

  const cycleElapsed =
    elapsed % lightningCycleDuration;

  // 0、1、2 為閃電，3 為爆炸
  const strikeNumber =
    floor(cycleElapsed / lightningDuration);

  // 加入循環編號，避免下一輪音效判定重複
  const cycleNumber =
    floor(elapsed / lightningCycleDuration);

  const uniqueStrikeNumber =
    cycleNumber * 4 + strikeNumber;

  // 每次閃電只播放一次音效
  if (
    strikeNumber < 3 &&
    uniqueStrikeNumber !== lastThunderStrike
  ) {

    playThunderSound();

    lastThunderStrike = uniqueStrikeNumber;
  }
}

// ==================== 48. 繪製背景雷擊 ====================

function drawEndLightning() {

  if (!lightningActive) return;

  const elapsed =
    millis() - lightningStartedAt;

  const cycleElapsed =
    elapsed % lightningCycleDuration;

  // 閃電會跟隨背景移動
  const effectX =
    lightningWorldX - backgroundCameraX;

  // 前三秒：每秒播放一次閃電
  if (cycleElapsed < 3000) {

    const sprite = wolfSprites.lightning;

    const frame = floor(
      (cycleElapsed % 1000) /
      1000 *
      sprite.count
    );

    const lightningScale =
      BASE_H / sprite.height;

    drawSprite(
      sprite,
      frame,
      effectX,
      BASE_H / 2,
      lightningScale,
      1
    );

  } else {

    // 第四秒：播放藍色爆炸
    const t = cycleElapsed - 3000;

    const frame = min(
      9,
      floor(t / 1000 * 10)
    );

    drawBlueExplosion(effectX, frame);
  }
}

// ==================== 49. 藍色爆炸 ====================

function drawBlueExplosion(x, frame) {

  const explosionHeight = BASE_H * 0.2;
  const y = BASE_H - explosionHeight / 2;

  const progress = frame / 9;

  const radius = lerp(
    explosionHeight * 0.08,
    explosionHeight * 0.5,
    progress
  );

  const alpha =
    255 * (1 - progress * 0.95);

  push();

  translate(x, y);
  noStroke();

  // 外層光暈
  fill(30, 100, 255, alpha * 0.25);
  circle(0, 0, radius * 2);

  // 中層光暈
  fill(60, 170, 255, alpha * 0.6);
  circle(0, 0, radius * 1.5);

  // 中心亮光
  fill(180, 235, 255, alpha);
  circle(0, 0, radius * 0.8);

  // 白色核心
  fill(255, 255, 255, alpha);
  circle(0, 0, radius * 0.35);

  // 向外擴散的粒子
  for (let i = 0; i < 16; i++) {

    const angle = TWO_PI * i / 16;
    const distance = radius * 0.9;

    const px = cos(angle) * distance;
    const py = sin(angle) * distance;

    fill(100, 200, 255, alpha);

    circle(
      px,
      py,
      12 * (1 - progress)
    );
  }

  // 擴散光圈
  noFill();
  stroke(100, 200, 255, alpha);

  strokeWeight(
    max(0.5, 4 * (1 - progress))
  );

  circle(0, 0, radius * 1.9);

  // 放射狀光芒
  stroke(100, 210, 255, alpha * 0.8);
  strokeWeight(2);

  for (let i = 0; i < 12; i++) {

    const angle = TWO_PI * i / 12;

    const innerRadius = radius * 0.55;
    const outerRadius = radius * 0.95;

    line(
      cos(angle) * innerRadius,
      sin(angle) * innerRadius,
      cos(angle) * outerRadius,
      sin(angle) * outerRadius
    );
  }

  pop();
}

// ==================== 50. 碰撞判定 ====================

function checkCharacterCollision() {

  if (gameState !== "play") return;
  if (!collisionReady) return;

  // 防止櫻跌倒時穿過月
  if (sakuraState === "fall") {

    if (
      characterX - sakuraX <
      COLLISION_DISTANCE
    ) {

      const middle =
        (characterX + sakuraX) / 2;

      sakuraX =
        middle - COLLISION_DISTANCE / 2;

      characterX =
        middle + COLLISION_DISTANCE / 2;

      keepCharactersOnScreen();
    }

    return;
  }

  // 碰撞後進入答題
  if (
    characterX - sakuraX <=
    COLLISION_DISTANCE
  ) {

    collisionReady = false;
    startQuiz();
  }
}

// ==================== 51. 清除攻擊狀態 ====================

function clearAttackStates() {

  spaceHeld = false;
  cardHeld = false;

  sakuraManualCard = false;
  sakuraDefense = false;

  moonBlocking = false;
  wolfWasAttacking = false;
}

// ==================== 52. 開始答題 ====================

function startQuiz() {

  gameState = "quiz";

  clearAttackStates();

  movementKeys = [];
  cameraOwner = null;

  stopEndLightning();
  resetCharacterPositions();

  sakuraChoice = 0;
  moonChoice = 0;

  sakuraAnswered = false;
  moonAnswered = false;

  sakuraWrong = false;
  moonWrong = false;

  moonResultFalling = false;
  sakuraResultFalling = false;

  resultMessage = "";
  resultHasWinner = false;
  roundWinner = "";

  let index = floor(
    random(questionBank.length)
  );

  // 避免連續出現相同題目
  if (questionBank.length > 1) {

    while (index === lastQuestionIndex) {

      index = floor(
        random(questionBank.length)
      );
    }
  }

  lastQuestionIndex = index;
  currentQuestion = questionBank[index];
}

// ==================== 53. 選擇答案 ====================

function moveQuizChoice(player, direction) {

  if (gameState !== "quiz") return;

  if (player === "sakura") {

    if (sakuraAnswered) return;

    sakuraChoice =
      (sakuraChoice + direction + 4) % 4;

  } else {

    if (moonAnswered) return;

    moonChoice =
      (moonChoice + direction + 4) % 4;
  }
}

// ==================== 54. 確認答案 ====================

function submitQuizAnswer(player) {

  if (gameState !== "quiz") return;

  let selectedAnswer;

  if (player === "sakura") {

    if (sakuraAnswered) return;
    selectedAnswer = sakuraChoice;

  } else {

    if (moonAnswered) return;
    selectedAnswer = moonChoice;
  }

  const isCorrect =
    selectedAnswer === currentQuestion.answer;

  // 答對加一分
  if (isCorrect) {

    resultHasWinner = true;
    roundWinner = player;

    if (player === "sakura") {

      sakuraScore++;
      resultMessage = "櫻答對了！+1 分";

    } else {

      moonScore++;
      resultMessage = "月答對了！+1 分";
    }

    finishQuiz();
    return;
  }

  // 答錯扣分並震動
  shakeStartTime = millis();

  if (player === "sakura") {

    sakuraScore--;
    sakuraWrong = true;
    sakuraAnswered = true;

  } else {

    moonScore--;
    moonWrong = true;
    moonAnswered = true;
  }

  // 雙方都答錯
  if (sakuraAnswered && moonAnswered) {

    resultHasWinner = false;
    roundWinner = "";

    resultMessage =
      "雙方都答錯！各扣 1 分";

    finishQuiz();
  }
}

// ==================== 55. 產生彩帶 ====================

function createConfetti() {

  confettiParticles = [];

  for (let i = 0; i < 180; i++) {

    confettiParticles.push({

      x: random(0, BASE_W),
      y: random(-BASE_H, -20),

      vx: random(-1.5, 1.5),
      vy: random(2, 5),

      w: random(6, 13),
      h: random(10, 22),

      color: random(confettiColors),

      angle: random(TWO_PI),
      rotationSpeed: random(-0.08, 0.08)
    });
  }
}

// ==================== 56. 繪製彩帶 ====================

function drawConfetti() {

  if (gameState !== "result") return;
  if (!resultHasWinner) return;

  push();

  rectMode(CENTER);
  noStroke();

  for (const particle of confettiParticles) {

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.angle += particle.rotationSpeed;

    if (particle.y > BASE_H + 20) {

      particle.y = random(-100, -20);
      particle.x = random(0, BASE_W);
    }

    push();

    translate(particle.x, particle.y);
    rotate(particle.angle);

    fill(particle.color);

    rect(
      0,
      0,
      particle.w,
      particle.h,
      2
    );

    pop();
  }

  pop();
}

// ==================== 57. 答題結束 ====================

function finishQuiz() {

  gameState = "result";
  resultStartTime = millis();

  clearAttackStates();

  movementKeys = [];
  cameraOwner = null;

  if (resultHasWinner) {

    createConfetti();

  } else {

    confettiParticles = [];
  }

  moonResultFalling =
    moonWrong || roundWinner === "sakura";

  sakuraResultFalling =
    sakuraWrong || roundWinner === "moon";

  if (moonResultFalling) {
    moonFallStartTime = millis();
  }

  if (sakuraResultFalling) {

    sakuraState = "fall";
    sakuraStateStartTime = millis();

  } else {

    sakuraState = "stand";
  }

  wolfState = "stand";
}

// ==================== 58. 更新答題結果 ====================

function updateQuizResult() {

  if (gameState !== "result") return;

  const now = millis();

  if (
    moonResultFalling &&
    now - moonFallStartTime >=
    moonSprites.fall.count * animationSpeed
  ) {

    moonResultFalling = false;
    characterState = "stand";
    stateStartTime = now;
  }

  if (
    sakuraResultFalling &&
    now - sakuraStateStartTime >=
    sakuraSprites.fall.count *
    sakuraAnimationSpeed
  ) {

    sakuraResultFalling = false;
    sakuraState = "stand";
    sakuraStateStartTime = now;
  }

  if (
    now - resultStartTime <
    RESULT_DURATION
  ) return;

  confettiParticles = [];

  moonResultFalling = false;
  sakuraResultFalling = false;

  resetCharacterPositions();

  sakuraWrong = false;
  moonWrong = false;

  sakuraAnswered = false;
  moonAnswered = false;

  // 先取得五分的人獲勝
  if (sakuraScore >= WIN_SCORE) {

    gameWinner = "櫻";
    gameState = "over";
    return;
  }

  if (moonScore >= WIN_SCORE) {

    gameWinner = "月";
    gameState = "over";
    return;
  }

  gameState = "play";
  collisionReady = true;
}

// ==================== 59. 分數顯示 ====================

function drawScores() {

  push();

  textStyle(BOLD);
  textSize(30);

  textAlign(LEFT, CENTER);
  fill("#FFB4D5");

  text(
    "櫻  " + sakuraScore + "/" + WIN_SCORE,
    35,
    45
  );

  textAlign(RIGHT, CENTER);
  fill("#A9D9FF");

  text(
    "月  " + moonScore + "/" + WIN_SCORE,
    BASE_W - 35,
    45
  );

  pop();
}

// ==================== 60. 答題頭像 ====================

function drawQuizAvatar(player, x, y) {

  const isSakura = player === "sakura";

  const sprite = isSakura
    ? sakuraSprites.stand
    : moonSprites.stand;

  const frameWidth =
    sprite.img.width / sprite.count;

  push();

  stroke(
    isSakura ? "#FF9AC8" : "#8FCBFF"
  );

  strokeWeight(3);
  fill("#FFFFFF");

  ellipse(x, y, 68, 68);

  const avatarScale = min(
    58 / frameWidth,
    58 / sprite.height
  );

  drawSprite(
    sprite,
    0,
    x,
    y,
    avatarScale,
    1
  );

  pop();
}

// ==================== 61. 答題畫面 ====================

function drawQuiz() {

  if (gameState !== "quiz") return;

  push();

  noStroke();
  fill(8, 13, 35, 190);

  rectMode(CORNER);
  rect(0, 0, BASE_W, BASE_H);

  rectMode(CENTER);

  fill("#FFFFFF");
  stroke("#D9D5FF");
  strokeWeight(4);

  rect(
    BASE_W / 2,
    135,
    850,
    125,
    22
  );

  noStroke();
  fill("#252342");

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(28);

  rectMode(CORNER);

  text(
    currentQuestion.question,
    BASE_W / 2 - 395,
    135 - 52.5,
    790,
    105
  );

  drawPlayerQuizPanel(
    "sakura",
    355,
    420
  );

  drawPlayerQuizPanel(
    "moon",
    1011,
    420
  );

  pop();
}

// ==================== 62. 玩家答題選項 ====================

function drawPlayerQuizPanel(player, x, y) {

  const isSakura = player === "sakura";

  const borderColor = isSakura
    ? "#FF91C4"
    : "#78C6FF";

  const selectedColor = isSakura
    ? "#FFD4E7"
    : "#CDEBFF";

  const selectedIndex = isSakura
    ? sakuraChoice
    : moonChoice;

  const alreadyAnswered = isSakura
    ? sakuraAnswered
    : moonAnswered;

  push();

  rectMode(CENTER);

  stroke(borderColor);
  strokeWeight(4);
  fill("#FFFFFF");

  rect(x, y, 460, 450, 24);

  drawQuizAvatar(
    player,
    x - 170,
    y - 172
  );

  noStroke();
  fill("#292344");

  textAlign(LEFT, CENTER);
  textSize(24);
  textStyle(BOLD);

  text(
    isSakura ? "櫻的答案" : "月的答案",
    x - 125,
    y - 172
  );

  for (let i = 0; i < 4; i++) {

    const optionY = y - 90 + i * 75;

    rectMode(CENTER);

    if (i === selectedIndex) {

      fill(selectedColor);
      stroke(borderColor);
      strokeWeight(4);

    } else {

      fill("#F7F7FC");
      stroke("#DDDEEA");
      strokeWeight(2);
    }

    rect(
      x,
      optionY,
      390,
      59,
      12
    );

    noStroke();
    fill("#292344");

    textSize(20);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);

    rectMode(CORNER);

    text(
      currentQuestion.options[i],
      x - 180,
      optionY - 26,
      360,
      52
    );
  }

  noStroke();
  fill("#44445F");

  textAlign(CENTER, CENTER);
  textSize(17);

  if (alreadyAnswered) {

    text(
      "答錯！-1 分，等待另一方",
      x,
      y + 196
    );

  } else {

    text(
      isSakura
        ? "W / S 選擇　A / D 確認"
        : "↑ / ↓ 選擇　空白鍵確認",
      x,
      y + 196
    );
  }

  pop();
}

// ==================== 63. 答題結果 ====================

function drawQuizResult() {

  if (gameState !== "result") return;

  push();

  rectMode(CENTER);

  stroke(
    resultHasWinner
      ? "#E3DAFF"
      : "#FF9A9A"
  );

  strokeWeight(4);
  fill("#FFFFFF");

  rect(
    BASE_W / 2,
    145,
    750,
    115,
    20
  );

  noStroke();

  fill(
    resultHasWinner
      ? "#292344"
      : "#B93C4B"
  );

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(30);

  text(
    resultMessage,
    BASE_W / 2,
    145
  );

  pop();
}

// ==================== 64. 勝利畫面 ====================

function drawGameOver() {

  if (gameState !== "over") return;

  push();

  rectMode(CORNER);
  noStroke();
  fill(8, 10, 30, 210);

  rect(0, 0, BASE_W, BASE_H);

  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  fill("#FFF0B0");
  textSize(55);

  text(
    gameWinner + "獲得勝利！",
    BASE_W / 2,
    BASE_H / 2 - 85
  );

  fill("#FFFFFF");
  textSize(32);

  text(
    "櫻 " + sakuraScore +
    "　：　" +
    moonScore + " 月",
    BASE_W / 2,
    BASE_H / 2
  );

  textStyle(NORMAL);
  textSize(22);

  text(
    "按 R 重新開始遊戲",
    BASE_W / 2,
    BASE_H / 2 + 90
  );

  pop();
}

// ==================== 65. 重新開始 ====================

function restartGame() {

  sakuraScore = 0;
  moonScore = 0;

  gameState = "play";
  gameWinner = "";

  resultMessage = "";
  resultHasWinner = false;
  roundWinner = "";

  sakuraChoice = 0;
  moonChoice = 0;

  sakuraAnswered = false;
  moonAnswered = false;

  sakuraWrong = false;
  moonWrong = false;

  moonResultFalling = false;
  sakuraResultFalling = false;

  currentQuestion = null;
  lastQuestionIndex = -1;

  clearAttackStates();

  movementKeys = [];
  cameraOwner = null;

  confettiParticles = [];
  shakeStartTime = -10000;

  stopEndLightning();

  collisionReady = true;

  resetCharacterPositions();
}

// ==================== 66. 操作提示 ====================

function drawControlPanel(x, title, content) {

  const panelWidth = 220;
  const panelHeight = 120;

  const y = BASE_H - panelHeight - 25;

  push();

  rectMode(CORNER);
  noStroke();

  fill(10, 15, 40, 175);

  rect(
    x,
    y,
    panelWidth,
    panelHeight,
    14
  );

  fill("#FFFFFF");
  textAlign(LEFT, TOP);

  textSize(18);
  textStyle(BOLD);

  text(
    title,
    x + 16,
    y + 12
  );

  textStyle(NORMAL);
  textSize(14);

  text(
    content,
    x + 16,
    y + 42
  );

  pop();
}

function drawControls() {

  drawControlPanel(
    25,
    "櫻｜操作",
    "A　向左移動\nD　向右移動\nS　使用卡牌"
  );

  drawControlPanel(
    BASE_W - 220 - 25,
    "月｜操作",
    "← →　移動\n↑　手刀\n空白鍵　使用卡牌"
  );
}

// ==================== 67. 鍵盤按下 ====================

function keyPressed() {

  // 使用者操作後啟用音訊
  unlockThunderAudio();

  // 避免長按按鍵造成重複觸發
  if (pressedKeys.has(keyCode)) {
    return false;
  }

  pressedKeys.add(keyCode);

  // M 鍵切換音效
  if (keyCode === 77) {

    toggleSound();
    return false;
  }

  // 遊戲結束後按 R 重新開始
  if (gameState === "over") {

    if (keyCode === 82) {
      restartGame();
    }

    return false;
  }

  // 答題操作
  if (gameState === "quiz") {

    if (keyCode === UP_ARROW) {

      moveQuizChoice("moon", -1);

    } else if (keyCode === DOWN_ARROW) {

      moveQuizChoice("moon", 1);

    } else if (keyCode === 32) {

      submitQuizAnswer("moon");

    } else if (keyCode === 87) {

      moveQuizChoice("sakura", -1);

    } else if (keyCode === 83) {

      moveQuizChoice("sakura", 1);

    } else if (
      keyCode === 65 ||
      keyCode === 68
    ) {

      submitQuizAnswer("sakura");
    }

    return false;
  }

  if (gameState === "result") {
    return false;
  }

  registerMovementKey(keyCode);

  // 月使用手刀
  if (keyCode === UP_ARROW) {

    if (!spaceHeld) {

      spaceHeld = true;
      attackStartTime = millis();
      lastAttackCycle = -1;
    }
  }

  // 月使用卡牌
  if (keyCode === 32) {

    if (!cardHeld) {

      cardHeld = true;
      cardStartTime = millis();
    }
  }

  // 櫻使用卡牌
  if (keyCode === 83) {

    if (
      !sakuraManualCard &&
      !sakuraDefense &&
      sakuraState !== "fall"
    ) {

      sakuraManualCard = true;
      sakuraState = "card";
      sakuraStateStartTime = millis();
    }
  }

  return false;
}

// ==================== 68. 鍵盤放開 ====================

function keyReleased() {

  pressedKeys.delete(keyCode);

  unregisterMovementKey(keyCode);

  if (gameState !== "play") {

    cameraOwner = null;
    return false;
  }

  if (keyCode === UP_ARROW) {
    spaceHeld = false;
  }

  if (keyCode === 32) {

    cardHeld = false;
    sakuraDefense = false;
  }

  if (keyCode === 83) {

    sakuraManualCard = false;
    wolfWasAttacking = false;

    wolfState = sakuraIsMoving
      ? "flyLoop"
      : "stand";
  }

  updateCameraOwner();

  return false;
}

// ==================== 69. 畫面震動 ====================

function getShakeOffset() {

  const elapsed =
    millis() - shakeStartTime;

  if (elapsed >= SHAKE_DURATION) {

    return { x: 0, y: 0 };
  }

  const strength =
    SHAKE_POWER *
    (1 - elapsed / SHAKE_DURATION);

  return {
    x: random(-strength, strength),
    y: random(-strength, strength)
  };
}

// ==================== 70. 主程式 ====================

function draw() {

  background("#101C45");

  if (gameState === "play") {

    updateSakuraDefense();
    updateSakuraState();

    updateMovement();

    updateCharacterState();
    updateMoonBlock();
    updateMoonAttack();

    updateWolfPosition();
    updateWolfAttack();
    updateWolfFlight();

    keepCharactersOnScreen();

    checkCharacterCollision();

  } else if (gameState === "result") {

    updateQuizResult();
  }

  // 更新背景雷擊、音效與退場
  updateEndLightning();

  keepCharactersOnScreen();

  push();

  translate(offsetX, offsetY);
  scale(sceneScale);

  // 限制遊戲繪製範圍
  drawingContext.save();
  drawingContext.beginPath();

  drawingContext.rect(
    0,
    0,
    BASE_W,
    BASE_H
  );

  drawingContext.clip();

  // 繪製背景
  drawBackground();

  push();

  // 畫面震動
  const shake = getShakeOffset();

  translate(shake.x, shake.y);

  // 繪製角色
  drawCharacter();
  drawWolf();
  drawSakura();

  // 小狼原本的雷擊攻擊
  drawWolfLightning();

  // 背景盡頭的雷擊及爆炸
  drawEndLightning();

  // 操作提示及分數
  drawControls();
  drawScores();

  // 答題畫面
  if (gameState === "quiz") {

    drawQuiz();
  }

  // 答題結果及彩帶
  if (gameState === "result") {

    drawConfetti();
    drawQuizResult();
  }

  // 勝利畫面
  if (gameState === "over") {

    drawGameOver();
  }

  pop();

  // 音效開關
  drawSoundButton();

  drawingContext.restore();

  pop();
}

// ==================== 71. 視窗縮放 ====================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  calculateScale();
  calculateBackgroundSize();

  keepCharactersOnScreen();
}