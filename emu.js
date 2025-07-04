document.addEventListener("DOMContentLoaded", () => {
  // Set default global emulation mode
  window.emu = JSON.parse(localStorage.getItem("current-emu")) || "NES";
  const select = document.getElementById("emu-select");

  // Set the select element to match the default if needed
  console.log("Current emulation mode:", window.emu);
  select.value = window.emu;

  // Update window.emu when the user changes the emulator
  select.addEventListener("change", (event) => {
    window.emu = event.target.value;
    localStorage.setItem("current-emu", JSON.stringify(event.target.value));
    renderSelect(); // update rom select for current-emu
    console.log("Current emulation mode:", window.emu);
  });

  renderSelect();
});
