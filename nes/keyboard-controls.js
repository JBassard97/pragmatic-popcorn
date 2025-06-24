function keyboard(callback, event) {
  var player = 1;

  if (
    [
      "Shift",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ].includes(event.key)
  ) {
    event.preventDefault();
  }

  switch (event.keyCode) {
    case 38:
      callback(player, jsnes.Controller.BUTTON_UP);
      break;
    case 40:
      callback(player, jsnes.Controller.BUTTON_DOWN);
      break;
    case 37:
      callback(player, jsnes.Controller.BUTTON_LEFT);
      break;
    case 39:
      callback(player, jsnes.Controller.BUTTON_RIGHT);
      break;
    case 65:
    case 81:
      callback(player, jsnes.Controller.BUTTON_A);
      break;
    case 83:
    case 79:
      callback(player, jsnes.Controller.BUTTON_B);
      break;
    case 9:
      callback(player, jsnes.Controller.BUTTON_SELECT);
      break;
    case 13:
      callback(player, jsnes.Controller.BUTTON_START);
      break;
  }
}

document.addEventListener("keydown", (event) => {
  keyboard(nes.buttonDown, event);
});
document.addEventListener("keyup", (event) => {
  keyboard(nes.buttonUp, event);
});

// -------------------------


