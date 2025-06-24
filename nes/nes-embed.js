var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4 * 1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0,
  audio_read_cursor = 0;

let currentRomPath = "";
let animationFrameRequest = null;
let autoSaveIntervalId = null;
let audio_ctx = null;

var nes = new jsnes.NES({
  onFrame: function (framebuffer_24) {
    for (var i = 0; i < FRAMEBUFFER_SIZE; i++)
      framebuffer_u32[i] = 0xff000000 | framebuffer_24[i];
  },
  onAudioSample: function (l, r) {
    audio_samples_L[audio_write_cursor] = l;
    audio_samples_R[audio_write_cursor] = r;
    audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
  },
});

function onAnimationFrame() {
  animationFrameRequest = window.requestAnimationFrame(onAnimationFrame);

  // Update rewind system (if rewind module is loaded)
  if (typeof updateRewindSystem === "function") {
    updateRewindSystem();
  }

  image.data.set(framebuffer_u8);
  canvas_ctx.putImageData(image, 0, 0);
}

function audio_remain() {
  return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
  var dst = event.outputBuffer;
  var len = dst.length;

  if (audio_remain() < AUDIO_BUFFERING) nes.frame();

  var dst_l = dst.getChannelData(0);
  var dst_r = dst.getChannelData(1);
  for (var i = 0; i < len; i++) {
    var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
    dst_l[i] = audio_samples_L[src_idx];
    dst_r[i] = audio_samples_R[src_idx];
  }

  audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

async function nes_init(canvas_id) {
  var canvas = document.getElementById(canvas_id);
  canvas_ctx = canvas.getContext("2d");
  image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  canvas_ctx.fillStyle = "black";
  canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  var buffer = new ArrayBuffer(image.data.length);
  framebuffer_u8 = new Uint8ClampedArray(buffer);
  framebuffer_u32 = new Uint32Array(buffer);

  if (!audio_ctx) {
    audio_ctx = new window.AudioContext();
  }

  if (audio_ctx.state === "suspended") {
    await audio_ctx.resume();
  }

  if (!audio_ctx.scriptProcessor) {
    var script_processor = audio_ctx.createScriptProcessor(
      AUDIO_BUFFERING,
      0,
      2
    );
    script_processor.onaudioprocess = audio_callback;
    script_processor.connect(audio_ctx.destination);
    audio_ctx.scriptProcessor = script_processor;
  }
}

async function nes_boot(rom_data) {
  nes.loadROM(rom_data);
  autoLoad(currentRomPath);

  if (animationFrameRequest !== null) {
    window.cancelAnimationFrame(animationFrameRequest);
  }
  animationFrameRequest = window.requestAnimationFrame(onAnimationFrame);

  if (autoSaveIntervalId !== null) {
    clearInterval(autoSaveIntervalId);
  }
  // autoSaveIntervalId = setInterval(autoSave, 5000);
  function autoSaveWithIdle() {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        autoSave();
      });
    } else {
      autoSave(); // Fallback for browsers without requestIdleCallback
    }
  }
  autoSaveIntervalId = setInterval(autoSaveWithIdle, 5000);

  if (audio_ctx && audio_ctx.state === "running") {
    for (let i = 0; i < 3; i++) {
      nes.frame();
    }
  }
}

async function nes_load_data(canvas_id, rom_data) {
  await nes_init(canvas_id);
  await nes_boot(rom_data);
}

async function nes_load_url(canvas_id, path) {
  currentRomPath = path;

  var req = new XMLHttpRequest();
  req.open("GET", path);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.onerror = () => console.log(`Error loading ${path}: ${req.statusText}`);

  req.onload = async function () {
    if (this.status === 200) {
      await nes_init(canvas_id);
      await nes_boot(this.responseText);
    }
  };

  req.send();
}

function powerOff() {
  // Clear rewind buffer (if rewind module is loaded)
  if (typeof clearRewindBuffer === "function") {
    clearRewindBuffer();
  }

  if (animationFrameRequest !== null) {
    cancelAnimationFrame(animationFrameRequest);
    animationFrameRequest = null;
  }

  if (autoSaveIntervalId !== null) {
    clearInterval(autoSaveIntervalId);
    autoSaveIntervalId = null;
  }

  const canvas = document.getElementById("nes-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  nes = new jsnes.NES({
    onFrame: function (framebuffer_24) {
      for (let i = 0; i < FRAMEBUFFER_SIZE; i++)
        framebuffer_u32[i] = 0xff000000 | framebuffer_24[i];
    },
    onAudioSample: function (l, r) {
      audio_samples_L[audio_write_cursor] = l;
      audio_samples_R[audio_write_cursor] = r;
      audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
    },
  });
}
