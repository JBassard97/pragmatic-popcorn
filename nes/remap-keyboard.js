document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("remap-keyboard");

  // Ensure global keybindings exist
  if (!window.keybindings) {
    const saved = JSON.parse(localStorage.getItem("keybindings"));
    window.keybindings = saved || { ...defaultKeybindings };
    if (!saved) {
      localStorage.setItem("keybindings", JSON.stringify(window.keybindings));
    }
  }

  const buttonMap = {
    BUTTON_UP: "ArrowUp",
    BUTTON_DOWN: "ArrowDown",
    BUTTON_LEFT: "ArrowLeft",
    BUTTON_RIGHT: "ArrowRight",
    BUTTON_A: "a",
    BUTTON_B: "s",
    BUTTON_START: "Enter",
    BUTTON_SELECT: "Tab",
  };

  for (const [button, defaultKey] of Object.entries(buttonMap)) {
    const input =
      dialog.querySelector(`input[for="${button}"]`) ||
      dialog.querySelector(`input[id="${button}"]`);
    if (input) {
      const foundKey = Object.entries(window.keybindings).find(
        ([k, v]) => v === jsnes.Controller[button]
      );
      input.placeholder = foundKey ? foundKey[0] : defaultKey;
      input.value = "";
    }
  }

  dialog.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      e.preventDefault();
      const newKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const nesButton = input.parentElement.getAttribute("for");

      // Remove any old key bound to this button
      for (const [k, v] of Object.entries(window.keybindings)) {
        if (v === jsnes.Controller[nesButton]) {
          delete window.keybindings[k];
        }
      }

      // Remove any existing assignment to newKey
      if (window.keybindings[newKey]) {
        delete window.keybindings[newKey];
      }

      // Assign new key
      window.keybindings[newKey] = jsnes.Controller[nesButton];
      localStorage.setItem("keybindings", JSON.stringify(window.keybindings));

      input.value = "";
      input.placeholder = newKey;
    });
  });
});
