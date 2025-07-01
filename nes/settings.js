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

  const defaultSettings = {
    "auto-save-setting": true,
    "rewind-setting": false,
    "prefers-hd-setting": false,
    "hide-controller-setting": false,
    "hide-keybindings-setting": false,
  };

  let settings = JSON.parse(localStorage.getItem("settings"));

  // Replace with defaults if missing any keys
  const needsReset =
    !settings || Object.keys(defaultSettings).some((key) => !(key in settings));

  if (needsReset) {
    settings = { ...defaultSettings };
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  // Reflect stored settings in checkboxes and UI
  autoSaveCheckbox.checked = settings["auto-save-setting"];
  rewindCheckbox.checked = settings["rewind-setting"];
  prefersHDCheckbox.checked = settings["prefers-hd-setting"];
  hideControllerCheckbox.checked = settings["hide-controller-setting"];
  hideKeybindingsCheckbox.checked = settings["hide-keybindings-setting"];

  // Apply setting effects
  if (rewindCheckbox.checked) {
    rewindBtn.style.display = "inline-block";
  } else {
    rewindBtn.style.display = "none";
  }

  if (prefersHDCheckbox.checked) {
    hdToggle.checked = true;
    document.getElementById("screen").style.imageRendering = "pixelated";
  }

  if (hideControllerCheckbox.checked) {
    document.getElementById("controller").style.display = "none";
  }

  if (hideKeybindingsCheckbox.checked) {
    document.getElementById("bindings-list").style.display = "none";
  }

  // Save setting changes live
  for (const checkbox of [
    autoSaveCheckbox,
    rewindCheckbox,
    prefersHDCheckbox,
    hideControllerCheckbox,
    hideKeybindingsCheckbox,
  ]) {
    checkbox.addEventListener("change", (event) => {
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

      if (event.target.id === "rewind-setting") {
        rewindBtn.style.display = event.target.checked
          ? "inline-block"
          : "none";
      }

      if (event.target.id === "prefers-hd-setting") {
        hdToggle.checked = event.target.checked;
        document.getElementById("screen").style.imageRendering = event
          .target.checked
          ? "pixelated"
          : "auto";
      }

      if (event.target.id === "hide-controller-setting") {
        document.getElementById("controller").style.display = event.target
          .checked
          ? "none"
          : "flex";
      }

      if (event.target.id === "hide-keybindings-setting") {
        document.getElementById("bindings-list").style.display = event.target
          .checked
          ? "none"
          : "flex";
      }
    });
  }
});
