window.addEventListener("DOMContentLoaded", () => {
  const powerBtn = document.getElementById("power-continue");
  const clearBtn = document.getElementById("clear-save");
  const hdToggleLabel = document.getElementById("hd-toggle-label");
  const hdToggle = document.getElementById("hd-toggle");

  let isPoweredOn = false;
  let romURL = "";

  powerBtn.style.display = "none";
  clearBtn.style.display = "none";
  hdToggleLabel.style.display = "none";

  powerBtn.addEventListener("click", async () => {
    powerBtn.blur();
    if (!romURL) return;

    if (!isPoweredOn) {
      await nes_load_url("nes-canvas", romURL);
      powerBtn.textContent = "Power Off";
      powerBtn.style.color = "red";
      powerBtn.style.borderColor = "red";
      clearBtn.style.display = "inline-block";
      hdToggleLabel.style.display = "inline-block";
      isPoweredOn = true;
    } else {
      powerOff();
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
    clearSave();
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

  function renderSelect() {
    const romlist = {
      Mario: [
        { "Super Mario Bros. 2": "./roms/nes/Mario/SMB2.nes" },
        { "Super Mario Bros. 3": "../roms/nes/Mario/SMB3.nes" },
      ],
      Zelda: [
        { "The Legend of Zelda": "../roms/nes/Zelda/LoZ1.nes" },
        { "Zelda II: The Adventure of Link": "../roms/nes/Zelda/LoZ2.nes" },
      ],
      "Donkey Kong": [
        { "Donkey Kong": "../roms/nes/DonkeyKong/DK.nes" },
        { "Donkey Kong Jr.": "../roms/nes/DonkeyKong/DKJ.nes" },
      ],
      MegaMan: [
        { "Mega Man 1": "../roms/nes/MegaMan/MM1.nes" },
        { "Mega Man 2": "../roms/nes/MegaMan/MM2.nes" },
        { "Mega Man 3": "../roms/nes/MegaMan/MM3.nes" },
        { "Mega Man 4": "../roms/nes/MegaMan/MM4.nes" },
        { "Mega Man 5": "../roms/nes/MegaMan/MM5.nes" },
        { "Mega Man 6": "../roms/nes/MegaMan/MM6.nes" },
      ],
      Kirby: [{ "Kirby's Adventure": "../roms/nes/Kirby/KA.nes" }],
      Metroid: [{ Metroid: "../roms/nes/Metroid/M.nes" }],
      Castlevania: [{ Castlevania: "../roms/nes/Castlevania/C1.nes" }],
      Other: [
        { Tetris: "../roms/nes/Other/T.nes" },
        { "Duck Tales": "../roms/nes/Other/DT.nes" },
        { "Adventures of Lolo": "../roms/nes/Other/LL.nes" },
        { "Bubble Bobble": "../roms/nes/Other/BB.nes" },
        { BurgerTime: "../roms/nes/Other/BT.nes" },
      ],
    };

    const select = document.createElement("select");
    select.id = "rom-select";
    select.style.height = "24px";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "🎮 Select a game";
    // defaultOption.style.fontStyle = "italic";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    for (const [groupName, games] of Object.entries(romlist)) {
      const group = document.createElement("optgroup");
      group.label = groupName;

      games.forEach((game) => {
        const [label, value] = Object.entries(game)[0];
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        group.appendChild(option);
      });

      select.appendChild(group);
    }

    document.querySelector("#select-container").appendChild(select);

    select.addEventListener("change", async (e) => {
      const path = e.target.value;
      e.target.blur(); // Remove focus from the select element
      if (!path) return;

      // This prevents current saves from being cleared
      if (!localStorage.getItem(`nes_save_${path}`)) {
        filteredClear();
      }

      romURL = path;
      currentRomPath = path;

      await nes_load_url("nes-canvas", romURL);

      if (!isPoweredOn) {
        isPoweredOn = true;
        powerBtn.textContent = "Power Off";
        powerBtn.style.color = "red";
        powerBtn.style.borderColor = "red";
      }

      powerBtn.style.display = "inline-block";
      clearBtn.style.display = "inline-block";
      hdToggleLabel.style.display = "inline-block";

      document.querySelector(".rom-controls").style.justifyContent =
        "space-between";
    });
  }

  renderSelect();
});
