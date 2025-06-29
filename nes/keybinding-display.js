function renderKeybindingsDisplay(containerId = "bindings-list") {
  const container = document.getElementById(containerId);
  if (!container || !window.keybindings) return;

  // Clear the container
  container.innerHTML = "";

  const buttonLabels = {
    [jsnes.Controller.BUTTON_UP]: "UP",
    [jsnes.Controller.BUTTON_DOWN]: "DOWN",
    [jsnes.Controller.BUTTON_LEFT]: "LEFT",
    [jsnes.Controller.BUTTON_RIGHT]: "RIGHT",
    [jsnes.Controller.BUTTON_A]: "A",
    [jsnes.Controller.BUTTON_B]: "B",
    [jsnes.Controller.BUTTON_START]: "START",
    [jsnes.Controller.BUTTON_SELECT]: "SELECT",
  };

  // Reverse keybindings: NES_BUTTON => key
  const reverseBindings = {};
  for (const [key, btn] of Object.entries(window.keybindings)) {
    reverseBindings[btn] = key;
  }

  // Render
  Object.entries(buttonLabels).forEach(([btn, label]) => {
    const key = reverseBindings[btn] || "(unbound)";
    const p = document.createElement("p");
      p.className = "keybinding";
      p.style.fontSize = "15px";

    const labelSpan = document.createElement("span");
    labelSpan.className = "key-label";
    labelSpan.style.color = "cornflowerblue";
    labelSpan.textContent = `${label}: `;

    const keySpan = document.createElement("kbd");
    keySpan.className = "key-value";
    // keySpan.style.color = "salmon";
    keySpan.textContent = key.toUpperCase();

    p.appendChild(labelSpan);
    p.appendChild(keySpan);
    container.appendChild(p);
  });
}
