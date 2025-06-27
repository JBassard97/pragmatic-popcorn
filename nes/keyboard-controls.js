function keyboard(callback, event) {
  const player = 1;

  // Prevent scrolling/tabbing for certain keys
  const keysToPrevent = [
    "Shift",
    "Tab",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ];
  if (keysToPrevent.includes(event.key)) {
    event.preventDefault();
  }

  const keybindings = {
    ArrowUp: jsnes.Controller.BUTTON_UP,
    ArrowDown: jsnes.Controller.BUTTON_DOWN,
    ArrowLeft: jsnes.Controller.BUTTON_LEFT,
    ArrowRight: jsnes.Controller.BUTTON_RIGHT,
    a: jsnes.Controller.BUTTON_A,
    q: jsnes.Controller.BUTTON_A,
    s: jsnes.Controller.BUTTON_B,
    o: jsnes.Controller.BUTTON_B,
    Tab: jsnes.Controller.BUTTON_SELECT,
    Enter: jsnes.Controller.BUTTON_START,
  };

  const button = keybindings[event.key];
  if (button !== undefined) {
    callback(player, button);
  }
}

document.addEventListener("keydown", (event) => {
  keyboard(nes.buttonDown, event);
});

document.addEventListener("keyup", (event) => {
  keyboard(nes.buttonUp, event);
});
