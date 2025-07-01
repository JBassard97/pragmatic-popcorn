window.addEventListener("DOMContentLoaded", () => {
  const powerBtn = document.getElementById("power-continue");
  const clearBtn = document.getElementById("clear-save");
  const hdToggleLabel = document.getElementById("hd-toggle-label");
  const hdToggle = document.getElementById("hd-toggle");

  let isPoweredOn = false;
  // let romURL = "";

  powerBtn.style.display = "none";
  clearBtn.style.display = "none";
  hdToggleLabel.style.display = "none";

  powerBtn.addEventListener("click", async () => {
    console.log("romURL when powerBtn fired: ", romURL);
    if (!romURL) return;

    console.log("isPoweredOn when powerBtn fired: ", isPoweredOn);
    if (!isPoweredOn) {
      await nes_load_url("screen", romURL);
      powerBtn.textContent = "Power Off";
      powerBtn.style.color = "red";
      powerBtn.style.borderColor = "red";
      clearBtn.style.display = "inline-block";
      hdToggleLabel.style.display = "inline-block";
      isPoweredOn = true;
    } else {
      powerOffNES();
      powerBtn.textContent = "Power On";
      powerBtn.style.color = "limegreen";
      powerBtn.style.borderColor = "limegreen";
      clearBtn.style.display = "none";
      hdToggleLabel.style.display = "none";
      isPoweredOn = false;
    }
  });

  clearBtn.addEventListener("click", () => {
    clearBtn.blur();
    clearSaveNES();
  });

  hdToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.getElementById("nes-canvas").style.imageRendering = "pixelated";
    } else {
      document.getElementById("nes-canvas").style.imageRendering = "auto";
    }
  });

  // Initialize rewind controls (if rewind module is loaded)
  if (typeof initializeRewindControls === "function") {
    initializeRewindControls("rewind", "r"); // button ID, keyboard key
  }
});
