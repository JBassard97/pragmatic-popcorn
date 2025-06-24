document.addEventListener("DOMContentLoaded", () => {
  // Show or hide controller per localStorage settings
  const controller = document.getElementById("controller");
  if (localStorage.getItem("settings")) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings["hide-controller-setting"]) {
      controller.style.display = "none";
    } else {
      controller.style.display = "flex";
    }
  }

  // Attach event handlers to each controller button
  document.querySelectorAll("button[data-btn]").forEach((button) => {
    const btnName = button.getAttribute("data-btn");
    const btnCode = jsnes.Controller[`BUTTON_${btnName}`];

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      nes.buttonDown(1, btnCode);
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      nes.buttonUp(1, btnCode);
    });

    // Optional: for mouse click compatibility
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      nes.buttonDown(1, btnCode);
    });

    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      nes.buttonUp(1, btnCode);
    });

    button.addEventListener("mouseleave", (e) => {
      // To release if the mouse leaves the button while held
      nes.buttonUp(1, btnCode);
    });
  });
});
