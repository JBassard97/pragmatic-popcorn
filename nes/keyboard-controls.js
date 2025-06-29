// Initialize global keybindings (shared and real-time)
const defaultKeybindings = {
  ArrowUp: jsnes.Controller.BUTTON_UP,
  ArrowDown: jsnes.Controller.BUTTON_DOWN,
  ArrowLeft: jsnes.Controller.BUTTON_LEFT,
  ArrowRight: jsnes.Controller.BUTTON_RIGHT,
  a: jsnes.Controller.BUTTON_A,
  s: jsnes.Controller.BUTTON_B,
  Tab: jsnes.Controller.BUTTON_SELECT,
  Enter: jsnes.Controller.BUTTON_START,
};

if (!window.keybindings) {
  const saved = JSON.parse(localStorage.getItem("keybindings"));
  window.keybindings = saved || { ...defaultKeybindings };
  if (!saved) {
    localStorage.setItem("keybindings", JSON.stringify(window.keybindings));
  }
}

function keyboard(callback, event) {
  const player = 1;

  // Prevent unwanted behaviors like scrolling
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

  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const button = window.keybindings[key];

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
