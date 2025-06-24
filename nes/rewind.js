/**
 * NES Emulator Rewind Functionality
 * Provides 5-second instant rewind capability for NES emulator
 */

// Rewind functionality variables
var REWIND_BUFFER_SIZE = 300; // Store 5 seconds at 60fps
var rewindBuffer = [];
var rewindBufferIndex = 0;
var frameCounter = 0;
var REWIND_CAPTURE_RATE = 3; // Capture every 3rd frame to save memory

/**
 * Captures the current game state for rewind functionality
 * Should be called from the main animation loop
 */
function captureRewindState() {
  // Only capture if NES emulator is available
  if (typeof nes === "undefined" || !nes) {
    return;
  }

  try {
    const state = JSON.stringify(nes.toJSON());

    // Add to circular buffer
    rewindBuffer[rewindBufferIndex] = state;
    rewindBufferIndex = (rewindBufferIndex + 1) % REWIND_BUFFER_SIZE;

    // If buffer is full, we're overwriting the oldest state
    if (rewindBuffer.length < REWIND_BUFFER_SIZE) {
      // Buffer still growing
    }
  } catch (e) {
    console.warn("Failed to capture rewind state:", e);
  }
}

/**
 * Rewinds the game exactly 5 seconds back
 * @returns {boolean} True if rewind was successful, false otherwise
 */
function rewind5Seconds() {
  // Check if NES emulator is available
  if (typeof nes === "undefined" || !nes) {
    console.warn("NES emulator not available for rewind");
    return false;
  }

  if (rewindBuffer.length === 0) {
    console.log("No rewind states available");
    return false;
  }

  // Calculate how many states represent 5 seconds
  // At 60fps with capture every 3rd frame: 60/3 = 20 captures per second
  // So 5 seconds = 100 states
  const statesFor5Seconds = Math.floor((60 / REWIND_CAPTURE_RATE) * 5);

  // Find the target state (5 seconds back)
  let targetIndex;
  let stepsBack = Math.min(statesFor5Seconds, rewindBuffer.length);

  if (rewindBuffer.length < REWIND_BUFFER_SIZE) {
    // Buffer isn't full yet
    if (rewindBufferIndex < stepsBack) {
      // Can't go back 5 full seconds, go back as far as possible
      stepsBack = rewindBufferIndex;
    }
    targetIndex = rewindBufferIndex - stepsBack;
  } else {
    // Buffer is full, use circular logic
    targetIndex =
      (rewindBufferIndex - stepsBack + REWIND_BUFFER_SIZE) % REWIND_BUFFER_SIZE;
  }

  try {
    const state = rewindBuffer[targetIndex];
    if (state) {
      nes.fromJSON(JSON.parse(state));

      // Clear all states after the target (since we've rewound)
      if (rewindBuffer.length < REWIND_BUFFER_SIZE) {
        // Buffer not full - simply truncate
        rewindBufferIndex = targetIndex;
        rewindBuffer.length = targetIndex;
      } else {
        // Buffer is full - mark states as invalid and reset index
        const currentIndex = rewindBufferIndex;
        let clearIndex = targetIndex;
        while (clearIndex !== currentIndex) {
          rewindBuffer[clearIndex] = null;
          clearIndex = (clearIndex + 1) % REWIND_BUFFER_SIZE;
        }
        rewindBufferIndex = targetIndex;
      }

      console.log(
        `Rewound ${stepsBack} states (approximately ${(
          stepsBack /
          (60 / REWIND_CAPTURE_RATE)
        ).toFixed(1)} seconds)`
      );
      return true;
    }
  } catch (e) {
    console.warn("Failed to rewind:", e);
  }

  return false;
}

/**
 * Clears all rewind states (useful when loading a new ROM or powering off)
 */
function clearRewindBuffer() {
  rewindBuffer = [];
  rewindBufferIndex = 0;
  frameCounter = 0;
  console.log("Rewind buffer cleared");
}

/**
 * Gets the current rewind buffer status
 * @returns {Object} Object containing buffer information
 */
function getRewindBufferStatus() {
  const totalStates = rewindBuffer.length;
  const maxSeconds = (totalStates / (60 / REWIND_CAPTURE_RATE)).toFixed(1);

  return {
    totalStates: totalStates,
    maxRewindSeconds: maxSeconds,
    bufferFull: totalStates >= REWIND_BUFFER_SIZE,
    currentIndex: rewindBufferIndex,
  };
}

/**
 * Should be called from the main animation frame loop
 * Handles the frame counting and periodic state capture
 */
function updateRewindSystem() {
  // Capture rewind state periodically (not every frame to save memory)
  if (frameCounter % REWIND_CAPTURE_RATE === 0) {
    captureRewindState();
  }
  frameCounter++;
}

/**
 * Initialize rewind button functionality
 * Call this after the DOM is loaded
 * @param {string} buttonId - ID of the rewind button element
 * @param {string} rewindKey - Key to use for keyboard rewind (default: 'r')
 */
function initializeRewindControls(buttonId = "rewind", rewindKey = "r") {
  // Initialize rewind button
  const rewindBtn = document.getElementById(buttonId);

  if (rewindBtn) {
    // Single click to rewind 5 seconds
    rewindBtn.addEventListener("click", (e) => {
      e.preventDefault();
      rewind5Seconds();
      rewindBtn.blur(); // Remove focus after clicking
    });

    console.log(`Rewind button initialized with ID: ${buttonId}`);
  } else {
    console.warn(`Rewind button with ID '${buttonId}' not found`);
  }

  // Initialize keyboard controls
  document.addEventListener("keydown", (e) => {
    if (e.key === rewindKey || e.key === rewindKey.toUpperCase()) {
      e.preventDefault();
      rewind5Seconds();
    }
  });

  console.log(
    `Rewind keyboard control initialized with key: ${rewindKey.toUpperCase()}`
  );
}

// Export functions for use in other scripts (if using modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    captureRewindState,
    rewind5Seconds,
    clearRewindBuffer,
    getRewindBufferStatus,
    updateRewindSystem,
    initializeRewindControls,
  };
}
