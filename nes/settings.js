document.addEventListener("DOMContentLoaded", () => {
  const autoSaveCheckbox = document.getElementById("auto-save-setting");
  const rewindCheckbox = document.getElementById("rewind-setting");
  const rewindBtn = document.getElementById("rewind");
  const prefersHDCheckbox = document.getElementById("prefers-hd-setting");
  const hdToggle = document.getElementById("hd-toggle");
  const hideControllerCheckbox = document.getElementById(
    "hide-controller-setting"
  );
  const hideKeybindingsCheckbox = document.getElementById(
    "hide-keybindings-setting"
  );

  // Init settings object in localStorage if it doesn't exist
  if (!localStorage.getItem("settings")) {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "auto-save-setting": true,
        "rewind-setting": false,
        "prefers-hd-setting": false,
        "hide-controller-setting": false,
        "hide-keybinding-setting": false,
      })
    );
  } else {
    // Ensure checkboxes reflect localStorage

    const settings = JSON.parse(localStorage.getItem("settings"));
    autoSaveCheckbox.checked = settings["auto-save-setting"];
    rewindCheckbox.checked = settings["rewind-setting"];
    // ---------------------------
    rewindCheckbox.checked = settings["rewind-setting"];
    if (rewindCheckbox.checked) {
      rewindBtn.style.display = "inline-block";
    } else {
      rewindBtn.style.display = "none";
    }
    // ---------------------------
    prefersHDCheckbox.checked = settings["prefers-hd-setting"];
    if (prefersHDCheckbox.checked) {
      hdToggle.checked = true;
      document.getElementById("nes-canvas").style.imageRendering = "pixelated";
    }
    // ---------------------------
    hideControllerCheckbox.checked = settings["hide-controller-setting"];
    if (hideControllerCheckbox.checked) {
      document.getElementById("controller").style.display = "none";
    }
    // ----------------------------
    hideKeybindingsCheckbox.checked = settings["hide-keybindings-setting"];
    if (hideKeybindingsCheckbox.checked) {
      document.getElementById("bindings-list").style.display = "none";
    }
  }

  // Toggle settings in localStorage
  for (const checkbox of [
    autoSaveCheckbox,
    rewindCheckbox,
    prefersHDCheckbox,
    hideControllerCheckbox,
    hideKeybindingsCheckbox,
  ]) {
    checkbox.addEventListener("change", (event) => {
      const settings = JSON.parse(localStorage.getItem("settings"));
      settings[event.target.id] = event.target.checked;
      localStorage.setItem("settings", JSON.stringify(settings));

      if (event.target.id === "auto-save-setting") {
        const enabled = event.target.checked;

        if (enabled && !autoSaveIntervalId) {
          autoSaveIntervalId = setInterval(autoSaveWithIdle, 5000);
        } else if (!enabled && autoSaveIntervalId) {
          clearInterval(autoSaveIntervalId);
          autoSaveIntervalId = null;
        }
      }

      // ----------------------------

      if (event.target.id === "rewind-setting") {
        if (event.target.checked) {
          rewindBtn.style.display = "inline-block";
        } else {
          rewindBtn.style.display = "none";
        }
      }
      // ----------------------------

      if (event.target.id === "prefers-hd-setting") {
        if (event.target.checked) {
          hdToggle.checked = true;
          document.getElementById("nes-canvas").style.imageRendering =
            "pixelated";
        } else {
          hdToggle.checked = false;
          document.getElementById("nes-canvas").style.imageRendering = "auto";
        }
      }
      // ----------------------------

      if (event.target.id === "hide-controller-setting") {
        if (event.target.checked) {
          document.getElementById("controller").style.display = "none";
        } else {
          document.getElementById("controller").style.display = "flex";
        }
      }

      // -----------------------------

      if (event.target.id === "hide-keybindings-setting") {
        if (event.target.checked) {
          document.getElementById("bindings-list").style.display = "none";
        } else {
          document.getElementById("bindings-list").style.display = "flex";
        }
      }
    });
  }
});
