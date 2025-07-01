function autoSaveNES() {
  if (!currentRomPath) return;
  try {
    const state = JSON.stringify(nes.toJSON());
    localStorage.setItem(`nes_save_${currentRomPath}`, state);
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

function autoSaveWithIdleNES() {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      autoSaveNES();
    });
  } else {
    autoSaveNES(); // Fallback for browsers without requestIdleCallback
  }
}

function autoLoadNES() {
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

function filteredClearNES() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key.startsWith("nes_save_")) {
      localStorage.removeItem(key);
    }
  }
}

function clearSaveNES() {
  filteredClearNES();
  if (currentRomPath) {
    nes_load_url("screen", currentRomPath);
  }
}

function hasSaveNES(romPath) {
  return localStorage.getItem(`nes_save_${romPath}`) !== null;
}
