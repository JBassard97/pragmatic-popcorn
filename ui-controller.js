// document.addEventListener("DOMContentLoaded", () => {
//   // Show or hide controller per localStorage settings
//   const controller = document.getElementById("controller");
//   if (localStorage.getItem("settings")) {
//     const settings = JSON.parse(localStorage.getItem("settings"));
//     if (settings["hide-controller-setting"]) {
//       controller.style.display = "none";
//     } else {
//       controller.style.display = "flex";
//     }
//   }

//   // Attach event handlers to each controller button
//   document.querySelectorAll("button[data-btn]").forEach((button) => {
//     const btnName = button.getAttribute("data-btn");
//     const btnCode = jsnes.Controller[`BUTTON_${btnName}`];

//     button.addEventListener("touchstart", (e) => {
//       e.preventDefault();
//       nes.buttonDown(1, btnCode);
//     });

//     button.addEventListener("touchend", (e) => {
//       e.preventDefault();
//       nes.buttonUp(1, btnCode);
//     });

//     // Optional: for mouse click compatibility
//     button.addEventListener("mousedown", (e) => {
//       e.preventDefault();
//       nes.buttonDown(1, btnCode);
//     });

//     button.addEventListener("mouseup", (e) => {
//       e.preventDefault();
//       nes.buttonUp(1, btnCode);
//     });

//     button.addEventListener("mouseleave", (e) => {
//       // To release if the mouse leaves the button while held
//       nes.buttonUp(1, btnCode);
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const controller = document.getElementById("controller");

  // Respect localStorage setting for hiding the controller
  if (localStorage.getItem("settings")) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    controller.style.display = settings["hide-controller-setting"]
      ? "none"
      : "flex";
  }

  if (window.emu === "DS") {
    controller.style.display = "none";
  }

  // GBA control bitmask indices
  const gbaButtonMap = {
    A: 0,
    B: 1,
    SELECT: 2,
    START: 3,
    RIGHT: 4,
    LEFT: 5,
    UP: 6,
    DOWN: 7,
    R: 8,
    L: 9,
  };

  document.querySelectorAll("button[data-btn]").forEach((button) => {
    const btnName = button.getAttribute("data-btn");

    // NES button code
    const nesBtnCode = jsnes.Controller[`BUTTON_${btnName}`];
    // GBA bitmask shift
    const gbaBtnBit = gbaButtonMap[btnName];

    const pressButton = () => {
      if (window.emu === "NES") {
        nes.buttonDown(1, nesBtnCode);
      } else if (window.emu === "GBA" && gba && gba.keypad) {
        gba.keypad.currentDown &= ~(1 << gbaBtnBit);
      }
    };

    const releaseButton = () => {
      if (window.emu === "NES") {
        nes.buttonUp(1, nesBtnCode);
      } else if (window.emu === "GBA" && gba && gba.keypad) {
        gba.keypad.currentDown |= 1 << gbaBtnBit;
      }
    };

    // Touch events
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      pressButton();
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      releaseButton();
    });

    // Mouse events
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      pressButton();
    });

    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      releaseButton();
    });

    button.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      releaseButton();
    });
  });
});
