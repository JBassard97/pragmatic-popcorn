let gba;
let runCommands = [];
let debug = null;

gba = new GameBoyAdvance();
gba.keypad.eatInput = true;

gba.setLogger((level, error) => {
  console.error(error);
  gba.pause();
});

window.addEventListener("DOMContentLoaded", () => {
  if (gba && window.FileReader) {
    const canvas = document.getElementById("screen");
    gba.setCanvas(canvas);
    gba.logLevel = gba.LOG_ERROR;

    loadRom("gba/resources/bios.bin", (bios) => gba.setBios(bios));

    if (!gba.audio.context) {
      document.getElementById("sound")?.remove();
    }

    if (navigator.appName === "Microsoft Internet Explorer") {
      document.getElementById("pixelated")?.remove();
    }
  } else {
    document.getElementById("controls")?.remove();
  }
});

function fadeOut(id, nextId, kill) {
  const element = document.getElementById(id);
  const nextElement = document.getElementById(nextId);
  if (!element) return;

  const removeSelf = () => {
    if (kill) {
      element.remove();
    } else {
      element.classList.add("dead");
      ["webkitTransitionEnd", "oTransitionEnd", "transitionend"].forEach(
        (evt) => element.removeEventListener(evt, removeSelf)
      );
    }

    if (nextElement) {
      nextElement.classList.add("hidden");
      setTimeout(() => nextElement.classList.remove("hidden"), 0);
    }
  };

  ["webkitTransitionEnd", "oTransitionEnd", "transitionend"].forEach((evt) =>
    element.addEventListener(evt, removeSelf, false)
  );

  element.classList.add("hidden");
}

// 🎮 This is now the only way to load a ROM
function runGBA(romUrl) {
  const canvas = document.getElementById("screen");
  canvas.width = 480; // native GBA width
  canvas.height = 320; // native GBA height
  canvas.style.imageRendering = "pixelated";
  // const multiplier = 2;
  // canvas.style.width = `${canvas.width * multiplier}px`;
  // canvas.style.height = `${canvas.height * multiplier}px`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", romUrl, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      gba.loadRomFromFile(new Blob([xhr.response]), (success) => {
        if (success) {
          runCommands.forEach((cmd) => cmd());
          runCommands = [];
          fadeOut("preload", "ingame");
          fadeOut("instructions", null, true);
          gba.runStable();
        } else {
          console.error("Failed to load ROM:", romUrl);
        }
      });
    } else {
      console.error("XHR failed:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("XHR error loading ROM:", romUrl);
  };

  xhr.send();
}

window.runGBA = runGBA;

function togglePause() {
  const pauseBtn = document.getElementById("pause");
  const isDebug = debug?.gbaCon;

  if (gba.paused) {
    isDebug ? isDebug.run() : gba.runStable();
    pauseBtn.textContent = "PAUSE";
  } else {
    isDebug ? isDebug.pause() : gba.pause();
    pauseBtn.textContent = "UNPAUSE";
  }
}

function screenshot() {
  const canvas = gba.indirectCanvas;
  window.open(canvas.toDataURL("image/png"), "screenshot");
}

function lcdFade(context, target, callback) {
  let i = 0;
  const interval = setInterval(() => {
    i++;
    const pixelData = context.getImageData(0, 0, 240, 160);

    for (let y = 0; y < 160; y++) {
      for (let x = 0; x < 240; x++) {
        const xDiff = Math.abs(x - 120);
        const yDiff = Math.abs(y - 80) * 0.8;
        const xFactor = (120 - i - xDiff) / 120;
        const yFactor = (80 - i - (y & 1) * 10 - yDiff + Math.sqrt(xDiff)) / 80;

        const alphaIndex = (x + y * 240) * 4 + 3;
        pixelData.data[alphaIndex] *=
          Math.pow(xFactor, 1 / 3) * Math.sqrt(yFactor);
      }
    }

    context.putImageData(pixelData, 0, 0);
    target.clearRect(0, 0, 480, 320);

    if (i > 40) {
      clearInterval(interval);
    } else {
      callback();
    }
  }, 50);
}

function setVolume(value) {
  gba.audio.masterVolume = Math.pow(2, value) - 1;
}

function setPixelated(pixelated) {
  const screen = document.getElementById("screen");
  const context = screen.getContext("2d");

  if ("webkitImageSmoothingEnabled" in context) {
    context.webkitImageSmoothingEnabled = !pixelated;
  } else if ("mozImageSmoothingEnabled" in context) {
    context.mozImageSmoothingEnabled = !pixelated;
  } else if (navigator.appName !== "Microsoft Internet Explorer") {
    screen.width = pixelated ? 240 : 480;
    screen.height = pixelated ? 160 : 320;

    if (navigator.appName === "Opera") {
      if (pixelated) {
        screen.style.marginTop = "0";
        screen.style.marginBottom = "-325px";
      } else {
        screen.removeAttribute("style");
      }
    }
  }
}
