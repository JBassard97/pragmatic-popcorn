function autoSave() {
  if (!currentRomPath) return;
  try {
    const state = JSON.stringify(nes.toJSON());
    localStorage.setItem(`nes_save_${currentRomPath}`, state);
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

function autoSaveWithIdle() {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      autoSave();
    });
  } else {
    autoSave(); // Fallback for browsers without requestIdleCallback
  }
}

function autoLoad() {
  if (!currentRomPath) return;
  const json = localStorage.getItem(`nes_save_${currentRomPath}`);
  if (json) {
    try {
      nes.fromJSON(JSON.parse(json));
      console.log("Loaded saved state for", currentRomPath);
    } catch (e) {
      console.warn("Failed to load state:", e);
    }
  }
}

function filteredClear() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key.startsWith("nes_save_")) {
      localStorage.removeItem(key);
    }
  }
}

function clearSave() {
  filteredClear();
  if (currentRomPath) {
    nes_load_url("nes-canvas", currentRomPath);
  }
}

function hasSave(romPath) {
  return localStorage.getItem(`nes_save_${romPath}`) !== null;
}
