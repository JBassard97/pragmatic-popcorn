document.addEventListener("DOMContentLoaded", () => {
  // Set default global emulation mode
  window.emu = JSON.parse(localStorage.getItem("current-emu")) || "NES";
  const select = document.getElementById("emu-select");

  // Set document title to match emu mode
  document.title = window.emu + " Emulator";

  // Set the select element to match the default if needed
  console.log("Current emulation mode:", window.emu);
  select.value = window.emu;

  const canvas = document.getElementById("screen");
  canvas.setAttribute("data-emu", window.emu);

  // Update window.emu when the user changes the emulator
  select.addEventListener("change", (event) => {
    window.emu = event.target.value;
    document.title = window.emu + " Emulator";
    canvas.setAttribute("data-emu", window.emu);
    localStorage.setItem("current-emu", JSON.stringify(event.target.value));
    renderSelect(); // update rom select for current-emu
    console.log("Current emu mode:", window.emu);
  });

  renderSelect();
});
