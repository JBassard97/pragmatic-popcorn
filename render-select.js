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

  for (const [groupName, games] of Object.entries(romlist[window.emu])) {
    const group = document.createElement("optgroup");
    group.label = groupName;

    games.forEach((game) => {
      const [label, value] = Object.entries(game)[0];
      const option = document.createElement("option");
      option.value = value;

      if (window.emu === "NES" && hasSaveNES(value)) {
        option.textContent = label + " (Continue)";
      } else {
        option.textContent = label;
      }
      group.appendChild(option);
    });

    select.appendChild(group);
  }

  if (window.emu === "NES") {
    select.addEventListener("change", async (e) => {
      const path = e.target.value;
      e.target.blur();

      if (!path) return;

      const existingKey = Object.keys(localStorage).find((k) =>
        k.startsWith("nes_save_")
      );

      if (existingKey && !existingKey.endsWith(path)) {
        if (audio_ctx) {
          await audio_ctx.suspend();
        }
        if (
          confirm(
            "Save data already exists for another ROM. Playing this one will overwrite it. Do you want to continue?"
          )
        ) {
          clearSaveNES();
        } else {
          await nes_load_url("screen", romURL);
          if (audio_ctx) {
            await audio_ctx.resume();
          }
          return;
        }
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

      renderSelect(); // Refreshing select erases any instance of (Continue)
    });
  } else if (window.emu === "GBA") {
    select.addEventListener("change", async (e) => {
      const path = e.target.value;
      e.target.blur();

      if (!path) return;

      // Temp pausing the emu to prevent stacking memory issues
      if (!gba.paused) {
        gba.pause();
      }

      // Allows audio to play
      await gba.audio.context.resume();
      runGBA(path);
    });
  }

  selectContainer.appendChild(select);
}
