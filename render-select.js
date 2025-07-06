function renderSelect() {
  const selectContainer = document.querySelector("#select-container");
  selectContainer.innerHTML = ""; // Clear previous select if switching emus

  const select = document.createElement("select");
  select.id = "rom-select";
  select.style.height = "24px";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "🎮 Select a game";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  const BASE_URL = "https://jbassard97.github.io/pragmatic-popcorn";
  // const BASE_URL = "http://localhost:3000";

  const romlist = {
    NES: {
      Mario: [
        { "Super Mario Bros. 2": `${BASE_URL}/roms/nes/Mario/SMB2.nes` },
        { "Super Mario Bros. 3": `${BASE_URL}/roms/nes/Mario/SMB3.nes` },
      ],
      Zelda: [
        { "The Legend of Zelda": `${BASE_URL}/roms/nes/Zelda/LoZ1.nes` },
        {
          "Zelda II: The Adventure of Link": `${BASE_URL}/roms/nes/Zelda/LoZ2.nes`,
        },
      ],
      "Donkey Kong": [
        { "Donkey Kong": `${BASE_URL}/roms/nes/DonkeyKong/DK.nes` },
        { "Donkey Kong Jr.": `${BASE_URL}/roms/nes/DonkeyKong/DKJ.nes` },
        { "Donkey Kong 3": `${BASE_URL}/roms/nes/DonkeyKong/DK3.nes` },
      ],
      MegaMan: [
        { "Mega Man 1": `${BASE_URL}/roms/nes/MegaMan/MM1.nes` },
        { "Mega Man 2": `${BASE_URL}/roms/nes/MegaMan/MM2.nes` },
        { "Mega Man 3": `${BASE_URL}/roms/nes/MegaMan/MM3.nes` },
        { "Mega Man 4": `${BASE_URL}/roms/nes/MegaMan/MM4.nes` },
        { "Mega Man 5": `${BASE_URL}/roms/nes/MegaMan/MM5.nes` },
        { "Mega Man 6": `${BASE_URL}/roms/nes/MegaMan/MM6.nes` },
      ],
      Kirby: [{ "Kirby's Adventure": `${BASE_URL}/roms/nes/Kirby/KA.nes` }],
      Metroid: [{ Metroid: `${BASE_URL}/roms/nes/Metroid/M.nes` }],
      Castlevania: [{ Castlevania: `${BASE_URL}/roms/nes/Castlevania/C1.nes` }],
      Other: [
        { Tetris: `${BASE_URL}/roms/nes/Other/T.nes` },
        { "Duck Tales": `${BASE_URL}/roms/nes/Other/DT.nes` },
        { "Adventures of Lolo": `${BASE_URL}/roms/nes/Other/LL.nes` },
        { "Bubble Bobble": `${BASE_URL}/roms/nes/Other/BB.nes` },
        { BurgerTime: `${BASE_URL}/roms/nes/Other/BT.nes` },
        { "Kid Icarus": `${BASE_URL}/roms/nes/Other/KI.nes` },
        { Lemmings: `${BASE_URL}/roms/nes/Other/L.nes` },
        { "EarthBound Zero": `${BASE_URL}/roms/nes/Other/EZ.nes` },
        { Arkanoid: `${BASE_URL}/roms/nes/Other/A.nes` },
        { "Balloon Fight": `${BASE_URL}/roms/nes/Other/BF.nes` },
        { Yoshi: `${BASE_URL}/roms/nes/Other/Y.nes` },
        { Pictionary: `${BASE_URL}/roms/nes/Other/P.nes` },
        { Paperboy: `${BASE_URL}/roms/nes/Other/PB.nes` },
      ],
    },
    GBA: {
      Pokemon: [
        {
          "Pokemon Pinball Ruby/Sapphire": `${BASE_URL}/roms/gba/Pokemon/PPRS.gba`,
        },
        {
          "Pokemon FireRed Version": `${BASE_URL}/roms/gba/Pokemon/FR.gba`,
        },
      ],
      Zelda: [
        {
          "Legend of Zelda - The Minish Cap": `${BASE_URL}/roms/gba/Zelda/MC.gba`,
        },
      ],
    },
  };

  for (const [groupName, games] of Object.entries(romlist[window.emu])) {
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

  if (window.emu === "NES") {
    select.addEventListener("change", async (e) => {
      const path = e.target.value;
      e.target.blur();

      if (!path) return;

      if (!localStorage.getItem(`nes_save_${path}`)) {
        filteredClearNES();
      }

      romURL = path;
      window.romURL = path;
      window.currentRomPath = path;

      await nes_load_url("screen", path);

      const powerBtn = document.getElementById("power-continue");
      const clearBtn = document.getElementById("clear-save");
      const hdToggleLabel = document.getElementById("hd-toggle-label");

      if (powerBtn && !window.isPoweredOn) {
        powerBtn.textContent = "Power Off";
        powerBtn.style.color = "red";
        powerBtn.style.borderColor = "red";
        window.isPoweredOn = true;
      }

      powerBtn.style.display = "inline-block";
      clearBtn.style.display = "inline-block";
      hdToggleLabel.style.display = "inline-block";

      document.querySelector(".rom-controls").style.justifyContent =
        "space-between";
    });
  } else if (window.emu === "GBA") {
    select.addEventListener("change", async (e) => {
      const path = e.target.value;
      e.target.blur();

      if (!path) return;

      runGBA(path);
    });
  }

  selectContainer.appendChild(select);
}
