function GameBoyAdvanceKeypad() {
  this.GAMEPAD_LEFT = 14;
  this.GAMEPAD_UP = 12;
  this.GAMEPAD_RIGHT = 15;
  this.GAMEPAD_DOWN = 13;
  this.GAMEPAD_START = 9;
  this.GAMEPAD_SELECT = 8;
  this.GAMEPAD_A = 1;
  this.GAMEPAD_B = 0;
  this.GAMEPAD_L = 4;
  this.GAMEPAD_R = 5;
  this.GAMEPAD_THRESHOLD = 0.2;

  this.A = 0;
  this.B = 1;
  this.SELECT = 2;
  this.START = 3;
  this.RIGHT = 4;
  this.LEFT = 5;
  this.UP = 6;
  this.DOWN = 7;
  this.R = 8;
  this.L = 9;

  this.currentDown = 0x03ff;
  this.eatInput = false;

  this.gamepads = [];
}

GameBoyAdvanceKeypad.prototype.keyboardHandler = function (e) {
  let toggle = null;

  switch (e.key.toLowerCase()) {
    case "enter":
      toggle = this.START;
      break;
    case "shift":
      toggle = this.SELECT;
      break;
    case "l":
      toggle = this.A;
      break;
    case "k":
      toggle = this.B;
      break;
    case "q":
      toggle = this.L;
      break;
    case "p":
      toggle = this.R;
      break;
    case "w":
      toggle = this.UP;
      break;
    case "d":
      toggle = this.RIGHT;
      break;
    case "s":
      toggle = this.DOWN;
      break;
    case "a":
      toggle = this.LEFT;
      break;
    default:
      return;
  }

  const mask = 1 << toggle;
  if (e.type === "keydown") {
    this.currentDown &= ~mask;
  } else {
    this.currentDown |= mask;
  }

  if (this.eatInput) {
    e.preventDefault();
  }
};

GameBoyAdvanceKeypad.prototype.gamepadHandler = function (gamepad) {
  let value = 0;
  if (gamepad.buttons[this.GAMEPAD_LEFT] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.LEFT;
  }
  if (gamepad.buttons[this.GAMEPAD_UP] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.UP;
  }
  if (gamepad.buttons[this.GAMEPAD_RIGHT] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.RIGHT;
  }
  if (gamepad.buttons[this.GAMEPAD_DOWN] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.DOWN;
  }
  if (gamepad.buttons[this.GAMEPAD_START] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.START;
  }
  if (gamepad.buttons[this.GAMEPAD_SELECT] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.SELECT;
  }
  if (gamepad.buttons[this.GAMEPAD_A] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.A;
  }
  if (gamepad.buttons[this.GAMEPAD_B] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.B;
  }
  if (gamepad.buttons[this.GAMEPAD_L] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.L;
  }
  if (gamepad.buttons[this.GAMEPAD_R] > this.GAMEPAD_THRESHOLD) {
    value |= 1 << this.R;
  }

  this.currentDown = ~value & 0x3ff;
};

GameBoyAdvanceKeypad.prototype.gamepadConnectHandler = function (gamepad) {
  this.gamepads.push(gamepad);
};

GameBoyAdvanceKeypad.prototype.gamepadDisconnectHandler = function (gamepad) {
  this.gamepads = this.gamepads.filter((other) => other !== gamepad);
};

GameBoyAdvanceKeypad.prototype.pollGamepads = function () {
  let navigatorList = [];
  if (navigator.webkitGetGamepads) {
    navigatorList = navigator.webkitGetGamepads();
  } else if (navigator.getGamepads) {
    navigatorList = navigator.getGamepads();
  }

  if (navigatorList.length) {
    this.gamepads = [];
  }
  for (let i = 0; i < navigatorList.length; ++i) {
    if (navigatorList[i]) {
      this.gamepads.push(navigatorList[i]);
    }
  }
  if (this.gamepads.length > 0) {
    this.gamepadHandler(this.gamepads[0]);
  }
};

GameBoyAdvanceKeypad.prototype.registerHandlers = function () {
  window.addEventListener("keydown", this.keyboardHandler.bind(this), true);
  window.addEventListener("keyup", this.keyboardHandler.bind(this), true);

  window.addEventListener(
    "gamepadconnected",
    this.gamepadConnectHandler.bind(this),
    true
  );
  window.addEventListener(
    "mozgamepadconnected",
    this.gamepadConnectHandler.bind(this),
    true
  );
  window.addEventListener(
    "webkitgamepadconnected",
    this.gamepadConnectHandler.bind(this),
    true
  );

  window.addEventListener(
    "gamepaddisconnected",
    this.gamepadDisconnectHandler.bind(this),
    true
  );
  window.addEventListener(
    "mozgamepaddisconnected",
    this.gamepadDisconnectHandler.bind(this),
    true
  );
  window.addEventListener(
    "webkitgamepaddisconnected",
    this.gamepadDisconnectHandler.bind(this),
    true
  );
};
