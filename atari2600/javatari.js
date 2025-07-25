// Javatari version 5.0.4
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Main Emulator parameters.
// May be overridden dynamically by URL query parameters, if ALLOW_URL_PARAMETERS = true.

Javatari = {
  PRESETS: "", // Configuration Presets to apply. See Presets Configuration

  // Full or relative URL of Media files to load
  CARTRIDGE_URL: "",
  AUTODETECT_URL: "",
  STATE_URL: "",

  // Forcing ROM formats
  CARTRIDGE_FORMAT: "", // 4K, F8, F4, FE, AR, etc...

  // NetPlay
  NETPLAY_JOIN: "", // Join NetPlay! Session automatically
  NETPLAY_NICK: "", // NetPlay! Nickname

  // General configuration
  AUTO_START: true,
  AUTO_POWER_ON_DELAY: 1200, // -1: no auto Power-ON; >= 0: wait specified milliseconds before Power-ON
  CARTRIDGE_SHOW_RECENT: true,
  CARTRIDGE_CHANGE_DISABLED: false,
  CARTRIDGE_LABEL_COLORS: "", // Space-separated colors for Label, Background, Border. e.g. "#f00 #000 transparent". Leave "" for defaults
  SCREEN_RESIZE_DISABLED: false,
  SCREEN_CONSOLE_PANEL_DISABLED: false,
  SCREEN_ELEMENT_ID: "javatari-screen",
  CONSOLE_PANEL_ELEMENT_ID: -1, // -1: auto. Don't change! :-)
  SCREEN_FULLSCREEN_MODE: -1, // -2: disabled; -1: auto; 0: off; 1: on
  SCREEN_CRT_MODE: 0, // -1: auto; 0: off; 1: on
  SCREEN_FILTER_MODE: -3, // -3: user set (default auto); -2: browser default; -1: auto; 0..3: smoothing level
  SCREEN_DEFAULT_SCALE: -1, // -1: auto; 0.5..N in 0.1 steps: scale
  SCREEN_DEFAULT_ASPECT: 1, // in 0.1 steps
  SCREEN_CANVAS_SIZE: 2, // Internal canvas size factor. Don't change! :-)
  SCREEN_CONTROL_BAR: 1, // 0: on hover; 1: always
  SCREEN_FORCE_HOST_NATIVE_FPS: -1, // -1: auto. Don't change! :-)
  SCREEN_VSYNCH_MODE: -2, // -2: user set (default on); -1: disabled; 0: off; 1: on
  AUDIO_MONITOR_BUFFER_BASE: -3, // -3: user set (default auto); -2: disable audio; -1: auto; 0: browser default; 1..6: base value. More buffer = more delay
  AUDIO_MONITOR_BUFFER_SIZE: -1, // -1: auto; 256, 512, 1024, 2048, 4096, 8192, 16384: buffer size.     More buffer = more delay. Don't change! :-)
  AUDIO_SIGNAL_BUFFER_RATIO: 2, // Internal Audio Signal buffer based on Monitor buffer
  AUDIO_SIGNAL_ADD_FRAMES: 3, // Additional frames in internal Audio Signal buffer based on Monitor buffer
  PADDLES_MODE: -1, // -1: auto; 0: off; 1: on
  TOUCH_MODE: -1, // -1: auto; 0: disabled; 1: enabled; 2: enabled (swapped)

  IMAGES_PATH: window.JAVATARI_IMAGES_PATH || "images/",
  PAGE_BACK_CSS: "", // CSS to modify page background color. Applied to the body element

  SERVER_ADDRESS: "webmsx.azurewebsites.net/",
  SERVER_KEEPALIVE: 0,

  RESET: 0, // if value = 1 clear all saved data on the client
  ALLOW_URL_PARAMETERS: true, // Allows user to override any of these parameters via URL query parameters
};

Javatari.PRESETS_CONFIG = {}; // No built-in Presets for now

jt = window.jt || {}; // Namespace for all classes and objects

function onUpdateReady() {
  alert("A new version is available!\nJavatari will restart..."),
    window.applicationCache.swapCache(),
    window.location.reload();
}
(JavatariFullScreenSetup = {
  apply: function () {
    if (!this.cssApplied) {
      var a = document.createElement("style");
      (a.type = "text/css"),
        (a.innerHTML = this.css),
        document.head.appendChild(a),
        (this.cssApplied = !0);
    }
    document.documentElement.classList.toggle(
      "jt-full-screen",
      this.shouldStartInFullScreen()
    );
  },
  shouldStartInFullScreen: function () {
    return window.Javatari
      ? 1 === Javatari.SCREEN_FULLSCREEN_MODE ||
          (-1 === Javatari.SCREEN_FULLSCREEN_MODE &&
            this.isBrowserStandaloneMode())
      : this.isBrowserStandaloneMode();
  },
  isBrowserStandaloneMode: function () {
    return (
      navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  },
  css: "html.jt-full-screen, html.jt-full-screen body {   background: black;}html.jt-full-screen .jt-full-screen-hidden {   display: none;}html:not(.jt-full-screen) .jt-full-screen-only {   display: none;}",
}),
  JavatariFullScreenSetup.apply(),
  (jt.Util = new (function () {
    "use strict";
    function a(a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }
    function b(a) {
      return a.stopPropagation(), a.cancelable && a.preventDefault(), !1;
    }
    (this.logs = []),
      (this.log = function (a) {
        var b = [">> jt:"];
        Array.prototype.push.apply(b, arguments), console.log.apply(console, b);
      }),
      (this.warning = function (a) {
        var b = [">> jt Warning:"];
        Array.prototype.push.apply(b, arguments),
          console.warn.apply(console, b);
      }),
      (this.error = function (a) {
        var b = [">> jt Error:"];
        Array.prototype.push.apply(b, arguments),
          console.error.apply(console, b);
      }),
      (this.message = function (a) {
        console.info(a), alert(a);
      }),
      (this.asNormalArray = function (a) {
        return a instanceof Array
          ? a
          : this.arrayCopy(a, 0, new Array(a.length));
      }),
      (this.arrayFill = function (a, b, c, d) {
        if (a.fill) return a.fill(b, c, d);
        void 0 === c && (c = 0);
        for (var e = (void 0 === d ? a.length : d) - 1; e >= c; e -= 1)
          a[e] = b;
        return a;
      }),
      (this.arrayFillSegment = function (a, b, c, d) {
        for (var e = c; e-- > b; ) a[e] = d;
        return a;
      }),
      (this.arrayCopy = function (a, b, c, d, e) {
        d = d || 0;
        for (var f = e ? b + e : a.length; b < f; ) c[d++] = a[b++];
        return c;
      }),
      (this.arrayAdd = function (a, b) {
        return (a[a.length] = b), a;
      }),
      (this.arrayRemoveAllElement = function (a, b) {
        for (var c; (c = a.indexOf(b)) >= 0; ) a.splice(c, 1);
        return a;
      }),
      (this.arraysConcatAll = function (a) {
        for (var b = 0, c = 0; c < a.length; ++c) b += a[c].length;
        var d = new a[0].constructor(b),
          e = 0;
        for (c = 0; c < a.length; ++c)
          this.arrayCopy(a[c], 0, d, e), (e += a[c].length);
        return d;
      }),
      (this.arrayRemove = function (a, b) {
        var c = a.indexOf(b);
        c < 0 || a.splice(c, 1);
      }),
      (this.arraysEqual = function (a, b) {
        var c = a.length;
        if (c !== b.length) return !1;
        for (; c--; ) if (a[c] !== b[c]) return !1;
        return !0;
      }),
      (this.reverseInt8 = function (a) {
        return (
          ((1 & a) << 7) |
          ((2 & a) << 5) |
          ((4 & a) << 3) |
          ((8 & a) << 1) |
          ((16 & a) >> 1) |
          ((32 & a) >> 3) |
          ((64 & a) >> 5) |
          ((128 & a) >> 7)
        );
      }),
      (this.int8BitArrayToByteString = function (a, b, c) {
        if (null === a || void 0 == a) return a;
        void 0 === b && (b = 0), void 0 === c && (c = a.length - b);
        for (var d = "", e = b, f = b + c; e < f; e += 1)
          d += String.fromCharCode(255 & a[e]);
        return d;
      }),
      (this.byteStringToInt8BitArray = function (a, b) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a) {
          for (
            var c = a.length,
              d = b && b.length === c ? b : new (b ? b.constructor : Array)(c),
              e = 0;
            e < c;
            e += 1
          )
            d[e] = 255 & a.charCodeAt(e);
          return d;
        }
      }),
      (this.int32BitArrayToByteString = function (a, b, c) {
        if (null === a || void 0 == a) return a;
        void 0 === b && (b = 0), void 0 === c && (c = a.length - b);
        for (var d = "", e = b, f = b + c; e < f; e += 1)
          d +=
            String.fromCharCode(255 & a[e]) +
            String.fromCharCode((a[e] >> 8) & 255) +
            String.fromCharCode((a[e] >> 16) & 255) +
            String.fromCharCode((a[e] >> 24) & 255);
        return d;
      }),
      (this.byteStringToInt32BitArray = function (a, b) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a) {
          for (
            var c = (a.length / 4) | 0,
              d = b && b.length === c ? b : new (b ? b.constructor : Array)(c),
              e = 0,
              f = 0;
            e < c;
            e += 1, f += 4
          )
            d[e] =
              (255 & a.charCodeAt(f)) |
              ((255 & a.charCodeAt(f + 1)) << 8) |
              ((255 & a.charCodeAt(f + 2)) << 16) |
              ((255 & a.charCodeAt(f + 3)) << 24);
          return d;
        }
      }),
      (this.storeInt8BitArrayToStringBase64 = function (a) {
        return null === a || void 0 === a
          ? a
          : 0 === a.length
          ? ""
          : btoa(this.int8BitArrayToByteString(a));
      }),
      (this.restoreStringBase64ToInt8BitArray = function (a, b) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a)
          return "" == a ? [] : this.byteStringToInt8BitArray(atob(a), b);
      }),
      (this.compressInt8BitArrayToStringBase64 = function (a, b) {
        return null === a || void 0 === a
          ? a
          : 0 === a.length
          ? ""
          : b < a.length
          ? this.storeInt8BitArrayToStringBase64(
              JSZip.compressions.DEFLATE.compress(a.slice(0, b))
            )
          : this.storeInt8BitArrayToStringBase64(
              JSZip.compressions.DEFLATE.compress(a)
            );
      }),
      (this.uncompressStringBase64ToInt8BitArray = function (a, b, c) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a) {
          if ("" == a) return [];
          var d = JSZip.compressions.DEFLATE.uncompress(atob(a));
          return b && (c || b.length === d.length)
            ? this.arrayCopy(d, 0, b)
            : this.arrayCopy(d, 0, new (b ? b.constructor : Array)(d.length));
        }
      }),
      (this.storeInt32BitArrayToStringBase64 = function (a) {
        return null === a || void 0 === a
          ? a
          : 0 === a.length
          ? ""
          : btoa(this.int32BitArrayToByteString(a));
      }),
      (this.restoreStringBase64ToInt32BitArray = function (a, b) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a)
          return "" == a ? [] : this.byteStringToInt32BitArray(atob(a), b);
      }),
      (this.compressStringToStringBase64 = function (a) {
        return null === a || void 0 === a
          ? a
          : 0 === a.length
          ? a
          : this.storeInt8BitArrayToStringBase64(
              JSZip.compressions.DEFLATE.compress(a)
            );
      }),
      (this.uncompressStringBase64ToString = function (a) {
        if (null === a || void 0 === a) return a;
        if ("null" == a) return null;
        if ("undefined" != a)
          return "" == a
            ? a
            : this.int8BitArrayToByteString(
                JSZip.compressions.DEFLATE.uncompress(atob(a))
              );
      }),
      (this.toHex2 = function (a) {
        if (null === a || void 0 === a) return a;
        var b = a.toString(16).toUpperCase();
        return a >= 0 && b.length % 2 ? "0" + b : b;
      }),
      (this.toHex4 = function (a) {
        if (null === a || void 0 === a) return a;
        var b = a.toString(16).toUpperCase();
        if (a < 0) return b;
        switch (b.length) {
          case 4:
            return b;
          case 3:
            return "0" + b;
          case 2:
            return "00" + b;
          case 1:
            return "000" + b;
          default:
            return b;
        }
      }),
      (this.escapeHtml = function (a) {
        return a
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\//g, "&#047;")
          .replace(/\?/g, "&#063;")
          .replace(/\-/g, "&#045;")
          .replace(/\|/g, "&#0124;");
      }),
      (this.arrayFind = function (a, b) {
        if (a.find) return a.find(b);
        for (var c = 0, d = a.length; c < d; ++c)
          if (b(a[c], c, a)) return a[c];
      }),
      (this.arrayFindIndex = function (a, b) {
        if (a.findIndex) return a.findIndex(b);
        for (var c = 0, d = a.length; c < d; ++c) if (b(a[c], c, a)) return c;
        return -1;
      }),
      (this.arrayIndexOfSubArray = function (a, b, c, d) {
        var e = b.length,
          f = a.length,
          g = d || 1;
        a: for (var h = c; h >= 0 && h < f; h += g) {
          for (var i = 0; i < e; i += 1) if (a[h + i] !== b[i]) continue a;
          return h;
        }
        return -1;
      }),
      (this.stringCountOccurrences = function (a, b) {
        for (var c = 0, d = 0, e = a.length; d < e; ++d) a[d] == b && ++c;
        return c;
      }),
      (this.stringStartsWith = function (a, b) {
        return a.startsWith ? a.startsWith(b) : a.substr(0, b.length) === b;
      }),
      (this.stringEndsWith = function (a, b) {
        return a.endsWith ? a.endsWith(b) : a.substr(a.length - b.length) === b;
      }),
      (this.checkContentIsZIP = function (a) {
        if (a && 80 === a[0] && 75 === a[1])
          try {
            return new JSZip(a);
          } catch (a) {}
        return null;
      }),
      (this.getZIPFilesSorted = function (b) {
        var c = b.file(/.+/);
        return c.sort(a), c;
      }),
      (this.checkContentIsGZIP = function (a) {
        if (!a || 31 !== a[0] || 139 !== a[1] || 8 !== a[2]) return null;
        try {
          var b = a[3],
            c = 2 & b,
            d = 4 & b,
            e = 8 & b,
            f = 16 & b,
            g = 10;
          if (d) {
            var h = a[g++] | (a[g++] << 8);
            g += h;
          }
          if (e) for (; 0 !== a[g++]; );
          if (f) for (; 0 !== a[g++]; );
          return (
            c && (g += 2),
            JSZip.compressions.DEFLATE.uncompress(a.slice(g, a.length - 8))
          );
        } catch (a) {
          return null;
        }
      }),
      (this.leafFilename = function (a) {
        return (
          (a && a.indexOf("/") >= 0 ? a.split("/").pop() : a) || ""
        ).trim();
      }),
      (this.leafFilenameNoExtension = function (a) {
        var b = this.leafFilename(a),
          c = b.lastIndexOf(".");
        return c <= 0 ? b : b.substr(0, c).trim();
      }),
      (this.leafFilenameOnlyExtension = function (a) {
        var b = this.leafFilename(a),
          c = b.lastIndexOf(".");
        return c <= 0 ? "" : b.substr(c + 1).trim();
      }),
      (this.dump = function (a, b, c, d) {
        var e = "",
          f = b || 0;
        d = d || 1;
        for (var g = 0; g < d; g++) {
          for (var h = 0; h < c; h++) {
            var i = a[f++];
            e += void 0 != i ? i.toString(16, 2) + " " : "? ";
          }
          e += "   ";
        }
        console.log(e);
      }),
      (this.browserInfo = function () {
        if (this.browserInfoAvailable) return this.browserInfoAvailable;
        var a,
          b = navigator.userAgent,
          c =
            b.match(
              /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];
        if (/trident/i.test(c[1]))
          return (
            (a = /\brv[ :]+(\d+)/g.exec(b) || []),
            (this.browserInfoAvailable = { name: "IE", version: a[1] || "" })
          );
        if ("Chrome" === c[1] && null != (a = b.match(/\bOPR\/(\d+)/)))
          return (this.browserInfoAvailable = { name: "OPERA", version: a[1] });
        (c = c[2]
          ? [c[1], c[2]]
          : [navigator.appName, navigator.appVersion, "-?"]),
          null != (a = b.match(/version\/(\d+)/i)) && c.splice(1, 1, a[1]);
        var d = c[0].toUpperCase();
        return (this.browserInfoAvailable = {
          name: this.isIOSDevice() || "NETSCAPE" === d ? "SAFARI" : d,
          version: c[1],
        });
      }),
      (this.userLanguage = function () {
        return (
          (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          navigator.userLanguage ||
          "en-US"
        ).trim();
      }),
      (this.browserCurrentURL = function () {
        return window.location.origin + window.location.pathname;
      }),
      (this.isOfficialHomepage = function () {
        var a = window.location;
        return (
          a &&
          "javatari.org" === a.hostname.toLowerCase() &&
          ("" === a.port || "80" === a.port)
        );
      }),
      (this.isTouchDevice = function () {
        return (
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        );
      }),
      (this.isMobileDevice = function () {
        return (
          this.isTouchDevice() &&
          /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(
            navigator.userAgent
          )
        );
      }),
      (this.isIOSDevice = function () {
        return /ipad|iphone|ipod/i.test(navigator.userAgent);
      }),
      (this.isBrowserStandaloneMode = function () {
        return (
          navigator.standalone ||
          window.matchMedia("(display-mode: standalone)").matches
        );
      }),
      (this.onTapOrMouseDown = function (a, b) {
        this.addEventsListener(
          a,
          this.isTouchDevice() ? "touchstart mousedown" : "mousedown",
          b
        );
      }),
      (this.onTapOrMouseDownWithBlock = function (a, c) {
        function d(a) {
          return c(a), b(a);
        }
        this.addEventsListener(
          a,
          this.isTouchDevice() ? "touchstart mousedown" : "mousedown",
          d
        );
      }),
      (this.onTapOrMouseUpWithBlock = function (a, c) {
        function d(a) {
          return c(a), b(a);
        }
        this.addEventsListener(
          a,
          this.isTouchDevice() ? "touchstart mouseup" : "mouseup",
          d
        );
      }),
      (this.onTapOrMouseDownWithBlockUIG = function (a, c) {
        function d(a) {
          if ("touchend" === a.type && !a.target.jtNeedsUIG) return b(a);
          var d = "touchstart" === a.type && a.target.jtNeedsUIG,
            e = "touchend" === a.type;
          return c(a, d, e), b(a);
        }
        this.addEventsListener(
          a,
          this.isTouchDevice() ? "touchstart touchend mousedown" : "mousedown",
          d
        );
      }),
      (this.blockEvent = b),
      (this.addEventsListener = function (a, b, c, d) {
        b = b.split(" ");
        for (var e = 0; e < b.length; ++e)
          b[e] && a.addEventListener(b[e], c, d);
      }),
      (this.removeEventsListener = function (a, b, c, d) {
        b = b.split(" ");
        for (var e = 0; e < b.length; ++e)
          b[e] && a.removeEventListener(b[e], c, d);
      }),
      (this.insertCSS = function (a) {
        var b = document.createElement("style");
        (b.type = "text/css"), (b.innerHTML = a), document.head.appendChild(b);
      }),
      (this.scaleToFitParentHeight = function (a, b, c) {
        var d = b.clientHeight - c - 20,
          e = a.clientHeight,
          f = e < d ? 1 : d / e;
        a.style.transform =
          "translateY(-" + ((c / 2) | 0) + "px) scale(" + f.toFixed(4) + ")";
      }),
      (this.scaleToFitParentWidth = function (a, b, c) {
        var d = b.clientWidth - ((2 * c) | 0),
          e = a.clientWidth,
          f = e < d ? 1 : d / e,
          g = (e * f) | 0,
          h = Math.floor((d - g) / 2 + c);
        (a.style.left = h + "px"),
          (a.style.right = "initial"),
          (a.style.transform = "scale(" + f.toFixed(4) + ")");
      }),
      (this.log2 = function (a) {
        return Math.log(a) / Math.log(2);
      }),
      (this.exp2 = function (a) {
        return Math.pow(2, a);
      }),
      (this.performanceNow = function () {
        return this.performanceNow.startOffset
          ? Date.now() - this.performanceNow.startOffset
          : window.performance.now();
      });
  })()),
  (window.performance && window.performance.now) ||
    (jt.Util.performanceNow.startOffset = Date.now()),
  (jt.MD5 = function (a) {
    "use strict";
    function b(a) {
      var b = (a >>> 0).toString(16);
      return "00000000".substr(0, 8 - b.length) + b;
    }
    function c(a) {
      for (var b = [], c = 0; c < 8; c++) b.push(255 & a), (a >>>= 8);
      return b;
    }
    function d(a, b) {
      return ((a << b) & 4294967295) | (a >>> (32 - b));
    }
    function e(a, b, c) {
      return (a & b) | (~a & c);
    }
    function f(a, b, c) {
      return (c & a) | (~c & b);
    }
    function g(a, b, c) {
      return a ^ b ^ c;
    }
    function h(a, b, c) {
      return b ^ (a | ~c);
    }
    function i(a, b) {
      return (a[b + 3] << 24) | (a[b + 2] << 16) | (a[b + 1] << 8) | a[b];
    }
    function j(a) {
      for (var b = [], c = 0; c < a.length; c++)
        if (a.charCodeAt(c) <= 127) b.push(a.charCodeAt(c));
        else
          for (
            var d = encodeURIComponent(a.charAt(c)).substr(1).split("%"), e = 0;
            e < d.length;
            e++
          )
            b.push(parseInt(d[e], 16));
      return b;
    }
    function k(a, c, d, e) {
      for (var f = "", g = 0, h = 0, i = 3; i >= 0; i--)
        (h = arguments[i]),
          (g = 255 & h),
          (h >>>= 8),
          (g <<= 8),
          (g |= 255 & h),
          (h >>>= 8),
          (g <<= 8),
          (g |= 255 & h),
          (h >>>= 8),
          (g <<= 8),
          (g |= h),
          (f += b(g));
      return f;
    }
    function l(a) {
      for (var b = new Array(a.length), c = 0; c < a.length; c++) b[c] = a[c];
      return b;
    }
    function m(a, b) {
      return 4294967295 & (a + b);
    }
    var n = null,
      o = null;
    return (
      "string" == typeof a
        ? (n = j(a))
        : a.constructor == Array
        ? 0 === a.length
          ? (n = a)
          : "string" == typeof a[0]
          ? (n = (function (a) {
              for (var b = [], c = 0; c < a.length; c++) b = b.concat(j(a[c]));
              return b;
            })(a))
          : "number" == typeof a[0]
          ? (n = a)
          : (o = typeof a[0])
        : "undefined" != typeof ArrayBuffer
        ? a instanceof ArrayBuffer
          ? (n = l(new Uint8Array(a)))
          : a instanceof Uint8Array || a instanceof Int8Array
          ? (n = l(a))
          : a instanceof Uint32Array ||
            a instanceof Int32Array ||
            a instanceof Uint16Array ||
            a instanceof Int16Array ||
            a instanceof Float32Array ||
            a instanceof Float64Array
          ? (n = l(new Uint8Array(a.buffer)))
          : (o = typeof a)
        : (o = typeof a),
      o && alert("MD5 type mismatch, cannot process " + o),
      (function () {
        function a(a, b, c, e) {
          var f = v;
          (v = u), (u = t), (t = m(t, d(m(s, m(a, m(b, c))), e))), (s = f);
        }
        var b = n.length;
        n.push(128);
        var j = n.length % 64;
        if (j > 56) {
          for (var l = 0; l < 64 - j; l++) n.push(0);
          j = n.length % 64;
        }
        for (l = 0; l < 56 - j; l++) n.push(0);
        n = n.concat(c(8 * b));
        var o = 1732584193,
          p = 4023233417,
          q = 2562383102,
          r = 271733878,
          s = 0,
          t = 0,
          u = 0,
          v = 0;
        for (l = 0; l < n.length / 64; l++) {
          (s = o), (t = p), (u = q), (v = r);
          var w = 64 * l;
          a(e(t, u, v), 3614090360, i(n, w), 7),
            a(e(t, u, v), 3905402710, i(n, w + 4), 12),
            a(e(t, u, v), 606105819, i(n, w + 8), 17),
            a(e(t, u, v), 3250441966, i(n, w + 12), 22),
            a(e(t, u, v), 4118548399, i(n, w + 16), 7),
            a(e(t, u, v), 1200080426, i(n, w + 20), 12),
            a(e(t, u, v), 2821735955, i(n, w + 24), 17),
            a(e(t, u, v), 4249261313, i(n, w + 28), 22),
            a(e(t, u, v), 1770035416, i(n, w + 32), 7),
            a(e(t, u, v), 2336552879, i(n, w + 36), 12),
            a(e(t, u, v), 4294925233, i(n, w + 40), 17),
            a(e(t, u, v), 2304563134, i(n, w + 44), 22),
            a(e(t, u, v), 1804603682, i(n, w + 48), 7),
            a(e(t, u, v), 4254626195, i(n, w + 52), 12),
            a(e(t, u, v), 2792965006, i(n, w + 56), 17),
            a(e(t, u, v), 1236535329, i(n, w + 60), 22),
            a(f(t, u, v), 4129170786, i(n, w + 4), 5),
            a(f(t, u, v), 3225465664, i(n, w + 24), 9),
            a(f(t, u, v), 643717713, i(n, w + 44), 14),
            a(f(t, u, v), 3921069994, i(n, w), 20),
            a(f(t, u, v), 3593408605, i(n, w + 20), 5),
            a(f(t, u, v), 38016083, i(n, w + 40), 9),
            a(f(t, u, v), 3634488961, i(n, w + 60), 14),
            a(f(t, u, v), 3889429448, i(n, w + 16), 20),
            a(f(t, u, v), 568446438, i(n, w + 36), 5),
            a(f(t, u, v), 3275163606, i(n, w + 56), 9),
            a(f(t, u, v), 4107603335, i(n, w + 12), 14),
            a(f(t, u, v), 1163531501, i(n, w + 32), 20),
            a(f(t, u, v), 2850285829, i(n, w + 52), 5),
            a(f(t, u, v), 4243563512, i(n, w + 8), 9),
            a(f(t, u, v), 1735328473, i(n, w + 28), 14),
            a(f(t, u, v), 2368359562, i(n, w + 48), 20),
            a(g(t, u, v), 4294588738, i(n, w + 20), 4),
            a(g(t, u, v), 2272392833, i(n, w + 32), 11),
            a(g(t, u, v), 1839030562, i(n, w + 44), 16),
            a(g(t, u, v), 4259657740, i(n, w + 56), 23),
            a(g(t, u, v), 2763975236, i(n, w + 4), 4),
            a(g(t, u, v), 1272893353, i(n, w + 16), 11),
            a(g(t, u, v), 4139469664, i(n, w + 28), 16),
            a(g(t, u, v), 3200236656, i(n, w + 40), 23),
            a(g(t, u, v), 681279174, i(n, w + 52), 4),
            a(g(t, u, v), 3936430074, i(n, w), 11),
            a(g(t, u, v), 3572445317, i(n, w + 12), 16),
            a(g(t, u, v), 76029189, i(n, w + 24), 23),
            a(g(t, u, v), 3654602809, i(n, w + 36), 4),
            a(g(t, u, v), 3873151461, i(n, w + 48), 11),
            a(g(t, u, v), 530742520, i(n, w + 60), 16),
            a(g(t, u, v), 3299628645, i(n, w + 8), 23),
            a(h(t, u, v), 4096336452, i(n, w), 6),
            a(h(t, u, v), 1126891415, i(n, w + 28), 10),
            a(h(t, u, v), 2878612391, i(n, w + 56), 15),
            a(h(t, u, v), 4237533241, i(n, w + 20), 21),
            a(h(t, u, v), 1700485571, i(n, w + 48), 6),
            a(h(t, u, v), 2399980690, i(n, w + 12), 10),
            a(h(t, u, v), 4293915773, i(n, w + 40), 15),
            a(h(t, u, v), 2240044497, i(n, w + 4), 21),
            a(h(t, u, v), 1873313359, i(n, w + 32), 6),
            a(h(t, u, v), 4264355552, i(n, w + 60), 10),
            a(h(t, u, v), 2734768916, i(n, w + 24), 15),
            a(h(t, u, v), 1309151649, i(n, w + 52), 21),
            a(h(t, u, v), 4149444226, i(n, w + 16), 6),
            a(h(t, u, v), 3174756917, i(n, w + 44), 10),
            a(h(t, u, v), 718787259, i(n, w + 8), 15),
            a(h(t, u, v), 3951481745, i(n, w + 36), 21),
            (o = m(o, s)),
            (p = m(p, t)),
            (q = m(q, u)),
            (r = m(r, v));
        }
        return k(r, q, p, o).toUpperCase();
      })()
    );
  }),
  (function (a) {
    if ("object" == typeof exports && "undefined" != typeof module)
      module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
      var b;
      "undefined" != typeof window
        ? (b = window)
        : "undefined" != typeof global
        ? (b = global)
        : "undefined" != typeof self && (b = self),
        (b.JSZip = a());
    }
  })(function () {
    return (function a(b, c, d) {
      function e(g, h) {
        if (!c[g]) {
          if (!b[g]) {
            var i = "function" == typeof require && require;
            if (!h && i) return i(g, !0);
            if (f) return f(g, !0);
            throw new Error("Cannot find module '" + g + "'");
          }
          var j = (c[g] = {
            exports: {},
          });
          b[g][0].call(
            j.exports,
            function (a) {
              var c = b[g][1][a];
              return e(c || a);
            },
            j,
            j.exports,
            a,
            b,
            c,
            d
          );
        }
        return c[g].exports;
      }
      for (
        var f = "function" == typeof require && require, g = 0;
        g < d.length;
        g++
      )
        e(d[g]);
      return e;
    })(
      {
        1: [
          function (a, b, c) {
            "use strict";
            var d =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            (c.encode = function (a) {
              for (var b, c, e, f, g, h, i, j = "", k = 0; k < a.length; )
                (b = a.charCodeAt(k++)),
                  (c = a.charCodeAt(k++)),
                  (e = a.charCodeAt(k++)),
                  (f = b >> 2),
                  (g = ((3 & b) << 4) | (c >> 4)),
                  (h = ((15 & c) << 2) | (e >> 6)),
                  (i = 63 & e),
                  isNaN(c) ? (h = i = 64) : isNaN(e) && (i = 64),
                  (j =
                    j + d.charAt(f) + d.charAt(g) + d.charAt(h) + d.charAt(i));
              return j;
            }),
              (c.decode = function (a) {
                var b,
                  c,
                  e,
                  f,
                  g,
                  h,
                  i,
                  j = "",
                  k = 0;
                for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); k < a.length; )
                  (f = d.indexOf(a.charAt(k++))),
                    (g = d.indexOf(a.charAt(k++))),
                    (h = d.indexOf(a.charAt(k++))),
                    (i = d.indexOf(a.charAt(k++))),
                    (b = (f << 2) | (g >> 4)),
                    (c = ((15 & g) << 4) | (h >> 2)),
                    (e = ((3 & h) << 6) | i),
                    (j += String.fromCharCode(b)),
                    64 != h && (j += String.fromCharCode(c)),
                    64 != i && (j += String.fromCharCode(e));
                return j;
              });
          },
          {},
        ],
        2: [
          function (a, b) {
            "use strict";
            function c() {
              (this.compressedSize = 0),
                (this.uncompressedSize = 0),
                (this.crc32 = 0),
                (this.compressionMethod = null),
                (this.compressedContent = null);
            }
            (c.prototype = {
              getContent: function () {
                return null;
              },
              getCompressedContent: function () {
                return null;
              },
            }),
              (b.exports = c);
          },
          {},
        ],
        3: [
          function (a, b, c) {
            "use strict";
            (c.STORE = {
              magic: "\0\0",
              compress: function (a) {
                return a;
              },
              uncompress: function (a) {
                return a;
              },
              compressInputType: null,
              uncompressInputType: null,
            }),
              (c.DEFLATE = a("./flate"));
          },
          { "./flate": 8 },
        ],
        4: [
          function (a, b) {
            "use strict";
            var c = a("./utils"),
              d = [
                0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615,
                3915621685, 2657392035, 249268274, 2044508324, 3772115230,
                2547177864, 162941995, 2125561021, 3887607047, 2428444049,
                498536548, 1789927666, 4089016648, 2227061214, 450548861,
                1843258603, 4107580753, 2211677639, 325883990, 1684777152,
                4251122042, 2321926636, 335633487, 1661365465, 4195302755,
                2366115317, 997073096, 1281953886, 3579855332, 2724688242,
                1006888145, 1258607687, 3524101629, 2768942443, 901097722,
                1119000684, 3686517206, 2898065728, 853044451, 1172266101,
                3705015759, 2882616665, 651767980, 1373503546, 3369554304,
                3218104598, 565507253, 1454621731, 3485111705, 3099436303,
                671266974, 1594198024, 3322730930, 2970347812, 795835527,
                1483230225, 3244367275, 3060149565, 1994146192, 31158534,
                2563907772, 4023717930, 1907459465, 112637215, 2680153253,
                3904427059, 2013776290, 251722036, 2517215374, 3775830040,
                2137656763, 141376813, 2439277719, 3865271297, 1802195444,
                476864866, 2238001368, 4066508878, 1812370925, 453092731,
                2181625025, 4111451223, 1706088902, 314042704, 2344532202,
                4240017532, 1658658271, 366619977, 2362670323, 4224994405,
                1303535960, 984961486, 2747007092, 3569037538, 1256170817,
                1037604311, 2765210733, 3554079995, 1131014506, 879679996,
                2909243462, 3663771856, 1141124467, 855842277, 2852801631,
                3708648649, 1342533948, 654459306, 3188396048, 3373015174,
                1466479909, 544179635, 3110523913, 3462522015, 1591671054,
                702138776, 2966460450, 3352799412, 1504918807, 783551873,
                3082640443, 3233442989, 3988292384, 2596254646, 62317068,
                1957810842, 3939845945, 2647816111, 81470997, 1943803523,
                3814918930, 2489596804, 225274430, 2053790376, 3826175755,
                2466906013, 167816743, 2097651377, 4027552580, 2265490386,
                503444072, 1762050814, 4150417245, 2154129355, 426522225,
                1852507879, 4275313526, 2312317920, 282753626, 1742555852,
                4189708143, 2394877945, 397917763, 1622183637, 3604390888,
                2714866558, 953729732, 1340076626, 3518719985, 2797360999,
                1068828381, 1219638859, 3624741850, 2936675148, 906185462,
                1090812512, 3747672003, 2825379669, 829329135, 1181335161,
                3412177804, 3160834842, 628085408, 1382605366, 3423369109,
                3138078467, 570562233, 1426400815, 3317316542, 2998733608,
                733239954, 1555261956, 3268935591, 3050360625, 752459403,
                1541320221, 2607071920, 3965973030, 1969922972, 40735498,
                2617837225, 3943577151, 1913087877, 83908371, 2512341634,
                3803740692, 2075208622, 213261112, 2463272603, 3855990285,
                2094854071, 198958881, 2262029012, 4057260610, 1759359992,
                534414190, 2176718541, 4139329115, 1873836001, 414664567,
                2282248934, 4279200368, 1711684554, 285281116, 2405801727,
                4167216745, 1634467795, 376229701, 2685067896, 3608007406,
                1308918612, 956543938, 2808555105, 3495958263, 1231636301,
                1047427035, 2932959818, 3654703836, 1088359270, 936918e3,
                2847714899, 3736837829, 1202900863, 817233897, 3183342108,
                3401237130, 1404277552, 615818150, 3134207493, 3453421203,
                1423857449, 601450431, 3009837614, 3294710456, 1567103746,
                711928724, 3020668471, 3272380065, 1510334235, 755167117,
              ];
            b.exports = function (a, b) {
              if (void 0 === a || !a.length) return 0;
              var e = "string" !== c.getTypeOf(a);
              void 0 === b && (b = 0);
              var f = 0,
                g = 0,
                h = 0;
              b ^= -1;
              for (var i = 0, j = a.length; j > i; i++)
                (h = e ? a[i] : a.charCodeAt(i)),
                  (g = 255 & (b ^ h)),
                  (f = d[g]),
                  (b = (b >>> 8) ^ f);
              return -1 ^ b;
            };
          },
          { "./utils": 21 },
        ],
        5: [
          function (a, b) {
            "use strict";
            function c() {
              (this.data = null), (this.length = 0), (this.index = 0);
            }
            var d = a("./utils");
            (c.prototype = {
              checkOffset: function (a) {
                this.checkIndex(this.index + a);
              },
              checkIndex: function (a) {
                if (this.length < a || 0 > a)
                  throw new Error(
                    "End of data reached (data length = " +
                      this.length +
                      ", asked index = " +
                      a +
                      "). Corrupted zip ?"
                  );
              },
              setIndex: function (a) {
                this.checkIndex(a), (this.index = a);
              },
              skip: function (a) {
                this.setIndex(this.index + a);
              },
              byteAt: function () {},
              readInt: function (a) {
                var b,
                  c = 0;
                for (
                  this.checkOffset(a), b = this.index + a - 1;
                  b >= this.index;
                  b--
                )
                  c = (c << 8) + this.byteAt(b);
                return (this.index += a), c;
              },
              readString: function (a) {
                return d.transformTo("string", this.readData(a));
              },
              readData: function () {},
              lastIndexOfSignature: function () {},
              readDate: function () {
                var a = this.readInt(4);
                return new Date(
                  1980 + ((a >> 25) & 127),
                  ((a >> 21) & 15) - 1,
                  (a >> 16) & 31,
                  (a >> 11) & 31,
                  (a >> 5) & 63,
                  (31 & a) << 1
                );
              },
            }),
              (b.exports = c);
          },
          { "./utils": 21 },
        ],
        6: [
          function (a, b, c) {
            "use strict";
            (c.base64 = !1),
              (c.binary = !1),
              (c.dir = !1),
              (c.createFolders = !1),
              (c.date = null),
              (c.compression = null),
              (c.comment = null);
          },
          {},
        ],
        7: [
          function (a, b, c) {
            "use strict";
            var d = a("./utils");
            (c.string2binary = function (a) {
              return d.string2binary(a);
            }),
              (c.string2Uint8Array = function (a) {
                return d.transformTo("uint8array", a);
              }),
              (c.uint8Array2String = function (a) {
                return d.transformTo("string", a);
              }),
              (c.string2Blob = function (a) {
                var b = d.transformTo("arraybuffer", a);
                return d.arrayBuffer2Blob(b);
              }),
              (c.arrayBuffer2Blob = function (a) {
                return d.arrayBuffer2Blob(a);
              }),
              (c.transformTo = function (a, b) {
                return d.transformTo(a, b);
              }),
              (c.getTypeOf = function (a) {
                return d.getTypeOf(a);
              }),
              (c.checkSupport = function (a) {
                return d.checkSupport(a);
              }),
              (c.MAX_VALUE_16BITS = d.MAX_VALUE_16BITS),
              (c.MAX_VALUE_32BITS = d.MAX_VALUE_32BITS),
              (c.pretty = function (a) {
                return d.pretty(a);
              }),
              (c.findCompression = function (a) {
                return d.findCompression(a);
              }),
              (c.isRegExp = function (a) {
                return d.isRegExp(a);
              });
          },
          { "./utils": 21 },
        ],
        8: [
          function (a, b, c) {
            "use strict";
            var d =
                "undefined" != typeof Uint8Array &&
                "undefined" != typeof Uint16Array &&
                "undefined" != typeof Uint32Array,
              e = a("pako");
            (c.uncompressInputType = d ? "uint8array" : "array"),
              (c.compressInputType = d ? "uint8array" : "array"),
              (c.magic = "\b\0"),
              (c.compress = function (a) {
                return e.deflateRaw(a);
              }),
              (c.uncompress = function (a) {
                return e.inflateRaw(a);
              });
          },
          { pako: 24 },
        ],
        9: [
          function (a, b) {
            "use strict";
            function c(a, b) {
              return this instanceof c
                ? ((this.files = {}),
                  (this.comment = null),
                  (this.root = ""),
                  a && this.load(a, b),
                  void (this.clone = function () {
                    var a = new c();
                    for (var b in this)
                      "function" != typeof this[b] && (a[b] = this[b]);
                    return a;
                  }))
                : new c(a, b);
            }
            var d = a("./base64");
            (c.prototype = a("./object")),
              (c.prototype.load = a("./load")),
              (c.support = a("./support")),
              (c.defaults = a("./defaults")),
              (c.utils = a("./deprecatedPublicUtils")),
              (c.base64 = {
                encode: function (a) {
                  return d.encode(a);
                },
                decode: function (a) {
                  return d.decode(a);
                },
              }),
              (c.compressions = a("./compressions")),
              (b.exports = c);
          },
          {
            "./base64": 1,
            "./compressions": 3,
            "./defaults": 6,
            "./deprecatedPublicUtils": 7,
            "./load": 10,
            "./object": 13,
            "./support": 17,
          },
        ],
        10: [
          function (a, b) {
            "use strict";
            var c = a("./base64"),
              d = a("./zipEntries");
            b.exports = function (a, b) {
              var e, f, g, h;
              for (
                b = b || {},
                  b.base64 && (a = c.decode(a)),
                  f = new d(a, b),
                  e = f.files,
                  g = 0;
                g < e.length;
                g++
              )
                (h = e[g]),
                  this.file(h.fileName, h.decompressed, {
                    binary: !0,
                    optimizedBinaryString: !0,
                    date: h.date,
                    dir: h.dir,
                    comment: h.fileComment.length ? h.fileComment : null,
                    createFolders: b.createFolders,
                  });
              return f.zipComment.length && (this.comment = f.zipComment), this;
            };
          },
          { "./base64": 1, "./zipEntries": 22 },
        ],
        11: [
          function (a, b) {
            (function (a) {
              "use strict";
              (b.exports = function (b, c) {
                return new a(b, c);
              }),
                (b.exports.test = function (b) {
                  return a.isBuffer(b);
                });
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0);
          },
          {},
        ],
        12: [
          function (a, b) {
            "use strict";
            function c(a) {
              (this.data = a),
                (this.length = this.data.length),
                (this.index = 0);
            }
            var d = a("./uint8ArrayReader");
            (c.prototype = new d()),
              (c.prototype.readData = function (a) {
                this.checkOffset(a);
                var b = this.data.slice(this.index, this.index + a);
                return (this.index += a), b;
              }),
              (b.exports = c);
          },
          { "./uint8ArrayReader": 18 },
        ],
        13: [
          function (a, b) {
            "use strict";
            var c = a("./support"),
              d = a("./utils"),
              e = a("./crc32"),
              f = a("./signature"),
              g = a("./defaults"),
              h = a("./base64"),
              i = a("./compressions"),
              j = a("./compressedObject"),
              k = a("./nodeBuffer"),
              l = a("./utf8"),
              m = a("./stringWriter"),
              n = a("./uint8ArrayWriter"),
              o = function (a) {
                if (
                  a._data instanceof j &&
                  ((a._data = a._data.getContent()),
                  (a.options.binary = !0),
                  (a.options.base64 = !1),
                  "uint8array" === d.getTypeOf(a._data))
                ) {
                  var b = a._data;
                  (a._data = new Uint8Array(b.length)),
                    0 !== b.length && a._data.set(b, 0);
                }
                return a._data;
              },
              p = function (a) {
                var b = o(a);
                return "string" === d.getTypeOf(b)
                  ? !a.options.binary && c.nodebuffer
                    ? k(b, "utf-8")
                    : a.asBinary()
                  : b;
              },
              q = function (a) {
                var b = o(this);
                return null === b || void 0 === b
                  ? ""
                  : (this.options.base64 && (b = h.decode(b)),
                    (b =
                      a && this.options.binary
                        ? A.utf8decode(b)
                        : d.transformTo("string", b)),
                    a ||
                      this.options.binary ||
                      (b = d.transformTo("string", A.utf8encode(b))),
                    b);
              },
              r = function (a, b, c) {
                (this.name = a),
                  (this.dir = c.dir),
                  (this.date = c.date),
                  (this.comment = c.comment),
                  (this._data = b),
                  (this.options = c),
                  (this._initialMetadata = { dir: c.dir, date: c.date });
              };
            r.prototype = {
              asText: function () {
                return q.call(this, !0);
              },
              asBinary: function () {
                return q.call(this, !1);
              },
              asNodeBuffer: function () {
                var a = p(this);
                return d.transformTo("nodebuffer", a);
              },
              asUint8Array: function () {
                var a = p(this);
                return d.transformTo("uint8array", a);
              },
              asArrayBuffer: function () {
                return this.asUint8Array().buffer;
              },
            };
            var s = function (a, b) {
                var c,
                  d = "";
                for (c = 0; b > c; c++)
                  (d += String.fromCharCode(255 & a)), (a >>>= 8);
                return d;
              },
              t = function () {
                var a,
                  b,
                  c = {};
                for (a = 0; a < arguments.length; a++)
                  for (b in arguments[a])
                    arguments[a].hasOwnProperty(b) &&
                      void 0 === c[b] &&
                      (c[b] = arguments[a][b]);
                return c;
              },
              u = function (a) {
                return (
                  (a = a || {}),
                  !0 !== a.base64 ||
                    (null !== a.binary && void 0 !== a.binary) ||
                    (a.binary = !0),
                  (a = t(a, g)),
                  (a.date = a.date || new Date()),
                  null !== a.compression &&
                    (a.compression = a.compression.toUpperCase()),
                  a
                );
              },
              v = function (a, b, c) {
                var e,
                  f = d.getTypeOf(b);
                if (
                  ((c = u(c)),
                  c.createFolders && (e = w(a)) && x.call(this, e, !0),
                  c.dir || null === b || void 0 === b)
                )
                  (c.base64 = !1), (c.binary = !1), (b = null);
                else if ("string" === f)
                  c.binary &&
                    !c.base64 &&
                    !0 !== c.optimizedBinaryString &&
                    (b = d.string2binary(b));
                else {
                  if (
                    ((c.base64 = !1), (c.binary = !0), !(f || b instanceof j))
                  )
                    throw new Error(
                      "The data of '" + a + "' is in an unsupported format !"
                    );
                  "arraybuffer" === f && (b = d.transformTo("uint8array", b));
                }
                var g = new r(a, b, c);
                return (this.files[a] = g), g;
              },
              w = function (a) {
                "/" == a.slice(-1) && (a = a.substring(0, a.length - 1));
                var b = a.lastIndexOf("/");
                return b > 0 ? a.substring(0, b) : "";
              },
              x = function (a, b) {
                return (
                  "/" != a.slice(-1) && (a += "/"),
                  (b = void 0 !== b && b),
                  this.files[a] ||
                    v.call(this, a, null, { dir: !0, createFolders: b }),
                  this.files[a]
                );
              },
              y = function (a, b) {
                var c,
                  f = new j();
                return (
                  a._data instanceof j
                    ? ((f.uncompressedSize = a._data.uncompressedSize),
                      (f.crc32 = a._data.crc32),
                      0 === f.uncompressedSize || a.dir
                        ? ((b = i.STORE),
                          (f.compressedContent = ""),
                          (f.crc32 = 0))
                        : a._data.compressionMethod === b.magic
                        ? (f.compressedContent = a._data.getCompressedContent())
                        : ((c = a._data.getContent()),
                          (f.compressedContent = b.compress(
                            d.transformTo(b.compressInputType, c)
                          ))))
                    : ((c = p(a)),
                      (!c || 0 === c.length || a.dir) &&
                        ((b = i.STORE), (c = "")),
                      (f.uncompressedSize = c.length),
                      (f.crc32 = e(c)),
                      (f.compressedContent = b.compress(
                        d.transformTo(b.compressInputType, c)
                      ))),
                  (f.compressedSize = f.compressedContent.length),
                  (f.compressionMethod = b.magic),
                  f
                );
              },
              z = function (a, b, c, g) {
                var h,
                  i,
                  j,
                  k,
                  m =
                    (c.compressedContent,
                    d.transformTo("string", l.utf8encode(b.name))),
                  n = b.comment || "",
                  o = d.transformTo("string", l.utf8encode(n)),
                  p = m.length !== b.name.length,
                  q = o.length !== n.length,
                  r = b.options,
                  t = "",
                  u = "",
                  v = "";
                (j = b._initialMetadata.dir !== b.dir ? b.dir : r.dir),
                  (k = b._initialMetadata.date !== b.date ? b.date : r.date),
                  (h = k.getHours()),
                  (h <<= 6),
                  (h |= k.getMinutes()),
                  (h <<= 5),
                  (h |= k.getSeconds() / 2),
                  (i = k.getFullYear() - 1980),
                  (i <<= 4),
                  (i |= k.getMonth() + 1),
                  (i <<= 5),
                  (i |= k.getDate()),
                  p &&
                    ((u = s(1, 1) + s(e(m), 4) + m),
                    (t += "up" + s(u.length, 2) + u)),
                  q &&
                    ((v = s(1, 1) + s(this.crc32(o), 4) + o),
                    (t += "uc" + s(v.length, 2) + v));
                var w = "";
                return (
                  (w += "\n\0"),
                  (w += p || q ? "\0\b" : "\0\0"),
                  (w += c.compressionMethod),
                  (w += s(h, 2)),
                  (w += s(i, 2)),
                  (w += s(c.crc32, 4)),
                  (w += s(c.compressedSize, 4)),
                  (w += s(c.uncompressedSize, 4)),
                  (w += s(m.length, 2)),
                  (w += s(t.length, 2)),
                  {
                    fileRecord: f.LOCAL_FILE_HEADER + w + m + t,
                    dirRecord:
                      f.CENTRAL_FILE_HEADER +
                      "\0" +
                      w +
                      s(o.length, 2) +
                      "\0\0\0\0" +
                      (!0 === j ? "\0\0\0" : "\0\0\0\0") +
                      s(g, 4) +
                      m +
                      t +
                      o,
                    compressedObject: c,
                  }
                );
              },
              A = {
                load: function () {
                  throw new Error(
                    "Load method is not defined. Is the file jszip-load.js included ?"
                  );
                },
                filter: function (a) {
                  var b,
                    c,
                    d,
                    e,
                    f = [];
                  for (b in this.files)
                    this.files.hasOwnProperty(b) &&
                      ((d = this.files[b]),
                      (e = new r(d.name, d._data, t(d.options))),
                      (c = b.slice(this.root.length, b.length)),
                      b.slice(0, this.root.length) === this.root &&
                        a(c, e) &&
                        f.push(e));
                  return f;
                },
                file: function (a, b, c) {
                  if (1 === arguments.length) {
                    if (d.isRegExp(a)) {
                      var e = a;
                      return this.filter(function (a, b) {
                        return !b.dir && e.test(a);
                      });
                    }
                    return (
                      this.filter(function (b, c) {
                        return !c.dir && b === a;
                      })[0] || null
                    );
                  }
                  return (a = this.root + a), v.call(this, a, b, c), this;
                },
                folder: function (a) {
                  if (!a) return this;
                  if (d.isRegExp(a))
                    return this.filter(function (b, c) {
                      return c.dir && a.test(b);
                    });
                  var b = this.root + a,
                    c = x.call(this, b),
                    e = this.clone();
                  return (e.root = c.name), e;
                },
                remove: function (a) {
                  a = this.root + a;
                  var b = this.files[a];
                  if (
                    (b ||
                      ("/" != a.slice(-1) && (a += "/"), (b = this.files[a])),
                    b && !b.dir)
                  )
                    delete this.files[a];
                  else
                    for (
                      var c = this.filter(function (b, c) {
                          return c.name.slice(0, a.length) === a;
                        }),
                        d = 0;
                      d < c.length;
                      d++
                    )
                      delete this.files[c[d].name];
                  return this;
                },
                generate: function (a) {
                  (a = t(a || {}, {
                    base64: !0,
                    compression: "STORE",
                    type: "base64",
                    comment: null,
                  })),
                    d.checkSupport(a.type);
                  var b,
                    c,
                    e = [],
                    g = 0,
                    j = 0,
                    k = d.transformTo(
                      "string",
                      this.utf8encode(a.comment || this.comment || "")
                    );
                  for (var l in this.files)
                    if (this.files.hasOwnProperty(l)) {
                      var o = this.files[l],
                        p =
                          o.options.compression || a.compression.toUpperCase(),
                        q = i[p];
                      if (!q)
                        throw new Error(
                          p + " is not a valid compression method !"
                        );
                      var r = y.call(this, o, q),
                        u = z.call(this, l, o, r, g);
                      (g += u.fileRecord.length + r.compressedSize),
                        (j += u.dirRecord.length),
                        e.push(u);
                    }
                  var v = "";
                  v =
                    f.CENTRAL_DIRECTORY_END +
                    "\0\0\0\0" +
                    s(e.length, 2) +
                    s(e.length, 2) +
                    s(j, 4) +
                    s(g, 4) +
                    s(k.length, 2) +
                    k;
                  var w = a.type.toLowerCase();
                  for (
                    b =
                      "uint8array" === w ||
                      "arraybuffer" === w ||
                      "blob" === w ||
                      "nodebuffer" === w
                        ? new n(g + j + v.length)
                        : new m(g + j + v.length),
                      c = 0;
                    c < e.length;
                    c++
                  )
                    b.append(e[c].fileRecord),
                      b.append(e[c].compressedObject.compressedContent);
                  for (c = 0; c < e.length; c++) b.append(e[c].dirRecord);
                  b.append(v);
                  var x = b.finalize();
                  switch (a.type.toLowerCase()) {
                    case "uint8array":
                    case "arraybuffer":
                    case "nodebuffer":
                      return d.transformTo(a.type.toLowerCase(), x);
                    case "blob":
                      return d.arrayBuffer2Blob(
                        d.transformTo("arraybuffer", x)
                      );
                    case "base64":
                      return a.base64 ? h.encode(x) : x;
                    default:
                      return x;
                  }
                },
                crc32: function (a, b) {
                  return e(a, b);
                },
                utf8encode: function (a) {
                  return d.transformTo("string", l.utf8encode(a));
                },
                utf8decode: function (a) {
                  return l.utf8decode(a);
                },
              };
            b.exports = A;
          },
          {
            "./base64": 1,
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./defaults": 6,
            "./nodeBuffer": 11,
            "./signature": 14,
            "./stringWriter": 16,
            "./support": 17,
            "./uint8ArrayWriter": 19,
            "./utf8": 20,
            "./utils": 21,
          },
        ],
        14: [
          function (a, b, c) {
            "use strict";
            (c.LOCAL_FILE_HEADER = "PK"),
              (c.CENTRAL_FILE_HEADER = "PK"),
              (c.CENTRAL_DIRECTORY_END = "PK"),
              (c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK"),
              (c.ZIP64_CENTRAL_DIRECTORY_END = "PK"),
              (c.DATA_DESCRIPTOR = "PK\b");
          },
          {},
        ],
        15: [
          function (a, b) {
            "use strict";
            function c(a, b) {
              (this.data = a),
                b || (this.data = e.string2binary(this.data)),
                (this.length = this.data.length),
                (this.index = 0);
            }
            var d = a("./dataReader"),
              e = a("./utils");
            (c.prototype = new d()),
              (c.prototype.byteAt = function (a) {
                return this.data.charCodeAt(a);
              }),
              (c.prototype.lastIndexOfSignature = function (a) {
                return this.data.lastIndexOf(a);
              }),
              (c.prototype.readData = function (a) {
                this.checkOffset(a);
                var b = this.data.slice(this.index, this.index + a);
                return (this.index += a), b;
              }),
              (b.exports = c);
          },
          { "./dataReader": 5, "./utils": 21 },
        ],
        16: [
          function (a, b) {
            "use strict";
            var c = a("./utils"),
              d = function () {
                this.data = [];
              };
            (d.prototype = {
              append: function (a) {
                (a = c.transformTo("string", a)), this.data.push(a);
              },
              finalize: function () {
                return this.data.join("");
              },
            }),
              (b.exports = d);
          },
          { "./utils": 21 },
        ],
        17: [
          function (a, b, c) {
            (function (a) {
              "use strict";
              if (
                ((c.base64 = !0),
                (c.array = !0),
                (c.string = !0),
                (c.arraybuffer =
                  "undefined" != typeof ArrayBuffer &&
                  "undefined" != typeof Uint8Array),
                (c.nodebuffer = void 0 !== a),
                (c.uint8array = "undefined" != typeof Uint8Array),
                "undefined" == typeof ArrayBuffer)
              )
                c.blob = !1;
              else {
                var b = new ArrayBuffer(0);
                try {
                  c.blob =
                    0 === new Blob([b], { type: "application/zip" }).size;
                } catch (a) {
                  try {
                    var d =
                        window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder,
                      e = new d();
                    e.append(b),
                      (c.blob = 0 === e.getBlob("application/zip").size);
                  } catch (a) {
                    c.blob = !1;
                  }
                }
              }
            }).call(this, "undefined" != typeof Buffer ? Buffer : void 0);
          },
          {},
        ],
        18: [
          function (a, b) {
            "use strict";
            function c(a) {
              a &&
                ((this.data = a),
                (this.length = this.data.length),
                (this.index = 0));
            }
            var d = a("./dataReader");
            (c.prototype = new d()),
              (c.prototype.byteAt = function (a) {
                return this.data[a];
              }),
              (c.prototype.lastIndexOfSignature = function (a) {
                for (
                  var b = a.charCodeAt(0),
                    c = a.charCodeAt(1),
                    d = a.charCodeAt(2),
                    e = a.charCodeAt(3),
                    f = this.length - 4;
                  f >= 0;
                  --f
                )
                  if (
                    this.data[f] === b &&
                    this.data[f + 1] === c &&
                    this.data[f + 2] === d &&
                    this.data[f + 3] === e
                  )
                    return f;
                return -1;
              }),
              (c.prototype.readData = function (a) {
                if ((this.checkOffset(a), 0 === a)) return new Uint8Array(0);
                var b = this.data.subarray(this.index, this.index + a);
                return (this.index += a), b;
              }),
              (b.exports = c);
          },
          { "./dataReader": 5 },
        ],
        19: [
          function (a, b) {
            "use strict";
            var c = a("./utils"),
              d = function (a) {
                (this.data = new Uint8Array(a)), (this.index = 0);
              };
            (d.prototype = {
              append: function (a) {
                0 !== a.length &&
                  ((a = c.transformTo("uint8array", a)),
                  this.data.set(a, this.index),
                  (this.index += a.length));
              },
              finalize: function () {
                return this.data;
              },
            }),
              (b.exports = d);
          },
          { "./utils": 21 },
        ],
        20: [
          function (a, b, c) {
            "use strict";
            for (
              var d = a("./utils"),
                e = a("./support"),
                f = a("./nodeBuffer"),
                g = new Array(256),
                h = 0;
              256 > h;
              h++
            )
              g[h] =
                h >= 252
                  ? 6
                  : h >= 248
                  ? 5
                  : h >= 240
                  ? 4
                  : h >= 224
                  ? 3
                  : h >= 192
                  ? 2
                  : 1;
            g[254] = g[254] = 1;
            var i = function (a) {
                var b,
                  c,
                  d,
                  f,
                  g,
                  h = a.length,
                  i = 0;
                for (f = 0; h > f; f++)
                  (c = a.charCodeAt(f)),
                    55296 == (64512 & c) &&
                      h > f + 1 &&
                      56320 == (64512 & (d = a.charCodeAt(f + 1))) &&
                      ((c = 65536 + ((c - 55296) << 10) + (d - 56320)), f++),
                    (i += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4);
                for (
                  b = e.uint8array ? new Uint8Array(i) : new Array(i),
                    g = 0,
                    f = 0;
                  i > g;
                  f++
                )
                  (c = a.charCodeAt(f)),
                    55296 == (64512 & c) &&
                      h > f + 1 &&
                      56320 == (64512 & (d = a.charCodeAt(f + 1))) &&
                      ((c = 65536 + ((c - 55296) << 10) + (d - 56320)), f++),
                    128 > c
                      ? (b[g++] = c)
                      : 2048 > c
                      ? ((b[g++] = 192 | (c >>> 6)), (b[g++] = 128 | (63 & c)))
                      : 65536 > c
                      ? ((b[g++] = 224 | (c >>> 12)),
                        (b[g++] = 128 | ((c >>> 6) & 63)),
                        (b[g++] = 128 | (63 & c)))
                      : ((b[g++] = 240 | (c >>> 18)),
                        (b[g++] = 128 | ((c >>> 12) & 63)),
                        (b[g++] = 128 | ((c >>> 6) & 63)),
                        (b[g++] = 128 | (63 & c)));
                return b;
              },
              j = function (a, b) {
                var c;
                for (
                  b = b || a.length, b > a.length && (b = a.length), c = b - 1;
                  c >= 0 && 128 == (192 & a[c]);

                )
                  c--;
                return 0 > c ? b : 0 === c ? b : c + g[a[c]] > b ? c : b;
              },
              k = function (a) {
                var b,
                  c,
                  e,
                  f,
                  h = a.length,
                  i = new Array(2 * h);
                for (c = 0, b = 0; h > b; )
                  if (128 > (e = a[b++])) i[c++] = e;
                  else if ((f = g[e]) > 4) (i[c++] = 65533), (b += f - 1);
                  else {
                    for (e &= 2 === f ? 31 : 3 === f ? 15 : 7; f > 1 && h > b; )
                      (e = (e << 6) | (63 & a[b++])), f--;
                    f > 1
                      ? (i[c++] = 65533)
                      : 65536 > e
                      ? (i[c++] = e)
                      : ((e -= 65536),
                        (i[c++] = 55296 | ((e >> 10) & 1023)),
                        (i[c++] = 56320 | (1023 & e)));
                  }
                return (
                  i.length !== c &&
                    (i.subarray ? (i = i.subarray(0, c)) : (i.length = c)),
                  d.applyFromCharCode(i)
                );
              };
            (c.utf8encode = function (a) {
              return e.nodebuffer ? f(a, "utf-8") : i(a);
            }),
              (c.utf8decode = function (a) {
                if (e.nodebuffer)
                  return d.transformTo("nodebuffer", a).toString("utf-8");
                a = d.transformTo(e.uint8array ? "uint8array" : "array", a);
                for (var b = [], c = 0, f = a.length; f > c; ) {
                  var g = j(a, Math.min(c + 65536, f));
                  b.push(k(e.uint8array ? a.subarray(c, g) : a.slice(c, g))),
                    (c = g);
                }
                return b.join("");
              });
          },
          { "./nodeBuffer": 11, "./support": 17, "./utils": 21 },
        ],
        21: [
          function (a, b, c) {
            "use strict";
            function d(a) {
              return a;
            }
            function e(a, b) {
              for (var c = 0; c < a.length; ++c) b[c] = 255 & a.charCodeAt(c);
              return b;
            }
            function f(a) {
              var b = 65536,
                d = [],
                e = a.length,
                f = c.getTypeOf(a),
                g = 0,
                h = !0;
              try {
                switch (f) {
                  case "uint8array":
                    String.fromCharCode.apply(null, new Uint8Array(0));
                    break;
                  case "nodebuffer":
                    String.fromCharCode.apply(null, j(0));
                }
              } catch (a) {
                h = !1;
              }
              if (!h) {
                for (var i = "", k = 0; k < a.length; k++)
                  i += String.fromCharCode(a[k]);
                return i;
              }
              for (; e > g && b > 1; )
                try {
                  d.push(
                    "array" === f || "nodebuffer" === f
                      ? String.fromCharCode.apply(
                          null,
                          a.slice(g, Math.min(g + b, e))
                        )
                      : String.fromCharCode.apply(
                          null,
                          a.subarray(g, Math.min(g + b, e))
                        )
                  ),
                    (g += b);
                } catch (a) {
                  b = Math.floor(b / 2);
                }
              return d.join("");
            }
            function g(a, b) {
              for (var c = 0; c < a.length; c++) b[c] = a[c];
              return b;
            }
            var h = a("./support"),
              i = a("./compressions"),
              j = a("./nodeBuffer");
            (c.string2binary = function (a) {
              for (var b = "", c = 0; c < a.length; c++)
                b += String.fromCharCode(255 & a.charCodeAt(c));
              return b;
            }),
              (c.arrayBuffer2Blob = function (a) {
                c.checkSupport("blob");
                try {
                  return new Blob([a], { type: "application/zip" });
                } catch (c) {
                  try {
                    var b =
                        window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder,
                      d = new b();
                    return d.append(a), d.getBlob("application/zip");
                  } catch (a) {
                    throw new Error("Bug : can't construct the Blob.");
                  }
                }
              }),
              (c.applyFromCharCode = f);
            var k = {};
            (k.string = {
              string: d,
              array: function (a) {
                return e(a, new Array(a.length));
              },
              arraybuffer: function (a) {
                return k.string.uint8array(a).buffer;
              },
              uint8array: function (a) {
                return e(a, new Uint8Array(a.length));
              },
              nodebuffer: function (a) {
                return e(a, j(a.length));
              },
            }),
              (k.array = {
                string: f,
                array: d,
                arraybuffer: function (a) {
                  return new Uint8Array(a).buffer;
                },
                uint8array: function (a) {
                  return new Uint8Array(a);
                },
                nodebuffer: function (a) {
                  return j(a);
                },
              }),
              (k.arraybuffer = {
                string: function (a) {
                  return f(new Uint8Array(a));
                },
                array: function (a) {
                  return g(new Uint8Array(a), new Array(a.byteLength));
                },
                arraybuffer: d,
                uint8array: function (a) {
                  return new Uint8Array(a);
                },
                nodebuffer: function (a) {
                  return j(new Uint8Array(a));
                },
              }),
              (k.uint8array = {
                string: f,
                array: function (a) {
                  return g(a, new Array(a.length));
                },
                arraybuffer: function (a) {
                  return a.buffer;
                },
                uint8array: d,
                nodebuffer: function (a) {
                  return j(a);
                },
              }),
              (k.nodebuffer = {
                string: f,
                array: function (a) {
                  return g(a, new Array(a.length));
                },
                arraybuffer: function (a) {
                  return k.nodebuffer.uint8array(a).buffer;
                },
                uint8array: function (a) {
                  return g(a, new Uint8Array(a.length));
                },
                nodebuffer: d,
              }),
              (c.transformTo = function (a, b) {
                if ((b || (b = ""), !a)) return b;
                c.checkSupport(a);
                var d = c.getTypeOf(b);
                return k[d][a](b);
              }),
              (c.getTypeOf = function (a) {
                return "string" == typeof a
                  ? "string"
                  : "[object Array]" === Object.prototype.toString.call(a)
                  ? "array"
                  : h.nodebuffer && j.test(a)
                  ? "nodebuffer"
                  : h.uint8array && a instanceof Uint8Array
                  ? "uint8array"
                  : h.arraybuffer && a instanceof ArrayBuffer
                  ? "arraybuffer"
                  : void 0;
              }),
              (c.checkSupport = function (a) {
                if (!h[a.toLowerCase()])
                  throw new Error(a + " is not supported by this browser");
              }),
              (c.MAX_VALUE_16BITS = 65535),
              (c.MAX_VALUE_32BITS = -1),
              (c.pretty = function (a) {
                var b,
                  c,
                  d = "";
                for (c = 0; c < (a || "").length; c++)
                  (b = a.charCodeAt(c)),
                    (d +=
                      "\\x" +
                      (16 > b ? "0" : "") +
                      b.toString(16).toUpperCase());
                return d;
              }),
              (c.findCompression = function (a) {
                for (var b in i)
                  if (i.hasOwnProperty(b) && i[b].magic === a) return i[b];
                return null;
              }),
              (c.isRegExp = function (a) {
                return "[object RegExp]" === Object.prototype.toString.call(a);
              });
          },
          { "./compressions": 3, "./nodeBuffer": 11, "./support": 17 },
        ],
        22: [
          function (a, b) {
            "use strict";
            function c(a, b) {
              (this.files = []), (this.loadOptions = b), a && this.load(a);
            }
            var d = a("./stringReader"),
              e = a("./nodeBufferReader"),
              f = a("./uint8ArrayReader"),
              g = a("./utils"),
              h = a("./signature"),
              i = a("./zipEntry"),
              j = a("./support"),
              k = a("./object");
            (c.prototype = {
              checkSignature: function (a) {
                var b = this.reader.readString(4);
                if (b !== a)
                  throw new Error(
                    "Corrupted zip or bug : unexpected signature (" +
                      g.pretty(b) +
                      ", expected " +
                      g.pretty(a) +
                      ")"
                  );
              },
              readBlockEndOfCentral: function () {
                (this.diskNumber = this.reader.readInt(2)),
                  (this.diskWithCentralDirStart = this.reader.readInt(2)),
                  (this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
                  (this.centralDirRecords = this.reader.readInt(2)),
                  (this.centralDirSize = this.reader.readInt(4)),
                  (this.centralDirOffset = this.reader.readInt(4)),
                  (this.zipCommentLength = this.reader.readInt(2)),
                  (this.zipComment = this.reader.readString(
                    this.zipCommentLength
                  )),
                  (this.zipComment = k.utf8decode(this.zipComment));
              },
              readBlockZip64EndOfCentral: function () {
                (this.zip64EndOfCentralSize = this.reader.readInt(8)),
                  (this.versionMadeBy = this.reader.readString(2)),
                  (this.versionNeeded = this.reader.readInt(2)),
                  (this.diskNumber = this.reader.readInt(4)),
                  (this.diskWithCentralDirStart = this.reader.readInt(4)),
                  (this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
                  (this.centralDirRecords = this.reader.readInt(8)),
                  (this.centralDirSize = this.reader.readInt(8)),
                  (this.centralDirOffset = this.reader.readInt(8)),
                  (this.zip64ExtensibleData = {});
                for (var a, b, c, d = this.zip64EndOfCentralSize - 44; d > 0; )
                  (a = this.reader.readInt(2)),
                    (b = this.reader.readInt(4)),
                    (c = this.reader.readString(b)),
                    (this.zip64ExtensibleData[a] = {
                      id: a,
                      length: b,
                      value: c,
                    });
              },
              readBlockZip64EndOfCentralLocator: function () {
                if (
                  ((this.diskWithZip64CentralDirStart = this.reader.readInt(4)),
                  (this.relativeOffsetEndOfZip64CentralDir =
                    this.reader.readInt(8)),
                  (this.disksCount = this.reader.readInt(4)),
                  this.disksCount > 1)
                )
                  throw new Error("Multi-volumes zip are not supported");
              },
              readLocalFiles: function () {
                var a, b;
                for (a = 0; a < this.files.length; a++)
                  (b = this.files[a]),
                    this.reader.setIndex(b.localHeaderOffset),
                    this.checkSignature(h.LOCAL_FILE_HEADER),
                    b.readLocalPart(this.reader),
                    b.handleUTF8();
              },
              readCentralDir: function () {
                var a;
                for (
                  this.reader.setIndex(this.centralDirOffset);
                  this.reader.readString(4) === h.CENTRAL_FILE_HEADER;

                )
                  (a = new i({ zip64: this.zip64 }, this.loadOptions)),
                    a.readCentralPart(this.reader),
                    this.files.push(a);
              },
              readEndOfCentral: function () {
                var a = this.reader.lastIndexOfSignature(
                  h.CENTRAL_DIRECTORY_END
                );
                if (-1 === a)
                  throw new Error(
                    "Corrupted zip : can't find end of central directory"
                  );
                if (
                  (this.reader.setIndex(a),
                  this.checkSignature(h.CENTRAL_DIRECTORY_END),
                  this.readBlockEndOfCentral(),
                  this.diskNumber === g.MAX_VALUE_16BITS ||
                    this.diskWithCentralDirStart === g.MAX_VALUE_16BITS ||
                    this.centralDirRecordsOnThisDisk === g.MAX_VALUE_16BITS ||
                    this.centralDirRecords === g.MAX_VALUE_16BITS ||
                    this.centralDirSize === g.MAX_VALUE_32BITS ||
                    this.centralDirOffset === g.MAX_VALUE_32BITS)
                ) {
                  if (
                    ((this.zip64 = !0),
                    -1 ===
                      (a = this.reader.lastIndexOfSignature(
                        h.ZIP64_CENTRAL_DIRECTORY_LOCATOR
                      )))
                  )
                    throw new Error(
                      "Corrupted zip : can't find the ZIP64 end of central directory locator"
                    );
                  this.reader.setIndex(a),
                    this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                    this.readBlockZip64EndOfCentralLocator(),
                    this.reader.setIndex(
                      this.relativeOffsetEndOfZip64CentralDir
                    ),
                    this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),
                    this.readBlockZip64EndOfCentral();
                }
              },
              prepareReader: function (a) {
                var b = g.getTypeOf(a);
                this.reader =
                  "string" !== b || j.uint8array
                    ? "nodebuffer" === b
                      ? new e(a)
                      : new f(g.transformTo("uint8array", a))
                    : new d(a, this.loadOptions.optimizedBinaryString);
              },
              load: function (a) {
                this.prepareReader(a),
                  this.readEndOfCentral(),
                  this.readCentralDir(),
                  this.readLocalFiles();
              },
            }),
              (b.exports = c);
          },
          {
            "./nodeBufferReader": 12,
            "./object": 13,
            "./signature": 14,
            "./stringReader": 15,
            "./support": 17,
            "./uint8ArrayReader": 18,
            "./utils": 21,
            "./zipEntry": 23,
          },
        ],
        23: [
          function (a, b) {
            "use strict";
            function c(a, b) {
              (this.options = a), (this.loadOptions = b);
            }
            var d = a("./stringReader"),
              e = a("./utils"),
              f = a("./compressedObject"),
              g = a("./object");
            (c.prototype = {
              isEncrypted: function () {
                return 1 == (1 & this.bitFlag);
              },
              useUTF8: function () {
                return 2048 == (2048 & this.bitFlag);
              },
              prepareCompressedContent: function (a, b, c) {
                return function () {
                  var d = a.index;
                  a.setIndex(b);
                  var e = a.readData(c);
                  return a.setIndex(d), e;
                };
              },
              prepareContent: function (a, b, c, d, f) {
                return function () {
                  var a = e.transformTo(
                      d.uncompressInputType,
                      this.getCompressedContent()
                    ),
                    b = d.uncompress(a);
                  if (b.length !== f)
                    throw new Error("Bug : uncompressed data size mismatch");
                  return b;
                };
              },
              readLocalPart: function (a) {
                var b, c;
                if (
                  (a.skip(22),
                  (this.fileNameLength = a.readInt(2)),
                  (c = a.readInt(2)),
                  (this.fileName = a.readString(this.fileNameLength)),
                  a.skip(c),
                  -1 == this.compressedSize || -1 == this.uncompressedSize)
                )
                  throw new Error(
                    "Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)"
                  );
                if (null === (b = e.findCompression(this.compressionMethod)))
                  throw new Error(
                    "Corrupted zip : compression " +
                      e.pretty(this.compressionMethod) +
                      " unknown (inner file : " +
                      this.fileName +
                      ")"
                  );
                if (
                  ((this.decompressed = new f()),
                  (this.decompressed.compressedSize = this.compressedSize),
                  (this.decompressed.uncompressedSize = this.uncompressedSize),
                  (this.decompressed.crc32 = this.crc32),
                  (this.decompressed.compressionMethod =
                    this.compressionMethod),
                  (this.decompressed.getCompressedContent =
                    this.prepareCompressedContent(
                      a,
                      a.index,
                      this.compressedSize,
                      b
                    )),
                  (this.decompressed.getContent = this.prepareContent(
                    a,
                    a.index,
                    this.compressedSize,
                    b,
                    this.uncompressedSize
                  )),
                  this.loadOptions.checkCRC32 &&
                    ((this.decompressed = e.transformTo(
                      "string",
                      this.decompressed.getContent()
                    )),
                    g.crc32(this.decompressed) !== this.crc32))
                )
                  throw new Error("Corrupted zip : CRC32 mismatch");
              },
              readCentralPart: function (a) {
                if (
                  ((this.versionMadeBy = a.readString(2)),
                  (this.versionNeeded = a.readInt(2)),
                  (this.bitFlag = a.readInt(2)),
                  (this.compressionMethod = a.readString(2)),
                  (this.date = a.readDate()),
                  (this.crc32 = a.readInt(4)),
                  (this.compressedSize = a.readInt(4)),
                  (this.uncompressedSize = a.readInt(4)),
                  (this.fileNameLength = a.readInt(2)),
                  (this.extraFieldsLength = a.readInt(2)),
                  (this.fileCommentLength = a.readInt(2)),
                  (this.diskNumberStart = a.readInt(2)),
                  (this.internalFileAttributes = a.readInt(2)),
                  (this.externalFileAttributes = a.readInt(4)),
                  (this.localHeaderOffset = a.readInt(4)),
                  this.isEncrypted())
                )
                  throw new Error("Encrypted zip are not supported");
                (this.fileName = a.readString(this.fileNameLength)),
                  this.readExtraFields(a),
                  this.parseZIP64ExtraField(a),
                  (this.fileComment = a.readString(this.fileCommentLength)),
                  (this.dir = !!(16 & this.externalFileAttributes));
              },
              parseZIP64ExtraField: function () {
                if (this.extraFields[1]) {
                  var a = new d(this.extraFields[1].value);
                  this.uncompressedSize === e.MAX_VALUE_32BITS &&
                    (this.uncompressedSize = a.readInt(8)),
                    this.compressedSize === e.MAX_VALUE_32BITS &&
                      (this.compressedSize = a.readInt(8)),
                    this.localHeaderOffset === e.MAX_VALUE_32BITS &&
                      (this.localHeaderOffset = a.readInt(8)),
                    this.diskNumberStart === e.MAX_VALUE_32BITS &&
                      (this.diskNumberStart = a.readInt(4));
                }
              },
              readExtraFields: function (a) {
                var b,
                  c,
                  d,
                  e = a.index;
                for (
                  this.extraFields = this.extraFields || {};
                  a.index < e + this.extraFieldsLength;

                )
                  (b = a.readInt(2)),
                    (c = a.readInt(2)),
                    (d = a.readString(c)),
                    (this.extraFields[b] = { id: b, length: c, value: d });
              },
              handleUTF8: function () {
                if (this.useUTF8())
                  (this.fileName = g.utf8decode(this.fileName)),
                    (this.fileComment = g.utf8decode(this.fileComment));
                else {
                  var a = this.findExtraFieldUnicodePath();
                  null !== a && (this.fileName = a);
                  var b = this.findExtraFieldUnicodeComment();
                  null !== b && (this.fileComment = b);
                }
              },
              findExtraFieldUnicodePath: function () {
                var a = this.extraFields[28789];
                if (a) {
                  var b = new d(a.value);
                  return 1 !== b.readInt(1)
                    ? null
                    : g.crc32(this.fileName) !== b.readInt(4)
                    ? null
                    : g.utf8decode(b.readString(a.length - 5));
                }
                return null;
              },
              findExtraFieldUnicodeComment: function () {
                var a = this.extraFields[25461];
                if (a) {
                  var b = new d(a.value);
                  return 1 !== b.readInt(1)
                    ? null
                    : g.crc32(this.fileComment) !== b.readInt(4)
                    ? null
                    : g.utf8decode(b.readString(a.length - 5));
                }
                return null;
              },
            }),
              (b.exports = c);
          },
          {
            "./compressedObject": 2,
            "./object": 13,
            "./stringReader": 15,
            "./utils": 21,
          },
        ],
        24: [
          function (a, b) {
            "use strict";
            var c = a("./lib/utils/common").assign,
              d = a("./lib/deflate"),
              e = a("./lib/inflate"),
              f = a("./lib/zlib/constants"),
              g = {};
            c(g, d, e, f), (b.exports = g);
          },
          {
            "./lib/deflate": 25,
            "./lib/inflate": 26,
            "./lib/utils/common": 27,
            "./lib/zlib/constants": 30,
          },
        ],
        25: [
          function (a, b, c) {
            "use strict";
            function d(a, b) {
              var c = new l(b);
              if ((c.push(a, !0), c.err)) throw c.msg;
              return c.result;
            }
            function e(a, b) {
              return (b = b || {}), (b.raw = !0), d(a, b);
            }
            function f(a, b) {
              return (b = b || {}), (b.gzip = !0), d(a, b);
            }
            var g = a("./zlib/deflate.js"),
              h = a("./utils/common"),
              i = a("./utils/strings"),
              j = a("./zlib/messages"),
              k = a("./zlib/zstream"),
              l = function (a) {
                this.options = h.assign(
                  {
                    level: -1,
                    method: 8,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: 0,
                    to: "",
                  },
                  a || {}
                );
                var b = this.options;
                b.raw && b.windowBits > 0
                  ? (b.windowBits = -b.windowBits)
                  : b.gzip &&
                    b.windowBits > 0 &&
                    b.windowBits < 16 &&
                    (b.windowBits += 16),
                  (this.err = 0),
                  (this.msg = ""),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new k()),
                  (this.strm.avail_out = 0);
                var c = g.deflateInit2(
                  this.strm,
                  b.level,
                  b.method,
                  b.windowBits,
                  b.memLevel,
                  b.strategy
                );
                if (0 !== c) throw new Error(j[c]);
                b.header && g.deflateSetHeader(this.strm, b.header);
              };
            (l.prototype.push = function (a, b) {
              var c,
                d,
                e = this.strm,
                f = this.options.chunkSize;
              if (this.ended) return !1;
              (d = b === ~~b ? b : !0 === b ? 4 : 0),
                (e.input = "string" == typeof a ? i.string2buf(a) : a),
                (e.next_in = 0),
                (e.avail_in = e.input.length);
              do {
                if (
                  (0 === e.avail_out &&
                    ((e.output = new h.Buf8(f)),
                    (e.next_out = 0),
                    (e.avail_out = f)),
                  1 !== (c = g.deflate(e, d)) && 0 !== c)
                )
                  return this.onEnd(c), (this.ended = !0), !1;
                (0 === e.avail_out || (0 === e.avail_in && 4 === d)) &&
                  this.onData(
                    "string" === this.options.to
                      ? i.buf2binstring(h.shrinkBuf(e.output, e.next_out))
                      : h.shrinkBuf(e.output, e.next_out)
                  );
              } while ((e.avail_in > 0 || 0 === e.avail_out) && 1 !== c);
              return (
                4 !== d ||
                ((c = g.deflateEnd(this.strm)),
                this.onEnd(c),
                (this.ended = !0),
                0 === c)
              );
            }),
              (l.prototype.onData = function (a) {
                this.chunks.push(a);
              }),
              (l.prototype.onEnd = function (a) {
                0 === a &&
                  (this.result =
                    "string" === this.options.to
                      ? this.chunks.join("")
                      : h.flattenChunks(this.chunks)),
                  (this.chunks = []),
                  (this.err = a),
                  (this.msg = this.strm.msg);
              }),
              (c.Deflate = l),
              (c.deflate = d),
              (c.deflateRaw = e),
              (c.gzip = f);
          },
          {
            "./utils/common": 27,
            "./utils/strings": 28,
            "./zlib/deflate.js": 32,
            "./zlib/messages": 37,
            "./zlib/zstream": 39,
          },
        ],
        26: [
          function (a, b, c) {
            "use strict";
            function d(a, b) {
              var c = new m(b);
              if ((c.push(a, !0), c.err)) throw c.msg;
              return c.result;
            }
            function e(a, b) {
              return (b = b || {}), (b.raw = !0), d(a, b);
            }
            var f = a("./zlib/inflate.js"),
              g = a("./utils/common"),
              h = a("./utils/strings"),
              i = a("./zlib/constants"),
              j = a("./zlib/messages"),
              k = a("./zlib/zstream"),
              l = a("./zlib/gzheader"),
              m = function (a) {
                this.options = g.assign(
                  { chunkSize: 16384, windowBits: 0, to: "" },
                  a || {}
                );
                var b = this.options;
                b.raw &&
                  b.windowBits >= 0 &&
                  b.windowBits < 16 &&
                  ((b.windowBits = -b.windowBits),
                  0 === b.windowBits && (b.windowBits = -15)),
                  !(b.windowBits >= 0 && b.windowBits < 16) ||
                    (a && a.windowBits) ||
                    (b.windowBits += 32),
                  b.windowBits > 15 &&
                    b.windowBits < 48 &&
                    0 == (15 & b.windowBits) &&
                    (b.windowBits |= 15),
                  (this.err = 0),
                  (this.msg = ""),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new k()),
                  (this.strm.avail_out = 0);
                var c = f.inflateInit2(this.strm, b.windowBits);
                if (c !== i.Z_OK) throw new Error(j[c]);
                (this.header = new l()),
                  f.inflateGetHeader(this.strm, this.header);
              };
            (m.prototype.push = function (a, b) {
              var c,
                d,
                e,
                j,
                k,
                l = this.strm,
                m = this.options.chunkSize;
              if (this.ended) return !1;
              (d = b === ~~b ? b : !0 === b ? i.Z_FINISH : i.Z_NO_FLUSH),
                (l.input = "string" == typeof a ? h.binstring2buf(a) : a),
                (l.next_in = 0),
                (l.avail_in = l.input.length);
              do {
                if (
                  (0 === l.avail_out &&
                    ((l.output = new g.Buf8(m)),
                    (l.next_out = 0),
                    (l.avail_out = m)),
                  (c = f.inflate(l, i.Z_NO_FLUSH)) !== i.Z_STREAM_END &&
                    c !== i.Z_OK)
                )
                  return this.onEnd(c), (this.ended = !0), !1;
                l.next_out &&
                  (0 === l.avail_out ||
                    c === i.Z_STREAM_END ||
                    (0 === l.avail_in && d === i.Z_FINISH)) &&
                  ("string" === this.options.to
                    ? ((e = h.utf8border(l.output, l.next_out)),
                      (j = l.next_out - e),
                      (k = h.buf2string(l.output, e)),
                      (l.next_out = j),
                      (l.avail_out = m - j),
                      j && g.arraySet(l.output, l.output, e, j, 0),
                      this.onData(k))
                    : this.onData(g.shrinkBuf(l.output, l.next_out)));
              } while (l.avail_in > 0 && c !== i.Z_STREAM_END);
              return (
                c === i.Z_STREAM_END && (d = i.Z_FINISH),
                d !== i.Z_FINISH ||
                  ((c = f.inflateEnd(this.strm)),
                  this.onEnd(c),
                  (this.ended = !0),
                  c === i.Z_OK)
              );
            }),
              (m.prototype.onData = function (a) {
                this.chunks.push(a);
              }),
              (m.prototype.onEnd = function (a) {
                a === i.Z_OK &&
                  (this.result =
                    "string" === this.options.to
                      ? this.chunks.join("")
                      : g.flattenChunks(this.chunks)),
                  (this.chunks = []),
                  (this.err = a),
                  (this.msg = this.strm.msg);
              }),
              (c.Inflate = m),
              (c.inflate = d),
              (c.inflateRaw = e),
              (c.ungzip = d);
          },
          {
            "./utils/common": 27,
            "./utils/strings": 28,
            "./zlib/constants": 30,
            "./zlib/gzheader": 33,
            "./zlib/inflate.js": 35,
            "./zlib/messages": 37,
            "./zlib/zstream": 39,
          },
        ],
        27: [
          function (a, b, c) {
            "use strict";
            var d =
              "undefined" != typeof Uint8Array &&
              "undefined" != typeof Uint16Array &&
              "undefined" != typeof Int32Array;
            (c.assign = function (a) {
              for (
                var b = Array.prototype.slice.call(arguments, 1);
                b.length;

              ) {
                var c = b.shift();
                if (c) {
                  if ("object" != typeof c)
                    throw new TypeError(c + "must be non-object");
                  for (var d in c) c.hasOwnProperty(d) && (a[d] = c[d]);
                }
              }
              return a;
            }),
              (c.shrinkBuf = function (a, b) {
                return a.length === b
                  ? a
                  : a.subarray
                  ? a.subarray(0, b)
                  : ((a.length = b), a);
              });
            var e = {
                arraySet: function (a, b, c, d, e) {
                  if (b.subarray && a.subarray)
                    return void a.set(b.subarray(c, c + d), e);
                  for (var f = 0; d > f; f++) a[e + f] = b[c + f];
                },
                flattenChunks: function (a) {
                  var b, c, d, e, f, g;
                  for (d = 0, b = 0, c = a.length; c > b; b++) d += a[b].length;
                  for (
                    g = new Uint8Array(d), e = 0, b = 0, c = a.length;
                    c > b;
                    b++
                  )
                    (f = a[b]), g.set(f, e), (e += f.length);
                  return g;
                },
              },
              f = {
                arraySet: function (a, b, c, d, e) {
                  for (var f = 0; d > f; f++) a[e + f] = b[c + f];
                },
                flattenChunks: function (a) {
                  return [].concat.apply([], a);
                },
              };
            (c.setTyped = function (a) {
              a
                ? ((c.Buf8 = Uint8Array),
                  (c.Buf16 = Uint16Array),
                  (c.Buf32 = Int32Array),
                  c.assign(c, e))
                : ((c.Buf8 = Array),
                  (c.Buf16 = Array),
                  (c.Buf32 = Array),
                  c.assign(c, f));
            }),
              c.setTyped(d);
          },
          {},
        ],
        28: [
          function (a, b, c) {
            "use strict";
            function d(a, b) {
              if (65537 > b && ((a.subarray && g) || (!a.subarray && f)))
                return String.fromCharCode.apply(null, e.shrinkBuf(a, b));
              for (var c = "", d = 0; b > d; d++)
                c += String.fromCharCode(a[d]);
              return c;
            }
            var e = a("./common"),
              f = !0,
              g = !0;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (a) {
              f = !1;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (a) {
              g = !1;
            }
            for (var h = new e.Buf8(256), i = 0; 256 > i; i++)
              h[i] =
                i >= 252
                  ? 6
                  : i >= 248
                  ? 5
                  : i >= 240
                  ? 4
                  : i >= 224
                  ? 3
                  : i >= 192
                  ? 2
                  : 1;
            (h[254] = h[254] = 1),
              (c.string2buf = function (a) {
                var b,
                  c,
                  d,
                  f,
                  g,
                  h = a.length,
                  i = 0;
                for (f = 0; h > f; f++)
                  (c = a.charCodeAt(f)),
                    55296 == (64512 & c) &&
                      h > f + 1 &&
                      56320 == (64512 & (d = a.charCodeAt(f + 1))) &&
                      ((c = 65536 + ((c - 55296) << 10) + (d - 56320)), f++),
                    (i += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4);
                for (b = new e.Buf8(i), g = 0, f = 0; i > g; f++)
                  (c = a.charCodeAt(f)),
                    55296 == (64512 & c) &&
                      h > f + 1 &&
                      56320 == (64512 & (d = a.charCodeAt(f + 1))) &&
                      ((c = 65536 + ((c - 55296) << 10) + (d - 56320)), f++),
                    128 > c
                      ? (b[g++] = c)
                      : 2048 > c
                      ? ((b[g++] = 192 | (c >>> 6)), (b[g++] = 128 | (63 & c)))
                      : 65536 > c
                      ? ((b[g++] = 224 | (c >>> 12)),
                        (b[g++] = 128 | ((c >>> 6) & 63)),
                        (b[g++] = 128 | (63 & c)))
                      : ((b[g++] = 240 | (c >>> 18)),
                        (b[g++] = 128 | ((c >>> 12) & 63)),
                        (b[g++] = 128 | ((c >>> 6) & 63)),
                        (b[g++] = 128 | (63 & c)));
                return b;
              }),
              (c.buf2binstring = function (a) {
                return d(a, a.length);
              }),
              (c.binstring2buf = function (a) {
                for (
                  var b = new e.Buf8(a.length), c = 0, d = b.length;
                  d > c;
                  c++
                )
                  b[c] = a.charCodeAt(c);
                return b;
              }),
              (c.buf2string = function (a, b) {
                var c,
                  e,
                  f,
                  g,
                  i = b || a.length,
                  j = new Array(2 * i);
                for (e = 0, c = 0; i > c; )
                  if (128 > (f = a[c++])) j[e++] = f;
                  else if ((g = h[f]) > 4) (j[e++] = 65533), (c += g - 1);
                  else {
                    for (f &= 2 === g ? 31 : 3 === g ? 15 : 7; g > 1 && i > c; )
                      (f = (f << 6) | (63 & a[c++])), g--;
                    g > 1
                      ? (j[e++] = 65533)
                      : 65536 > f
                      ? (j[e++] = f)
                      : ((f -= 65536),
                        (j[e++] = 55296 | ((f >> 10) & 1023)),
                        (j[e++] = 56320 | (1023 & f)));
                  }
                return d(j, e);
              }),
              (c.utf8border = function (a, b) {
                var c;
                for (
                  b = b || a.length, b > a.length && (b = a.length), c = b - 1;
                  c >= 0 && 128 == (192 & a[c]);

                )
                  c--;
                return 0 > c ? b : 0 === c ? b : c + h[a[c]] > b ? c : b;
              });
          },
          { "./common": 27 },
        ],
        29: [
          function (a, b) {
            "use strict";
            function c(a, b, c, d) {
              for (
                var e = (65535 & a) | 0, f = ((a >>> 16) & 65535) | 0, g = 0;
                0 !== c;

              ) {
                (g = c > 2e3 ? 2e3 : c), (c -= g);
                do {
                  (e = (e + b[d++]) | 0), (f = (f + e) | 0);
                } while (--g);
                (e %= 65521), (f %= 65521);
              }
              return e | (f << 16) | 0;
            }
            b.exports = c;
          },
          {},
        ],
        30: [
          function (a, b) {
            b.exports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8,
            };
          },
          {},
        ],
        31: [
          function (a, b) {
            "use strict";
            function c(a, b, c, e) {
              var f = d,
                g = e + c;
              a ^= -1;
              for (var h = e; g > h; h++) a = (a >>> 8) ^ f[255 & (a ^ b[h])];
              return -1 ^ a;
            }
            var d = (function () {
              for (var a, b = [], c = 0; 256 > c; c++) {
                a = c;
                for (var d = 0; 8 > d; d++)
                  a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
                b[c] = a;
              }
              return b;
            })();
            b.exports = c;
          },
          {},
        ],
        32: [
          function (a, b, c) {
            "use strict";
            function d(a, b) {
              return (a.msg = G[b]), b;
            }
            function e(a) {
              return (a << 1) - (a > 4 ? 9 : 0);
            }
            function f(a) {
              for (var b = a.length; --b >= 0; ) a[b] = 0;
            }
            function g(a) {
              var b = a.state,
                c = b.pending;
              c > a.avail_out && (c = a.avail_out),
                0 !== c &&
                  (C.arraySet(
                    a.output,
                    b.pending_buf,
                    b.pending_out,
                    c,
                    a.next_out
                  ),
                  (a.next_out += c),
                  (b.pending_out += c),
                  (a.total_out += c),
                  (a.avail_out -= c),
                  (b.pending -= c),
                  0 === b.pending && (b.pending_out = 0));
            }
            function h(a, b) {
              D._tr_flush_block(
                a,
                a.block_start >= 0 ? a.block_start : -1,
                a.strstart - a.block_start,
                b
              ),
                (a.block_start = a.strstart),
                g(a.strm);
            }
            function i(a, b) {
              a.pending_buf[a.pending++] = b;
            }
            function j(a, b) {
              (a.pending_buf[a.pending++] = (b >>> 8) & 255),
                (a.pending_buf[a.pending++] = 255 & b);
            }
            function k(a, b, c, d) {
              var e = a.avail_in;
              return (
                e > d && (e = d),
                0 === e
                  ? 0
                  : ((a.avail_in -= e),
                    C.arraySet(b, a.input, a.next_in, e, c),
                    1 === a.state.wrap
                      ? (a.adler = E(a.adler, b, e, c))
                      : 2 === a.state.wrap && (a.adler = F(a.adler, b, e, c)),
                    (a.next_in += e),
                    (a.total_in += e),
                    e)
              );
            }
            function l(a, b) {
              var c,
                d,
                e = a.max_chain_length,
                f = a.strstart,
                g = a.prev_length,
                h = a.nice_match,
                i =
                  a.strstart > a.w_size - ha ? a.strstart - (a.w_size - ha) : 0,
                j = a.window,
                k = a.w_mask,
                l = a.prev,
                m = a.strstart + ga,
                n = j[f + g - 1],
                o = j[f + g];
              a.prev_length >= a.good_match && (e >>= 2),
                h > a.lookahead && (h = a.lookahead);
              do {
                if (
                  ((c = b),
                  j[c + g] === o &&
                    j[c + g - 1] === n &&
                    j[c] === j[f] &&
                    j[++c] === j[f + 1])
                ) {
                  (f += 2), c++;
                  do {} while (
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    j[++f] === j[++c] &&
                    m > f
                  );
                  if (((d = ga - (m - f)), (f = m - ga), d > g)) {
                    if (((a.match_start = b), (g = d), d >= h)) break;
                    (n = j[f + g - 1]), (o = j[f + g]);
                  }
                }
              } while ((b = l[b & k]) > i && 0 != --e);
              return g <= a.lookahead ? g : a.lookahead;
            }
            function m(a) {
              var b,
                c,
                d,
                e,
                f,
                g = a.w_size;
              do {
                if (
                  ((e = a.window_size - a.lookahead - a.strstart),
                  a.strstart >= g + (g - ha))
                ) {
                  C.arraySet(a.window, a.window, g, g, 0),
                    (a.match_start -= g),
                    (a.strstart -= g),
                    (a.block_start -= g),
                    (c = a.hash_size),
                    (b = c);
                  do {
                    (d = a.head[--b]), (a.head[b] = d >= g ? d - g : 0);
                  } while (--c);
                  (c = g), (b = c);
                  do {
                    (d = a.prev[--b]), (a.prev[b] = d >= g ? d - g : 0);
                  } while (--c);
                  e += g;
                }
                if (0 === a.strm.avail_in) break;
                if (
                  ((c = k(a.strm, a.window, a.strstart + a.lookahead, e)),
                  (a.lookahead += c),
                  a.lookahead + a.insert >= fa)
                )
                  for (
                    f = a.strstart - a.insert,
                      a.ins_h = a.window[f],
                      a.ins_h =
                        ((a.ins_h << a.hash_shift) ^ a.window[f + 1]) &
                        a.hash_mask;
                    a.insert &&
                    ((a.ins_h =
                      ((a.ins_h << a.hash_shift) ^ a.window[f + fa - 1]) &
                      a.hash_mask),
                    (a.prev[f & a.w_mask] = a.head[a.ins_h]),
                    (a.head[a.ins_h] = f),
                    f++,
                    a.insert--,
                    !(a.lookahead + a.insert < fa));

                  );
              } while (a.lookahead < ha && 0 !== a.strm.avail_in);
            }
            function n(a, b) {
              var c = 65535;
              for (
                c > a.pending_buf_size - 5 && (c = a.pending_buf_size - 5);
                ;

              ) {
                if (a.lookahead <= 1) {
                  if ((m(a), 0 === a.lookahead && b === H)) return qa;
                  if (0 === a.lookahead) break;
                }
                (a.strstart += a.lookahead), (a.lookahead = 0);
                var d = a.block_start + c;
                if (
                  (0 === a.strstart || a.strstart >= d) &&
                  ((a.lookahead = a.strstart - d),
                  (a.strstart = d),
                  h(a, !1),
                  0 === a.strm.avail_out)
                )
                  return qa;
                if (
                  a.strstart - a.block_start >= a.w_size - ha &&
                  (h(a, !1), 0 === a.strm.avail_out)
                )
                  return qa;
              }
              return (
                (a.insert = 0),
                b === K
                  ? (h(a, !0), 0 === a.strm.avail_out ? sa : ta)
                  : (a.strstart > a.block_start && (h(a, !1), a.strm.avail_out),
                    qa)
              );
            }
            function o(a, b) {
              for (var c, d; ; ) {
                if (a.lookahead < ha) {
                  if ((m(a), a.lookahead < ha && b === H)) return qa;
                  if (0 === a.lookahead) break;
                }
                if (
                  ((c = 0),
                  a.lookahead >= fa &&
                    ((a.ins_h =
                      ((a.ins_h << a.hash_shift) ^
                        a.window[a.strstart + fa - 1]) &
                      a.hash_mask),
                    (c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h]),
                    (a.head[a.ins_h] = a.strstart)),
                  0 !== c &&
                    a.strstart - c <= a.w_size - ha &&
                    (a.match_length = l(a, c)),
                  a.match_length >= fa)
                )
                  if (
                    ((d = D._tr_tally(
                      a,
                      a.strstart - a.match_start,
                      a.match_length - fa
                    )),
                    (a.lookahead -= a.match_length),
                    a.match_length <= a.max_lazy_match && a.lookahead >= fa)
                  ) {
                    a.match_length--;
                    do {
                      a.strstart++,
                        (a.ins_h =
                          ((a.ins_h << a.hash_shift) ^
                            a.window[a.strstart + fa - 1]) &
                          a.hash_mask),
                        (c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h]),
                        (a.head[a.ins_h] = a.strstart);
                    } while (0 != --a.match_length);
                    a.strstart++;
                  } else
                    (a.strstart += a.match_length),
                      (a.match_length = 0),
                      (a.ins_h = a.window[a.strstart]),
                      (a.ins_h =
                        ((a.ins_h << a.hash_shift) ^ a.window[a.strstart + 1]) &
                        a.hash_mask);
                else
                  (d = D._tr_tally(a, 0, a.window[a.strstart])),
                    a.lookahead--,
                    a.strstart++;
                if (d && (h(a, !1), 0 === a.strm.avail_out)) return qa;
              }
              return (
                (a.insert = a.strstart < fa - 1 ? a.strstart : fa - 1),
                b === K
                  ? (h(a, !0), 0 === a.strm.avail_out ? sa : ta)
                  : a.last_lit && (h(a, !1), 0 === a.strm.avail_out)
                  ? qa
                  : ra
              );
            }
            function p(a, b) {
              for (var c, d, e; ; ) {
                if (a.lookahead < ha) {
                  if ((m(a), a.lookahead < ha && b === H)) return qa;
                  if (0 === a.lookahead) break;
                }
                if (
                  ((c = 0),
                  a.lookahead >= fa &&
                    ((a.ins_h =
                      ((a.ins_h << a.hash_shift) ^
                        a.window[a.strstart + fa - 1]) &
                      a.hash_mask),
                    (c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h]),
                    (a.head[a.ins_h] = a.strstart)),
                  (a.prev_length = a.match_length),
                  (a.prev_match = a.match_start),
                  (a.match_length = fa - 1),
                  0 !== c &&
                    a.prev_length < a.max_lazy_match &&
                    a.strstart - c <= a.w_size - ha &&
                    ((a.match_length = l(a, c)),
                    a.match_length <= 5 &&
                      (a.strategy === S ||
                        (a.match_length === fa &&
                          a.strstart - a.match_start > 4096)) &&
                      (a.match_length = fa - 1)),
                  a.prev_length >= fa && a.match_length <= a.prev_length)
                ) {
                  (e = a.strstart + a.lookahead - fa),
                    (d = D._tr_tally(
                      a,
                      a.strstart - 1 - a.prev_match,
                      a.prev_length - fa
                    )),
                    (a.lookahead -= a.prev_length - 1),
                    (a.prev_length -= 2);
                  do {
                    ++a.strstart <= e &&
                      ((a.ins_h =
                        ((a.ins_h << a.hash_shift) ^
                          a.window[a.strstart + fa - 1]) &
                        a.hash_mask),
                      (c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h]),
                      (a.head[a.ins_h] = a.strstart));
                  } while (0 != --a.prev_length);
                  if (
                    ((a.match_available = 0),
                    (a.match_length = fa - 1),
                    a.strstart++,
                    d && (h(a, !1), 0 === a.strm.avail_out))
                  )
                    return qa;
                } else if (a.match_available) {
                  if (
                    ((d = D._tr_tally(a, 0, a.window[a.strstart - 1])),
                    d && h(a, !1),
                    a.strstart++,
                    a.lookahead--,
                    0 === a.strm.avail_out)
                  )
                    return qa;
                } else (a.match_available = 1), a.strstart++, a.lookahead--;
              }
              return (
                a.match_available &&
                  ((d = D._tr_tally(a, 0, a.window[a.strstart - 1])),
                  (a.match_available = 0)),
                (a.insert = a.strstart < fa - 1 ? a.strstart : fa - 1),
                b === K
                  ? (h(a, !0), 0 === a.strm.avail_out ? sa : ta)
                  : a.last_lit && (h(a, !1), 0 === a.strm.avail_out)
                  ? qa
                  : ra
              );
            }
            function q(a, b) {
              for (var c, d, e, f, g = a.window; ; ) {
                if (a.lookahead <= ga) {
                  if ((m(a), a.lookahead <= ga && b === H)) return qa;
                  if (0 === a.lookahead) break;
                }
                if (
                  ((a.match_length = 0),
                  a.lookahead >= fa &&
                    a.strstart > 0 &&
                    ((e = a.strstart - 1),
                    (d = g[e]) === g[++e] && d === g[++e] && d === g[++e]))
                ) {
                  f = a.strstart + ga;
                  do {} while (
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    d === g[++e] &&
                    f > e
                  );
                  (a.match_length = ga - (f - e)),
                    a.match_length > a.lookahead &&
                      (a.match_length = a.lookahead);
                }
                if (
                  (a.match_length >= fa
                    ? ((c = D._tr_tally(a, 1, a.match_length - fa)),
                      (a.lookahead -= a.match_length),
                      (a.strstart += a.match_length),
                      (a.match_length = 0))
                    : ((c = D._tr_tally(a, 0, a.window[a.strstart])),
                      a.lookahead--,
                      a.strstart++),
                  c && (h(a, !1), 0 === a.strm.avail_out))
                )
                  return qa;
              }
              return (
                (a.insert = 0),
                b === K
                  ? (h(a, !0), 0 === a.strm.avail_out ? sa : ta)
                  : a.last_lit && (h(a, !1), 0 === a.strm.avail_out)
                  ? qa
                  : ra
              );
            }
            function r(a, b) {
              for (var c; ; ) {
                if (0 === a.lookahead && (m(a), 0 === a.lookahead)) {
                  if (b === H) return qa;
                  break;
                }
                if (
                  ((a.match_length = 0),
                  (c = D._tr_tally(a, 0, a.window[a.strstart])),
                  a.lookahead--,
                  a.strstart++,
                  c && (h(a, !1), 0 === a.strm.avail_out))
                )
                  return qa;
              }
              return (
                (a.insert = 0),
                b === K
                  ? (h(a, !0), 0 === a.strm.avail_out ? sa : ta)
                  : a.last_lit && (h(a, !1), 0 === a.strm.avail_out)
                  ? qa
                  : ra
              );
            }
            function s(a) {
              (a.window_size = 2 * a.w_size),
                f(a.head),
                (a.max_lazy_match = B[a.level].max_lazy),
                (a.good_match = B[a.level].good_length),
                (a.nice_match = B[a.level].nice_length),
                (a.max_chain_length = B[a.level].max_chain),
                (a.strstart = 0),
                (a.block_start = 0),
                (a.lookahead = 0),
                (a.insert = 0),
                (a.match_length = a.prev_length = fa - 1),
                (a.match_available = 0),
                (a.ins_h = 0);
            }
            function t() {
              (this.strm = null),
                (this.status = 0),
                (this.pending_buf = null),
                (this.pending_buf_size = 0),
                (this.pending_out = 0),
                (this.pending = 0),
                (this.wrap = 0),
                (this.gzhead = null),
                (this.gzindex = 0),
                (this.method = Y),
                (this.last_flush = -1),
                (this.w_size = 0),
                (this.w_bits = 0),
                (this.w_mask = 0),
                (this.window = null),
                (this.window_size = 0),
                (this.prev = null),
                (this.head = null),
                (this.ins_h = 0),
                (this.hash_size = 0),
                (this.hash_bits = 0),
                (this.hash_mask = 0),
                (this.hash_shift = 0),
                (this.block_start = 0),
                (this.match_length = 0),
                (this.prev_match = 0),
                (this.match_available = 0),
                (this.strstart = 0),
                (this.match_start = 0),
                (this.lookahead = 0),
                (this.prev_length = 0),
                (this.max_chain_length = 0),
                (this.max_lazy_match = 0),
                (this.level = 0),
                (this.strategy = 0),
                (this.good_match = 0),
                (this.nice_match = 0),
                (this.dyn_ltree = new C.Buf16(2 * da)),
                (this.dyn_dtree = new C.Buf16(2 * (2 * ba + 1))),
                (this.bl_tree = new C.Buf16(2 * (2 * ca + 1))),
                f(this.dyn_ltree),
                f(this.dyn_dtree),
                f(this.bl_tree),
                (this.l_desc = null),
                (this.d_desc = null),
                (this.bl_desc = null),
                (this.bl_count = new C.Buf16(ea + 1)),
                (this.heap = new C.Buf16(2 * aa + 1)),
                f(this.heap),
                (this.heap_len = 0),
                (this.heap_max = 0),
                (this.depth = new C.Buf16(2 * aa + 1)),
                f(this.depth),
                (this.l_buf = 0),
                (this.lit_bufsize = 0),
                (this.last_lit = 0),
                (this.d_buf = 0),
                (this.opt_len = 0),
                (this.static_len = 0),
                (this.matches = 0),
                (this.insert = 0),
                (this.bi_buf = 0),
                (this.bi_valid = 0);
            }
            function u(a) {
              var b;
              return a && a.state
                ? ((a.total_in = a.total_out = 0),
                  (a.data_type = X),
                  (b = a.state),
                  (b.pending = 0),
                  (b.pending_out = 0),
                  b.wrap < 0 && (b.wrap = -b.wrap),
                  (b.status = b.wrap ? ja : oa),
                  (a.adler = 2 === b.wrap ? 0 : 1),
                  (b.last_flush = H),
                  D._tr_init(b),
                  M)
                : d(a, O);
            }
            function v(a) {
              var b = u(a);
              return b === M && s(a.state), b;
            }
            function w(a, b) {
              return a && a.state
                ? 2 !== a.state.wrap
                  ? O
                  : ((a.state.gzhead = b), M)
                : O;
            }
            function x(a, b, c, e, f, g) {
              if (!a) return O;
              var h = 1;
              if (
                (b === R && (b = 6),
                0 > e ? ((h = 0), (e = -e)) : e > 15 && ((h = 2), (e -= 16)),
                1 > f ||
                  f > Z ||
                  c !== Y ||
                  8 > e ||
                  e > 15 ||
                  0 > b ||
                  b > 9 ||
                  0 > g ||
                  g > V)
              )
                return d(a, O);
              8 === e && (e = 9);
              var i = new t();
              return (
                (a.state = i),
                (i.strm = a),
                (i.wrap = h),
                (i.gzhead = null),
                (i.w_bits = e),
                (i.w_size = 1 << i.w_bits),
                (i.w_mask = i.w_size - 1),
                (i.hash_bits = f + 7),
                (i.hash_size = 1 << i.hash_bits),
                (i.hash_mask = i.hash_size - 1),
                (i.hash_shift = ~~((i.hash_bits + fa - 1) / fa)),
                (i.window = new C.Buf8(2 * i.w_size)),
                (i.head = new C.Buf16(i.hash_size)),
                (i.prev = new C.Buf16(i.w_size)),
                (i.lit_bufsize = 1 << (f + 6)),
                (i.pending_buf_size = 4 * i.lit_bufsize),
                (i.pending_buf = new C.Buf8(i.pending_buf_size)),
                (i.d_buf = i.lit_bufsize >> 1),
                (i.l_buf = 3 * i.lit_bufsize),
                (i.level = b),
                (i.strategy = g),
                (i.method = c),
                v(a)
              );
            }
            function y(a, b) {
              return x(a, b, Y, $, _, W);
            }
            function z(a, b) {
              var c, h, k, l;
              if (!a || !a.state || b > L || 0 > b) return a ? d(a, O) : O;
              if (
                ((h = a.state),
                !a.output ||
                  (!a.input && 0 !== a.avail_in) ||
                  (h.status === pa && b !== K))
              )
                return d(a, 0 === a.avail_out ? Q : O);
              if (
                ((h.strm = a),
                (c = h.last_flush),
                (h.last_flush = b),
                h.status === ja)
              )
                if (2 === h.wrap)
                  (a.adler = 0),
                    i(h, 31),
                    i(h, 139),
                    i(h, 8),
                    h.gzhead
                      ? (i(
                          h,
                          (h.gzhead.text ? 1 : 0) +
                            (h.gzhead.hcrc ? 2 : 0) +
                            (h.gzhead.extra ? 4 : 0) +
                            (h.gzhead.name ? 8 : 0) +
                            (h.gzhead.comment ? 16 : 0)
                        ),
                        i(h, 255 & h.gzhead.time),
                        i(h, (h.gzhead.time >> 8) & 255),
                        i(h, (h.gzhead.time >> 16) & 255),
                        i(h, (h.gzhead.time >> 24) & 255),
                        i(
                          h,
                          9 === h.level
                            ? 2
                            : h.strategy >= T || h.level < 2
                            ? 4
                            : 0
                        ),
                        i(h, 255 & h.gzhead.os),
                        h.gzhead.extra &&
                          h.gzhead.extra.length &&
                          (i(h, 255 & h.gzhead.extra.length),
                          i(h, (h.gzhead.extra.length >> 8) & 255)),
                        h.gzhead.hcrc &&
                          (a.adler = F(a.adler, h.pending_buf, h.pending, 0)),
                        (h.gzindex = 0),
                        (h.status = ka))
                      : (i(h, 0),
                        i(h, 0),
                        i(h, 0),
                        i(h, 0),
                        i(h, 0),
                        i(
                          h,
                          9 === h.level
                            ? 2
                            : h.strategy >= T || h.level < 2
                            ? 4
                            : 0
                        ),
                        i(h, ua),
                        (h.status = oa));
                else {
                  var m = (Y + ((h.w_bits - 8) << 4)) << 8,
                    n = -1;
                  (n =
                    h.strategy >= T || h.level < 2
                      ? 0
                      : h.level < 6
                      ? 1
                      : 6 === h.level
                      ? 2
                      : 3),
                    (m |= n << 6),
                    0 !== h.strstart && (m |= ia),
                    (m += 31 - (m % 31)),
                    (h.status = oa),
                    j(h, m),
                    0 !== h.strstart &&
                      (j(h, a.adler >>> 16), j(h, 65535 & a.adler)),
                    (a.adler = 1);
                }
              if (h.status === ka)
                if (h.gzhead.extra) {
                  for (
                    k = h.pending;
                    h.gzindex < (65535 & h.gzhead.extra.length) &&
                    (h.pending !== h.pending_buf_size ||
                      (h.gzhead.hcrc &&
                        h.pending > k &&
                        (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                      g(a),
                      (k = h.pending),
                      h.pending !== h.pending_buf_size));

                  )
                    i(h, 255 & h.gzhead.extra[h.gzindex]), h.gzindex++;
                  h.gzhead.hcrc &&
                    h.pending > k &&
                    (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                    h.gzindex === h.gzhead.extra.length &&
                      ((h.gzindex = 0), (h.status = la));
                } else h.status = la;
              if (h.status === la)
                if (h.gzhead.name) {
                  k = h.pending;
                  do {
                    if (
                      h.pending === h.pending_buf_size &&
                      (h.gzhead.hcrc &&
                        h.pending > k &&
                        (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                      g(a),
                      (k = h.pending),
                      h.pending === h.pending_buf_size)
                    ) {
                      l = 1;
                      break;
                    }
                    (l =
                      h.gzindex < h.gzhead.name.length
                        ? 255 & h.gzhead.name.charCodeAt(h.gzindex++)
                        : 0),
                      i(h, l);
                  } while (0 !== l);
                  h.gzhead.hcrc &&
                    h.pending > k &&
                    (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                    0 === l && ((h.gzindex = 0), (h.status = ma));
                } else h.status = ma;
              if (h.status === ma)
                if (h.gzhead.comment) {
                  k = h.pending;
                  do {
                    if (
                      h.pending === h.pending_buf_size &&
                      (h.gzhead.hcrc &&
                        h.pending > k &&
                        (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                      g(a),
                      (k = h.pending),
                      h.pending === h.pending_buf_size)
                    ) {
                      l = 1;
                      break;
                    }
                    (l =
                      h.gzindex < h.gzhead.comment.length
                        ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++)
                        : 0),
                      i(h, l);
                  } while (0 !== l);
                  h.gzhead.hcrc &&
                    h.pending > k &&
                    (a.adler = F(a.adler, h.pending_buf, h.pending - k, k)),
                    0 === l && (h.status = na);
                } else h.status = na;
              if (
                (h.status === na &&
                  (h.gzhead.hcrc
                    ? (h.pending + 2 > h.pending_buf_size && g(a),
                      h.pending + 2 <= h.pending_buf_size &&
                        (i(h, 255 & a.adler),
                        i(h, (a.adler >> 8) & 255),
                        (a.adler = 0),
                        (h.status = oa)))
                    : (h.status = oa)),
                0 !== h.pending)
              ) {
                if ((g(a), 0 === a.avail_out)) return (h.last_flush = -1), M;
              } else if (0 === a.avail_in && e(b) <= e(c) && b !== K)
                return d(a, Q);
              if (h.status === pa && 0 !== a.avail_in) return d(a, Q);
              if (
                0 !== a.avail_in ||
                0 !== h.lookahead ||
                (b !== H && h.status !== pa)
              ) {
                var o =
                  h.strategy === T
                    ? r(h, b)
                    : h.strategy === U
                    ? q(h, b)
                    : B[h.level].func(h, b);
                if (
                  ((o === sa || o === ta) && (h.status = pa),
                  o === qa || o === sa)
                )
                  return 0 === a.avail_out && (h.last_flush = -1), M;
                if (
                  o === ra &&
                  (b === I
                    ? D._tr_align(h)
                    : b !== L &&
                      (D._tr_stored_block(h, 0, 0, !1),
                      b === J &&
                        (f(h.head),
                        0 === h.lookahead &&
                          ((h.strstart = 0),
                          (h.block_start = 0),
                          (h.insert = 0)))),
                  g(a),
                  0 === a.avail_out)
                )
                  return (h.last_flush = -1), M;
              }
              return b !== K
                ? M
                : h.wrap <= 0
                ? N
                : (2 === h.wrap
                    ? (i(h, 255 & a.adler),
                      i(h, (a.adler >> 8) & 255),
                      i(h, (a.adler >> 16) & 255),
                      i(h, (a.adler >> 24) & 255),
                      i(h, 255 & a.total_in),
                      i(h, (a.total_in >> 8) & 255),
                      i(h, (a.total_in >> 16) & 255),
                      i(h, (a.total_in >> 24) & 255))
                    : (j(h, a.adler >>> 16), j(h, 65535 & a.adler)),
                  g(a),
                  h.wrap > 0 && (h.wrap = -h.wrap),
                  0 !== h.pending ? M : N);
            }
            function A(a) {
              var b;
              return a && a.state
                ? ((b = a.state.status),
                  b !== ja &&
                  b !== ka &&
                  b !== la &&
                  b !== ma &&
                  b !== na &&
                  b !== oa &&
                  b !== pa
                    ? d(a, O)
                    : ((a.state = null), b === oa ? d(a, P) : M))
                : O;
            }
            var B,
              C = a("../utils/common"),
              D = a("./trees"),
              E = a("./adler32"),
              F = a("./crc32"),
              G = a("./messages"),
              H = 0,
              I = 1,
              J = 3,
              K = 4,
              L = 5,
              M = 0,
              N = 1,
              O = -2,
              P = -3,
              Q = -5,
              R = -1,
              S = 1,
              T = 2,
              U = 3,
              V = 4,
              W = 0,
              X = 2,
              Y = 8,
              Z = 9,
              $ = 15,
              _ = 8,
              aa = 286,
              ba = 30,
              ca = 19,
              da = 2 * aa + 1,
              ea = 15,
              fa = 3,
              ga = 258,
              ha = ga + fa + 1,
              ia = 32,
              ja = 42,
              ka = 69,
              la = 73,
              ma = 91,
              na = 103,
              oa = 113,
              pa = 666,
              qa = 1,
              ra = 2,
              sa = 3,
              ta = 4,
              ua = 3,
              va = function (a, b, c, d, e) {
                (this.good_length = a),
                  (this.max_lazy = b),
                  (this.nice_length = c),
                  (this.max_chain = d),
                  (this.func = e);
              };
            (B = [
              new va(0, 0, 0, 0, n),
              new va(4, 4, 8, 4, o),
              new va(4, 5, 16, 8, o),
              new va(4, 6, 32, 32, o),
              new va(4, 4, 16, 16, p),
              new va(8, 16, 32, 32, p),
              new va(8, 16, 128, 128, p),
              new va(8, 32, 128, 256, p),
              new va(32, 128, 258, 1024, p),
              new va(32, 258, 258, 4096, p),
            ]),
              (c.deflateInit = y),
              (c.deflateInit2 = x),
              (c.deflateReset = v),
              (c.deflateResetKeep = u),
              (c.deflateSetHeader = w),
              (c.deflate = z),
              (c.deflateEnd = A),
              (c.deflateInfo = "pako deflate (from Nodeca project)");
          },
          {
            "../utils/common": 27,
            "./adler32": 29,
            "./crc32": 31,
            "./messages": 37,
            "./trees": 38,
          },
        ],
        33: [
          function (a, b) {
            "use strict";
            function c() {
              (this.text = 0),
                (this.time = 0),
                (this.xflags = 0),
                (this.os = 0),
                (this.extra = null),
                (this.extra_len = 0),
                (this.name = ""),
                (this.comment = ""),
                (this.hcrc = 0),
                (this.done = !1);
            }
            b.exports = c;
          },
          {},
        ],
        34: [
          function (a, b) {
            "use strict";
            b.exports = function (a, b) {
              var c,
                d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                r,
                s,
                t,
                u,
                v,
                w,
                x,
                y,
                z,
                A;
              (c = a.state),
                (d = a.next_in),
                (z = a.input),
                (e = d + (a.avail_in - 5)),
                (f = a.next_out),
                (A = a.output),
                (g = f - (b - a.avail_out)),
                (h = f + (a.avail_out - 257)),
                (i = c.dmax),
                (j = c.wsize),
                (k = c.whave),
                (l = c.wnext),
                (m = c.window),
                (n = c.hold),
                (o = c.bits),
                (p = c.lencode),
                (q = c.distcode),
                (r = (1 << c.lenbits) - 1),
                (s = (1 << c.distbits) - 1);
              a: do {
                15 > o &&
                  ((n += z[d++] << o), (o += 8), (n += z[d++] << o), (o += 8)),
                  (t = p[n & r]);
                b: for (;;) {
                  if (
                    ((u = t >>> 24),
                    (n >>>= u),
                    (o -= u),
                    0 === (u = (t >>> 16) & 255))
                  )
                    A[f++] = 65535 & t;
                  else {
                    if (!(16 & u)) {
                      if (0 == (64 & u)) {
                        t = p[(65535 & t) + (n & ((1 << u) - 1))];
                        continue b;
                      }
                      if (32 & u) {
                        c.mode = 12;
                        break a;
                      }
                      (a.msg = "invalid literal/length code"), (c.mode = 30);
                      break a;
                    }
                    (v = 65535 & t),
                      (u &= 15),
                      u &&
                        (u > o && ((n += z[d++] << o), (o += 8)),
                        (v += n & ((1 << u) - 1)),
                        (n >>>= u),
                        (o -= u)),
                      15 > o &&
                        ((n += z[d++] << o),
                        (o += 8),
                        (n += z[d++] << o),
                        (o += 8)),
                      (t = q[n & s]);
                    c: for (;;) {
                      if (
                        ((u = t >>> 24),
                        (n >>>= u),
                        (o -= u),
                        !(16 & (u = (t >>> 16) & 255)))
                      ) {
                        if (0 == (64 & u)) {
                          t = q[(65535 & t) + (n & ((1 << u) - 1))];
                          continue c;
                        }
                        (a.msg = "invalid distance code"), (c.mode = 30);
                        break a;
                      }
                      if (
                        ((w = 65535 & t),
                        (u &= 15),
                        u > o &&
                          ((n += z[d++] << o),
                          (o += 8),
                          u > o && ((n += z[d++] << o), (o += 8))),
                        (w += n & ((1 << u) - 1)) > i)
                      ) {
                        (a.msg = "invalid distance too far back"),
                          (c.mode = 30);
                        break a;
                      }
                      if (((n >>>= u), (o -= u), (u = f - g), w > u)) {
                        if ((u = w - u) > k && c.sane) {
                          (a.msg = "invalid distance too far back"),
                            (c.mode = 30);
                          break a;
                        }
                        if (((x = 0), (y = m), 0 === l)) {
                          if (((x += j - u), v > u)) {
                            v -= u;
                            do {
                              A[f++] = m[x++];
                            } while (--u);
                            (x = f - w), (y = A);
                          }
                        } else if (u > l) {
                          if (((x += j + l - u), (u -= l), v > u)) {
                            v -= u;
                            do {
                              A[f++] = m[x++];
                            } while (--u);
                            if (((x = 0), v > l)) {
                              (u = l), (v -= u);
                              do {
                                A[f++] = m[x++];
                              } while (--u);
                              (x = f - w), (y = A);
                            }
                          }
                        } else if (((x += l - u), v > u)) {
                          v -= u;
                          do {
                            A[f++] = m[x++];
                          } while (--u);
                          (x = f - w), (y = A);
                        }
                        for (; v > 2; )
                          (A[f++] = y[x++]),
                            (A[f++] = y[x++]),
                            (A[f++] = y[x++]),
                            (v -= 3);
                        v && ((A[f++] = y[x++]), v > 1 && (A[f++] = y[x++]));
                      } else {
                        x = f - w;
                        do {
                          (A[f++] = A[x++]),
                            (A[f++] = A[x++]),
                            (A[f++] = A[x++]),
                            (v -= 3);
                        } while (v > 2);
                        v && ((A[f++] = A[x++]), v > 1 && (A[f++] = A[x++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (e > d && h > f);
              (v = o >> 3),
                (d -= v),
                (o -= v << 3),
                (n &= (1 << o) - 1),
                (a.next_in = d),
                (a.next_out = f),
                (a.avail_in = e > d ? e - d + 5 : 5 - (d - e)),
                (a.avail_out = h > f ? h - f + 257 : 257 - (f - h)),
                (c.hold = n),
                (c.bits = o);
            };
          },
          {},
        ],
        35: [
          function (a, b, c) {
            "use strict";
            function d(a) {
              return (
                ((a >>> 24) & 255) +
                ((a >>> 8) & 65280) +
                ((65280 & a) << 8) +
                ((255 & a) << 24)
              );
            }
            function e() {
              (this.mode = 0),
                (this.last = !1),
                (this.wrap = 0),
                (this.havedict = !1),
                (this.flags = 0),
                (this.dmax = 0),
                (this.check = 0),
                (this.total = 0),
                (this.head = null),
                (this.wbits = 0),
                (this.wsize = 0),
                (this.whave = 0),
                (this.wnext = 0),
                (this.window = null),
                (this.hold = 0),
                (this.bits = 0),
                (this.length = 0),
                (this.offset = 0),
                (this.extra = 0),
                (this.lencode = null),
                (this.distcode = null),
                (this.lenbits = 0),
                (this.distbits = 0),
                (this.ncode = 0),
                (this.nlen = 0),
                (this.ndist = 0),
                (this.have = 0),
                (this.next = null),
                (this.lens = new r.Buf16(320)),
                (this.work = new r.Buf16(288)),
                (this.lendyn = null),
                (this.distdyn = null),
                (this.sane = 0),
                (this.back = 0),
                (this.was = 0);
            }
            function f(a) {
              var b;
              return a && a.state
                ? ((b = a.state),
                  (a.total_in = a.total_out = b.total = 0),
                  (a.msg = ""),
                  b.wrap && (a.adler = 1 & b.wrap),
                  (b.mode = K),
                  (b.last = 0),
                  (b.havedict = 0),
                  (b.dmax = 32768),
                  (b.head = null),
                  (b.hold = 0),
                  (b.bits = 0),
                  (b.lencode = b.lendyn = new r.Buf32(oa)),
                  (b.distcode = b.distdyn = new r.Buf32(pa)),
                  (b.sane = 1),
                  (b.back = -1),
                  C)
                : F;
            }
            function g(a) {
              var b;
              return a && a.state
                ? ((b = a.state),
                  (b.wsize = 0),
                  (b.whave = 0),
                  (b.wnext = 0),
                  f(a))
                : F;
            }
            function h(a, b) {
              var c, d;
              return a && a.state
                ? ((d = a.state),
                  0 > b
                    ? ((c = 0), (b = -b))
                    : ((c = 1 + (b >> 4)), 48 > b && (b &= 15)),
                  b && (8 > b || b > 15)
                    ? F
                    : (null !== d.window && d.wbits !== b && (d.window = null),
                      (d.wrap = c),
                      (d.wbits = b),
                      g(a)))
                : F;
            }
            function i(a, b) {
              var c, d;
              return a
                ? ((d = new e()),
                  (a.state = d),
                  (d.window = null),
                  (c = h(a, b)),
                  c !== C && (a.state = null),
                  c)
                : F;
            }
            function j(a) {
              return i(a, qa);
            }
            function k(a) {
              if (ra) {
                var b;
                for (
                  p = new r.Buf32(512), q = new r.Buf32(32), b = 0;
                  144 > b;

                )
                  a.lens[b++] = 8;
                for (; 256 > b; ) a.lens[b++] = 9;
                for (; 280 > b; ) a.lens[b++] = 7;
                for (; 288 > b; ) a.lens[b++] = 8;
                for (
                  v(x, a.lens, 0, 288, p, 0, a.work, { bits: 9 }), b = 0;
                  32 > b;

                )
                  a.lens[b++] = 5;
                v(y, a.lens, 0, 32, q, 0, a.work, { bits: 5 }), (ra = !1);
              }
              (a.lencode = p),
                (a.lenbits = 9),
                (a.distcode = q),
                (a.distbits = 5);
            }
            function l(a, b, c, d) {
              var e,
                f = a.state;
              return (
                null === f.window &&
                  ((f.wsize = 1 << f.wbits),
                  (f.wnext = 0),
                  (f.whave = 0),
                  (f.window = new r.Buf8(f.wsize))),
                d >= f.wsize
                  ? (r.arraySet(f.window, b, c - f.wsize, f.wsize, 0),
                    (f.wnext = 0),
                    (f.whave = f.wsize))
                  : ((e = f.wsize - f.wnext),
                    e > d && (e = d),
                    r.arraySet(f.window, b, c - d, e, f.wnext),
                    (d -= e),
                    d
                      ? (r.arraySet(f.window, b, c - d, d, 0),
                        (f.wnext = d),
                        (f.whave = f.wsize))
                      : ((f.wnext += e),
                        f.wnext === f.wsize && (f.wnext = 0),
                        f.whave < f.wsize && (f.whave += e))),
                0
              );
            }
            function m(a, b) {
              var c,
                e,
                f,
                g,
                h,
                i,
                j,
                m,
                n,
                o,
                p,
                q,
                oa,
                pa,
                qa,
                ra,
                sa,
                ta,
                ua,
                va,
                wa,
                xa,
                ya,
                za,
                Aa = 0,
                Ba = new r.Buf8(4),
                Ca = [
                  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                  15,
                ];
              if (!a || !a.state || !a.output || (!a.input && 0 !== a.avail_in))
                return F;
              (c = a.state),
                c.mode === V && (c.mode = W),
                (h = a.next_out),
                (f = a.output),
                (j = a.avail_out),
                (g = a.next_in),
                (e = a.input),
                (i = a.avail_in),
                (m = c.hold),
                (n = c.bits),
                (o = i),
                (p = j),
                (xa = C);
              a: for (;;)
                switch (c.mode) {
                  case K:
                    if (0 === c.wrap) {
                      c.mode = W;
                      break;
                    }
                    for (; 16 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if (2 & c.wrap && 35615 === m) {
                      (c.check = 0),
                        (Ba[0] = 255 & m),
                        (Ba[1] = (m >>> 8) & 255),
                        (c.check = t(c.check, Ba, 2, 0)),
                        (m = 0),
                        (n = 0),
                        (c.mode = L);
                      break;
                    }
                    if (
                      ((c.flags = 0),
                      c.head && (c.head.done = !1),
                      !(1 & c.wrap) || (((255 & m) << 8) + (m >> 8)) % 31)
                    ) {
                      (a.msg = "incorrect header check"), (c.mode = la);
                      break;
                    }
                    if ((15 & m) !== J) {
                      (a.msg = "unknown compression method"), (c.mode = la);
                      break;
                    }
                    if (
                      ((m >>>= 4), (n -= 4), (wa = 8 + (15 & m)), 0 === c.wbits)
                    )
                      c.wbits = wa;
                    else if (wa > c.wbits) {
                      (a.msg = "invalid window size"), (c.mode = la);
                      break;
                    }
                    (c.dmax = 1 << wa),
                      (a.adler = c.check = 1),
                      (c.mode = 512 & m ? T : V),
                      (m = 0),
                      (n = 0);
                    break;
                  case L:
                    for (; 16 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if (((c.flags = m), (255 & c.flags) !== J)) {
                      (a.msg = "unknown compression method"), (c.mode = la);
                      break;
                    }
                    if (57344 & c.flags) {
                      (a.msg = "unknown header flags set"), (c.mode = la);
                      break;
                    }
                    c.head && (c.head.text = (m >> 8) & 1),
                      512 & c.flags &&
                        ((Ba[0] = 255 & m),
                        (Ba[1] = (m >>> 8) & 255),
                        (c.check = t(c.check, Ba, 2, 0))),
                      (m = 0),
                      (n = 0),
                      (c.mode = M);
                  case M:
                    for (; 32 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    c.head && (c.head.time = m),
                      512 & c.flags &&
                        ((Ba[0] = 255 & m),
                        (Ba[1] = (m >>> 8) & 255),
                        (Ba[2] = (m >>> 16) & 255),
                        (Ba[3] = (m >>> 24) & 255),
                        (c.check = t(c.check, Ba, 4, 0))),
                      (m = 0),
                      (n = 0),
                      (c.mode = N);
                  case N:
                    for (; 16 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    c.head && ((c.head.xflags = 255 & m), (c.head.os = m >> 8)),
                      512 & c.flags &&
                        ((Ba[0] = 255 & m),
                        (Ba[1] = (m >>> 8) & 255),
                        (c.check = t(c.check, Ba, 2, 0))),
                      (m = 0),
                      (n = 0),
                      (c.mode = O);
                  case O:
                    if (1024 & c.flags) {
                      for (; 16 > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (c.length = m),
                        c.head && (c.head.extra_len = m),
                        512 & c.flags &&
                          ((Ba[0] = 255 & m),
                          (Ba[1] = (m >>> 8) & 255),
                          (c.check = t(c.check, Ba, 2, 0))),
                        (m = 0),
                        (n = 0);
                    } else c.head && (c.head.extra = null);
                    c.mode = P;
                  case P:
                    if (
                      1024 & c.flags &&
                      ((q = c.length),
                      q > i && (q = i),
                      q &&
                        (c.head &&
                          ((wa = c.head.extra_len - c.length),
                          c.head.extra ||
                            (c.head.extra = new Array(c.head.extra_len)),
                          r.arraySet(c.head.extra, e, g, q, wa)),
                        512 & c.flags && (c.check = t(c.check, e, q, g)),
                        (i -= q),
                        (g += q),
                        (c.length -= q)),
                      c.length)
                    )
                      break a;
                    (c.length = 0), (c.mode = Q);
                  case Q:
                    if (2048 & c.flags) {
                      if (0 === i) break a;
                      q = 0;
                      do {
                        (wa = e[g + q++]),
                          c.head &&
                            wa &&
                            c.length < 65536 &&
                            (c.head.name += String.fromCharCode(wa));
                      } while (wa && i > q);
                      if (
                        (512 & c.flags && (c.check = t(c.check, e, q, g)),
                        (i -= q),
                        (g += q),
                        wa)
                      )
                        break a;
                    } else c.head && (c.head.name = null);
                    (c.length = 0), (c.mode = R);
                  case R:
                    if (4096 & c.flags) {
                      if (0 === i) break a;
                      q = 0;
                      do {
                        (wa = e[g + q++]),
                          c.head &&
                            wa &&
                            c.length < 65536 &&
                            (c.head.comment += String.fromCharCode(wa));
                      } while (wa && i > q);
                      if (
                        (512 & c.flags && (c.check = t(c.check, e, q, g)),
                        (i -= q),
                        (g += q),
                        wa)
                      )
                        break a;
                    } else c.head && (c.head.comment = null);
                    c.mode = S;
                  case S:
                    if (512 & c.flags) {
                      for (; 16 > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      if (m !== (65535 & c.check)) {
                        (a.msg = "header crc mismatch"), (c.mode = la);
                        break;
                      }
                      (m = 0), (n = 0);
                    }
                    c.head &&
                      ((c.head.hcrc = (c.flags >> 9) & 1), (c.head.done = !0)),
                      (a.adler = c.check = 0),
                      (c.mode = V);
                    break;
                  case T:
                    for (; 32 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    (a.adler = c.check = d(m)), (m = 0), (n = 0), (c.mode = U);
                  case U:
                    if (0 === c.havedict)
                      return (
                        (a.next_out = h),
                        (a.avail_out = j),
                        (a.next_in = g),
                        (a.avail_in = i),
                        (c.hold = m),
                        (c.bits = n),
                        E
                      );
                    (a.adler = c.check = 1), (c.mode = V);
                  case V:
                    if (b === A || b === B) break a;
                  case W:
                    if (c.last) {
                      (m >>>= 7 & n), (n -= 7 & n), (c.mode = ia);
                      break;
                    }
                    for (; 3 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    switch (((c.last = 1 & m), (m >>>= 1), (n -= 1), 3 & m)) {
                      case 0:
                        c.mode = X;
                        break;
                      case 1:
                        if ((k(c), (c.mode = ba), b === B)) {
                          (m >>>= 2), (n -= 2);
                          break a;
                        }
                        break;
                      case 2:
                        c.mode = $;
                        break;
                      case 3:
                        (a.msg = "invalid block type"), (c.mode = la);
                    }
                    (m >>>= 2), (n -= 2);
                    break;
                  case X:
                    for (m >>>= 7 & n, n -= 7 & n; 32 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if ((65535 & m) != ((m >>> 16) ^ 65535)) {
                      (a.msg = "invalid stored block lengths"), (c.mode = la);
                      break;
                    }
                    if (
                      ((c.length = 65535 & m),
                      (m = 0),
                      (n = 0),
                      (c.mode = Y),
                      b === B)
                    )
                      break a;
                  case Y:
                    c.mode = Z;
                  case Z:
                    if ((q = c.length)) {
                      if ((q > i && (q = i), q > j && (q = j), 0 === q))
                        break a;
                      r.arraySet(f, e, g, q, h),
                        (i -= q),
                        (g += q),
                        (j -= q),
                        (h += q),
                        (c.length -= q);
                      break;
                    }
                    c.mode = V;
                    break;
                  case $:
                    for (; 14 > n; ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if (
                      ((c.nlen = 257 + (31 & m)),
                      (m >>>= 5),
                      (n -= 5),
                      (c.ndist = 1 + (31 & m)),
                      (m >>>= 5),
                      (n -= 5),
                      (c.ncode = 4 + (15 & m)),
                      (m >>>= 4),
                      (n -= 4),
                      c.nlen > 286 || c.ndist > 30)
                    ) {
                      (a.msg = "too many length or distance symbols"),
                        (c.mode = la);
                      break;
                    }
                    (c.have = 0), (c.mode = _);
                  case _:
                    for (; c.have < c.ncode; ) {
                      for (; 3 > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (c.lens[Ca[c.have++]] = 7 & m), (m >>>= 3), (n -= 3);
                    }
                    for (; c.have < 19; ) c.lens[Ca[c.have++]] = 0;
                    if (
                      ((c.lencode = c.lendyn),
                      (c.lenbits = 7),
                      (ya = { bits: c.lenbits }),
                      (xa = v(w, c.lens, 0, 19, c.lencode, 0, c.work, ya)),
                      (c.lenbits = ya.bits),
                      xa)
                    ) {
                      (a.msg = "invalid code lengths set"), (c.mode = la);
                      break;
                    }
                    (c.have = 0), (c.mode = aa);
                  case aa:
                    for (; c.have < c.nlen + c.ndist; ) {
                      for (
                        ;
                        (Aa = c.lencode[m & ((1 << c.lenbits) - 1)]),
                          (qa = Aa >>> 24),
                          (ra = (Aa >>> 16) & 255),
                          (sa = 65535 & Aa),
                          !(n >= qa);

                      ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      if (16 > sa)
                        (m >>>= qa), (n -= qa), (c.lens[c.have++] = sa);
                      else {
                        if (16 === sa) {
                          for (za = qa + 2; za > n; ) {
                            if (0 === i) break a;
                            i--, (m += e[g++] << n), (n += 8);
                          }
                          if (((m >>>= qa), (n -= qa), 0 === c.have)) {
                            (a.msg = "invalid bit length repeat"),
                              (c.mode = la);
                            break;
                          }
                          (wa = c.lens[c.have - 1]),
                            (q = 3 + (3 & m)),
                            (m >>>= 2),
                            (n -= 2);
                        } else if (17 === sa) {
                          for (za = qa + 3; za > n; ) {
                            if (0 === i) break a;
                            i--, (m += e[g++] << n), (n += 8);
                          }
                          (m >>>= qa),
                            (n -= qa),
                            (wa = 0),
                            (q = 3 + (7 & m)),
                            (m >>>= 3),
                            (n -= 3);
                        } else {
                          for (za = qa + 7; za > n; ) {
                            if (0 === i) break a;
                            i--, (m += e[g++] << n), (n += 8);
                          }
                          (m >>>= qa),
                            (n -= qa),
                            (wa = 0),
                            (q = 11 + (127 & m)),
                            (m >>>= 7),
                            (n -= 7);
                        }
                        if (c.have + q > c.nlen + c.ndist) {
                          (a.msg = "invalid bit length repeat"), (c.mode = la);
                          break;
                        }
                        for (; q--; ) c.lens[c.have++] = wa;
                      }
                    }
                    if (c.mode === la) break;
                    if (0 === c.lens[256]) {
                      (a.msg = "invalid code -- missing end-of-block"),
                        (c.mode = la);
                      break;
                    }
                    if (
                      ((c.lenbits = 9),
                      (ya = { bits: c.lenbits }),
                      (xa = v(x, c.lens, 0, c.nlen, c.lencode, 0, c.work, ya)),
                      (c.lenbits = ya.bits),
                      xa)
                    ) {
                      (a.msg = "invalid literal/lengths set"), (c.mode = la);
                      break;
                    }
                    if (
                      ((c.distbits = 6),
                      (c.distcode = c.distdyn),
                      (ya = { bits: c.distbits }),
                      (xa = v(
                        y,
                        c.lens,
                        c.nlen,
                        c.ndist,
                        c.distcode,
                        0,
                        c.work,
                        ya
                      )),
                      (c.distbits = ya.bits),
                      xa)
                    ) {
                      (a.msg = "invalid distances set"), (c.mode = la);
                      break;
                    }
                    if (((c.mode = ba), b === B)) break a;
                  case ba:
                    c.mode = ca;
                  case ca:
                    if (i >= 6 && j >= 258) {
                      (a.next_out = h),
                        (a.avail_out = j),
                        (a.next_in = g),
                        (a.avail_in = i),
                        (c.hold = m),
                        (c.bits = n),
                        u(a, p),
                        (h = a.next_out),
                        (f = a.output),
                        (j = a.avail_out),
                        (g = a.next_in),
                        (e = a.input),
                        (i = a.avail_in),
                        (m = c.hold),
                        (n = c.bits),
                        c.mode === V && (c.back = -1);
                      break;
                    }
                    for (
                      c.back = 0;
                      (Aa = c.lencode[m & ((1 << c.lenbits) - 1)]),
                        (qa = Aa >>> 24),
                        (ra = (Aa >>> 16) & 255),
                        (sa = 65535 & Aa),
                        !(n >= qa);

                    ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if (ra && 0 == (240 & ra)) {
                      for (
                        ta = qa, ua = ra, va = sa;
                        (Aa =
                          c.lencode[va + ((m & ((1 << (ta + ua)) - 1)) >> ta)]),
                          (qa = Aa >>> 24),
                          (ra = (Aa >>> 16) & 255),
                          (sa = 65535 & Aa),
                          !(n >= ta + qa);

                      ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (m >>>= ta), (n -= ta), (c.back += ta);
                    }
                    if (
                      ((m >>>= qa),
                      (n -= qa),
                      (c.back += qa),
                      (c.length = sa),
                      0 === ra)
                    ) {
                      c.mode = ha;
                      break;
                    }
                    if (32 & ra) {
                      (c.back = -1), (c.mode = V);
                      break;
                    }
                    if (64 & ra) {
                      (a.msg = "invalid literal/length code"), (c.mode = la);
                      break;
                    }
                    (c.extra = 15 & ra), (c.mode = da);
                  case da:
                    if (c.extra) {
                      for (za = c.extra; za > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (c.length += m & ((1 << c.extra) - 1)),
                        (m >>>= c.extra),
                        (n -= c.extra),
                        (c.back += c.extra);
                    }
                    (c.was = c.length), (c.mode = ea);
                  case ea:
                    for (
                      ;
                      (Aa = c.distcode[m & ((1 << c.distbits) - 1)]),
                        (qa = Aa >>> 24),
                        (ra = (Aa >>> 16) & 255),
                        (sa = 65535 & Aa),
                        !(n >= qa);

                    ) {
                      if (0 === i) break a;
                      i--, (m += e[g++] << n), (n += 8);
                    }
                    if (0 == (240 & ra)) {
                      for (
                        ta = qa, ua = ra, va = sa;
                        (Aa =
                          c.distcode[
                            va + ((m & ((1 << (ta + ua)) - 1)) >> ta)
                          ]),
                          (qa = Aa >>> 24),
                          (ra = (Aa >>> 16) & 255),
                          (sa = 65535 & Aa),
                          !(n >= ta + qa);

                      ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (m >>>= ta), (n -= ta), (c.back += ta);
                    }
                    if (((m >>>= qa), (n -= qa), (c.back += qa), 64 & ra)) {
                      (a.msg = "invalid distance code"), (c.mode = la);
                      break;
                    }
                    (c.offset = sa), (c.extra = 15 & ra), (c.mode = fa);
                  case fa:
                    if (c.extra) {
                      for (za = c.extra; za > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      (c.offset += m & ((1 << c.extra) - 1)),
                        (m >>>= c.extra),
                        (n -= c.extra),
                        (c.back += c.extra);
                    }
                    if (c.offset > c.dmax) {
                      (a.msg = "invalid distance too far back"), (c.mode = la);
                      break;
                    }
                    c.mode = ga;
                  case ga:
                    if (0 === j) break a;
                    if (((q = p - j), c.offset > q)) {
                      if ((q = c.offset - q) > c.whave && c.sane) {
                        (a.msg = "invalid distance too far back"),
                          (c.mode = la);
                        break;
                      }
                      q > c.wnext
                        ? ((q -= c.wnext), (oa = c.wsize - q))
                        : (oa = c.wnext - q),
                        q > c.length && (q = c.length),
                        (pa = c.window);
                    } else (pa = f), (oa = h - c.offset), (q = c.length);
                    q > j && (q = j), (j -= q), (c.length -= q);
                    do {
                      f[h++] = pa[oa++];
                    } while (--q);
                    0 === c.length && (c.mode = ca);
                    break;
                  case ha:
                    if (0 === j) break a;
                    (f[h++] = c.length), j--, (c.mode = ca);
                    break;
                  case ia:
                    if (c.wrap) {
                      for (; 32 > n; ) {
                        if (0 === i) break a;
                        i--, (m |= e[g++] << n), (n += 8);
                      }
                      if (
                        ((p -= j),
                        (a.total_out += p),
                        (c.total += p),
                        p &&
                          (a.adler = c.check =
                            c.flags
                              ? t(c.check, f, p, h - p)
                              : s(c.check, f, p, h - p)),
                        (p = j),
                        (c.flags ? m : d(m)) !== c.check)
                      ) {
                        (a.msg = "incorrect data check"), (c.mode = la);
                        break;
                      }
                      (m = 0), (n = 0);
                    }
                    c.mode = ja;
                  case ja:
                    if (c.wrap && c.flags) {
                      for (; 32 > n; ) {
                        if (0 === i) break a;
                        i--, (m += e[g++] << n), (n += 8);
                      }
                      if (m !== (4294967295 & c.total)) {
                        (a.msg = "incorrect length check"), (c.mode = la);
                        break;
                      }
                      (m = 0), (n = 0);
                    }
                    c.mode = ka;
                  case ka:
                    xa = D;
                    break a;
                  case la:
                    xa = G;
                    break a;
                  case ma:
                    return H;
                  case na:
                  default:
                    return F;
                }
              return (
                (a.next_out = h),
                (a.avail_out = j),
                (a.next_in = g),
                (a.avail_in = i),
                (c.hold = m),
                (c.bits = n),
                (c.wsize ||
                  (p !== a.avail_out &&
                    c.mode < la &&
                    (c.mode < ia || b !== z))) &&
                l(a, a.output, a.next_out, p - a.avail_out)
                  ? ((c.mode = ma), H)
                  : ((o -= a.avail_in),
                    (p -= a.avail_out),
                    (a.total_in += o),
                    (a.total_out += p),
                    (c.total += p),
                    c.wrap &&
                      p &&
                      (a.adler = c.check =
                        c.flags
                          ? t(c.check, f, p, a.next_out - p)
                          : s(c.check, f, p, a.next_out - p)),
                    (a.data_type =
                      c.bits +
                      (c.last ? 64 : 0) +
                      (c.mode === V ? 128 : 0) +
                      (c.mode === ba || c.mode === Y ? 256 : 0)),
                    ((0 === o && 0 === p) || b === z) && xa === C && (xa = I),
                    xa)
              );
            }
            function n(a) {
              if (!a || !a.state) return F;
              var b = a.state;
              return b.window && (b.window = null), (a.state = null), C;
            }
            function o(a, b) {
              var c;
              return a && a.state
                ? ((c = a.state),
                  0 == (2 & c.wrap) ? F : ((c.head = b), (b.done = !1), C))
                : F;
            }
            var p,
              q,
              r = a("../utils/common"),
              s = a("./adler32"),
              t = a("./crc32"),
              u = a("./inffast"),
              v = a("./inftrees"),
              w = 0,
              x = 1,
              y = 2,
              z = 4,
              A = 5,
              B = 6,
              C = 0,
              D = 1,
              E = 2,
              F = -2,
              G = -3,
              H = -4,
              I = -5,
              J = 8,
              K = 1,
              L = 2,
              M = 3,
              N = 4,
              O = 5,
              P = 6,
              Q = 7,
              R = 8,
              S = 9,
              T = 10,
              U = 11,
              V = 12,
              W = 13,
              X = 14,
              Y = 15,
              Z = 16,
              $ = 17,
              _ = 18,
              aa = 19,
              ba = 20,
              ca = 21,
              da = 22,
              ea = 23,
              fa = 24,
              ga = 25,
              ha = 26,
              ia = 27,
              ja = 28,
              ka = 29,
              la = 30,
              ma = 31,
              na = 32,
              oa = 852,
              pa = 592,
              qa = 15,
              ra = !0;
            (c.inflateReset = g),
              (c.inflateReset2 = h),
              (c.inflateResetKeep = f),
              (c.inflateInit = j),
              (c.inflateInit2 = i),
              (c.inflate = m),
              (c.inflateEnd = n),
              (c.inflateGetHeader = o),
              (c.inflateInfo = "pako inflate (from Nodeca project)");
          },
          {
            "../utils/common": 27,
            "./adler32": 29,
            "./crc32": 31,
            "./inffast": 34,
            "./inftrees": 36,
          },
        ],
        36: [
          function (a, b) {
            "use strict";
            var c = a("../utils/common"),
              d = 15,
              e = [
                3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
                51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
              ],
              f = [
                16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
                19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
              ],
              g = [
                1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
                385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
                16385, 24577, 0, 0,
              ],
              h = [
                16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
                23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
              ];
            b.exports = function (a, b, i, j, k, l, m, n) {
              var o,
                p,
                q,
                r,
                s,
                t,
                u,
                v,
                w,
                x = n.bits,
                y = 0,
                z = 0,
                A = 0,
                B = 0,
                C = 0,
                D = 0,
                E = 0,
                F = 0,
                G = 0,
                H = 0,
                I = null,
                J = 0,
                K = new c.Buf16(16),
                L = new c.Buf16(16),
                M = null,
                N = 0;
              for (y = 0; d >= y; y++) K[y] = 0;
              for (z = 0; j > z; z++) K[b[i + z]]++;
              for (C = x, B = d; B >= 1 && 0 === K[B]; B--);
              if ((C > B && (C = B), 0 === B))
                return (
                  (k[l++] = 20971520), (k[l++] = 20971520), (n.bits = 1), 0
                );
              for (A = 1; B > A && 0 === K[A]; A++);
              for (A > C && (C = A), F = 1, y = 1; d >= y; y++)
                if (((F <<= 1), 0 > (F -= K[y]))) return -1;
              if (F > 0 && (0 === a || 1 !== B)) return -1;
              for (L[1] = 0, y = 1; d > y; y++) L[y + 1] = L[y] + K[y];
              for (z = 0; j > z; z++) 0 !== b[i + z] && (m[L[b[i + z]]++] = z);
              if (
                (0 === a
                  ? ((I = M = m), (t = 19))
                  : 1 === a
                  ? ((I = e), (J -= 257), (M = f), (N -= 257), (t = 256))
                  : ((I = g), (M = h), (t = -1)),
                (H = 0),
                (z = 0),
                (y = A),
                (s = l),
                (D = C),
                (E = 0),
                (q = -1),
                (G = 1 << C),
                (r = G - 1),
                (1 === a && G > 852) || (2 === a && G > 592))
              )
                return 1;
              for (var O = 0; ; ) {
                O++,
                  (u = y - E),
                  m[z] < t
                    ? ((v = 0), (w = m[z]))
                    : m[z] > t
                    ? ((v = M[N + m[z]]), (w = I[J + m[z]]))
                    : ((v = 96), (w = 0)),
                  (o = 1 << (y - E)),
                  (p = 1 << D),
                  (A = p);
                do {
                  (p -= o),
                    (k[s + (H >> E) + p] = (u << 24) | (v << 16) | w | 0);
                } while (0 !== p);
                for (o = 1 << (y - 1); H & o; ) o >>= 1;
                if (
                  (0 !== o ? ((H &= o - 1), (H += o)) : (H = 0),
                  z++,
                  0 == --K[y])
                ) {
                  if (y === B) break;
                  y = b[i + m[z]];
                }
                if (y > C && (H & r) !== q) {
                  for (
                    0 === E && (E = C), s += A, D = y - E, F = 1 << D;
                    B > D + E && !(0 >= (F -= K[D + E]));

                  )
                    D++, (F <<= 1);
                  if (
                    ((G += 1 << D),
                    (1 === a && G > 852) || (2 === a && G > 592))
                  )
                    return 1;
                  (q = H & r), (k[q] = (C << 24) | (D << 16) | (s - l) | 0);
                }
              }
              return (
                0 !== H && (k[s + H] = ((y - E) << 24) | (64 << 16) | 0),
                (n.bits = C),
                0
              );
            };
          },
          { "../utils/common": 27 },
        ],
        37: [
          function (a, b) {
            "use strict";
            b.exports = {
              2: "need dictionary",
              1: "stream end",
              0: "",
              "-1": "file error",
              "-2": "stream error",
              "-3": "data error",
              "-4": "insufficient memory",
              "-5": "buffer error",
              "-6": "incompatible version",
            };
          },
          {},
        ],
        38: [
          function (a, b, c) {
            "use strict";
            function d(a) {
              for (var b = a.length; --b >= 0; ) a[b] = 0;
            }
            function e(a) {
              return 256 > a ? da[a] : da[256 + (a >>> 7)];
            }
            function f(a, b) {
              (a.pending_buf[a.pending++] = 255 & b),
                (a.pending_buf[a.pending++] = (b >>> 8) & 255);
            }
            function g(a, b, c) {
              a.bi_valid > T - c
                ? ((a.bi_buf |= (b << a.bi_valid) & 65535),
                  f(a, a.bi_buf),
                  (a.bi_buf = b >> (T - a.bi_valid)),
                  (a.bi_valid += c - T))
                : ((a.bi_buf |= (b << a.bi_valid) & 65535), (a.bi_valid += c));
            }
            function h(a, b, c) {
              g(a, c[2 * b], c[2 * b + 1]);
            }
            function i(a, b) {
              var c = 0;
              do {
                (c |= 1 & a), (a >>>= 1), (c <<= 1);
              } while (--b > 0);
              return c >>> 1;
            }
            function j(a) {
              16 === a.bi_valid
                ? (f(a, a.bi_buf), (a.bi_buf = 0), (a.bi_valid = 0))
                : a.bi_valid >= 8 &&
                  ((a.pending_buf[a.pending++] = 255 & a.bi_buf),
                  (a.bi_buf >>= 8),
                  (a.bi_valid -= 8));
            }
            function k(a, b) {
              var c,
                d,
                e,
                f,
                g,
                h,
                i = b.dyn_tree,
                j = b.max_code,
                k = b.stat_desc.static_tree,
                l = b.stat_desc.has_stree,
                m = b.stat_desc.extra_bits,
                n = b.stat_desc.extra_base,
                o = b.stat_desc.max_length,
                p = 0;
              for (f = 0; S >= f; f++) a.bl_count[f] = 0;
              for (
                i[2 * a.heap[a.heap_max] + 1] = 0, c = a.heap_max + 1;
                R > c;
                c++
              )
                (d = a.heap[c]),
                  (f = i[2 * i[2 * d + 1] + 1] + 1),
                  f > o && ((f = o), p++),
                  (i[2 * d + 1] = f),
                  d > j ||
                    (a.bl_count[f]++,
                    (g = 0),
                    d >= n && (g = m[d - n]),
                    (h = i[2 * d]),
                    (a.opt_len += h * (f + g)),
                    l && (a.static_len += h * (k[2 * d + 1] + g)));
              if (0 !== p) {
                do {
                  for (f = o - 1; 0 === a.bl_count[f]; ) f--;
                  a.bl_count[f]--,
                    (a.bl_count[f + 1] += 2),
                    a.bl_count[o]--,
                    (p -= 2);
                } while (p > 0);
                for (f = o; 0 !== f; f--)
                  for (d = a.bl_count[f]; 0 !== d; )
                    (e = a.heap[--c]) > j ||
                      (i[2 * e + 1] !== f &&
                        ((a.opt_len += (f - i[2 * e + 1]) * i[2 * e]),
                        (i[2 * e + 1] = f)),
                      d--);
              }
            }
            function l(a, b, c) {
              var d,
                e,
                f = new Array(S + 1),
                g = 0;
              for (d = 1; S >= d; d++) f[d] = g = (g + c[d - 1]) << 1;
              for (e = 0; b >= e; e++) {
                var h = a[2 * e + 1];
                0 !== h && (a[2 * e] = i(f[h]++, h));
              }
            }
            function m() {
              var a,
                b,
                c,
                d,
                e,
                f = new Array(S + 1);
              for (c = 0, d = 0; M - 1 > d; d++)
                for (fa[d] = c, a = 0; a < 1 << Z[d]; a++) ea[c++] = d;
              for (ea[c - 1] = d, e = 0, d = 0; 16 > d; d++)
                for (ga[d] = e, a = 0; a < 1 << $[d]; a++) da[e++] = d;
              for (e >>= 7; P > d; d++)
                for (ga[d] = e << 7, a = 0; a < 1 << ($[d] - 7); a++)
                  da[256 + e++] = d;
              for (b = 0; S >= b; b++) f[b] = 0;
              for (a = 0; 143 >= a; ) (ba[2 * a + 1] = 8), a++, f[8]++;
              for (; 255 >= a; ) (ba[2 * a + 1] = 9), a++, f[9]++;
              for (; 279 >= a; ) (ba[2 * a + 1] = 7), a++, f[7]++;
              for (; 287 >= a; ) (ba[2 * a + 1] = 8), a++, f[8]++;
              for (l(ba, O + 1, f), a = 0; P > a; a++)
                (ca[2 * a + 1] = 5), (ca[2 * a] = i(a, 5));
              (ha = new ka(ba, Z, N + 1, O, S)),
                (ia = new ka(ca, $, 0, P, S)),
                (ja = new ka(new Array(0), _, 0, Q, U));
            }
            function n(a) {
              var b;
              for (b = 0; O > b; b++) a.dyn_ltree[2 * b] = 0;
              for (b = 0; P > b; b++) a.dyn_dtree[2 * b] = 0;
              for (b = 0; Q > b; b++) a.bl_tree[2 * b] = 0;
              (a.dyn_ltree[2 * V] = 1),
                (a.opt_len = a.static_len = 0),
                (a.last_lit = a.matches = 0);
            }
            function o(a) {
              a.bi_valid > 8
                ? f(a, a.bi_buf)
                : a.bi_valid > 0 && (a.pending_buf[a.pending++] = a.bi_buf),
                (a.bi_buf = 0),
                (a.bi_valid = 0);
            }
            function p(a, b, c, d) {
              o(a),
                d && (f(a, c), f(a, ~c)),
                E.arraySet(a.pending_buf, a.window, b, c, a.pending),
                (a.pending += c);
            }
            function q(a, b, c, d) {
              var e = 2 * b,
                f = 2 * c;
              return a[e] < a[f] || (a[e] === a[f] && d[b] <= d[c]);
            }
            function r(a, b, c) {
              for (
                var d = a.heap[c], e = c << 1;
                e <= a.heap_len &&
                (e < a.heap_len &&
                  q(b, a.heap[e + 1], a.heap[e], a.depth) &&
                  e++,
                !q(b, d, a.heap[e], a.depth));

              )
                (a.heap[c] = a.heap[e]), (c = e), (e <<= 1);
              a.heap[c] = d;
            }
            function s(a, b, c) {
              var d,
                f,
                i,
                j,
                k = 0;
              if (0 !== a.last_lit)
                do {
                  (d =
                    (a.pending_buf[a.d_buf + 2 * k] << 8) |
                    a.pending_buf[a.d_buf + 2 * k + 1]),
                    (f = a.pending_buf[a.l_buf + k]),
                    k++,
                    0 === d
                      ? h(a, f, b)
                      : ((i = ea[f]),
                        h(a, i + N + 1, b),
                        (j = Z[i]),
                        0 !== j && ((f -= fa[i]), g(a, f, j)),
                        d--,
                        (i = e(d)),
                        h(a, i, c),
                        0 !== (j = $[i]) && ((d -= ga[i]), g(a, d, j)));
                } while (k < a.last_lit);
              h(a, V, b);
            }
            function t(a, b) {
              var c,
                d,
                e,
                f = b.dyn_tree,
                g = b.stat_desc.static_tree,
                h = b.stat_desc.has_stree,
                i = b.stat_desc.elems,
                j = -1;
              for (a.heap_len = 0, a.heap_max = R, c = 0; i > c; c++)
                0 !== f[2 * c]
                  ? ((a.heap[++a.heap_len] = j = c), (a.depth[c] = 0))
                  : (f[2 * c + 1] = 0);
              for (; a.heap_len < 2; )
                (e = a.heap[++a.heap_len] = 2 > j ? ++j : 0),
                  (f[2 * e] = 1),
                  (a.depth[e] = 0),
                  a.opt_len--,
                  h && (a.static_len -= g[2 * e + 1]);
              for (b.max_code = j, c = a.heap_len >> 1; c >= 1; c--) r(a, f, c);
              e = i;
              do {
                (c = a.heap[1]),
                  (a.heap[1] = a.heap[a.heap_len--]),
                  r(a, f, 1),
                  (d = a.heap[1]),
                  (a.heap[--a.heap_max] = c),
                  (a.heap[--a.heap_max] = d),
                  (f[2 * e] = f[2 * c] + f[2 * d]),
                  (a.depth[e] =
                    (a.depth[c] >= a.depth[d] ? a.depth[c] : a.depth[d]) + 1),
                  (f[2 * c + 1] = f[2 * d + 1] = e),
                  (a.heap[1] = e++),
                  r(a, f, 1);
              } while (a.heap_len >= 2);
              (a.heap[--a.heap_max] = a.heap[1]), k(a, b), l(f, j, a.bl_count);
            }
            function u(a, b, c) {
              var d,
                e,
                f = -1,
                g = b[1],
                h = 0,
                i = 7,
                j = 4;
              for (
                0 === g && ((i = 138), (j = 3)),
                  b[2 * (c + 1) + 1] = 65535,
                  d = 0;
                c >= d;
                d++
              )
                (e = g),
                  (g = b[2 * (d + 1) + 1]),
                  (++h < i && e === g) ||
                    (j > h
                      ? (a.bl_tree[2 * e] += h)
                      : 0 !== e
                      ? (e !== f && a.bl_tree[2 * e]++, a.bl_tree[2 * W]++)
                      : 10 >= h
                      ? a.bl_tree[2 * X]++
                      : a.bl_tree[2 * Y]++,
                    (h = 0),
                    (f = e),
                    0 === g
                      ? ((i = 138), (j = 3))
                      : e === g
                      ? ((i = 6), (j = 3))
                      : ((i = 7), (j = 4)));
            }
            function v(a, b, c) {
              var d,
                e,
                f = -1,
                i = b[1],
                j = 0,
                k = 7,
                l = 4;
              for (0 === i && ((k = 138), (l = 3)), d = 0; c >= d; d++)
                if (
                  ((e = i), (i = b[2 * (d + 1) + 1]), !(++j < k && e === i))
                ) {
                  if (l > j)
                    do {
                      h(a, e, a.bl_tree);
                    } while (0 != --j);
                  else
                    0 !== e
                      ? (e !== f && (h(a, e, a.bl_tree), j--),
                        h(a, W, a.bl_tree),
                        g(a, j - 3, 2))
                      : 10 >= j
                      ? (h(a, X, a.bl_tree), g(a, j - 3, 3))
                      : (h(a, Y, a.bl_tree), g(a, j - 11, 7));
                  (j = 0),
                    (f = e),
                    0 === i
                      ? ((k = 138), (l = 3))
                      : e === i
                      ? ((k = 6), (l = 3))
                      : ((k = 7), (l = 4));
                }
            }
            function w(a) {
              var b;
              for (
                u(a, a.dyn_ltree, a.l_desc.max_code),
                  u(a, a.dyn_dtree, a.d_desc.max_code),
                  t(a, a.bl_desc),
                  b = Q - 1;
                b >= 3 && 0 === a.bl_tree[2 * aa[b] + 1];
                b--
              );
              return (a.opt_len += 3 * (b + 1) + 5 + 5 + 4), b;
            }
            function x(a, b, c, d) {
              var e;
              for (
                g(a, b - 257, 5), g(a, c - 1, 5), g(a, d - 4, 4), e = 0;
                d > e;
                e++
              )
                g(a, a.bl_tree[2 * aa[e] + 1], 3);
              v(a, a.dyn_ltree, b - 1), v(a, a.dyn_dtree, c - 1);
            }
            function y(a) {
              var b,
                c = 4093624447;
              for (b = 0; 31 >= b; b++, c >>>= 1)
                if (1 & c && 0 !== a.dyn_ltree[2 * b]) return G;
              if (
                0 !== a.dyn_ltree[18] ||
                0 !== a.dyn_ltree[20] ||
                0 !== a.dyn_ltree[26]
              )
                return H;
              for (b = 32; N > b; b++) if (0 !== a.dyn_ltree[2 * b]) return H;
              return G;
            }
            function z(a) {
              ma || (m(), (ma = !0)),
                (a.l_desc = new la(a.dyn_ltree, ha)),
                (a.d_desc = new la(a.dyn_dtree, ia)),
                (a.bl_desc = new la(a.bl_tree, ja)),
                (a.bi_buf = 0),
                (a.bi_valid = 0),
                n(a);
            }
            function A(a, b, c, d) {
              g(a, (J << 1) + (d ? 1 : 0), 3), p(a, b, c, !0);
            }
            function B(a) {
              g(a, K << 1, 3), h(a, V, ba), j(a);
            }
            function C(a, b, c, d) {
              var e,
                f,
                h = 0;
              a.level > 0
                ? (a.strm.data_type === I && (a.strm.data_type = y(a)),
                  t(a, a.l_desc),
                  t(a, a.d_desc),
                  (h = w(a)),
                  (e = (a.opt_len + 3 + 7) >>> 3),
                  (f = (a.static_len + 3 + 7) >>> 3),
                  e >= f && (e = f))
                : (e = f = c + 5),
                e >= c + 4 && -1 !== b
                  ? A(a, b, c, d)
                  : a.strategy === F || f === e
                  ? (g(a, (K << 1) + (d ? 1 : 0), 3), s(a, ba, ca))
                  : (g(a, (L << 1) + (d ? 1 : 0), 3),
                    x(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, h + 1),
                    s(a, a.dyn_ltree, a.dyn_dtree)),
                n(a),
                d && o(a);
            }
            function D(a, b, c) {
              return (
                (a.pending_buf[a.d_buf + 2 * a.last_lit] = (b >>> 8) & 255),
                (a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = 255 & b),
                (a.pending_buf[a.l_buf + a.last_lit] = 255 & c),
                a.last_lit++,
                0 === b
                  ? a.dyn_ltree[2 * c]++
                  : (a.matches++,
                    b--,
                    a.dyn_ltree[2 * (ea[c] + N + 1)]++,
                    a.dyn_dtree[2 * e(b)]++),
                a.last_lit === a.lit_bufsize - 1
              );
            }
            var E = a("../utils/common"),
              F = 4,
              G = 0,
              H = 1,
              I = 2,
              J = 0,
              K = 1,
              L = 2,
              M = 29,
              N = 256,
              O = N + 1 + M,
              P = 30,
              Q = 19,
              R = 2 * O + 1,
              S = 15,
              T = 16,
              U = 7,
              V = 256,
              W = 16,
              X = 17,
              Y = 18,
              Z = [
                0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                4, 4, 4, 5, 5, 5, 5, 0,
              ],
              $ = [
                0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                9, 10, 10, 11, 11, 12, 12, 13, 13,
              ],
              _ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
              aa = [
                16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                15,
              ],
              ba = new Array(2 * (O + 2));
            d(ba);
            var ca = new Array(2 * P);
            d(ca);
            var da = new Array(512);
            d(da);
            var ea = new Array(256);
            d(ea);
            var fa = new Array(M);
            d(fa);
            var ga = new Array(P);
            d(ga);
            var ha,
              ia,
              ja,
              ka = function (a, b, c, d, e) {
                (this.static_tree = a),
                  (this.extra_bits = b),
                  (this.extra_base = c),
                  (this.elems = d),
                  (this.max_length = e),
                  (this.has_stree = a && a.length);
              },
              la = function (a, b) {
                (this.dyn_tree = a), (this.max_code = 0), (this.stat_desc = b);
              },
              ma = !1;
            (c._tr_init = z),
              (c._tr_stored_block = A),
              (c._tr_flush_block = C),
              (c._tr_tally = D),
              (c._tr_align = B);
          },
          { "../utils/common": 27 },
        ],
        39: [
          function (a, b) {
            "use strict";
            function c() {
              (this.input = null),
                (this.next_in = 0),
                (this.avail_in = 0),
                (this.total_in = 0),
                (this.output = null),
                (this.next_out = 0),
                (this.avail_out = 0),
                (this.total_out = 0),
                (this.msg = ""),
                (this.state = null),
                (this.data_type = 2),
                (this.adler = 0);
            }
            b.exports = c;
          },
          {},
        ],
      },
      {},
      [9]
    )(9);
  }),
  (jt.EmbeddedFiles = {
    get: function (a) {
      var b = this.compressedContent[a];
      if (void 0 !== b)
        return {
          name: a,
          content: jt.Util.uncompressStringBase64ToInt8BitArray(b),
        };
      var c = this.diffsContent[a];
      if (void 0 !== c) {
        var d = this.get(c.based);
        if (void 0 !== d) {
          var e = d.content;
          for (var f in c.diffs)
            for (var g = c.diffs[f], h = 0; h < g.length; ++h)
              e[(0 | f) + h] = g[h];
          return { name: a, content: e };
        }
      }
    },
    embedFileCompressedContent: function (a, b) {
      this.compressedContent[a] = b;
    },
    embedFileDiff: function (a, b) {
      this.diffsContent[a] = b;
    },
    compressedContent: {},
    diffsContent: {},
  }),
  (jt.MultiDownloader = function (a, b, c, d) {
    "use strict";
    function e(a) {
      if (a) {
        var b = a.url.trim().split(/\s*\|\s*/);
        (a.filesToLoad = b.length), (a.filesContent = new Array(a.filesToLoad));
        for (var c = 0; c < b.length; ++c) {
          var d = b[c];
          "@" === d[0] ? f(a, c, d) : g(a, c, d);
        }
      }
    }
    function f(a, b, c) {
      jt.Util.log("Reading Embedded file: " + c);
      var d = jt.EmbeddedFiles.get(c.substr(1));
      void 0 !== d ? h(a, b, d.content) : i(a, "Embedded file not found!");
    }
    function g(a, b, c, e) {
      var f = k(c) ? l(c) : c,
        g = new XMLHttpRequest();
      g.open("GET", f, !0),
        (g.responseType = "arraybuffer"),
        (g.timeout = void 0 !== d ? d : s),
        (g.onload = function () {
          (200 !== g.status && 0 !== g.status) || !g.response
            ? g.onerror()
            : h(a, b, new Uint8Array(g.response));
        }),
        (g.onerror = g.ontimeout =
          function () {
            i(a, g.status + " " + g.statusText);
          }),
        jt.Util.log("Reading file from: " + c),
        g.send();
    }
    function h(a, b, c) {
      (a.filesContent[b] = c),
        --a.filesToLoad > 0 ||
          ((a.success = !0),
          (a.content = jt.Util.arraysConcatAll(a.filesContent)),
          a.onSuccess && a.onSuccess(a),
          j());
    }
    function i(a, b) {
      (a.success = !1), (a.error = b);
      var d = "Could not load file: " + a.url + "\nError: " + b;
      a.onError ? (jt.Util.error(d), a.onError(a)) : c || jt.Util.message(d),
        j();
    }
    function j() {
      if (!q) {
        for (var d = 0; d < a.length; d++)
          if (a[d] && void 0 === a[d].success) return;
        for (q = !0, n(), d = 0; d < a.length; d++)
          if (a[d] && !a[d].success) return void (c && c(a));
        b && b(a);
      }
    }
    function k(a) {
      return a && (0 === a.indexOf("http:") || 0 === a.indexOf("https:"));
    }
    function l(a) {
      return Javatari.PROXY_SERVER_ADDRESS
        ? "https://" +
            Javatari.PROXY_SERVER_ADDRESS +
            "/proxy-remote-download?url=" +
            a
        : a;
    }
    function m() {
      Javatari.room.isLoading ||
        (p = window.setTimeout(function () {
          (p = null), (o = !0), Javatari.room.setLoading(!0);
        }, r));
    }
    function n() {
      p && (window.clearTimeout(p), (p = null)),
        o && ((o = !1), Javatari.room.setLoading(!1));
    }
    this.start = function () {
      if (a && 0 !== a.length) {
        m();
        for (var b = 0; b < a.length; b++) e(a[b]);
      }
      j();
    };
    var o = !1,
      p = null,
      q = !1,
      r = 1e3,
      s = 15e3;
  }),
  (jt.MultiFileReader = function (a, b, c, d) {
    "use strict";
    function e(a) {
      if (a) {
        jt.Util.log("Reading file: " + a.name);
        var b = new FileReader();
        (b.onload = function (b) {
          (a.success = !0), (a.content = new Uint8Array(b.target.result)), f();
        }),
          (b.onerror = function (b) {
            (a.success = !1), (a.error = b.target.error.name), f();
          }),
          b.readAsArrayBuffer(a);
      }
    }
    function f() {
      if (!g) {
        for (var d = 0; d < a.length; d++)
          if (a[d] && void 0 === a[d].success) return;
        for (g = !0, d = 0; d < a.length; d++)
          if (a[d] && !a[d].success) return c && c(a, a[d].error), a;
        b && b(a);
      }
    }
    this.start = function () {
      if (a && 0 !== a.length) {
        d || (d = h);
        for (var g = 0, i = 0; i < a.length; i++) g += a[i].size;
        if (g > d) {
          var j =
            "Maximum total size limit exceeded: " + ((d / 1024) | 0) + "KB";
          return void (c && c(a, j, !0));
        }
        for (i = 0; i < a.length; i++) e(a[i]);
        f();
      } else b(a);
    };
    var g = !1,
      h = 5898240;
  }),
  (jt.VideoStandard = {
    NTSC: {
      name: "NTSC",
      desc: "NTSC 60Hz",
      totalWidth: 228,
      totalHeight: 262,
      defaultOriginYPct: 10.8,
      defaultHeightPct: 85.2,
      targetFPS: 60,
      pulldowns: {
        60: {
          standard: "NTSC",
          frequency: 60,
          divider: 1,
          cadence: [1],
          steps: 1,
        },
        120: {
          standard: "NTSC",
          frequency: 120,
          divider: 2,
          cadence: [1],
          steps: 1,
        },
        "120s": {
          standard: "NTSC",
          frequency: 120,
          divider: 1,
          cadence: [0, 1],
          steps: 2,
        },
        50: {
          standard: "NTSC",
          frequency: 50,
          divider: 1,
          cadence: [1, 1, 1, 1, 2],
          steps: 5,
        },
        100: {
          standard: "NTSC",
          frequency: 100,
          divider: 2,
          cadence: [1, 1, 1, 1, 2],
          steps: 5,
        },
        "100s": {
          standard: "NTSC",
          frequency: 100,
          divider: 1,
          cadence: [0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
          steps: 10,
        },
        TIMER: {
          standard: "NTSC",
          frequency: 62.5,
          divider: 1,
          cadence: [1],
          steps: 1,
        },
      },
    },
    PAL: {
      name: "PAL",
      desc: "PAL 50Hz",
      totalWidth: 228,
      totalHeight: 312,
      defaultOriginYPct: 13.5,
      defaultHeightPct: 77.3,
      targetFPS: 50,
      pulldowns: {
        50: {
          standard: "PAL",
          frequency: 50,
          divider: 1,
          cadence: [1],
          steps: 1,
        },
        100: {
          standard: "PAL",
          frequency: 100,
          divider: 2,
          cadence: [1],
          steps: 1,
        },
        "100s": {
          standard: "PAL",
          frequency: 100,
          divider: 1,
          cadence: [0, 1],
          steps: 2,
        },
        60: {
          standard: "PAL",
          frequency: 60,
          divider: 1,
          cadence: [0, 1, 1, 1, 1, 1],
          steps: 6,
        },
        120: {
          standard: "PAL",
          frequency: 120,
          divider: 2,
          cadence: [0, 1, 1, 1, 1, 1],
          steps: 6,
        },
        "120s": {
          standard: "PAL",
          frequency: 120,
          divider: 1,
          cadence: [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
          steps: 12,
        },
        TIMER: {
          standard: "PAL",
          frequency: 50,
          divider: 1,
          cadence: [1],
          steps: 1,
        },
      },
    },
  }),
  (jt.VideoSignal = function () {
    "use strict";
    (this.connectMonitor = function (a) {
      this.monitor = a;
    }),
      (this.setVideoStandard = function (a) {
        this.monitor && this.monitor.setVideoStandard(a);
      }),
      (this.nextLine = function (a, b) {
        return this.monitor.nextLine(a, b);
      }),
      (this.finishFrame = function () {
        this.monitor.refresh();
      }),
      (this.signalOff = function () {
        this.monitor && this.monitor.videoSignalOff();
      }),
      (this.showOSD = function (a, b, c) {
        this.monitor && this.monitor.showOSD(a, b, c);
      }),
      (this.toggleShowInfo = function () {
        this.monitor.toggleShowInfo();
      }),
      (this.monitor = null);
  }),
  (jt.AudioSignal = function (a, b, c, d) {
    "use strict";
    function e() {
      if (n > 0) {
        if (p <= 0) return void (n = 0);
        g(), --n, --p;
      }
    }
    function f() {
      var a =
        (s * Javatari.AUDIO_SIGNAL_BUFFER_RATIO +
          k * Javatari.AUDIO_SIGNAL_ADD_FRAMES) |
        0;
      (r.length = a),
        a > o && jt.Util.arrayFill(r, 0, o, a),
        (o = a),
        (t.bufferSize = o),
        (q = o - 2),
        j.flush();
    }
    function g() {
      (r[l] = b.nextSample() * d), ++l >= o && (l = 0);
    }
    function h() {
      (r[l] = 0), ++l >= o && (l = 0);
    }
    function i(a, b) {
      if (b) for (var c = a; c > 0; c -= 1) h();
      else for (var d = a; d > 0; d -= 1) g();
      p -= a;
    }
    var j = this;
    (this.flush = function () {
      (l = 0), (m = 0), (p = q);
    }),
      (this.setFps = function (a) {
        (k = (c / a) | 0), f();
      }),
      (this.audioFinishFrame = function () {
        if (n > 0) for (; n > 0; ) e();
        n = k;
      }),
      (this.retrieveSamples = function (a, b) {
        var c = q - p,
          d = a - c;
        d > 0 && (d > p && (d = p), i(d, b)), (t.start = m);
        var e = c + d;
        return (p += e), (m += e), m >= o && (m -= o), t;
      }),
      (this.audioClockPulse = e),
      (this.getSampleRate = function () {
        return c;
      }),
      (this.toString = function () {
        return "AudioSignal " + a;
      }),
      (this.setAudioMonitorBufferSize = function (a) {
        (s = a), f();
      }),
      (this.name = a);
    var k,
      l = 0,
      m = 0,
      n = 0,
      o = 0,
      p = 0,
      q = 0,
      r = jt.Util.arrayFill(new Array(o), 0),
      s = 0,
      t = { buffer: r, bufferSize: o, start: 0 };
  }),
  (jt.M6502 = function () {
    "use strict";
    function a() {
      return [
        ja,
        function () {
          Ta("KIL/HLT/JAM");
        },
        function () {
          X--;
        },
      ];
    }
    function b(a) {
      return a(function () {
        Ta("NOP/DOP");
      });
    }
    function c(a) {
      return a(function () {
        if (T) {
          var a = Z,
            b = (15 & O) + (15 & a) + W;
          b > 9 && (b += 6);
          var c = ((O >> 4) + (a >> 4) + (b > 15)) << 4;
          Ka((O + a + W) & 255),
            La(c),
            Ma((O ^ c) & ~(O ^ a) & 128),
            c > 159 && (c += 96),
            Na(c > 255),
            (O = 255 & (c | (15 & b)));
        } else {
          var d = O + Z + W;
          Na(d > 255), Ma((O ^ d) & (Z ^ d) & 128), (O = 255 & d), Ka(O), La(O);
        }
      });
    }
    function d(a) {
      return a(function () {
        (O &= Z), Ka(O), La(O);
      });
    }
    function e(a) {
      return a(function () {
        var a = Z;
        Ka(O & a), Ma(64 & a), La(a);
      });
    }
    function f(a) {
      return a(function () {
        var a = (O - Z) & 255;
        Na(O >= Z), Ka(a), La(a);
      });
    }
    function g(a) {
      return a(function () {
        var a = (P - Z) & 255;
        Na(P >= Z), Ka(a), La(a);
      });
    }
    function h(a) {
      return a(function () {
        var a = (Q - Z) & 255;
        Na(Q >= Z), Ka(a), La(a);
      });
    }
    function i(a) {
      return a(function () {
        (O ^= Z), Ka(O), La(O);
      });
    }
    function j(a) {
      return a(function () {
        (O = Z), Ka(O), La(O);
      });
    }
    function k(a) {
      return a(function () {
        (P = Z), Ka(P), La(P);
      });
    }
    function l(a) {
      return a(function () {
        (Q = Z), Ka(Q), La(Q);
      });
    }
    function m(a) {
      return a(function () {
        (O |= Z), Ka(O), La(O);
      });
    }
    function n(a) {
      return a(function () {
        if (T) {
          var a = Z,
            b = (15 & O) - (15 & a) - (1 - W),
            c = (O >> 4) - (a >> 4) - (b < 0);
          b < 0 && (b -= 6), c < 0 && (c -= 6);
          var d = O - a - (1 - W);
          Na(256 & ~d),
            Ma((O ^ a) & (O ^ d) & 128),
            Ka(255 & d),
            La(d),
            (O = 255 & ((c << 4) | (15 & b)));
        } else (a = 255 & ~Z), (d = O + a + W), Na(d > 255), Ma((O ^ d) & (a ^ d) & 128), (O = 255 & d), Ka(O), La(O);
      });
    }
    function o(a) {
      return a(function () {
        Ta("ANC"), (O &= Z), Ka(O), (R = W = 128 & O ? 1 : 0);
      });
    }
    function p(a) {
      return a(function () {
        Ta("LAX");
        var a = Z;
        (O = a), (P = a), Ka(a), La(a);
      });
    }
    function q(a) {
      return a(function () {
        Z = O;
      });
    }
    function r(a) {
      return a(function () {
        Z = P;
      });
    }
    function s(a) {
      return a(function () {
        Z = Q;
      });
    }
    function t(a) {
      return a(function () {
        Ta("SAX"), (Z = O & P);
      });
    }
    function u(a) {
      return a(function () {
        Ta("SHA"), (Z = O & P & (1 + (_ >>> 8)) & 255);
      });
    }
    function v(a) {
      return a(function () {
        Na(Z > 127);
        var a = (Z << 1) & 255;
        (Z = a), Ka(a), La(a);
      });
    }
    function w(a) {
      return a(function () {
        var a = (Z - 1) & 255;
        (Z = a), Ka(a), La(a);
      });
    }
    function x(a) {
      return a(function () {
        var a = (Z + 1) & 255;
        (Z = a), Ka(a), La(a);
      });
    }
    function y(a) {
      return a(function () {
        (W = 1 & Z), (Z >>>= 1), Ka(Z), (R = 0);
      });
    }
    function z(a) {
      return a(function () {
        var a = Z > 127,
          b = 255 & ((Z << 1) | W);
        (Z = b), Na(a), Ka(b), La(b);
      });
    }
    function A(a) {
      return a(function () {
        var a = 1 & Z,
          b = (Z >>> 1) | (W << 7);
        (Z = b), Na(a), Ka(b), La(b);
      });
    }
    function B(a) {
      return a(function () {
        Ta("DCP");
        var a = (Z - 1) & 255;
        (Z = a), (a = O - a), Na(a >= 0), Ka(a), La(a);
      });
    }
    function C(a) {
      return a(function () {
        if ((Ta("ISB"), (Z = (Z + 1) & 255), T)) {
          var a = Z,
            b = (15 & O) - (15 & a) - (1 - W),
            c = (O >> 4) - (a >> 4) - (b < 0);
          b < 0 && (b -= 6), c < 0 && (c -= 6);
          var d = O - a - (1 - W);
          Na(256 & ~d),
            Ma((O ^ a) & (O ^ d) & 128),
            Ka(255 & d),
            La(d),
            (O = 255 & ((c << 4) | (15 & b)));
        } else (a = 255 & ~Z), (d = O + a + W), Na(d > 255), Ma((O ^ d) & (a ^ d) & 128), (O = 255 & d), Ka(O), La(O);
      });
    }
    function D(a) {
      return a(function () {
        Ta("RLA");
        var a = Z,
          b = W;
        Na(128 & a),
          (a = 255 & ((a << 1) | b)),
          (Z = a),
          (O &= a),
          Ka(a),
          La(a);
      });
    }
    function E(a) {
      return a(function () {
        Ta("RRA");
        var a = Z,
          b = W ? 128 : 0;
        if ((Na(1 & a), (a = (a >>> 1) | b), (Z = a), T)) {
          var c = Z,
            d = (15 & O) + (15 & c) + W;
          d > 9 && (d += 6);
          var e = ((O >> 4) + (c >> 4) + (d > 15)) << 4;
          Ka((O + c + W) & 255),
            La(e),
            Ma((O ^ e) & ~(O ^ c) & 128),
            e > 159 && (e += 96),
            Na(e > 255),
            (O = 255 & (e | (15 & d)));
        } else {
          var f = O + Z + W;
          Na(f > 255), Ma((O ^ f) & (Z ^ f) & 128), (O = 255 & f), Ka(O), La(O);
        }
      });
    }
    function F(a) {
      return a(function () {
        Ta("SLO");
        var a = Z;
        Na(128 & a),
          (a = (a << 1) & 255),
          (Z = a),
          (a |= O),
          (O = a),
          Ka(a),
          La(a);
      });
    }
    function G(a) {
      return a(function () {
        Ta("SRE");
        var a = Z;
        Na(1 & a),
          (a >>>= 1),
          (Z = a),
          (a = 255 & (O ^ a)),
          (O = a),
          Ka(a),
          La(a);
      });
    }
    function H(a, b) {
      var c;
      return (
        (c =
          a === ha
            ? function () {
                return V === b;
              }
            : a === ga
            ? function () {
                return R === b;
              }
            : a === ia
            ? function () {
                return W === b;
              }
            : function () {
                return S === b;
              }),
        [
          ja,
          na,
          function () {
            c() ? (ma(), Ia()) : ka();
          },
          function () {
            da ? (ma(), Ja()) : ka();
          },
          ka,
        ]
      );
    }
    var I = this;
    (this.powerOn = function () {
      this.reset();
    }),
      (this.powerOff = function () {}),
      (this.clockPulse = function () {
        L && (X++, K[X]());
      }),
      (this.connectBus = function (a) {
        J = a;
      }),
      (this.setRDY = function (a) {
        L = a;
      }),
      (this.reset = function () {
        (U = 1),
          (X = -1),
          (Y = -1),
          (K = la),
          (M = J.read(ea) | (J.read(ea + 1) << 8)),
          this.setRDY(!0);
      });
    var J,
      K,
      L = !1,
      M = 0,
      N = 0,
      O = 0,
      P = 0,
      Q = 0,
      R = 0,
      S = 0,
      T = 0,
      U = 0,
      V = 0,
      W = 0,
      X = -1,
      Y = -1,
      Z = 0,
      $ = 0,
      _ = 0,
      aa = !1,
      ba = 0,
      ca = 0,
      da = 0,
      ea = 65532,
      fa = 65534,
      ga = 7,
      ha = 1,
      ia = 0;
    (this.debug = !1), (this.trace = !1);
    var ja = function () {
        (Y = J.read(M)), (K = nb[Y]), (X = 0), M++;
      },
      ka = ja,
      la = [ja],
      ma = function () {
        J.read(M);
      },
      na = function () {
        (ca = J.read(M)), M++;
      },
      oa = function () {
        ($ = J.read(M)), M++;
      },
      pa = function () {
        ($ |= J.read(M) << 8), M++;
      },
      qa = function () {
        $ = J.read(_);
      },
      ra = function () {
        $ |= J.read(_) << 8;
      },
      sa = function () {
        (_ = J.read(M)), M++;
      },
      ta = function () {
        (_ |= J.read(M) << 8), M++;
      },
      ua = function () {
        _ = J.read(ba);
      },
      va = function () {
        _ |= J.read(ba) << 8;
      },
      wa = function () {
        var a = (255 & _) + P;
        (aa = a > 255), (_ = (65280 & _) | (255 & a));
      },
      xa = function () {
        var a = (255 & _) + Q;
        (aa = a > 255), (_ = (65280 & _) | (255 & a));
      },
      ya = function () {
        var a = 1 + (255 & _);
        (aa = a > 255), (_ = (65280 & _) | (255 & a));
      },
      za = function () {
        aa && (_ = (_ + 256) & 65535);
      },
      Aa = function () {
        (ba = J.read(M)), M++;
      },
      Ba = function () {
        (ba |= J.read(M) << 8), M++;
      },
      Ca = function () {
        ba = (65280 & ba) | (255 & (1 + (255 & ba)));
      },
      Da = function () {
        (Z = J.read(M)), M++;
      },
      Ea = function () {
        Z = J.read($);
      },
      Fa = function () {
        Z = J.read(_);
      },
      Ga = function () {
        J.write($, Z);
      },
      Ha = function () {
        J.write(_, Z);
      },
      Ia = function () {
        var a = 255 & M,
          b = (a + ca) & 255;
        (da = ca > 127 ? (b > a ? -256 : 0) : b < a ? 256 : 0),
          (M = (65280 & M) | b);
      },
      Ja = function () {
        M = (M + da) & 65535;
      },
      Ka = function (a) {
        V = 0 === a ? 1 : 0;
      },
      La = function (a) {
        R = 128 & a ? 1 : 0;
      },
      Ma = function (a) {
        S = a ? 1 : 0;
      },
      Na = function (a) {
        W = a ? 1 : 0;
      },
      Oa = function () {
        return (N = (N + 1) & 255), J.read(256 + N);
      },
      Pa = function () {
        return J.read(256 + N);
      },
      Qa = function (a) {
        J.write(256 + N, a), (N = (N - 1) & 255);
      },
      Ra = function () {
        return (R << 7) | (S << 6) | 48 | (T << 3) | (U << 2) | (V << 1) | W;
      },
      Sa = function (a) {
        (R = a >>> 7),
          (S = (a >>> 6) & 1),
          (T = (a >>> 3) & 1),
          (U = (a >>> 2) & 1),
          (V = (a >>> 1) & 1),
          (W = 1 & a);
      },
      Ta = function (a) {
        I.debug && I.breakpoint("Illegal Opcode: " + a);
      },
      Ua = function (a) {
        return [
          ja,
          ma,
          function () {
            a(), ka();
          },
        ];
      },
      Va = function (a) {
        return [
          ja,
          Da,
          function () {
            a(), ka();
          },
        ];
      },
      Wa = function (a) {
        return [
          ja,
          oa,
          Ea,
          function () {
            a(), ka();
          },
        ];
      },
      Xa = function (a) {
        return [
          ja,
          oa,
          pa,
          Ea,
          function () {
            a(), ka();
          },
        ];
      },
      Ya = function (a) {
        return [
          ja,
          sa,
          Fa,
          function () {
            wa(), qa();
          },
          function () {
            ya(), ra();
          },
          Ea,
          function () {
            a(), ka();
          },
        ];
      },
      Za = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            ta,
            function () {
              b(), Fa(), za();
            },
            function () {
              aa ? Fa() : (a(), ka());
            },
            function () {
              a(), ka();
            },
          ];
        };
      },
      $a = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            Fa,
            function () {
              b(), Fa();
            },
            function () {
              a(), ka();
            },
          ];
        };
      },
      _a = function (a) {
        return [
          ja,
          Aa,
          ua,
          function () {
            Ca(), va();
          },
          function () {
            xa(), Fa(), za();
          },
          function () {
            aa ? Fa() : (a(), ka());
          },
          function () {
            a(), ka();
          },
        ];
      },
      ab = function (a) {
        return [
          ja,
          oa,
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      bb = function (a) {
        return [
          ja,
          oa,
          pa,
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      cb = function (a) {
        return [
          ja,
          sa,
          Fa,
          function () {
            wa(), qa();
          },
          function () {
            ya(), ra();
          },
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      db = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            ta,
            function () {
              b(), Fa(), za();
            },
            function () {
              a(), Ha();
            },
            ka,
          ];
        };
      },
      eb = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            Fa,
            function () {
              b(), a(), Ha();
            },
            ka,
          ];
        };
      },
      fb = function (a) {
        return [
          ja,
          Aa,
          ua,
          function () {
            Ca(), va();
          },
          function () {
            xa(), Fa(), za();
          },
          function () {
            a(), Ha();
          },
          ka,
        ];
      },
      gb = function (a) {
        return [
          ja,
          oa,
          Ea,
          Ga,
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      hb = function (a) {
        return [
          ja,
          oa,
          pa,
          Ea,
          Ga,
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      ib = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            Fa,
            function () {
              b(), Fa();
            },
            Ha,
            function () {
              a(), Ha();
            },
            ka,
          ];
        };
      },
      jb = function (a) {
        var b = 0 === a ? wa : xa;
        return function (a) {
          return [
            ja,
            sa,
            ta,
            function () {
              b(), Fa(), za();
            },
            Fa,
            Ha,
            function () {
              a(), Ha();
            },
            ka,
          ];
        };
      },
      kb = function (a) {
        return [
          ja,
          sa,
          Fa,
          function () {
            wa(), qa();
          },
          function () {
            ya(), ra();
          },
          Ea,
          Ga,
          function () {
            a(), Ga();
          },
          ka,
        ];
      },
      lb = function (a) {
        return [
          ja,
          Aa,
          ua,
          function () {
            Ca(), va();
          },
          function () {
            xa(), Fa(), za();
          },
          Fa,
          Ha,
          function () {
            a(), Ha();
          },
          ka,
        ];
      },
      mb = new Array(256),
      nb = new Array(256);
    (mb[0] = "BRK"),
      (nb[0] = (function () {
        return [
          ja,
          Da,
          function () {
            I.debug && I.breakpoint("BRK " + Z), Qa((M >>> 8) & 255);
          },
          function () {
            Qa(255 & M);
          },
          function () {
            Qa(Ra());
          },
          function () {
            $ = J.read(fa);
          },
          function () {
            $ |= J.read(fa + 1) << 8;
          },
          function () {
            (M = $), ka();
          },
        ];
      })()),
      (mb[1] = "ORA"),
      (nb[1] = m(Ya)),
      (mb[2] = "uKIL"),
      (nb[2] = a()),
      (mb[3] = "uSLO"),
      (nb[3] = F(kb)),
      (mb[4] = "uNOP"),
      (nb[4] = b(Wa)),
      (mb[5] = "ORA"),
      (nb[5] = m(Wa)),
      (mb[6] = "ASL"),
      (nb[6] = v(gb)),
      (mb[7] = "uSLO"),
      (nb[7] = F(gb)),
      (mb[8] = "PHP"),
      (nb[8] = (function () {
        return [
          ja,
          ma,
          function () {
            Qa(Ra());
          },
          ka,
        ];
      })()),
      (mb[9] = "ORA"),
      (nb[9] = m(Va)),
      (mb[10] = "ASL"),
      (nb[10] = (function () {
        return Ua(function () {
          Na(O > 127), (O = (O << 1) & 255), Ka(O), La(O);
        });
      })()),
      (mb[11] = "uANC"),
      (nb[11] = o(Va)),
      (mb[12] = "uNOP"),
      (nb[12] = b(Xa)),
      (mb[13] = "ORA"),
      (nb[13] = m(Xa)),
      (mb[14] = "ASL"),
      (nb[14] = v(hb)),
      (mb[15] = "uSLO"),
      (nb[15] = F(hb)),
      (mb[16] = "BPL"),
      (nb[16] = H(ga, 0)),
      (mb[17] = "ORA"),
      (nb[17] = m(_a)),
      (mb[18] = "uKIL"),
      (nb[18] = a()),
      (mb[19] = "uSLO"),
      (nb[19] = F(lb)),
      (mb[20] = "uNOP"),
      (nb[20] = b($a(0))),
      (mb[21] = "ORA"),
      (nb[21] = m($a(0))),
      (mb[22] = "ASL"),
      (nb[22] = v(ib(0))),
      (mb[23] = "uSLO"),
      (nb[23] = F(ib(0))),
      (mb[24] = "CLC"),
      (nb[24] = (function () {
        return Ua(function () {
          W = 0;
        });
      })()),
      (mb[25] = "ORA"),
      (nb[25] = m(Za(1))),
      (mb[26] = "uNOP"),
      (nb[26] = b(Ua)),
      (mb[27] = "uSLO"),
      (nb[27] = F(jb(1))),
      (mb[28] = "uNOP"),
      (nb[28] = b(Za(0))),
      (mb[29] = "ORA"),
      (nb[29] = m(Za(0))),
      (mb[30] = "ASL"),
      (nb[30] = v(jb(0))),
      (mb[31] = "uSLO"),
      (nb[31] = F(jb(0))),
      (mb[32] = "JSR"),
      (nb[32] = (function () {
        return [
          ja,
          oa,
          Pa,
          function () {
            Qa((M >>> 8) & 255);
          },
          function () {
            Qa(255 & M);
          },
          pa,
          function () {
            (M = $), ka();
          },
        ];
      })()),
      (mb[33] = "AND"),
      (nb[33] = d(Ya)),
      (mb[34] = "uKIL"),
      (nb[34] = a()),
      (mb[35] = "uRLA"),
      (nb[35] = D(kb)),
      (mb[36] = "BIT"),
      (nb[36] = e(Wa)),
      (mb[37] = "AND"),
      (nb[37] = d(Wa)),
      (mb[38] = "ROL"),
      (nb[38] = z(gb)),
      (mb[39] = "uRLA"),
      (nb[39] = D(gb)),
      (mb[40] = "PLP"),
      (nb[40] = (function () {
        return [
          ja,
          ma,
          Pa,
          function () {
            Sa(Oa());
          },
          ka,
        ];
      })()),
      (mb[41] = "AND"),
      (nb[41] = d(Va)),
      (mb[42] = "ROL"),
      (nb[42] = (function () {
        return Ua(function () {
          var a = O > 127;
          (O = 255 & ((O << 1) | W)), Na(a), Ka(O), La(O);
        });
      })()),
      (mb[43] = "uANC"),
      (nb[43] = o(Va)),
      (mb[44] = "BIT"),
      (nb[44] = e(Xa)),
      (mb[45] = "AND"),
      (nb[45] = d(Xa)),
      (mb[46] = "ROL"),
      (nb[46] = z(hb)),
      (mb[47] = "uRLA"),
      (nb[47] = D(hb)),
      (mb[48] = "BMI"),
      (nb[48] = H(ga, 1)),
      (mb[49] = "AND"),
      (nb[49] = d(_a)),
      (mb[50] = "uKIL"),
      (nb[50] = a()),
      (mb[51] = "uRLA"),
      (nb[51] = D(lb)),
      (mb[52] = "uNOP"),
      (nb[52] = b($a(0))),
      (mb[53] = "AND"),
      (nb[53] = d($a(0))),
      (mb[54] = "ROL"),
      (nb[54] = z(ib(0))),
      (mb[55] = "uRLA"),
      (nb[55] = D(ib(0))),
      (mb[56] = "SEC"),
      (nb[56] = (function () {
        return Ua(function () {
          W = 1;
        });
      })()),
      (mb[57] = "AND"),
      (nb[57] = d(Za(1))),
      (mb[58] = "uNOP"),
      (nb[58] = b(Ua)),
      (mb[59] = "uRLA"),
      (nb[59] = D(jb(1))),
      (mb[60] = "uNOP"),
      (nb[60] = b(Za(0))),
      (mb[61] = "AND"),
      (nb[61] = d(Za(0))),
      (mb[62] = "ROL"),
      (nb[62] = z(jb(0))),
      (mb[63] = "uRLA"),
      (nb[63] = D(jb(0))),
      (mb[64] = "RTI"),
      (nb[64] = (function () {
        return [
          ja,
          ma,
          Pa,
          function () {
            Sa(Oa());
          },
          function () {
            $ = Oa();
          },
          function () {
            $ |= Oa() << 8;
          },
          function () {
            (M = $), ka();
          },
        ];
      })()),
      (mb[65] = "EOR"),
      (nb[65] = i(Ya)),
      (mb[66] = "uKIL"),
      (nb[66] = a()),
      (mb[67] = "uSRE"),
      (nb[67] = G(kb)),
      (mb[68] = "uNOP"),
      (nb[68] = b(Wa)),
      (mb[69] = "EOR"),
      (nb[69] = i(Wa)),
      (mb[70] = "LSR"),
      (nb[70] = y(gb)),
      (mb[71] = "uSRE"),
      (nb[71] = G(gb)),
      (mb[72] = "PHA"),
      (nb[72] = (function () {
        return [
          ja,
          ma,
          function () {
            Qa(O);
          },
          ka,
        ];
      })()),
      (mb[73] = "EOR"),
      (nb[73] = i(Va)),
      (mb[74] = "LSR"),
      (nb[74] = (function () {
        return Ua(function () {
          (W = 1 & O), (O >>>= 1), Ka(O), (R = 0);
        });
      })()),
      (mb[75] = "uASR"),
      (nb[75] = (function (a) {
        return a(function () {
          Ta("ASR");
          var a = O & Z;
          (W = 1 & a), (a >>>= 1), (O = a), Ka(a), (R = 0);
        });
      })(Va)),
      (mb[76] = "JMP"),
      (nb[76] = (function () {
        return [
          ja,
          oa,
          pa,
          function () {
            (M = $), ka();
          },
        ];
      })()),
      (mb[77] = "EOR"),
      (nb[77] = i(Xa)),
      (mb[78] = "LSR"),
      (nb[78] = y(hb)),
      (mb[79] = "uSRE"),
      (nb[79] = G(hb)),
      (mb[80] = "BVC"),
      (nb[80] = H(6, 0)),
      (mb[81] = "EOR"),
      (nb[81] = i(_a)),
      (mb[82] = "uKIL"),
      (nb[82] = a()),
      (mb[83] = "uSRE"),
      (nb[83] = G(lb)),
      (mb[84] = "uNOP"),
      (nb[84] = b($a(0))),
      (mb[85] = "EOR"),
      (nb[85] = i($a(0))),
      (mb[86] = "LSR"),
      (nb[86] = y(ib(0))),
      (mb[87] = "uSRE"),
      (nb[87] = G(ib(0))),
      (mb[88] = "CLI"),
      (nb[88] = (function () {
        return Ua(function () {
          U = 0;
        });
      })()),
      (mb[89] = "EOR"),
      (nb[89] = i(Za(1))),
      (mb[90] = "uNOP"),
      (nb[90] = b(Ua)),
      (mb[91] = "uSRE"),
      (nb[91] = G(jb(1))),
      (mb[92] = "uNOP"),
      (nb[92] = b(Za(0))),
      (mb[93] = "EOR"),
      (nb[93] = i(Za(0))),
      (mb[94] = "LSR"),
      (nb[94] = y(jb(0))),
      (mb[95] = "uSRE"),
      (nb[95] = G(jb(0))),
      (mb[96] = "RTS"),
      (nb[96] = (function () {
        return [
          ja,
          ma,
          Pa,
          function () {
            $ = Oa();
          },
          function () {
            $ |= Oa() << 8;
          },
          function () {
            (M = $), Da();
          },
          ka,
        ];
      })()),
      (mb[97] = "ADC"),
      (nb[97] = c(Ya)),
      (mb[98] = "uKIL"),
      (nb[98] = a()),
      (mb[99] = "uRRA"),
      (nb[99] = E(kb));
    (mb[100] = "uNOP"),
      (nb[100] = b(Wa)),
      (mb[101] = "ADC"),
      (nb[101] = c(Wa)),
      (mb[102] = "ROR"),
      (nb[102] = A(gb)),
      (mb[103] = "uRRA"),
      (nb[103] = E(gb)),
      (mb[104] = "PLA"),
      (nb[104] = (function () {
        return [
          ja,
          ma,
          Pa,
          function () {
            (O = Oa()), Ka(O), La(O);
          },
          ka,
        ];
      })()),
      (mb[105] = "ADC"),
      (nb[105] = c(Va)),
      (mb[106] = "ROR"),
      (nb[106] = (function () {
        return Ua(function () {
          var a = 1 & O;
          (O = (O >>> 1) | (W << 7)), Na(a), Ka(O), La(O);
        });
      })()),
      (mb[107] = "uARR"),
      (nb[107] = (function (a) {
        return a(function () {
          Ta("ARR");
          var a = O & Z;
          (a = (a >>> 1) | (W ? 128 : 0)), (O = a), Ka(a), La(a);
          var b = 96 & O;
          96 == b
            ? ((W = 1), (S = 0))
            : 0 == b
            ? ((W = 0), (S = 0))
            : 32 == b
            ? ((W = 0), (S = 1))
            : 64 == b && ((W = 1), (S = 1));
        });
      })(Va)),
      (mb[108] = "JMP"),
      (nb[108] = (function () {
        return [
          ja,
          Aa,
          Ba,
          ua,
          function () {
            Ca(), va();
          },
          function () {
            (M = _), ka();
          },
        ];
      })()),
      (mb[109] = "ADC"),
      (nb[109] = c(Xa)),
      (mb[110] = "ROR"),
      (nb[110] = A(hb)),
      (mb[111] = "uRRA"),
      (nb[111] = E(hb)),
      (mb[112] = "BVS"),
      (nb[112] = H(6, 1)),
      (mb[113] = "ADC"),
      (nb[113] = c(_a)),
      (mb[114] = "uKIL"),
      (nb[114] = a()),
      (mb[115] = "uRRA"),
      (nb[115] = E(lb)),
      (mb[116] = "uNOP"),
      (nb[116] = b($a(0))),
      (mb[117] = "ADC"),
      (nb[117] = c($a(0))),
      (mb[118] = "ROR"),
      (nb[118] = A(ib(0))),
      (mb[119] = "uRRA"),
      (nb[119] = E(ib(0))),
      (mb[120] = "SEI"),
      (nb[120] = (function () {
        return Ua(function () {
          U = 1;
        });
      })()),
      (mb[121] = "ADC"),
      (nb[121] = c(Za(1))),
      (mb[122] = "uNOP"),
      (nb[122] = b(Ua)),
      (mb[123] = "uRRA"),
      (nb[123] = E(jb(1))),
      (mb[124] = "uNOP"),
      (nb[124] = b(Za(0))),
      (mb[125] = "ADC"),
      (nb[125] = c(Za(0))),
      (mb[126] = "ROR"),
      (nb[126] = A(jb(0))),
      (mb[127] = "uRRA"),
      (nb[127] = E(jb(0))),
      (mb[128] = "uNOP"),
      (nb[128] = b(Va)),
      (mb[129] = "STA"),
      (nb[129] = q(cb)),
      (mb[130] = "uNOP"),
      (nb[130] = b(Va)),
      (mb[131] = "uSAX"),
      (nb[131] = t(cb)),
      (mb[132] = "STY"),
      (nb[132] = s(ab)),
      (mb[133] = "STA"),
      (nb[133] = q(ab)),
      (mb[134] = "STX"),
      (nb[134] = r(ab)),
      (mb[135] = "uSAX"),
      (nb[135] = t(ab)),
      (mb[136] = "DEY"),
      (nb[136] = (function () {
        return Ua(function () {
          (Q = (Q - 1) & 255), Ka(Q), La(Q);
        });
      })()),
      (mb[137] = "uNOP"),
      (nb[137] = b(Va)),
      (mb[138] = "TXA"),
      (nb[138] = (function () {
        return Ua(function () {
          (O = P), Ka(O), La(O);
        });
      })()),
      (mb[139] = "uANE"),
      (nb[139] = (function (a) {
        return a(function () {
          Ta("ANE");
        });
      })(Va)),
      (mb[140] = "STY"),
      (nb[140] = s(bb)),
      (mb[141] = "STA"),
      (nb[141] = q(bb)),
      (mb[142] = "STX"),
      (nb[142] = r(bb)),
      (mb[143] = "uSAX"),
      (nb[143] = t(bb)),
      (mb[144] = "BCC"),
      (nb[144] = H(ia, 0)),
      (mb[145] = "STA"),
      (nb[145] = q(fb)),
      (mb[146] = "uKIL"),
      (nb[146] = a()),
      (mb[147] = "uSHA"),
      (nb[147] = u(fb)),
      (mb[148] = "STY"),
      (nb[148] = s(eb(0))),
      (mb[149] = "STA"),
      (nb[149] = q(eb(0))),
      (mb[150] = "STX"),
      (nb[150] = r(eb(1))),
      (mb[151] = "uSAX"),
      (nb[151] = t(eb(1))),
      (mb[152] = "TYA"),
      (nb[152] = (function () {
        return Ua(function () {
          (O = Q), Ka(O), La(O);
        });
      })()),
      (mb[153] = "STA"),
      (nb[153] = q(db(1))),
      (mb[154] = "TXS"),
      (nb[154] = (function () {
        return Ua(function () {
          N = P;
        });
      })()),
      (mb[155] = "uSHS"),
      (nb[155] = (function (a) {
        return a(function () {
          Ta("SHS");
          var a = O & P;
          (N = a), (Z = a & (1 + (_ >>> 8)) & 255);
        });
      })(db(1))),
      (mb[156] = "uSHY"),
      (nb[156] = (function (a) {
        return a(function () {
          Ta("SHY"), (Z = Q & (1 + (_ >>> 8)) & 255);
        });
      })(db(0))),
      (mb[157] = "STA"),
      (nb[157] = q(db(0))),
      (mb[158] = "uSHX"),
      (nb[158] = (function (a) {
        return a(function () {
          Ta("SHX"), (Z = P & (1 + (_ >>> 8)) & 255);
        });
      })(db(1))),
      (mb[159] = "uSHA"),
      (nb[159] = u(db(1))),
      (mb[160] = "LDY"),
      (nb[160] = l(Va)),
      (mb[161] = "LDA"),
      (nb[161] = j(Ya)),
      (mb[162] = "LDX"),
      (nb[162] = k(Va)),
      (mb[163] = "uLAX"),
      (nb[163] = p(Ya)),
      (mb[164] = "LDY"),
      (nb[164] = l(Wa)),
      (mb[165] = "LDA"),
      (nb[165] = j(Wa)),
      (mb[166] = "LDX"),
      (nb[166] = k(Wa)),
      (mb[167] = "uLAX"),
      (nb[167] = p(Wa)),
      (mb[168] = "TAY"),
      (nb[168] = (function () {
        return Ua(function () {
          (Q = O), Ka(Q), La(Q);
        });
      })()),
      (mb[169] = "LDA"),
      (nb[169] = j(Va)),
      (mb[170] = "TAX"),
      (nb[170] = (function () {
        return Ua(function () {
          (P = O), Ka(P), La(P);
        });
      })()),
      (mb[171] = "uLXA"),
      (nb[171] = (function (a) {
        return a(function () {
          Ta("LXA");
          var a = O & Z;
          (O = a), (P = a), Ka(a), La(a);
        });
      })(Va)),
      (mb[172] = "LDY"),
      (nb[172] = l(Xa)),
      (mb[173] = "LDA"),
      (nb[173] = j(Xa)),
      (mb[174] = "LDX"),
      (nb[174] = k(Xa)),
      (mb[175] = "uLAX"),
      (nb[175] = p(Xa)),
      (mb[176] = "BCS"),
      (nb[176] = H(ia, 1)),
      (mb[177] = "LDA"),
      (nb[177] = j(_a)),
      (mb[178] = "uKIL"),
      (nb[178] = a()),
      (mb[179] = "uLAX"),
      (nb[179] = p(_a)),
      (mb[180] = "LDY"),
      (nb[180] = l($a(0))),
      (mb[181] = "LDA"),
      (nb[181] = j($a(0))),
      (mb[182] = "LDX"),
      (nb[182] = k($a(1))),
      (mb[183] = "uLAX"),
      (nb[183] = p($a(1))),
      (mb[184] = "CLV"),
      (nb[184] = (function () {
        return Ua(function () {
          S = 0;
        });
      })()),
      (mb[185] = "LDA"),
      (nb[185] = j(Za(1))),
      (mb[186] = "TSX"),
      (nb[186] = (function () {
        return Ua(function () {
          (P = N), Ka(P), La(P);
        });
      })()),
      (mb[187] = "uLAS"),
      (nb[187] = (function (a) {
        return a(function () {
          Ta("LAS");
          var a = N & Z;
          (O = a), (P = a), (N = a), Ka(a), La(a);
        });
      })(Za(1))),
      (mb[188] = "LDY"),
      (nb[188] = l(Za(0))),
      (mb[189] = "LDA"),
      (nb[189] = j(Za(0))),
      (mb[190] = "LDX"),
      (nb[190] = k(Za(1))),
      (mb[191] = "uLAX"),
      (nb[191] = p(Za(1))),
      (mb[192] = "CPY"),
      (nb[192] = h(Va)),
      (mb[193] = "CMP"),
      (nb[193] = f(Ya)),
      (mb[194] = "uNOP"),
      (nb[194] = b(Va)),
      (mb[195] = "uDCP"),
      (nb[195] = B(kb)),
      (mb[196] = "CPY"),
      (nb[196] = h(Wa)),
      (mb[197] = "CMP"),
      (nb[197] = f(Wa)),
      (mb[198] = "DEC"),
      (nb[198] = w(gb)),
      (mb[199] = "uDCP"),
      (nb[199] = B(gb));
    (mb[200] = "INY"),
      (nb[200] = (function () {
        return Ua(function () {
          (Q = (Q + 1) & 255), Ka(Q), La(Q);
        });
      })()),
      (mb[201] = "CMP"),
      (nb[201] = f(Va)),
      (mb[202] = "DEX"),
      (nb[202] = (function () {
        return Ua(function () {
          (P = (P - 1) & 255), Ka(P), La(P);
        });
      })()),
      (mb[203] = "uSBX"),
      (nb[203] = (function (a) {
        return a(function () {
          Ta("SBX");
          var a = O & P,
            b = Z,
            c = (a - b) & 255;
          (P = c), Na(a >= b), Ka(c), La(c);
        });
      })(Va)),
      (mb[204] = "CPY"),
      (nb[204] = h(Xa)),
      (mb[205] = "CMP"),
      (nb[205] = f(Xa)),
      (mb[206] = "DEC"),
      (nb[206] = w(hb)),
      (mb[207] = "uDCP"),
      (nb[207] = B(hb)),
      (mb[208] = "BNE"),
      (nb[208] = H(ha, 0)),
      (mb[209] = "CMP"),
      (nb[209] = f(_a)),
      (mb[210] = "uKIL"),
      (nb[210] = a()),
      (mb[211] = "uDCP"),
      (nb[211] = B(lb)),
      (mb[212] = "uNOP"),
      (nb[212] = b($a(0))),
      (mb[213] = "CMP"),
      (nb[213] = f($a(0))),
      (mb[214] = "DEC"),
      (nb[214] = w(ib(0))),
      (mb[215] = "uDCP"),
      (nb[215] = B(ib(0))),
      (mb[216] = "CLD"),
      (nb[216] = (function () {
        return Ua(function () {
          T = 0;
        });
      })()),
      (mb[217] = "CMP"),
      (nb[217] = f(Za(1))),
      (mb[218] = "uNOP"),
      (nb[218] = b(Ua)),
      (mb[219] = "uDCP"),
      (nb[219] = B(jb(1))),
      (mb[220] = "uNOP"),
      (nb[220] = b(Za(0))),
      (mb[221] = "CMP"),
      (nb[221] = f(Za(0))),
      (mb[222] = "DEC"),
      (nb[222] = w(jb(0))),
      (mb[223] = "uDCP"),
      (nb[223] = B(jb(0))),
      (mb[224] = "CPX"),
      (nb[224] = g(Va)),
      (mb[225] = "SBC"),
      (nb[225] = n(Ya)),
      (mb[226] = "uNOP"),
      (nb[226] = b(Va)),
      (mb[227] = "uISB"),
      (nb[227] = C(kb)),
      (mb[228] = "CPX"),
      (nb[228] = g(Wa)),
      (mb[229] = "SBC"),
      (nb[229] = n(Wa)),
      (mb[230] = "INC"),
      (nb[230] = x(gb)),
      (mb[231] = "uISB"),
      (nb[231] = C(gb)),
      (mb[232] = "newINX"),
      (nb[232] = (function () {
        return Ua(function () {
          (P = (P + 1) & 255), Ka(P), La(P);
        });
      })()),
      (mb[233] = "SBC"),
      (nb[233] = n(Va)),
      (mb[234] = "NOP"),
      (nb[234] = (function () {
        return Ua(function () {});
      })()),
      (mb[235] = "SBC"),
      (nb[235] = n(Va)),
      (mb[236] = "CPX"),
      (nb[236] = g(Xa)),
      (mb[237] = "SBC"),
      (nb[237] = n(Xa)),
      (mb[238] = "INC"),
      (nb[238] = x(hb)),
      (mb[239] = "uISB"),
      (nb[239] = C(hb)),
      (mb[240] = "BEQ"),
      (nb[240] = H(ha, 1)),
      (mb[241] = "SBC"),
      (nb[241] = n(_a)),
      (mb[242] = "uKIL"),
      (nb[242] = a()),
      (mb[243] = "uISB"),
      (nb[243] = C(lb)),
      (mb[244] = "uNOP"),
      (nb[244] = b($a(0))),
      (mb[245] = "SBC"),
      (nb[245] = n($a(0))),
      (mb[246] = "INC"),
      (nb[246] = x(ib(0))),
      (mb[247] = "uISB"),
      (nb[247] = C(ib(0))),
      (mb[248] = "SED"),
      (nb[248] = (function () {
        return Ua(function () {
          T = 1;
        });
      })()),
      (mb[249] = "SBC"),
      (nb[249] = n(Za(1))),
      (mb[250] = "uNOP"),
      (nb[250] = b(Ua)),
      (mb[251] = "uISB"),
      (nb[251] = C(jb(1))),
      (mb[252] = "uNOP"),
      (nb[252] = b(Za(0))),
      (mb[253] = "SBC"),
      (nb[253] = n(Za(0))),
      (mb[254] = "INC"),
      (nb[254] = x(jb(0))),
      (mb[255] = "uISB"),
      (nb[255] = C(jb(0))),
      (this.saveState = function () {
        return {
          PC: M,
          A: O,
          X: P,
          Y: Q,
          SP: N,
          N: R,
          V: S,
          D: T,
          I: U,
          Z: V,
          C: W,
          T: X,
          o: Y,
          R: 0 | L,
          d: Z,
          AD: $,
          BA: _,
          BC: 0 | aa,
          IA: ba,
          bo: ca,
          boa: da,
        };
      }),
      (this.loadState = function (a) {
        (M = a.PC),
          (O = a.A),
          (P = a.X),
          (Q = a.Y),
          (N = a.SP),
          (R = a.N),
          (S = a.V),
          (T = a.D),
          (U = a.I),
          (V = a.Z),
          (W = a.C),
          (X = a.T),
          (Y = a.o),
          (L = !!a.R),
          (Z = a.d),
          ($ = a.AD),
          (_ = a.BA),
          (aa = !!a.BC),
          (ba = a.IA),
          (ca = a.bo),
          (da = a.boa),
          (K = -1 === Y ? la : nb[Y]);
      }),
      (this.toString = function () {
        return (
          "CPU  PC: " +
          M.toString(16) +
          "  op: " +
          Y.toString() +
          "  T: " +
          X +
          "  data: " +
          Z +
          "\n A: " +
          O.toString(16) +
          "  X: " +
          P.toString(16) +
          "  Y: " +
          Q.toString(16) +
          "  SP: " +
          N.toString(16) +
          "     N" +
          R +
          "  V" +
          S +
          "  D" +
          T +
          "  I" +
          U +
          "  Z" +
          V +
          "  C" +
          W +
          "  "
        );
      }),
      (this.breakpoint = function (a) {
        if ((jt.Util.log(a), this.trace)) {
          var b =
            "CPU Breakpoint!  " +
            (a ? "(" + a + ")" : "") +
            "\n\n" +
            this.toString();
          jt.Util.message(b);
        }
      }),
      (this.runCycles = function (a) {
        for (var b = performance.now(), c = 0; c < a; c++) this.clockPulse();
        var d = performance.now();
        jt.Util.message("Done running " + a + " cycles in " + (d - b) + " ms.");
      });
  }),
  (jt.Ram = function () {
    "use strict";
    (this.powerOn = function () {}),
      (this.powerOff = function () {}),
      (this.read = function (c) {
        return a[c & b];
      }),
      (this.write = function (c, d) {
        a[c & b] = d;
      }),
      (this.powerFry = function () {
        for (
          var b = 1 - e + 2 * Math.random() * e, f = b * c, g = 0;
          g < f;
          g++
        )
          a[(128 * Math.random()) | 0] &= (256 * Math.random()) | 0;
        var h = b * d;
        for (g = 0; g < h; g++)
          a[(128 * Math.random()) | 0] |= 1 << ((8 * Math.random()) | 0);
      }),
      (this.saveState = function () {
        return { b: jt.Util.storeInt8BitArrayToStringBase64(a) };
      }),
      (this.loadState = function (b) {
        a = jt.Util.restoreStringBase64ToInt8BitArray(b.b, a);
      });
    var a = new Array(128),
      b = 127,
      c = 120,
      d = 25,
      e = 0.3;
    !(function () {
      for (var b = a.length - 1; b >= 0; b--) a[b] = (256 * Math.random()) | 0;
    })();
  }),
  (jt.Pia = function () {
    "use strict";
    (this.powerOn = function () {}),
      (this.powerOff = function () {}),
      (this.clockPulse = function () {
        --h <= 0 && a();
      }),
      (this.connectBus = function (a) {
        g = a;
      }),
      (this.read = function (a) {
        var b = a & u;
        return 4 === b || 6 === b
          ? (c(), o)
          : 0 === b
          ? k
          : 2 === b
          ? m
          : 1 === b
          ? l
          : 3 === b
          ? n
          : 5 === b || 7 === b
          ? p
          : 0;
      }),
      (this.write = function (a, c) {
        var f = a & u;
        return 4 === f
          ? ((q = c), void b(c, 1))
          : 5 === f
          ? ((r = c), void b(c, 8))
          : 6 === f
          ? ((s = c), void b(c, 64))
          : 7 === f
          ? ((t = c), void b(c, 1024))
          : 2 === f
          ? void d(c)
          : 3 === f
          ? ((n = c), void e(">>>> Ineffective Write to PIA SWBCNT: " + c))
          : 0 === f
          ? void e(">>>> Unsupported Write to PIA SWCHA: " + c)
          : 1 === f
          ? void e(">>>> Unsupported Write to PIA SWACNT " + c)
          : 0;
      });
    var a = function () {
        --o < 0 ? ((p |= 192), (o = 255), (h = i = 1)) : (h = i);
      },
      b = function (b, c) {
        (o = b), (p &= 63), (h = i = j = c), a();
      },
      c = function () {
        (p &= 191), 1 === i && (h = i = j);
      },
      d = function (a) {
        m = (203 & m) | (34 & a);
      },
      e = function (a) {
        self.debug && jt.Util.log(a);
      },
      f = jt.ConsoleControls;
    (this.controlStateChanged = function (a, b) {
      switch (a) {
        case f.JOY0_UP:
          return void (b ? (k &= 239) : (k |= 16));
        case f.JOY0_DOWN:
          return void (b ? (k &= 223) : (k |= 32));
        case f.PADDLE1_BUTTON:
        case f.JOY0_LEFT:
          return void (b ? (k &= 191) : (k |= 64));
        case f.PADDLE0_BUTTON:
        case f.JOY0_RIGHT:
          return void (b ? (k &= 127) : (k |= 128));
        case f.JOY1_UP:
          return void (b ? (k &= 254) : (k |= 1));
        case f.JOY1_DOWN:
          return void (b ? (k &= 253) : (k |= 2));
        case f.JOY1_LEFT:
          return void (b ? (k &= 251) : (k |= 4));
        case f.JOY1_RIGHT:
          return void (b ? (k &= 247) : (k |= 8));
        case f.RESET:
          return void (b ? (m &= 254) : (m |= 1));
        case f.SELECT:
          return void (b ? (m &= 253) : (m |= 2));
      }
      if (b)
        switch (a) {
          case f.BLACK_WHITE:
            return (
              0 == (8 & m) ? (m |= 8) : (m &= 247),
              void g
                .getTia()
                .getVideoOutput()
                .showOSD(0 != (8 & m) ? "COLOR" : "B/W", !0)
            );
          case f.DIFFICULTY0:
            return (
              0 == (64 & m) ? (m |= 64) : (m &= 191),
              void g
                .getTia()
                .getVideoOutput()
                .showOSD(0 != (64 & m) ? "P1 Expert" : "P1 Novice", !0)
            );
          case f.DIFFICULTY1:
            return (
              0 == (128 & m) ? (m |= 128) : (m &= 127),
              void g
                .getTia()
                .getVideoOutput()
                .showOSD(0 != (128 & m) ? "P2 Expert" : "P2 Novice", !0)
            );
        }
    }),
      (this.controlsStateReport = function (a) {
        (a[f.BLACK_WHITE] = 0 == (8 & m)),
          (a[f.DIFFICULTY0] = 0 != (64 & m)),
          (a[f.DIFFICULTY1] = 0 != (128 & m)),
          (a[f.SELECT] = 0 == (2 & m)),
          (a[f.RESET] = 0 == (1 & m));
      }),
      (this.saveState = function () {
        return {
          t: h,
          c: i,
          l: j,
          SA: k,
          SAC: l,
          SB: m,
          SBC: n,
          IT: o,
          IS: p,
          T1: q,
          T8: r,
          T6: s,
          T2: t,
        };
      }),
      (this.loadState = function (a) {
        (h = a.t),
          (i = a.c),
          (j = a.l),
          (l = a.SAC),
          (m = a.SB),
          (n = a.SBC),
          (o = a.IT),
          (p = a.IS),
          (q = a.T1),
          (r = a.T8),
          (s = a.T6),
          (t = a.T2);
      }),
      (this.debug = !1);
    var g,
      h = 1024,
      i = 1024,
      j = 1024,
      k = 255,
      l = 0,
      m = 11,
      n = 0,
      o = (256 * Math.random()) | 0,
      p = 0,
      q = 0,
      r = 0,
      s = 0,
      t = 0,
      u = 7;
  }),
  (function () {
    "use strict";
    for (
      var a = [
          0, 4210752, 7105644, 9474192, 11579568, 13158600, 14474460, 16053492,
          17476, 1074276, 2393220, 3448992, 4241592, 5296336, 6088936, 6880508,
          10352, 1328260, 2645144, 3963052, 5016764, 6070476, 6862044, 7915756,
          6276, 1586328, 3166380, 4745408, 6062288, 7378144, 8431852, 9747708,
          136, 2105500, 3947696, 5789888, 7368912, 8947936, 10526956, 11842812,
          6029432, 7610508, 8928416, 10246320, 11563200, 12616912, 13671644,
          14725356, 7864392, 9445472, 10763384, 12081292, 13398176, 14451892,
          15506628, 16560340, 8650772, 9969712, 11287628, 12605544, 13660284,
          14715028, 15507624, 16561340, 8912896, 10231836, 11550776, 12606544,
          13661288, 14716028, 15508624, 16562340, 8132608, 9451548, 11031608,
          12349520, 13404264, 14457980, 15512720, 16566436, 6040576, 7883804,
          9463864, 11306064, 12622952, 13939836, 15256720, 16572580, 2898944,
          4742172, 6585400, 8428624, 9745512, 11325564, 12641424, 13958308,
          15360, 2120736, 4226112, 6069340, 7648372, 9228428, 10806436,
          12123320, 14356, 1858612, 3701840, 5281900, 6861956, 8178844, 9495732,
          10812616, 12332, 1855564, 3436648, 5016708, 6596764, 7913652, 8967372,
          10284256, 10308, 1591396, 3172484, 4490400, 5807288, 7124176, 8178920,
          9232636,
        ],
        b = [
          0, 2631720, 5263440, 7631988, 9737364, 11842740, 13684944, 15856113,
          0, 2631720, 5263440, 7631988, 9737364, 11842740, 13684944, 15856113,
          22656, 2125972, 3966120, 5807292, 7384268, 8700124, 10277100,
          11591932, 23620, 2127964, 3969140, 5811340, 7389344, 8705200,
          10283204, 11599060, 13424, 2117768, 3958944, 5801140, 7379144,
          8695004, 10273004, 11588860, 1336320, 3440672, 5281852, 7123032,
          8701040, 10279044, 11856028, 13171888, 1310832, 3416200, 5258400,
          7100596, 8679624, 10257628, 11836652, 13152508, 6052864, 7631904,
          9210940, 10789976, 12105840, 13158532, 14474396, 15527088, 6029424,
          7610500, 8928404, 10246312, 11563188, 12616900, 13671632, 14725344,
          7355392, 8935452, 10515512, 11832400, 13149288, 14465148, 15518864,
          16572580, 7340120, 8921196, 10501248, 11819156, 13136036, 14451892,
          15506628, 16560340, 7348224, 8928284, 10508344, 11826256, 13142120,
          14459004, 15512720, 16566436, 8388668, 9707604, 11025516, 12343424,
          13398164, 14451880, 15506616, 16560328, 8912896, 10231840, 11549756,
          12605528, 13660272, 14713988, 15506588, 16560304, 0, 2631720, 5263440,
          7631988, 9737364, 11842740, 13684944, 15856113, 0, 2631720, 5263440,
          7631988, 9737364, 11842740, 13684944, 15856113,
        ],
        c = new Uint32Array(256),
        d = new Uint32Array(256),
        e = 0,
        f = a.length;
      e < f;
      e++
    )
      (c[2 * e] = c[2 * e + 1] = a[e] + 4278190080),
        (d[2 * e] = d[2 * e + 1] = b[e] + 4278190080);
    (a = b = void 0), (jt.TiaPalettes = { NTSC: c, PAL: d });
  })(),
  (jt.TiaAudio = function () {
    "use strict";
    function a() {
      e || (e = new jt.AudioSignal("TiaAudio", c, k, j)),
        d.connectAudioSignal(e);
    }
    function b() {
      e && d.disconnectAudioSignal(e);
    }
    var c = this;
    (this.connectAudioSocket = function (a) {
      d = a;
    }),
      (this.cartridgeInserted = function (a) {
        f = a && a.needsAudioClock() ? a : null;
      }),
      (this.audioClockPulse = function () {
        d.audioClockPulse();
      }),
      (this.getChannel0 = function () {
        return h;
      }),
      (this.getChannel1 = function () {
        return i;
      }),
      (this.powerOn = function () {
        this.reset(), a();
      }),
      (this.powerOff = function () {
        b();
      }),
      (this.reset = function () {
        h.setVolume(0), i.setVolume(0), (g = 0);
      }),
      (this.nextSample = function () {
        f && f.audioClockPulse();
        var a = h.nextSample() - i.nextSample();
        return a !== g && ((a = (9 * a + g) / 10), (g = a)), a;
      });
    var d,
      e,
      f,
      g = 0,
      h = new jt.TiaAudioChannel(),
      i = new jt.TiaAudioChannel(),
      j = 0.4,
      k = 31440;
  }),
  (jt.TiaAudioChannel = function () {
    "use strict";
    (this.nextSample = function () {
      return --s <= 0 && ((s += r), (t = o())), 1 === t ? p : 0;
    }),
      (this.setVolume = function (a) {
        p = a / E;
      }),
      (this.setDivider = function (a) {
        r !== a && ((s = (s / r) * a), (r = a));
      }),
      (this.setControl = function (b) {
        q !== b &&
          ((q = b),
          (o =
            0 === b || 11 === b
              ? a
              : 1 === b
              ? c
              : 2 === b
              ? k
              : 3 === b
              ? l
              : 4 === b || 5 === b
              ? f
              : 6 === b || 10 === b
              ? j
              : 7 === b || 9 === b
              ? d
              : 8 === b
              ? e
              : 12 === b || 13 === b
              ? h
              : 14 === b
              ? m
              : 15 === b
              ? n
              : a));
      });
    var a = function () {
        return 1;
      },
      b = function () {
        return z[y];
      },
      c = function () {
        return 15 == ++y && (y = 0), z[y];
      },
      d = function () {
        return 31 == ++A && (A = 0), B[A];
      },
      e = function () {
        var a = 1 & x,
          b = 1 & ((x >> 4) ^ a);
        return (x >>>= 1), 0 === b ? (x &= 255) : (x |= 256), a;
      },
      f = function () {
        return 1 === r ? 1 : (u = u ? 0 : 1);
      },
      g = function () {
        return v;
      },
      h = function () {
        return 0 == --w && ((w = 3), (v = v ? 0 : 1)), v;
      },
      i = function () {
        return D[C];
      },
      j = function () {
        return 31 == ++C && (C = 0), D[C];
      },
      k = function () {
        return i() !== j() ? c() : b();
      },
      l = function () {
        return d() ? c() : b();
      },
      m = function () {
        return i() != j() ? h() : g();
      },
      n = function () {
        return d() ? h() : g();
      },
      o = a,
      p = 0,
      q = 0,
      r = 1,
      s = 1,
      t = 0,
      u = 1,
      v = 1,
      w = 3,
      x = 511,
      y = 14,
      z = [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
      A = 30,
      B = [
        1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0,
        0, 1, 0, 1, 1, 0, 0,
      ],
      C = 30,
      D = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
      E = 15;
  }),
  (jt.Tia = function (pCpu, pPia, audioSocket) {
    "use strict";
    function init() {
      generateObjectsLineSprites(), generateObjectsCopiesOffsets();
    }
    function renderLineTo(a) {
      var b,
        c = a > LINE_WIDTH ? LINE_WIDTH : a;
      if (vBlankOn)
        for (var d = renderClock; d < c; ++d) linePixels[d] = vBlankColor;
      else {
        for (
          var e = collisions,
            f = renderClock - HBLANK_DURATION,
            g = c - HBLANK_DURATION;
          f < g;
          ++f
        ) {
          var h = 0,
            i = collisionsPossible;
          playfieldPriority &&
            (playfieldEnabled &&
              (1 &
              (f < 80
                ? playfieldPatternL >> (f >> 2)
                : playfieldPatternR >> ((f - 80) >> 2))
                ? (h = playfieldColor)
                : (i &= PFC)),
            ballEnabled &&
              ((b = f - ballPixel),
              b < 0 && (b += 160),
              (missileBallLineSprites[ballLineSpritePointer + (b >> 3)] >>
                (7 & b)) &
              1
                ? h || (h = ballColor)
                : (i &= BLC))),
            player0Enabled &&
              ((b = f - player0Pixel),
              b < 0 && (b += 160),
              (playerLineSprites[player0LineSpritePointer + (b >> 3)] >>
                (7 & b)) &
              1
                ? h || (h = player0Color)
                : (i &= P0C)),
            missile0Enabled &&
              ((b = f - missile0Pixel),
              b < 0 && (b += 160),
              (missileBallLineSprites[missile0LineSpritePointer + (b >> 3)] >>
                (7 & b)) &
              1
                ? h || (h = missile0Color)
                : (i &= M0C)),
            player1Enabled &&
              ((b = f - player1Pixel),
              b < 0 && (b += 160),
              (playerLineSprites[player1LineSpritePointer + (b >> 3)] >>
                (7 & b)) &
              1
                ? h || (h = player1Color)
                : (i &= P1C)),
            missile1Enabled &&
              ((b = f - missile1Pixel),
              b < 0 && (b += 160),
              (missileBallLineSprites[missile1LineSpritePointer + (b >> 3)] >>
                (7 & b)) &
              1
                ? h || (h = missile1Color)
                : (i &= M1C)),
            playfieldPriority ||
              (playfieldEnabled &&
                (f < 80
                  ? (playfieldPatternL >> (f >> 2)) & 1
                    ? h || (h = playfieldLeftColor)
                    : (i &= PFC)
                  : (playfieldPatternR >> ((f - 80) >> 2)) & 1
                  ? h || (h = playfieldRightColor)
                  : (i &= PFC)),
              ballEnabled &&
                ((b = f - ballPixel),
                b < 0 && (b += 160),
                (missileBallLineSprites[ballLineSpritePointer + (b >> 3)] >>
                  (7 & b)) &
                1
                  ? h || (h = ballColor)
                  : (i &= BLC))),
            (linePixels[f + HBLANK_DURATION] = h || playfieldBackground),
            (e |= i);
        }
        debugNoCollisions || (collisions = e);
      }
    }
    function changeAt(a) {
      vBlankOn ||
        (a > renderClock &&
          ((changeClock >= 0 || changeClockPrevLine >= 0) && renderLineTo(a),
          (renderClock = a)),
        (changeClock = renderClock));
    }
    function changeAtClock() {
      changeAt(clock);
    }
    function changeAtClockPlus(a) {
      changeAt(clock + a);
    }
    function changePlayfieldAtClock() {
      if ((debug && debugPixel(DEBUG_PF_GR_COLOR), clock < renderClock - 1))
        return changeAtClock();
      var a = 3 & clock;
      changeAtClockPlus(a < 3 ? 4 - a : 5);
    }
    function changeVBlankAtClockPlus1() {
      var a = clock + 1;
      a > renderClock &&
        ((changeClock >= 0 || changeClockPrevLine >= 0) && renderLineTo(a),
        (renderClock = a)),
        (changeClock = renderClock);
    }
    function updateToClock() {
      vBlankOn ||
        (clock > renderClock &&
          ((changeClock >= 0 || changeClockPrevLine >= 0) &&
            renderLineTo(clock),
          (renderClock = clock)));
    }
    function augmentCollisionsPossible() {
      (collisionsPossible = 65534),
        player0Enabled || (collisionsPossible &= P0C),
        player1Enabled || (collisionsPossible &= P1C),
        missile0Enabled || (collisionsPossible &= M0C),
        missile1Enabled || (collisionsPossible &= M1C),
        playfieldEnabled || (collisionsPossible &= PFC),
        ballEnabled || (collisionsPossible &= BLC);
    }
    function playfieldUpdateSprite() {
      (playfieldPatternL =
        (PF2 << 12) | (jt.Util.reverseInt8(PF1) << 4) | ((240 & PF0) >> 4)),
        playfieldUpdateSpriteR();
    }
    function playfieldUpdateSpriteR() {
      (playfieldPatternR = playfieldReflected
        ? (jt.Util.reverseInt8(PF0) << 16) |
          (PF1 << 8) |
          jt.Util.reverseInt8(PF2)
        : playfieldPatternL),
        0 !== playfieldPatternL || 0 !== playfieldPatternR
          ? ((playfieldEnabled = !0), augmentCollisionsPossible())
          : ((playfieldEnabled = !1), (collisionsPossible &= PFC));
    }
    function ballSetEnabled(a) {
      a
        ? ((ballEnabled = !0), augmentCollisionsPossible())
        : ((ballEnabled = !1), (collisionsPossible &= BLC));
    }
    function player0SetShape(a) {
      if (NUSIZ0 !== a) {
        var b = NUSIZ0 ^ a,
          c = NUSIZ0;
        NUSIZ0 = a;
        var d = 7 & a,
          e = clock < HBLANK_DURATION ? 2 : clock - HBLANK_DURATION + 2;
        if (7 & b) {
          if (!player0Alt) {
            var f = e - player0Pixel;
            f < 0 ? (f += 160) : f >= 160 && (f -= 160);
            var g = playerScanOffsetsShape[160 * (7 & c) + f],
              h = playerScanOffsetsShape[160 * d + f];
            if (h !== g)
              if (
                (player0Enabled && changeAtClockPlus(2),
                (player0Alt = player0Pixel >= 80 ? 1 : 2),
                (player0LineSpritePointer += 20),
                (player0AltFrom = f),
                (player0AltLength = playerCopyLengthPerShape[d]),
                192 & g)
              )
                player0AltCopyOffset = 191 & g;
              else if (clock < HBLANK_DURATION && hMoveHitBlank)
                player0AltCopyOffset = 128;
              else {
                var i = playerPixelSizePerShape[d];
                (player0AltCopyOffset =
                  playerScanStartPerShape[d] + g * i + (1 & f)),
                  (player0AltLength -= (192 & h ? 0 : h) * i);
              }
          }
          player0UpdateSprite(2);
        }
        if (55 & b) {
          if (
            !missile0Alt &&
            ((f = e - missile0Pixel),
            f < 0 ? (f += 160) : f >= 160 && (f -= 160),
            (g =
              missileScanOffsetsShape[160 * (((48 & c) >> 1) | (7 & c)) + f]),
            (h = missileScanOffsetsShape[160 * (((48 & a) >> 1) | d) + f]) !==
              g)
          ) {
            missile0Enabled && changeAtClockPlus(2),
              (missile0Alt = missile0Pixel >= 80 ? 1 : 2),
              (missile0LineSpritePointer += 20),
              (missile0AltFrom = f);
            var j = (48 & a) >> 4;
            (missile0AltLength = 4 + (1 << j)),
              192 & g
                ? (missile0AltCopyOffset = 191 & g)
                : clock < HBLANK_DURATION && hMoveHitBlank
                ? (missile0AltCopyOffset = 128)
                : ((missile0AltCopyOffset = 4 + (g << j) + (1 & f)),
                  (missile0AltLength -= (192 & h ? 0 : h) << j));
          }
          missile0UpdateSprite(2);
        }
      }
    }
    function player0SetSprite(a) {
      debug && debugPixel(DEBUG_P0_GR_COLOR),
        GRP0d !== a && ((GRP0d = a), VDELP0 || player0UpdateSprite(1)),
        GRP1 !== GRP1d && ((GRP1 = GRP1d), VDELP1 && player1UpdateSprite(1));
    }
    function player0UpdateSprite(a) {
      var b = VDELP0 ? GRP0 : GRP0d;
      if (b) {
        var c =
          (((REFP0 << 11) | (b << 3) | (7 & NUSIZ0)) << 6) +
          (player0Alt ? 20 : 0);
        (player0Enabled && player0LineSpritePointer === c) ||
          (changeAtClockPlus(a),
          (player0LineSpritePointer = c),
          player0Alt && player0DefineAlt()),
          player0Enabled ||
            ((player0Enabled = !0), augmentCollisionsPossible());
      } else
        player0Enabled &&
          (changeAtClockPlus(a),
          (player0Enabled = !1),
          (collisionsPossible &= P0C));
    }
    function player1SetShape(a) {
      if (NUSIZ1 !== a) {
        var b = NUSIZ1 ^ a,
          c = NUSIZ1;
        NUSIZ1 = a;
        var d = 7 & a,
          e = clock < HBLANK_DURATION ? 2 : clock - HBLANK_DURATION + 2;
        if (7 & b) {
          if (!player1Alt) {
            var f = e - player1Pixel;
            f < 0 ? (f += 160) : f >= 160 && (f -= 160);
            var g = playerScanOffsetsShape[160 * (7 & c) + f],
              h = playerScanOffsetsShape[160 * d + f];
            h !== g &&
              (player1Enabled && changeAtClockPlus(2),
              (player1Alt = player1Pixel >= 80 ? 1 : 2),
              (player1LineSpritePointer += 40),
              (player1AltFrom = f),
              (player1AltLength = playerCopyLengthPerShape[d]),
              192 & g
                ? (player1AltCopyOffset = 191 & g)
                : clock < HBLANK_DURATION && hMoveHitBlank
                ? (player1AltCopyOffset = 128)
                : ((player1AltCopyOffset =
                    playerScanStartPerShape[d] +
                    g * playerPixelSizePerShape[d] +
                    (1 & f)),
                  (player1AltLength -=
                    (192 & h ? 0 : h) * playerPixelSizePerShape[d])));
          }
          player1UpdateSprite(2);
        }
        if (55 & b) {
          if (
            !missile1Alt &&
            ((f = e - missile1Pixel),
            f < 0 ? (f += 160) : f >= 160 && (f -= 160),
            (g =
              missileScanOffsetsShape[160 * (((48 & c) >> 1) | (7 & c)) + f]),
            (h = missileScanOffsetsShape[160 * (((48 & a) >> 1) | d) + f]) !==
              g)
          ) {
            missile1Enabled && changeAtClockPlus(2),
              (missile1Alt = missile1Pixel >= 80 ? 1 : 2),
              (missile1LineSpritePointer += 40),
              (missile1AltFrom = f);
            var i = (48 & a) >> 4;
            (missile1AltLength = 4 + (1 << i)),
              192 & g
                ? (missile1AltCopyOffset = 191 & g)
                : clock < HBLANK_DURATION && hMoveHitBlank
                ? (missile1AltCopyOffset = 128)
                : ((missile1AltCopyOffset = 4 + (g << i) + (1 & f)),
                  (missile1AltLength -= (192 & h ? 0 : h) << i));
          }
          missile1UpdateSprite(2);
        }
      }
    }
    function player1SetSprite(a) {
      debug && debugPixel(DEBUG_P1_GR_COLOR),
        GRP1d !== a && ((GRP1d = a), VDELP1 || player1UpdateSprite(1)),
        GRP0 !== GRP0d && ((GRP0 = GRP0d), VDELP0 && player0UpdateSprite(1)),
        ENABL !== ENABLd &&
          ((ENABL = ENABLd),
          VDELBL && changeAtClockPlus(1),
          ballSetEnabled(ENABL));
    }
    function player1UpdateSprite(a) {
      var b = VDELP1 ? GRP1 : GRP1d;
      if (b) {
        var c =
          (((REFP1 << 11) | (b << 3) | (7 & NUSIZ1)) << 6) +
          (player1Alt ? 40 : 0);
        (player1Enabled && player1LineSpritePointer === c) ||
          (changeAtClockPlus(a),
          (player1LineSpritePointer = c),
          player1Alt && player1DefineAlt()),
          player1Enabled ||
            ((player1Enabled = !0), augmentCollisionsPossible());
      } else
        player1Enabled &&
          (changeAtClockPlus(a),
          (player1Enabled = !1),
          (collisionsPossible &= P1C));
    }
    function missile0UpdateSprite(a) {
      var b =
        ((((48 & NUSIZ0) >> 1) | (7 & NUSIZ0)) << 6) + (missile0Alt ? 20 : 0);
      missile0LineSpritePointer !== b &&
        (missile0Enabled
          ? (changeAtClockPlus(a),
            (missile0LineSpritePointer = b),
            missile0Alt && missile0DefineAlt())
          : (missile0LineSpritePointer = b));
    }
    function missile0SetEnabled(a) {
      a
        ? ((missile0Enabled = !0),
          augmentCollisionsPossible(),
          missile0Alt && missile0DefineAlt())
        : ((missile0Enabled = !1), (collisionsPossible &= M0C));
    }
    function missile0SetResetToPlayer(a) {
      RESMP0 !== (2 & a) &&
        (ENAM0
          ? (changeAtClock(), missile0SetEnabled(!(RESMP0 = 2 & a)))
          : (RESMP0 = 2 & a),
        RESMP0 ||
          ((missile0Pixel =
            player0Pixel + missileCenterOffsetsPerPlayerSize[7 & NUSIZ0]) >=
            160 &&
            (missile0Pixel -= 160)));
    }
    function missile1UpdateSprite(a) {
      var b =
        ((((48 & NUSIZ1) >> 1) | (7 & NUSIZ1)) << 6) + (missile1Alt ? 40 : 0);
      missile1LineSpritePointer !== b &&
        (missile1Enabled
          ? (changeAtClockPlus(a),
            (missile1LineSpritePointer = b),
            missile1Alt && missile1DefineAlt())
          : (missile1LineSpritePointer = b));
    }
    function missile1SetEnabled(a) {
      a
        ? ((missile1Enabled = !0),
          augmentCollisionsPossible(),
          missile1Alt && missile1DefineAlt())
        : ((missile1Enabled = !1), (collisionsPossible &= M1C));
    }
    function missile1SetResetToPlayer(a) {
      RESMP1 !== (2 & a) &&
        (ENAM1
          ? (changeAtClock(), missile1SetEnabled(!(RESMP1 = 2 & a)))
          : (RESMP1 = 2 & a),
        RESMP1 ||
          ((missile1Pixel =
            player1Pixel + missileCenterOffsetsPerPlayerSize[7 & NUSIZ1]) >=
            160 &&
            (missile1Pixel -= 160)));
    }
    function player0DefineAlt() {
      var a =
          (player0AltFrom << 16) |
          (player0AltLength << 8) |
          player0AltCopyOffset,
        b = (player0LineSpritePointer - 20) >> 6;
      if (player0AltControl[b] !== a) {
        for (var c = player0LineSpritePointer - 20, d = 0; d < 20; ++d)
          playerLineSprites[player0LineSpritePointer + d] =
            playerLineSprites[c + d];
        var e = player0AltFrom;
        if (128 & player0AltCopyOffset)
          for (var f = 0; f < player0AltLength; ++f)
            (playerLineSprites[player0LineSpritePointer + (e >> 3)] &= ~(
              1 <<
              (7 & e)
            )),
              ++e >= 160 && (e -= 160);
        else {
          c -= objectsLineSpritePointerDeltaToSingleCopy[7 & NUSIZ0];
          for (
            var g = player0AltCopyOffset,
              h = player0AltCopyOffset + player0AltLength;
            g < h;
            ++g
          )
            (playerLineSprites[c + (g >> 3)] >> (7 & g)) & 1
              ? (playerLineSprites[player0LineSpritePointer + (e >> 3)] |=
                  1 << (7 & e))
              : (playerLineSprites[player0LineSpritePointer + (e >> 3)] &= ~(
                  1 <<
                  (7 & e)
                )),
              ++e >= 160 && (e -= 160);
        }
        player0AltControl[b] = a;
      }
    }
    function player1DefineAlt() {
      var a =
          (player1AltFrom << 16) |
          (player1AltLength << 8) |
          player1AltCopyOffset,
        b = (player1LineSpritePointer - 40) >> 6;
      if (player1AltControl[b] !== a) {
        for (var c = player1LineSpritePointer - 40, d = 0; d < 20; ++d)
          playerLineSprites[player1LineSpritePointer + d] =
            playerLineSprites[c + d];
        var e = player1AltFrom;
        if (128 & player1AltCopyOffset)
          for (var f = 0; f < player1AltLength; ++f)
            (playerLineSprites[player1LineSpritePointer + (e >> 3)] &= ~(
              1 <<
              (7 & e)
            )),
              ++e >= 160 && (e -= 160);
        else {
          c -= objectsLineSpritePointerDeltaToSingleCopy[7 & NUSIZ1];
          for (
            var g = player1AltCopyOffset,
              h = player1AltCopyOffset + player1AltLength;
            g < h;
            ++g
          )
            (playerLineSprites[c + (g >> 3)] >> (7 & g)) & 1
              ? (playerLineSprites[player1LineSpritePointer + (e >> 3)] |=
                  1 << (7 & e))
              : (playerLineSprites[player1LineSpritePointer + (e >> 3)] &= ~(
                  1 <<
                  (7 & e)
                )),
              ++e >= 160 && (e -= 160);
        }
        player1AltControl[b] = a;
      }
    }
    function missile0DefineAlt() {
      var a =
          (missile0AltFrom << 16) |
          (missile0AltLength << 8) |
          missile0AltCopyOffset,
        b = (missile0LineSpritePointer - 20) >> 6;
      if (missile0AltControl[b] !== a) {
        for (var c = missile0LineSpritePointer - 20, d = 0; d < 20; ++d)
          missileBallLineSprites[missile0LineSpritePointer + d] =
            missileBallLineSprites[c + d];
        var e = missile0AltFrom;
        if (128 & missile0AltCopyOffset)
          for (var f = 0; f < missile0AltLength; ++f)
            (missileBallLineSprites[missile0LineSpritePointer + (e >> 3)] &= ~(
              1 <<
              (7 & e)
            )),
              ++e >= 160 && (e -= 160);
        else {
          c -= objectsLineSpritePointerDeltaToSingleCopy[7 & NUSIZ0];
          for (
            var g = missile0AltCopyOffset,
              h = missile0AltCopyOffset + missile0AltLength;
            g < h;
            ++g
          )
            (missileBallLineSprites[c + (g >> 3)] >> (7 & g)) & 1
              ? (missileBallLineSprites[missile0LineSpritePointer + (e >> 3)] |=
                  1 << (7 & e))
              : (missileBallLineSprites[missile0LineSpritePointer + (e >> 3)] &=
                  ~(1 << (7 & e))),
              ++e >= 160 && (e -= 160);
        }
        missile0AltControl[b] = a;
      }
    }
    function missile1DefineAlt() {
      var a =
          (missile1AltFrom << 16) |
          (missile1AltLength << 8) |
          missile1AltCopyOffset,
        b = (missile1LineSpritePointer - 40) >> 6;
      if (missile1AltControl[b] !== a) {
        for (var c = missile1LineSpritePointer - 40, d = 0; d < 20; ++d)
          missileBallLineSprites[missile1LineSpritePointer + d] =
            missileBallLineSprites[c + d];
        var e = missile1AltFrom;
        if (128 & missile1AltCopyOffset)
          for (var f = 0; f < missile1AltLength; ++f)
            (missileBallLineSprites[missile1LineSpritePointer + (e >> 3)] &= ~(
              1 <<
              (7 & e)
            )),
              ++e >= 160 && (e -= 160);
        else {
          c -= objectsLineSpritePointerDeltaToSingleCopy[7 & NUSIZ1];
          for (
            var g = missile1AltCopyOffset,
              h = missile1AltCopyOffset + missile1AltLength;
            g < h;
            ++g
          )
            (missileBallLineSprites[c + (g >> 3)] >> (7 & g)) & 1
              ? (missileBallLineSprites[missile1LineSpritePointer + (e >> 3)] |=
                  1 << (7 & e))
              : (missileBallLineSprites[missile1LineSpritePointer + (e >> 3)] &=
                  ~(1 << (7 & e))),
              ++e >= 160 && (e -= 160);
        }
        missile1AltControl[b] = a;
      }
    }
    function getRESxPixel() {
      if (clock >= HBLANK_DURATION + (hMoveHitBlank ? 7 : 0))
        return clock - HBLANK_DURATION;
      if (hMoveHitBlank) {
        if (clock >= HBLANK_DURATION) return -6;
        var a = (clock - hMoveHitClock - 4) >> 2;
        return a > 8 ? -6 : a > 1 ? -(a - 2) : -(158 + a);
      }
      return -158;
    }
    function checkLateHMOVE() {
      hMoveLateHit
        ? ((hMoveLateHit = !1),
          (hMoveHitBlank = hMoveLateHitBlank),
          performHMOVE())
        : (hMoveHitBlank = !1);
    }
    function updateExtendedHBLANK() {
      hMoveHitBlank !== (linePixels[HBLANK_DURATION] === hBlankColor) &&
        (hMoveHitBlank
          ? (linePixels[HBLANK_DURATION] =
              linePixels[HBLANK_DURATION + 1] =
              linePixels[HBLANK_DURATION + 2] =
              linePixels[HBLANK_DURATION + 3] =
              linePixels[HBLANK_DURATION + 4] =
              linePixels[HBLANK_DURATION + 5] =
              linePixels[HBLANK_DURATION + 6] =
              linePixels[HBLANK_DURATION + 7] =
                hBlankColor)
          : (changeClock = HBLANK_DURATION)),
        hMoveHitBlank && (renderClock = HBLANK_DURATION + 8);
    }
    function endObjectsAltStatusMidLine() {
      1 === player0Alt &&
        (player0Enabled && changeAtClock(),
        (player0Alt = 0),
        (player0LineSpritePointer -= 20)),
        1 === player1Alt &&
          (player1Enabled && changeAtClock(),
          (player1Alt = 0),
          (player1LineSpritePointer -= 40)),
        1 === missile0Alt &&
          (missile0Enabled && changeAtClock(),
          (missile0Alt = 0),
          (missile0LineSpritePointer -= 20)),
        1 === missile1Alt &&
          (missile1Enabled && changeAtClock(),
          (missile1Alt = 0),
          (missile1LineSpritePointer -= 40));
    }
    function endObjectsAltStatusEndOfLine() {
      2 === player0Alt && ((player0Alt = 0), (player0LineSpritePointer -= 20)),
        2 === player1Alt &&
          ((player1Alt = 0), (player1LineSpritePointer -= 40)),
        2 === missile0Alt &&
          ((missile0Alt = 0), (missile0LineSpritePointer -= 20)),
        2 === missile1Alt &&
          ((missile1Alt = 0), (missile1LineSpritePointer -= 40));
    }
    function vSyncSet(a) {
      debug
        ? (debugPixel(VSYNC_COLOR),
          changeAtClock(),
          (vSyncOn = 0 != (2 & a)),
          (vBlankColor = vSyncOn ? VSYNC_COLOR : DEBUG_VBLANK_COLOR))
        : (vSyncOn = 0 != (2 & a));
    }
    function generateObjectsLineSprites() {
      function a(a, b, c) {
        for (var d = 0; d < 8; ++d) a[c + d] = (b >> d) & 1;
      }
      function b(a, b, c) {
        for (var d = 0; d < 8; ++d)
          a[c + 4 * d] =
            a[c + 4 * d + 1] =
            a[c + 4 * d + 2] =
            a[c + 4 * d + 3] =
              (b >> d) & 1;
      }
      function c(a, b, c, d, e) {
        for (
          var f = (((a << 11) | (b << 3) | c) << 6) + 20 * d, g = 0;
          g < 20;
          ++g
        )
          for (var h = 0; h < 8; ++h)
            e[8 * g + h] && (playerLineSprites[f + g] |= 1 << h);
      }
      function d(a, b, c, d) {
        for (var e = (((a << 3) | b) << 6) + 20 * c, f = 0; f < 20; ++f)
          for (var g = 0; g < 8; ++g)
            d[8 * f + g] && (missileBallLineSprites[e + f] |= 1 << g);
      }
      for (var e = new Uint8Array(160), f = 0; f <= 1; ++f)
        for (var g = 0; g < 256; ++g) {
          var h = f ? g : jt.Util.reverseInt8(g);
          a(e, h, 5),
            c(f, g, 0, 0, e),
            a(e, h, 21),
            c(f, g, 1, 0, e),
            a(e, h, 37),
            c(f, g, 3, 0, e),
            a(e, 0, 21),
            c(f, g, 2, 0, e),
            a(e, h, 69),
            c(f, g, 6, 0, e),
            a(e, 0, 37),
            c(f, g, 4, 0, e),
            a(e, 0, 69),
            (e[5] = 0),
            (function (a, b, c) {
              for (var d = 0; d < 8; ++d)
                a[c + 2 * d] = a[c + 2 * d + 1] = (b >> d) & 1;
            })(e, h, 6),
            c(f, g, 5, 0, e),
            b(e, h, 6),
            c(f, g, 7, 0, e),
            b(e, 0, 6);
        }
      jt.Util.arrayFill(e, 0);
      for (var i = 0; i < 4; ++i)
        (h = (1 << (1 << i)) - 1),
          a(e, h, 4),
          d(i, 0, 0, e),
          d(i, 5, 0, e),
          d(i, 7, 0, e),
          a(e, h, 20),
          d(i, 1, 0, e),
          a(e, h, 36),
          d(i, 3, 0, e),
          a(e, 0, 20),
          d(i, 2, 0, e),
          a(e, h, 68),
          d(i, 6, 0, e),
          a(e, 0, 36),
          d(i, 4, 0, e),
          a(e, 0, 4),
          a(e, 0, 68);
    }
    function generateObjectsCopiesOffsets() {
      var a = new Uint8Array(40);
      (a[0] = 0),
        (a[1] = 1),
        (a[2] = 2),
        (a[3] = 3),
        jt.Util.arrayFill(playerCopyOffsetsReset, 128),
        jt.Util.arrayFill(playerScanOffsetsShape, 128);
      for (var b = 0; b < 13; ++b) {
        var c = b - a[b];
        (playerCopyOffsetsReset[0 + b] = c),
          (playerCopyOffsetsReset[160 + b] = c),
          (playerCopyOffsetsReset[160 + b + 16] = c),
          (playerCopyOffsetsReset[320 + b] = c),
          (playerCopyOffsetsReset[320 + b + 32] = c),
          (playerCopyOffsetsReset[480 + b] = c),
          (playerCopyOffsetsReset[480 + b + 16] = c),
          (playerCopyOffsetsReset[480 + b + 32] = c),
          (playerCopyOffsetsReset[640 + b] = c),
          (playerCopyOffsetsReset[640 + b + 64] = c),
          (playerCopyOffsetsReset[960 + b] = c),
          (playerCopyOffsetsReset[960 + b + 32] = c),
          (playerCopyOffsetsReset[960 + b + 64] = c),
          (c = b < 5 ? 64 | b : b - 5),
          (playerScanOffsetsShape[0 + b] = c),
          (playerScanOffsetsShape[160 + b] = c),
          (playerScanOffsetsShape[160 + b + 16] = c),
          (playerScanOffsetsShape[320 + b] = c),
          (playerScanOffsetsShape[320 + b + 32] = c),
          (playerScanOffsetsShape[480 + b] = c),
          (playerScanOffsetsShape[480 + b + 16] = c),
          (playerScanOffsetsShape[480 + b + 32] = c),
          (playerScanOffsetsShape[640 + b] = c),
          (playerScanOffsetsShape[640 + b + 64] = c),
          (playerScanOffsetsShape[960 + b] = c),
          (playerScanOffsetsShape[960 + b + 32] = c),
          (playerScanOffsetsShape[960 + b + 64] = c);
      }
      for (b = 0; b < 22; b++)
        (c = b - a[b]),
          (playerCopyOffsetsReset[800 + b] = c),
          (c = b < 6 ? 64 | b : (b - 6) >> 1),
          (playerScanOffsetsShape[800 + b] = c);
      for (b = 0; b < 38; b++)
        (c = b - a[b]),
          (playerCopyOffsetsReset[1120 + b] = c),
          (c = b < 6 ? 64 | b : (b - 6) >> 2),
          (playerScanOffsetsShape[1120 + b] = c);
      jt.Util.arrayFill(missileCopyOffsetsReset, 128),
        jt.Util.arrayFill(missileScanOffsetsShape, 128);
      for (var d = 0; d <= 3; ++d) {
        var e = 4 + (1 << d);
        for (b = 0; b < e; ++b)
          (c = b - a[b]),
            (missileCopyOffsetsReset[8 * d * 160 + 0 + b] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 160 + b] = c),
            (missileCopyOffsetsReset[8 * d + 160 + b + 16] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 320 + b] = c),
            (missileCopyOffsetsReset[8 * d + 320 + b + 32] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 480 + b] = c),
            (missileCopyOffsetsReset[8 * d + 480 + b + 16] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 480 + b + 32] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 640 + b] = c),
            (missileCopyOffsetsReset[8 * d + 640 + b + 64] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 800 + b] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 960 + b] = c),
            (missileCopyOffsetsReset[8 * d + 960 + b + 32] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 960 + b + 64] = c),
            (missileCopyOffsetsReset[8 * d * 160 + 1120 + b] = c),
            (c = b < 4 ? 64 | b : (b - 4) >> d),
            (missileScanOffsetsShape[8 * d * 160 + 0 + b] = c),
            (missileScanOffsetsShape[8 * d * 160 + 160 + b] = c),
            (missileScanOffsetsShape[8 * d + 160 + b + 16] = c),
            (missileScanOffsetsShape[8 * d * 160 + 320 + b] = c),
            (missileScanOffsetsShape[8 * d + 320 + b + 32] = c),
            (missileScanOffsetsShape[8 * d * 160 + 480 + b] = c),
            (missileScanOffsetsShape[8 * d + 480 + b + 16] = c),
            (missileScanOffsetsShape[8 * d * 160 + 480 + b + 32] = c),
            (missileScanOffsetsShape[8 * d * 160 + 640 + b] = c),
            (missileScanOffsetsShape[8 * d + 640 + b + 64] = c),
            (missileScanOffsetsShape[8 * d * 160 + 800 + b] = c),
            (missileScanOffsetsShape[8 * d * 160 + 960 + b] = c),
            (missileScanOffsetsShape[8 * d + 960 + b + 32] = c),
            (missileScanOffsetsShape[8 * d * 160 + 960 + b + 64] = c),
            (missileScanOffsetsShape[8 * d * 160 + 1120 + b] = c);
      }
    }
    var self = this;
    (this.powerOn = function () {
      jt.Util.arrayFill(linePixels, VBLANK_COLOR),
        jt.Util.arrayFill(debugPixels, 0),
        audioSignal.getChannel0().setVolume(0),
        audioSignal.getChannel1().setVolume(0),
        initLatchesAtPowerOn(),
        (hMoveLateHit = !1),
        (changeClock = changeClockPrevLine = -1),
        audioSignal.powerOn(),
        (powerOn = !0);
    }),
      (this.powerOff = function () {
        (powerOn = !1), videoSignal.signalOff(), audioSignal.powerOff();
      }),
      (this.frame = function () {
        do {
          (clock = 0),
            (changeClock = -1),
            (renderClock = HBLANK_DURATION),
            debug &&
              (debugLevel >= 4
                ? jt.Util.arrayFill(linePixels, 4278190080)
                : debugLevel >= 2 && debugLevel < 4 && (changeClock = 0)),
            checkLateHMOVE(),
            bus.clockPulse(),
            cpu.setRDY(!0);
          for (var a = 0; a < 22; ++a) (clock += 3), bus.clockPulse();
          updateExtendedHBLANK();
          for (var b = 0; b < 27; ++b) (clock += 3), bus.clockPulse();
          audioSignal.audioClockPulse(), endObjectsAltStatusMidLine();
          for (var c = 0; c < 26; ++c) (clock += 3), bus.clockPulse();
          audioSignal.audioClockPulse(), finishLine();
        } while (!videoSignal.nextLine(linePixels, vSyncOn));
        videoSignal.finishFrame();
      }),
      (this.connectBus = function (a) {
        bus = a;
      }),
      (this.getVideoOutput = function () {
        return videoSignal;
      }),
      (this.getAudioOutput = function () {
        return audioSignal;
      }),
      (this.setVideoStandard = function (a) {
        videoSignal.setVideoStandard(a), (palette = jt.TiaPalettes[a.name]);
      }),
      (this.debug = function (a) {
        (debugLevel = a > 4 ? 0 : a),
          (debug = 0 !== debugLevel),
          (pia.debug = debug),
          debug ? debugSetColors() : debugRestoreColors();
      }),
      (this.showDebugMessage = function () {
        videoSignal.showOSD(
          debug ? "Debug Level " + debugLevel : "Debug OFF",
          !0
        );
      }),
      (this.debugNoCollisions = function (a) {
        debugNoCollisions = !!a;
      }),
      (this.getDebugNoCollisions = function () {
        return debugNoCollisions;
      }),
      (this.read = function (a) {
        switch (a & READ_ADDRESS_MASK) {
          case 0:
            return (
              updateToClock(),
              ((1024 & collisions) >> 3) | ((16384 & collisions) >> 8)
            );
          case 1:
            return (
              updateToClock(),
              ((8192 & collisions) >> 6) | ((512 & collisions) >> 3)
            );
          case 2:
            return (
              updateToClock(),
              ((4096 & collisions) >> 5) | ((2048 & collisions) >> 5)
            );
          case 3:
            return (
              updateToClock(),
              ((256 & collisions) >> 1) | ((128 & collisions) >> 1)
            );
          case 4:
            return (
              updateToClock(),
              ((32 & collisions) << 2) | ((16 & collisions) << 2)
            );
          case 5:
            return (
              updateToClock(), ((8 & collisions) << 4) | ((4 & collisions) << 4)
            );
          case 6:
            return updateToClock(), (2 & collisions) << 6;
          case 7:
            return (
              updateToClock(), ((32768 & collisions) >> 8) | (64 & collisions)
            );
          case 8:
            return INPT0;
          case 9:
            return INPT1;
          case 10:
            return INPT2;
          case 11:
            return INPT3;
          case 12:
            return INPT4;
          case 13:
            return INPT5;
          default:
            return 0;
        }
      }),
      (this.write = function (a, b) {
        switch (a & WRITE_ADDRESS_MASK) {
          case 0:
            return void vSyncSet(b);
          case 1:
            return void vBlankSet(b);
          case 2:
            return (
              cpu.setRDY(!1), void (debug && debugPixel(DEBUG_WSYNC_COLOR))
            );
          case 9:
            return void (
              COLUBK === b ||
              debug ||
              (changeAtClock(),
              (COLUBK = b),
              (playfieldBackground = palette[b]))
            );
          case 13:
            return void (
              PF0 !== (240 & b) &&
              (changePlayfieldAtClock(),
              (PF0 = 240 & b),
              playfieldUpdateSprite())
            );
          case 14:
            return void (
              PF1 !== b &&
              (changePlayfieldAtClock(), (PF1 = b), playfieldUpdateSprite())
            );
          case 15:
            return void (
              PF2 !== b &&
              (changePlayfieldAtClock(), (PF2 = b), playfieldUpdateSprite())
            );
          case 8:
            return void (
              COLUPF === b ||
              debug ||
              (((playfieldEnabled && !playfieldScoreMode) || ballEnabled) &&
                changeAtClock(),
              (COLUPF = b),
              (ballColor = palette[b]),
              playfieldScoreMode ||
                (playfieldColor =
                  playfieldLeftColor =
                  playfieldRightColor =
                    ballColor))
            );
          case 10:
            return void (CTRLPF !== b && playfieldSetShape(b));
          case 20:
            return void hitRESBL();
          case 31:
            return void (
              ENABLd !== (2 & b) &&
              ((ENABLd = 2 & b),
              VDELBL || (changeAtClock(), ballSetEnabled(ENABLd)))
            );
          case 39:
            return void (
              VDELBL !== (1 & b) &&
              ((VDELBL = 1 & b),
              ENABL !== ENABLd &&
                (changeAtClock(), ballSetEnabled(VDELBL ? ENABL : ENABLd)))
            );
          case 4:
            return void player0SetShape(b);
          case 6:
            return void (
              COLUP0 === b ||
              debug ||
              ((COLUP0 = b),
              (player0Enabled ||
                missile0Enabled ||
                (playfieldEnabled && playfieldScoreMode)) &&
                changeAtClock(),
              (player0Color = missile0Color = palette[b]),
              playfieldScoreMode && (playfieldLeftColor = player0Color))
            );
          case 11:
            return void (
              REFP0 !== ((b >> 3) & 1) &&
              ((REFP0 = (b >> 3) & 1), player0UpdateSprite(0))
            );
          case 16:
            return void hitRESP0();
          case 27:
            return void player0SetSprite(b);
          case 37:
            return void (
              VDELP0 !== (1 & b) &&
              ((VDELP0 = 1 & b), GRP0 !== GRP0d && player0UpdateSprite(0))
            );
          case 5:
            return void player1SetShape(b);
          case 7:
            return void (
              COLUP1 === b ||
              debug ||
              ((COLUP1 = b),
              (player1Enabled ||
                missile1Enabled ||
                (playfieldEnabled && playfieldScoreMode)) &&
                changeAtClock(),
              (player1Color = missile1Color = palette[b]),
              playfieldScoreMode && (playfieldRightColor = player1Color))
            );
          case 12:
            return void (
              REFP1 !== ((b >> 3) & 1) &&
              ((REFP1 = (b >> 3) & 1), player1UpdateSprite(0))
            );
          case 17:
            return void hitRESP1();
          case 28:
            return void player1SetSprite(b);
          case 38:
            return void (
              VDELP1 !== (1 & b) &&
              ((VDELP1 = 1 & b), GRP1 !== GRP1d && player1UpdateSprite(0))
            );
          case 18:
            return void hitRESM0();
          case 29:
            return void (
              ENAM0 !== (2 & b) &&
              ((ENAM0 = 2 & b),
              RESMP0 || (changeAtClock(), missile0SetEnabled(ENAM0)))
            );
          case 40:
            return void missile0SetResetToPlayer(b);
          case 19:
            return void hitRESM1();
          case 30:
            return void (
              ENAM1 !== (2 & b) &&
              ((ENAM1 = 2 & b),
              RESMP1 || (changeAtClock(), missile1SetEnabled(ENAM1)))
            );
          case 41:
            return void missile1SetResetToPlayer(b);
          case 32:
            return void (HMP0 = (b > 127 ? -16 : 0) + (b >> 4));
          case 33:
            return void (HMP1 = (b > 127 ? -16 : 0) + (b >> 4));
          case 34:
            return void (HMM0 = (b > 127 ? -16 : 0) + (b >> 4));
          case 35:
            return void (HMM1 = (b > 127 ? -16 : 0) + (b >> 4));
          case 36:
            return void (HMBL = (b > 127 ? -16 : 0) + (b >> 4));
          case 42:
            return void hitHMOVE();
          case 43:
            return void (HMP0 = HMP1 = HMM0 = HMM1 = HMBL = 0);
          case 44:
            return changeAtClock(), void (collisions = 0);
          case 21:
            return void (
              AUDC0 !== b &&
              ((AUDC0 = b), audioSignal.getChannel0().setControl(15 & b))
            );
          case 22:
            return void (
              AUDC1 !== b &&
              ((AUDC1 = b), audioSignal.getChannel1().setControl(15 & b))
            );
          case 23:
            return void (
              AUDF0 !== b &&
              ((AUDF0 = b), audioSignal.getChannel0().setDivider(1 + (31 & b)))
            );
          case 24:
            return void (
              AUDF1 !== b &&
              ((AUDF1 = b), audioSignal.getChannel1().setDivider(1 + (31 & b)))
            );
          case 25:
            return void (
              AUDV0 !== b &&
              ((AUDV0 = b), audioSignal.getChannel0().setVolume(15 & b))
            );
          case 26:
            return void (
              AUDV1 !== b &&
              ((AUDV1 = b), audioSignal.getChannel1().setVolume(15 & b))
            );
        }
      });
    var finishLine = function () {
        changeClock >= 0
          ? (renderLineTo(LINE_WIDTH), (changeClockPrevLine = changeClock))
          : changeClockPrevLine >= 0 &&
            (renderLineTo(changeClockPrevLine), (changeClockPrevLine = -1)),
          endObjectsAltStatusEndOfLine(),
          paddle0Position >= 0 &&
            !paddleCapacitorsGrounded &&
            (INPT0 < 128 &&
              ++paddle0CapacitorCharge >= paddle0Position &&
              (INPT0 |= 128),
            INPT1 < 128 &&
              ++paddle1CapacitorCharge >= paddle1Position &&
              (INPT1 |= 128)),
          debugLevel >= 1 && processDebugPixelsInLine();
      },
      playfieldSetShape = function (a) {
        if (CTRLPF !== a) {
          var b = 7 & a;
          b !== (7 & CTRLPF) &&
            (playfieldEnabled && changeAtClock(),
            (b = 0 != (1 & a)),
            playfieldReflected !== b &&
              ((playfieldReflected = b), playfieldUpdateSpriteR()),
            (b = 0 != (2 & a)),
            playfieldScoreMode !== b &&
              ((playfieldScoreMode = b),
              debug ||
                (b
                  ? ((playfieldLeftColor = player0Color),
                    (playfieldRightColor = player1Color))
                  : (playfieldColor =
                      playfieldLeftColor =
                      playfieldRightColor =
                        ballColor))),
            (playfieldPriority = 0 != (4 & a))),
            (b = 48 & a),
            b !== (48 & CTRLPF) &&
              (ballEnabled && changeAtClock(),
              (ballLineSpritePointer = (b >> 1) << 6)),
            (CTRLPF = a);
        }
      },
      hitRESP0 = function () {
        debug && debugPixel(DEBUG_P0_RES_COLOR);
        var a = getRESxPixel(),
          b = a >= 0 ? a : -a;
        if (player0Pixel !== b) {
          player0Enabled && changeAtClock();
          var c = a >= 0 ? b : 0,
            d = c - player0Pixel;
          d < 0 && (d += 160), (player0Pixel = b);
          var e = 7 & NUSIZ0;
          if (player0Alt) {
            if (d <= playerCopyLengthPerShape[e]) return;
          } else player0LineSpritePointer += 20;
          var f = c - b;
          f < -100 && (f += 160),
            (player0Alt = b >= 80 ? 1 : 2),
            (player0AltFrom = f >= 0 ? f : 160 + f),
            (player0AltLength = playerCopyLengthPerShape[e] - f),
            (player0AltCopyOffset = playerCopyOffsetsReset[160 * e + d]),
            player0Enabled && player0DefineAlt();
        }
      },
      hitRESP1 = function () {
        debug && debugPixel(DEBUG_P1_RES_COLOR);
        var a = getRESxPixel(),
          b = a >= 0 ? a : -a;
        if (player1Pixel !== b) {
          player1Enabled && changeAtClock();
          var c = a >= 0 ? b : 0,
            d = c - player1Pixel;
          d < 0 && (d += 160), (player1Pixel = b);
          var e = 7 & NUSIZ1;
          if (player1Alt) {
            if (d <= playerCopyLengthPerShape[e]) return;
          } else player1LineSpritePointer += 40;
          var f = c - b;
          f < -100 && (f += 160),
            (player1Alt = b >= 80 ? 1 : 2),
            (player1AltFrom = f >= 0 ? f : 160 + f),
            (player1AltLength = playerCopyLengthPerShape[e] - f),
            (player1AltCopyOffset = playerCopyOffsetsReset[160 * e + d]),
            player1Enabled && player1DefineAlt();
        }
      },
      hitRESM0 = function () {
        debug && debugPixel(DEBUG_M0_COLOR);
        var a = getRESxPixel(),
          b = a >= 0 ? a : -a;
        if (missile0Pixel !== b) {
          missile0Enabled && changeAtClock();
          var c = a >= 0 ? b : 0,
            d = c - missile0Pixel;
          if ((d < 0 && (d += 160), (missile0Pixel = b), missile0Alt)) {
            if (d <= 4 + (1 << ((48 & NUSIZ0) >> 4))) return;
          } else missile0LineSpritePointer += 20;
          var e = c - b;
          e < -100 && (e += 160),
            (missile0Alt = b >= 80 ? 1 : 2),
            (missile0AltFrom = e >= 0 ? e : 160 + e),
            (missile0AltLength = 4 + (1 << ((48 & NUSIZ0) >> 4)) - e),
            (missile0AltCopyOffset =
              missileCopyOffsetsReset[
                160 * (((48 & NUSIZ0) >> 1) | (7 & NUSIZ0)) + d
              ]),
            missile0Enabled && missile0DefineAlt();
        }
      },
      hitRESM1 = function () {
        debug && debugPixel(DEBUG_M1_COLOR);
        var a = getRESxPixel(),
          b = a >= 1 ? a : -a;
        if (missile1Pixel !== b) {
          missile1Enabled && changeAtClock();
          var c = a >= 0 ? b : 0,
            d = c - missile1Pixel;
          if ((d < 0 && (d += 160), (missile1Pixel = b), missile1Alt)) {
            if (d <= 4 + (1 << ((48 & NUSIZ1) >> 4))) return;
          } else missile1LineSpritePointer += 40;
          var e = c - b;
          e < -100 && (e += 160),
            (missile1Alt = b >= 80 ? 1 : 2),
            (missile1AltFrom = e >= 0 ? e : 160 + e),
            (missile1AltLength = 4 + (1 << ((48 & NUSIZ1) >> 4)) - e),
            (missile1AltCopyOffset =
              missileCopyOffsetsReset[
                160 * (((48 & NUSIZ1) >> 1) | (7 & NUSIZ1)) + d
              ]),
            missile1Enabled && missile1DefineAlt();
        }
      },
      hitRESBL = function () {
        debug && debugPixel(DEBUG_BL_COLOR);
        var a = getRESxPixel(),
          b = a >= 0 ? a : -a;
        ballPixel !== b && (ballEnabled && changeAtClock(), (ballPixel = b));
      },
      hitHMOVE = function () {
        if ((debug && debugPixel(DEBUG_HMOVE_COLOR), clock < HBLANK_DURATION))
          return (
            (hMoveHitClock = clock), (hMoveHitBlank = !0), void performHMOVE()
          );
        clock < 219 ||
          ((hMoveHitClock = 160 - clock),
          (hMoveLateHit = !0),
          (hMoveLateHitBlank = clock >= 225));
      },
      performHMOVE = function () {
        var a,
          b = !1;
        (a = hMoveHitBlank ? HMP0 : HMP0 + 8),
          0 !== a &&
            ((player0Pixel -= a),
            player0Pixel >= 160
              ? (player0Pixel -= 160)
              : player0Pixel < 0 && (player0Pixel += 160),
            player0Enabled && (b = !0)),
          (a = hMoveHitBlank ? HMP1 : HMP1 + 8),
          0 !== a &&
            ((player1Pixel -= a),
            player1Pixel >= 160
              ? (player1Pixel -= 160)
              : player1Pixel < 0 && (player1Pixel += 160),
            player1Enabled && (b = !0)),
          (a = hMoveHitBlank ? HMM0 : HMM0 + 8),
          0 !== a &&
            ((missile0Pixel -= a),
            missile0Pixel >= 160
              ? (missile0Pixel -= 160)
              : missile0Pixel < 0 && (missile0Pixel += 160),
            missile0Enabled && (b = !0)),
          (a = hMoveHitBlank ? HMM1 : HMM1 + 8),
          0 !== a &&
            ((missile1Pixel -= a),
            missile1Pixel >= 160
              ? (missile1Pixel -= 160)
              : missile1Pixel < 0 && (missile1Pixel += 160),
            missile1Enabled && (b = !0)),
          (a = hMoveHitBlank ? HMBL : HMBL + 8),
          0 !== a &&
            ((ballPixel -= a),
            ballPixel >= 160
              ? (ballPixel -= 160)
              : ballPixel < 0 && (ballPixel += 160),
            ballEnabled && (b = !0)),
          b &&
            (changeClock = hMoveHitBlank
              ? HBLANK_DURATION + 8
              : HBLANK_DURATION);
      },
      vBlankSet = function (a) {
        var b = 0 != (2 & a);
        vBlankOn !== b && (changeVBlankAtClockPlus1(), (vBlankOn = b)),
          0 != (64 & a)
            ? (controlsButtonsLatched = !0)
            : ((controlsButtonsLatched = !1),
              controlsJOY0ButtonPressed ? (INPT4 &= 127) : (INPT4 |= 128),
              controlsJOY1ButtonPressed ? (INPT5 &= 127) : (INPT5 |= 128)),
          0 != (128 & a)
            ? ((paddleCapacitorsGrounded = !0),
              (paddle0CapacitorCharge = paddle1CapacitorCharge = 0),
              (INPT0 &= 127),
              (INPT1 &= 127),
              (INPT2 &= 127),
              (INPT3 &= 127))
            : (paddleCapacitorsGrounded = !1);
      },
      initLatchesAtPowerOn = function () {
        (collisions = 0),
          (INPT0 = INPT1 = INPT2 = INPT3 = 0),
          (INPT4 = INPT5 = 128);
      },
      debugPixel = function (a) {
        debugPixels[clock] = a;
      },
      processDebugPixelsInLine = function () {
        if (
          (jt.Util.arrayFillSegment(
            linePixels,
            0,
            HBLANK_DURATION + (hMoveHitBlank ? 8 : 0),
            hBlankColor
          ),
          debugLevel >= 3 && videoSignal.monitor.currentLine() % 10 == 0)
        )
          for (var a = 0; a < LINE_WIDTH; a++)
            debugPixels[a] ||
              (a < HBLANK_DURATION
                ? (a % 6 != 0 && 66 != a && 63 != a) ||
                  (debugPixels[a] = DEBUG_MARKS_COLOR)
                : (a - HBLANK_DURATION - 1) % 6 == 0 &&
                  (debugPixels[a] = DEBUG_MARKS_COLOR));
        if (debugLevel >= 2)
          for (a = 0; a < LINE_WIDTH; a++)
            debugPixels[a] &&
              ((linePixels[a] = debugPixels[a]), (debugPixels[a] = 0));
      },
      debugSetColors = function () {
        (player0Color = DEBUG_P0_COLOR),
          (player1Color = DEBUG_P1_COLOR),
          (missile0Color = DEBUG_M0_COLOR),
          (missile1Color = DEBUG_M1_COLOR),
          (ballColor = DEBUG_BL_COLOR),
          (playfieldColor =
            playfieldLeftColor =
            playfieldRightColor =
              DEBUG_PF_COLOR),
          (playfieldBackground = DEBUG_BK_COLOR),
          (hBlankColor = debugLevel >= 1 ? DEBUG_HBLANK_COLOR : HBLANK_COLOR),
          (vBlankColor = debugLevel >= 1 ? DEBUG_VBLANK_COLOR : VBLANK_COLOR);
      },
      debugRestoreColors = function () {
        (hBlankColor = HBLANK_COLOR),
          (vBlankColor = VBLANK_COLOR),
          (playfieldBackground = palette[0]),
          jt.Util.arrayFill(linePixels, hBlankColor),
          changeAtClock();
      },
      info = function (a) {
        console.error(
          "Line: " +
            videoSignal.monitor.currentLine() +
            ", Pixel: " +
            clock +
            ". " +
            a
        );
      },
      debugInfo = function (a) {
        debug &&
          console.error(
            "Line: " +
              videoSignal.monitor.currentLine() +
              ", Pixel: " +
              clock +
              ". " +
              a
          );
      },
      controls = jt.ConsoleControls;
    (this.controlStateChanged = function (a, b) {
      switch (a) {
        case controls.JOY0_BUTTON:
          return void (b
            ? ((controlsJOY0ButtonPressed = !0), (INPT4 &= 127))
            : ((controlsJOY0ButtonPressed = !1),
              controlsButtonsLatched || (INPT4 |= 128)));
        case controls.JOY1_BUTTON:
          return void (b
            ? ((controlsJOY1ButtonPressed = !0), (INPT5 &= 127))
            : ((controlsJOY1ButtonPressed = !1),
              controlsButtonsLatched || (INPT5 |= 128)));
      }
      if (b)
        switch (a) {
          case controls.DEBUG:
            return self.debug(debugLevel + 1), void self.showDebugMessage();
          case controls.SHOW_INFO:
            return void videoSignal.toggleShowInfo();
          case controls.NO_COLLISIONS:
            self.debugNoCollisions(!debugNoCollisions),
              videoSignal.showOSD(
                debugNoCollisions ? "No Collisions: ON" : "No Collisions: OFF",
                !0
              );
        }
    }),
      (this.controlValueChanged = function (a, b) {
        switch (a) {
          case controls.PADDLE0_POSITION:
            return void (paddle0Position = b);
          case controls.PADDLE1_POSITION:
            return void (paddle1Position = b);
        }
      }),
      (this.saveState = function (a) {
        var b = {
          ccp: changeClockPrevLine,
          lpx: jt.Util.storeInt32BitArrayToStringBase64(linePixels),
          vs: vSyncOn,
          vb: vBlankOn,
          pfe: playfieldEnabled,
          pfl: playfieldPatternL,
          pfr: playfieldPatternR,
          pfc: playfieldColor,
          pflc: playfieldLeftColor,
          pfrc: playfieldRightColor,
          pfb: playfieldBackground,
          pfrl: playfieldReflected,
          pfsc: playfieldScoreMode,
          pfp: playfieldPriority,
          be: ballEnabled,
          bx: ballPixel,
          blp: ballLineSpritePointer,
          bc: ballColor,
          p0e: player0Enabled,
          p0x: player0Pixel,
          p0lp: player0LineSpritePointer,
          p0a: player0Alt,
          p0af: player0AltFrom,
          p0al: player0AltLength,
          p0ao: player0AltCopyOffset,
          p0c: player0Color,
          p1e: player1Enabled,
          p1x: player1Pixel,
          p1lp: player1LineSpritePointer,
          p1a: player1Alt,
          p1af: player1AltFrom,
          p1al: player1AltLength,
          p1ao: player1AltCopyOffset,
          p1c: player1Color,
          m0e: missile0Enabled,
          m0x: missile0Pixel,
          m0lp: missile0LineSpritePointer,
          m0a: missile0Alt,
          m0af: missile0AltFrom,
          m0al: missile0AltLength,
          m0ao: missile0AltCopyOffset,
          m0c: missile0Color,
          m1e: missile1Enabled,
          m1x: missile1Pixel,
          m1lp: missile1LineSpritePointer,
          m1a: missile1Alt,
          m1af: missile1AltFrom,
          m1al: missile1AltLength,
          m1ao: missile1AltCopyOffset,
          m1c: missile1Color,
          hmh: hMoveHitBlank,
          hmc: hMoveHitClock,
          hmlh: hMoveLateHit,
          hmlb: hMoveLateHitBlank,
          co: collisions,
          cop: collisionsPossible,
          cod: debugNoCollisions,
          cbl: controlsButtonsLatched,
          j0p: controlsJOY0ButtonPressed,
          j1p: controlsJOY1ButtonPressed,
          pcg: paddleCapacitorsGrounded,
          pd0: paddle0Position,
          pd0c: paddle0CapacitorCharge,
          pd1: paddle1Position,
          pd1c: paddle1CapacitorCharge,
          CTRLPF: CTRLPF,
          COLUPF: COLUPF,
          COLUBK: COLUBK,
          PF0: PF0,
          PF1: PF1,
          PF2: PF2,
          ENABL: ENABL,
          ENABLd: ENABLd,
          VDELBL: VDELBL,
          NUSIZ0: NUSIZ0,
          COLUP0: COLUP0,
          REFP0: REFP0,
          GRP0: GRP0,
          GRP0d: GRP0d,
          VDELP0: VDELP0,
          NUSIZ1: NUSIZ1,
          COLUP1: COLUP1,
          REFP1: REFP1,
          GRP1: GRP1,
          GRP1d: GRP1d,
          VDELP1: VDELP1,
          ENAM0: ENAM0,
          RESMP0: RESMP0,
          ENAM1: ENAM1,
          RESMP1: RESMP1,
          HMP0: HMP0,
          HMP1: HMP1,
          HMM0: HMM0,
          HMM1: HMM1,
          HMBL: HMBL,
          AUDC0: AUDC0,
          AUDC1: AUDC1,
          AUDF0: AUDF0,
          AUDF1: AUDF1,
          AUDV0: AUDV0,
          AUDV1: AUDV1,
        };
        return a && (b.dl = debugLevel), b;
      }),
      (this.loadState = function (a) {
        (changeClockPrevLine = a.ccp),
          jt.Util.restoreStringBase64ToInt32BitArray(a.lpx, linePixels),
          (vSyncOn = a.vs),
          (vBlankOn = a.vb),
          (playfieldEnabled = a.pfe),
          (playfieldPatternL = 0 | a.pfl),
          (playfieldPatternR = 0 | a.pfr),
          (playfieldColor = 0 | a.pfc),
          (playfieldLeftColor = 0 | a.pflc),
          (playfieldRightColor = 0 | a.pfrc),
          (playfieldBackground = 0 | a.pfb),
          (playfieldReflected = a.pfrl),
          (playfieldScoreMode = a.pfsc),
          (playfieldPriority = a.pfp),
          (ballEnabled = a.be),
          (ballPixel = 0 | a.bx),
          (ballLineSpritePointer = 0 | a.blp),
          (ballColor = 0 | a.bc),
          (player0Enabled = a.p0e),
          (player0Pixel = 0 | a.p0x),
          (player0LineSpritePointer = 0 | a.p0lp),
          (player0Alt = 0 | a.p0a),
          (player0AltFrom = 0 | a.p0af),
          (player0AltLength = 0 | a.p0al),
          (player0AltCopyOffset = 0 | a.p0ao),
          jt.Util.arrayFill(player0AltControl, 0),
          (player0Color = 0 | a.p0c),
          (player1Enabled = a.p1e),
          (player1Pixel = 0 | a.p1x),
          (player1LineSpritePointer = 0 | a.p1lp),
          (player1Alt = 0 | a.p1a),
          (player1AltFrom = 0 | a.p1af),
          (player1AltLength = 0 | a.p1al),
          (player1AltCopyOffset = 0 | a.p1ao),
          jt.Util.arrayFill(player1AltControl, 0),
          (player1Color = 0 | a.p1c),
          (missile0Enabled = a.m0e),
          (missile0Pixel = 0 | a.m0x),
          (missile0LineSpritePointer = 0 | a.m0lp),
          (missile0Alt = 0 | a.m0a),
          (missile0AltFrom = 0 | a.m0af),
          (missile0AltLength = 0 | a.m0al),
          (missile0AltCopyOffset = 0 | a.m0ao),
          jt.Util.arrayFill(missile0AltControl, 0),
          (missile0Color = 0 | a.m0c),
          (missile1Enabled = a.m1e),
          (missile1Pixel = 0 | a.m1x),
          (missile1LineSpritePointer = 0 | a.m1lp),
          (missile1Alt = 0 | a.m1a),
          (missile1AltFrom = 0 | a.m1af),
          (missile1AltLength = 0 | a.m1al),
          (missile1AltCopyOffset = 0 | a.m1ao),
          jt.Util.arrayFill(missile1AltControl, 0),
          (missile1Color = 0 | a.m1c),
          (hMoveHitBlank = a.hmh),
          (hMoveHitClock = 0 | a.hmc),
          (hMoveLateHit = a.hmlh),
          (hMoveLateHitBlank = a.hmlb),
          (collisions = 0 | a.co),
          (collisionsPossible = 0 | a.cop),
          void 0 !== a.cod && (debugNoCollisions = a.cod),
          void 0 !== a.cbl &&
            ((controlsButtonsLatched = a.cbl),
            (controlsJOY0ButtonPressed = a.j0p),
            (controlsJOY1ButtonPressed = a.j1p),
            (paddleCapacitorsGrounded = a.pcg),
            (paddle0Position = a.pd0),
            (paddle0CapacitorCharge = a.pd0c),
            (paddle1Position = a.pd1),
            (paddle1CapacitorCharge = a.pd1c)),
          (CTRLPF = 0 | a.CTRLPF),
          (COLUPF = 0 | a.COLUPF),
          (COLUBK = 0 | a.COLUBK),
          (PF0 = 0 | a.PF0),
          (PF1 = 0 | a.PF1),
          (PF2 = 0 | a.PF2),
          (ENABL = 0 | a.ENABL),
          (ENABLd = 0 | a.ENABLd),
          (VDELBL = 0 | a.VDELBL),
          (NUSIZ0 = 0 | a.NUSIZ0),
          (COLUP0 = 0 | a.COLUP0),
          (REFP0 = 0 | a.REFP0),
          (GRP0 = 0 | a.GRP0),
          (GRP0d = 0 | a.GRP0d),
          (VDELP0 = 0 | a.VDELP0),
          (NUSIZ1 = 0 | a.NUSIZ1),
          (COLUP1 = 0 | a.COLUP1),
          (REFP1 = 0 | a.REFP1),
          (GRP1 = 0 | a.GRP1),
          (GRP1d = 0 | a.GRP1d),
          (VDELP1 = 0 | a.VDELP1),
          (ENAM0 = 0 | a.ENAM0),
          (RESMP0 = 0 | a.RESMP0),
          (ENAM1 = 0 | a.ENAM1),
          (RESMP1 = 0 | a.RESMP1),
          (HMP0 = 0 | a.HMP0),
          (HMP1 = 0 | a.HMP1),
          (HMM0 = 0 | a.HMM0),
          (HMM1 = 0 | a.HMM1),
          (HMBL = 0 | a.HMBL),
          (AUDC0 = 0 | a.AUDC0),
          audioSignal.getChannel0().setControl(15 & AUDC0),
          (AUDC1 = 0 | a.AUDC1),
          audioSignal.getChannel1().setControl(15 & AUDC1),
          (AUDF0 = 0 | a.AUDF0),
          audioSignal.getChannel0().setDivider(1 + (31 & AUDF0)),
          (AUDF1 = 0 | a.AUDF1),
          audioSignal.getChannel1().setDivider(1 + (31 & AUDF1)),
          (AUDV0 = 0 | a.AUDV0),
          audioSignal.getChannel0().setVolume(15 & AUDV0),
          (AUDV1 = 0 | a.AUDV1),
          audioSignal.getChannel1().setVolume(15 & AUDV1),
          void 0 !== a.dl ? this.debug(a.dl) : debug && debugSetColors();
      });
    var HBLANK_DURATION = 68,
      LINE_WIDTH = 228,
      VBLANK_COLOR = 4278190080,
      HBLANK_COLOR = 4261412864,
      VSYNC_COLOR = 4292730333,
      DEBUG_P0_COLOR = 4278190335,
      DEBUG_P0_RES_COLOR = 4280427195,
      DEBUG_P0_GR_COLOR = 4279308663,
      DEBUG_P1_COLOR = 4294901760,
      DEBUG_P1_RES_COLOR = 4290454050,
      DEBUG_P1_GR_COLOR = 4285993233,
      DEBUG_M0_COLOR = 4284901119,
      DEBUG_M1_COLOR = 4294927974,
      DEBUG_PF_COLOR = 4282681412,
      DEBUG_PF_GR_COLOR = 4281589043,
      DEBUG_BK_COLOR = 4281549875,
      DEBUG_BL_COLOR = 4278255615,
      DEBUG_MARKS_COLOR = 4280295456,
      DEBUG_HBLANK_COLOR = 4282664004,
      DEBUG_VBLANK_COLOR = 4280953386,
      DEBUG_WSYNC_COLOR = 4287103112,
      DEBUG_HMOVE_COLOR = 4294967295,
      DEBUG_ALT_COLOR = 4289374720,
      READ_ADDRESS_MASK = 15,
      WRITE_ADDRESS_MASK = 63,
      P0C = -63489,
      P1C = -34689,
      M0C = -17521,
      M1C = -8781,
      PFC = -4395,
      BLC = -2199,
      cpu = pCpu,
      pia = pPia,
      bus,
      powerOn = !1,
      clock,
      changeClock,
      changeClockPrevLine,
      renderClock,
      linePixels = new Uint32Array(LINE_WIDTH),
      vSyncOn = !1,
      vBlankOn = !1,
      vBlankColor = VBLANK_COLOR,
      hBlankColor = HBLANK_COLOR,
      playfieldEnabled = !1,
      playfieldPatternL = 0,
      playfieldPatternR = 0,
      playfieldColor = 4278190080,
      playfieldLeftColor = 4278190080,
      playfieldRightColor = 4278190080,
      playfieldBackground = 4278190080,
      playfieldReflected = !1,
      playfieldScoreMode = !1,
      playfieldPriority = !1,
      ballEnabled = !1,
      ballPixel = 0,
      ballLineSpritePointer = 0,
      ballColor = 4278190080,
      player0Enabled = !1,
      player0Pixel = 0,
      player0LineSpritePointer = 0,
      player0Alt = 0,
      player0AltFrom = 0,
      player0AltLength = 0,
      player0AltCopyOffset = 0,
      player0AltControl = new Uint32Array(4096),
      player0Color = 4278190080,
      player1Enabled = !1,
      player1Pixel = 0,
      player1LineSpritePointer = 0,
      player1Alt = 0,
      player1AltFrom = 0,
      player1AltLength = 0,
      player1AltCopyOffset = 0,
      player1AltControl = new Uint32Array(4096),
      player1Color = 4278190080,
      missile0Enabled = !1,
      missile0Pixel = 0,
      missile0LineSpritePointer = 0,
      missile0Alt = 0,
      missile0AltFrom = 0,
      missile0AltLength = 0,
      missile0AltCopyOffset = 0,
      missile0AltControl = new Uint32Array(32),
      missile0Color = 4278190080,
      missile1Enabled = !1,
      missile1Pixel = 0,
      missile1LineSpritePointer = 0,
      missile1Alt = 0,
      missile1AltFrom = 0,
      missile1AltLength = 0,
      missile1AltCopyOffset = 0,
      missile1AltControl = new Uint32Array(32),
      missile1Color = 4278190080,
      hMoveHitBlank = !1,
      hMoveHitClock = 0,
      hMoveLateHit = !1,
      hMoveLateHitBlank = !1,
      collisions = 0,
      collisionsPossible = 0,
      controlsButtonsLatched = !1,
      controlsJOY0ButtonPressed = !1,
      controlsJOY1ButtonPressed = !1,
      paddleCapacitorsGrounded = !1,
      paddle0Position = -1,
      paddle0CapacitorCharge = 0,
      paddle1Position = -1,
      paddle1CapacitorCharge = 0,
      debug = !1,
      debugLevel = 0,
      debugNoCollisions = !1,
      debugPixels = new Uint32Array(LINE_WIDTH),
      playerLineSprites = new Uint8Array(262144),
      missileBallLineSprites = new Uint8Array(2048),
      playerCopyLengthPerShape = new Uint8Array([
        13, 13, 13, 13, 13, 22, 13, 38,
      ]),
      playerScanStartPerShape = new Uint8Array([5, 5, 5, 5, 5, 6, 5, 6]),
      playerPixelSizePerShape = new Uint8Array([1, 1, 1, 1, 1, 2, 1, 4]),
      playerCopyOffsetsReset = new Uint8Array(1280),
      playerScanOffsetsShape = new Uint8Array(1280),
      missileCopyOffsetsReset = new Uint8Array(5120),
      missileScanOffsetsShape = new Uint8Array(5120),
      objectsLineSpritePointerDeltaToSingleCopy = new Uint16Array([
        0, 64, 128, 192, 256, 0, 384, 0,
      ]),
      missileCenterOffsetsPerPlayerSize = new Uint8Array([
        5, 5, 5, 5, 5, 10, 5, 18,
      ]),
      videoSignal = new jt.VideoSignal(),
      palette,
      audioSignal = new jt.TiaAudio(audioSocket),
      INPT0 = 0,
      INPT1 = 0,
      INPT2 = 0,
      INPT3 = 0,
      INPT4 = 0,
      INPT5 = 0,
      CTRLPF = 0,
      COLUPF = 0,
      COLUBK = 0,
      PF0 = 0,
      PF1 = 0,
      PF2 = 0,
      ENABL = 0,
      ENABLd = 0,
      VDELBL = 0,
      NUSIZ0 = 0,
      COLUP0 = 0,
      REFP0 = 0,
      GRP0 = 0,
      GRP0d = 0,
      VDELP0 = 0,
      NUSIZ1 = 0,
      COLUP1 = 0,
      REFP1 = 0,
      GRP1 = 0,
      GRP1d = 0,
      VDELP1 = 0,
      ENAM0 = 0,
      RESMP0 = 0,
      ENAM1 = 0,
      RESMP1 = 0,
      HMP0 = 0,
      HMP1 = 0,
      HMM0 = 0,
      HMM1 = 0,
      HMBL = 0,
      AUDC0 = 0,
      AUDC1 = 0,
      AUDF0 = 0,
      AUDF1 = 0,
      AUDV0 = 0,
      AUDV1 = 0;
    init(),
      (self.eval = function (code) {
        return eval(code);
      });
  }),
  (jt.Bus = function (a, b, c, d) {
    "use strict";
    (this.powerOn = function () {
      null != i && i.powerOn(),
        h.powerOn(),
        g.powerOn(),
        e.powerOn(),
        f.powerOn();
    }),
      (this.powerOff = function () {
        f.powerOff(), e.powerOff(), g.powerOff(), h.powerOff();
      }),
      (this.setCartridge = function (a) {
        (i = a),
          i && ((k = 0), i.connectBus(this)),
          (j = i && i.needsBusMonitoring());
      }),
      (this.getCartridge = function () {
        return i;
      }),
      (this.getTia = function () {
        return f;
      }),
      (this.clockPulse = function () {
        g.clockPulse(), e.clockPulse();
      }),
      (this.read = function (a) {
        return (
          j && i.monitorBusBeforeRead(a),
          (a & l) === m
            ? i
              ? (k = i.read(a))
              : k
            : (k =
                (a & n) === o
                  ? h.read(a)
                  : (a & r) === s
                  ? g.read(a)
                  : (63 & k) | f.read(a))
        );
      }),
      (this.write = function (a, b) {
        j && i.monitorBusBeforeWrite(a, b),
          (k = b),
          (a & p) === q
            ? f.write(a, b)
            : (a & n) === o
            ? h.write(a, b)
            : (a & r) === s
            ? g.write(a, b)
            : i && i.write(a, b);
      }),
      (this.saveState = function () {
        return { d: k };
      }),
      (this.loadState = function (a) {
        k = a.d;
      });
    var e,
      f,
      g,
      h,
      i,
      j = !1,
      k = (256 * Math.random()) | 0,
      l = 4096,
      m = 4096,
      n = 4736,
      o = 128,
      p = 4224,
      q = 0,
      r = 4736,
      s = 640;
    !(function (i) {
      (e = a),
        (f = b),
        (g = c),
        (h = d),
        e.connectBus(i),
        f.connectBus(i),
        g.connectBus(i);
    })(this);
  }),
  (jt.AtariConsole = function (mainVideoClock) {
    "use strict";
    function init() {
      mainComponentsCreate(), socketsCreate();
    }
    function videoFrame() {
      (userPaused && userPauseMoreFrames-- <= 0) ||
        (videoStandardAutoDetectionInProgress &&
          videoStandardAutoDetectionTry(),
        tia.frame());
    }
    function vSynchToggleMode() {
      if (-1 === vSynchMode)
        return void self.showOSD("V-Synch is DISABLED / UNSUPPORTED", !0, !0);
      (vSynchMode = vSynchMode ? 0 : 1),
        updateVideoSynchronization(),
        self.showOSD("V-Synch: " + (vSynchMode ? "ON" : "OFF"), !0),
        (Javatari.userPreferences.current.vSynch = vSynchMode),
        Javatari.userPreferences.setDirty(),
        Javatari.userPreferences.save();
    }
    function showVideoStandardMessage() {
      self.showOSD(
        (videoStandardIsAuto ? "AUTO: " : "") + videoStandard.name,
        !0
      );
    }
    function updateVideoSynchronization() {
      (videoPulldown =
        1 === vSynchMode
          ? videoStandard.pulldowns[
              videoClockSocket.getVSynchNativeFrequency()
            ] || videoStandard.pulldowns.TIMER
          : videoStandard.pulldowns.TIMER),
        (videoPulldownStep = 0),
        videoClockUpdateSpeed();
    }
    function setDefaults() {
      setVideoStandardAuto(!0),
        (speedControl = 1),
        (alternateSpeed = null),
        videoClockUpdateSpeed(),
        tia.debug(0),
        tia.debugNoCollisions(!1);
    }
    function videoClockUpdateSpeed() {
      videoClockSocket.setVSynch(1 === vSynchMode);
      var a = (videoPulldown.frequency * (alternateSpeed || speedControl)) | 0;
      videoClockSocket.setFrequency(a, videoPulldown.divider),
        audioSocket.setFps(a / videoPulldown.divider);
    }
    function VideoClockSocket() {
      (this.connectClock = function (b) {
        a = b;
      }),
        (this.getVSynchNativeFrequency = function () {
          return a.getVSynchNativeFrequency();
        }),
        (this.setVSynch = function (b) {
          a.setVSynch(b);
        }),
        (this.setFrequency = function (b, c) {
          a.setFrequency(b, c);
        });
      var a;
    }
    function CartridgeSocket() {
      (this.insert = function (a, b) {
        b && self.powerIsOn && self.powerOff(),
          setCartridge(a),
          b && !self.powerIsOn && self.powerOn(),
          saveStateSocket.externalStateChange();
      }),
        (this.inserted = function () {
          return getCartridge();
        }),
        (this.cartridgeInserted = function (a, b) {
          tia.getAudioOutput().cartridgeInserted(a, b),
            consoleControlsSocket.cartridgeInserted(a, b),
            saveStateSocket.cartridgeInserted(a, b),
            tia.getVideoOutput().monitor.cartridgeInserted(a, b);
        }),
        (this.loadCartridgeData = function (a, b, c) {}),
        (this.saveCartridgeDataFile = function (a) {});
    }
    function ConsoleControlsSocket() {
      (this.connectControls = function (b) {
        a = b;
      }),
        (this.cartridgeInserted = function (b, c) {
          a && a.cartridgeInserted(b, c);
        }),
        (this.controlStateChanged = function (a, b) {
          self.controlStateChanged(a, b),
            pia.controlStateChanged(a, b),
            tia.controlStateChanged(a, b),
            tia.getVideoOutput().monitor.controlStateChanged(a, b);
        }),
        (this.controlValueChanged = function (a, b) {
          tia.controlValueChanged(a, b);
        }),
        (this.controlsStateReport = function (a) {
          self.controlsStateReport(a), pia.controlsStateReport(a);
        }),
        (this.controlsStatesRedefined = function () {
          tia.getVideoOutput().monitor.controlsStatesRedefined();
        }),
        (this.firePowerAndUserPauseStateUpdate = function () {
          a.consolePowerAndUserPauseStateUpdate(self.powerIsOn, userPaused),
            tia
              .getVideoOutput()
              .monitor.consolePowerAndUserPauseStateUpdate(
                self.powerIsOn,
                userPaused
              );
        }),
        (this.releaseControllers = function () {
          a.releaseControllers();
        }),
        (this.controlsClockPulse = function () {
          a.controlsClockPulse();
        }),
        (this.getControlReport = function (a) {
          switch (a) {
            case jt.ConsoleControls.VIDEO_STANDARD:
              return {
                label: videoStandardIsAuto ? "Auto" : videoStandard.name,
                active: !videoStandardIsAuto,
              };
            case jt.ConsoleControls.VSYNCH:
              return {
                label: -1 === vSynchMode ? "DISABL" : vSynchMode ? "ON" : "OFF",
                active: 1 === vSynchMode,
              };
            case jt.ConsoleControls.NO_COLLISIONS:
              return {
                label: tia.getDebugNoCollisions() ? "ON" : "OFF",
                active: tia.getDebugNoCollisions(),
              };
            default:
              return { label: "Unknown", active: !1 };
          }
        });
      var a;
    }
    function SaveStateSocket() {
      (this.connectMedia = function (b) {
        a = b;
      }),
        (this.getMedia = function () {
          return a;
        }),
        (this.cartridgeInserted = function (a) {
          a && a.connectSaveStateSocket(this);
        }),
        (this.externalStateChange = function () {
          a.externalStateChange();
        }),
        (this.saveState = function (c) {
          if (self.powerIsOn) {
            var d = saveState();
            (d.v = b),
              a.saveState(c, d)
                ? self.showOSD("State " + c + " saved", !0)
                : self.showOSD("State " + c + " save failed", !0);
          }
        }),
        (this.loadState = function (c) {
          var d = a.loadState(c);
          return d
            ? d.v !== b
              ? void self.showOSD(
                  "State " + c + " load failed, wrong version",
                  !0
                )
              : (self.powerIsOn || self.powerOn(!0),
                loadState(d),
                void self.showOSD("State " + c + " loaded", !0))
            : void self.showOSD("State " + c + " not found", !0);
        }),
        (this.saveStateFile = function () {
          if (self.powerIsOn) {
            var c =
                cartridgeSocket.inserted() &&
                cartridgeSocket.inserted().rom.info.l,
              d = saveState();
            (d.v = b),
              a.saveStateFile(c, d)
                ? self.showOSD("State Cartridge saved", !0)
                : self.showOSD("State file save failed", !0);
          }
        }),
        (this.loadStateFile = function (c) {
          var d = a.loadStateFile(c);
          if (d)
            return d.v !== b
              ? (self.showOSD("State file load failed, wrong version", !0), !0)
              : (self.powerIsOn || self.powerOn(),
                loadState(d),
                self.showOSD("State file loaded", !0),
                !0);
        });
      var a,
        b = 2;
    }
    function AudioSocket() {
      (this.connectMonitor = function (b) {
        a = b;
        for (var d = c.length - 1; d >= 0; d--) a.connectAudioSignal(c[d]);
      }),
        (this.connectAudioSignal = function (d) {
          c.indexOf(d) >= 0 ||
            (jt.Util.arrayAdd(c, d),
            this.flushAllSignals(),
            d.setFps(b),
            a && a.connectAudioSignal(d));
        }),
        (this.disconnectAudioSignal = function (b) {
          jt.Util.arrayRemoveAllElement(c, b), a && a.disconnectAudioSignal(b);
        }),
        (this.audioClockPulse = function () {
          for (var a = c.length - 1; a >= 0; --a) c[a].audioClockPulse();
        }),
        (this.audioFinishFrame = function () {
          for (var a = c.length - 1; a >= 0; --a) c[a].audioFinishFrame();
        }),
        (this.muteAudio = function () {
          a && a.mute();
        }),
        (this.unMuteAudio = function () {
          a && a.unMute();
        }),
        (this.setFps = function (a) {
          b = a;
          for (var d = c.length - 1; d >= 0; --d) c[d].setFps(b);
        }),
        (this.pauseAudio = function () {
          a && a.pause();
        }),
        (this.unpauseAudio = function () {
          a && a.unpause();
        }),
        (this.flushAllSignals = function () {
          for (var a = c.length - 1; a >= 0; --a) c[a].flush();
        });
      var a,
        b,
        c = [];
    }
    var self = this;
    (this.socketsConnected = function () {
      setDefaults();
    }),
      (this.powerOn = function (a) {
        this.powerIsOn && this.powerOff(),
          bus.powerOn(),
          (this.powerIsOn = !0),
          consoleControlsSocket.controlsStatesRedefined(),
          updateVideoSynchronization(),
          videoStandardAutoDetectionStart(),
          a || consoleControlsSocket.firePowerAndUserPauseStateUpdate();
      }),
      (this.powerOff = function () {
        bus.powerOff(),
          (this.powerIsOn = !1),
          consoleControlsSocket.controlsStatesRedefined(),
          userPaused
            ? this.userPause(!1)
            : consoleControlsSocket.firePowerAndUserPauseStateUpdate();
      }),
      (this.userPowerOn = function () {
        isLoading ||
          (this.powerOn(),
          bus.getCartridge() || this.showOSD("NO CARTRIDGE INSERTED!", !1, !0));
      }),
      (this.setLoading = function (a) {
        isLoading = a;
      }),
      (this.userPause = function (a, b) {
        var c = userPaused;
        return (
          userPaused !== a &&
            ((userPaused = !!a),
            (userPauseMoreFrames = -1),
            userPaused && !b
              ? audioSocket.muteAudio()
              : audioSocket.unMuteAudio(),
            consoleControlsSocket.firePowerAndUserPauseStateUpdate()),
          c
        );
      }),
      (this.systemPause = function (a) {
        var b = systemPaused;
        return (
          systemPaused !== a &&
            ((systemPaused = !!a),
            systemPaused
              ? audioSocket.pauseAudio()
              : audioSocket.unpauseAudio()),
          b
        );
      }),
      (this.isSystemPaused = function () {
        return systemPaused;
      }),
      (this.videoClockPulse = function () {
        this.videoClockPulseApplyPulldowns(
          self.videoClockPulseGetNextPulldowns()
        );
      }),
      (this.videoClockPulseApplyPulldowns = function (a) {
        if (self.powerIsOn) {
          for (; a-- > 0; ) videoFrame();
          userPaused || audioSocket.audioFinishFrame();
        }
      }),
      (this.videoClockPulseGetNextPulldowns = function () {
        return 1 === videoPulldown.steps
          ? 1
          : (--videoPulldownStep < 0 &&
              (videoPulldownStep = videoPulldown.steps - 1),
            videoPulldown.cadence[videoPulldownStep]);
      }),
      (this.getCartridgeSocket = function () {
        return cartridgeSocket;
      }),
      (this.getConsoleControlsSocket = function () {
        return consoleControlsSocket;
      }),
      (this.getVideoOutput = function () {
        return tia.getVideoOutput();
      }),
      (this.getAudioOutput = function () {
        return tia.getAudioOutput();
      }),
      (this.getSavestateSocket = function () {
        return saveStateSocket;
      }),
      (this.getVideoClockSocket = function () {
        return videoClockSocket;
      }),
      (this.getAudioSocket = function () {
        return audioSocket;
      }),
      (this.showOSD = function (a, b, c) {
        this.getVideoOutput().showOSD(a, b, c);
      }),
      (this.vSynchSetSupported = function (a) {
        var b = Javatari.userPreferences.current.vSynch;
        vSynchMode =
          -1 !== Javatari.SCREEN_VSYNCH_MODE && a
            ? Javatari.SCREEN_VSYNCH_MODE >= 0
              ? Javatari.SCREEN_VSYNCH_MODE
              : null !== b && b >= 0
              ? b
              : 1
            : -1;
      });
    var setCartridge = function (a) {
        Javatari.cartridge = a;
        var b = getCartridge();
        bus.setCartridge(a), cartridgeSocket.cartridgeInserted(a, b);
      },
      getCartridge = function () {
        return bus.getCartridge();
      },
      setVideoStandard = function (a) {
        videoStandard !== a &&
          ((videoStandard = a),
          tia.setVideoStandard(videoStandard),
          updateVideoSynchronization());
      },
      setVideoStandardAuto = function (a) {
        (videoStandardIsAuto = a),
          a &&
            (self.powerIsOn
              ? videoStandardAutoDetectionStart()
              : setVideoStandard(jt.VideoStandard.NTSC));
      },
      videoStandardAutoDetectionStart = function () {
        if (videoStandardIsAuto && !videoStandardAutoDetectionInProgress)
          return bus.getCartridge()
            ? void (
                tia.getVideoOutput().monitor &&
                ((videoStandardAutoDetectionInProgress = !0),
                (videoStandardAutoDetectionTries = 0),
                tia.getVideoOutput().monitor.videoStandardDetectionStart())
              )
            : void setVideoStandard(jt.VideoStandard.NTSC);
      },
      videoStandardAutoDetectionTry = function () {
        videoStandardAutoDetectionTries++;
        var a = tia.getVideoOutput().monitor.getVideoStandardDetected();
        (!a &&
          videoStandardAutoDetectionTries <
            VIDEO_STANDARD_AUTO_DETECTION_FRAMES) ||
          (a
            ? a !== videoStandard &&
              (setVideoStandard(a), showVideoStandardMessage())
            : self.showOSD("AUTO: FAILED", !0, !0),
          (videoStandardAutoDetectionInProgress = !1));
      },
      setVideoStandardForced = function (a) {
        (videoStandardIsAuto = !1), setVideoStandard(a);
      },
      powerFry = function () {
        ram.powerFry(), saveStateSocket.externalStateChange();
      },
      cycleCartridgeFormat = function () {},
      saveState = function (a) {
        var b = {
          t: tia.saveState(a),
          p: pia.saveState(),
          r: ram.saveState(),
          b: bus.saveState(),
          c: cpu.saveState(),
          ca: getCartridge() && getCartridge().saveState(),
          vsa: videoStandardIsAuto,
          vs: videoStandard.name,
        };
        return (
          a &&
            ((b.pw = self.powerIsOn),
            (b.up = userPaused),
            (b.upf = userPauseMoreFrames)),
          b
        );
      };
    this.saveState = saveState;
    var loadState = function (a) {
      void 0 !== a.pw &&
        self.powerIsOn !== a.pw &&
        (a.pw ? self.powerOn() : self.powerOff()),
        void 0 !== a.up && self.userPause(a.up),
        void 0 !== a.upf && (userPauseMoreFrames = a.upf),
        videoClockUpdateSpeed(),
        tia.loadState(a.t),
        pia.loadState(a.p),
        ram.loadState(a.r),
        a.b && bus.loadState(a.b),
        cpu.loadState(a.c),
        setCartridge(
          a.ca &&
            jt.CartridgeCreator.recreateCartridgeFromSaveState(
              a.ca,
              getCartridge()
            )
        ),
        void 0 !== a.vsa && setVideoStandardAuto(a.vsa),
        setVideoStandard(jt.VideoStandard[a.vs]),
        consoleControlsSocket.firePowerAndUserPauseStateUpdate(),
        consoleControlsSocket.controlsStatesRedefined(),
        saveStateSocket.externalStateChange();
    };
    this.loadState = loadState;
    var mainComponentsCreate = function () {
        (cpu = new jt.M6502()),
          (pia = new jt.Pia()),
          (tia = new jt.Tia(cpu, pia)),
          (self.tia = tia),
          (ram = new jt.Ram()),
          (bus = new jt.Bus(cpu, tia, pia, ram));
      },
      socketsCreate = function () {
        (videoClockSocket = new VideoClockSocket()),
          (consoleControlsSocket = new ConsoleControlsSocket()),
          (cartridgeSocket = new CartridgeSocket()),
          (saveStateSocket = new SaveStateSocket()),
          (audioSocket = new AudioSocket()),
          tia.getAudioOutput().connectAudioSocket(audioSocket);
      };
    this.powerIsOn = !1;
    var isLoading = !1,
      userPaused = !1,
      userPauseMoreFrames = 0,
      systemPaused = !1,
      speedControl = 1,
      alternateSpeed = !1,
      cpu,
      pia,
      tia,
      ram,
      bus,
      videoStandard,
      videoPulldown,
      videoPulldownStep,
      videoClockSocket,
      consoleControlsSocket,
      cartridgeSocket,
      saveStateSocket,
      audioSocket,
      videoStandardIsAuto = !1,
      videoStandardAutoDetectionInProgress = !1,
      videoStandardAutoDetectionTries = 0,
      vSynchMode = -1,
      VIDEO_STANDARD_AUTO_DETECTION_FRAMES = 90,
      SPEEDS = [
        0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 2,
        3, 5, 10,
      ],
      SPEED_FAST = 10,
      SPEED_SLOW = 0.3,
      controls = jt.ConsoleControls;
    (this.controlStateChanged = function (a, b) {
      if (a === controls.FAST_SPEED)
        return void (b && alternateSpeed !== SPEED_FAST
          ? ((alternateSpeed = SPEED_FAST),
            videoClockUpdateSpeed(),
            self.showOSD("FAST FORWARD", !0))
          : b ||
            alternateSpeed !== SPEED_FAST ||
            ((alternateSpeed = null),
            videoClockUpdateSpeed(),
            self.showOSD(null, !0)));
      if (a === controls.SLOW_SPEED)
        return void (b && alternateSpeed !== SPEED_SLOW
          ? ((alternateSpeed = SPEED_SLOW),
            videoClockUpdateSpeed(),
            self.showOSD("SLOW MOTION", !0))
          : b ||
            alternateSpeed !== SPEED_SLOW ||
            ((alternateSpeed = null),
            videoClockUpdateSpeed(),
            self.showOSD(null, !0)));
      if (b)
        switch (a) {
          case controls.POWER:
            self.powerIsOn ? self.powerOff() : self.userPowerOn();
            break;
          case controls.POWER_OFF:
            self.powerIsOn && self.powerOff();
            break;
          case controls.POWER_FRY:
            powerFry();
            break;
          case controls.PAUSE:
            return (
              self.userPause(!userPaused, !1),
              void self
                .getVideoOutput()
                .showOSD(userPaused ? "PAUSE" : "RESUME", !0)
            );
          case controls.PAUSE_AUDIO_ON:
            return (
              self.userPause(!userPaused, !0),
              void self
                .getVideoOutput()
                .showOSD(userPaused ? "PAUSE with AUDIO ON" : "RESUME", !0)
            );
          case controls.FRAME:
            return void (userPaused && (userPauseMoreFrames = 1));
          case controls.INC_SPEED:
          case controls.DEC_SPEED:
          case controls.NORMAL_SPEED:
          case controls.MIN_SPEED:
            var c = SPEEDS.indexOf(speedControl);
            a === controls.INC_SPEED && c < SPEEDS.length - 1
              ? ++c
              : a === controls.DEC_SPEED && c > 0
              ? --c
              : a === controls.MIN_SPEED
              ? (c = 0)
              : a === controls.NORMAL_SPEED && (c = SPEEDS.indexOf(1)),
              (speedControl = SPEEDS[c]),
              self.showOSD("Speed: " + ((100 * speedControl) | 0) + "%", !0),
              videoClockUpdateSpeed();
            break;
          case controls.SAVE_STATE_0:
          case controls.SAVE_STATE_1:
          case controls.SAVE_STATE_2:
          case controls.SAVE_STATE_3:
          case controls.SAVE_STATE_4:
          case controls.SAVE_STATE_5:
          case controls.SAVE_STATE_6:
          case controls.SAVE_STATE_7:
          case controls.SAVE_STATE_8:
          case controls.SAVE_STATE_9:
          case controls.SAVE_STATE_10:
          case controls.SAVE_STATE_11:
          case controls.SAVE_STATE_12:
            var d = self.systemPause(!0);
            saveStateSocket.saveState(255 & a), d || self.systemPause(!1);
            break;
          case controls.SAVE_STATE_FILE:
            (d = self.systemPause(!0)),
              saveStateSocket.saveStateFile(),
              d || self.systemPause(!1);
            break;
          case controls.LOAD_STATE_0:
          case controls.LOAD_STATE_1:
          case controls.LOAD_STATE_2:
          case controls.LOAD_STATE_3:
          case controls.LOAD_STATE_4:
          case controls.LOAD_STATE_5:
          case controls.LOAD_STATE_6:
          case controls.LOAD_STATE_7:
          case controls.LOAD_STATE_8:
          case controls.LOAD_STATE_9:
          case controls.LOAD_STATE_10:
          case controls.LOAD_STATE_11:
          case controls.LOAD_STATE_12:
            (d = self.systemPause(!0)),
              saveStateSocket.loadState(255 & a),
              d || self.systemPause(!1);
            break;
          case controls.VIDEO_STANDARD:
            videoStandardIsAuto
              ? setVideoStandardForced(jt.VideoStandard.NTSC)
              : videoStandard == jt.VideoStandard.NTSC
              ? setVideoStandardForced(jt.VideoStandard.PAL)
              : setVideoStandardAuto(!0),
              showVideoStandardMessage();
            break;
          case controls.VSYNCH:
            vSynchToggleMode();
            break;
          case controls.CARTRIDGE_FORMAT:
            cycleCartridgeFormat();
            break;
          case controls.DEFAULTS:
            setDefaults(), self.showOSD("Default Settings", !0);
        }
    }),
      (this.controlsStateReport = function (a) {
        a[controls.POWER] = self.powerIsOn;
      }),
      (this.eval = function (str) {
        return eval(str);
      }),
      init();
  }),
  (jt.JoystickButtons = {
    J_UP: { button: "J_UP", mask: 1, n: "UP" },
    J_DOWN: { button: "J_DOWN", mask: 2, n: "DOWN" },
    J_LEFT: { button: "J_LEFT", mask: 4, n: "LEFT" },
    J_RIGHT: { button: "J_RIGHT", mask: 8, n: "RIGHT" },
    J_A: { button: "J_A", mask: 16, n: "A" },
    J_B: { button: "J_B", mask: 32, n: "B" },
    J_AB: { button: "J_AB", mask: 48, n: "AB" },
    J_X: { button: "J_X", n: "X" },
    J_Y: { button: "J_Y", n: "Y" },
    J_L: { button: "J_L", n: "L" },
    J_R: { button: "J_R", n: "R" },
    J_BACK: { button: "J_BACK", n: "BACK" },
    J_START: { button: "J_START", n: "START" },
  }),
  (jt.ConsoleControls = {
    JOY0_UP: 11,
    JOY0_DOWN: 12,
    JOY0_LEFT: 13,
    JOY0_RIGHT: 14,
    JOY0_BUTTON: 15,
    JOY1_UP: 21,
    JOY1_DOWN: 22,
    JOY1_LEFT: 23,
    JOY1_RIGHT: 24,
    JOY1_BUTTON: 25,
    PADDLE0_BUTTON: 41,
    PADDLE1_BUTTON: 42,
    PADDLE0_POSITION: 16384,
    PADDLE1_POSITION: 16896,
    POWER: 51,
    BLACK_WHITE: 52,
    SELECT: 53,
    RESET: 54,
    DIFFICULTY0: 55,
    DIFFICULTY1: 56,
    POWER_OFF: 57,
    POWER_FRY: 58,
    CARTRIDGE_FORMAT: 91,
    DEBUG: 101,
    TRACE: 102,
    SHOW_INFO: 103,
    NO_COLLISIONS: 104,
    PAUSE: 105,
    PAUSE_AUDIO_ON: 106,
    FRAME: 107,
    FAST_SPEED: 111,
    SLOW_SPEED: 112,
    INC_SPEED: 113,
    DEC_SPEED: 114,
    NORMAL_SPEED: 115,
    MIN_SPEED: 116,
    VIDEO_STANDARD: 123,
    VSYNCH: 124,
    DEFAULTS: 130,
    SAVE_STATE_0: 256,
    SAVE_STATE_1: 257,
    SAVE_STATE_2: 258,
    SAVE_STATE_3: 259,
    SAVE_STATE_4: 260,
    SAVE_STATE_5: 261,
    SAVE_STATE_6: 262,
    SAVE_STATE_7: 263,
    SAVE_STATE_8: 264,
    SAVE_STATE_9: 265,
    SAVE_STATE_10: 266,
    SAVE_STATE_11: 267,
    SAVE_STATE_12: 268,
    LOAD_STATE_0: 512,
    LOAD_STATE_1: 513,
    LOAD_STATE_2: 514,
    LOAD_STATE_3: 515,
    LOAD_STATE_4: 516,
    LOAD_STATE_5: 517,
    LOAD_STATE_6: 518,
    LOAD_STATE_7: 519,
    LOAD_STATE_8: 520,
    LOAD_STATE_9: 521,
    LOAD_STATE_10: 522,
    LOAD_STATE_11: 523,
    LOAD_STATE_12: 524,
    SAVE_STATE_FILE: 201,
  }),
  (jt.ROM = function (a, b, c, d) {
    "use strict";
    (this.source = a),
      (this.content = b),
      (this.info = c || jt.CartridgeCreator.produceInfo(this, d)),
      (this.saveState = function (a) {
        return {
          s: this.source,
          i: this.info,
          c: a
            ? jt.Util.compressInt8BitArrayToStringBase64(this.content)
            : null,
        };
      });
  }),
  (jt.ROM.loadState = function (a) {
    "use strict";
    var b = a.c ? jt.Util.uncompressStringBase64ToInt8BitArray(a.c) : null;
    return new jt.ROM(a.s, b, a.i);
  }),
  (jt.CartridgeDatabase = {
    uncompress: function () {
      jt.CartridgeDatabase = JSON.parse(
        jt.Util.uncompressStringBase64ToString(this.data)
      );
    },
    data: "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",
  }),
  (jt.Cartridge = function () {
    "use strict";
    (this.powerOn = function () {}),
      (this.powerOff = function () {}),
      (this.connectBus = function (a) {}),
      (this.connectSaveStateSocket = function (a) {}),
      (this.read = function (a) {}),
      (this.write = function (a, b) {}),
      (this.getDataDesc = function () {
        return null;
      }),
      (this.needsBusMonitoring = function () {
        return !1;
      }),
      (this.monitorBusBeforeRead = function (a) {}),
      (this.monitorBusBeforeWrite = function (a, b) {}),
      (this.needsAudioClock = function () {
        return !1;
      }),
      (this.audioClockPulse = function () {}),
      (this.reinsertROMContent = function () {
        this.rom.content || (this.rom.content = this.bytes || []);
      }),
      (this.format = null),
      (this.rom = null),
      (this.bytes = null),
      (this.saveState = function () {}),
      (this.loadState = function (a) {});
  }),
  (jt.Cartridge.base = new jt.Cartridge()),
  (jt.Cartridge4K = function (a, b) {
    "use strict";
    (this.read = function (a) {
      return c[a & d];
    }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c);
      });
    var c,
      d = 4095;
    a &&
      (function (d) {
        (d.rom = a), (d.format = b), (c = new Array(4096)), (d.bytes = c);
        for (var e = a.content.length, f = 0; f < c.length; f += e)
          jt.Util.arrayCopy(a.content, 0, c, f, e);
      })(this);
  }),
  (jt.Cartridge4K.prototype = jt.Cartridge.base),
  (jt.Cartridge4K.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge4K();
    return c.loadState(a), c;
  }),
  (jt.Cartridge2K_CV = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return b < 1024 ? e[b] : d[b];
    }),
      (this.write = function (a, b) {
        var d = c(a);
        d >= 1024 && d <= 2047 && (e[d - 1024] = b);
      });
    var c = function (a) {
      return a & f;
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        ra: jt.Util.compressInt8BitArrayToStringBase64(e),
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (e = jt.Util.uncompressStringBase64ToInt8BitArray(a.ra, e));
      });
    var d,
      e = jt.Util.arrayFill(new Array(1024), 0),
      f = 4095;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (d = new Array(4096)), (c.bytes = d);
        for (var e = a.content.length, f = 0; f < d.length; f += e)
          jt.Util.arrayCopy(a.content, 0, d, f, e);
      })(this);
  }),
  (jt.Cartridge2K_CV.prototype = jt.Cartridge.base),
  (jt.Cartridge2K_CV.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge2K_CV();
    return c.loadState(a), c;
  }),
  (jt.CartridgeBankedByMaskedRange = function (a, b, c, d, e) {
    "use strict";
    (this.read = function (a) {
      var b = f(a);
      return n && b >= k && b < 2 * k ? l[b - k] : g[m + b];
    }),
      (this.write = function (a, b) {
        var c = f(a);
        c < k && (n || j) && (n || (n = !0), (l[c] = b));
      });
    var f = function (a) {
      var b = a & o;
      return b >= h && b <= i && (m = p * (b - h)), b;
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(g),
        bo: m,
        bb: h,
        es: k,
        tb: i,
        s: 0 | n,
        sa: 0 | j,
        e: l && jt.Util.compressInt8BitArrayToStringBase64(l),
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (g = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, g)),
          (this.bytes = g),
          (m = a.bo),
          (h = a.bb),
          (k = a.es),
          (i = a.tb),
          (n = !!a.s),
          (j = !!a.sa),
          (l = a.e && jt.Util.uncompressStringBase64ToInt8BitArray(a.e, l));
      });
    var g,
      h,
      i,
      j,
      k,
      l,
      m = 0,
      n = !1,
      o = 4095,
      p = 4096;
    a &&
      (function (f) {
        (f.rom = a), (f.format = b), (g = a.content), (f.bytes = g);
        var m = g.length / p;
        (h = c),
          (i = h + m - 1),
          (k = e),
          null == d || void 0 == d
            ? ((n = !1), (j = !0))
            : ((n = !!d), (j = !1)),
          (l = !1 !== d ? jt.Util.arrayFill(new Array(k), 0) : null);
      })(this);
  }),
  (jt.CartridgeBankedByMaskedRange.prototype = jt.Cartridge.base),
  (jt.CartridgeBankedByMaskedRange.recreateFromSaveState = function (a, b) {
    var c = b || new jt.CartridgeBankedByMaskedRange();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_E0 = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return b < 1024
        ? d[e + b]
        : b < 2048
        ? d[f + b - 1024]
        : b < 3072
        ? d[g + b - 2048]
        : d[4096 + b];
    }),
      (this.write = function (a, b) {
        c(a);
      });
    var c = function (a) {
      var b = a & h;
      return (
        b >= 4064 &&
          b <= 4087 &&
          (b <= 4071
            ? (e = 1024 * (b - 4064))
            : b <= 4079
            ? (f = 1024 * (b - 4072))
            : b <= 4087 && (g = 1024 * (b - 4080))),
        b
      );
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        s0: e,
        s1: f,
        s2: g,
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (e = a.s0),
          (f = a.s1),
          (g = a.s2);
      });
    var d,
      e = 0,
      f = 0,
      g = 0,
      h = 4095;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (d = a.content), (c.bytes = d);
      })(this);
  }),
  (jt.Cartridge8K_E0.prototype = jt.Cartridge.base),
  (jt.Cartridge8K_E0.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_E0();
    return c.loadState(a), c;
  }),
  (jt.Cartridge64K_F0 = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return d[e + b];
    }),
      (this.write = function (a, b) {
        c(a);
      });
    var c = function (a) {
      var b = a & f;
      return b == i && (e += h) >= g && (e = 0), b;
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        bo: e,
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (e = a.bo);
      });
    var d,
      e = 0,
      f = 4095,
      g = 65536,
      h = 4096,
      i = 4080;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (d = a.content), (c.bytes = d);
      })(this);
  }),
  (jt.Cartridge64K_F0.prototype = jt.Cartridge.base),
  (jt.Cartridge64K_F0.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge64K_F0();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_FE = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return d[e + b];
    }),
      (this.write = function (a, b) {
        c(a);
      });
    var c = function (a) {
      return 0 != (8192 & a) ? 0 !== e && (e = 0) : e != g && (e = g), a & f;
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        bo: e,
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (e = a.bo);
      });
    var d,
      e = 0,
      f = 4095,
      g = 4096;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (d = a.content), (c.bytes = d);
      })(this);
  }),
  (jt.Cartridge8K_FE.prototype = jt.Cartridge.base),
  (jt.Cartridge8K_FE.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_FE();
    return c.loadState(a), c;
  }),
  (jt.Cartridge16K_E7 = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return b >= 2304 && b <= 2559
        ? g[i + b - 2304]
        : h && b >= 1024 && b <= 2047
        ? g[b - 1024]
        : b < l
        ? d[e + b]
        : d[m + b];
    }),
      (this.write = function (a, b) {
        var d = c(a);
        d >= 2048 && d <= 2303
          ? (g[i + d - 2048] = b)
          : h && d <= 1023 && (g[d] = b);
      });
    var c = function (a) {
      var b = a & j;
      return (
        b >= 4064 &&
          b <= 4075 &&
          (b <= 4070
            ? (e = k * (b - 4064))
            : 4071 == b
            ? (h = !0)
            : b <= 4075 && (i = f + n * (b - 4072))),
        b
      );
    };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        bo: e,
        rs: h,
        ro: i,
        ra: jt.Util.compressInt8BitArrayToStringBase64(g),
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (e = a.bo),
          (h = a.rs),
          (i = a.ro),
          (g = jt.Util.uncompressStringBase64ToInt8BitArray(a.ra, g));
      });
    var d,
      e = 0,
      f = 1024,
      g = jt.Util.arrayFill(new Array(2048), 0),
      h = !1,
      i = f,
      j = 4095,
      k = 2048,
      l = 2048,
      m = 16384 - k - l,
      n = 256;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (d = a.content), (c.bytes = d);
      })(this);
  }),
  (jt.Cartridge16K_E7.prototype = jt.Cartridge.base),
  (jt.Cartridge16K_E7.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge16K_E7();
    return c.loadState(a), c;
  }),
  (jt.Cartridge10K_DPCa = function (a, b) {
    "use strict";
    (this.powerOn = function () {
      (x = o), (y = 0);
    }),
      (this.connectBus = function (a) {
        k = a.getTia().getAudioOutput().getChannel0();
      }),
      (this.needsAudioClock = function () {
        return !0;
      }),
      (this.read = function (a) {
        var b = c(a);
        return b <= 63 || (b >= 2048 && b <= 2111) ? e(255 & b) : l[q + b];
      }),
      (this.write = function (a, b) {
        var d = c(a);
        ((d >= 64 && d <= 127) || (d >= 2112 && d <= 2175)) && f(255 & d, b);
      }),
      (this.audioClockPulse = function () {
        if (((y + x) | 0) > (0 | y))
          for (var a = 5; a <= 7; a++)
            w[a] &&
              (s[a]--,
              255 == (255 & s[a]) && g(a, (65280 & s[a]) | t[a]),
              i(a),
              z || (z = !0));
        (y += x), z && (d(), k.setVolume(A));
      });
    var c = function (a) {
        var b = a & n;
        return 4088 === b ? (q = 0) : 4089 === b && (q = 4096), b;
      },
      d = function () {
        (A =
          m[
            (w[5] ? 4 & v[5] : 0) |
              (w[6] ? 2 & v[6] : 0) |
              (w[7] ? 1 & v[7] : 0)
          ]),
          (z = !1);
      },
      e = function (a) {
        var b;
        return a >= 0 && a <= 3
          ? (j(), r)
          : a >= 4 && a <= 7
          ? (z && d(), A)
          : a >= 8 && a <= 15
          ? ((b = l[p - s[a - 8]]), h(a - 8), b)
          : a >= 16 && a <= 23
          ? ((b = l[p - s[a - 16]] & v[a - 16]), h(a - 16), b)
          : a >= 24 && a <= 31
          ? ((b = l[p - s[a - 24]] & v[a - 24]),
            h(a - 24),
            (b = (240 & b) | (15 & b)))
          : a >= 32 && a <= 39
          ? ((b = l[p - s[a - 32]] & v[a - 32]),
            h(a - 32),
            (b =
              (128 & b) |
              (64 & b) |
              (32 & b) |
              (16 & b) |
              (8 & b) |
              (4 & b) |
              (2 & b) |
              (1 & b)))
          : a >= 40 && a <= 47
          ? ((b = l[p - s[a - 40]] & v[a - 40]),
            h(a - 40),
            (b = 255 & ((b >>> 1) | (b << 7))))
          : a >= 48 && a <= 55
          ? ((b = l[p - s[a - 48]] & v[a - 48]),
            h(a - 48),
            (b = 255 & ((b << 1) | ((b >> 7) & 1))))
          : a >= 56 && a <= 63
          ? v[a - 56]
          : 0;
      },
      f = function (a, b) {
        if (a >= 64 && a <= 71) {
          var c = a - 64;
          return (t[c] = b), void ((255 & s[c]) === t[c] && (v[c] = 255));
        }
        return a >= 72 && a <= 79
          ? ((u[a - 72] = b), void (v[a - 72] = 0))
          : a >= 80 && a <= 87
          ? void g(a - 80, (65280 & s[a - 80]) | (255 & b))
          : a >= 88 && a <= 91
          ? void g(a - 88, (255 & s[a - 88]) | ((7 & b) << 8))
          : 92 == a
          ? void g(4, (255 & s[4]) | ((7 & b) << 8))
          : a >= 93 && a <= 95
          ? (g(a - 88, (255 & s[a - 88]) + ((7 & b) << 8)),
            void (w[a - 88] = (16 & b) >>> 4))
          : void ((a >= 96 && a <= 103) || (a >= 112 && a <= 119 && (r = 0)));
      },
      g = function (a, b) {
        s[a] = b;
      },
      h = function (a) {
        var b = s[a] - 1;
        b < 0 && (b = 2047), g(a, b), i(a);
      },
      i = function (a) {
        var b = 255 & s[a];
        b == t[a] ? (v[a] = 255) : b == u[a] && (v[a] = 0);
      },
      j = function () {
        255 ===
          (r =
            255 &
            ((r << 1) | (1 & ~((r >> 7) ^ (r >> 5) ^ (r >> 4) ^ (r >> 3))))) &&
          (r = 0);
      };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(l),
        bo: q,
        rn: r,
        fp: jt.Util.compressInt8BitArrayToStringBase64(s),
        fs: jt.Util.compressInt8BitArrayToStringBase64(t),
        fe: jt.Util.compressInt8BitArrayToStringBase64(u),
        fm: jt.Util.compressInt8BitArrayToStringBase64(v),
        a: jt.Util.compressInt8BitArrayToStringBase64(w),
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (l = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, l)),
          (this.bytes = l),
          (q = a.bo),
          (r = a.rn),
          (s = jt.Util.uncompressStringBase64ToInt8BitArray(a.fp, s)),
          (t = jt.Util.uncompressStringBase64ToInt8BitArray(a.fs, t)),
          (u = jt.Util.uncompressStringBase64ToInt8BitArray(a.fe, u)),
          (v = jt.Util.uncompressStringBase64ToInt8BitArray(a.fm, v)),
          (w = jt.Util.uncompressStringBase64ToInt8BitArray(a.a, w));
      });
    var k,
      l,
      m = [0, 5, 5, 10, 5, 10, 10, 15],
      n = 4095,
      o = 0.62,
      p = 10239,
      q = 0,
      r = 0,
      s = jt.Util.arrayFill(new Array(8), 0),
      t = jt.Util.arrayFill(new Array(8), 0),
      u = jt.Util.arrayFill(new Array(8), 0),
      v = jt.Util.arrayFill(new Array(8), 0),
      w = jt.Util.arrayFill(new Array(8), 0),
      x = o,
      y = 0,
      z = !0,
      A = 0;
    a &&
      (function (c) {
        (c.rom = a), (c.format = b), (l = a.content), (c.bytes = l);
      })(this);
  }),
  (jt.Cartridge10K_DPCa.prototype = jt.Cartridge.base),
  (jt.Cartridge10K_DPCa.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge10K_DPCa();
    return c.loadState(a), c;
  }),
  (jt.Cartridge24K_28K_32K_FA2 = function (a, b, c) {
    "use strict";
    var d = this;
    (this.connectBus = function (a) {
      k = a;
    }),
      (this.connectSaveStateSocket = function (a) {
        l = a;
      }),
      (this.read = function (a) {
        var b,
          c = e(a);
        if (((b = c >= 256 && c < 512 ? r[c - 256] : m[p + c]), c !== x))
          return b;
        if (0 === t) {
          var d = r[y];
          if (1 === d || 2 === d) return f(d), 64 | b;
        }
        return 0 === t ? 191 & b : (i(), 0 !== t ? 64 | b : 191 & b);
      }),
      (this.write = function (a, b) {
        var c = e(a);
        c < 256 && (r[c] = b);
      });
    var e = function (a) {
        var b = a & v;
        return b >= q && b <= n && (p = o + w * (b - q)), b;
      },
      f = function (a) {
        (t = a), (s = 0), 1 === a ? g() : 2 === a && h();
      },
      g = function () {
        if (
          (k
            .getTia()
            .getVideoOutput()
            .showOSD("Reading from Cartridge Flash Memory...", !0),
          l)
        ) {
          var a = l.getMedia().loadResource(j());
          a && (u = jt.Util.uncompressStringBase64ToInt8BitArray(a, u));
        }
        jt.Util.arrayCopy(u, 0, r);
      },
      h = function () {
        k
          .getTia()
          .getVideoOutput()
          .showOSD("Writing to Cartridge Flash Memory...", !0),
          jt.Util.arrayCopy(r, 0, u),
          l &&
            l
              .getMedia()
              .saveResource(j(), jt.Util.compressInt8BitArrayToStringBase64(u));
      },
      i = function () {
        ++s > 140 &&
          ((s = 0),
          (t = 0),
          (r[y] = 0),
          k.getTia().getVideoOutput().showOSD("Done.", !0),
          l && l.externalStateChange());
      },
      j = function () {
        return "hfm" + d.rom.info.h;
      };
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(),
        b: jt.Util.compressInt8BitArrayToStringBase64(m),
        rs: o,
        bo: p,
        tb: n,
        e: jt.Util.compressInt8BitArrayToStringBase64(r),
        ho: t,
        ht: s,
      };
    }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (m = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, m)),
          (this.bytes = m),
          (o = a.rs || 0),
          (p = a.bo),
          (n = a.tb),
          (r = jt.Util.uncompressStringBase64ToInt8BitArray(a.e, r)),
          (t = a.ho || 0),
          (s = a.ht || 0);
      });
    var k,
      l,
      m,
      n,
      o = 0,
      p = 0,
      q = 4085,
      r = jt.Util.arrayFill(new Array(256), 0),
      s = 0,
      t = 0,
      u = jt.Util.arrayFill(new Array(256), 0),
      v = 4095,
      w = 4096,
      x = 4084,
      y = 255;
    a &&
      (function (d) {
        (d.rom = a),
          (d.format = b),
          (m = a.content),
          (d.bytes = m),
          (o = c || 0),
          (p = o);
        var e = (m.length - o) / w;
        n = q + e - 1;
      })(this);
  }),
  (jt.Cartridge24K_28K_32K_FA2.prototype = jt.Cartridge.base),
  (jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge24K_28K_32K_FA2();
    return c.loadState(a), c;
  }),
  (jt.CartridgeBankedByBusMonitoring = function (a, b) {
    "use strict";
    (this.needsBusMonitoring = function () {
      return !0;
    }),
      (this.monitorBusBeforeRead = function (a) {
        this.performBankSwitchOnMonitoredAccess(a);
      }),
      (this.monitorBusBeforeWrite = function (a, b) {
        this.performBankSwitchOnMonitoredAccess(a);
      }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {});
  }),
  (jt.CartridgeBankedByBusMonitoring.prototype = jt.Cartridge.base),
  (jt.CartridgeBankedByBusMonitoring.base =
    new jt.CartridgeBankedByBusMonitoring()),
  (jt.Cartridge8K_512K_3F = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = a & g;
      return b >= i ? c[e + b] : c[f + b];
    }),
      (this.monitorBusBeforeWrite = function (a, b) {
        if (a <= 63) {
          var c = 255 & b;
          c <= d && (f = c * h);
        }
      }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
          bo: f,
          sm: d,
          fo: e,
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c),
          (f = a.bo),
          (d = a.sm),
          (e = a.fo);
      });
    var c,
      d,
      e,
      f = 0,
      g = 4095,
      h = 2048,
      i = 2048;
    a &&
      (function (f) {
        (f.rom = a),
          (f.format = b),
          (c = a.content),
          (f.bytes = c),
          (d = (c.length - h) / h - 1),
          (e = c.length - 2 * h);
      })(this);
  }),
  (jt.Cartridge8K_512K_3F.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_512K_3F.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_512K_3F();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_512K_3E = function (a, b) {
    "use strict";
    (this.read = function (a) {
      var b = c(a);
      return b >= m ? d[f + b] : i >= 0 && b < 1024 ? j[i + b] || 0 : d[h + b];
    }),
      (this.write = function (a, b) {
        if (!(i < 0)) {
          var d = c(a);
          d >= 1024 && d <= 2047 && (j[i + d - 1024] = b);
        }
      });
    var c = function (a) {
      return a & k;
    };
    (this.monitorBusBeforeWrite = function (a, b) {
      if (63 === a) {
        var c = 255 & b;
        return void (c <= e && ((h = c * l), (i = -1)));
      }
      if (62 === a) {
        i = (255 & b) * g;
      }
    }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(d),
          bo: h,
          sm: e,
          fo: f,
          ro: i,
          ra: jt.Util.compressInt8BitArrayToStringBase64(j),
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, d)),
          (this.bytes = d),
          (h = a.bo),
          (e = a.sm),
          (f = a.fo),
          (i = a.ro),
          (j = jt.Util.uncompressStringBase64ToInt8BitArray(a.ra, j));
      });
    var d,
      e,
      f,
      g = 1024,
      h = 0,
      i = -1,
      j = jt.Util.arrayFill(new Array(g), 0),
      k = 4095,
      l = 2048,
      m = 2048;
    a &&
      (function (c) {
        (c.rom = a),
          (c.format = b),
          (d = a.content),
          (c.bytes = d),
          (e = (d.length - l) / l - 1),
          (f = d.length - 2 * l);
      })(this);
  }),
  (jt.Cartridge8K_512K_3E.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_512K_3E.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_512K_3E();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_256K_SB = function (a, b) {
    "use strict";
    (this.read = function (a) {
      return c[e + (a & f)];
    }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {
        if (2048 == (6144 & a)) {
          var b = 127 & a;
          b > d || (e = b * g);
        }
      }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
          bo: e,
          m: d,
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c),
          (e = a.bo),
          (d = a.m);
      });
    var c,
      d,
      e = 0,
      f = 4095,
      g = 4096;
    a &&
      (function (e) {
        (e.rom = a),
          (e.format = b),
          (c = a.content),
          (e.bytes = c),
          (d = c.length / g - 1);
      })(this);
  }),
  (jt.Cartridge8K_256K_SB.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_256K_SB.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_256K_SB();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_64K_AR = function (a, b) {
    "use strict";
    (this.powerOn = function () {
      g(0), (D = 0);
    }),
      (this.connectBus = function (a) {
        c = a;
      }),
      (this.read = function (a) {
        return f < M ? d[o + f] : d[p + f - M];
      }),
      (this.write = function (a, b) {
        p === N && f >= K && f < K + 256 && h(f - K);
      }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {
        return (
          (f = a & Q),
          8184 === (a &= 8191)
            ? void g(q)
            : t > 0
            ? void (
                a !== s &&
                ((s = a),
                0 == --t &&
                  (a & R) === S &&
                  (f < M ? (d[o + f] = q) : p < N && (d[p + f - M] = q)))
              )
            : void (
                (a & R) === S &&
                f <= 255 &&
                ((q = f), r && ((s = a), (t = 5)))
              )
        );
      });
    var c,
      d,
      e,
      f,
      g = function (a) {
        switch ((a >> 2) & 7) {
          case 0:
            (o = 2 * M), (p = N);
            break;
          case 1:
            (o = 0 * M), (p = N);
            break;
          case 2:
            (o = 2 * M), (p = 0 * M);
            break;
          case 3:
            (o = 0 * M), (p = 2 * M);
            break;
          case 4:
            (o = 2 * M), (p = N);
            break;
          case 5:
            (o = 1 * M), (p = N);
            break;
          case 6:
            (o = 2 * M), (p = 1 * M);
            break;
          case 7:
            (o = 1 * M), (p = 2 * M);
            break;
          default:
            throw new Error("Invalid bank configuration");
        }
        (t = 0), (r = 0 != (2 & a)), (u = 0 == (1 & a));
      },
      h = function (b) {
        for (var d = !1; ; ) {
          if (D > a.content.length - 1) {
            if (d)
              return (
                0 === b
                  ? c
                      .getTia()
                      .getVideoOutput()
                      .showOSD(
                        "Could not load Tape from Start. Not a Start Tape ROM!",
                        !0
                      )
                  : c
                      .getTia()
                      .getVideoOutput()
                      .showOSD("Could not find next Part to load in Tape!", !0),
                void m(!1)
              );
            (D = 0), (d = !0);
          }
          if (jt.Cartridge8K_64K_AR.peekPartNoOnTape(a.content, D) === b)
            return (
              0 === b
                ? c
                    .getTia()
                    .getVideoOutput()
                    .showOSD("Loaded Tape from Start", !0)
                : c
                    .getTia()
                    .getVideoOutput()
                    .showOSD("Loaded next Part from Tape", !0),
              void i()
            );
          D += O;
        }
      },
      i = function () {
        j(), k(), l();
      },
      j = function () {
        jt.Util.arrayCopy(a.content, D + 4 * M, E, 0, E.length),
          (v = (E[1] << 8) | (255 & E[0])),
          (w = E[2]),
          (x = E[3]),
          (y = E[4]),
          (z = E[5]),
          (A = (E[7] << 8) | (255 & E[6])),
          (e = jt.Util.arrayFill(new Array(x), 0)),
          jt.Util.arrayCopy(E, 16, e, 0, x);
      },
      k = function () {
        jt.Util.arrayFillSegment(d, 7 * L, 8 * L - 1, 0);
        for (var b = D, c = 0, f = e.length; c < f; c++) {
          var g = e[c],
            h = (3 & g) * M,
            i = (g >> 2) * L;
          h + i + 255 < N && jt.Util.arrayCopy(a.content, b, d, h + i, L),
            (b += L);
        }
        D += O;
      },
      l = function () {
        (d[N + G - 63488] = w),
          (d[N + F - 63488] = z),
          (d[N + I - 63488] = B[C++]),
          C > 30 && (C = 0),
          (d[N + H - 63488] = 255 & v),
          (d[N + H + 1 - 63488] = (v >> 8) & 255),
          m(!0);
      },
      m = function (a) {
        d[N + J - 63488] = a ? 1 : 0;
      },
      n = function () {
        var a = jt.Util.uncompressStringBase64ToInt8BitArray(P);
        jt.Util.arrayCopy(a, 0, d, N, M);
      },
      o = 0,
      p = 0,
      q = 0,
      r = !1,
      s = -1,
      t = 0,
      u = !1,
      v = 0,
      w = 0,
      x = 0,
      y = 0,
      z = 0,
      A = 0,
      B = new Array(31),
      C = 0,
      D = 0,
      E = jt.Util.arrayFill(new Array(256), 0),
      F = 64256,
      G = 64257,
      H = 64258,
      I = 64260,
      J = 64261,
      K = 3072,
      L = 256,
      M = 8 * L,
      N = 3 * M,
      O = 4 * M + 256,
      P =
        "7dSxCsIwEAbgv6niGkeddPVZ8kCOXc43yCIokkGIUN+gLxAoZHTxHRxjYq2xk7vSIPS75bb7uYNTuOJWu/bod3iU42BzUTiBe9sTzSjToBnNBVxfQz/nQ+2NhA2a05KYmhhjmxhoQZymxGil8gpeesOdyioW5DN25yxsiri3chQOUO1WeCSI/hPx9AJ/m/576KROMUhlfdE4dQ+AfJoPNBikgOZdLw==",
      Q = 4095,
      R = 4096,
      S = 4096;
    (this.saveState = function () {
      return {
        f: this.format.name,
        r: this.rom.saveState(!0),
        b: jt.Util.compressInt8BitArrayToStringBase64(d),
        b0o: o,
        b1o: p,
        vw: q,
        we: r,
        la: s,
        ac: t,
        bp: u,
        rs: v,
        rc: w,
        rp: x,
        rk: y,
        rm: z,
        rb: A,
        ro: e,
        to: D,
        rnd: jt.Util.storeInt8BitArrayToStringBase64(B),
        rnc: C,
      };
    }),
      (this.loadState = function (b) {
        (this.format = jt.CartridgeFormats[b.f]),
          (this.rom = a = jt.ROM.loadState(b.r)),
          (d = jt.Util.uncompressStringBase64ToInt8BitArray(b.b, d)),
          (this.bytes = d),
          (o = b.b0o),
          (p = b.b1o),
          (q = b.vw),
          (r = b.we),
          (s = b.la),
          (t = b.ac),
          (u = b.bp),
          (v = b.rs),
          (w = b.rc),
          (x = b.rp),
          (y = b.rk),
          (z = b.rm),
          (A = b.rb),
          (e = b.ro),
          (D = b.to),
          jt.Util.restoreStringBase64ToInt8BitArray(b.rnd, B),
          (C = b.rnc);
      }),
      a &&
        (function (c) {
          (c.rom = a),
            (c.format = b),
            (d = jt.Util.arrayFill(new Array(4 * M))),
            (c.bytes = d),
            n();
          for (var e = 0; e < 31; ++e) B[e] = (256 * Math.random()) | 0;
        })(this);
  }),
  (jt.Cartridge8K_64K_AR.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_64K_AR.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_64K_AR();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_64K_AR.HEADER_SIZE = 256),
  (jt.Cartridge8K_64K_AR.PAGE_SIZE = 256),
  (jt.Cartridge8K_64K_AR.BANK_SIZE = 8 * jt.Cartridge8K_64K_AR.PAGE_SIZE),
  (jt.Cartridge8K_64K_AR.PART_SIZE =
    4 * jt.Cartridge8K_64K_AR.BANK_SIZE + jt.Cartridge8K_64K_AR.HEADER_SIZE),
  (jt.Cartridge8K_64K_AR.peekPartNoOnTape = function (a, b) {
    return a[b + 4 * jt.Cartridge8K_64K_AR.BANK_SIZE + 5];
  }),
  (jt.Cartridge8K_64K_AR.checkTape = function (a) {
    return (
      0 === jt.Cartridge8K_64K_AR.peekPartNoOnTape(a.content, 0) ||
      (jt.Util.warning(
        "Wrong Supercharger Tape Part ROM! Please load a Full Tape ROM file"
      ),
      !1)
    );
  }),
  (jt.Cartridge64K_X07 = function (a, b) {
    "use strict";
    (this.read = function (a) {
      return c[d + (a & e)];
    }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {
        2061 == (6159 & a)
          ? (d = ((240 & a) >> 4) * f)
          : d >= g && 0 == (6272 & a) && (d = (0 == (64 & a) ? 14 : 15) * f);
      }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
          bo: d,
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c),
          (d = a.bo);
      });
    var c,
      d = 0,
      e = 4095,
      f = 4096,
      g = 14 * f;
    a &&
      (function (d) {
        (d.rom = a), (d.format = b), (c = a.content), (d.bytes = c);
      })(this);
  }),
  (jt.Cartridge64K_X07.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge64K_X07.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge64K_X07();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_0840 = function (a, b) {
    "use strict";
    (this.read = function (a) {
      return c[d + (a & e)];
    }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {
        var b = 6208 & a;
        2048 === b ? 0 !== d && (d = 0) : 2112 === b && d !== f && (d = f);
      }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
          bo: d,
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c),
          (d = a.bo);
      });
    var c,
      d = 0,
      e = 4095,
      f = 4096;
    a &&
      (function (d) {
        (d.rom = a), (d.format = b), (c = a.content), (d.bytes = c);
      })(this);
  }),
  (jt.Cartridge8K_0840.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_0840.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_0840();
    return c.loadState(a), c;
  }),
  (jt.Cartridge8K_UA = function (a, b) {
    "use strict";
    (this.read = function (a) {
      return c[d + (a & e)];
    }),
      (this.performBankSwitchOnMonitoredAccess = function (a) {
        544 === a ? 0 !== d && (d = 0) : 576 === a && d !== f && (d = f);
      }),
      (this.saveState = function () {
        return {
          f: this.format.name,
          r: this.rom.saveState(),
          b: jt.Util.compressInt8BitArrayToStringBase64(c),
          bo: d,
        };
      }),
      (this.loadState = function (a) {
        (this.format = jt.CartridgeFormats[a.f]),
          (this.rom = jt.ROM.loadState(a.r)),
          (c = jt.Util.uncompressStringBase64ToInt8BitArray(a.b, c)),
          (this.bytes = c),
          (d = a.bo);
      });
    var c,
      d = 0,
      e = 4095,
      f = 4096;
    a &&
      (function (d) {
        (d.rom = a), (d.format = b), (c = a.content), (d.bytes = c);
      })(this);
  }),
  (jt.Cartridge8K_UA.prototype = jt.CartridgeBankedByBusMonitoring.base),
  (jt.Cartridge8K_UA.recreateFromSaveState = function (a, b) {
    var c = b || new jt.Cartridge8K_UA();
    return c.loadState(a), c;
  }),
  (jt.CartridgeFormats = {
    "4K": {
      name: "4K",
      desc: "4K Atari",
      priority: 101,
      tryFormat: function (a) {
        if (
          a.content.length >= 8 &&
          a.content.length <= 4096 &&
          4096 % a.content.length == 0
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge4K(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge4K.recreateFromSaveState(a, b);
      },
    },
    CV: {
      name: "CV",
      desc: "2K Commavid +RAM",
      priority: 102,
      tryFormat: function (a) {
        if (2048 === a.content.length || 4096 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge2K_CV(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge2K_CV.recreateFromSaveState(a, b);
      },
    },
    E0: {
      name: "E0",
      desc: "8K Parker Bros.",
      priority: 102,
      tryFormat: function (a) {
        if (8192 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_E0(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_E0.recreateFromSaveState(a, b);
      },
    },
    F0: {
      name: "F0",
      desc: "64K Dynacom Megaboy",
      priority: 101,
      tryFormat: function (a) {
        if (65536 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge64K_F0(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge64K_F0.recreateFromSaveState(a, b);
      },
    },
    FE: {
      name: "FE",
      desc: "8K Robotank/Decathlon",
      priority: 103,
      tryFormat: function (a) {
        if (8192 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_FE(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_FE.recreateFromSaveState(a, b);
      },
    },
    E7: {
      name: "E7",
      desc: "16K M-Network",
      priority: 102,
      tryFormat: function (a) {
        if (16384 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge16K_E7(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge16K_E7.recreateFromSaveState(a, b);
      },
    },
    F8: {
      name: "F8",
      desc: "8K Atari (+RAM)",
      priority: 101,
      tryFormat: function (a) {
        if (8192 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.CartridgeBankedByMaskedRange(a, this, 4088, null, 128);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(a, b);
      },
    },
    F6: {
      name: "F6",
      desc: "16K Atari (+RAM)",
      priority: 101,
      tryFormat: function (a) {
        if (16384 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.CartridgeBankedByMaskedRange(a, this, 4086, null, 128);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(a, b);
      },
    },
    F4: {
      name: "F4",
      desc: "32K Atari (+RAM)",
      priority: 101,
      tryFormat: function (a) {
        if (32768 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.CartridgeBankedByMaskedRange(a, this, 4084, null, 128);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(a, b);
      },
    },
    FA2cu: {
      name: "FA2cu",
      desc: "32K CBS RAM+ CU Image",
      priority: 103,
      tryFormat: function (a) {
        if (32768 === a.content.length) {
          var b = jt.Util.arraysEqual(
            a.content.slice(32, 36),
            this.cuMagicWord
          );
          return (this.priority = 103 - (b ? 30 : 0)), this;
        }
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge24K_28K_32K_FA2(a, this, 1024);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState(a, b);
      },
      cuMagicWord: [30, 171, 173, 16],
    },
    FA2: {
      name: "FA2",
      desc: "24K/28K/32K CBS RAM+",
      priority: 102,
      tryFormat: function (a) {
        if (
          24576 === a.content.length ||
          28672 === a.content.length ||
          32768 === a.content.length
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge24K_28K_32K_FA2(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState(a, b);
      },
    },
    FA: {
      name: "FA",
      desc: "12K CBS RAM Plus",
      priority: 101,
      tryFormat: function (a) {
        if (12288 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.CartridgeBankedByMaskedRange(a, this, 4088, !0, 256);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(a, b);
      },
    },
    EF: {
      name: "EF",
      desc: "8K-64K H. Runner (+RAM)",
      priority: 114,
      tryFormat: function (a) {
        if (
          a.content.length % 4096 == 0 &&
          a.content.length >= 8192 &&
          a.content.length <= 65536
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.CartridgeBankedByMaskedRange(a, this, 4064, null, 128);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(a, b);
      },
    },
    DPC: {
      name: "DPC",
      desc: "10K DPC Pitfall 2 (Enhanced)",
      priority: 101,
      tryFormat: function (a) {
        if (a.content.length >= 10240 && a.content.length <= 10496) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge10K_DPCa(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge10K_DPCa.recreateFromSaveState(a, b);
      },
    },
    "3F": {
      name: "3F",
      desc: "8K-512K Tigervision",
      priority: 112,
      tryFormat: function (a) {
        if (
          a.content.length % 2048 == 0 &&
          a.content.length >= 2048 &&
          a.content.length <= 524288
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_512K_3F(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_512K_3F.recreateFromSaveState(a, b);
      },
    },
    "3E": {
      name: "3E",
      desc: "8K-512K Tigervision (+RAM)",
      priority: 111,
      tryFormat: function (a) {
        if (
          a.content.length % 2048 == 0 &&
          a.content.length >= 2048 &&
          a.content.length <= 524288
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_512K_3E(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_512K_3E.recreateFromSaveState(a, b);
      },
    },
    X07: {
      name: "X07",
      desc: "64K AtariAge",
      priority: 102,
      tryFormat: function (a) {
        if (65536 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge64K_X07(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge64K_X07.recreateFromSaveState(a, b);
      },
    },
    "0840": {
      name: "0840",
      desc: "8K Econobanking",
      priority: 116,
      tryFormat: function (a) {
        if (8192 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_0840(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_0840.recreateFromSaveState(a, b);
      },
    },
    UA: {
      name: "UA",
      desc: "8K UA Limited",
      priority: 115,
      tryFormat: function (a) {
        if (8192 === a.content.length) return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_UA(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_UA.recreateFromSaveState(a, b);
      },
    },
    SB: {
      name: "SB",
      desc: "8K-256K Superbanking",
      priority: 113,
      tryFormat: function (a) {
        if (
          a.content.length % 4096 == 0 &&
          a.content.length >= 8192 &&
          a.content.length <= 262144
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_256K_SB(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_256K_SB.recreateFromSaveState(a, b);
      },
    },
    AR: {
      name: "AR",
      desc: "8K-64K Arcadia/Supercharger",
      priority: 101,
      tryFormat: function (a) {
        if (
          a.content.length % jt.Cartridge8K_64K_AR.PART_SIZE == 0 &&
          a.content.length / jt.Cartridge8K_64K_AR.PART_SIZE >= 1 &&
          a.content.length / jt.Cartridge8K_64K_AR.PART_SIZE <= 8 &&
          jt.Cartridge8K_64K_AR.checkTape(a)
        )
          return this;
      },
      createCartridgeFromRom: function (a) {
        return new jt.Cartridge8K_64K_AR(a, this);
      },
      recreateCartridgeFromSaveState: function (a, b) {
        return jt.Cartridge8K_64K_AR.recreateFromSaveState(a, b);
      },
    },
  }),
  (jt.CartridgeFormatsUserOptions = [
    "4K",
    "CV",
    "E0",
    "F0",
    "FE",
    "E7",
    "F8",
    "F6",
    "F4",
    "FA2cu",
    "FA2",
    "FA",
    "EF",
    "DPC",
    "3F",
    "3E",
    "X07",
    "0840",
    "UA",
    "SB",
    "AR",
  ]),
  (jt.CartridgeCreatorImpl = function () {
    "use strict";
    (this.createCartridgeFromRom = function (b) {
      var c = a.getForROM(b);
      if (c) {
        var d = jt.CartridgeFormats[c];
        if (d.tryFormat(b))
          return (
            jt.Util.log("USER Format selected: " + d.desc),
            d.createCartridgeFromRom(b)
          );
      }
      var e = this.getBestFormatOption(b);
      if (e)
        return (
          jt.Util.log(
            "AUTO Format selected: " +
              e.name +
              ": " +
              e.desc +
              ", priority: " +
              e.priority +
              (e.priorityBoosted ? " (" + e.priorityBoosted + ")" : "")
          ),
          e.createCartridgeFromRom(b)
        );
    }),
      (this.recreateCartridgeFromSaveState = function (a, b) {
        var c = jt.CartridgeFormats[a.f];
        if (!c) throw new Error("Unsupported ROM Format: " + a.f);
        return (
          b && b.format !== c && (b = null),
          c.recreateCartridgeFromSaveState(a, b)
        );
      }),
      (this.changeCartridgeFormat = function (a, b) {
        return b.createCartridgeFromRom(a.rom);
      }),
      (this.getBestFormatOption = function (a) {
        var c = b(a);
        return 0 === c.length ? void 0 : c[0];
      }),
      (this.getUserFormatOptionNames = function (a) {
        for (
          var b = [], c = 0, d = jt.CartridgeFormatsUserOptions.length;
          c < d;
          ++c
        ) {
          var e = jt.CartridgeFormatsUserOptions[c];
          jt.CartridgeFormats[e].tryFormat(a) && b.push(e);
        }
        return b;
      }),
      (this.produceInfo = function (a, b) {
        var e = a.content.length,
          f = jt.MD5(a.content);
        a.content.length > e && a.content.splice(e);
        var g = jt.CartridgeDatabase[f];
        return (
          g
            ? jt.Util.log(g.n + " (" + f + ")")
            : ((g = c(a.source)),
              jt.Util.log("Unknown ROM: " + g.n + " (" + f + ")")),
          d(g, a.source, f, b),
          g
        );
      }),
      (this.setUserROMFormats = function (b) {
        a = b;
      });
    var a,
      b = function (a) {
        var b,
          c,
          d = [];
        for (var f in jt.CartridgeFormats)
          try {
            if (!(b = jt.CartridgeFormats[f].tryFormat(a))) continue;
            e(b, a.info), d.push(b);
          } catch (a) {
            if (!a.formatDenial) throw a;
            c || (c = a);
          }
        return (
          d.sort(function (a, b) {
            return (
              (a.priorityBoosted || a.priority) -
              (b.priorityBoosted || b.priority)
            );
          }),
          d
        );
      },
      c = function (a) {
        var b = { n: "Unknown" };
        if (!a || !a.trim()) return b;
        var c = a,
          d = c.lastIndexOf("/"),
          e = c.lastIndexOf("\\"),
          f = c.lastIndexOf("?"),
          g = Math.max(d, Math.max(e, f));
        g >= 0 && g < c.length - 1 && (c = c.substring(g + 1));
        var h = c.lastIndexOf(".");
        return (
          h >= 0 && (c = c.substring(0, h)), (b.n = c.trim() || "Unknown"), b
        );
      },
      d = function (a, b, c, d) {
        (a.h = c), a.l || (a.l = f(a.n));
        var e = a.n.toUpperCase();
        a: if (!a.p && ((a.p = 0), !e.match(l + "JOYSTICK(S)?" + m)))
          if (e.match(l + "PADDLE(S)?" + m)) a.p = 1;
          else
            for (var n = 0; n < j.length; n++)
              if (e.match(j[n])) {
                a.p = 1;
                break a;
              }
        a: if (!a.c)
          if (e.match(l + "CRT(_|-)?MODE" + m)) a.c = 1;
          else
            for (n = 0; n < k.length; n++)
              if (e.match(k[n])) {
                a.c = 1;
                break a;
              }
        if (d) {
          d = d.trim().toUpperCase();
          for (var o in jt.CartridgeFormats)
            if (o.toUpperCase() === d) {
              a.f = o;
              break;
            }
        }
        a: if (!a.f) {
          var p = b.toUpperCase();
          for (o in jt.CartridgeFormats)
            if (g(o, e) || g(o, p)) {
              a.f = o;
              break a;
            }
          for (o in i)
            if (h(o, e)) {
              a.f = o;
              break a;
            }
        }
      },
      e = function (a, b) {
        b.f && a.name === b.f
          ? (a.priorityBoosted = a.priority - n)
          : (a.priorityBoosted = void 0);
      },
      f = function (a) {
        return a.split(/(\(|\[)/)[0].trim();
      },
      g = function (a, b) {
        return b.match(l + a + m);
      },
      h = function (a, b) {
        var c = i[a];
        if (!c) return !1;
        for (var d = 0; d < c.length; d++) if (b.match(c[d])) return !0;
        return !1;
      },
      i = {
        E0: [
          "^.*MONTEZUMA.*$",
          "^.*MONTZREV.*$",
          "^.*GYRUS.*$",
          "^.*TOOTH.*PROTECTORS.*$",
          "^.*TOOTHPRO.*$",
          "^.*DEATH.*STAR.*BATTLE.*$",
          "^.*DETHSTAR.*$",
          "^.*JAMES.*BOND.*$",
          "^.*JAMEBOND.*$",
          "^.*SUPER.*COBRA.*$",
          "^.*SPRCOBRA.*$",
          "^.*TUTANKHAM.*$",
          "^.*TUTANK.*$",
          "^.*POPEYE.*$",
          "^.*(SW|STAR.?WARS).*ARCADE.*GAME.*$",
          "^.*SWARCADE.*$",
          "^.*Q.*BERT.*QUBES.*$",
          "^.*QBRTQUBE.*$",
          "^.*FROGGER.?(2|II).*$",
          "^.*DO.*CASTLE.*$",
        ],
        FE: [
          "^.*ROBOT.*TANK.*$",
          "^.*ROBOTANK.*$",
          "^.*DECATHLON.*$",
          "^.*DECATHLN.*$",
        ],
        E7: [
          "^.*BUMP.*JUMP.*$",
          "^.*BNJ.*$",
          "^.*BURGER.*TIME.*$",
          "^.*BURGTIME.*$",
          "^.*POWER.*HE.?MAN.*$",
          "^.*HE_MAN.*$",
        ],
        "3F": [
          "^.*POLARIS.*$",
          "^.*RIVER.*PATROL.*$",
          "^.*RIVERP.*$",
          "^.*SPRINGER.*$",
          "^.*MINER.*2049.*$",
          "^.*MNR2049R.*$",
          "^.*MINER.*2049.*VOLUME.*$",
          "^.*MINRVOL2.*$",
          "^.*ESPIAL.*$",
          "^.*ANDREW.*DAVIE.*$",
          "^.*DEMO.*IMAGE.*AD.*$",
        ],
        "3E": ["^.*BOULDER.*DASH.*$", "^.*BLDRDASH.*$"],
        DPC: ["^.*PITFALL.*II.*$"],
      },
      j = [
        "^.*PADDLES.*$",
        "^.*BREAKOUT.*$",
        "^.*SUPER.*BREAKOUT.*$",
        "^.*SUPERB.*$",
        "^.*WARLORDS.*$",
        "^.*STEEPLE.*CHASE.*$",
        "^.*STEPLCHS.*$",
        "^.*VIDEO.*OLYMPICS.*$",
        "^.*VID(|_)OLYM(|P).*$",
        "^.*CIRCUS.*ATARI.*$",
        "^.*CIRCATRI.*$",
        "^.*KABOOM.*$",
        "^.*BUGS((?!BUNNY).)*",
        "^.*BACHELOR.*PARTY.*$",
        "^.*BACHELOR.*$",
        "^.*BACHELORETTE.*PARTY.*$",
        "^.*BACHLRTT.*$",
        "^.*BEAT.*EM.*EAT.*EM.*$",
        "^.*BEATEM.*$",
        "^.*PHILLY.*FLASHER.*$",
        "^.*PHILLY.*$",
        "^.*JEDI.*ARENA.*$",
        "^.*JEDIAREN.*$",
        "^.*EGGOMANIA.*$",
        "^.*EGGOMANA.*$",
        "^.*PICNIC.*$",
        "^.*PIECE.*O.*CAKE.*$",
        "^.*PIECECKE.*$",
        "^.*BACKGAMMON.*$",
        "^.*BACKGAM.*$",
        "^.*BLACKJACK.*$",
        "^.*BLACK(|_)J.*$",
        "^.*CANYON.*BOMBER.*$",
        "^.*CANYONB.*$",
        "^.*CASINO.*$",
        "^.*DEMONS.*DIAMONDS.*$",
        "^.*DEMONDIM.*$",
        "^.*DUKES.*HAZZARD.*2.*$",
        "^.*STUNT.?2.*$",
        "^.*ENCOUNTER.*L.?5.*$",
        "^.*ENCONTL5.*$",
        "^.*G.*I.*JOE.*COBRA.*STRIKE.*$",
        "^.*GIJOE.*$",
        "^.*GUARDIAN.*$",
        "^.*MARBLE.*CRAZE.*$",
        "^.*MARBCRAZ.*$",
        "^.*MEDIEVAL.*MAYHEM.*$",
        "^.*MONDO.*PONG.*$",
        "^.*NIGHT.*DRIVER.*$",
        "^.*NIGHTDRV.*$",
        "^.*PARTY.*MIX.*$",
        "^.*POKER.*PLUS.*$",
        "^.*PONG.*SPORTS.*$",
        "^.*SCSICIDE.*$",
        "^.*SECRET.*AGENT.*$",
        "^.*SOLAR.*STORM.*$",
        "^.*SOLRSTRM.*$",
        "^.*SPEEDWAY.*$",
        "^.*STREET.*RACER.*$",
        "^.*STRTRACE.*$",
        "^.*STUNT.*CYCLE.*$",
        "^.*STUNT.?1.*$",
        "^.*TAC.?SCAN.*$",
        "^.*MUSIC.*MACHINE.*$",
        "^.*MUSCMACH.*$",
        "^.*VONG.*$",
        "^.*WARPLOCK.*$",
      ],
      k = [
        "^.*STAR.*CASTLE.*$",
        "^.*SEAWEED.*$",
        "^.*ANDREW.*DAVIE.*$",
        "^.*DEMO.*IMAGE.*AD.*$",
      ],
      l = "^(|.*?(\\W|_|%20))",
      m = "(|(\\W|_|%20).*)$",
      n = 50;
  }),
  (jt.CartridgeCreator = new jt.CartridgeCreatorImpl()),
  (jt.Images = {
    embedded: !1,
    count: 5,
    urls: {
      logo: Javatari.IMAGES_PATH + "logo.png",
      loading: Javatari.IMAGES_PATH + "loading.gif",
      mouseCursor: Javatari.IMAGES_PATH + "mouse-cursor.png",
      panel: Javatari.IMAGES_PATH + "panel.jpg",
      panelSprites: Javatari.IMAGES_PATH + "panel-sprites.jpg",
      controllers: Javatari.IMAGES_PATH + "controllers.jpg",
      iconSprites: Javatari.IMAGES_PATH + "icon-sprites.png",
    },
  }),
  (jt.Clock = function (clockPulse) {
    "use strict";
    (this.connect = function (a) {
      a.connectClock(this);
    }),
      (this.go = function () {
        running ||
          ((useRequestAnimationFrame =
            vSynch && cyclesPerSecond === this.getVSynchNativeFrequency()),
          (running = !0),
          useRequestAnimationFrame
            ? (animationFrame = requestAnimationFrame(pulse))
            : (interval = setInterval(pulse, cycleTimeMs)));
      }),
      (this.pause = function () {
        (running = !1),
          animationFrame &&
            (cancelAnimationFrame(animationFrame), (animationFrame = null)),
          interval && (clearInterval(interval), (interval = null));
      }),
      (this.setFrequency = function (a, b) {
        running
          ? (this.pause(), internalSetFrequency(a, b), this.go())
          : internalSetFrequency(a, b);
      }),
      (this.setVSynch = function (a) {
        running ? (this.pause(), (vSynch = a), this.go()) : (vSynch = a);
      }),
      (this.getVSynchNativeFrequency = function () {
        return vSynchAltNativeFrequency || vSynchNativeFrequency;
      }),
      (this.setVSynchAltNativeFrequency = function (a) {
        vSynchAltNativeFrequency = a;
      });
    var internalSetFrequency = function (a, b) {
        (cyclesPerSecond = a),
          (cycleTimeMs = 1e3 / a),
          (divider = b >= 1 ? b : 1),
          dividerCounter > divider && (dividerCounter = divider);
      },
      pulse = function () {
        (animationFrame = null),
          divider > 1
            ? --dividerCounter <= 0 &&
              ((dividerCounter = divider), clockPulse())
            : clockPulse(),
          useRequestAnimationFrame &&
            !animationFrame &&
            (animationFrame = requestAnimationFrame(pulse));
      };
    (this.detectHostNativeFPSAndCallback = function (a) {
      function b() {
        (vSynchNativeFrequency = -1),
          jt.Util.error(
            "Could not detect video native frequency. V-Synch DISABLED!"
          ),
          a && a(vSynchNativeFrequency);
      }
      if (-1 === Javatari.SCREEN_VSYNCH_MODE)
        return (
          jt.Util.warning("Video native V-Synch disabled in configuration"),
          void (a && a(vSynchNativeFrequency))
        );
      if (-1 !== Javatari.SCREEN_FORCE_HOST_NATIVE_FPS)
        return (
          jt.Util.warning(
            "Host video frequency forced in configuration: " +
              Javatari.SCREEN_FORCE_HOST_NATIVE_FPS
          ),
          void (a && a(vSynchNativeFrequency))
        );
      if (!window.requestAnimationFrame) return b();
      var c = 0,
        d = 0,
        e = 0,
        f = 0,
        g = 0,
        h = 0,
        i = function () {
          if (e >= 12 || f >= 18 || g >= 14 || h >= 18)
            return (
              (vSynchNativeFrequency =
                e >= 12 ? 60 : f >= 18 ? 50 : g >= 14 ? 120 : 100),
              jt.Util.log(
                "Video native frequency detected: " +
                  vSynchNativeFrequency +
                  "Hz"
              ),
              void (a && a(vSynchNativeFrequency))
            );
          if (!(++c <= 70)) return b();
          var j = jt.Util.performanceNow(),
            k = 1e3 / (j - d);
          (d = j),
            k >= 47 && k <= 53 && f++,
            k >= 56.4 && k <= 63.6 && e++,
            k >= 112.8 && k <= 127.2 && g++,
            k >= 94 && k <= 106 && h++,
            requestAnimationFrame(i);
        };
      i();
    }),
      (this.eval = function (str) {
        return eval(str);
      });
    var running = !1,
      cyclesPerSecond = 1,
      cycleTimeMs = 1e3,
      divider = 1,
      dividerCounter = 1,
      useRequestAnimationFrame,
      animationFrame = null,
      interval = null,
      vSynch = !0,
      vSynchNativeFrequency =
        -1 === Javatari.SCREEN_VSYNCH_MODE
          ? -1
          : Javatari.SCREEN_FORCE_HOST_NATIVE_FPS,
      vSynchAltNativeFrequency = void 0;
  }),
  (jt.RecentStoredROMs = function () {
    function a() {
      if (!e) {
        try {
          e = JSON.parse(localStorage.javataristoredromsdata);
        } catch (a) {}
        e || b();
      }
      return e;
    }
    function b() {
      (d = []),
        (localStorage.javataristoredromsicatalog = JSON.stringify(d)),
        (e = []),
        (localStorage.javataristoredromsdata = JSON.stringify(e));
    }
    (this.getCatalog = function () {
      if (!d) {
        try {
          d = JSON.parse(localStorage.javataristoredromsicatalog);
        } catch (a) {}
        d || b();
      }
      return d;
    }),
      (this.storeROM = function (b) {
        this.getCatalog();
        var c = d.find(function (a) {
          return a && a.h === b.info.h;
        });
        if (c && c.n == b.info.l && c.f == b.info.f)
          this.lastROMLoadedIndex = d.indexOf(c);
        else {
          if ((a(), c)) {
            var g = d.indexOf(c);
            d.splice(g, 1), e.splice(g, 1);
          } else
            d.length >= f && ((d = d.slice(0, f - 1)), (e = e.slice(0, f - 1)));
          d.unshift({ n: b.info.l, h: b.info.h, f: b.info.f });
          for (var h = 0; h < d.length; ++h) d[h].i = h;
          (localStorage.javataristoredromsicatalog = JSON.stringify(d)),
            e.unshift(b.saveState(!0)),
            (localStorage.javataristoredromsdata = JSON.stringify(e)),
            (this.lastROMLoadedIndex = 0),
            jt.Util.log("New ROM stored: " + b.info.n + ", " + b.info.h);
        }
        localStorage.javataristoredromslastindex = this.lastROMLoadedIndex;
      }),
      (this.getROM = function (b) {
        (this.lastROMLoadedIndex = b),
          (localStorage.javataristoredromslastindex = b);
        var c = a()[b];
        return c ? jt.ROM.loadState(c) : null;
      });
    var c = localStorage.javataristoredromslastindex;
    this.lastROMLoadedIndex = void 0 !== c ? Number.parseInt(c) : -1;
    var d,
      e,
      f = 10;
  }),
  (jt.FileLoader = function (a, b, c) {
    "use strict";
    function d(a, b, c, d, f, g, h) {
      for (var i = 0; i < a.length; i++)
        if (e(a[i], b, c, d, f, g, h)) return !0;
      return !1;
    }
    function e(a, b, c, d, g, h, i, j) {
      try {
        i && !a.content && (a.content = a.asUint8Array());
        var k = a.content;
        if (!j) {
          var l = jt.Util.checkContentIsZIP(k);
          if (l) {
            for (var m = jt.Util.getZIPFilesSorted(l), n = 0; n < m.length; n++)
              if (e(m[n], b, c, d, g, h, !0, !0)) return !0;
            return !1;
          }
        }
        var o = jt.Util.checkContentIsGZIP(k);
        if (o) return e({ name: a.name, content: o }, b, c, d, g, h, !1, !0);
      } catch (a) {
        return jt.Util.error(a), !1;
      }
      return f(a.name, k, b, c, d, g, h);
    }
    function f(a, b, c, d, e, f, g) {
      if (((c = c || y.AUTO) === y.STATE || c === y.AUTO) && o.loadStateFile(b))
        return !0;
      if ((c === y.CART_DATA || c === y.AUTO) && n.loadCartridgeData(d, a, b))
        return !0;
      if (c === y.ROM || c === y.AUTO) {
        var h = new jt.ROM(a, b, null, g);
        return l.loadROM(h, d, e, f);
      }
      return !1;
    }
    function g(a) {
      if (
        ((a.returnValue = !1),
        a.preventDefault(),
        a.stopPropagation(),
        a.target.focus(),
        this.files && 0 !== this.files.length)
      ) {
        var b = jt.Util.asNormalArray(this.files);
        try {
          p.value = "";
        } catch (a) {}
        var c = m.systemPause(!0),
          d = function (a) {
            c || m.systemPause(!1);
          };
        return (
          b &&
            b.length > 0 &&
            (1 === b.length
              ? l.readFromFile(b[0], r, s, t, u, d)
              : l.readFromFiles(b, r, s, t, u, d)),
          !1
        );
      }
    }
    function h(a) {
      (a.returnValue = !1),
        a.preventDefault(),
        a.stopPropagation(),
        a.dataTransfer &&
          (Javatari.CARTRIDGE_CHANGE_DISABLED
            ? (a.dataTransfer.dropEffect = "none")
            : a.ctrlKey
            ? (a.dataTransfer.dropEffect = "copy")
            : a.altKey && (a.dataTransfer.dropEffect = "link")),
        (v = a.buttons > 0 ? a.buttons : w);
    }
    function i(a) {
      if (
        ((a.returnValue = !1),
        a.preventDefault(),
        a.stopPropagation(),
        a.target.focus(),
        a.dataTransfer && !c.mediaChangeDisabledWarning())
      ) {
        var b = m.systemPause(!0),
          d = a.shiftKey ? 1 : 0,
          e = v & x,
          f = a.ctrlKey,
          g = y.AUTO,
          h = a.dataTransfer && a.dataTransfer.files,
          i = function (a) {
            b || m.systemPause(!1);
          };
        if (h && h.length > 0)
          1 === h.length
            ? l.readFromFile(h[0], g, d, e, f, i)
            : l.readFromFiles(h, g, d, e, f, i);
        else {
          var j = a.dataTransfer.getData("text");
          j && j.length > 0 ? l.readFromURL(j, g, d, e, f, i) : i();
        }
      }
    }
    function j(a) {
      jt.Util.message("Could not load file(s):\n\n" + a + "\n");
    }
    function k() {
      (p = document.createElement("input")),
        (p.id = "jt-file-loader-input"),
        (p.type = "file"),
        (p.multiple = !0),
        (p.accept = z.AUTO),
        (p.style.display = "none"),
        p.addEventListener("change", g),
        q.appendChild(p);
    }
    var l = this;
    (this.connect = function (a) {
      (m = a), (n = m.getCartridgeSocket()), (o = m.getSavestateSocket());
    }),
      (this.registerForDnD = function (a) {
        a.addEventListener("dragover", h, !1),
          a.addEventListener("drop", i, !1);
      }),
      (this.registerForFileInputElement = function (a) {
        q = a;
      }),
      (this.openFileChooserDialog = function (a, b, c, d) {
        p || k(),
          (p.multiple = A[y[a] || y.AUTO]),
          (p.accept = z[y[a] || y.AUTO]),
          (r = a),
          (s = c ? 1 : 0),
          (t = b),
          (u = d),
          p.click();
      }),
      (this.openURLChooserDialog = function (a, b, c, d) {
        var e,
          f = c ? 1 : 0;
        try {
          e = localStorage && localStorage[C];
        } catch (a) {}
        var g = m.systemPause(!0);
        if (
          ((e = prompt("Load file from URL:", e || "")),
          (e = e && e.toString().trim()))
        ) {
          try {
            localStorage[C] = e;
          } catch (a) {}
          this.readFromURL(e, a, f, b, d, function () {
            g || m.systemPause(!1);
          });
        } else g || m.systemPause(!1);
      }),
      (this.readFromFile = function (a, b, c, d, e, f) {
        jt.Util.log("Reading file: " + a.name);
        var g = new FileReader();
        (g.onload = function (g) {
          var h = new Uint8Array(g.target.result),
            i = {
              name: a.name,
              content: h,
              lastModifiedDate: a.lastModified
                ? new Date(a.lastModified)
                : a.lastModifiedDate,
            };
          l.loadFromFile(i, b, c, d, e), f && f(!0);
        }),
          (g.onerror = function (a) {
            j("File reading error: " + a.target.error.name + D), f && f(!1);
          }),
          g.readAsArrayBuffer(a);
      }),
      (this.readFromURL = function (a, b, c, d, e, f) {
        new jt.MultiDownloader(
          [{ url: a }],
          function (g) {
            var h = { name: a, content: g[0].content, lastModifiedDate: null };
            l.loadFromFile(h, b, c, d, e), f && f(!0);
          },
          function (a) {
            j("URL reading error: " + a[0].error), f && f(!1);
          }
        ).start();
      }),
      (this.readFromFiles = function (a, b, c, d, e, f) {
        new jt.MultiFileReader(
          a,
          function (a) {
            l.loadFromFiles(a, b, c, d, e), f && f(!0);
          },
          function (a, b, c) {
            c || (b += D), j("File reading error: " + b), f && f(!1);
          }
        ).start();
      }),
      (this.loadFromContent = function (a, b, c, d, e, f, g) {
        return this.loadFromFile({ name: a, content: b }, c, d, e, f, g);
      }),
      (this.loadFromFile = function (a, b, c, e, f, g) {
        var h;
        if ((h = jt.Util.checkContentIsZIP(a.content)))
          try {
            if (d(jt.Util.getZIPFilesSorted(h), b, c, e, f, g, !0)) return;
          } catch (a) {
            jt.Util.error(a);
          }
        else if (d([a], b, c, e, f, g, !1)) return;
        j("No valid " + B[b] + " found.");
      }),
      (this.loadFromFiles = function (a, b, c, e, f) {
        (a = jt.Util.asNormalArray(a).slice(0)),
          a.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          }),
          d(a, b, c, e, f, null, !1) || j("No valid " + B[b] + " found.");
      }),
      (this.loadROM = function (a, c, d, e) {
        var f = jt.CartridgeCreator.createCartridgeFromRom(a);
        return !!f && (n.insert(f, !d), b.storeROM(a), !0);
      });
    var m,
      n,
      o,
      p,
      q,
      r,
      s = 0,
      t = !1,
      u = !1,
      v = 1,
      w = 1,
      x = 2,
      y = jt.FileLoader.OPEN_TYPE;
    this.OPEN_TYPE = y;
    var z = {
        ROM: ".bin,.BIN,.rom,.ROM,.a26,.A26,.zip,.ZIP,.gz,.GZ,.gzip,.GZIP",
        STATE: ".jst,.JST",
        CART_DATA: ".dat,.DAT,.sram,.SRAM",
        AUTO: ".bin,.BIN,.rom,.ROM,.a26,.A26,.jst,.JST,.zip,.ZIP,.gz,.GZ,.gzip,.GZIP",
      },
      A = { ROM: !1, STATE: !1, CART_DATA: !1, AUTO: !1 },
      B = {
        ROM: "ROM",
        STATE: "Savestate",
        CART_DATA: "Cartridge Data",
        AUTO: "ROM",
      },
      C = "javatarilasturl",
      D = "\n\nIMPORTANT: Directories are not supported for loading!";
    Javatari.fileLoader = this;
  }),
  (jt.FileLoader.OPEN_TYPE = {
    AUTO: "AUTO",
    ROM: "ROM",
    STATE: "STATE",
    CART_DATA: "CART_DATA",
  }),
  (jt.FileDownloader = function () {
    "use strict";
    function a() {
      if ("NONE" === c)
        return (
          alert(
            "Unfortunately file saving in WebApps is broken in this version of iOS. The file could not be saved. If you really need to save a file, you must run Javatari on the official homepage."
          ),
          !0
        );
    }
    function b() {
      "NONE" !==
        (c = jt.Util.isIOSDevice()
          ? jt.Util.isBrowserStandaloneMode()
            ? "NONE"
            : "DATA"
          : "SAFARI" === jt.Util.browserInfo().name
          ? "DATA"
          : "BLOB") &&
        ((d = document.createElement("a")),
        (d.style.display = "none"),
        (d.target = "_blank"),
        (d.href = "#"),
        e.appendChild(d));
    }
    (this.connectPeripherals = function (a) {
      f = a;
    }),
      (this.registerForDownloadElement = function (a) {
        e = a;
      }),
      (this.startDownloadBinary = function (e, g, h) {
        try {
          if ((c || b(), a())) return;
          var i;
          if ("BLOB" === c) {
            d.href && (window.URL || window.webkitURL).revokeObjectURL(d.href);
            var j = new Blob([g], { type: "data:application/octet-stream" });
            i = (window.URL || window.webkitURL).createObjectURL(j);
          } else
            i =
              "data:application/octet-stream;base64," +
              btoa(
                "string" == typeof g ? g : jt.Util.int8BitArrayToByteString(g)
              );
          (d.download = e && e.trim()),
            (d.href = i),
            d.click(),
            f.showOSD(h + " saved", !0);
        } catch (a) {
          f.showOSD(h + " save FAILED!", !0, !0), jt.Util.error(a);
        }
      }),
      (this.startDownloadURL = function (e, g, h) {
        try {
          if ((c || b(), a())) return;
          "BLOB" === c &&
            d.href &&
            (window.URL || window.webkitURL).revokeObjectURL(d.href),
            (d.download = e && e.trim()),
            (d.href = g),
            d.click(),
            f.showOSD(h + " saved", !0);
        } catch (a) {
          f.showOSD(h + " save FAILED!", !0, !0), jt.Util.error(a);
        }
      });
    var c, d, e, f;
  }),
  (jt.DOMKeys = {}),
  (jt.DOMKeys.MOD_SHIFT = 16),
  (jt.DOMKeys.LOC_SHIFT = 24),
  (jt.DOMKeys.SHIFT = 65536),
  (jt.DOMKeys.CONTROL = 131072),
  (jt.DOMKeys.ALT = 262144),
  (jt.DOMKeys.META = 524288),
  (jt.DOMKeys.LOCNONE = 0),
  (jt.DOMKeys.LOCLEFT = 16777216),
  (jt.DOMKeys.LOCRIGHT = 33554432),
  (jt.DOMKeys.LOCNUM = 50331648),
  (jt.DOMKeys.IGNORE_ALL_MODIFIERS_MASK = ~(
    jt.DOMKeys.SHIFT |
    jt.DOMKeys.CONTROL |
    jt.DOMKeys.ALT |
    jt.DOMKeys.META
  )),
  (function (a, b, c, d) {
    (a.VK_F1 = { c: 112, n: "F1" }),
      (a.VK_F2 = { c: 113, n: "F2" }),
      (a.VK_F3 = { c: 114, n: "F3" }),
      (a.VK_F4 = { c: 115, n: "F4" }),
      (a.VK_F5 = { c: 116, n: "F5" }),
      (a.VK_F6 = { c: 117, n: "F6" }),
      (a.VK_F7 = { c: 118, n: "F7" }),
      (a.VK_F8 = { c: 119, n: "F8" }),
      (a.VK_F9 = { c: 120, n: "F9" }),
      (a.VK_F10 = { c: 121, n: "F10" }),
      (a.VK_F11 = { c: 122, n: "F11" }),
      (a.VK_F12 = { c: 123, n: "F12" }),
      (a.VK_1 = { c: 49, n: "1" }),
      (a.VK_2 = { c: 50, n: "2" }),
      (a.VK_3 = { c: 51, n: "3" }),
      (a.VK_4 = { c: 52, n: "4" }),
      (a.VK_5 = { c: 53, n: "5" }),
      (a.VK_6 = { c: 54, n: "6" }),
      (a.VK_7 = { c: 55, n: "7" }),
      (a.VK_8 = { c: 56, n: "8" }),
      (a.VK_9 = { c: 57, n: "9" }),
      (a.VK_0 = { c: 48, n: "0" }),
      (a.VK_Q = { c: 81, n: "Q" }),
      (a.VK_W = { c: 87, n: "W" }),
      (a.VK_E = { c: 69, n: "E" }),
      (a.VK_R = { c: 82, n: "R" }),
      (a.VK_T = { c: 84, n: "T" }),
      (a.VK_Y = { c: 89, n: "Y" }),
      (a.VK_U = { c: 85, n: "U" }),
      (a.VK_I = { c: 73, n: "I" }),
      (a.VK_O = { c: 79, n: "O" }),
      (a.VK_P = { c: 80, n: "P" }),
      (a.VK_A = { c: 65, n: "A" }),
      (a.VK_S = { c: 83, n: "S" }),
      (a.VK_D = { c: 68, n: "D" }),
      (a.VK_F = { c: 70, n: "F" }),
      (a.VK_G = { c: 71, n: "G" }),
      (a.VK_H = { c: 72, n: "H" }),
      (a.VK_J = { c: 74, n: "J" }),
      (a.VK_K = { c: 75, n: "K" }),
      (a.VK_L = { c: 76, n: "L" }),
      (a.VK_Z = { c: 90, n: "Z" }),
      (a.VK_X = { c: 88, n: "X" }),
      (a.VK_C = { c: 67, n: "C" }),
      (a.VK_V = { c: 86, n: "V" }),
      (a.VK_B = { c: 66, n: "B" }),
      (a.VK_N = { c: 78, n: "N" }),
      (a.VK_M = { c: 77, n: "M" }),
      (a.VK_ESCAPE = { c: 27, n: "Esc" }),
      (a.VK_ENTER = { c: 13, n: "Enter" }),
      (a.VK_SPACE = { c: 32, n: "Space" }),
      (a.VK_TAB = { c: 9, n: "Tab" }),
      (a.VK_BACKSPACE = { c: 8, n: "BackSpc" }),
      (a.VK_CONTEXT = { c: 93, n: "Context" }),
      (a.VK_LSHIFT = { c: 16 | b, n: "L-Shift" }),
      (a.VK_LCONTROL = { c: 17 | b, n: "L-Control" }),
      (a.VK_LALT = { c: 18 | b, n: "L-Alt" }),
      (a.VK_LMETA = { c: 91 | b, n: "L-Meta" }),
      (a.VK_RSHIFT = { c: 16 | c, n: "R-Shift" }),
      (a.VK_RCONTROL = { c: 17 | c, n: "R-Control" }),
      (a.VK_RALT = { c: 18 | c, n: "R-Alt" }),
      (a.VK_RMETA = { c: 91 | c, n: "R-Meta" }),
      (a.VK_CAPS_LOCK = { c: 20, n: "CapsLock" }),
      (a.VK_PRINT_SCREEN = { c: 44, n: "PrtScr" }),
      (a.VK_SCROLL_LOCK = { c: 145, n: "ScrLck" }),
      (a.VK_PAUSE = { c: 19, n: "Pause" }),
      (a.VK_BREAK = { c: 3, n: "Break" }),
      (a.VK_INSERT = { c: 45, n: "Ins" }),
      (a.VK_DELETE = { c: 46, n: "Del" }),
      (a.VK_HOME = { c: 36, n: "Home" }),
      (a.VK_END = { c: 35, n: "End" }),
      (a.VK_PAGE_UP = { c: 33, n: "PgUp" }),
      (a.VK_PAGE_DOWN = { c: 34, n: "PgDown" }),
      (a.VK_NUM_INSERT = { c: 45 | d, n: "Num Ins" }),
      (a.VK_NUM_DELETE = { c: 46 | d, n: "Num Del" }),
      (a.VK_NUM_HOME = { c: 36 | d, n: "Num Home" }),
      (a.VK_NUM_END = { c: 35 | d, n: "Num End" }),
      (a.VK_NUM_PAGE_UP = { c: 33 | d, n: "Num PgUp" }),
      (a.VK_NUM_PAGE_DOWN = { c: 34 | d, n: "Num PgDown" }),
      (a.VK_UP = { c: 38, n: "Up" }),
      (a.VK_DOWN = { c: 40, n: "Down" }),
      (a.VK_LEFT = { c: 37, n: "Left" }),
      (a.VK_RIGHT = { c: 39, n: "Right" }),
      (a.VK_NUM_UP = { c: 38 | d, n: "Num Up" }),
      (a.VK_NUM_DOWN = { c: 40 | d, n: "Num Down" }),
      (a.VK_NUM_LEFT = { c: 37 | d, n: "Num Left" }),
      (a.VK_NUM_RIGHT = { c: 39 | d, n: "Num Right" }),
      (a.VK_NUMLOCK = { c: 144, n: "NumLock" }),
      (a.VK_NUM_COMMA = { c: 110 | d, n: "Num ," }),
      (a.VK_NUM_DIVIDE = { c: 111 | d, n: "Num /" }),
      (a.VK_NUM_MULTIPLY = { c: 106 | d, n: "Num *" }),
      (a.VK_NUM_MINUS = { c: 109 | d, n: "Num -" }),
      (a.VK_NUM_PLUS = {
        c: 107 | d,
        n: "Num +",
      }),
      (a.VK_NUM_PERIOD = { c: 194 | d, n: "Num ." }),
      (a.VK_NUM_0 = { c: 96 | d, n: "Num 0" }),
      (a.VK_NUM_1 = { c: 97 | d, n: "Num 1" }),
      (a.VK_NUM_2 = { c: 98 | d, n: "Num 2" }),
      (a.VK_NUM_3 = { c: 99 | d, n: "Num 3" }),
      (a.VK_NUM_4 = { c: 100 | d, n: "Num 4" }),
      (a.VK_NUM_5 = { c: 101 | d, n: "Num 5" }),
      (a.VK_NUM_6 = { c: 102 | d, n: "Num 6" }),
      (a.VK_NUM_7 = { c: 103 | d, n: "Num 7" }),
      (a.VK_NUM_8 = { c: 104 | d, n: "Num 8" }),
      (a.VK_NUM_9 = { c: 105 | d, n: "Num 9" }),
      (a.VK_NUM_CLEAR = { c: 12 | d, n: "Num Clear" }),
      (a.VK_NUM_ENTER = { c: 13 | d, n: "Num Enter" }),
      (a.VK_QUOTE = { c: 222, n: "'" }),
      (a.VK_BACKQUOTE = { c: 192, n: "`" }),
      (a.VK_MINUS = { c: 189, n: "-" }),
      (a.VK_EQUALS = { c: 187, n: "=" }),
      (a.VK_OPEN_BRACKET = { c: 219, n: "[" }),
      (a.VK_CLOSE_BRACKET = { c: 221, n: "]" }),
      (a.VK_COMMA = { c: 188, n: "," }),
      (a.VK_PERIOD = { c: 190, n: "." }),
      (a.VK_SEMICOLON = { c: 186, n: ";" }),
      (a.VK_SLASH = { c: 191, n: "/" }),
      (a.VK_BACKSLASH = { c: 220, n: "\\" }),
      (a.VK_ALTERNATE_ESC = {
        c: a.VK_F1.c | jt.DOMKeys.ALT,
        n: ["Alt", "F1"],
      }),
      (a.VK_FF_MINUS = { c: 173, n: "-" }),
      (a.VK_FF_EQUALS = { c: 61, n: "=" }),
      (a.VK_FF_SEMICOLON = { c: 59, n: ";" }),
      (a.VK_BR_QUOTE = { c: 192, n: "'" }),
      (a.VK_BR_OPEN_BRACKET = { c: 221, n: "[" }),
      (a.VK_BR_CLOSE_BRACKET = { c: 220, n: "]" }),
      (a.VK_BR_SEMICOLON = { c: 191, n: ";" }),
      (a.VK_BR_SLASH = { c: 193, n: "/" }),
      (a.VK_BR_BACKSLASH = { c: 226, n: "\\" }),
      (a.VK_BR_CEDILLA = { c: 186, n: "Ç" }),
      (a.VK_BR_TILDE = { c: 222, n: "~" }),
      (a.VK_BR_ACUTE = { c: 219, n: "´" }),
      (a.VK_FF_BR_TILDE = { c: 176, n: "~" }),
      (a.VK_VOID = { c: -1, n: "" });
  })(jt.DOMKeys, jt.DOMKeys.LOCLEFT, jt.DOMKeys.LOCRIGHT, jt.DOMKeys.LOCNUM),
  (jt.DOMKeys.forcedNames = {
    27: "Esc",
    13: "Enter",
    32: "Space",
    9: "Tab",
    8: "BkSpc",
    16: "Shift",
    17: "Ctrl",
    18: "Alt",
    91: "Meta",
    93: "Context",
    20: "Caps",
    44: "PrtScr",
    145: "ScrLck",
    19: "Pause",
    3: "Break",
    45: "Ins",
    46: "Del",
    36: "Home",
    35: "End",
    33: "PgUp",
    34: "PgDown",
    38: "Up",
    40: "Down",
    37: "Left",
    39: "Right",
  }),
  (jt.DOMKeys.isModifierKeyCode = function (a) {
    return 16 === a || 17 === a || 18 === a || 91 === a;
  }),
  (jt.DOMKeys.codeForKeyboardEvent = function (a) {
    var b = a.keyCode;
    return this.isModifierKeyCode(b)
      ? (b & this.IGNORE_ALL_MODIFIERS_MASK) | (a.location << this.LOC_SHIFT)
      : b |
          (a.location << this.LOC_SHIFT) |
          (a.shiftKey ? this.SHIFT : 0) |
          (a.ctrlKey ? this.CONTROL : 0) |
          (a.altKey ? this.ALT : 0) |
          (a.metaKey ? this.META : 0);
  }),
  (jt.DOMKeys.nameForKeyboardEvent = function (a) {
    var b = a.keyCode,
      c = this.forcedNames[b] || a.key,
      d = c && c.toUpperCase();
    switch (
      (d && "UNIDENTIFIED" !== d && "UNDEFINED" !== d && "UNKNOWN" !== d
        ? "DEAD" === d && (c = "Dead#" + b)
        : (c = "#" + b),
      1 === c.length
        ? (c = c.toUpperCase())
        : c.length > 12 && (c = c.substr(0, 12)),
      a.location)
    ) {
      case 1:
        c = "L-" + c;
        break;
      case 2:
        c = "R-" + c;
        break;
      case 3:
        c = "Num " + c;
    }
    return (
      (a.shiftKey || a.ctrlKey || a.altKey || a.metaKey) &&
        ((c = [c]),
        a.metaKey && c.unshift("Meta"),
        a.altKey && c.unshift("Alt"),
        a.ctrlKey && c.unshift("Ctrl"),
        a.shiftKey && c.unshift("Shift")),
      c
    );
  }),
  (jt.DOMKeys.nameForKeyboardEventSingle = function (a) {
    var b = a.keyCode,
      c = this.forcedNames[b] || a.key,
      d = c && c.toUpperCase();
    switch (
      (d && "UNIDENTIFIED" !== d && "UNDEFINED" !== d && "UNKNOWN" !== d
        ? "DEAD" === d && (c = "Dead#" + b)
        : (c = "#" + b),
      1 === c.length
        ? (c = c.toUpperCase())
        : c.length > 12 && (c = c.substr(0, 12)),
      a.location)
    ) {
      case 1:
        c = "L-" + c;
        break;
      case 2:
        c = "R-" + c;
        break;
      case 3:
        c = "Num " + c;
    }
    return c;
  }),
  (jt.GamepadButtons = {
    GB_1: { b: 0, n: "1" },
    GB_2: { b: 1, n: "2" },
    GB_3: { b: 2, n: "3" },
    GB_4: { b: 3, n: "4" },
    GB_L1: { b: 4, n: "L1" },
    GB_R1: { b: 5, n: "R1" },
    GB_L2: { b: 6, n: "L2" },
    GB_R2: { b: 7, n: "R2" },
    GB_BACK: { b: 8, n: "BACK" },
    GB_START: { b: 9, n: "START" },
    GB_S1: { b: 10, n: "S1" },
    GB_S2: { b: 11, n: "S2" },
    GB_UP: { b: 12, n: "&#9650;" },
    GB_DOWN: { b: 13, n: "&#9660;" },
    GB_LEFT: { b: 14, n: "&#9668;" },
    GB_RIGHT: { b: 15, n: "&#9658;" },
    GB_LOGO: { b: 16, n: "LOGO" },
    GB_VOID: { b: -1, n: "Unbound" },
  }),
  (jt.TouchControls = { buttons: ["T_B", "T_A"] }),
  (jt.GamepadConsoleControls = function (a) {
    "use strict";
    function b(a, b) {
      (this.index = a),
        (this.update = function (b) {
          return !!(c = b[a]);
        }),
        (this.hasMoved = function () {
          var a = c.timestamp;
          return !a || (a > m && ((m = a), !0));
        }),
        (this.getButtonDigital = function (a) {
          var b = c.buttons[a];
          return "object" == typeof b ? b.pressed || b.value > 0.5 : b > 0.5;
        }),
        (this.getDPadDirection = function () {
          return this.getButtonDigital(12)
            ? this.getButtonDigital(15)
              ? 1
              : this.getButtonDigital(14)
              ? 7
              : 0
            : this.getButtonDigital(13)
            ? this.getButtonDigital(15)
              ? 3
              : this.getButtonDigital(14)
              ? 5
              : 4
            : this.getButtonDigital(14)
            ? 6
            : this.getButtonDigital(15)
            ? 2
            : -1;
        }),
        (this.getStickDirection = function () {
          var a = c.axes[d],
            b = c.axes[e];
          if (
            ((a < 0 ? -a : a) < l ? (a = 0) : (a *= f),
            (b < 0 ? -b : b) < l ? (b = 0) : (b *= g),
            0 === a && 0 === b)
          )
            return -1;
          var h = (1 - Math.atan2(a, b) / Math.PI) / 2;
          return (h += 1 / 16), h >= 1 && (h -= 1), (8 * h) | 0;
        }),
        (this.getPaddlePosition = function () {
          var a = (c.axes[h] * i * j + k) | 0;
          return a < 0 ? (a = 0) : a > 380 && (a = 380), a;
        });
      var c,
        d = b.xAxis,
        e = b.yAxis,
        f = b.xAxisSig,
        g = b.yAxisSig,
        h = b.paddleAxis,
        i = b.paddleAxisSig,
        j = -190 * b.paddleSens,
        k = -190 * b.paddleCenter + 190 - 5,
        l = b.deadzone,
        m = Number.MIN_VALUE;
    }
    (this.connect = function (a) {
      h = a;
    }),
      (this.connectScreen = function (a) {
        i = a;
      }),
      (this.powerOn = function () {
        (r = !!navigator.getGamepads) && (this.applyPreferences(), e());
      }),
      (this.powerOff = function () {
        r = !1;
      }),
      (this.toggleMode = function () {
        if (!r)
          return void i.showOSD(
            "Joysticks unavailable (not supported by browser)",
            !0,
            !0
          );
        ++u,
          u > 0 && (u = -2),
          -2 === u
            ? (j = k = null)
            : -1 === u && ((s = 60), this.controlsClockPulse()),
          (w = 0 === u),
          this.applyPreferences(),
          e(),
          i.showOSD("Gamepads " + this.getModeDesc(), !0);
      }),
      (this.setPaddleMode = function (a) {
        r && ((v = a), (l.xPosition = m.xPosition = -1));
      }),
      (this.setP1ControlsMode = function (a) {
        (x = a), this.applyPreferences();
      }),
      (this.controlsClockPulse = function () {
        if (r && -2 !== u && (++s >= 60 && (s = 0), j || k || 0 === s)) {
          var a = navigator.getGamepads();
          j
            ? j.update(a)
              ? j.hasMoved() && f(j, l, n, p)
              : ((j = null), c(!0, !1))
            : 0 === s && (j = d(n, o, a)) && c(!0, !0),
            k
              ? k.update(a)
                ? k.hasMoved() && f(k, m, o, q)
                : ((k = null), c(!1, !1))
              : 0 === s && (k = d(o, n, a)) && c(!1, !0);
        }
      });
    var c = function (a, b) {
        i.showOSD(
          (a ^ x ^ w ? "P1" : "P2") +
            " Gamepad " +
            (b ? "connected" : "disconnected"),
          a
        );
      },
      d = function (a, c, d) {
        if (d && 0 !== d.length) {
          var e = a.device;
          if (e >= 0)
            return d[e] && d[e].buttons.length > 0 ? new b(e, a) : null;
          for (var f = 0, g = d.length; f < g; f++)
            if (
              d[f] &&
              d[f].buttons.length > 0 &&
              !(f === c.device || (j && j.index === f) || (k && k.index === f))
            )
              return new b(f, a);
        }
      },
      e = function () {
        (l = g()), (m = g());
      },
      f = function (b, c, d, e) {
        if (v && 0 !== d.paddleSens) {
          var f = b.getPaddlePosition();
          f !== c.xPosition &&
            ((c.xPosition = f),
            a.processControlValue(
              d.player ? t.PADDLE1_POSITION : t.PADDLE0_POSITION,
              f
            ));
        }
        var g = b.getDPadDirection();
        if (
          (-1 !== g || (v && 0 !== d.paddleSens) || (g = b.getStickDirection()),
          g !== c.direction)
        ) {
          var h = !1,
            i = !1,
            j = !1,
            k = !1;
          switch (g) {
            case 0:
              h = !0;
              break;
            case 1:
              h = i = !0;
              break;
            case 2:
              i = !0;
              break;
            case 3:
              j = i = !0;
              break;
            case 4:
              j = !0;
              break;
            case 5:
              j = k = !0;
              break;
            case 6:
              k = !0;
              break;
            case 7:
              h = k = !0;
          }
          a.processKey(e.up.c, h),
            a.processKey(e.right.c, i),
            a.processKey(e.down.c, j),
            a.processKey(e.left.c, k),
            (c.direction = g);
        }
        var l = b.getButtonDigital(d.button);
        l !== c.button && (a.processKey(e.button.c, l), (c.button = l)),
          (l = b.getButtonDigital(d.buttonT)) !== c.buttonT &&
            (a.processKey(e.buttonT.c, l), (c.buttonT = l));
        var m = b.getButtonDigital(d.select);
        m !== c.select && (a.processControlState(t.SELECT, m), (c.select = m));
        var n = b.getButtonDigital(d.reset);
        n !== c.reset && (a.processControlState(t.RESET, n), (c.reset = n));
        var o = b.getButtonDigital(d.pause);
        o !== c.pause && (a.processControlState(t.PAUSE, o), (c.pause = o));
        var p = b.getButtonDigital(d.fastSpeed);
        p !== c.fastSpeed &&
          (a.processControlState(t.FAST_SPEED, p), (c.fastSpeed = p));
        var q = b.getButtonDigital(d.slowSpeed);
        q !== c.slowSpeed &&
          (a.processControlState(t.SLOW_SPEED, q), (c.slowSpeed = q));
      },
      g = function () {
        return {
          direction: -1,
          button: !1,
          buttonT: !1,
          select: !1,
          reset: !1,
          fastSpeed: !1,
          pause: !1,
          xPosition: -1,
        };
      };
    (this.getModeDesc = function () {
      switch (u) {
        case -1:
          return "AUTO";
        case 0:
          return "AUTO (swapped)";
        default:
          return r ? "DISABLED" : "NOT SUPPORTED";
      }
    }),
      (this.applyPreferences = function () {
        var a = w ? 1 : 0,
          b = a ? 0 : 1;
        (n = y.joystickGamepads[a]),
          (n.player = x ^ w ? 1 : 0),
          (o = y.joystickGamepads[b]),
          (o.player = x ^ w ? 0 : 1),
          (p = y.joystickKeys[a]),
          (q = y.joystickKeys[b]);
      });
    var h,
      i,
      j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r = !1,
      s = -1,
      t = jt.ConsoleControls,
      u = -1,
      v = !1,
      w = !1,
      x = !1,
      y = Javatari.userPreferences.current;
  }),
  (jt.DOMTouchControls = function (a) {
    "use strict";
    function b() {
      w.classList.toggle("jt-poweroff", !J), w.classList.toggle("jt-paused", K);
    }
    function c() {
      var a = A > 0;
      document.documentElement.classList.toggle("jt-touch-active", a),
        document.documentElement.classList.toggle("jt-dir-big", C),
        t.touchControlsActiveUpdate(a, C);
    }
    function d(a) {
      if ((jt.Util.blockEvent(a), null === E)) {
        void 0 === u && i();
        var b = a.changedTouches[0];
        (E = b.identifier), g(b.pageX, b.pageY);
      }
    }
    function e(a) {
      jt.Util.blockEvent(a), null !== E && ((E = null), h(-1));
    }
    function f(a) {
      if ((jt.Util.blockEvent(a), null !== E))
        for (var b = a.changedTouches, c = 0; c < b.length; ++c)
          if (b[c].identifier === E) return void g(b[c].pageX, b[c].pageY);
    }
    function g(a, b) {
      var c = -1,
        d = a - u,
        e = b - v;
      Math.sqrt(d * d + e * e) > G &&
        ((c = (1 - Math.atan2(d, e) / Math.PI) / 2),
        (c += 1 / 16),
        c >= 1 && (c -= 1),
        (c = (8 * c) | 0)),
        h(c);
    }
    function h(b) {
      if (F !== b) {
        b >= 0 && a.hapticFeedback();
        var c = !1,
          d = !1,
          e = !1,
          f = !1;
        switch (b) {
          case 0:
            c = !0;
            break;
          case 1:
            c = d = !0;
            break;
          case 2:
            d = !0;
            break;
          case 3:
            e = d = !0;
            break;
          case 4:
            e = !0;
            break;
          case 5:
            e = f = !0;
            break;
          case 6:
            f = !0;
            break;
          case 7:
            c = f = !0;
        }
        a.processKey(x.up.c, c),
          a.processKey(x.right.c, d),
          a.processKey(x.down.c, e),
          a.processKey(x.left.c, f),
          (F = b);
      }
    }
    function i() {
      var a = D.getBoundingClientRect();
      (G = (0.14 * (a.right - a.left)) | 0),
        (u = (((a.left + a.right) / 2) | 0) + window.pageXOffset),
        (v = (((a.top + a.bottom) / 2) | 0) + window.pageYOffset);
    }
    function j(a) {
      jt.Util.blockEvent(a), l(a.target.jtControl, !0);
    }
    function k(a) {
      jt.Util.blockEvent(a), l(a.target.jtControl, !1);
    }
    function l(b, c) {
      b && (c && a.hapticFeedback(), a.processKey(x[b].c, c));
    }
    function m(b) {
      jt.Util.blockEvent(b),
        a.hapticFeedback(),
        a.processControlState(
          J ? jt.ConsoleControls.PAUSE : jt.ConsoleControls.POWER,
          !0
        );
    }
    function n(b) {
      jt.Util.blockEvent(b),
        a.processControlState(
          J ? jt.ConsoleControls.PAUSE : jt.ConsoleControls.POWER,
          !1
        );
    }
    function o(b) {
      jt.Util.blockEvent(b),
        a.processControlState(
          K ? jt.ConsoleControls.FRAME : jt.ConsoleControls.FAST_SPEED,
          !0
        );
    }
    function p(b) {
      jt.Util.blockEvent(b),
        a.processControlState(
          K ? jt.ConsoleControls.FRAME : jt.ConsoleControls.FAST_SPEED,
          !1
        );
    }
    function q() {
      I.reset(), (u = v = void 0), (E = null), h(-1);
    }
    function r() {
      (this.reset = function () {
        this.portValue = 63;
      }),
        this.reset();
    }
    (this.connect = function (a) {
      s = a;
    }),
      (this.connectScreen = function (a) {
        t = a;
      }),
      (this.powerOn = function () {
        this.applyPreferences(), q(), c();
      }),
      (this.powerOff = function () {}),
      (this.releaseControllers = function () {
        q();
      }),
      (this.updateConsolePanelSize = function (a, b, c, d, e) {
        if (w && d) {
          var f = !e && (a - b - 10) / 2 < M;
          w.classList.toggle("jt-center", f),
            f
              ? (w.style.bottom = jt.ScreenGUI.BAR_HEIGHT + c + 3 + "px")
              : w.style.removeProperty("bottom");
        }
      }),
      (this.toggleMode = function () {
        if (!y)
          return void t.showOSD(
            "Touch Controls unavailable. Not a touch device!",
            !0,
            !0
          );
        A++,
          A > 2 && (A = 0),
          q(),
          this.applyPreferences(),
          c(),
          t.showOSD("Touch Controls " + this.getModeDesc(), !0);
      }),
      (this.setP1ControlsMode = function (a) {
        (B = a), this.applyPreferences();
      }),
      (this.getModeDesc = function () {
        switch (A) {
          case -1:
            return "AUTO";
          case 0:
            return "DISABLED";
          case 1:
            return "ENABLED";
          case 2:
            return "ENABLED (swapped)";
        }
      }),
      (this.toggleTouchDirBig = function () {
        (C = !C),
          (L.touch.directionalBig = C),
          Javatari.userPreferences.setDirty(),
          c();
      }),
      (this.isDirBig = function () {
        return C;
      }),
      (this.setupTouchControlsIfNeeded = function (a) {
        function c(a, b) {
          var c = document.createElement("div");
          (c.id = "jt-touch-" + b),
            c.classList.add("jt-touch-button"),
            c.classList.add("jt-touch-button-joy"),
            c.classList.add("jt-touch-button-joy-" + b),
            (c.jtControl = b),
            c.addEventListener("touchstart", j),
            c.addEventListener("touchmove", jt.Util.blockEvent),
            c.addEventListener("touchend", k),
            c.addEventListener("touchcancel", k),
            c.addEventListener("mousedown", j),
            c.addEventListener("mouseup", k),
            (H[b] = c),
            a.appendChild(c);
        }
        if (!(D || A <= 0)) {
          (w = document.createElement("div")), (w.id = "jt-touch-speed");
          var g = document.createElement("div");
          (g.id = "jt-touch-pause"),
            g.addEventListener("touchstart", m),
            g.addEventListener("touchend", n),
            w.appendChild(g);
          var h = document.createElement("div");
          (h.id = "jt-touch-fast"),
            h.addEventListener("touchstart", o),
            h.addEventListener("touchend", p),
            w.appendChild(h),
            a.appendChild(w);
          var i = document.createElement("div");
          (i.id = "jt-touch-left"),
            (D = (function () {
              function a(a) {
                var c = document.createElement("div");
                c.classList.add("jt-touch-dir-" + a), b.appendChild(c);
                var d = document.createElement("div");
                d.classList.add("jt-arrow-" + a), b.appendChild(d);
              }
              var b = document.createElement("div");
              return (
                b.classList.add("jt-touch-dir"),
                b.classList.add("jt-touch-dir-joy"),
                a("left"),
                a("right"),
                a("up"),
                a("down"),
                b
              );
            })()),
            D.addEventListener("touchstart", d),
            D.addEventListener("touchmove", f),
            D.addEventListener("touchend", e),
            D.addEventListener("touchcancel", e),
            i.appendChild(D),
            a.appendChild(i),
            (i = document.createElement("div")),
            (i.id = "jt-touch-right"),
            c(i, "buttonT"),
            c(i, "button"),
            a.appendChild(i),
            b();
        }
      }),
      (this.consolePowerAndUserPauseStateUpdate = function (a, c) {
        (J = a), (K = c), w && b();
      }),
      (this.applyPreferences = function () {
        C = !!L.touch.directionalBig;
        var a = 2 === A ? 1 : 0;
        x = L.joystickKeys[a];
      });
    var s,
      t,
      u,
      v,
      w,
      x,
      y = jt.Util.isTouchDevice(),
      z = jt.Util.isMobileDevice(),
      A = Javatari.TOUCH_MODE >= 0 ? Javatari.TOUCH_MODE : y && z ? 1 : 0,
      B = !1,
      C = !1,
      D = null,
      E = null,
      F = -1,
      G = 0,
      H = {},
      I = new r(),
      J = !1,
      K = !1,
      L = Javatari.userPreferences.current,
      M = 84;
    (this.saveState = function () {
      return {};
    }),
      (this.loadState = function (a) {
        q();
      });
  }),
  (jt.DOMConsoleControls = function (a, b) {
    "use strict";
    function c(a) {
      (E = a), (F = E ? (60 / I[E]) | 0 : 0), (H = (F / 2) | 0), (G = 0);
    }
    function d(a, b) {
      (a.returnValue = !1), a.preventDefault(), a.stopPropagation();
      var c = jt.DOMKeys.codeForKeyboardEvent(a);
      return j.processKey(c, b), !1;
    }
    function e(b, c) {
      if (!B || ((b = l(b)), !m(b, c))) {
        if (2 === a.netPlayMode && Ca.has(b))
          return a.showOSD(
            "Function not available in NetPlay Client mode",
            !0,
            !0
          );
        (1 === a.netPlayMode && Ca.has(b)) || R.push((b << 4) | c),
          2 !== a.netPlayMode && f(b, c);
      }
    }
    function f(a, b) {
      q.controlStateChanged(a, b);
    }
    function g(b, c) {
      R.push(b + (c + 10)), 2 !== a.netPlayMode && h(b, c);
    }
    function h(a, b) {
      q.controlValueChanged(a, b);
    }
    function i() {
      r.controlsModeStateUpdate();
    }
    var j = this;
    (this.connect = function (a) {
      (q = a), q.connectControls(this), v.connect(a), w.connect(a);
    }),
      (this.connectPeripherals = function (a) {
        (r = a), v.connectScreen(a), w.connectScreen(a);
      }),
      (this.addKeyInputElement = function (a) {
        a.addEventListener("keydown", this.keyDown),
          a.addEventListener("keyup", this.keyUp);
      }),
      (this.setupTouchControlsIfNeeded = function (a) {
        w.setupTouchControlsIfNeeded(a);
      }),
      (this.powerOn = function () {
        k(),
          v.powerOn(),
          w.powerOn(),
          0 === S ? n(!1, !1) : 1 === S && n(!0, !1);
      }),
      (this.powerOff = function () {
        n(!1, !1), v.powerOff(), w.powerOff();
      }),
      (this.releaseControllers = function () {
        for (var a in t) t[a] && (e(a, !1), (t[a] = !1));
        (L = M = P = Q = !1),
          (y[x.JOY0_BUTTON] = y[x.JOY1_BUTTON] = !1),
          w.releaseControllers();
      }),
      (this.getTouchControls = function () {
        return w;
      }),
      (this.toggleP1ControlsMode = function () {
        this.setP1ControlsMode(!A), o(), i();
      }),
      (this.setP1ControlsMode = function (a) {
        (A = a),
          v.setP1ControlsMode(a),
          w.setP1ControlsMode(a),
          this.releaseControllers(),
          p();
      }),
      (this.isP1ControlsMode = function () {
        return A;
      }),
      (this.togglePaddleMode = function () {
        n(!B, !0), i();
      }),
      (this.isPaddleMode = function () {
        return B;
      }),
      (this.setP1ControlsAndPaddleMode = function (a, b) {
        this.setP1ControlsMode(a), n(b, !1), i();
      }),
      (this.toggleGamepadMode = function () {
        v.toggleMode(), i();
      }),
      (this.getGamepadModeDesc = function () {
        return v.getModeDesc();
      }),
      (this.toggleTouchControlsMode = function () {
        w.toggleMode(), i();
      }),
      (this.toggleTouchDirBig = function () {
        w.toggleTouchDirBig();
      }),
      (this.toggleTurboFireSpeed = function () {
        c((E + 1) % 11),
          r.showOSD(
            "Turbo Fire" +
              (E ? " speed: " + this.getTurboFireSpeedDesc() : ": OFF"),
            !0
          ),
          (z.turboFireSpeed = E),
          Javatari.userPreferences.setDirty(),
          Javatari.userPreferences.save();
      }),
      (this.getTurboFireSpeedDesc = function () {
        return E ? E + "x" : "OFF";
      }),
      (this.getControlReport = function (a) {
        switch (a) {
          case jt.PeripheralControls.P1_CONTROLS_TOGGLE:
            return { label: A ? "ON" : "OFF", active: A };
          case jt.PeripheralControls.PADDLES_TOGGLE_MODE:
            return { label: B ? "ON" : "OFF", active: B };
          case jt.PeripheralControls.TOUCH_TOGGLE_DIR_BIG:
            return { label: w.isDirBig() ? "ON" : "OFF", active: w.isDirBig() };
          case jt.PeripheralControls.HAPTIC_FEEDBACK_TOGGLE_MODE:
            return { label: D ? "ON" : "OFF", active: !!D };
          case jt.PeripheralControls.TURBO_FIRE_TOGGLE:
            return { label: this.getTurboFireSpeedDesc(), active: !!E };
        }
        return { label: "Unknown", active: !1 };
      }),
      (this.consolePowerAndUserPauseStateUpdate = function (a, b) {
        w.consolePowerAndUserPauseStateUpdate(a, b);
      }),
      (this.keyDown = function (a) {
        return d(a, !0);
      }),
      (this.keyUp = function (a) {
        return d(a, !1);
      }),
      (this.controlsClockPulse = function () {
        if (F) {
          if (--G === H || 0 === G) {
            var a = G > 0;
            y[x.JOY0_BUTTON] && e(x.JOY0_BUTTON, a),
              y[x.JOY1_BUTTON] && e(x.JOY1_BUTTON, a);
          }
          G <= 0 && (G = F);
        }
        v.controlsClockPulse(),
          B &&
            (M
              ? L || ((J -= K), J < 0 && (J = 0), g(x.PADDLE0_POSITION, J))
              : L && ((J += K), J > 380 && (J = 380), g(x.PADDLE0_POSITION, J)),
            Q
              ? P || ((N -= O), N < 0 && (N = 0), g(x.PADDLE1_POSITION, N))
              : P &&
                ((N += O), N > 380 && (N = 380), g(x.PADDLE1_POSITION, N)));
      }),
      (this.toggleHapticFeedback = function () {
        C
          ? ((D = !D),
            (z.hapticFeedback = D),
            Javatari.userPreferences.setDirty())
          : r.showOSD("Haptic Feedback not available", !0, !0);
      }),
      (this.hapticFeedback = function () {
        D && navigator.vibrate(8);
      }),
      (this.hapticFeedbackOnTouch = function (a) {
        !D ||
          ("touchstart" !== a.type &&
            "touchend" !== a.type &&
            "touchmove" !== a.type) ||
          navigator.vibrate(8);
      }),
      (this.cartridgeInserted = function (a) {
        if (a && !(S >= 0)) {
          var b = 1 === a.rom.info.p;
          B !== b && n(b, !1);
        }
      }),
      (this.processKey = function (a, c) {
        var d = u[a];
        if (d) {
          if (c === y[d]) return;
          c && (G = H), (y[d] = c);
        } else {
          if (!(d = s[a])) return b.processKey(a, c);
          if (c === t[d]) return;
          t[d] = c;
        }
        e(d, c);
      }),
      (this.applyPreferences = function () {
        p(), c(z.turboFireSpeed), w.applyPreferences(), v.applyPreferences();
      }),
      (this.processControlState = e),
      (this.processControlValue = g);
    var k = function () {
        window.onhelp = function () {
          return !1;
        };
      },
      l = function (a) {
        switch (a) {
          case x.JOY0_BUTTON:
            return x.PADDLE0_BUTTON;
          case x.JOY1_BUTTON:
            return x.PADDLE1_BUTTON;
          default:
            return a;
        }
      },
      m = function (a, b) {
        if (b)
          switch (a) {
            case x.JOY0_LEFT:
              return (L = !0), !0;
            case x.JOY0_RIGHT:
              return (M = !0), !0;
            case x.JOY0_UP:
              return K < 10 && K++, r.showOSD("P1 Paddle speed: " + K, !0), !0;
            case x.JOY0_DOWN:
              return K > 1 && K--, r.showOSD("P1 Paddle speed: " + K, !0), !0;
            case x.JOY1_LEFT:
              return (P = !0), !0;
            case x.JOY1_RIGHT:
              return (Q = !0), !0;
            case x.JOY1_UP:
              return O < 10 && O++, r.showOSD("P2 Paddle speed: " + O, !0), !0;
            case x.JOY1_DOWN:
              return O > 1 && O--, r.showOSD("P2 Paddle speed: " + O, !0), !0;
          }
        else
          switch (a) {
            case x.JOY0_LEFT:
              return (L = !1), !0;
            case x.JOY0_RIGHT:
              return (M = !1), !0;
            case x.JOY1_LEFT:
              return (P = !1), !0;
            case x.JOY1_RIGHT:
              return (Q = !1), !0;
          }
        return !1;
      },
      n = function (b, c) {
        B !== b && j.releaseControllers(),
          (B = b),
          (K = O = 2),
          (J = N = B ? 190 : -1),
          2 !== a.netPlayMode &&
            (g(x.PADDLE0_POSITION, J), g(x.PADDLE1_POSITION, N)),
          v.setPaddleMode(B),
          c && o();
      },
      o = function () {
        r.showOSD(
          "Controllers: " +
            (B ? "Paddles" : "Joysticks") +
            (A ? ", Swapped" : ""),
          !0
        );
      },
      p = function () {
        var a = jt.DOMKeys;
        (s = {}),
          (t = {}),
          (u = {}),
          (s[T] = x.POWER),
          (s[T | a.ALT] = x.POWER),
          (s[T | a.SHIFT] = x.POWER_FRY),
          (s[T | a.SHIFT | a.ALT] = x.POWER_FRY),
          (s[U] = x.BLACK_WHITE),
          (s[U | a.ALT] = x.BLACK_WHITE),
          (s[V] = x.SELECT),
          (s[V | a.ALT] = x.SELECT),
          (s[W] = x.RESET),
          (s[W | a.ALT] = x.RESET),
          (s[X] = x.DIFFICULTY0),
          (s[X | a.ALT] = x.DIFFICULTY0),
          (s[Y] = x.DIFFICULTY1),
          (s[Y | a.ALT] = x.DIFFICULTY1),
          (s[Z] = x.FAST_SPEED),
          (s[Z | a.ALT] = x.FAST_SPEED),
          (s[Z | a.SHIFT] = x.SLOW_SPEED),
          (s[Z | a.SHIFT | a.ALT] = x.SLOW_SPEED),
          (s[$ | a.SHIFT | a.ALT] = x.INC_SPEED),
          (s[_ | a.SHIFT | a.ALT] = x.DEC_SPEED),
          (s[aa | a.SHIFT | a.ALT] = x.NORMAL_SPEED),
          (s[ba | a.SHIFT | a.ALT] = x.MIN_SPEED),
          (s[ca | a.ALT] = x.PAUSE),
          (s[ca | a.SHIFT | a.ALT] = x.PAUSE_AUDIO_ON),
          (s[da | a.ALT] = x.FRAME),
          (s[ea | a.ALT] = x.FRAME),
          (s[ga | a.ALT] = x.TRACE),
          (s[ha | a.ALT] = x.SHOW_INFO),
          (s[fa | a.ALT] = x.DEBUG),
          (s[ia | a.ALT] = x.NO_COLLISIONS),
          (s[ja | a.ALT] = x.VIDEO_STANDARD),
          (s[ka | a.ALT] = x.VIDEO_STANDARD),
          (s[la | a.ALT] = x.VSYNCH),
          (s[ma | a.CONTROL] = x.SAVE_STATE_0),
          (s[na | a.CONTROL] = x.SAVE_STATE_0),
          (s[ma | a.CONTROL | a.ALT] = x.SAVE_STATE_0),
          (s[na | a.CONTROL | a.ALT] = x.SAVE_STATE_0),
          (s[oa | a.CONTROL] = x.SAVE_STATE_1),
          (s[oa | a.CONTROL | a.ALT] = x.SAVE_STATE_1),
          (s[pa | a.CONTROL] = x.SAVE_STATE_2),
          (s[pa | a.CONTROL | a.ALT] = x.SAVE_STATE_2),
          (s[qa | a.CONTROL] = x.SAVE_STATE_3),
          (s[qa | a.CONTROL | a.ALT] = x.SAVE_STATE_3),
          (s[ra | a.CONTROL] = x.SAVE_STATE_4),
          (s[ra | a.CONTROL | a.ALT] = x.SAVE_STATE_4),
          (s[sa | a.CONTROL] = x.SAVE_STATE_5),
          (s[sa | a.CONTROL | a.ALT] = x.SAVE_STATE_5),
          (s[ta | a.CONTROL] = x.SAVE_STATE_6),
          (s[ta | a.CONTROL | a.ALT] = x.SAVE_STATE_6),
          (s[ua | a.CONTROL] = x.SAVE_STATE_7),
          (s[ua | a.CONTROL | a.ALT] = x.SAVE_STATE_7),
          (s[va | a.CONTROL] = x.SAVE_STATE_8),
          (s[va | a.CONTROL | a.ALT] = x.SAVE_STATE_8),
          (s[wa | a.CONTROL] = x.SAVE_STATE_9),
          (s[wa | a.CONTROL | a.ALT] = x.SAVE_STATE_9),
          (s[xa | a.CONTROL] = x.SAVE_STATE_10),
          (s[xa | a.CONTROL | a.ALT] = x.SAVE_STATE_10),
          (s[ya | a.CONTROL] = x.SAVE_STATE_11),
          (s[za | a.CONTROL] = x.SAVE_STATE_11),
          (s[ya | a.CONTROL | a.ALT] = x.SAVE_STATE_11),
          (s[za | a.CONTROL | a.ALT] = x.SAVE_STATE_11),
          (s[Aa | a.CONTROL] = x.SAVE_STATE_12),
          (s[Ba | a.CONTROL] = x.SAVE_STATE_12),
          (s[Aa | a.CONTROL | a.ALT] = x.SAVE_STATE_12),
          (s[Ba | a.CONTROL | a.ALT] = x.SAVE_STATE_12),
          (s[ma | a.ALT] = x.LOAD_STATE_0),
          (s[na | a.ALT] = x.LOAD_STATE_0),
          (s[oa | a.ALT] = x.LOAD_STATE_1),
          (s[pa | a.ALT] = x.LOAD_STATE_2),
          (s[qa | a.ALT] = x.LOAD_STATE_3),
          (s[ra | a.ALT] = x.LOAD_STATE_4),
          (s[sa | a.ALT] = x.LOAD_STATE_5),
          (s[ta | a.ALT] = x.LOAD_STATE_6),
          (s[ua | a.ALT] = x.LOAD_STATE_7),
          (s[va | a.ALT] = x.LOAD_STATE_8),
          (s[wa | a.ALT] = x.LOAD_STATE_9),
          (s[xa | a.ALT] = x.LOAD_STATE_10),
          (s[ya | a.ALT] = x.LOAD_STATE_11),
          (s[za | a.ALT] = x.LOAD_STATE_11),
          (s[Aa | a.ALT] = x.LOAD_STATE_12),
          (s[Ba | a.ALT] = x.LOAD_STATE_12),
          (s[ma | a.SHIFT | a.CONTROL] = x.SAVE_STATE_0),
          (s[na | a.SHIFT | a.CONTROL] = x.SAVE_STATE_0),
          (s[ma | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_0),
          (s[na | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_0),
          (s[oa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_1),
          (s[oa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_1),
          (s[pa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_2),
          (s[pa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_2),
          (s[qa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_3),
          (s[qa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_3),
          (s[ra | a.SHIFT | a.CONTROL] = x.SAVE_STATE_4),
          (s[ra | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_4),
          (s[sa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_5),
          (s[sa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_5),
          (s[ta | a.SHIFT | a.CONTROL] = x.SAVE_STATE_6),
          (s[ta | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_6),
          (s[ua | a.SHIFT | a.CONTROL] = x.SAVE_STATE_7),
          (s[ua | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_7),
          (s[va | a.SHIFT | a.CONTROL] = x.SAVE_STATE_8),
          (s[va | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_8),
          (s[wa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_9),
          (s[wa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_9),
          (s[xa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_10),
          (s[xa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_10),
          (s[ya | a.SHIFT | a.CONTROL] = x.SAVE_STATE_11),
          (s[za | a.SHIFT | a.CONTROL] = x.SAVE_STATE_11),
          (s[ya | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_11),
          (s[za | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_11),
          (s[Aa | a.SHIFT | a.CONTROL] = x.SAVE_STATE_12),
          (s[Ba | a.SHIFT | a.CONTROL] = x.SAVE_STATE_12),
          (s[Aa | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_12),
          (s[Ba | a.SHIFT | a.CONTROL | a.ALT] = x.SAVE_STATE_12),
          (s[ma | a.SHIFT | a.ALT] = x.LOAD_STATE_0),
          (s[na | a.SHIFT | a.ALT] = x.LOAD_STATE_0),
          (s[oa | a.SHIFT | a.ALT] = x.LOAD_STATE_1),
          (s[pa | a.SHIFT | a.ALT] = x.LOAD_STATE_2),
          (s[qa | a.SHIFT | a.ALT] = x.LOAD_STATE_3),
          (s[ra | a.SHIFT | a.ALT] = x.LOAD_STATE_4),
          (s[sa | a.SHIFT | a.ALT] = x.LOAD_STATE_5),
          (s[ta | a.SHIFT | a.ALT] = x.LOAD_STATE_6),
          (s[ua | a.SHIFT | a.ALT] = x.LOAD_STATE_7),
          (s[va | a.SHIFT | a.ALT] = x.LOAD_STATE_8),
          (s[wa | a.SHIFT | a.ALT] = x.LOAD_STATE_9),
          (s[xa | a.SHIFT | a.ALT] = x.LOAD_STATE_10),
          (s[ya | a.SHIFT | a.ALT] = x.LOAD_STATE_11),
          (s[za | a.SHIFT | a.ALT] = x.LOAD_STATE_11),
          (s[Aa | a.SHIFT | a.ALT] = x.LOAD_STATE_12),
          (s[Ba | a.SHIFT | a.ALT] = x.LOAD_STATE_12);
        var b = A ? 1 : 0,
          c = A ? 0 : 1;
        (s[z.joystickKeys[b].left.c] = x.JOY0_LEFT),
          (s[z.joystickKeys[b].up.c] = x.JOY0_UP),
          (s[z.joystickKeys[b].right.c] = x.JOY0_RIGHT),
          (s[z.joystickKeys[b].down.c] = x.JOY0_DOWN),
          (s[z.joystickKeys[b].button.c] = x.JOY0_BUTTON),
          (s[z.joystickKeys[c].left.c] = x.JOY1_LEFT),
          (s[z.joystickKeys[c].up.c] = x.JOY1_UP),
          (s[z.joystickKeys[c].right.c] = x.JOY1_RIGHT),
          (s[z.joystickKeys[c].down.c] = x.JOY1_DOWN),
          (s[z.joystickKeys[c].button.c] = x.JOY1_BUTTON),
          (u[z.joystickKeys[b].buttonT.c] = x.JOY0_BUTTON),
          (u[z.joystickKeys[c].buttonT.c] = x.JOY1_BUTTON);
      };
    (this.netGetControlsToSend = function () {
      return R.length ? R : void 0;
    }),
      (this.netClearControlsToSend = function () {
        R.length = 0;
      }),
      (this.netServerProcessControlsChanges = function (a) {
        for (var b = 0, c = a.length; b < c; ++b) {
          var d = a[b];
          d < 16e3
            ? (Ca.has(d >> 4) || R.push(d), f(d >> 4, 1 & d))
            : h(-16384 & d, (16383 & d) - 10);
        }
      }),
      (this.netClientApplyControlsChanges = function (a) {
        for (var b = 0, c = a.length; b < c; ++b) {
          var d = a[b];
          d < 16e3 ? f(d >> 4, 1 & d) : h(-16384 & d, (16383 & d) - 10);
        }
      });
    var q,
      r,
      s,
      t,
      u,
      v,
      w,
      x = jt.ConsoleControls,
      y = {},
      z = Javatari.userPreferences.current,
      A = !1,
      B = !1,
      C = !!navigator.vibrate,
      D = C && !!z.hapticFeedback,
      E = 0,
      F = 0,
      G = 0,
      H = 0,
      I = [0, 1, 2, 2.4, 3, 4, 5, 6, 7.5, 10, 12],
      J = 0,
      K = 3,
      L = !1,
      M = !1,
      N = 0,
      O = 3,
      P = !1,
      Q = !1,
      R = new Array(100);
    R.length = 0;
    var S = Javatari.PADDLES_MODE,
      T = jt.DOMKeys.VK_F1.c,
      U = jt.DOMKeys.VK_F2.c,
      V = jt.DOMKeys.VK_F11.c,
      W = jt.DOMKeys.VK_F12.c,
      X = jt.DOMKeys.VK_F4.c,
      Y = jt.DOMKeys.VK_F9.c,
      Z = jt.DOMKeys.VK_TAB.c,
      $ = jt.DOMKeys.VK_UP.c,
      _ = jt.DOMKeys.VK_DOWN.c,
      aa = jt.DOMKeys.VK_RIGHT.c,
      ba = jt.DOMKeys.VK_LEFT.c,
      ca = jt.DOMKeys.VK_P.c,
      da = jt.DOMKeys.VK_O.c,
      ea = jt.DOMKeys.VK_F.c,
      fa = jt.DOMKeys.VK_D.c,
      ga = jt.DOMKeys.VK_VOID,
      ha = jt.DOMKeys.VK_I.c,
      ia = jt.DOMKeys.VK_C.c,
      ja = jt.DOMKeys.VK_V.c,
      ka = jt.DOMKeys.VK_Q.c,
      la = jt.DOMKeys.VK_W.c,
      ma = jt.DOMKeys.VK_QUOTE.c,
      na = jt.DOMKeys.VK_BACKQUOTE.c,
      oa = jt.DOMKeys.VK_1.c,
      pa = jt.DOMKeys.VK_2.c,
      qa = jt.DOMKeys.VK_3.c,
      ra = jt.DOMKeys.VK_4.c,
      sa = jt.DOMKeys.VK_5.c,
      ta = jt.DOMKeys.VK_6.c,
      ua = jt.DOMKeys.VK_7.c,
      va = jt.DOMKeys.VK_8.c,
      wa = jt.DOMKeys.VK_9.c,
      xa = jt.DOMKeys.VK_0.c,
      ya = jt.DOMKeys.VK_MINUS.c,
      za = jt.DOMKeys.VK_FF_MINUS.c,
      Aa = jt.DOMKeys.VK_EQUALS.c,
      Ba = jt.DOMKeys.VK_FF_EQUALS.c,
      Ca = new Set([
        x.SAVE_STATE_0,
        x.SAVE_STATE_1,
        x.SAVE_STATE_2,
        x.SAVE_STATE_3,
        x.SAVE_STATE_4,
        x.SAVE_STATE_5,
        x.SAVE_STATE_6,
        x.SAVE_STATE_7,
        x.SAVE_STATE_8,
        x.SAVE_STATE_9,
        x.SAVE_STATE_10,
        x.SAVE_STATE_11,
        x.SAVE_STATE_12,
        x.SAVE_STATE_FILE,
        x.LOAD_STATE_0,
        x.LOAD_STATE_1,
        x.LOAD_STATE_2,
        x.LOAD_STATE_3,
        x.LOAD_STATE_4,
        x.LOAD_STATE_5,
        x.LOAD_STATE_6,
        x.LOAD_STATE_7,
        x.LOAD_STATE_8,
        x.LOAD_STATE_9,
        x.LOAD_STATE_10,
        x.LOAD_STATE_11,
        x.LOAD_STATE_12,
        x.POWER_FRY,
        x.VSYNCH,
        x.TRACE,
        x.CARTRIDGE_FORMAT,
      ]);
    !(function () {
      (v = new jt.GamepadConsoleControls(j)),
        (w = new jt.DOMTouchControls(j)),
        j.applyPreferences();
    })(),
      (jt.DOMConsoleControls.hapticFeedback = this.hapticFeedback),
      (jt.DOMConsoleControls.hapticFeedbackOnTouch =
        this.hapticFeedbackOnTouch);
  }),
  (jt.ScreenGUI = jt.Util.isMobileDevice()
    ? {
        BAR_HEIGHT: 29,
        BAR_MENU_WIDTH: 150,
        BAR_MENU_ITEM_HEIGHT: 33,
        BAR_MENU_ITEM_FONT_SIZE: 14,
        LOGO_SCREEN_WIDTH: 618,
        LOGO_SCREEN_HEIGHT: 455,
        TOUCH_CONTROLS_LEFT_WIDTH: 119,
        TOUCH_CONTROLS_LEFT_WIDTH_BIG: 143,
        TOUCH_CONTROLS_RIGHT_WIDTH: 80,
      }
    : {
        BAR_HEIGHT: 29,
        BAR_MENU_WIDTH: 140,
        BAR_MENU_ITEM_HEIGHT: 29,
        BAR_MENU_ITEM_FONT_SIZE: 13,
        LOGO_SCREEN_WIDTH: 618,
        LOGO_SCREEN_HEIGHT: 455,
        TOUCH_CONTROLS_LEFT_WIDTH: 119,
        TOUCH_CONTROLS_LEFT_WIDTH_BIG: 143,
        TOUCH_CONTROLS_RIGHT_WIDTH: 80,
      }),
  (jt.ScreenGUI.html = function () {
    return (
      '<div id="jt-screen-fs" tabindex="0"> <div id="jt-screen-fs-center" tabindex="-1"> <div id="jt-screen-canvas-outer"> <canvas id="jt-screen-canvas" tabindex="-1"></canvas> <img id="jt-canvas-loading-icon" draggable="false" src="' +
      jt.Images.urls.loading +
      '"> <div id="jt-unmute-message"></div> <div id="jt-logo"> <div id="jt-logo-center"> <img id="jt-logo-loading-icon" draggable="false" src="' +
      jt.Images.urls.loading +
      '"> <img id="jt-logo-image" draggable="false" src="' +
      jt.Images.urls.logo +
      '"> <div id="jt-logo-message"> <div id="jt-logo-message-text"></div> <div id="jt-logo-message-ok"> <div id="jt-logo-message-ok-text"></div> </div> </div> </div> </div> <div id="jt-osd"></div> </div> <div id="jt-bar"> <div id="jt-bar-inner"></div> </div> <div id="jt-console-panel" class="jt-console-panel" tabindex="-1"> </div> </div> <div id="jt-screen-scroll-message"> Swipe up/down on the Screen <br>to hide the browser bars! </div> </div>'
    );
  }),
  (jt.ScreenGUI.htmlConsolePanel =
    '<div id="jt-console-panel-p0-diff-label" class="jt-console-panel-p0-diff-label jt-console-panel-icon"></div> <div id="jt-console-panel-p1-diff-label" class="jt-console-panel-p1-diff-label jt-console-panel-icon"></div> <div id="jt-console-panel-power-labels" class="jt-console-panel-power-labels jt-console-panel-icon"></div> <div id="jt-console-panel-reset-labels" class="jt-console-panel-reset-labels jt-console-panel-icon"></div> <div id="jt-console-panel-power" class="jt-console-panel-power jt-console-panel-lever"></div> <div id="jt-console-panel-color" class="jt-console-panel-color jt-console-panel-lever"></div> <div id="jt-console-panel-select" class="jt-console-panel-select jt-console-panel-lever"></div> <div id="jt-console-panel-reset" class="jt-console-panel-reset jt-console-panel-lever"></div> <div id="jt-console-panel-p0-diff" class="jt-console-panel-p0-diff jt-console-panel-switch"></div> <div id="jt-console-panel-p1-diff" class="jt-console-panel-p1-diff jt-console-panel-switch"></div> <div id="jt-console-panel-cart-image" class="jt-console-panel-cart-image"></div> <div id="jt-console-panel-cart-load" class="jt-console-panel-cart-load"></div> <div id="jt-console-panel-cart-file" class="jt-console-panel-cart-file jt-console-panel-icon"></div> <div id="jt-console-panel-cart-url" class="jt-console-panel-cart-url jt-console-panel-icon"></div> <div id="jt-console-panel-cart-label" class="jt-console-panel-cart-label"></div>'),
  (jt.ScreenGUI.css = function () {
    return (
      "html.jt-full-screen-scroll-hack body { position: absolute; width: 100%; height: " +
      Math.max(1280, (1.4 * Math.max(screen.width, screen.height)) | 0) +
      "px; top: 0; left: 0; margin: 0; padding: 0; border: none; overflow-x: hidden; overflow-y: auto; } #jt-screen-fs, #jt-screen-fs div, #jt-screen-fs canvas { outline: none; } #" +
      Javatari.SCREEN_ELEMENT_ID +
      " { display: inline-block; visibility: hidden; font-family: sans-serif; font-weight: normal; margin: 0; padding: 0; border: 1px solid black; background: black; overflow: visible; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-touch-callout: none; touch-callout: none; -webkit-tap-highlight-color: transparent; tap-highlight-color: transparent; -webkit-text-size-adjust: none; -moz-text-size-adjust: none; text-size-adjust: none; } html.jt-full-screen #" +
      Javatari.SCREEN_ELEMENT_ID +
      " { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; box-shadow: none; z-index: 2147483646;    /* one behind fsElement */ } html.jt-started #" +
      Javatari.SCREEN_ELEMENT_ID +
      " { visibility: visible; } #jt-screen-scroll-message { position: absolute; bottom: 150%; left: 50%; height: 0; width: 0; margin: 0; padding: 0; font-size: 16px; line-height: 28px; white-space: nowrap; color: hsl(0, 0%, 4%); background: hsl(0, 0%, 92%); border-radius: 15px; transform: translate(-50%, 0); box-shadow: 2px 2px 9px rgba(0, 0, 0, 0.7); transition: all 1.7s step-end, opacity 1.6s linear; overflow: hidden; opacity: 0; z-index: -1; } html.jt-full-screen-scroll-hack #jt-screen-fs.jt-scroll-message #jt-screen-scroll-message { opacity: 1; bottom: 23%; width: 215px; height: 56px; padding: 13px 20px; z-index: 60; transition: none; } #jt-screen-fs { position: relative; background: black; text-align: center; -webkit-tap-highlight-color: rgba(0,0,0,0); tap-highlight-color: rgba(0,0,0,0) } html.jt-full-screen #jt-screen-fs { position: absolute; width: 100%; height: 100%; left: 0; bottom: 0; right: 0; z-index: 2147483647; } html.jt-full-screen-scroll-hack #jt-screen-fs { position: fixed; bottom: 0; height: 100vh; } html.jt-full-screen #jt-screen-fs-center {      /* Used to center and move things horizontally in Landscape Full Screen */ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } #jt-screen-canvas-outer { display: inline-block; position: relative; overflow: hidden; vertical-align: top; line-height: 1px; z-index: 3; } #jt-screen-canvas { display: block; } #jt-bar { position: relative; left: 0; right: 0; height: " +
      this.BAR_HEIGHT +
      'px; margin: 0 auto; border-top: 1px solid black; background: hsl(0, 0%, 16%); overflow: visible;                    /* for the Menu to show through */ box-sizing: content-box; z-index: 40; } #jt-bar-inner { position: absolute; overflow: hidden; top: 0; bottom: 0; left: 0; right: 0; text-align: left; } html.jt-bar-auto-hide #jt-bar, html.jt-full-screen #jt-bar { position: absolute; bottom: 0; transition: height 0.08s ease-in-out; } html.jt-bar-auto-hide #jt-bar.jt-hidden { transition: height 0.5s ease-in-out; height: 0; bottom: -1px; } @media only screen and (orientation: landscape) { html.jt-full-screen #jt-bar.jt-hidden { transition: height 0.5s ease-in-out; height: 0; bottom: -1px; } } #jt-bar.jt-narrow .jt-narrow-hidden { display: none; } .jt-bar-button { display: inline-block; width: 24px; height: 28px; margin: 0 1px; background-image: url("' +
      jt.Images.urls.iconSprites +
      '"); background-repeat: no-repeat; background-size: 264px 82px; cursor: pointer; } /* Firefox-specific rules */ @-moz-document url-prefix() { .jt-bar-button { image-rendering: optimizequality; } } /* .jt-bar-button { border: 1px solid yellow; background-origin: border-box; box-sizing: border-box; } */ #jt-bar-power { margin: 0 3px 0 6px; } #jt-bar-netplay.jt-hidden { display: none; } #jt-bar-select { margin: 0 2px 0 9px; width: 50px; } #jt-bar-reset { margin: 0 2px; width: 50px; } html.jt-console-panel-active #jt-bar-select, html.jt-console-panel-active #jt-bar-reset { display: none; } #jt-bar-settings, #jt-bar-full-screen, #jt-bar-scale-plus, #jt-bar-scale-minus { float: right; margin: 0; } #jt-bar-settings { margin-right: 5px; } #jt-bar-full-screen.jt-mobile { margin: 0 6px; } #jt-bar-scale-plus { width: 21px; } #jt-bar-scale-minus { width: 18px; } #jt-bar-text { float: right; width: 32px; } #jt-bar-text.jt-mobile { margin: 0 0 0 6px; } #jt-bar-console-panel { position: absolute; left: 2px; right: 0; width: 39px; margin: 0 auto; } #jt-bar.jt-narrow #jt-bar-console-panel { position: static; float: right; margin-right: 3px; } #jt-bar-logo { position: absolute; left: 0; right: 0; width: 34px; margin: 0 auto; } html:not(.jt-console-panel-active) #jt-bar.jt-narrow #jt-bar-logo { display: none; } #jt-bar-menu { position: absolute; display: none; bottom: ' +
      this.BAR_HEIGHT +
      "px; font-size: " +
      this.BAR_MENU_ITEM_FONT_SIZE +
      "px; line-height: 1px; overflow: hidden; transform-origin: bottom center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-bar-menu-inner { display: inline-block; padding-bottom: 2px; border: 1px solid black; background: hsl(0, 0%, 16%); } .jt-bar-menu-item, #jt-bar-menu-title { position: relative; display: none; width: " +
      this.BAR_MENU_WIDTH +
      "px; height: " +
      this.BAR_MENU_ITEM_HEIGHT +
      "px; color: rgb(205, 205, 205); border: none; padding: 0; line-height: " +
      this.BAR_MENU_ITEM_HEIGHT +
      'px; text-shadow: 1px 1px 1px black; background: transparent; outline: none; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; cursor: pointer; box-sizing: border-box; } #jt-bar-menu-title { display: block; color: white; font-weight: bold; border-bottom: 1px solid black; margin-bottom: 1px; text-align: center; background: rgb(70, 70, 70); cursor: auto; } .jt-bar-menu-item.jt-hover:not(.jt-bar-menu-item-disabled):not(.jt-bar-menu-item-divider) { color: white; background: hsl(358, 67%, 46%); } .jt-bar-menu-item-disabled { color: rgb(110, 110, 110); } .jt-bar-menu-item-divider { height: 1px; margin: 1px 0; background: black; } .jt-bar-menu-item-toggle { text-align: left; padding-left: 30px; } .jt-bar-menu-item-toggle::after { content: ""; position: absolute; width: 6px; height: 19px; top: ' +
      (((this.BAR_MENU_ITEM_HEIGHT - 21) / 2) | 0) +
      "px; left: 10px; background: rgb(70, 70, 70); box-shadow: black 1px 1px 1px; } .jt-bar-menu-item-toggle.jt-bar-menu-item-toggle-checked { color: white; } .jt-bar-menu-item-toggle.jt-bar-menu-item-toggle-checked::after { background: rgb(248, 33, 28); } #jt-console-panel { display: none; position: absolute; bottom: -" +
      (jt.ConsolePanel.DEFAULT_HEIGHT + 2) +
      "px; left: 50%; transform: translate(-50%, 0); transform-origin: center top; margin: 0 auto; border: 1px solid black; z-index: 30; } html.jt-console-panel-active #jt-console-panel { display: block; } html.jt-full-screen #jt-console-panel { bottom: " +
      (jt.ScreenGUI.BAR_HEIGHT + 2) +
      'px; border: none; transform-origin: center bottom; } .jt-select-dialog { position: absolute; overflow: hidden; display: none; top: 0; bottom: 0; left: 0; right: 0; width: 540px; max-width: 92%; height: 297px; margin: auto; color: white; font-size: 18px; line-height: 21px; background: hsl(0, 0%, 16%); padding: 11px 0 0; text-align: center; border: 1px solid black; box-sizing: initial; text-shadow: 1px 1px 1px black; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: auto; z-index: 50; } .jt-select-dialog.jt-show { display: block; } .jt-select-dialog > .jt-footer { position: absolute; width: 100%; bottom: 7px; font-size: 13px; text-align: center; color: rgb(170, 170, 170); } .jt-select-dialog > ul { position: relative; width: 88%; top: 5px; margin: auto; padding: 0; list-style: none; font-size: 14px; color: hsl(0, 0%, 88%); } .jt-select-dialog > ul li { display: none; position: relative; overflow: hidden; height: 26px; background: rgb(70, 70, 70); margin: 7px 0; padding: 11px 10px 0 18px;       /* Space on the left for the toggle mark for all lines */ line-height: 0; text-align: left; text-overflow: ellipsis; border: 2px dashed transparent; box-shadow: 1px 1px 1px rgba(0, 0, 0, .5); white-space: nowrap; box-sizing: border-box; cursor: pointer; } .jt-select-dialog > ul li.jt-visible { display: block; } .jt-select-dialog > ul li.jt-selected { color: white; background: hsl(358, 67%, 46%); } .jt-select-dialog > ul li.jt-droptarget { color: white; border-color: lightgray; } .jt-select-dialog > ul li.jt-toggle::after { content: ""; position: absolute; width: 6px; height: 17px; top: 2px; left: 6px; background: rgb(60, 60, 60); box-shadow: black 1px 1px 1px; } .jt-select-dialog > ul li.jt-toggle-checked::after { background: rgb(248, 33, 28); } #jt-cartridge-format.jt-select-dialog > ul { width: 100%; height: 226px; margin: 7px auto 0; padding: 0 0 0 30px; overflow-y: auto; box-sizing: border-box; } #jt-cartridge-format.jt-select-dialog > ul li { width: 280px; margin: 7px 0 2px 0; } #jt-cartridge-format.jt-select-dialog > ul li:first-child { margin-top: 0; } #jt-cartridge-format ::-webkit-scrollbar { width: 12px; } #jt-cartridge-format ::-webkit-scrollbar-track { background: transparent; } #jt-cartridge-format ::-webkit-scrollbar-thumb { border: solid transparent; border-width: 1px 1px 1px 2px; background: rgb(80, 80, 80); background-clip: content-box; } #jt-cartridge-format ul.jt-quick-options-list { width: 230px; margin: 18px 0 0 52px; } #jt-cartridge-format ul.jt-quick-options-list li div { height: 24px; line-height: 24px; } #jt-cartridge-format .jt-control { width: 60px; line-height: 24px; } /* Firefox-specific rules */ @-moz-document url-prefix() { /* Try to hide scrollbar, since we cant style it :-( */ #jt-cartridge-format.jt-select-dialog > ul { width: 304px; } } #jt-logo { position: absolute; display: none; top: 0; bottom: 0; left: 0; right: 0; background: black; } #jt-logo.jt-show { display: block; } #jt-logo-center { position: absolute; top: 50%; left: 50%; width: 598px; height: 456px; transform: translate(-50%, -50%); } #jt-logo-image { position: absolute; top: 50%; left: 50%; width: 335px; max-width: 57%; transform: translate(-50%, -50%); -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } #jt-screen-fs.jt-logo-message-active #jt-logo-image { top: 128px; width: 37%; max-width: initial; } #jt-logo-loading-icon, #jt-canvas-loading-icon { display: none; position: absolute; top: 79%; left: 0; right: 0; width: 14%; height: 3%; margin: 0 auto; background-color: rgba(0, 0, 0, .8); border: solid transparent; border-width: 8px 30px; border-radius: 3px; box-sizing: content-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } #jt-screen-fs.jt-logo-message-active #jt-logo-loading-icon { top: 204px; } #jt-unmute-message { display: none; position: absolute; left: 50%; bottom: 5px; height: 30px; padding: 0 10px; margin: 0 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; font-size: 15px; line-height: 30px; color: rgb(210, 210, 210); background: rgba(0, 0, 0, 0.7); transform-origin: bottom center; transform: translate(-50%, 0); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-unmute-message::before { content: ""; display: inline-block; width: 24px; height: 20px; margin: 5px 9px 0 0; background-image: url("' +
      jt.Images.urls.muteIcon +
      '"); background-repeat: no-repeat; background-size: 24px 20px; vertical-align: top; } #jt-unmute-message::after { content: "Audio is muted. Click to unmute"; } #jt-unmute-message.jt-show { display: inline-block; } #jt-logo-message { display: none; position: absolute; top: 226px; width: 100%; color: hsl(0, 0%, 97%); font-size: 29px; line-height: 34px; } #jt-screen-fs.jt-logo-message-active #jt-logo-message { display: block; } #jt-logo-message-ok { display: block; position: absolute; top: 91px; left: 193px; width: 214px; height: 130px; } #jt-logo-message-ok.jt-higher { top: 74px; } #jt-logo-message-ok-text { position: absolute; top: 49%; left: 50%; width: 120px; height: 47px; font-size: 23px; line-height: 47px; background: hsl(358, 67%, 46%); border-radius: 6px; color: white; transform: translate(-50%, -50%); } #jt-osd { position: absolute; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; top: -29px; right: 16px; height: 29px; padding: 0 12px; margin: 0; font-weight: bold; font-size: 15px; line-height: 29px; color: rgb(0, 255, 0); background: rgba(0, 0, 0, 0.7); transform-origin: top right; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; opacity: 0; } .jt-arrow-up, .jt-arrow-down, .jt-arrow-left, .jt-arrow-right { border: 0px solid transparent; box-sizing: border-box; } .jt-arrow-up    { border-bottom-color: inherit; } .jt-arrow-down  { border-top-color: inherit; } .jt-arrow-left  { border-right-color: inherit; } .jt-arrow-right { border-left-color: inherit; } .jt-quick-options-list { margin-top: 12px; padding: 0; list-style: none; color: hsl(0, 0%, 88%); } .jt-quick-options-list li { margin-top: 8px; line-height: 1px; text-align: left; } .jt-quick-options-list li div { display: inline-block; overflow: hidden; height: 26px; font-size: 14px; line-height: 26px; text-overflow: ellipsis; white-space: nowrap; box-sizing: border-box; } .jt-quick-options-list .jt-control { float: right; width: 86px; font-size: 15px; line-height: 25px; color: hsl(0, 0%, 70%); background: black; text-align: center; cursor: pointer; } .jt-quick-options-list .jt-control.jt-selected { color: white; background: hsl(358, 67%, 46%); box-shadow: 1px 1px 1px rgba(0, 0, 0, .5); } .jt-quick-options-list .jt-control.jt-selected.jt-inactive { line-height: 21px; border: 2px dashed hsl(358, 67%, 46%); background: black; } #jt-quick-options { display: none; position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 233px; height: 345px; margin: auto; padding: 11px 14px 0; color: white; font-size: 18px; line-height: 22px; background: hsl(0, 0%, 16%); text-align: center; border: 1px solid black; box-sizing: initial; text-shadow: 1px 1px 1px black; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: auto; z-index: 50; } #jt-quick-options.jt-show { display: block; } #jt-quick-options::before { content: "Quick Options"; display: block; } #jt-netplay { display: none; position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 390px; height: 220px; margin: auto; padding-top: 11px; color: white; font-size: 18px; line-height: 22px; background: hsl(0, 0%, 16%); text-align: center; border: 1px solid black; box-sizing: initial; text-shadow: 1px 1px 1px black; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); transform-origin: left center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: auto; z-index: 50; } #jt-netplay.jt-show { display: block; } #jt-netplay::before { content: "Net Play!"; display: block; } #jt-netplay-status-box { position: relative; margin-top: 17px; } #jt-netplay-status { display: inline-block; position: relative; width: 340px; font-size: 15px; line-height: 27px; background: black; vertical-align: top; text-shadow: none; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; box-sizing: border-box; cursor: auto; } #jt-netplay-status-box.jt-active #jt-netplay-status { padding: 0 16px 0 12px; } #jt-netplay-status-box.jt-active #jt-netplay-status::after { content: ""; position: absolute; width: 6px; height: 18px; top: 4px; left: 7px; background: rgb(248, 33, 28); } #jt-netplay-link { display: none; position: absolute; right: 25px; top: 0; width: 26px; height: 27px; color: white; font-size: 15px; font-weight: 600; line-height: 27px; text-decoration: none; background: black; text-align: center; } #jt-netplay-link:hover { background: hsl(358, 67%, 46%); cursor: pointer; } #jt-netplay-status-box.jt-active #jt-netplay-link { display: block; } .jt-netplay-button { display: inline-block; width: 86px; padding: 0; margin: 0; font-size: 15px; line-height: 26px; color: white; background: hsl(358, 67%, 46%); text-shadow: 1px 1px 1px black; border: none; box-shadow: 1px 1px 1px rgba(0, 0, 0, .5); cursor: pointer; } #jt-netplay-session-box { margin-top: 18px; } #jt-netplay-session-label, #jt-netplay-nick-label { font-size: 15px; margin-bottom: 4px; } #jt-netplay-session-label::before { content: "Session Name"; } #jt-netplay-session-box input { width: 150px; height: 26px; padding: 0 10px; margin: 0 8px; font-size: 15px; line-height: 26px; background: rgb(240, 240, 240); border: none; border-radius: 0; box-sizing: border-box; outline: none; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; cursor: auto; } #jt-netplay-nick-label { margin-top: 10px; } #jt-netplay-nick-label::before { content: "User Nickname"; } .jt-netplay-button:disabled { color: rgb(130, 130, 130); background: rgb(70, 70, 70); cursor: default; } #jt-netplay input:disabled { color: black; background: rgb(180, 180, 180); cursor: default; } #jt-netplay-session-box.jt-disabled div { color: rgb(130, 130, 130); } input#jt-netplay-link-text { position: absolute; top: 8px; left: 50px; width: 1px; height: 1px; padding: 0; margin: 0; border: none; color: transparent; background: transparent; opacity: 0; z-index: -10; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; } #jt-touch-left, #jt-touch-right, #jt-touch-speed { display: none; position: absolute; z-index: 1; } html.jt-full-screen.jt-touch-active #jt-touch-left, html.jt-full-screen.jt-touch-active #jt-touch-right, html.jt-full-screen.jt-touch-active #jt-touch-speed { display: block; } .jt-touch-dir { width: 130px; height: 130px; color: hsl(0, 0%, 75%); border-radius: 100%; } .jt-touch-dir::before { content: ""; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border: 1px solid hsl(0, 0%, 26%); border-radius: 100%; } .jt-touch-dir-joy .jt-touch-dir-up, .jt-touch-dir-joy .jt-touch-dir-left { position: absolute; background: hsl(0, 0%, 31%); border-radius: 2px 2px 0 0; box-shadow: inset 1px 2px 0px hsl(0, 0%, 43%), inset -1px -1px hsl(0, 0%, 19%), 0 3px 0 1px hsl(0, 0%, 21%); } .jt-touch-dir-joy .jt-touch-dir-up { width: 26px; height: 78px; top: 24px; left: 52px; } .jt-touch-dir-joy .jt-touch-dir-left { width: 78px; height: 25px; top: 51px; left: 26px; } .jt-touch-dir-joy .jt-touch-dir-left::before { content: ""; position: absolute; top: 2px; left: 23px; width: 33px; height: 22px; background: inherit; z-index: 1; } .jt-touch-dir-joy .jt-touch-dir-left::after { content: ""; position: absolute; top: 4px; left: 30px; height: 17px; width: 17px; border-radius: 100%; box-shadow:  inset 0 0 2px hsl(0, 0%, 22%), inset 1px 2px 3px 1px hsl(0, 0%, 26%), inset -1px -2px 1px hsl(0, 0%, 64%); z-index: 2; } .jt-touch-dir .jt-arrow-up, .jt-touch-dir .jt-arrow-down, .jt-touch-dir .jt-arrow-left, .jt-touch-dir .jt-arrow-right { position: absolute; border-width: 5px; z-index: 2; } .jt-touch-dir .jt-arrow-up { top: 26px; left: 60px; border-bottom-width: 11px; } .jt-touch-dir .jt-arrow-down { bottom: 29px; left: 60px; border-top-width: 11px; } .jt-touch-dir .jt-arrow-left { top: 58px; left: 26px; border-right-width: 11px; } .jt-touch-dir .jt-arrow-right { top: 58px; right: 26px; border-left-width: 11px; } .jt-touch-button { position: relative; display: block; width: 72px; height: 72px; font-size: 20px; line-height: 67px; color: hsl(0, 0%, 79%); border-radius: 100%; cursor: default; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; z-index: 0; } .jt-touch-button::before { content: ""; position: absolute; box-sizing: border-box; z-index: -1; } .jt-touch-button-joy::before, .jt-touch-button-none::before { width: 50px; height: 48px; top: 9px; left: 11px; border-radius: 100%; } #jt-screen-fs.jt-touch-config-active .jt-touch-button-none::before { border: 2px solid hsl(0, 0%, 30%); } .jt-touch-button-joy.jt-touch-button-joy-button::before { border: none; background: hsl(1, 70%, 37%); box-shadow: inset -2px -7px 3px 1px hsl(1, 68%, 43%), inset 0px 0px 1px 9px hsl(1, 72%, 33%), 0px -1px 0px 1px hsl(1, 70%, 47%), 0px 1px 0px 2px hsl(1, 70%, 29%); } .jt-touch-button-joy.jt-touch-button-joy-buttonT::before { border: none; background: hsl(220, 72%, 39%); box-shadow: inset -2px -7px 3px 1px hsl(220, 70%, 43%), inset 0px 0px 1px 9px hsl(220, 75%, 34%), 0px -1px 0px 1px hsl(220, 72%, 50%), 0px 1px 0px 2px hsl(220, 72%, 28%); } #jt-touch-button  { z-index: 7 } #jt-touch-buttonT { z-index: 6 } #jt-touch-speed.jt-center { width: 84px; left: 0; right: 0; margin: 0 auto; } #jt-touch-speed.jt-center.jt-poweroff #jt-touch-pause { margin-left: 21px } #jt-touch-pause, #jt-touch-fast { float: left; width: 42px; height: 42px; border-color: hsl(0, 0%, 70%); } #jt-touch-pause::after, #jt-touch-fast::before, #jt-touch-fast::after { content: ""; display: inline-block; border: 0 solid transparent; box-sizing: border-box; } #jt-touch-pause::after { margin-top: 14px; width: 13px; height: 14px; border-width: 0; border-left-width: 4px; border-left-color: inherit; border-right-width: 4px; border-right-color: inherit; } #jt-touch-fast::before, #jt-touch-fast::after { margin-top: 14px; width: 11px; height: 14px; border-width: 7px; border-left-width: 11px; border-left-color: inherit; border-right-width: 0; } #jt-touch-speed.jt-paused #jt-touch-pause::after, #jt-touch-speed.jt-poweroff #jt-touch-pause::after { margin: 12px 0 0 3px; width: 15px; height: 18x; border-width: 9px; border-left-width: 15px; border-right-width: 0; } #jt-touch-speed.jt-paused  #jt-touch-fast::after { width: 7px; border-width: 0; border-left-width: 3px; } #jt-touch-speed.jt-poweroff #jt-touch-fast { display: none; } .jt-console-panel { width:' +
      jt.ConsolePanel.DEFAULT_WIDTH +
      "px; height:" +
      jt.ConsolePanel.DEFAULT_HEIGHT +
      'px; background: black url("' +
      jt.Images.urls.panel +
      '") no-repeat; background-size: 460px 134px; box-shadow: ' +
      jt.ConsolePanel.sameBoxShadowAsScreen() +
      '; outline: none; } html.jt-full-screen .jt-console-panel { box-shadow: none; } .jt-console-panel-icon { position: absolute; background: url("' +
      jt.Images.urls.iconSprites +
      '") center no-repeat; background-size: 264px 82px; } .jt-console-panel-switch { position: absolute; bottom: 107px; width: 50px; height: 26px; opacity: 0; cursor: pointer; } .jt-console-panel-switch:after { content: ""; position: absolute; left: 11px; bottom: 5px; width: 27px; height: 16px; background: url("' +
      jt.Images.urls.panelSprites +
      '") center no-repeat; background-size: 256px 93px; } .jt-console-panel-lever { position: absolute; bottom: 30px; width: 44px; height: 72px; cursor: pointer; } .jt-console-panel-lever:after { content: ""; position: absolute; left: 12px; bottom: 8px; width: 20px; height: 46px; background: url("' +
      jt.Images.urls.panelSprites +
      '") center no-repeat; background-size: 256px 93px; } .jt-console-panel-power { left: 19px; } .jt-console-panel-power:after { background-position: 0px 0px; } .jt-console-panel-color { left: 84px; } .jt-console-panel-color:after { background-position: -21px 0px; } .jt-console-panel-select { left: 340px; } .jt-console-panel-select:after { background-position: 0px -47px; } .jt-console-panel-reset { left: 403px; } .jt-console-panel-reset:after { background-position: -21px -47px; } .jt-console-panel-p0-diff { left: 152px; } .jt-console-panel-p0-diff:after { background-position: -229px -17px; } .jt-console-panel-p1-diff { left: 265px; } .jt-console-panel-p1-diff:after { background-position: -229px 0px; } .jt-console-panel-cart-image { position: absolute; left: 140px; bottom: 9px; width: 186px; height: 82px; background: url("' +
      jt.Images.urls.panelSprites +
      '") center no-repeat; background-size: 256px 93px; background-position: -42px 0px; } .jt-console-panel-cart-load { position: absolute; left: 141px; bottom: 36px; width: 184px; height: 55px; cursor: pointer; } .jt-console-panel-cart-file { left: 170px; bottom: 3px; width: 31px; height: 30px; background-position: -132px -6px; cursor: pointer; } .jt-console-panel-cart-url { left: 266px; bottom: 3px; width: 31px; height: 30px; background-position: -161px -6px; cursor: pointer; } .jt-console-panel-cart-label { position: absolute; top: 51px; left: 156px; width: 148px; height: 25px; padding: 0px 2px; margin: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: bold; font-stretch: normal; font-size: 14px; line-height: 25px; font-family: sans-serif; text-align: center; color: black; background: black; border: 1px solid transparent; opacity: 1; cursor: pointer; } .jt-console-panel-power-labels { left: 31px; bottom: 9px; width: 88px; height: 15px; background-position: -135px -37px; } .jt-console-panel-reset-labels { right: 16px; bottom: 9px; width: 96px; height: 15px; background-position: -135px -55px; } .jt-console-panel-p0-diff-label { left: 128px; top: 8px; width: 29px; height: 15px; background-position: -233px -37px; } .jt-console-panel-p1-diff-label { left: 313px; top: 8px; width: 28px; height: 15px; background-position: -233px -55px; } .jt-hide-labels .jt-console-panel-p0-diff-label, .jt-hide-labels .jt-console-panel-p1-diff-label, .jt-hide-labels .jt-console-panel-power-labels, .jt-hide-labels .jt-console-panel-reset-labels, .jt-hide-labels .jt-console-panel-cart-file, .jt-hide-labels .jt-console-panel-cart-url { visibility: hidden; } @media only screen and (orientation: landscape) {    /* Landscape */ #jt-touch-left { left: calc(-6px - ' +
      this.TOUCH_CONTROLS_LEFT_WIDTH +
      "px); bottom: 50%; transform: translateY(50%); } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-left { left: calc(-6px - " +
      this.TOUCH_CONTROLS_LEFT_WIDTH_BIG +
      "px); transform: translateY(50%) scale(1.2); transform-origin: left center; } #jt-touch-right { right: calc(5px - " +
      this.TOUCH_CONTROLS_RIGHT_WIDTH +
      "px); bottom: 50%; transform: translateY(50%); } #jt-touch-speed { position: absolute; left: -103px; top: 10px; } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-speed { left: -118px; } /* Adjust centered elements leaving space to the touch controls on both sides */ html.jt-full-screen.jt-touch-active #jt-screen-fs-center { left: " +
      this.TOUCH_CONTROLS_LEFT_WIDTH +
      "px; right: " +
      this.TOUCH_CONTROLS_RIGHT_WIDTH +
      "px; } html.jt-full-screen.jt-touch-active.jt-dir-big #jt-screen-fs-center { left: " +
      this.TOUCH_CONTROLS_LEFT_WIDTH_BIG +
      "px; } } @media only screen and (orientation: portrait) {    /* Portrait */ #jt-touch-left { left: 2px; bottom: 200px; } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-left { transform: scale(1.2); transform-origin: left center; } #jt-touch-right { right: 5px; bottom: 144px; width: 112px; height: 112px; } #jt-touch-speed { position: absolute; left: 19px; bottom: " +
      (this.BAR_HEIGHT + 12) +
      "px; } .jt-touch-button { position: absolute; } #jt-touch-button { bottom: 50%; right: 50%; } #jt-touch-buttonT { bottom: 100%; right: 0%; } } @media only screen and (orientation: portrait) and (max-device-height: 638px) {    /* Medium Portrait. Like iPhone 5 */ #jt-touch-left { bottom: 156px; } #jt-touch-right { bottom: 100px; } } @media only screen and (orientation: portrait) and (max-device-height: 518px) {    /* Short Portrait. Like iPhone 4 */ #jt-touch-left { bottom: 98px; } #jt-touch-right { bottom: 42px; } html.jt-console-panel-active #jt-touch-left { bottom: 106px; } html.jt-console-panel-active #jt-touch-right { bottom: 52px; } html.jt-full-screen.jt-console-panel-active #jt-touch-speed { display: none; } } "
    );
  }),
  (jt.Monitor = function (a) {
    "use strict";
    function b(a) {
      var b = a < 0.5 ? 0.5 : a > 2.5 ? 2.5 : a;
      return Math.round(10 * b) / 10;
    }
    function c(a) {
      var b = a < 0.5 ? 0.5 : a;
      return Math.round(10 * b) / 10;
    }
    var d = this;
    (this.connect = function (a) {
      (r = a), r.connectMonitor(this);
    }),
      (this.nextLine = function (a, b) {
        var c = !1;
        return (
          H < t ? H >= A && H < A + x && q.set(a, (H - A) * s) : (c = f()),
          H++,
          E || K++,
          b && (E || g(), (c |= e())),
          c
        );
      });
    var e = function () {
        return (
          !(H < u) &&
          (M && a.showOSD(G.name + "  " + H + " lines", !0), (H = 0), I++, !0)
        );
      },
      f = function () {
        return H > v && e();
      };
    this.setVideoStandard = function (a) {
      (G = a),
        (s = a.totalWidth),
        (t = a.totalHeight),
        (u = t - Q),
        (v = t + Q + R),
        J && ((y = G.defaultHeightPct), (B = G.defaultOriginYPct)),
        j(w, y),
        i(z, B);
    };
    var g = function () {
        var a = K;
        (K = 0),
          ((a >= 250 && a <= 281) || (a >= 300 && a <= 325)) &&
            ++F >= 5 &&
            h(a);
      },
      h = function (a) {
        E = a < 290 ? jt.VideoStandard.NTSC : jt.VideoStandard.PAL;
        var b = L,
          c = a - E.totalHeight;
        (c = c > 2 ? (c > 6 ? 6 : c) - 2 : 0) != b &&
          ((L = c), d.setVideoStandard(E));
      };
    this.videoSignalOff = function () {
      (H = 0), a.videoSignalOff();
    };
    var i = function (a, b) {
        (z = a),
          z < 0 ? (z = 0) : z > s - w && (z = s - w),
          (B = b),
          B < 0 ? (B = 0) : (B / 100) * t > t - x && (B = ((t - x) / t) * 100),
          (A = ((B / 100) * t + L / 2) | 0) + x > t && (A = t - x);
      },
      j = function (a, b) {
        (w = a),
          w < 10 ? (w = 10) : w > s && (w = s),
          (y = b),
          y < 10 ? (y = 10) : y > 100 && (y = 100),
          (x = ((y / 100) * (t + L)) | 0),
          x > t && (x = t),
          (n.width = w),
          (n.height = x),
          i(z, B),
          k();
      },
      k = function () {
        a && a.displayMetrics(w, x);
      },
      l = function () {
        (J = !0), (z = P), (B = G.defaultOriginYPct), j(N, G.defaultHeightPct);
      },
      m = function () {
        (n = document.createElement("canvas")),
          (n.width = N),
          (n.height = O),
          (o = n.getContext("2d", { alpha: !1, antialias: !1 })),
          (o.globalCompositeOperation = "copy"),
          (o.globalAlpha = 1),
          (p = o.createImageData(
            jt.VideoStandard.PAL.totalWidth,
            jt.VideoStandard.PAL.totalHeight
          )),
          (q = new Uint32Array(p.data.buffer));
      };
    (this.currentLine = function () {
      return H;
    }),
      (this.refresh = function () {
        o.putImageData(p, -z, 0, z, 0, w, x), a.refresh(n, w, x);
      }),
      (this.videoStandardDetectionStart = function () {
        (E = null), (F = 0), (K = 0);
      }),
      (this.getVideoStandardDetected = function () {
        return E;
      }),
      (this.toggleShowInfo = function () {
        (M = !M) || a.showOSD(null, !0);
      }),
      (this.signalOff = function () {
        a.videoSignalOff();
      }),
      (this.showOSD = function (b, c, d) {
        a.showOSD(b, c, d);
      }),
      (this.setDefaults = function () {
        l(),
          a.crtModeSetDefault(),
          a.crtFilterSetDefault(),
          a.requestReadjust(!0);
      }),
      (this.setDebugMode = function (b) {
        a.setDebugMode(b);
      }),
      (this.crtModeToggle = function () {
        a.crtModeToggle();
      }),
      (this.crtFilterToggle = function () {
        a.crtFilterToggle();
      }),
      (this.fullscreenToggle = function () {
        a.displayToggleFullscreen();
      }),
      (this.displayAspectDecrease = function () {
        this.displayScale(b(C - S), D),
          this.showOSD("Display Aspect: " + C.toFixed(2) + "x", !0);
      }),
      (this.displayAspectIncrease = function () {
        this.displayScale(b(C + S), D),
          this.showOSD("Display Aspect: " + C.toFixed(2) + "x", !0);
      }),
      (this.displayScaleDecrease = function () {
        this.displayScale(C, c(D - S)),
          this.showOSD("Display Size: " + D.toFixed(2) + "x", !0);
      }),
      (this.displayScaleIncrease = function () {
        this.displayScale(C, c(D + S)),
          this.showOSD("Display Size: " + D.toFixed(2) + "x", !0);
      }),
      (this.viewportOriginDecrease = function () {
        (J = !1), i(z, B + T), this.showOSD("Viewport Origin: " + A, !0);
      }),
      (this.viewportOriginIncrease = function () {
        (J = !1), i(z, B - T), this.showOSD("Viewport Origin: " + A, !0);
      }),
      (this.viewportSizeDecrease = function () {
        l(), this.showOSD("Viewport Size: Standard", !0);
      }),
      (this.viewportSizeIncrease = function () {
        (J = !1), j(s, 100), this.showOSD("Viewport Size: Full Signal", !0);
      }),
      (this.displayScale = function (b, c) {
        (C = b), (D = c), a.displayScale(C, D);
      }),
      (this.controlStateChanged = function (b, c) {
        a.controlStateChanged(b, c);
      }),
      (this.controlsStatesRedefined = function () {
        a.controlsStatesRedefined();
      }),
      (this.consolePowerAndUserPauseStateUpdate = function (b, c) {
        a.consolePowerAndUserPauseStateUpdate(b, c);
      }),
      (this.cartridgeInserted = function (b) {
        a.cartridgeInserted(b);
      });
    var n,
      o,
      p,
      q,
      r,
      s,
      t,
      u,
      v,
      w,
      x,
      y,
      z,
      A,
      B,
      C,
      D,
      E,
      F,
      G = jt.VideoStandard.NTSC,
      H = 0,
      I = 0,
      J = !0,
      K = 0,
      L = 0,
      M = !1,
      N = 160,
      O = 213,
      P = 68,
      Q = 16,
      R = 5,
      S = 0.1,
      T = 0.4;
    !(function () {
      m(), l(), d.setVideoStandard(G);
    })();
  }),
  (jt.ConsolePanel = function (a, b) {
    "use strict";
    function c() {
      k(), l(), q();
    }
    function d(b) {
      jt.Util.blockEvent(b),
        J ||
          (s.hapticFeedbackOnTouch(b),
          a.closeAllOverlays(),
          (b.target.jtPressed = !0),
          s.processControlState(b.target.jtControl, !0));
    }
    function e(a) {
      jt.Util.blockEvent(a),
        (a.target.jtPressed = !1),
        J ||
          (s.hapticFeedbackOnTouch(a),
          s.processControlState(a.target.jtControl, !1));
    }
    function f(a) {
      a.target.jtPressed && e(a);
    }
    function g(b, c, d) {
      d || s.hapticFeedbackOnTouch(b),
        c || (a.closeAllOverlays(), t.controlActivated(b.target.jtControl));
    }
    (this.connectPeripherals = function (a, c, d) {
      (s = c), (t = d), a.registerForDnD(b);
    }),
      (this.connect = function (a) {
        u = a;
      }),
      (this.setActive = function (a) {
        (H = a),
          H && (w || c(), i(), j()),
          document.documentElement.classList.toggle(
            "jt-console-panel-active",
            H
          );
      }),
      (this.setLogoMessageActive = function (a) {
        J = a;
      }),
      (this.updateScale = function (a, c, d) {
        var e = 0,
          f = 0;
        if (H) {
          a = c ? (d ? 0.85 * a : a - 36) : 0.85 * a;
          var g = Math.min(1, a / jt.ConsolePanel.DEFAULT_WIDTH);
          (b.style.transform =
            g < 1
              ? "translateX(-50%) scale(" + g.toFixed(8) + ")"
              : "translateX(-50%)"),
            (e = Math.ceil(g * jt.ConsolePanel.DEFAULT_HEIGHT)),
            (f = Math.ceil(g * jt.ConsolePanel.DEFAULT_WIDTH));
        }
        return (
          s && s.getTouchControls().updateConsolePanelSize(a, f, e, c, d), e
        );
      });
    var h = function () {
        o(w, !I[r.POWER]),
          o(x, I[r.BLACK_WHITE]),
          o(y, I[r.SELECT]),
          o(z, I[r.RESET]),
          o(A, I[r.DIFFICULTY0]),
          o(B, I[r.DIFFICULTY1]),
          i();
      },
      i = function () {
        if (
          (o(C, v),
          o(G, v),
          (G.innerHTML = (v && v.rom.info.l) || L),
          v && v.rom.info.lc)
        ) {
          var a = v.rom.info.lc.trim().split(/\s+/);
          (G.style.color = a[0] || M),
            (G.style.background = a[1] || N),
            (G.style.borderColor = a[2] || O);
        } else
          (G.style.color = M),
            (G.style.background = N),
            (G.style.borderColor = O);
      },
      j = function () {
        u.controlsStateReport(I), h();
      },
      k = function () {
        (b.innerHTML = jt.ScreenGUI.htmlConsolePanel),
          delete jt.ScreenGUI.htmlConsolePanel,
          jt.Util.isMobileDevice() && b.classList.add("jt-hide-labels");
      },
      l = function () {
        (w = document.getElementById("jt-console-panel-power")),
          m(w, r.POWER, !0),
          (x = document.getElementById("jt-console-panel-color")),
          m(x, r.BLACK_WHITE, !0),
          (y = document.getElementById("jt-console-panel-select")),
          m(y, r.SELECT, !0),
          (z = document.getElementById("jt-console-panel-reset")),
          m(z, r.RESET, !0),
          (A = document.getElementById("jt-console-panel-p0-diff")),
          m(A, r.DIFFICULTY0, !0),
          (B = document.getElementById("jt-console-panel-p1-diff")),
          m(B, r.DIFFICULTY1, !0),
          (C = document.getElementById("jt-console-panel-cart-image")),
          (D = document.getElementById("jt-console-panel-cart-load")),
          n(D, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT),
          (E = document.getElementById("jt-console-panel-cart-file")),
          (F = document.getElementById("jt-console-panel-cart-url")),
          Javatari.CARTRIDGE_CHANGE_DISABLED
            ? (p(E), p(F))
            : (n(E, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT),
              n(F, jt.PeripheralControls.AUTO_LOAD_URL));
      },
      m = function (a, b, c) {
        (a.jtControl = b),
          c
            ? ((a.jtPressed = !1),
              jt.Util.addEventsListener(a, "mousedown touchstart", d),
              jt.Util.addEventsListener(a, "mouseup touchend touchcancel", e),
              jt.Util.addEventsListener(a, "mouseleave", f))
            : jt.Util.onTapOrMouseDown(a, d);
      },
      n = function (a, b) {
        (a.jtControl = b),
          (a.jtNeedsUIG = !0),
          jt.Util.onTapOrMouseDownWithBlockUIG(a, g);
      },
      o = function (a, b) {
        a.style.opacity = b ? 1 : 0;
      },
      p = function (a, b) {
        a.style.display = "none";
      },
      q = function () {
        var a = (Javatari.CARTRIDGE_LABEL_COLORS || "").trim().split(/\s+/);
        a[0] && (M = a[0]),
          a[1] && (N = a[1]),
          a[2] && (O = a[2]),
          (G = document.getElementById("jt-console-panel-cart-label")),
          n(G, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT);
      },
      r = jt.ConsoleControls;
    (this.controlStateChanged = function (a, b) {
      H && K[a] && j();
    }),
      (this.controlsStatesRedefined = function () {
        H && j();
      }),
      (this.cartridgeInserted = function (a) {
        (v = a), H && i();
      });
    var s,
      t,
      u,
      v,
      w,
      x,
      y,
      z,
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H = !1,
      I = {},
      J = !1,
      K = {};
    (K[r.POWER] = 1),
      (K[r.BLACK_WHITE] = 1),
      (K[r.SELECT] = 1),
      (K[r.RESET] = 1),
      (K[r.DIFFICULTY0] = 1),
      (K[r.DIFFICULTY1] = 1);
    var L = "JAVATARI",
      M = "#fa2525",
      N = "#101010",
      O = "transparent";
  }),
  (jt.ConsolePanel.DEFAULT_WIDTH = 460),
  (jt.ConsolePanel.DEFAULT_HEIGHT = 134),
  (jt.ConsolePanel.shouldStartActive = function () {
    return (
      !Javatari.SCREEN_CONSOLE_PANEL_DISABLED &&
      (-1 === Javatari.CONSOLE_PANEL_ELEMENT_ID ||
        document.getElementById(Javatari.CONSOLE_PANEL_ELEMENT_ID))
    );
  }),
  (jt.ConsolePanel.sameBoxShadowAsScreen = function () {
    var a = document.getElementById(Javatari.SCREEN_ELEMENT_ID);
    return a
      ? window.getComputedStyle(a, null).getPropertyValue("box-shadow")
      : "none";
  }),
  (jt.CanvasDisplay = function (room, mainElement) {
    "use strict";
    function init() {
      jt.Util.insertCSS(jt.ScreenGUI.css()),
        delete jt.ScreenGUI.css,
        setupMain(),
        setupBar(),
        setupFullscreen(),
        (consolePanel = new jt.ConsolePanel(self, consolePanelElement)),
        (monitor = new jt.Monitor(self));
    }
    function consolePanelUpdateForOrientation() {
      setConsolePanelActive(
        isFullscreen && isLandscape
          ? consolePanelActiveLandscape
          : consolePanelActivePortrait
      );
    }
    function setConsolePanelActive(a) {
      consolePanelActive !== a &&
        ((consolePanelActive = a),
        consolePanel.setActive(consolePanelActive),
        updateScale(),
        consolePanelActive
          ? showBar()
          : (cursorHideFrameCountdown = CURSOR_HIDE_FRAMES));
    }
    function hideOSD() {
      (osd.style.transition = "all 0.15s linear"),
        (osd.style.top = "-29px"),
        (osd.style.opacity = 0),
        (osdShowing = !1);
    }
    function releaseControllersOnLostFocus() {
      consoleControlsSocket.releaseControllers();
    }
    function hideCursorAndBar() {
      hideCursor(), hideBar(), (cursorHideFrameCountdown = -1);
    }
    function showCursorAndBar(a) {
      showCursor(),
        (!a && mousePointerLocked) || showBar(),
        (cursorHideFrameCountdown = CURSOR_HIDE_FRAMES);
    }
    function showCursor() {
      cursorShowing ||
        ((fsElement.style.cursor = cursorType), (cursorShowing = !0));
    }
    function hideCursor() {
      cursorShowing &&
        ((fsElement.style.cursor = "none"), (cursorShowing = !1));
    }
    function fullscreenByAPIChanged() {
      var a = isFullscreen,
        b = isFullScreenByAPI();
      b || fullScreenAPIExitUserRequested || !isBrowserStandalone
        ? setFullscreenState(b)
        : self.requestReadjust(),
        a &&
          !b &&
          !fullScreenAPIExitUserRequested &&
          isMobileDevice &&
          (isBrowserStandalone
            ? setEnterFullscreenByAPIOnFirstTouch()
            : (atariConsole.systemPause(!0),
              showLogoMessage(
                "<br>Emulation suspended",
                "RESUME",
                !0,
                function () {
                  self.setFullscreen(!0), atariConsole.systemPause(!1);
                }
              ))),
        (fullScreenAPIExitUserRequested = !1);
    }
    function isFullScreenByAPI() {
      return !!document[fullScreenAPIQueryProp];
    }
    function enterFullScreenByAPI() {
      if (fullscreenAPIEnterMethod)
        try {
          fullscreenAPIEnterMethod.call(fsElement);
        } catch (a) {}
    }
    function exitFullScreenByAPI() {
      if (fullScreenAPIExitMethod)
        try {
          (fullScreenAPIExitUserRequested = !0),
            fullScreenAPIExitMethod.call(document);
        } catch (a) {}
    }
    function updateScale() {
      var a = Math.round(targetWidth * scaleY * aspectX * 2),
        b = Math.round(targetHeight * scaleY);
      (canvas.style.width = a + "px"),
        (canvas.style.height = b + "px"),
        updateBarWidth(a),
        signalIsOn || updateLogoScale(),
        settingsDialog &&
          settingsDialog.isVisible() &&
          settingsDialog.position(),
        updateConsolePanelScale(a);
    }
    function updateBarWidth(a) {
      var b = buttonsBarDesiredWidth > 0 ? buttonsBarDesiredWidth : a;
      (buttonsBar.style.width =
        -1 === buttonsBarDesiredWidth ? "100%" : b + "px"),
        buttonsBar.classList.toggle("jt-narrow", b < NARROW_WIDTH);
    }
    function updateConsolePanelScale(a) {
      var b = consolePanel.updateScale(a, isFullscreen, isLandscape);
      mainElement.style.marginBottom =
        !isFullscreen && b > 0 ? Math.ceil(b + 3) + "px" : "initial";
    }
    function updateCanvasContentSize() {
      var a = crtFilterEffective > 0 ? CANVAS_SIZE_FACTOR : 1;
      (canvas.width = targetWidth * a),
        (canvas.height = targetHeight * a),
        (canvasContext = null);
    }
    function setCRTFilter(a) {
      (crtFilter = a),
        (crtFilterEffective =
          -2 === crtFilter
            ? null
            : -1 === crtFilter
            ? crtFilterAutoValue()
            : a),
        updateCanvasContentSize();
    }
    function crtFilterAutoValue() {
      return isMobileDevice && !isIOSDevice && "FIREFOX" === browserName
        ? 0
        : 1;
    }
    function setCRTMode(a) {
      (crtMode = a),
        (crtModeEffective = -1 === crtMode ? crtModeAutoValue() : crtMode),
        (canvasContext = null);
    }
    function crtModeAutoValue() {
      return isMobileDevice ? 0 : 1;
    }
    function updateLogo() {
      signalIsOn ||
        (updateLogoScale(),
        showCursorAndBar(!0),
        canvasContext &&
          canvasContext.clearRect(0, 0, canvas.width, canvas.height)),
        logo.classList.toggle("jt-show", !signalIsOn);
    }
    function updateLoading() {
      var a = isLoading ? "block" : "none";
      (logoLoadingIcon.style.display = a),
        (canvasLoadingIcon.style.display = a);
    }
    function createCanvasContext() {
      (canvasContext = canvas.getContext("2d", { alpha: !1, antialias: !1 })),
        setImageComposition(),
        setImageSmoothing();
    }
    function setImageComposition() {
      crtModeEffective > 0 && !debugMode
        ? ((canvasContext.globalCompositeOperation = "source-over"),
          (canvasContext.globalAlpha = 0.8))
        : ((canvasContext.globalCompositeOperation = "copy"),
          (canvasContext.globalAlpha = 1));
    }
    function setImageSmoothing() {
      if (
        ((canvas.style.imageRendering =
          0 === crtFilterEffective || 2 === crtFilterEffective
            ? canvasImageRenderingValue
            : "initial"),
        null !== crtFilterEffective)
      ) {
        var a = crtFilterEffective >= 2;
        void 0 !== canvasContext.imageSmoothingEnabled
          ? (canvasContext.imageSmoothingEnabled = a)
          : ((canvasContext.webkitImageSmoothingEnabled = a),
            (canvasContext.mozImageSmoothingEnabled = a),
            (canvasContext.msImageSmoothingEnabled = a));
      }
    }
    function suppressContextMenu(a) {
      a.addEventListener("contextmenu", jt.Util.blockEvent);
    }
    function preventDrag(a) {
      a.ondragstart = jt.Util.blockEvent;
    }
    function setupMain() {
      switch (
        ((mainElement.innerHTML = jt.ScreenGUI.html()),
        (mainElement.tabIndex = -1),
        delete jt.ScreenGUI.html,
        (fsElement = document.getElementById("jt-screen-fs")),
        (fsElementCenter = document.getElementById("jt-screen-fs-center")),
        (canvasOuter = document.getElementById("jt-screen-canvas-outer")),
        (canvas = document.getElementById("jt-screen-canvas")),
        (canvasLoadingIcon = document.getElementById("jt-canvas-loading-icon")),
        (osd = document.getElementById("jt-osd")),
        (logo = document.getElementById("jt-logo")),
        (logoCenter = document.getElementById("jt-logo-center")),
        (logoImage = document.getElementById("jt-logo-image")),
        (logoLoadingIcon = document.getElementById("jt-logo-loading-icon")),
        (logoMessage = document.getElementById("jt-logo-message")),
        (logoMessageText = document.getElementById("jt-logo-message-text")),
        (logoMessageOK = document.getElementById("jt-logo-message-ok")),
        (logoMessageOKText = document.getElementById(
          "jt-logo-message-ok-text"
        )),
        (scrollMessage = document.getElementById("jt-screen-scroll-message")),
        (unmuteMessage = document.getElementById("jt-unmute-message")),
        (consolePanelElement = document.getElementById("jt-console-panel")),
        suppressContextMenu(mainElement),
        preventDrag(logoImage),
        preventDrag(logoLoadingIcon),
        preventDrag(canvasLoadingIcon),
        updateCanvasContentSize(),
        browserName)
      ) {
        case "CHROME":
        case "EDGE":
        case "OPERA":
          canvasImageRenderingValue = "pixelated";
          break;
        case "FIREFOX":
          canvasImageRenderingValue = "-moz-crisp-edges";
          break;
        case "SAFARI":
          canvasImageRenderingValue = "-webkit-optimize-contrast";
          break;
        default:
          canvasImageRenderingValue = "pixelated";
      }
      setupMainEvents();
    }
    function setupMainEvents() {
      (isMobileDevice ? canvasOuter : fsElement).addEventListener(
        "mousemove",
        function () {
          showCursorAndBar();
        }
      ),
        "onblur" in document
          ? fsElement.addEventListener(
              "blur",
              releaseControllersOnLostFocus,
              !0
            )
          : fsElement.addEventListener(
              "focusout",
              releaseControllersOnLostFocus,
              !0
            ),
        window.addEventListener("orientationchange", function () {
          closeAllOverlays(),
            signalIsOn ? hideCursorAndBar() : showCursorAndBar(),
            self.requestReadjust();
        }),
        mainElement.addEventListener("drop", closeAllOverlays, !0),
        (logoMessageOK.jtNeedsUIG = logoMessageOKText.jtNeedsUIG = !0),
        jt.Util.onTapOrMouseDownWithBlockUIG(
          logoMessageOK,
          self.closeLogoMessage
        ),
        jt.Util.addEventsListener(
          fsElementCenter,
          "touchstart touchend mousedown",
          function (a) {
            "touchend" !== a.type
              ? (closeAllOverlays(), showCursorAndBar())
              : a.cancelable && a.preventDefault();
          }
        );
    }
    function setupBar() {
      (buttonsBar = document.getElementById("jt-bar")),
        (buttonsBarInner = document.getElementById("jt-bar-inner")),
        BAR_AUTO_HIDE &&
          (document.documentElement.classList.add("jt-bar-auto-hide"),
          fsElement.addEventListener("mouseleave", hideBar),
          hideBar());
      var a = [
        {
          label: "Power",
          clickModif: 0,
          control: jt.PeripheralControls.CONSOLE_POWER_TOGGLE,
        },
        {
          label: "Fry Console",
          control: jt.PeripheralControls.CONSOLE_POWER_FRY,
        },
        { label: "", divider: !0 },
        {
          label: "Net Play!",
          control: jt.PeripheralControls.SCREEN_OPEN_NETPLAY,
        },
        { label: "", divider: !0 },
        {
          label: "Select Cartridge",
          control: jt.PeripheralControls.CARTRIDGE_LOAD_RECENT,
        },
        {
          label: "Set ROM Format",
          clickModif: KEY_SHIFT_MASK,
          control: jt.PeripheralControls.CARTRIDGE_CHOOSE_FORMAT,
        },
        { label: "", divider: !0 },
        {
          label: "Open File",
          clickModif: KEY_CTRL_MASK,
          control: jt.PeripheralControls.AUTO_LOAD_FILE,
          needsUIG: !0,
        },
        {
          label: "Open URL",
          clickModif: KEY_CTRL_MASK | KEY_ALT_MASK,
          control: jt.PeripheralControls.AUTO_LOAD_URL,
          needsUIG: !0,
        },
        { label: "", divider: !0 },
        {
          label: "Load State",
          control: jt.PeripheralControls.CONSOLE_LOAD_STATE_MENU,
        },
        {
          label: "Save State",
          control: jt.PeripheralControls.CONSOLE_SAVE_STATE_MENU,
        },
      ];
      (powerButton = addBarButton(
        "jt-bar-power",
        -5,
        -26,
        "System Power",
        null,
        !1,
        a,
        "System"
      )),
        (barMenuSystem = a),
        self.consolePowerAndUserPauseStateUpdate(!1, !1),
        (netplayButton = addBarButton(
          "jt-bar-netplay",
          -192,
          -1,
          "NetPlay!",
          jt.PeripheralControls.SCREEN_OPEN_NETPLAY
        )),
        netplayButton.classList.add("jt-hidden"),
        isMobileDevice
          ? (settingsButton = addBarButton(
              "jt-bar-settings",
              -33,
              -26,
              "Quick Options",
              jt.PeripheralControls.SCREEN_OPEN_QUICK_OPTIONS,
              !1
            ))
          : ((a = [
              {
                label: "Help & Settings",
                clickModif: 0,
                control: jt.PeripheralControls.SCREEN_OPEN_SETTINGS,
              },
              {
                label: "Quick Options",
                control: jt.PeripheralControls.SCREEN_OPEN_QUICK_OPTIONS,
              },
              {
                label: "Defaults",
                control: jt.PeripheralControls.SCREEN_DEFAULTS,
              },
            ]),
            (settingsButton = addBarButton(
              "jt-bar-settings",
              -33,
              -26,
              "Settings",
              null,
              !1,
              a,
              "Settings"
            ))),
        (gameSelectButton = addBarButton(
          "jt-bar-select",
          -78,
          -51,
          "Game Select",
          jt.ConsoleControls.SELECT,
          !0
        )),
        (gameResetButton = addBarButton(
          "jt-bar-reset",
          -33,
          -51,
          "Game Reset",
          jt.ConsoleControls.RESET,
          !0
        )),
        -2 !== FULLSCREEN_MODE &&
          ((fullscreenButton = addBarButton(
            "jt-bar-full-screen",
            -103,
            -1,
            "Full Screen",
            jt.PeripheralControls.SCREEN_FULLSCREEN,
            !1
          )),
          (fullscreenButton.jtNeedsUIG = !0),
          isMobileDevice && fullscreenButton.classList.add("jt-mobile")),
        Javatari.SCREEN_RESIZE_DISABLED ||
          isMobileDevice ||
          ((scaleUpButton = addBarButton(
            "jt-bar-scale-plus",
            -80,
            -1,
            "Increase Screen",
            jt.PeripheralControls.SCREEN_SCALE_PLUS,
            !1
          )),
          scaleUpButton.classList.add("jt-full-screen-hidden"),
          (scaleDownButton = addBarButton(
            "jt-bar-scale-minus",
            -58,
            -1,
            "Decrease Screen",
            jt.PeripheralControls.SCREEN_SCALE_MINUS,
            !1
          )),
          scaleDownButton.classList.add("jt-full-screen-hidden")),
        addBarButton(
          "jt-bar-console-panel",
          -61,
          -25,
          "Toggle Console Panel",
          jt.PeripheralControls.SCREEN_CONSOLE_PANEL_TOGGLE,
          !1
        ).classList.add("jt-full-screen-only"),
        (logoButton = addBarButton(
          "jt-bar-logo",
          -99,
          -26,
          "About Javatari",
          jt.PeripheralControls.SCREEN_OPEN_ABOUT,
          !1
        )),
        logoButton.classList.add("jt-full-screen-hidden"),
        jt.Util.onTapOrMouseDownWithBlockUIG(
          buttonsBar,
          barElementTapOrMouseDown
        ),
        jt.Util.addEventsListener(buttonsBar, "touchmove", barElementTouchMove),
        jt.Util.addEventsListener(
          buttonsBar,
          "mouseup touchend",
          barElementTouchEndOrMouseUp
        );
    }
    function addBarButton(a, b, c, d, e, f, g, h) {
      var i = document.createElement("div");
      return (
        (i.id = a),
        i.classList.add("jt-bar-button"),
        (i.jtBarElementType = 1),
        (i.jtControl = e),
        (i.jtIsConsoleControl = f),
        (i.style.backgroundPosition = b + "px " + c + "px"),
        (i.jtBX = b),
        g &&
          ((i.jtMenu = g),
          (g.jtTitle = h),
          (g.jtRefElement = i),
          (g.jtMenuIndex = barMenus.length),
          barMenus.push(g)),
        d && (i.title = d),
        i.addEventListener("mouseenter", function (a) {
          barButtonHoverOver(a.target, a);
        }),
        f && i.addEventListener("mouseleave", barButtonMouseLeft),
        buttonsBarInner.appendChild(i),
        i
      );
    }
    function barButtonTapOrMousedown(a, b, c, d) {
      if (
        (d || consoleControls.hapticFeedbackOnTouch(b),
        !logoMessageActive && !c)
      ) {
        var e = barMenuActive;
        if ((closeAllOverlays(), a.jtControl))
          return void (
            b.button ||
            (a.jtIsConsoleControl
              ? ((barConsoleControlPressed = a.jtControl),
                consoleControls.processControlState(
                  barConsoleControlPressed,
                  !0
                ))
              : peripheralControls.controlActivated(a.jtControl))
          );
        var f = a.jtMenu;
        if (f) {
          var g =
            0 |
            (b.altKey && KEY_ALT_MASK) |
            (b.ctrlKey && KEY_CTRL_MASK) |
            (b.shiftKey && KEY_SHIFT_MASK);
          if (0 === g && !b.button)
            return void (
              e !== f &&
              (showBarMenu(f),
              "touchstart" === b.type && barButtonLongTouchStart(b))
            );
          for (var h = 0; h < f.length; ++h)
            if (f[h].clickModif === g)
              return void peripheralControls.controlActivated(
                f[h].control,
                1 === b.button,
                f[h].secSlot
              );
          if (g & KEY_SHIFT_MASK)
            for (g &= ~KEY_SHIFT_MASK, h = 0; h < f.length; ++h)
              if (f[h].clickModif === g)
                return void peripheralControls.controlActivated(
                  f[h].control,
                  1 === b.button,
                  !0
                );
        }
      }
    }
    function barButtonLongTouchStart(a) {
      (barButtonLongTouchTarget = a.target),
        (barButtonLongTouchSelectTimeout = window.setTimeout(function () {
          if (barMenuActive)
            for (var a = barMenu.jtItems, b = 0; b < a.length; ++b) {
              var c = a[b].jtMenuOption;
              if (c && 0 === c.clickModif)
                return void barMenuItemSetActive(a[b], !0);
            }
        }, 450));
    }
    function barButtonLongTouchCancel() {
      barButtonLongTouchSelectTimeout &&
        (clearTimeout(barButtonLongTouchSelectTimeout),
        (barButtonLongTouchSelectTimeout = null));
    }
    function barButtonHoverOver(a, b) {
      barMenuActive &&
        a.jtMenu &&
        barMenuActive !== a.jtMenu &&
        (consoleControls.hapticFeedbackOnTouch(b), showBarMenu(a.jtMenu));
    }
    function barButtonMouseLeft() {
      barConsoleControlPressed &&
        ((cursorHideFrameCountdown = CURSOR_HIDE_FRAMES),
        consoleControls.processControlState(barConsoleControlPressed, !1),
        (barConsoleControlPressed = null));
    }
    function barButtonTouchEndOrMouseUp(a) {
      if (!logoMessageActive)
        return barConsoleControlPressed
          ? (consoleControls.hapticFeedbackOnTouch(a),
            consoleControls.processControlState(barConsoleControlPressed, !1),
            void (barConsoleControlPressed = null))
          : void (
              !barMenuItemActive ||
              a.button > 1 ||
              barMenuItemFireActive(a.shiftKey, 1 === a.button || a.ctrlKey)
            );
    }
    function barMenuItemTapOrMouseDown(a, b, c) {
      c || barMenuItemSetActive(a, "touchstart" === b.type);
    }
    function barMenuItemHoverOver(a, b) {
      barMenuItemSetActive(a, "touchmove" === b.type);
    }
    function barMenuItemHoverOut() {
      barMenuItemSetActive(null);
    }
    function barMenuItemTouchEndOrMouseUp(a) {
      logoMessageActive ||
        !barMenuItemActive ||
        a.button > 1 ||
        barMenuItemFireActive(a.shiftKey, 1 === a.button || a.ctrlKey);
    }
    function barMenuItemFireActive(a, b) {
      var c = barMenuItemActive.jtMenuOption;
      barMenuItemSetActive(null),
        c &&
          !c.disabled &&
          (c.extension
            ? extensionsSocket.toggleExtension(c.extension, b, a)
            : c.control &&
              ((a |= c.secSlot),
              closeAllOverlays(),
              peripheralControls.controlActivated(c.control, b, a)));
    }
    function barMenuItemSetActive(a, b) {
      a !== barMenuItemActive &&
        (barMenuItemActive && barMenuItemActive.classList.remove("jt-hover"),
        a && a.jtMenuOption
          ? ((barMenuItemActive = a),
            b && consoleControls.hapticFeedback(),
            barMenuItemActive.classList.add("jt-hover"))
          : (barMenuItemActive = null));
    }
    function barElementTapOrMouseDown(a, b, c) {
      cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
      var d = a.target;
      1 === d.jtBarElementType
        ? barButtonTapOrMousedown(d, a, b, c)
        : 2 === d.jtBarElementType
        ? barMenuItemTapOrMouseDown(d, a, c)
        : hideBarMenu();
    }
    function barElementTouchMove(a) {
      jt.Util.blockEvent(a);
      var b = a.changedTouches[0],
        c = b && document.elementFromPoint(b.clientX, b.clientY);
      barButtonLongTouchTarget &&
        c !== barButtonLongTouchTarget &&
        barButtonLongTouchCancel(),
        2 !== c.jtBarElementType &&
          c !== barButtonLongTouchTarget &&
          barMenuItemSetActive(null),
        1 === c.jtBarElementType
          ? barButtonHoverOver(c, a)
          : 2 === c.jtBarElementType && barMenuItemHoverOver(c, a);
    }
    function barElementTouchEndOrMouseUp(a) {
      (cursorHideFrameCountdown = CURSOR_HIDE_FRAMES),
        jt.Util.blockEvent(a),
        barButtonLongTouchCancel();
      var b = a.target;
      1 === b.jtBarElementType
        ? barButtonTouchEndOrMouseUp(a)
        : 2 === b.jtBarElementType && barMenuItemTouchEndOrMouseUp(a);
    }
    function setupFullscreen() {
      (fullscreenAPIEnterMethod =
        fsElement.requestFullscreen ||
        fsElement.webkitRequestFullscreen ||
        fsElement.webkitRequestFullScreen ||
        fsElement.mozRequestFullScreen),
        (fullScreenAPIExitMethod =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.mozCancelFullScreen),
        "fullscreenElement" in document
          ? (fullScreenAPIQueryProp = "fullscreenElement")
          : "webkitFullscreenElement" in document
          ? (fullScreenAPIQueryProp = "webkitFullscreenElement")
          : "mozFullScreenElement" in document &&
            (fullScreenAPIQueryProp = "mozFullScreenElement"),
        fullscreenAPIEnterMethod ||
          !isMobileDevice ||
          isBrowserStandalone ||
          (fullScreenScrollHack = !0),
        "onfullscreenchange" in document
          ? document.addEventListener(
              "fullscreenchange",
              fullscreenByAPIChanged
            )
          : "onwebkitfullscreenchange" in document
          ? document.addEventListener(
              "webkitfullscreenchange",
              fullscreenByAPIChanged
            )
          : "onmozfullscreenchange" in document &&
            document.addEventListener(
              "mozfullscreenchange",
              fullscreenByAPIChanged
            ),
        fullscreenAPIEnterMethod ||
          ((scrollMessage.jtScroll =
            canvas.jtScroll =
            logo.jtScroll =
            logoCenter.jtScroll =
            logoImage.jtScroll =
            logoMessage.jtScroll =
            logoMessageText.jtScroll =
            logoMessageOK.jtScroll =
            logoMessageOKText.jtScroll =
              !0),
          fsElement.addEventListener("touchmove", function (a) {
            if (isFullscreen) {
              if (!fullScreenScrollHack || !a.target.jtScroll)
                return jt.Util.blockEvent(a);
              scrollMessageActive && setScrollMessage(!1);
            }
          }));
    }
    function setEnterFullscreenByAPIOnFirstTouch() {
      if (fullscreenAPIEnterMethod) {
        var a = !1,
          b = function () {
            a ||
              ((a = !0),
              jt.Util.removeEventsListener(
                fsElement,
                "touchend mousedown",
                b,
                !0
              ),
              enterFullScreenByAPI());
          };
        jt.Util.addEventsListener(fsElement, "touchend mousedown", b, !0);
      }
    }
    function setFullscreenState(a) {
      (isFullscreen = a),
        a
          ? (setViewport(),
            document.documentElement.classList.add("jt-full-screen"),
            fullScreenScrollHack &&
              document.documentElement.classList.add(
                "jt-full-screen-scroll-hack"
              ),
            consoleControls.setupTouchControlsIfNeeded(fsElementCenter),
            fullScreenScrollHack && setScrollMessage(!0),
            fullscreenAPIEnterMethod || tryToFixSafariBugOnFullScreenChange())
          : (restoreViewport(),
            document.documentElement.classList.remove("jt-full-screen"),
            fullScreenScrollHack &&
              document.documentElement.classList.remove(
                "jt-full-screen-scroll-hack"
              ),
            fullscreenAPIEnterMethod || tryToFixSafariBugOnFullScreenChange()),
        closeAllOverlays(),
        self.requestReadjust();
    }
    function tryToFixSafariBugOnFullScreenChange() {
      var a = document.getElementById("jt-dummy-element");
      a
        ? mainElement.removeChild(a)
        : ((a = document.createElement("div")),
          (a.id = "jt-dummy-element"),
          mainElement.appendChild(a));
    }
    function showBar() {
      buttonsBar.classList.remove("jt-hidden");
    }
    function hideBar() {
      (!BAR_AUTO_HIDE && !isFullscreen) ||
        barMenuActive ||
        consolePanelActive ||
        barConsoleControlPressed ||
        (hideBarMenu(), buttonsBar.classList.add("jt-hidden"));
    }
    function showBarMenu(a, b) {
      if (a && barMenuActive !== a) {
        if (!barMenu)
          return (
            setupBarMenu(),
            void setTimeout(function () {
              showBarMenu(a, b);
            }, 1)
          );
        refreshBarMenu(a),
          barMenuItemSetActive(b ? barMenu.jtDefaultItem : null);
        var c = a.jtRefElement,
          d = (c && c.offsetLeft - 15) || 0;
        d + jt.ScreenGUI.BAR_MENU_WIDTH > c.parentElement.clientWidth
          ? ((barMenu.style.right = 0),
            (barMenu.style.left = "auto"),
            (barMenu.style.transformOrigin = "bottom right"))
          : (d < 0 && (d = 0),
            (barMenu.style.left = d + "px"),
            (barMenu.style.right = "auto"),
            (barMenu.style.transformOrigin = "bottom left")),
          showCursorAndBar(!0),
          (barMenuActive = a),
          (barMenu.style.display = "inline-block"),
          barMenu.jtTitle.focus();
      }
    }
    function refreshBarMenu(a) {
      (barMenu.jtTitle.innerHTML = a.jtTitle), (barMenu.jtDefaultItem = null);
      for (
        var b,
          c = 0,
          d = Math.min(a.length, BAR_MENU_MAX_ITEMS),
          e = jt.ScreenGUI.BAR_MENU_ITEM_HEIGHT + 3,
          f = 0;
        f < d;
        ++f
      ) {
        var g = a[f];
        void 0 !== g.label &&
          ((b = barMenu.jtItems[c]),
          (b.firstChild.textContent = g.label),
          (b.jtMenuOption = null),
          g.hidden ||
          (isFullscreen && g.fullScreenHidden) ||
          (!isFullscreen && g.fullScreenOnly)
            ? (b.style.display = "none")
            : ((b.style.display = "block"),
              g.divider
                ? b.classList.add("jt-bar-menu-item-divider")
                : (b.classList.remove("jt-bar-menu-item-divider"),
                  (e += jt.ScreenGUI.BAR_MENU_ITEM_HEIGHT),
                  b.classList.toggle(
                    "jt-bar-menu-item-toggle",
                    void 0 !== g.toggle
                  ),
                  g.disabled
                    ? b.classList.add("jt-bar-menu-item-disabled")
                    : (b.classList.remove("jt-bar-menu-item-disabled"),
                      (b.jtMenuOption = g),
                      0 === g.clickModif && (barMenu.jtDefaultItem = b),
                      (b.jtNeedsUIG = g.needsUIG),
                      void 0 !== g.toggle &&
                        b.classList.toggle(
                          "jt-bar-menu-item-toggle-checked",
                          !!g.checked
                        )))),
          ++c);
      }
      for (var h = c; h < BAR_MENU_MAX_ITEMS; ++h)
        (b = barMenu.jtItems[h]),
          (b.firstChild.textContent = ""),
          (b.style.display = "none"),
          (b.jtMenuOption = null);
      var i = fsElementCenter.clientHeight - jt.ScreenGUI.BAR_HEIGHT - 12,
        j = e < i ? 1 : i / e;
      barMenu && (barMenu.style.transform = "scale(" + j.toFixed(4) + ")");
    }
    function hideBarMenu() {
      barMenuActive &&
        ((barMenuActive = null),
        (barMenu.style.display = "none"),
        barMenuItemSetActive(null),
        (cursorHideFrameCountdown = CURSOR_HIDE_FRAMES),
        self.focus());
    }
    function setupBarMenu() {
      (barMenu = document.createElement("div")), (barMenu.id = "jt-bar-menu");
      var a = document.createElement("div");
      (a.id = "jt-bar-menu-inner"), barMenu.appendChild(a);
      var b = document.createElement("div");
      (b.id = "jt-bar-menu-title"),
        (b.tabIndex = -1),
        (b.innerHTML = "Menu Title"),
        a.appendChild(b),
        (barMenu.jtTitle = b),
        (barMenu.jtItems = new Array(BAR_MENU_MAX_ITEMS));
      for (var c = 0; c < BAR_MENU_MAX_ITEMS; ++c) {
        var d = document.createElement("div");
        d.classList.add("jt-bar-menu-item"),
          (d.style.display = "none"),
          (d.innerHTML = "Menu Item " + c),
          (d.jtBarElementType = 2),
          (d.jtItemIndex = c),
          d.addEventListener("mouseenter", function (a) {
            barMenuItemHoverOver(a.target, a);
          }),
          d.addEventListener("mouseleave", barMenuItemHoverOut),
          a.appendChild(d),
          (barMenu.jtItems[c] = d);
      }
      barMenu.addEventListener("keydown", function (a) {
        if (MENU_CLOSE_KEYS[a.keyCode]) hideBarMenu();
        else if (
          barMenuItemActive &&
          MENU_EXEC_KEYS[a.keyCode & ~KEY_SHIFT_MASK & ~KEY_CTRL_MASK]
        )
          barMenuItemFireActive(a.shiftKey, a.ctrlKey);
        else if (MENU_SELECT_KEYS[a.keyCode]) {
          if (!barMenuActive) return;
          var b =
            (barMenus.length +
              barMenuActive.jtMenuIndex +
              MENU_SELECT_KEYS[a.keyCode]) %
            barMenus.length;
          showBarMenu(barMenus[b], !0);
        } else if (MENU_ITEM_SELECT_KEYS[a.keyCode]) {
          var c = barMenu.jtItems,
            d = barMenuItemActive ? barMenuItemActive.jtItemIndex : -1,
            e = BAR_MENU_MAX_ITEMS + 1;
          do {
            d = (d + c.length + MENU_ITEM_SELECT_KEYS[a.keyCode]) % c.length;
          } while (--e >= 0 && !c[d].jtMenuOption);
          e >= 0 && barMenuItemSetActive(c[d]);
        }
        return jt.Util.blockEvent(a);
      }),
        buttonsBar.appendChild(barMenu);
    }
    function closeAllOverlays() {
      hideBarMenu(),
        saveStateDialog && saveStateDialog.hide(),
        quickOtionsDialog && quickOtionsDialog.hide(),
        netPlayDialog && netPlayDialog.hide(),
        cartFormatDialog && cartFormatDialog.hide(),
        settingsDialog && settingsDialog.hide(),
        recentROMsDialog && recentROMsDialog.hide();
    }
    function showLogoMessage(a, b, c, d) {
      consolePanel.setLogoMessageActive(!0),
        logoMessageActive ||
          (closeAllOverlays(),
          d && (afterMessageAction = d),
          (logoMessageText.innerHTML = a),
          logoMessageOK.classList.toggle("jt-higher", !!c),
          (logoMessageOKText.innerHTML = b || "OK"),
          fsElement.classList.add("jt-logo-message-active"),
          (logoMessageActive = !0),
          (signalIsOn = !1),
          updateLogo());
    }
    function updateLogoScale() {
      var a = canvasOuter.clientWidth,
        b = Math.min(a / jt.ScreenGUI.LOGO_SCREEN_WIDTH, 1);
      logoCenter.style.transform =
        b < 1
          ? "translate(-50%, -50%) scale(" + b.toFixed(4) + ")"
          : "translate(-50%, -50%)";
    }
    function setScrollMessage(a) {
      console.error("Scroll Message: " + a),
        fsElement.classList.toggle("jt-scroll-message", a),
        (scrollMessageActive = a),
        a &&
          setTimeout(function () {
            setScrollMessage(!1);
          }, 5e3);
    }
    function readjustAll(a) {
      if (isReadjustScreeSizeChanged(a)) {
        if (isFullscreen) {
          buttonsBarDesiredWidth = isLandscape ? 0 : -1;
          var b = readjustScreenSize.h;
          isLandscape || (b -= jt.ScreenGUI.BAR_HEIGHT + 2),
            monitor.displayScale(
              aspectX,
              displayOptimalScaleY(readjustScreenSize.w, b)
            );
        } else
          (buttonsBarDesiredWidth = -1),
            monitor.displayScale(
              Javatari.SCREEN_DEFAULT_ASPECT,
              self.displayDefaultScale()
            );
        self.focus(),
          consolePanelUpdateForOrientation(),
          consoleControlsSocket.releaseControllers();
      }
      readjustInterval &&
        jt.Util.performanceNow() - readjustRequestTime >= 1e3 &&
        (clearInterval(readjustInterval), (readjustInterval = null));
    }
    function isReadjustScreeSizeChanged(a) {
      var b = mainElement.parentElement.clientWidth,
        c = fsElementCenter.clientWidth,
        d = fsElementCenter.clientHeight;
      return (
        !(
          !a &&
          readjustScreenSize.pw === b &&
          readjustScreenSize.w === c &&
          readjustScreenSize.h === d
        ) &&
        ((readjustScreenSize.pw = b),
        (readjustScreenSize.w = c),
        (readjustScreenSize.h = d),
        (isLandscape = c > d),
        !0)
      );
    }
    function displayOptimalScaleY(a, b) {
      var c = 2 * aspectX,
        d = b / targetHeight;
      return targetWidth * c * d > a && (d = a / (targetWidth * c)), d;
    }
    function setViewport() {
      if (isMobileDevice) {
        if (
          (void 0 === viewPortOriginalContent &&
            ((viewPortOriginalTag = document.querySelector(
              "meta[name=viewport]"
            )),
            (viewPortOriginalContent =
              (viewPortOriginalTag && viewPortOriginalTag.content) || null)),
          viewportTag ||
            ((viewportTag = document.createElement("meta")),
            (viewportTag.name = "viewport"),
            (viewportTag.content =
              "width = device-width, height = device-height, initial-scale = 1.0, minimum-scale = 1.0, maximum-scale = 1.0, user-scalable = yes"),
            document.head.appendChild(viewportTag)),
          viewPortOriginalTag)
        )
          try {
            document.head.removeChild(viewPortOriginalTag);
          } catch (a) {}
        viewPortOriginalTag = null;
      }
    }
    function restoreViewport() {
      if (isMobileDevice) {
        if (
          (!viewPortOriginalTag &&
            viewPortOriginalContent &&
            ((viewPortOriginalTag = document.createElement("meta")),
            (viewPortOriginalTag.name = "viewport"),
            (viewPortOriginalTag.content = viewPortOriginalContent),
            document.head.appendChild(viewPortOriginalTag)),
          viewportTag)
        )
          try {
            document.head.removeChild(viewportTag);
          } catch (a) {}
        viewportTag = null;
      }
    }
    function setPageVisibilityHandling() {
      function a() {
        logoMessageActive ||
          (document.hidden
            ? (b = !atariConsole.systemPause(!0))
            : b && atariConsole.systemPause(!1));
      }
      var b;
      document.addEventListener("visibilitychange", a);
    }
    var self = this;
    (this.connect = function (a) {
      (atariConsole = a),
        monitor.connect(atariConsole.getVideoOutput()),
        (consoleControlsSocket = atariConsole.getConsoleControlsSocket()),
        (cartridgeSocket = atariConsole.getCartridgeSocket()),
        consolePanel.connect(consoleControlsSocket);
    }),
      (this.connectPeripherals = function (a, b, c, d, e, f) {
        (recentROMs = a),
          (fileLoader = b),
          b.registerForDnD(fsElement),
          b.registerForFileInputElement(fsElement),
          (fileDownloader = c),
          fileDownloader.registerForDownloadElement(fsElement),
          (peripheralControls = e),
          (consoleControls = d),
          consoleControls.addKeyInputElement(fsElement),
          (stateMedia = f),
          consolePanel.connectPeripherals(
            b,
            consoleControls,
            peripheralControls
          );
      }),
      (this.powerOn = function () {
        monitor.setDefaults(),
          updateLogo(),
          document.documentElement.classList.add("jt-started"),
          setPageVisibilityHandling(),
          this.focus(),
          JavatariFullScreenSetup.shouldStartInFullScreen() &&
            (setFullscreenState(!0), setEnterFullscreenByAPIOnFirstTouch());
      }),
      (this.powerOff = function () {
        document.documentElement.classList.remove("jt-started");
      }),
      (this.start = function (a) {
        function b() {
          self.setFullscreen(!0), a();
        }
        !isMobileDevice || isBrowserStandalone || isFullscreen
          ? a()
          : jt.Util.isOfficialHomepage()
          ? showLogoMessage(
              "For " +
                (fullscreenAPIEnterMethod ? "the best" : "a full-screen") +
                ' experience, use<br>the "Add to Home Screen" function<br>then launch from the Installed App',
              "NICE!",
              !1,
              b
            )
          : showLogoMessage(
              "For the best experience,<br>Javatari will go full-screen",
              "GO!",
              !0,
              b
            );
      }),
      (this.refresh = function (a, b, c) {
        cursorHideFrameCountdown > 0 &&
          --cursorHideFrameCountdown <= 0 &&
          hideCursorAndBar(),
          signalIsOn || ((signalIsOn = !0), updateLogo()),
          canvasContext || createCanvasContext(),
          canvasContext.drawImage(a, 0, 0, canvas.width, canvas.height);
      }),
      (this.videoSignalOff = function () {
        (signalIsOn = !1), showCursorAndBar(), updateLogo();
      }),
      (this.mousePointerLocked = function (a) {
        (mousePointerLocked = a),
          mousePointerLocked ? hideCursorAndBar() : showCursorAndBar();
      }),
      (this.openHelp = function () {
        return self.openSettings("GENERAL"), !1;
      }),
      (this.openAbout = function () {
        return self.openSettings("ABOUT"), !1;
      }),
      (this.openSettings = function (a) {
        closeAllOverlays(),
          settingsDialog ||
            (settingsDialog = new jt.SettingsDialog(
              fsElementCenter,
              consoleControls
            )),
          settingsDialog.show(a);
      }),
      (this.openSaveStateDialog = function (a) {
        closeAllOverlays(),
          saveStateDialog ||
            (saveStateDialog = new jt.SaveStateDialog(
              fsElementCenter,
              consoleControls,
              peripheralControls,
              stateMedia
            )),
          saveStateDialog.show(a);
      }),
      (this.openQuickOptionsDialog = function () {
        closeAllOverlays(),
          quickOtionsDialog ||
            (quickOtionsDialog = new jt.QuickOptionsDialog(
              fsElementCenter,
              consoleControls,
              consoleControlsSocket,
              peripheralControls
            )),
          quickOtionsDialog.show();
      }),
      (this.openNetPlayDialog = function () {
        closeAllOverlays(),
          netPlayDialog ||
            (netPlayDialog = new jt.NetPlayDialog(room, fsElementCenter)),
          netPlayDialog.show();
      }),
      (this.openCartridgeFormatDialog = function (a) {
        closeAllOverlays(),
          cartFormatDialog ||
            (cartFormatDialog = new jt.CartridgeFormatDialog(
              this,
              fsElementCenter,
              atariConsole,
              cartridgeSocket
            )),
          cartFormatDialog.show(a);
      }),
      (this.openLoadFileDialog = function (a, b) {
        fileLoader.openFileChooserDialog(
          jt.FileLoader.OPEN_TYPE.AUTO,
          a,
          b,
          !1
        );
      }),
      (this.openRecentROMsDialog = function () {
        closeAllOverlays(),
          recentROMsDialog ||
            (recentROMsDialog = new jt.RecentROMsDialog(
              fsElementCenter,
              this,
              recentROMs,
              fileLoader
            )),
          recentROMsDialog.show();
      }),
      (this.openCartridgeChooserDialog = function (a, b, c) {
        logoMessageActive && self.closeLogoMessage(),
          a || 0 !== recentROMs.getCatalog().length
            ? this.openRecentROMsDialog()
            : this.openLoadFileDialog(b, c);
      }),
      (this.toggleConsolePanel = function () {
        isFullscreen && isLandscape
          ? (consolePanelActiveLandscape = !consolePanelActiveLandscape)
          : (consolePanelActivePortrait = !consolePanelActivePortrait),
          consolePanelUpdateForOrientation();
      }),
      (this.getControlReport = function (a) {
        return {
          label:
            -2 === crtFilter
              ? "Browser"
              : -1 === crtFilter
              ? "Auto"
              : 0 === crtFilter
              ? "OFF"
              : "Level " + crtFilter,
          active: crtFilter >= 0,
        };
      }),
      (this.toggleMenuByKey = function () {
        barMenuActive
          ? hideBarMenu()
          : (closeAllOverlays(), showBarMenu(barMenuSystem, !0));
      }),
      (this.getScreenCapture = function () {
        if (signalIsOn) return canvas.toDataURL("image/png");
      }),
      (this.saveScreenCapture = function () {
        var a = this.getScreenCapture();
        a &&
          fileDownloader.startDownloadURL(
            "Javatari Screen",
            a,
            "Screen Capture"
          );
      }),
      (this.displayMetrics = function (a, b) {
        (targetWidth === a && targetHeight === b) ||
          ((targetWidth = a),
          (targetHeight = b),
          updateCanvasContentSize(),
          isFullscreen ? this.requestReadjust(!0) : updateScale());
      }),
      (this.displayScale = function (a, b) {
        (aspectX = a), (scaleY = b), updateScale();
      }),
      (this.getMonitor = function () {
        return monitor;
      }),
      (this.showOSD = function (a, b, c) {
        if ((osdTimeout && clearTimeout(osdTimeout), !a))
          return (
            (osd.style.transition = "all 0.15s linear"),
            (osd.style.top = "-29px"),
            (osd.style.opacity = 0),
            void (osdShowing = !1)
          );
        (!b && osdShowing) ||
          ((osd.innerHTML = a),
          (osd.style.color = c ? "rgb(255, 60, 40)" : "rgb(0, 255, 0)")),
          (osd.style.transition = "none"),
          (osd.style.top = "15px"),
          (osd.style.opacity = 1),
          (osdShowing = !0);
        var d = canvasOuter.clientWidth - 30,
          e = osd.clientWidth,
          f = e < d ? 1 : d / e;
        (osd.style.transform = "scale(" + f.toFixed(4) + ")"),
          (osdTimeout = setTimeout(hideOSD, OSD_TIME));
      }),
      (this.displayDefaultScale = function () {
        if (Javatari.SCREEN_DEFAULT_SCALE > 0)
          return Javatari.SCREEN_DEFAULT_SCALE;
        var a = Number.parseFloat(
          window.getComputedStyle(mainElement.parentElement).width
        );
        return a >= 640
          ? 2
          : a >= 540
          ? 1.65
          : a >= 420
          ? 1.25
          : a >= 355
          ? 1.05
          : a >= 340
          ? 1
          : a >= 300
          ? 0.9
          : 0.8;
      }),
      (this.setDebugMode = function (a) {
        (debugMode = !!a), (canvasContext = null);
      }),
      (this.crtFilterToggle = function () {
        var a = crtFilter + 1;
        a > 3 && (a = -2), setCRTFilter(a);
        var b =
          null === crtFilterEffective
            ? "browser default"
            : crtFilterEffective < 1
            ? "OFF"
            : "level " + crtFilterEffective;
        this.showOSD(
          "CRT filter: " + (-1 === crtFilter ? "AUTO (" + b + ")" : b),
          !0
        ),
          Javatari.userPreferences.current.crtFilter !== crtFilter &&
            ((Javatari.userPreferences.current.crtFilter = crtFilter),
            Javatari.userPreferences.setDirty(),
            Javatari.userPreferences.save());
      }),
      (this.crtFilterSetDefault = function () {
        var a = Javatari.userPreferences.current.crtFilter;
        setCRTFilter(
          -3 !== Javatari.SCREEN_FILTER_MODE
            ? Javatari.SCREEN_FILTER_MODE
            : null !== a && a > -3
            ? a
            : -1
        );
      }),
      (this.crtModeToggle = function () {
        var a = crtMode + 1;
        a > 1 && (a = -1), setCRTMode(a);
        var b = 1 === crtModeEffective ? "Phosphor" : "OFF";
        this.showOSD(
          "CRT mode: " + (-1 === crtMode ? "AUTO (" + b + ")" : b),
          !0
        );
      }),
      (this.crtModeSetDefault = function () {
        setCRTMode(Javatari.SCREEN_CRT_MODE);
      }),
      (this.displayToggleFullscreen = function () {
        if (-2 !== FULLSCREEN_MODE)
          return fullscreenAPIEnterMethod && !isFullScreenByAPI()
            ? void enterFullScreenByAPI()
            : void this.setFullscreen(!isFullscreen);
      }),
      (this.setFullscreen = function (a) {
        fullscreenAPIEnterMethod
          ? a
            ? enterFullScreenByAPI()
            : exitFullScreenByAPI()
          : setFullscreenState(a);
      }),
      (this.focus = function () {
        canvas.focus();
      }),
      (this.consolePowerAndUserPauseStateUpdate = function (a, b) {
        isLoading && (a = !1),
          (powerButton.style.backgroundPosition =
            powerButton.jtBX +
            "px " +
            mediaButtonBackYOffsets[a ? 2 : 1] +
            "px"),
          (powerButton.jtMenu[0].label = "Power " + (a ? "OFF" : "ON"));
        var c = 2 === room.netPlayMode;
        (powerButton.jtMenu[1].disabled = powerButton.jtMenu[12].disabled =
          c || !a),
          (powerButton.jtMenu[6].disabled =
            c || !(cartridgeSocket && cartridgeSocket.inserted())),
          (powerButton.jtMenu[5].disabled =
            powerButton.jtMenu[8].disabled =
            powerButton.jtMenu[9].disabled =
            powerButton.jtMenu[11].disabled =
              c);
      }),
      (this.cartridgeInserted = function (a) {
        consolePanel.cartridgeInserted(a),
          (powerButton.jtMenu[6].disabled = !a || 2 === room.netPlayMode);
      }),
      (this.controlsModeStateUpdate = function () {
        settingsDialog && settingsDialog.controlsModeStateUpdate(),
          quickOtionsDialog && quickOtionsDialog.controlsModeStateUpdate();
      }),
      (this.touchControlsActiveUpdate = function (a, b) {
        (touchControlsActive === a && touchControlsDirBig === b) ||
          ((touchControlsActive = a),
          (touchControlsDirBig = b),
          isFullscreen &&
            (touchControlsActive &&
              consoleControls.setupTouchControlsIfNeeded(fsElementCenter),
            this.requestReadjust(!0)));
      }),
      (this.roomNetPlayStatusChangeUpdate = function (a) {
        (netPlayDialog && netPlayDialog.isVisible()) || closeAllOverlays(),
          netPlayDialog && netPlayDialog.roomNetPlayStatusChangeUpdate(a),
          netplayButton.classList.toggle("jt-hidden", room.netPlayMode < 1);
      }),
      (this.controlStateChanged = function (a, b) {
        consolePanel.controlStateChanged(a, b),
          quickOtionsDialog && quickOtionsDialog.controlStateChanged(a, b);
      }),
      (this.controlsStatesRedefined = function () {
        consolePanel.controlsStatesRedefined();
      }),
      (this.speakerUnlockStateUpdate = function (a) {
        if ((unmuteMessage.classList.toggle("jt-show", !a), !a)) {
          var b = canvasOuter.clientWidth - 30,
            c = unmuteMessage.clientWidth,
            d = c < b ? 1 : b / c;
          unmuteMessage.style.transform =
            "translate(-50%, 0) scale(" + d.toFixed(4) + ")";
        }
      }),
      (this.setLoading = function (a) {
        (isLoading = a), updateLoading();
      }),
      (this.requestReadjust = function (a) {
        settingsDialog &&
          settingsDialog.isVisible() &&
          settingsDialog.position(),
          a
            ? readjustAll(!0)
            : ((readjustRequestTime = jt.Util.performanceNow()),
              readjustInterval ||
                (readjustInterval = setInterval(readjustAll, 50)));
      }),
      (this.closeAllOverlays = closeAllOverlays),
      (this.closeLogoMessage = function (a, b, c) {
        if (
          (c || consoleControls.hapticFeedbackOnTouch(a),
          !b &&
            (consolePanel.setLogoMessageActive(!1),
            fsElement.classList.remove("jt-logo-message-active"),
            (logoMessageActive = !1),
            afterMessageAction))
        ) {
          var d = afterMessageAction;
          (afterMessageAction = null), d();
        }
      });
    var afterMessageAction,
      atariConsole,
      consoleControlsSocket,
      monitor,
      peripheralControls,
      fileLoader,
      fileDownloader,
      consoleControls,
      cartridgeSocket,
      stateMedia,
      recentROMs,
      readjustInterval = 0,
      readjustRequestTime = 0,
      readjustScreenSize = { w: 0, wk: 0, h: 0, pw: 0, l: !1 },
      isFullscreen = !1,
      isLandscape = !1,
      isTouchDevice = jt.Util.isTouchDevice(),
      isMobileDevice = jt.Util.isMobileDevice(),
      isIOSDevice = jt.Util.isIOSDevice(),
      isBrowserStandalone = jt.Util.isBrowserStandaloneMode(),
      browserName = jt.Util.browserInfo().name,
      fullscreenAPIEnterMethod,
      fullScreenAPIExitMethod,
      fullScreenAPIQueryProp,
      fullScreenAPIExitUserRequested = !1,
      fullScreenScrollHack = !1,
      viewportTag,
      viewPortOriginalTag,
      viewPortOriginalContent,
      consolePanel,
      consolePanelElement,
      settingsDialog,
      saveStateDialog,
      recentROMsDialog,
      quickOtionsDialog,
      netPlayDialog,
      cartFormatDialog,
      fsElement,
      fsElementCenter,
      canvas,
      canvasOuter,
      canvasLoadingIcon,
      canvasContext,
      canvasImageRenderingValue,
      touchControlsActive = !1,
      touchControlsDirBig = !1,
      consolePanelActive = !1,
      consolePanelActiveLandscape = !1,
      consolePanelActivePortrait = jt.ConsolePanel.shouldStartActive(),
      buttonsBar,
      buttonsBarInner,
      buttonsBarDesiredWidth = -1,
      barButtonLongTouchTarget,
      barButtonLongTouchSelectTimeout,
      barMenu,
      barMenus = [],
      barMenuActive,
      barMenuItemActive,
      barMenuSystem,
      barConsoleControlPressed,
      osd,
      osdTimeout,
      osdShowing = !1,
      cursorType = "auto",
      cursorShowing = !0,
      cursorHideFrameCountdown = -1,
      signalIsOn = !1,
      crtFilter = -2,
      crtFilterEffective = null,
      crtMode = -1,
      crtModeEffective = 0,
      debugMode = !1,
      isLoading = !1,
      aspectX = Javatari.SCREEN_DEFAULT_ASPECT,
      scaleY = 1,
      mousePointerLocked = !1,
      targetWidth = 160,
      targetHeight = 213,
      logo,
      logoCenter,
      logoImage,
      logoMessage,
      logoMessageText,
      logoMessageOK,
      logoMessageOKText,
      logoMessageActive = !1,
      logoLoadingIcon,
      scrollMessage,
      scrollMessageActive = !1,
      unmuteMessage,
      powerButton,
      netplayButton,
      logoButton,
      scaleDownButton,
      scaleUpButton,
      fullscreenButton,
      settingsButton,
      gameSelectButton,
      gameResetButton,
      mediaButtonBackYOffsets = [-51, -26, -1],
      CANVAS_SIZE_FACTOR = Javatari.SCREEN_CANVAS_SIZE,
      OSD_TIME = 3e3,
      CURSOR_HIDE_FRAMES = 180,
      FULLSCREEN_MODE = Javatari.SCREEN_FULLSCREEN_MODE,
      BAR_AUTO_HIDE = 0 === Javatari.SCREEN_CONTROL_BAR,
      BAR_MENU_MAX_ITEMS = 13,
      NARROW_WIDTH = 336,
      k = jt.DOMKeys,
      KEY_CTRL_MASK = k.CONTROL,
      KEY_ALT_MASK = k.ALT,
      KEY_SHIFT_MASK = k.SHIFT,
      MENU_CLOSE_KEYS = {};
    (MENU_CLOSE_KEYS[k.VK_ESCAPE.c] = 1), (MENU_CLOSE_KEYS[k.VK_CONTEXT.c] = 1);
    var MENU_EXEC_KEYS = {};
    (MENU_EXEC_KEYS[k.VK_ENTER.c] = 1), (MENU_EXEC_KEYS[k.VK_SPACE.c] = 1);
    var MENU_SELECT_KEYS = {};
    (MENU_SELECT_KEYS[k.VK_LEFT.c] = -1), (MENU_SELECT_KEYS[k.VK_RIGHT.c] = 1);
    var MENU_ITEM_SELECT_KEYS = {};
    (MENU_ITEM_SELECT_KEYS[k.VK_UP.c] = -1),
      (MENU_ITEM_SELECT_KEYS[k.VK_DOWN.c] = 1),
      init(),
      (this.eval = function (str) {
        return eval(str);
      });
  }),
  (jt.RecentROMsDialog = function (a, b, c, d) {
    "use strict";
    function e() {
      j.style.height = 42 + 33 * (l.length + 1) + "px";
      for (var a = 0; a < 11; ++a) {
        var b = n[a],
          c = l[a];
        b.classList.toggle("jt-visible", a <= l.length),
          b.classList.toggle("jt-toggle", a < l.length),
          b.classList.toggle("jt-toggle-checked", a < l.length),
          (b.jtNeedsUIG = a === l.length),
          (b.innerHTML = c ? c.n : "&nbsp;&nbsp;Open ROM File...");
      }
      f();
    }
    function f() {
      for (var a = 0; a < n.length; ++a)
        n[a].classList.toggle("jt-selected", a === m);
    }
    function g() {
      (j = document.createElement("div")),
        (j.id = "jt-recent-roms"),
        j.classList.add("jt-select-dialog"),
        (j.style.width = "350px"),
        (j.tabIndex = -1),
        j.appendChild(document.createTextNode("Select Cartridge")),
        (k = document.createElement("ul")),
        (k.style.width = "85%");
      for (var b = 0; b < 11; ++b) {
        var c = document.createElement("li");
        (c.style.textAlign = "center"),
          (c.innerHTML = ""),
          (c.jtItem = b),
          n.push(c),
          k.appendChild(c);
      }
      j.appendChild(k), h(), a.appendChild(j);
    }
    function h() {
      function a() {
        i.hide(!1);
      }
      function b() {
        i.hide(!0);
      }
      jt.Util.onTapOrMouseDownWithBlock(j, function () {
        j.focus();
      }),
        jt.Util.onTapOrMouseDownWithBlockUIG(j, function (a, c) {
          a.target.jtItem >= 0 &&
            (c && jt.DOMConsoleControls.hapticFeedbackOnTouch(a),
            (m = a.target.jtItem),
            f(),
            c || setTimeout(b, 120));
        }),
        j.addEventListener("keydown", function (c) {
          return (
            c.keyCode === q
              ? a()
              : r.indexOf(c.keyCode) >= 0
              ? b()
              : s[c.keyCode] &&
                ((m += s[c.keyCode]),
                m < 0 ? (m = 0) : m > l.length && (m = l.length),
                f()),
            jt.Util.blockEvent(c)
          );
        });
    }
    var i = this;
    (this.show = function (b) {
      if (!j)
        return (
          g(),
          setTimeout(function () {
            i.show(b);
          }, 0)
        );
      (l = c.getCatalog().slice(0)),
        l.sort(function (a, b) {
          return a.n > b.n;
        });
      var d = c.lastROMLoadedIndex;
      (d = l.indexOf(
        l.find(function (a) {
          return a.i === d;
        })
      )),
        (m = d < 0 || d >= l.length ? l.length : d),
        (o = !0),
        e(),
        j.classList.add("jt-show"),
        j.focus(),
        jt.Util.scaleToFitParentHeight(j, a, jt.ScreenGUI.BAR_HEIGHT);
    }),
      (this.hide = function (a) {
        if (
          o &&
          (j.classList.remove("jt-show"),
          (o = !1),
          Javatari.room.screen.focus(),
          a)
        )
          if (m === l.length) b.openLoadFileDialog();
          else {
            var e = c.getROM(l[m].i);
            d.loadROM(e);
          }
      });
    var j,
      k,
      l = [],
      m = 0,
      n = [],
      o = !1,
      p = jt.DOMKeys,
      q = p.VK_ESCAPE.c,
      r = [p.VK_ENTER.c, p.VK_SPACE.c],
      s = {};
    (s[p.VK_UP.c] = -1), (s[p.VK_DOWN.c] = 1);
  }),
  (jt.SaveStateDialog = function (a, b, c, d) {
    "use strict";
    function e() {
      l.textContent = "Select Slot to " + (m ? "Save" : "Load");
      for (var a = m ? "Save to " : "Load from ", b = 0; b < o.length; ++b) {
        var c = o[b];
        (c.innerHTML = a + s[b].d),
          c.classList.toggle("jt-toggle-checked", d.isSlotUsed(b + 1));
      }
      f();
    }
    function f() {
      for (var a = 0; a < o.length; ++a)
        o[a].classList.toggle("jt-selected", a === n);
    }
    function g() {
      (j = document.createElement("div")),
        (j.id = "jt-savestate"),
        j.classList.add("jt-select-dialog"),
        (j.style.width = "280px"),
        (j.style.height = "404px"),
        (j.tabIndex = -1),
        (l = document.createTextNode("Select Slot")),
        j.appendChild(l),
        (k = document.createElement("ul")),
        (k.style.width = "80%");
      for (var b = 0; b < s.length; ++b) {
        var c = document.createElement("li");
        c.classList.add("jt-visible"),
          b < s.length - 1 && c.classList.add("jt-toggle"),
          (c.style.textAlign = "center"),
          (c.innerHTML = s[b].d),
          (c.jtSlot = b),
          (c.jtNeedsUIG = !0),
          o.push(c),
          k.appendChild(c);
      }
      j.appendChild(k), h(), a.appendChild(j);
    }
    function h() {
      function a() {
        i.hide(!1);
      }
      function b() {
        i.hide(!0);
      }
      jt.Util.onTapOrMouseDownWithBlock(j, function () {
        j.focus();
      }),
        jt.Util.onTapOrMouseDownWithBlockUIG(j, function (a, c) {
          a.target.jtSlot >= 0 &&
            (c && jt.DOMConsoleControls.hapticFeedbackOnTouch(a),
            (n = a.target.jtSlot),
            f(),
            c || setTimeout(b, 120));
        }),
        j.addEventListener("keydown", function (c) {
          return (
            c.keyCode === u
              ? a()
              : v.indexOf(c.keyCode) >= 0
              ? b()
              : w[c.keyCode] &&
                ((n += w[c.keyCode]),
                n < 0 ? (n = 0) : n > 10 && (n = 10),
                f()),
            jt.Util.blockEvent(c)
          );
        });
    }
    var i = this;
    (this.show = function (b) {
      if (!j)
        return (
          g(),
          setTimeout(function () {
            i.show(b);
          }, 0)
        );
      (m = b),
        (p = !0),
        e(),
        j.classList.add("jt-show"),
        j.focus(),
        jt.Util.scaleToFitParentHeight(j, a, jt.ScreenGUI.BAR_HEIGHT);
    }),
      (this.hide = function (a) {
        if (
          p &&
          (j.classList.remove("jt-show"),
          (p = !1),
          Javatari.room.screen.focus(),
          a)
        ) {
          var d = s[n],
            e = m ? d.save : d.load;
          d.peripheral ? c.controlActivated(e) : b.processControlState(e, !0);
        }
      });
    var j,
      k,
      l,
      m = !1,
      n = 0,
      o = [],
      p = !1,
      q = jt.ConsoleControls,
      r = jt.PeripheralControls,
      s = [
        { d: "Slot 1", load: q.LOAD_STATE_1, save: q.SAVE_STATE_1 },
        { d: "Slot 2", load: q.LOAD_STATE_2, save: q.SAVE_STATE_2 },
        { d: "Slot 3", load: q.LOAD_STATE_3, save: q.SAVE_STATE_3 },
        { d: "Slot 4", load: q.LOAD_STATE_4, save: q.SAVE_STATE_4 },
        { d: "Slot 5", load: q.LOAD_STATE_5, save: q.SAVE_STATE_5 },
        { d: "Slot 6", load: q.LOAD_STATE_6, save: q.SAVE_STATE_6 },
        { d: "Slot 7", load: q.LOAD_STATE_7, save: q.SAVE_STATE_7 },
        { d: "Slot 8", load: q.LOAD_STATE_8, save: q.SAVE_STATE_8 },
        { d: "Slot 9", load: q.LOAD_STATE_9, save: q.SAVE_STATE_9 },
        { d: "Slot 10", load: q.LOAD_STATE_10, save: q.SAVE_STATE_10 },
        {
          d: "File...",
          load: r.CONSOLE_LOAD_STATE_FILE,
          save: r.CONSOLE_SAVE_STATE_FILE,
          peripheral: !0,
        },
      ],
      t = jt.DOMKeys,
      u = t.VK_ESCAPE.c,
      v = [t.VK_ENTER.c, t.VK_SPACE.c],
      w = {};
    (w[t.VK_UP.c] = -1), (w[t.VK_DOWN.c] = 1);
  }),
  (jt.QuickOptionsDialog = function (a, b, c, d) {
    "use strict";
    function e() {
      for (var a = 0; a < j.length; ++a) {
        var b = j[a],
          e = b.peripheral
            ? d.getControlReport(b.control)
            : c.getControlReport(b.control);
        (b.value = e.label),
          (b.selected = e.active),
          (l[a].innerHTML = b.value),
          l[a].classList.toggle("jt-selected", !!b.selected);
      }
    }
    function f() {
      (i = document.createElement("div")),
        (i.id = "jt-quick-options"),
        (i.tabIndex = -1);
      var b = jt.PeripheralControls;
      j = [
        { label: "Paddles", control: b.PADDLES_TOGGLE_MODE, peripheral: !0 },
        {
          label: "Swap Controllers",
          control: b.P1_CONTROLS_TOGGLE,
          peripheral: !0,
        },
        { label: "No Collisions", control: m.NO_COLLISIONS },
        { label: "&#128190;&nbsp; V-Synch", control: m.VSYNCH },
        {
          label: "&#128190;&nbsp; CRT Filter",
          control: b.SCREEN_CRT_FILTER,
          peripheral: !0,
        },
        {
          label: "&#128190;&nbsp; Audio Buffer",
          control: b.SPEAKER_BUFFER_TOGGLE,
          peripheral: !0,
        },
        {
          label: "&#128190;&nbsp; Big Directionals",
          control: b.TOUCH_TOGGLE_DIR_BIG,
          peripheral: !0,
        },
        {
          label: "&#128190;&nbsp; TurboFire Speed",
          control: b.TURBO_FIRE_TOGGLE,
          peripheral: !0,
        },
        {
          label: "&#128190;&nbsp; Haptic Feedback",
          control: b.HAPTIC_FEEDBACK_TOGGLE_MODE,
          peripheral: !0,
        },
      ];
      var c = document.createElement("ul");
      c.classList.add("jt-quick-options-list");
      for (var d = 0; d < j.length; ++d) {
        var e = document.createElement("li"),
          f = document.createElement("div");
        (f.innerHTML = j[d].label), e.appendChild(f);
        var h = document.createElement("div");
        h.classList.add("jt-control"),
          (h.jtControlItem = j[d]),
          e.appendChild(h),
          c.appendChild(e),
          l.push(h);
      }
      i.appendChild(c), g(), a.appendChild(i);
    }
    function g() {
      jt.Util.onTapOrMouseDownWithBlock(i, function (a) {
        if (a.target.jtControlItem) {
          jt.DOMConsoleControls.hapticFeedbackOnTouch(a);
          var c = a.target.jtControlItem;
          c.peripheral
            ? (d.controlActivated(c.control, !1, !1), e())
            : b.processControlState(c.control, !0);
        } else i.focus();
      }),
        i.addEventListener("keydown", function (a) {
          return o.indexOf(a.keyCode) >= 0 && h.hide(), jt.Util.blockEvent(a);
        });
    }
    var h = this;
    (this.show = function () {
      if (!i) return f(), setTimeout(h.show, 0);
      e(),
        (k = !0),
        i.classList.add("jt-show"),
        i.focus(),
        jt.Util.scaleToFitParentHeight(i, a, jt.ScreenGUI.BAR_HEIGHT);
    }),
      (this.hide = function () {
        k &&
          (Javatari.userPreferences.save(),
          i.classList.remove("jt-show"),
          (k = !1),
          Javatari.room.screen.focus());
      }),
      (this.controlsModeStateUpdate = function () {
        k && e();
      }),
      (this.controlStateChanged = function (a, b) {
        !k || (a !== m.NO_COLLISIONS && a !== m.VSYNCH) || e();
      });
    var i,
      j,
      k = !1,
      l = [],
      m = jt.ConsoleControls,
      n = jt.DOMKeys,
      o = [n.VK_ESCAPE.c, n.VK_ENTER.c, n.VK_SPACE.c];
  }),
  (jt.NetPlayDialog = function (a, b) {
    "use strict";
    function c() {
      switch (a.netPlayMode) {
        case 0:
          (o.textContent = "STANDALONE"),
            (m.textContent = "HOST"),
            (n.textContent = "JOIN"),
            (m.disabled = !1),
            (n.disabled = !1),
            (r.disabled = !1),
            (s.disabled = !1),
            k.classList.remove("jt-active"),
            l.classList.remove("jt-disabled"),
            r.setAttribute("placeholder", "Enter a name");
          break;
        case 1:
          var b = a.getNetServer();
          (o.textContent = "HOSTING Session: " + b.getSessionID()),
            (m.textContent = "STOP"),
            (n.textContent = "JOIN"),
            (m.disabled = !1),
            (n.disabled = !0),
            (r.disabled = !0),
            (s.disabled = !0),
            k.classList.add("jt-active"),
            l.classList.add("jt-disabled"),
            r.setAttribute("placeholder", "Automatic"),
            (p.href = e());
          break;
        case 2:
          var c = a.getNetClient();
          (o.textContent = "JOINED Session: " + c.getSessionID()),
            (m.textContent = "HOST"),
            (n.textContent = "LEAVE"),
            (m.disabled = !0),
            (n.disabled = !1),
            (r.disabled = !0),
            (s.disabled = !0),
            k.classList.add("jt-active"),
            l.classList.remove("jt-disabled"),
            l.classList.add("jt-disabled"),
            r.setAttribute("placeholder", "Enter a name"),
            (p.href = e());
          break;
        case -1:
        case -2:
          (o.textContent = "Establishing connection..."),
            (r.disabled = !0),
            (s.disabled = !0),
            k.classList.remove("jt-active"),
            l.classList.add("jt-disabled"),
            -1 === a.netPlayMode
              ? ((m.textContent = "CANCEL"),
                (n.textContent = "JOIN"),
                (m.disabled = !1),
                (n.disabled = !0),
                r.setAttribute("placeholder", "Automatic"))
              : ((m.textContent = "HOST"),
                (n.textContent = "CANCEL"),
                (m.disabled = !0),
                (n.disabled = !1),
                r.setAttribute("placeholder", "Enter a name"));
      }
    }
    function d() {
      (r.value = u.netPlaySessionName), (s.value = u.netPlayNick);
    }
    function e() {
      return (
        jt.Util.browserCurrentURL() + "?JOIN=" + a.netController.getSessionID()
      );
    }
    function f(b) {
      var c = b.target;
      if (!c.disabled) {
        jt.DOMConsoleControls.hapticFeedbackOnTouch(b);
        var d = !1,
          e = a.netPlayMode;
        if (
          (c !== m || (0 !== e && 1 !== e && -1 !== e)
            ? c !== n ||
              (0 !== e && 2 !== e && -2 !== e) ||
              (0 === e
                ? (a.getNetClient().joinSession(r.value, s.value), (d = !0))
                : a
                    .getNetClient()
                    .leaveSession(
                      !1,
                      -2 === e ? "NetPlay connection aborted" : void 0
                    ))
            : 0 === e
            ? (a.getNetServer().startSession(r.value), (d = !0))
            : a
                .getNetServer()
                .stopSession(
                  !1,
                  -1 === e ? "NetPlay connection aborted" : void 0
                ),
          d)
        ) {
          var f = r.value.trim(),
            g = s.value.trim();
          (u.netPlaySessionName === f && u.netPlayNick === g) ||
            ((u.netPlaySessionName = f),
            (u.netPlayNick = g),
            Javatari.userPreferences.setDirty(),
            Javatari.userPreferences.save());
        }
      }
    }
    function g() {
      (j = document.createElement("div")),
        (j.id = "jt-netplay"),
        (j.tabIndex = -1),
        (k = document.createElement("div")),
        (k.id = "jt-netplay-status-box"),
        j.appendChild(k),
        (q = document.createElement("input")),
        (q.id = "jt-netplay-link-text"),
        k.appendChild(q),
        (o = document.createElement("div")),
        (o.id = "jt-netplay-status"),
        (o.textContent = "STANDALONE"),
        k.appendChild(o),
        (p = document.createElement("a")),
        (p.id = "jt-netplay-link"),
        (p.textContent = "🔗"),
        p.setAttribute("title", "Copy Join Session link to clipboard"),
        k.appendChild(p),
        (l = document.createElement("div")),
        (l.id = "jt-netplay-session-box"),
        j.appendChild(l);
      var a = document.createElement("div");
      (a.id = "jt-netplay-session-label"),
        l.appendChild(a),
        (m = document.createElement("button")),
        (m.id = "jt-netplay-start"),
        (m.jtCommand = !0),
        m.classList.add("jt-netplay-button"),
        (m.textContent = "HOST"),
        l.appendChild(m),
        (r = document.createElement("input")),
        (r.id = "jt-netplay-session-name"),
        r.setAttribute("placeholder", "Enter a name"),
        r.setAttribute("maxlength", 12),
        (r.spellcheck = !1),
        (r.autocorrect = !1),
        (r.autocapitalize = !1),
        l.appendChild(r),
        (n = document.createElement("button")),
        (n.id = "jt-netplay-join"),
        (n.jtCommand = !0),
        n.classList.add("jt-netplay-button"),
        (n.textContent = "JOIN"),
        l.appendChild(n);
      var c = document.createElement("div");
      (c.id = "jt-netplay-nick-label"),
        l.appendChild(c),
        (s = document.createElement("input")),
        (s.id = "jt-netplay-nick"),
        s.setAttribute("placeholder", "Automatic"),
        s.setAttribute("maxlength", 12),
        (s.spellcheck = !1),
        (s.autocorrect = !1),
        (s.autocapitalize = !1),
        l.appendChild(s),
        h(),
        b.appendChild(j);
    }
    function h() {
      function b(a) {
        var b = a.target,
          c = b.value;
        return !c || c.match(/^[A-Za-z0-9]+[A-Za-z0-9_\-]*@?$/)
          ? (b.jtLastValidValue = c)
          : (b.value = b.jtLastValidValue || "");
      }
      jt.Util.onTapOrMouseDownWithBlock(j, function (a) {
        a.target.jtCommand ? f(a) : j.focus();
      }),
        j.addEventListener("keydown", function (a) {
          return w.indexOf(a.keyCode) >= 0 && i.hide(), jt.Util.blockEvent(a);
        }),
        r.addEventListener("input", b),
        s.addEventListener("input", b),
        jt.Util.addEventsListener(
          o,
          "touchstart touchmove touchend mousedown mousemove mouseup keydown keyup",
          function (a) {
            a.stopPropagation();
          }
        ),
        jt.Util.addEventsListener(
          r,
          "touchstart touchmove touchend mousedown mousemove mouseup keydown keyup",
          function (a) {
            a.stopPropagation();
          }
        ),
        jt.Util.addEventsListener(
          s,
          "touchstart touchmove touchend mousedown mousemove mouseup keydown keyup",
          function (a) {
            a.stopPropagation();
          }
        ),
        (j.ondragstart = jt.Util.blockEvent),
        k.addEventListener("contextmenu", function (a) {
          a.stopPropagation();
        }),
        jt.Util.addEventsListener(p, "click", function (b) {
          if (
            (jt.Util.blockEvent(b),
            !document.queryCommandSupported ||
              !document.queryCommandSupported("copy"))
          )
            return a.showOSD(
              "Copy to Clipboard not supported by the browser!",
              !0,
              !0
            );
          (q.value = e()),
            q.focus(),
            q.select(),
            document.execCommand("copy"),
            j.focus();
        });
    }
    var i = this;
    (this.show = function () {
      if (!j) return g(), setTimeout(i.show, 0);
      c(),
        d(),
        (t = !0),
        j.classList.add("jt-show"),
        j.focus(),
        jt.Util.scaleToFitParentWidth(j, b, 12);
    }),
      (this.hide = function () {
        t && (j.classList.remove("jt-show"), (t = !1), a.screen.focus());
      }),
      (this.roomNetPlayStatusChangeUpdate = function (b) {
        if ((t && c(), 2 === a.netPlayMode && b < 0 && t))
          return setTimeout(function () {
            i.hide();
          }, 2e3);
        0 === a.netPlayMode && b > 0 && !t && i.show();
      }),
      (this.isVisible = function () {
        return t;
      });
    var j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t = !1,
      u = Javatari.userPreferences.current,
      v = jt.DOMKeys,
      w = [v.VK_ESCAPE.c];
  }),
  (jt.CartridgeFormatDialog = function (a, b, c, d) {
    "use strict";
    function e() {
      (q = 0),
        k.reinsertROMContent(),
        (r = jt.CartridgeCreator.getUserFormatOptionNames(k.rom));
      var a = jt.CartridgeCreator.getBestFormatOption(k.rom);
      a || (a = jt.CartridgeFormats["4K"]), r.unshift(a.name);
      for (var b = 0; b < s.length; ++b)
        b < r.length
          ? (r[b] === p && (q = b),
            (s[b].innerHTML =
              0 === b
                ? "AUTO: " + a.name + ": " + a.desc
                : r[b] + ": " + jt.CartridgeFormats[r[b]].desc),
            s[b].classList.add("jt-visible"))
          : s[b].classList.remove("jt-visible");
      k.format === a && (q = 0), f(), g();
    }
    function f() {
      for (var a, b = 0; b < r.length; ++b)
        b === q
          ? ((a = s[b]), a.classList.add("jt-selected"))
          : s[b].classList.remove("jt-selected");
      m.scrollTop > a.offsetTop
        ? (m.scrollTop = a.offsetTop)
        : m.scrollTop + m.offsetHeight < a.offsetTop + 26 + 2 &&
          (m.scrollTop = a.offsetTop - (m.offsetHeight - 26 - 2));
    }
    function g() {
      (n.textContent = v ? (u ? "YES" : "NO") : "- -"),
        n.classList.toggle("jt-selected", u);
    }
    function h() {
      (l = document.createElement("div")),
        (l.id = "jt-cartridge-format"),
        l.classList.add("jt-select-dialog"),
        (l.style.width = "340px"),
        (l.style.height = "310px"),
        (l.tabIndex = -1);
      var a = document.createTextNode("Select ROM Format");
      l.appendChild(a), (m = document.createElement("ul"));
      for (
        var c = 0, d = jt.CartridgeFormatsUserOptions.length + 1;
        c < d;
        ++c
      ) {
        var e = document.createElement("li");
        (e.jtIndex = c),
          e.classList.add("jt-visible"),
          (e.style.textAlign = "center"),
          s.push(e),
          m.appendChild(e);
      }
      l.appendChild(m);
      var f = document.createElement("div"),
        g = document.createElement("ul");
      g.classList.add("jt-quick-options-list"),
        (e = document.createElement("li"));
      var h = document.createElement("div");
      (h.innerHTML = "&#128190;&nbsp; Remember Choice"),
        e.appendChild(h),
        (n = document.createElement("div")),
        (n.innerHTML = "NO"),
        n.classList.add("jt-control"),
        e.appendChild(n),
        g.appendChild(e),
        f.appendChild(g),
        l.appendChild(f),
        i(),
        b.appendChild(l);
    }
    function i() {
      function a() {
        j.hide(!1);
      }
      function b() {
        j.hide(!0);
      }
      function c(a) {
        (q = a), f();
      }
      jt.Util.onTapOrMouseDownWithBlock(l, function () {
        m.focus();
      }),
        jt.Util.addEventsListener(
          m,
          "touchstart touchmove touchend",
          function (a) {
            a.stopPropagation();
          }
        ),
        jt.Util.addEventsListener(m, "mousedown", function (a) {
          a.stopPropagation(),
            jt.DOMConsoleControls.hapticFeedbackOnTouch(a),
            a.target.jtIndex >= 0 && c(a.target.jtIndex);
        }),
        jt.Util.addEventsListener(m, "click", function (a) {
          if ((jt.Util.blockEvent(a), a.target.jtIndex >= 0)) {
            var d = a.target.jtIndex === q;
            c(a.target.jtIndex), setTimeout(b, d ? 0 : 120);
          }
        }),
        jt.Util.onTapOrMouseDownWithBlock(n, function (a) {
          v && (jt.DOMConsoleControls.hapticFeedbackOnTouch(a), (u = !u), g());
        }),
        l.addEventListener("keydown", function (c) {
          var d = x.codeForKeyboardEvent(c);
          return (
            d === y
              ? a()
              : z.indexOf(d) >= 0
              ? b()
              : A[d] &&
                ((q += A[d]),
                q < 0 ? (q = 0) : q >= r.length && (q = r.length - 1),
                f()),
            jt.Util.blockEvent(c)
          );
        });
    }
    var j = this;
    (this.show = function (a) {
      if (!l)
        return (
          h(),
          setTimeout(function () {
            j.show(a);
          }, 0)
        );
      (o = a),
        (k = d.inserted()) &&
          ((p = k.format.name),
          (u = !!w.getForROM(k.rom)),
          (v = !!k.rom.info.h),
          (t = !0),
          l.classList.add("jt-show"),
          e(),
          l.focus(),
          jt.Util.scaleToFitParentHeight(l, b, jt.ScreenGUI.BAR_HEIGHT));
    }),
      (this.hide = function (b) {
        if (t) {
          if (
            (l.classList.remove("jt-show"),
            (t = !1),
            Javatari.room.screen.focus(),
            b)
          ) {
            var e = r[q],
              f = e === r[0],
              g = jt.CartridgeCreator.changeCartridgeFormat(
                k,
                jt.CartridgeFormats[e]
              );
            u && w.setForROM(k.rom, e, f),
              d.insert(g, !o && c.powerIsOn, !0),
              a.showOSD("ROM Format: " + e + (f ? " (Auto)" : ""), !0);
          }
          k = void 0;
        }
      });
    var k,
      l,
      m,
      n,
      o = !1,
      p = "",
      q = 0,
      r = [],
      s = [],
      t = !1,
      u = !1,
      v = !1,
      w = Javatari.userROMFormats,
      x = jt.DOMKeys,
      y = x.VK_ESCAPE.c,
      z = [x.VK_ENTER.c, x.VK_SPACE.c],
      A = {};
    (A[x.VK_UP.c] = -1), (A[x.VK_DOWN.c] = 1);
  }),
  (jt.SettingsGUI = { WIDTH: 600, HEIGHT: 450 }),
  (jt.SettingsGUI.html = function () {
    return (
      '<div id="jt-modal" tabindex="-1"> <div id="jt-menu"> <div id="jt-back" jt-var="true"> <div class="jt-back-arrow"> </div> </div> <div class="jt-caption"> Help & Settings </div> <div class="jt-items"> <div id="jt-menu-console" class="jt-item" jt-var="true"> CONSOLE </div> <div id="jt-menu-ports" class="jt-item" jt-var="true"> CONTROLLERS </div> <div id="jt-menu-general" class="jt-item jt-selected" jt-var="true"> EMULATION </div> <div id="jt-menu-about" class="jt-item" jt-var="true"> ABOUT </div> <div id="jt-menu-selection" jt-var="true"> </div> </div> </div> <div id="jt-content" jt-var="true"> <div id="jt-console"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F1 </div> </div> <div class="jt-desc"> POWER </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F2 </div> </div> <div class="jt-desc"> TV TYPE </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F4 </div> </div> <div class="jt-desc"> P1 Difficulty </div> </div> </div> <div class="jt-middle"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F5 </div> </div> <div class="jt-desc"> Load Cartridge File </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F6 </div> </div> <div class="jt-desc"> Load Cartridge URL </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F7 </div> </div> <div class="jt-desc"> Remove Cartridge </div> </div> </div> <div class="jt-right"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F12 </div> </div> <div class="jt-desc"> RESET </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F11 </div> </div> <div class="jt-desc"> SELECT </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F9 </div> </div> <div class="jt-desc"> P2 Difficulty </div> </div> </div> <div class="jt-full-divider"></div> <div class="jt-console-panel"> <div class="jt-console-panel-cart-file jt-console-panel-icon"></div> <div class="jt-console-panel-cart-url jt-console-panel-icon"></div> <div class="jt-console-panel-p0-diff-label jt-console-panel-icon"></div> <div class="jt-console-panel-p1-diff-label jt-console-panel-icon"></div> <div class="jt-console-panel-power-labels jt-console-panel-icon"></div> <div class="jt-console-panel-reset-labels jt-console-panel-icon"></div> </div> <div class="jt-footer"> Drag & Drop Files or URLs to load Cartridge ROMs and State Files </div> </div> <div id="jt-ports"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> L </div> </div> <div class="jt-desc">Toggle Paddles</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> K </div> </div> <div class="jt-desc">Toggle Swap Sides</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> J </div> </div> <div class="jt-desc">Toggle Gamepads</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> H </div> </div> <div class="jt-desc">Adjust Turbo Fire speed</div> </div> </div> <div class="jt-right"> <div id="jt-ports-paddles-mode" class="jt-hotkey jt-link jt-joystick-device" jt-var="true">Controllers: JOYSTICKS</div> <div id="jt-ports-p1-mode" class="jt-hotkey jt-link jt-mouse-device" jt-var="true">Swap Mode: NORMAL</div> <div id="jt-ports-gamepads-mode" class="jt-hotkey jt-link jt-joykeys-device" jt-var="true">Gamepads: AUTO (swapped)</div> </div> <div class="jt-full-divider"></div> <div class="jt-player jt-p1"> <div id="jt-control-p1-label" class="jt-title" jt-var="true"> PLAYER 1 </div> <div class="jt-command jt-fire1"> Fire<br> <div id="jt-control-p1-button" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-up"> <div id="jt-control-p1-up-label" jt-var="true"> Up </div> <div id="jt-control-p1-up" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-fire2"> Turbo Fire<br> <div id="jt-control-p1-buttonT" class="jt-key" jt-var="true" > </div> </div> <div class="jt-command jt-left"> Left<br> <div id="jt-control-p1-left" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-controller"> <div id="jt-control-p1-controller" jt-var="true"> </div> </div> <div class="jt-command jt-right"> Right<br> <div id="jt-control-p1-right" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-down"> <div id="jt-control-p1-down-label" jt-var="true"> Down </div> <div id="jt-control-p1-down" class="jt-key" jt-var="true"> </div> </div> </div> <div class="jt-player jt-p2"> <div id="jt-control-p2-label" class="jt-title" jt-var="true"> PLAYER 2 </div> <div class="jt-command jt-fire1"> Fire<br> <div id="jt-control-p2-button" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-up"> <div id="jt-control-p2-up-label" jt-var="true"> Up </div> <div id="jt-control-p2-up" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-fire2"> Turbo Fire<br> <div id="jt-control-p2-buttonT" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-left"> Left<br> <div id="jt-control-p2-left" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-controller"> <div id="jt-control-p2-controller" jt-var="true"> </div> </div> <div class="jt-command jt-right"> Right<br> <div id="jt-control-p2-right" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-down"> <div id="jt-control-p2-down-label" jt-var="true"> Down </div> <div id="jt-control-p2-down" class="jt-key" jt-var="true"> </div> </div> </div> <div id="jt-ports-revert" class="jt-link" jt-var="true"> REVERT </div> <div id="jt-ports-defaults" class="jt-link" jt-var="true"> DEFAULTS </div> </div> <div id="jt-general"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> C </div> </div> <div class="jt-desc">Collisions</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;+&nbsp;<div class="jt-key"> F1 </div> </div> <div class="jt-desc">Fry Console</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Q </div> </div> <div class="jt-desc">NTSC/PAL</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> W </div> </div> <div class="jt-desc">V-Synch Modes</div> </div> <div class="jt-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> R </div> </div> <div class="jt-desc">CRT Modes</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> T </div> </div> <div class="jt-desc">CRT Filters</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> D </div> </div> <div class="jt-desc">Debug Modes</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> I </div> </div> <div class="jt-desc">Show Info</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> G </div> </div> <div class="jt-desc">Capture Screen</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-desc">Right-Click Bar Icons: Default Action</div> </div> </div> <div class="jt-right"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> 0 - 9 </div> </div> <div class="jt-desc">Load State</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;+&nbsp;<div class="jt-key"> 0 - 9 </div> </div> <div class="jt-desc">Save State</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F8 </div> </div> <div class="jt-desc">Save State File</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F12 </div>&nbsp;&nbsp;/&nbsp;&nbsp;<div class="jt-key"> Shift </div>&nbsp;+&nbsp;<div class="jt-key"> F12 </div> </div> <div class="jt-desc">Fast / Slow Speed</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;<div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Adjust Speed</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> P </div> </div> <div class="jt-desc">Toggle Pause</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> O </div>&nbsp;/&nbsp;<div class="jt-key"> F </div> </div> <div class="jt-desc">Next Frame</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Enter </div> </div> <div class="jt-desc">Full Screen</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;<div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Screen Size / Width</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;<div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Viewport Size / Origin</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Backspace </div> </div> <div class="jt-desc">Defaults</div> </div> </div> </div> <div id="jt-about"> <div id="jt-logo-version">version&nbsp' +
      Javatari.VERSION +
      '</div> <div class="jt-info">' +
      atob("Q3JlYXRlZCBieSBQYXVsbyBBdWd1c3RvIFBlY2Npbg==") +
      "<br>" +
      atob(
        "PGEgdGFyZ2V0PSJfYmxhbmsiIGhyZWY9Imh0dHA6Ly9qYXZhdGFyaS5vcmciPmh0dHA6Ly9qYXZhdGFyaS5vcmc8L2E+"
      ) +
      ' </div> <div id="jt-browserinfo" jt-var="true"> </div> </div> </div> </div>'
    );
  }),
  (jt.SettingsGUI.css = function () {
    return (
      "#jt-modal * { outline: none; box-sizing: border-box; } #jt-modal { position: absolute; overflow: hidden; width: " +
      jt.SettingsGUI.WIDTH +
      "px; height: 0; opacity: 0; visibility: hidden; top: 50%; left: 50%; color: hsl(0, 0%, 10%); font: normal 13px sans-serif; white-space: nowrap; text-align: initial; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); transform: scale(0.85); transition: visibility .2s ease-out, opacity .2s ease-out, transform .2s ease-out, height .25s step-end; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; z-index: 50; } #jt-modal.jt-show { transform: scale(1); transition: visibility .2s ease-out, opacity .2s ease-out, transform .2s ease-out; height: " +
      jt.SettingsGUI.HEIGHT +
      'px; visibility: visible; opacity: 1; } #jt-modal .jt-heading { font-weight: 700; color: hsl(0, 0%, 30%); } #jt-modal .jt-link { font-weight: 700; line-height: 21px; color: hsl(228, 90%, 40%); cursor: pointer; } #jt-modal .jt-link:hover { outline: 1px solid; } .jt-command { position: relative; display: inline-block; font-weight: 600; color: hsl(0, 0%, 48%); } .jt-hotkey { height: 27px; padding: 3px 5px; box-sizing: border-box; } .jt-hotkey .jt-desc { display: inline-block; line-height: 21px; } .jt-key { position: relative; display: inline-block; top: -1px; min-width: 25px; height: 21px; padding: 4px 6px 3px; box-sizing: border-box; font-weight: 600; font-size: 12px; line-height: 12px; color: hsl(0, 0%, 42%); background: white; border-radius: 3px; border: 1px solid rgb(210, 210, 210); box-shadow: 0 1px 0 1px hsl(0, 0%, 47%); text-align: center; } .jt-key-fixed { width: 31px; padding-left: 0; padding-right: 2px; } .jt-footer { margin-top: 16px; text-align: center; } #jt-menu { position: relative; background: white; border-bottom: 1px solid hsl(0, 0%, 72%); } #jt-menu #jt-back { position: absolute; width: 40px; height: 34px; margin: 3px 1px; padding: 16px 12px; cursor: pointer; } #jt-menu #jt-back:hover { background: rgba(0, 0, 0, .12); } .jt-back-arrow { display: block; width: 16px; height: 2px; border-radius: 1000px; background: hsl(0, 0%, 98%); } .jt-back-arrow:before { content: ""; display: block; position: absolute; width: 10px; height: 2px; border-radius: inherit; background: inherit; transform: rotate(-45deg); transform-origin: 1px 1px; } .jt-back-arrow:after { content: ""; display: block; position: absolute; width: 10px; height: 2px; border-radius: inherit; background: inherit; transform: rotate(45deg); transform-origin: 1px 1px; } #jt-menu .jt-caption { height: 29px; margin: 0 -1px; padding: 10px 0 0 48px; font-size: 18px; color: white; background: hsl(358, 66%, 50%); box-shadow: 0 1px 3px rgba(0, 0, 0, .9); vertical-align: middle; box-sizing: content-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-menu .jt-items { position: relative; width: 84%; height: 39px; margin: 0 auto; font-weight: 600; } #jt-menu .jt-item { float: left; width: 25%; height: 100%; padding-top: 13px; font-size: 14px; color: rgba(0, 0, 0, .43); text-align: center; cursor: pointer; } #jt-menu .jt-selected { color: hsl(358, 67%, 46%); } #jt-menu #jt-menu-selection { position: absolute; left: 0; bottom: 0; width: 25%; height: 3px; background: hsl(358, 67%, 46%); transition: left 0.3s ease-in-out; } #jt-content { position: relative; left: 0; width: 3000px; height: 371px; background: rgb(218, 218, 218); transition: left 0.3s ease-in-out } #jt-console, #jt-ports, #jt-general, #jt-about { position: absolute; width: ' +
      jt.SettingsGUI.WIDTH +
      "px; height: 100%; box-sizing: border-box; } #jt-console { padding-top: 35px; } #jt-console .jt-hotkey { height: 29px; } #jt-console .jt-command { width: 42px; } #jt-console .jt-left, #jt-console .jt-middle, #jt-console .jt-right { float: left; } #jt-console .jt-left { width: 160px; margin-left: 58px; } #jt-console .jt-middle { width: 204px; } #jt-console .jt-right .jt-command { width: 46px; } #jt-console .jt-console-panel { position: relative; margin: 18px auto 0; box-shadow: rgba(0, 0, 0, 0.6) 2px 2px 4px; } #jt-console .jt-console-panel * { cursor: auto; } #jt-console .jt-footer { margin: 20px auto; } #jt-ports { left: " +
      jt.SettingsGUI.WIDTH +
      'px; padding: 18px 0 0 27px; } #jt-ports > .jt-left { float: left; width: 335px; padding-left: 26px; } #jt-ports > .jt-right { float: left; } #jt-ports .jt-command { width: 91px; } #jt-ports .jt-bottom { width: 546px; text-align: center; } #jt-ports .jt-player { position: absolute; top: 146px; width: 217px; color: rgba(0, 0, 0, .8); } #jt-ports .jt-p1 { left: 47px; } #jt-ports .jt-p2 { right: 47px; } #jt-ports .jt-title { margin-bottom: 09px; font-size: 14px; line-height: 14px; font-weight: bold; color: hsl(0, 0%, 35%); text-align: center; } #jt-ports .jt-player .jt-command { display: block; position: relative; float: left; width: 33%; height: 45px; font-size: 13px; text-align: center; } #jt-ports .jt-command.jt-fire1, #jt-ports .jt-command.jt-fire2 { top: 14px; } #jt-ports .jt-command.jt-left, #jt-ports .jt-command.jt-right { top: 27px; } #jt-ports .jt-command.jt-down { float: none; clear: both; margin: 0 auto; } #jt-ports .jt-command.jt-controller { height: 90px; } #jt-ports #jt-control-p1-controller, #jt-ports #jt-control-p2-controller { width: 70px; height: 89px; margin-left: 1px; background: url("' +
      jt.Images.urls.controllers +
      '") no-repeat -1px 0; background-size: 73px 179px; } #jt-ports .jt-player .jt-key { min-width: 33px; height: 23px; padding: 5px 6px 4px; margin-top: 2px; cursor: pointer; } #jt-ports .jt-player .jt-key:hover { box-shadow: 0 1px 0 1px rgba(0, 0, 0, .5), 1px 2px 6px 4px rgb(170, 170, 170); } #jt-ports .jt-player .jt-key.jt-redefining { color: white; background-color: rgb(87, 128, 255); border-color: rgb(71, 117, 255); } #jt-ports .jt-player .jt-key.jt-undefined { background-color: rgb(255, 150, 130); border-color: rgb(255, 130, 90); } #jt-ports-defaults, #jt-ports-revert { position: absolute; left: 260px; width: 82px; text-align: center; padding: 3px 0 1px; font-size: 12px; } #jt-ports-defaults { bottom: 47px; } #jt-ports-revert { bottom: 21px; } #jt-general { left: ' +
      2 * jt.SettingsGUI.WIDTH +
      "px; padding-top: 18px; padding-left: 34px; } #jt-general .jt-left { float: left; width: 245px; } #jt-general .jt-left .jt-command { width: 99px; } #jt-general .jt-right { float: left; } #jt-general .jt-right .jt-command { width: 160px; } #jt-about { left: " +
      3 * jt.SettingsGUI.WIDTH +
      'px; font-size: 18px; } #jt-about #jt-logo-version { width: 300px; height: 238px; margin: 26px auto 19px; color: hsl(0, 0%, 98%); padding-top: 200px; box-sizing: border-box; text-align: center; background: black url("' +
      jt.Images.urls.logo +
      '") center 18px no-repeat; background-size: 233px 173px; box-shadow: 3px 3px 14px rgb(75, 75, 75); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-about .jt-info { line-height: 30px; text-align: center; } #jt-about a { color: rgb(0, 40, 200); text-decoration: none; } #jt-about a:hover { text-decoration: underline; } #jt-about #jt-browserinfo { position: absolute; left: 0; right: 0; bottom: 7px; font-size: 10px; text-align: center; color: transparent; } .jt-clear { clear: both; } .jt-divider { clear: both; height: 27px; } .jt-full-divider { clear: both; height: 21px; } #jt-general .jt-full-divider { clear: both; height: 18px; }'
    );
  }),
  (jt.SettingsDialog = function (a, b) {
    "use strict";
    function c() {
      jt.Util.insertCSS(jt.SettingsGUI.css()),
        a.insertAdjacentHTML("beforeend", jt.SettingsGUI.html()),
        (j = document.getElementById("jt-modal")),
        delete jt.SettingsGUI.html,
        delete jt.SettingsGUI.css,
        d(),
        e();
    }
    function d() {
      function a(b, c) {
        c(b);
        for (var d = b.childNodes, e = 0; e < d.length; e++) a(d[e], c);
      }
      a(j, function (a) {
        a.id && a.getAttribute && a.getAttribute("jt-var") && (i[a.id] = a);
      });
    }
    function e() {
      jt.Util.onTapOrMouseDownWithBlock(j, function () {
        j.focus();
      }),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-back"], i.hide),
        j.addEventListener("keydown", function (a) {
          h(a, !0);
        }),
        j.addEventListener("keyup", function (a) {
          h(a, !1);
        }),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-menu-console"], function () {
          i.setPage("CONSOLE");
        }),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-menu-ports"], function () {
          i.setPage("PORTS");
        }),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-menu-general"], function () {
          i.setPage("GENERAL");
        }),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-menu-about"], function () {
          i.setPage("ABOUT");
        });
      for (var a in r)
        !(function (a) {
          jt.Util.onTapOrMouseDownWithBlock(i[a], function () {
            k(a);
          });
        })(a);
      jt.Util.onTapOrMouseDownWithBlock(
        i["jt-ports-paddles-mode"],
        function () {
          b.togglePaddleMode();
        }
      ),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-ports-p1-mode"], function () {
          b.toggleP1ControlsMode();
        }),
        jt.Util.onTapOrMouseDownWithBlock(
          i["jt-ports-gamepads-mode"],
          function () {
            b.toggleGamepadMode();
          }
        ),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-ports-defaults"], o),
        jt.Util.onTapOrMouseDownWithBlock(i["jt-ports-revert"], p);
    }
    function f() {
      i["jt-browserinfo"].innerHTML = navigator.userAgent;
    }
    function g() {
      var a = b.isPaddleMode(),
        c = b.isP1ControlsMode();
      (i["jt-ports-paddles-mode"].innerHTML =
        "Controllers: " + (a ? "PADDLES" : "JOYSTICKS")),
        (i["jt-ports-p1-mode"].innerHTML =
          "Swap Mode: " + (c ? "SWAPPED" : "NORMAL")),
        (i["jt-ports-gamepads-mode"].innerHTML =
          "Gamepads: " + b.getGamepadModeDesc()),
        a
          ? ((i["jt-control-p1-controller"].style.backgroundPositionY =
              "-91px"),
            (i["jt-control-p2-controller"].style.backgroundPositionY = "-91px"),
            (i["jt-control-p1-up-label"].innerHTML = i[
              "jt-control-p2-up-label"
            ].innerHTML =
              "+ Speed"),
            (i["jt-control-p1-down-label"].innerHTML = i[
              "jt-control-p2-down-label"
            ].innerHTML =
              "- Speed"))
          : ((i["jt-control-p1-controller"].style.backgroundPositionY = "0"),
            (i["jt-control-p2-controller"].style.backgroundPositionY = "0"),
            (i["jt-control-p1-up-label"].innerHTML = i[
              "jt-control-p2-up-label"
            ].innerHTML =
              "Up"),
            (i["jt-control-p1-down-label"].innerHTML = i[
              "jt-control-p2-down-label"
            ].innerHTML =
              "Down")),
        (i["jt-control-p1-label"].innerHTML = "PLAYER " + (c ? "2" : "1")),
        (i["jt-control-p2-label"].innerHTML = "PLAYER " + (c ? "1" : "2"));
      var d = v.joystickKeys;
      for (var e in r) {
        var f = i[e];
        if (e === s)
          f.classList.add("jt-redefining"),
            f.classList.remove("jt-undefined"),
            (f.innerHTML = "?");
        else {
          f.classList.remove("jt-redefining");
          var g = r[e],
            h = d[g.player][g.control];
          h.c === jt.DOMKeys.VK_VOID.c
            ? (f.classList.add("jt-undefined"), (f.innerHTML = ""))
            : (f.classList.remove("jt-undefined"), (f.innerHTML = h.n));
        }
      }
    }
    function h(a, b) {
      var c = jt.DOMKeys.codeForKeyboardEvent(a);
      if (b && c === w) return n(), jt.Util.blockEvent(a);
      s && m(a);
    }
    var i = this;
    (this.show = function (a) {
      if (!j)
        return (
          c(),
          void setTimeout(function () {
            i.show(a);
          }, 0)
        );
      this.position() &&
        ((s = null),
        this.setPage(a || t),
        j.classList.add("jt-show"),
        j.classList.add("jt-show"),
        (u = !0),
        setTimeout(function () {
          j.focus();
        }, 50));
    }),
      (this.hide = function () {
        u && (i.hideLesser(), Javatari.room.screen.focus());
      }),
      (this.hideLesser = function () {
        Javatari.userPreferences.isDirty && q(),
          j.classList.remove("jt-show"),
          j.classList.remove("jt-show"),
          (u = !1);
      }),
      (this.setPage = function (a) {
        t = a;
        var b = {
            CONSOLE: "0",
            PORTS: "-600px",
            GENERAL: "-1200px",
            ABOUT: "-1800px",
          }[t],
          c = { CONSOLE: "0", PORTS: "25%", GENERAL: "50%", ABOUT: "75%" }[t];
        switch (
          (b && (i["jt-content"].style.left = b),
          c && (i["jt-menu-selection"].style.left = c),
          i["jt-menu-console"].classList.toggle("jt-selected", "CONSOLE" === t),
          i["jt-menu-ports"].classList.toggle("jt-selected", "PORTS" === t),
          i["jt-menu-general"].classList.toggle("jt-selected", "GENERAL" === t),
          i["jt-menu-about"].classList.toggle("jt-selected", "ABOUT" === t),
          t)
        ) {
          case "ABOUT":
            f();
            break;
          case "PORTS":
            g();
        }
      }),
      (this.isVisible = function () {
        return u;
      }),
      (this.position = function () {
        var b = a.clientWidth,
          c = a.clientHeight;
        return b < 575 || c < 400
          ? (this.hide(), !1)
          : ((j.style.top = (((c - jt.SettingsGUI.HEIGHT) / 2) | 0) + "px"),
            (j.style.left = (((b - jt.SettingsGUI.WIDTH) / 2) | 0) + "px"),
            !0);
      }),
      (this.controlsModeStateUpdate = function () {
        u && "PORTS" === t && g();
      });
    var j,
      k = function (a) {
        (s = a), g();
      },
      l = function () {
        (s = null), g();
      },
      m = function (a) {
        if (s) {
          var b = jt.DOMKeys.codeForKeyboardEvent(a),
            c = jt.DOMKeys.nameForKeyboardEventSingle(a);
          if (b !== jt.DOMKeys.VK_VOID.c && c) {
            var d = { c: b, n: c },
              e = r[s],
              f = v.joystickKeys;
            for (var g in r) {
              var h = r[g];
              g !== s &&
                f[h.player][h.control].c === d.c &&
                (f[h.player][h.control] = jt.DOMKeys.VK_VOID);
            }
            (f[e.player][e.control] = d),
              Javatari.userPreferences.setDirty(),
              l();
          }
        }
      },
      n = function () {
        s ? l() : i.hide();
      },
      o = function () {
        Javatari.userPreferences.setDefaultJoystickKeys(), l();
      },
      p = function () {
        Javatari.userPreferences.load(), l();
      },
      q = function () {
        Javatari.userPreferences.save(), b.applyPreferences();
      },
      r = {
        "jt-control-p1-button": { player: 0, control: "button" },
        "jt-control-p1-buttonT": { player: 0, control: "buttonT" },
        "jt-control-p1-up": { player: 0, control: "up" },
        "jt-control-p1-left": { player: 0, control: "left" },
        "jt-control-p1-right": { player: 0, control: "right" },
        "jt-control-p1-down": { player: 0, control: "down" },
        "jt-control-p2-button": { player: 1, control: "button" },
        "jt-control-p2-buttonT": { player: 1, control: "buttonT" },
        "jt-control-p2-up": { player: 1, control: "up" },
        "jt-control-p2-left": { player: 1, control: "left" },
        "jt-control-p2-right": { player: 1, control: "right" },
        "jt-control-p2-down": { player: 1, control: "down" },
      },
      s = null,
      t = "CONSOLE",
      u = !1,
      v = Javatari.userPreferences.current,
      w = jt.DOMKeys.VK_ESCAPE.c;
  }),
  (jt.WebAudioSpeaker = function (a) {
    "use strict";
    function b() {
      return jt.Util.isMobileDevice()
        ? "CHROME" !== jt.Util.browserInfo().name || jt.Util.isIOSDevice()
          ? 3
          : 4
        : 2;
    }
    function c() {
      return "SAFARI" === jt.Util.browserInfo().name || jt.Util.isIOSDevice()
        ? b()
        : 0;
    }
    function d() {
      function b() {
        a.removeEventListener("touchend", b, !0),
          a.removeEventListener("mousedown", b, !0),
          a.removeEventListener("keydown", b, !0);
        var c;
        try {
          k.resume().then(function () {
            jt.Util.log("Speaker Audio Context resumed!");
          });
        } catch (a) {
          c = a;
        }
        var d = k.createBufferSource();
        (d.buffer = k.createBuffer(1, 1, 22050)),
          d.connect(k.destination),
          d.start(0),
          c && jt.Util.log("Audio Context unlocked!"),
          g.speakerUnlockStateUpdate(!0);
      }
      !m ||
        (k.state && "suspended" !== k.state) ||
        (a.addEventListener("touchend", b, !0),
        a.addEventListener("mousedown", b, !0),
        a.addEventListener("keydown", b, !0),
        jt.Util.log("Speaker Audio Context resume event registered"),
        g.speakerUnlockStateUpdate(!1));
    }
    function e() {
      if (m) {
        (n.length = j.length), (o.length = j.length);
        for (var a = 0; a < j.length; a++)
          (n[a] = j[a].getSampleRate() / k.sampleRate),
            (o[a] = 0),
            j[a].setAudioMonitorBufferSize((n[a] * l) | 0);
      }
    }
    function f(a) {
      for (
        var b = a.outputBuffer.getChannelData(0), c = b.length, d = c - 1;
        d >= 0;
        d -= 1
      )
        b[d] = 0;
      if (0 !== j.length)
        for (var e = j.length - 1; e >= 0; e -= 1) {
          for (
            var f = n[e],
              g = j[e].retrieveSamples((c * f + o[e]) | 0, r),
              h = g.buffer,
              i = g.bufferSize,
              k = g.start + o[e],
              l = 0;
            l < c;

          )
            (b[l] += h[0 | k]), (l += 1), (k += f) >= i && (k -= i);
          o[e] = k - (0 | k);
        }
    }
    (this.connect = function (a) {
      a.connectMonitor(this);
    }),
      (this.connectPeripherals = function (a) {
        g = a;
      }),
      (this.connectAudioSignal = function (a) {
        j.indexOf(a) >= 0 || (jt.Util.arrayAdd(j, a), e());
      }),
      (this.disconnectAudioSignal = function (a) {
        j.indexOf(a) < 0 || (jt.Util.arrayRemoveAllElement(j, a), e());
      }),
      (this.powerOn = function () {
        h(), m && (d(), this.unpause());
      }),
      (this.powerOff = function () {
        this.pause(), k && k.close(), (k = m = void 0);
      }),
      (this.mute = function () {
        r = !0;
      }),
      (this.unMute = function () {
        r = !1;
      }),
      (this.pause = function () {
        m && m.disconnect();
      }),
      (this.unpause = function () {
        m && m.connect(k.destination);
      }),
      (this.toggleBufferBaseSize = function () {
        if (!k) return g.showOSD("Audio is DISABLED", !0, !0);
        (q = ((q + 2) % 8) - 1),
          this.pause(),
          i(),
          this.unpause(),
          g.showOSD(
            "Audio Buffer size: " +
              (-1 === q
                ? "Auto (" + l + ")"
                : 0 === q
                ? "Browser (" + l + ")"
                : l),
            !0
          ),
          (p.audioBufferBase = q),
          Javatari.userPreferences.setDirty();
      }),
      (this.getControlReport = function (a) {
        return {
          label: -2 === q ? "OFF" : -1 === q ? "Auto" : 0 === q ? "Browser" : l,
          active: q > 0,
        };
      });
    var g,
      h = function () {
        if (-2 === q || 0 === Javatari.AUDIO_MONITOR_BUFFER_SIZE)
          return void jt.Util.warning("Audio disabled in configuration");
        try {
          var a =
            window.AudioContext ||
            window.webkitAudioContext ||
            window.WebkitAudioContext;
          if (!a) throw new Error("WebAudio API not supported by the browser");
          (k = new a()),
            jt.Util.log(
              "Speaker AudioContext created. Sample rate: " +
                k.sampleRate +
                (k.state ? ", " + k.state : "")
            ),
            i();
        } catch (a) {
          jt.Util.error("Could not create AudioContext. Audio DISABLED!\n" + a);
        }
      },
      i = function () {
        try {
          var a = -1 === q ? b() : 0 === q ? c() : q,
            d =
              Javatari.AUDIO_MONITOR_BUFFER_SIZE > 0
                ? Javatari.AUDIO_MONITOR_BUFFER_SIZE
                : a > 0
                ? jt.Util.exp2(
                    0 | jt.Util.log2((k.sampleRate + 14e3) / 22050)
                  ) *
                  jt.Util.exp2(a - 1) *
                  256
                : 0;
          (m = k.createScriptProcessor(d, 1, 1)),
            (m.onaudioprocess = f),
            (l = m.bufferSize),
            e(),
            jt.Util.log("Audio Processor buffer size: " + m.bufferSize);
        } catch (a) {
          jt.Util.error(
            "Could not create ScriptProcessorNode. Audio DISABLED!\n" + a
          );
        }
      },
      j = [];
    this.signals = j;
    var k,
      l,
      m,
      n = [],
      o = [],
      p = Javatari.userPreferences.current,
      q =
        -3 === Javatari.AUDIO_MONITOR_BUFFER_BASE
          ? p.audioBufferBase
          : Javatari.AUDIO_MONITOR_BUFFER_BASE,
      r = !1;
  }),
  (jt.LocalStorageSaveStateMedia = function (a) {
    "use strict";
    function b() {
      return 2 === a.netPlayMode;
    }
    (this.connect = function (a) {
      a.connectMedia(this);
    }),
      (this.connectPeripherals = function (a) {
        c = a;
      }),
      (this.isSlotUsed = function (a) {
        return void 0 !== localStorage["javatarisave" + a];
      }),
      (this.saveState = function (a, b) {
        var c = f(b);
        return c && d("save" + a, c);
      }),
      (this.loadState = function (a) {
        var b = e("save" + a);
        return g(b);
      }),
      (this.saveStateFile = function (a, d) {
        if (!b()) {
          var e = f(d);
          e &&
            c.startDownloadBinary(
              (a || "Javatari SaveState") + j,
              e,
              "System State file"
            );
        }
      }),
      (this.loadStateFile = function (a) {
        if (!b()) return g(a);
      }),
      (this.saveResource = function (a, b) {
        try {
          var c = b && JSON.stringify(b);
          return d("res" + a, c);
        } catch (a) {}
      }),
      (this.loadResource = function (a) {
        try {
          var b = e("res" + a);
          return b && JSON.parse(b);
        } catch (a) {}
      }),
      (this.externalStateChange = function () {
        1 === a.netPlayMode && a.netController.processExternalStateChange();
      });
    var c,
      d = function (a, c) {
        if (b()) return !0;
        try {
          return (localStorage["javatari" + a] = c), !0;
        } catch (a) {
          return jt.Util.error(a), !1;
        }
      },
      e = function (a) {
        if (!b())
          try {
            return localStorage["javatari" + a];
          } catch (a) {
            jt.Util.warning(a);
          }
      },
      f = function (a) {
        try {
          return h + JSON.stringify(a);
        } catch (a) {
          jt.Util.error(a);
        }
      },
      g = function (a) {
        try {
          var b;
          if (
            (b =
              "string" == typeof a
                ? a.substr(0, h.length)
                : jt.Util.int8BitArrayToByteString(a, 0, h.length)) !== h &&
            b !== i
          )
            return;
          var c;
          return (
            (c =
              "string" == typeof a
                ? a.slice(h.length)
                : jt.Util.int8BitArrayToByteString(a, h.length)) &&
            JSON.parse(c)
          );
        } catch (a) {
          jt.Util.error(a);
        }
      },
      h = String.fromCharCode(0, 0) + "javataristate!",
      i = "javatarijsstate!",
      j = ".jst";
  }),
  (jt.PeripheralControls = {
    SCREEN_ASPECT_PLUS: 1,
    SCREEN_ASPECT_MINUS: 2,
    SCREEN_SCALE_PLUS: 3,
    SCREEN_SCALE_MINUS: 4,
    VIEWPORT_ORIGIN_PLUS: 5,
    VIEWPORT_ORIGIN_MINUS: 6,
    VIEWPORT_SIZE_PLUS: 7,
    VIEWPORT_SIZE_MINUS: 8,
    SCREEN_FULLSCREEN: 10,
    SCREEN_CRT_FILTER: 11,
    SCREEN_CRT_MODE: 12,
    SCREEN_TOGGLE_MENU: 13,
    SCREEN_OPEN_HELP: 14,
    SCREEN_OPEN_ABOUT: 15,
    SCREEN_OPEN_SETTINGS: 16,
    SCREEN_OPEN_QUICK_OPTIONS: 17,
    SCREEN_DEFAULTS: 18,
    SCREEN_CONSOLE_PANEL_TOGGLE: 19,
    SPEAKER_BUFFER_TOGGLE: 20,
    CONSOLE_POWER_TOGGLE: 102,
    CONSOLE_POWER_FRY: 103,
    CONSOLE_LOAD_STATE_FILE: 104,
    CONSOLE_SAVE_STATE_FILE: 105,
    CONSOLE_LOAD_STATE_MENU: 106,
    CONSOLE_SAVE_STATE_MENU: 107,
    P1_CONTROLS_TOGGLE: 201,
    JOYSTICKS_TOGGLE_MODE: 202,
    PADDLES_TOGGLE_MODE: 203,
    TOUCH_TOGGLE_MODE: 204,
    TOUCH_TOGGLE_DIR_BIG: 205,
    TURBO_FIRE_TOGGLE: 206,
    HAPTIC_FEEDBACK_TOGGLE_MODE: 207,
    CAPTURE_SCREEN: 304,
    CARTRIDGE_LOAD_RECENT: 40,
    CARTRIDGE_LOAD_FILE: 41,
    CARTRIDGE_LOAD_URL: 42,
    CARTRIDGE_REMOVE: 43,
    CARTRIDGE_LOAD_DATA_FILE: 44,
    CARTRIDGE_SAVE_DATA_FILE: 45,
    CARTRIDGE_CHOOSE_FORMAT: 46,
    AUTO_LOAD_FILE: 47,
    AUTO_LOAD_URL: 48,
    SCREEN_OPEN_NETPLAY: 500,
  }),
  (jt.DOMPeripheralControls = function (a) {
    "use strict";
    var b = this;
    (this.connect = function (a) {
      i = a;
    }),
      (this.connectPeripherals = function (a, b, c, i) {
        (d = a), (f = b), (e = a.getMonitor()), (g = c), (h = i);
      }),
      (this.getControlReport = function (a) {
        switch (a) {
          case k.PADDLES_TOGGLE_MODE:
          case k.P1_CONTROLS_TOGGLE:
          case k.TURBO_FIRE_TOGGLE:
          case k.TOUCH_TOGGLE_DIR_BIG:
          case k.HAPTIC_FEEDBACK_TOGGLE_MODE:
            return g.getControlReport(a);
          case k.SCREEN_CRT_FILTER:
            return d.getControlReport(a);
          case k.SPEAKER_BUFFER_TOGGLE:
            return f.getControlReport(a);
        }
        return { label: "Unknown", active: !1 };
      }),
      (this.processKey = function (a, c) {
        if (!c) return !1;
        var d = l[a] || l[a & m];
        return !!d && (b.controlActivated(d, !!(a & n), !1), !0);
      }),
      (this.controlActivated = function (b, j, l) {
        if (2 === a.netPlayMode && N.has(b))
          return a.showOSD(
            "Function not available in NetPlay Client mode",
            !0,
            !0
          );
        switch (b) {
          case k.CONSOLE_POWER_TOGGLE:
            g.processControlState(jt.ConsoleControls.POWER, !0);
            break;
          case k.CONSOLE_POWER_FRY:
            g.processControlState(jt.ConsoleControls.POWER_FRY, !0);
            break;
          case k.CONSOLE_LOAD_STATE_FILE:
            h.openFileChooserDialog(o.STATE, !1, !1, !1);
            break;
          case k.CONSOLE_SAVE_STATE_FILE:
            g.processControlState(jt.ConsoleControls.SAVE_STATE_FILE, !0);
            break;
          case k.CONSOLE_LOAD_STATE_MENU:
            d.openSaveStateDialog(!1);
            break;
          case k.CONSOLE_SAVE_STATE_MENU:
            d.openSaveStateDialog(!0);
            break;
          case k.CARTRIDGE_LOAD_RECENT:
            c() || d.openCartridgeChooserDialog(!1, j, l);
            break;
          case k.CARTRIDGE_LOAD_FILE:
            c() || h.openFileChooserDialog(o.ROM, j, l, !1);
            break;
          case k.CARTRIDGE_LOAD_URL:
            c() || h.openURLChooserDialog(o.ROM, j, l);
            break;
          case k.CARTRIDGE_REMOVE:
            c() || i.insert(null, !1);
            break;
          case k.CARTRIDGE_LOAD_DATA_FILE:
          case k.CARTRIDGE_SAVE_DATA_FILE:
            break;
          case k.CARTRIDGE_CHOOSE_FORMAT:
            c() || d.openCartridgeFormatDialog(j);
            break;
          case k.AUTO_LOAD_FILE:
            c() || h.openFileChooserDialog(o.AUTO, j, l, !1);
            break;
          case k.AUTO_LOAD_URL:
            c() || h.openURLChooserDialog(o.AUTO, j, l, !1);
            break;
          case k.SCREEN_CRT_MODE:
            e.crtModeToggle();
            break;
          case k.SCREEN_CRT_FILTER:
            e.crtFilterToggle();
            break;
          case k.SCREEN_FULLSCREEN:
            e.fullscreenToggle();
            break;
          case k.SCREEN_DEFAULTS:
            g.processControlState(jt.ConsoleControls.DEFAULTS, !0),
              e.setDefaults();
            break;
          case k.SCREEN_TOGGLE_MENU:
            d.toggleMenuByKey();
            break;
          case k.SCREEN_OPEN_HELP:
            d.openHelp();
            break;
          case k.SCREEN_OPEN_ABOUT:
            d.openAbout();
            break;
          case k.SCREEN_OPEN_SETTINGS:
            if (j) return this.controlActivated(k.SCREEN_DEFAULTS);
            d.openSettings();
            break;
          case k.SCREEN_OPEN_QUICK_OPTIONS:
            d.openQuickOptionsDialog();
            break;
          case k.SCREEN_CONSOLE_PANEL_TOGGLE:
            d.toggleConsolePanel();
            break;
          case k.SCREEN_OPEN_NETPLAY:
            d.openNetPlayDialog();
            break;
          case k.P1_CONTROLS_TOGGLE:
            g.toggleP1ControlsMode();
            break;
          case k.JOYSTICKS_TOGGLE_MODE:
            g.toggleGamepadMode();
            break;
          case k.PADDLES_TOGGLE_MODE:
            g.togglePaddleMode();
            break;
          case k.TOUCH_TOGGLE_MODE:
            g.toggleTouchControlsMode();
            break;
          case k.TOUCH_TOGGLE_DIR_BIG:
            g.toggleTouchDirBig();
            break;
          case k.TURBO_FIRE_TOGGLE:
            g.toggleTurboFireSpeed();
            break;
          case k.HAPTIC_FEEDBACK_TOGGLE_MODE:
            g.toggleHapticFeedback();
            break;
          case k.CAPTURE_SCREEN:
            d.saveScreenCapture();
            break;
          case k.SPEAKER_BUFFER_TOGGLE:
            f.toggleBufferBaseSize();
            break;
          case k.VIEWPORT_ORIGIN_MINUS:
            e.viewportOriginDecrease();
            break;
          case k.VIEWPORT_ORIGIN_PLUS:
            e.viewportOriginIncrease();
        }
        if (!M)
          switch (b) {
            case k.SCREEN_ASPECT_MINUS:
              e.displayAspectDecrease();
              break;
            case k.SCREEN_ASPECT_PLUS:
              e.displayAspectIncrease();
              break;
            case k.SCREEN_SCALE_MINUS:
              e.displayScaleDecrease();
              break;
            case k.SCREEN_SCALE_PLUS:
              e.displayScaleIncrease();
              break;
            case k.VIEWPORT_SIZE_MINUS:
              e.viewportSizeDecrease();
              break;
            case k.VIEWPORT_SIZE_PLUS:
              e.viewportSizeIncrease();
          }
      });
    var c = function () {
      return Javatari.CARTRIDGE_CHANGE_DISABLED
        ? (e.showOSD("Cartridge change is disabled!", !0, !0), !0)
        : 2 === a.netPlayMode &&
            (e.showOSD(
              "Cartridge change is disabled in NetPlay Client mode!",
              !0,
              !0
            ),
            !0);
    };
    this.mediaChangeDisabledWarning = c;
    var d,
      e,
      f,
      g,
      h,
      i,
      j = function () {
        var a = jt.DOMKeys;
        (l[x] = k.CARTRIDGE_LOAD_RECENT),
          (l[x | a.ALT] = k.CARTRIDGE_LOAD_RECENT),
          (l[y] = k.AUTO_LOAD_URL),
          (l[y | a.ALT] = k.AUTO_LOAD_URL),
          (l[z] = k.CARTRIDGE_REMOVE),
          (l[z | a.ALT] = k.CARTRIDGE_REMOVE),
          (l[L] = k.CONSOLE_SAVE_STATE_FILE),
          (l[L | a.ALT] = k.CONSOLE_SAVE_STATE_FILE),
          (l[A | a.ALT] = k.P1_CONTROLS_TOGGLE),
          (l[C | a.ALT] = k.PADDLES_TOGGLE_MODE),
          (l[B | a.ALT] = k.JOYSTICKS_TOGGLE_MODE),
          (l[D | a.ALT] = k.TOUCH_TOGGLE_MODE),
          (l[E | a.ALT] = k.TURBO_FIRE_TOGGLE),
          (l[G | a.ALT] = k.SCREEN_CRT_FILTER),
          (l[F | a.ALT] = k.SCREEN_CRT_MODE),
          (l[H | a.ALT] = k.SCREEN_OPEN_SETTINGS),
          (l[I | a.ALT] = k.SCREEN_OPEN_QUICK_OPTIONS),
          (l[J | a.ALT] = k.SCREEN_CONSOLE_PANEL_TOGGLE),
          (l[K | a.ALT] = k.SCREEN_FULLSCREEN),
          (l[q | a.CONTROL | a.ALT] = k.SCREEN_SCALE_MINUS),
          (l[s | a.CONTROL | a.ALT] = k.SCREEN_SCALE_PLUS),
          (l[p | a.CONTROL | a.ALT] = k.SCREEN_ASPECT_MINUS),
          (l[r | a.CONTROL | a.ALT] = k.SCREEN_ASPECT_PLUS),
          (l[q | a.SHIFT | a.CONTROL] = k.VIEWPORT_ORIGIN_MINUS),
          (l[s | a.SHIFT | a.CONTROL] = k.VIEWPORT_ORIGIN_PLUS),
          (l[p | a.SHIFT | a.CONTROL] = k.VIEWPORT_SIZE_MINUS),
          (l[r | a.SHIFT | a.CONTROL] = k.VIEWPORT_SIZE_PLUS),
          (l[t] = k.SCREEN_TOGGLE_MENU),
          (l[u] = k.SCREEN_DEFAULTS),
          (l[u | a.ALT] = k.SCREEN_DEFAULTS),
          (l[v | a.ALT] = k.CAPTURE_SCREEN),
          (l[w | a.ALT] = k.SPEAKER_BUFFER_TOGGLE);
      },
      k = jt.PeripheralControls,
      l = {},
      m = ~jt.DOMKeys.SHIFT,
      n = jt.DOMKeys.SHIFT,
      o = jt.FileLoader.OPEN_TYPE,
      p = jt.DOMKeys.VK_LEFT.c,
      q = jt.DOMKeys.VK_UP.c,
      r = jt.DOMKeys.VK_RIGHT.c,
      s = jt.DOMKeys.VK_DOWN.c,
      t = jt.DOMKeys.VK_CONTEXT.c,
      u = jt.DOMKeys.VK_BACKSPACE.c,
      v = jt.DOMKeys.VK_G.c,
      w = jt.DOMKeys.VK_A.c,
      x = jt.DOMKeys.VK_F5.c,
      y = jt.DOMKeys.VK_F6.c,
      z = jt.DOMKeys.VK_F7.c,
      A = jt.DOMKeys.VK_K.c,
      B = jt.DOMKeys.VK_J.c,
      C = jt.DOMKeys.VK_L.c,
      D = jt.DOMKeys.VK_N.c,
      E = jt.DOMKeys.VK_H.c,
      F = jt.DOMKeys.VK_R.c,
      G = jt.DOMKeys.VK_T.c,
      H = jt.DOMKeys.VK_Y.c,
      I = jt.DOMKeys.VK_U.c,
      J = jt.DOMKeys.VK_S.c,
      K = jt.DOMKeys.VK_ENTER.c,
      L = (jt.DOMKeys.VK_F1.c, jt.DOMKeys.VK_F8.c),
      M = Javatari.SCREEN_RESIZE_DISABLED,
      N = new Set([
        k.CONSOLE_POWER_FRY,
        k.CONSOLE_LOAD_STATE_FILE,
        k.CONSOLE_SAVE_STATE_FILE,
        k.CONSOLE_LOAD_STATE_MENU,
        k.CONSOLE_SAVE_STATE_MENU,
        k.CARTRIDGE_LOAD_RECENT,
        k.CARTRIDGE_LOAD_FILE,
        k.CARTRIDGE_LOAD_URL,
        k.CARTRIDGE_REMOVE,
        k.CARTRIDGE_LOAD_DATA_FILE,
        k.CARTRIDGE_SAVE_DATA_FILE,
        k.AUTO_LOAD_FILE,
        k.AUTO_LOAD_URL,
      ]);
    !(function () {
      j();
    })();
  }),
  (jt.NetServer = function (a) {
    "use strict";
    function b() {
      void 0 === v && (v = setInterval(p, 3e4));
      var a = {
        sessionControl: "createSession",
        sessionType: "javatari",
        wsOnly: D,
        queryVariables: ["RTC_CONFIG", "RTC_DATA_CHANNEL_CONFIG"],
      };
      u && (a.sessionID = u), s.send(JSON.stringify(a));
    }
    function c() {
      r.stopSession(
        !0,
        v
          ? "NetPlay Session stopped: Connection lost"
          : "NetPlay: Connection error"
      );
    }
    function d(a) {
      var b = JSON.parse(a.data);
      if (b.javatariUpdate) return o(b.javatariUpdate);
      if (b.sessionControl)
        switch (b.sessionControl) {
          case "sessionCreated":
            return void e(b);
          case "clientJoined":
            return void f(b);
          case "clientLeft":
            return void g(b);
          case "createError":
            return void r.stopSession(!0, "NetPlay: " + b.errorMessage);
        }
      else b.clientSDP && h(b);
    }
    function e(b) {
      try {
        w = JSON.parse(b.queriedVariables.RTC_CONFIG || "{}");
      } catch (a) {}
      try {
        x = JSON.parse(b.queriedVariables.RTC_DATA_CHANNEL_CONFIG || "{}");
      } catch (a) {}
      (t = b.sessionID),
        z.netClearControlsToSend(),
        a.enterNetServerMode(r),
        a.showOSD('NetPlay session "' + b.sessionID + '" started', !0),
        jt.Util.log('NetPlay session "' + b.sessionID + '" started');
    }
    function f(b) {
      var c = { nick: b.clientNick, justJoined: !0, wsOnly: D || !!b.wsOnly };
      if (
        ((C[c.nick] = c),
        a.showOSD('NetPlay client "' + c.nick + '" joined', !0),
        jt.Util.log('NetPlay client "' + c.nick + '" joined'),
        !c.wsOnly)
      ) {
        var d = new RTCPeerConnection(w);
        (c.rtcConnection = d),
          (d.onicecandidate = function (a) {
            a.candidate ||
              (jt.Util.log(
                "Server SDP for client " + c.nick + ":",
                d.localDescription
              ),
              s.send(
                JSON.stringify({
                  toClientNick: c.nick,
                  serverSDP: d.localDescription,
                })
              ));
          });
        var e = d.createDataChannel("dataChannel", x);
        (c.dataChannel = e),
          (e.onopen = function (a) {
            i(c, a);
          }),
          (e.onclose = function (a) {
            j(c, a);
          }),
          (e.onmessage = function (a) {
            k(c, a);
          }),
          d
            .createOffer()
            .then(function (a) {
              return d.setLocalDescription(a);
            })
            .catch(function (a) {
              l(c, a);
            });
      }
    }
    function g(a) {
      var b = C[a.clientNick];
      b && n(b, !0, !1, 'NetPlay client "' + b.nick + '" left');
    }
    function h(a) {
      var b = C[a.fromClientNick];
      b &&
        (jt.Util.log("Client SDP from client " + b.nick + ":", a.clientSDP),
        b.rtcConnection
          .setRemoteDescription(new RTCSessionDescription(a.clientSDP))
          .catch(l));
    }
    function i(a, b) {
      jt.Util.log("Client " + a.nick + " dataChannel open"),
        (a.dataChannelActive = !0);
    }
    function j(a, b) {
      jt.Util.error("NetPlay Client " + a.nick + " dataChannel closed"),
        n(
          a,
          !0,
          !0,
          'NetPlay client "' + a.nick + '" dropped: P2P connection lost'
        );
    }
    function k(a, b) {
      o(JSON.parse(b.data));
    }
    function l(a, b) {
      jt.Util.error("NetPlay Client " + a.nick + " RTC error:", b),
        n(
          a,
          !0,
          !0,
          'NetPlay client "' + a.nick + '" dropped: P2P connection error'
        );
    }
    function m() {
      for (var a in C) n(C[a], !1);
    }
    function n(b, c, d, e) {
      c &&
        (a.showOSD(e || 'NetPlay client "' + b.nick + '" left', !0, d),
        (d ? jt.Util.error : jt.Util.log)(
          e || 'NetPlay client "' + b.nick + '" left'
        )),
        b.dataChannel &&
          ((b.dataChannel.onopen =
            b.dataChannel.onclose =
            b.dataChannel.onmessage =
              void 0),
          b.dataChannel.close()),
        b.rtcConnection &&
          ((b.rtcConnection.onicecandidate = void 0), b.rtcConnection.close()),
        delete C[b.nick];
    }
    function o(a) {
      a.c && z.netServerProcessControlsChanges(a.c);
    }
    function p() {
      try {
        s.send('{ "sessionControl": "keep-alive" }');
      } catch (a) {
        jt.Util.error("NetPlay error sending keep-alive"),
          r.stopSession(!0, "NetPlay Session stopped: connection error");
      }
    }
    function q(a, b) {
      var c = b.length;
      if (c < E) return a.send(b);
      for (var d = 0, e = 0; ; ) {
        var f = b.substr(e, F);
        if (((e += F), d++, !(e < c))) return void a.send(H + f);
        a.send(G + f);
      }
    }
    var r = this;
    (this.startSession = function (e) {
      u = e ? ("" + e).trim() : void 0;
      var f;
      u && "@" === u[u.length - 1]
        ? ((u = u.substr(0, u.length - 1)), (f = !0))
        : (f = !1),
        (u && t === u && D === f) ||
          (t && this.stopSession(!0),
          a.enterNetPendingMode(this),
          (D = f),
          s
            ? b()
            : ((s = new WebSocket("wss://" + Javatari.SERVER_ADDRESS)),
              (s.onmessage = d),
              (s.onopen = b),
              (s.onclose = c)));
    }),
      (this.stopSession = function (b, c) {
        clearInterval(v),
          (v = void 0),
          s &&
            ((s.onmessage = s.onopen = s.onclose = void 0),
            s.close(),
            (s = void 0)),
          b ? m() : setTimeout(m, 300),
          a.showOSD(c || 'NetPlay Session "' + t + '" stopped', !0, b),
          (b ? jt.Util.error : jt.Util.log)(
            c || 'NetPlay Session "' + t + '" stopped'
          ),
          (t = void 0),
          a.enterStandaloneMode();
      }),
      (this.getSessionID = function () {
        return t;
      }),
      (this.netVideoClockPulse = function () {
        y.getConsoleControlsSocket().controlsClockPulse();
        var b = y.videoClockPulseGetNextPulldowns();
        y.videoClockPulseApplyPulldowns(b);
        var c, d, e;
        for (var f in C) {
          var g = C[f];
          if (g.wsOnly || g.dataChannelActive) {
            if (g.justJoined || B) {
              if (((g.justJoined = !1), !d)) {
                var h = {
                  s: y.saveState(!0),
                  cm: {
                    p1: a.consoleControls.isP1ControlsMode(),
                    pd: a.consoleControls.isPaddleMode(),
                  },
                };
                d = JSON.stringify(h);
              }
              c = d;
            } else
              e ||
                ((A.c = z.netGetControlsToSend()),
                (A.v = b),
                (e = JSON.stringify(A))),
                (c = e);
            try {
              g.dataChannelActive
                ? q(g.dataChannel, c)
                : s.send(
                    JSON.stringify({ toClientNick: g.nick, javatariUpdate: c })
                  );
            } catch (a) {
              n(
                g,
                !0,
                !0,
                'NetPlay client "' +
                  g.nick +
                  '" dropped: P2P error sending data'
              );
            }
          }
        }
        (B = !1), z.netClearControlsToSend();
      }),
      (this.processExternalStateChange = function () {
        B = !0;
      });
    var s,
      t,
      u,
      v,
      w,
      x,
      y = a.console,
      z = a.consoleControls,
      A = { v: 0, c: void 0 },
      B = !1,
      C = {},
      D = !1,
      E = 16300,
      F = 16200,
      G = "#@FrgS@#",
      H = "#@FrgE@#";
  }),
  (jt.NetClient = function (a) {
    "use strict";
    function b() {
      void 0 === v && (v = setInterval(n, 3e4)),
        q.send(
          JSON.stringify({
            sessionControl: "joinSession",
            sessionType: "javatari",
            sessionID: s,
            clientNick: u,
            wsOnly: B,
            queryVariables: ["RTC_CONFIG"],
          })
        );
    }
    function c() {
      p.leaveSession(
        !0,
        v
          ? "NetPlay session ended: Connection lost"
          : "NetPlay: Connection error"
      );
    }
    function d(a) {
      var b = JSON.parse(a.data);
      if (b.javatariUpdate) return m(JSON.parse(b.javatariUpdate));
      if (b.sessionControl)
        switch (b.sessionControl) {
          case "sessionJoined":
            return void e(b);
          case "sessionDestroyed":
            return void p.leaveSession(!1, 'NetPlay Session "' + r + '" ended');
          case "joinError":
            return void p.leaveSession(!0, "NetPlay: " + b.errorMessage);
        }
      else b.serverSDP && g(b);
    }
    function e(a) {
      if (
        ((r = a.sessionID),
        (t = a.clientNick),
        (D = B || a.wsOnly),
        (C = !0),
        D)
      )
        return f();
      try {
        w = JSON.parse(a.queriedVariables.RTC_CONFIG || "{}");
      } catch (a) {}
      (x = new RTCPeerConnection(w)),
        (x.onicecandidate = function (a) {
          a.candidate ||
            q.send(JSON.stringify({ clientSDP: x.localDescription }));
        }),
        (x.ondatachannel = function (a) {
          (y = a.channel), (y.onopen = h), (y.onclose = i), (y.onmessage = j);
        });
    }
    function f() {
      a.showOSD('NetPlay Session "' + r + '" joined as "' + t + '"', !0),
        jt.Util.log('NetPlay Session "' + r + '" joined as "' + t + '"'),
        A.netClearControlsToSend(),
        a.enterNetClientMode(p);
    }
    function g(a) {
      x.setRemoteDescription(new RTCSessionDescription(a.serverSDP))
        .then(function () {
          return x.createAnswer();
        })
        .then(function (a) {
          return x.setLocalDescription(a);
        })
        .catch(k);
    }
    function h(a) {
      (E = !0), (F = ""), f();
    }
    function i(a) {
      jt.Util.error("NetPlay dataChannel closed"),
        p.leaveSession(!0, "NetPlay session ended: P2P connection lost");
    }
    function j(a) {
      var b = o(a);
      b && m(JSON.parse(b));
    }
    function k(a) {
      jt.Util.error("NetPlay RTC error:", a),
        p.leaveSession(!0, "NetPlay session ended: P2P connection error");
    }
    function l() {
      y &&
        ((y.onpen = y.onclose = y.onmessage = void 0), y.close(), (y = void 0)),
        x &&
          ((x.onicecandidate = x.ondatachannel = void 0),
          x.close(),
          (x = void 0));
    }
    function m(b) {
      b.s
        ? (z.loadState(b.s),
          C &&
            (a.consoleControls.setP1ControlsAndPaddleMode(!b.cm.p1, b.cm.pd),
            (C = !1)))
        : (b.c && A.netClientApplyControlsChanges(b.c),
          z.videoClockPulseApplyPulldowns(b.v)),
        z.getConsoleControlsSocket().controlsClockPulse();
      var c = {
        c: A.netGetControlsToSend(),
      };
      E
        ? y.send(JSON.stringify(c))
        : q.send(JSON.stringify({ javatariUpdate: c })),
        A.netClearControlsToSend();
    }
    function n() {
      try {
        q.send('{ "sessionControl": "keep-alive" }');
      } catch (a) {
        jt.Util.error("NetPlay error sending keep-alive"),
          p.leaveSession(!0, "NetPlay session ended: Connection error");
      }
    }
    function o(a) {
      var b = a.data,
        c = b.substr(0, 8);
      return c !== G && c !== H
        ? ((F = ""), b)
        : ((F += b.substr(8)), c === H ? ((b = F), (F = ""), b) : void 0);
    }
    var p = this;
    (this.joinSession = function (e, f) {
      if (!(s = ("" + e).trim()))
        return a.showOSD(
          "Must enter Session Name for joining NetPlay session",
          !0,
          !0
        );
      var g;
      "@" === s[s.length - 1]
        ? ((s = s.substr(0, s.length - 1)), (g = !0))
        : (g = !1),
        (u = f),
        (B = g),
        (r === s && t === u && D === B) ||
          (r && this.leaveSession(!0),
          a.enterNetPendingMode(this),
          q
            ? b()
            : ((q = new WebSocket("wss://" + Javatari.SERVER_ADDRESS)),
              (q.onmessage = d),
              (q.onopen = b),
              (q.onclose = c)));
    }),
      (this.leaveSession = function (b, c) {
        clearInterval(v),
          (v = void 0),
          (r = t = void 0),
          (D = !1),
          q &&
            ((q.onpen = q.onclose = q.onmessage = void 0),
            q.close(),
            (q = void 0)),
          y && (y.onpen = y.onclose = y.onmessage = void 0),
          x && (x.onicecandidate = x.ondatachannel = void 0),
          (E = !1),
          (F = ""),
          b ? l() : setTimeout(l, 300),
          a.showOSD(c || "NetPlay session ended", !0, b),
          (b ? jt.Util.error : jt.Util.log)(c || "NetPlay session ended"),
          a.enterStandaloneMode();
      }),
      (this.getSessionID = function () {
        return r;
      }),
      (this.netVideoClockPulse = function () {});
    var q,
      r,
      s,
      t,
      u,
      v,
      w,
      x,
      y,
      z = a.console,
      A = a.consoleControls,
      B = !1,
      C = !1,
      D = !1,
      E = !1,
      F = "",
      G = "#@FrgS@#",
      H = "#@FrgE@#";
  }),
  (jt.NetClient.initKeepAlive = function () {
    Javatari.SERVER_ADDRESS &&
      Javatari.SERVER_KEEPALIVE &&
      jt.NetClient.sendKeepAlive();
  }),
  (jt.NetClient.sendKeepAlive = function () {
    fetch("https://" + Javatari.SERVER_ADDRESS + "/keepalive", {
      mode: "no-cors",
    })
      .catch(function (a) {
        jt.Util.error("Sending KeepAlive: ", a);
      })
      .finally(function () {
        Javatari.SERVER_KEEPALIVE > 0 &&
          setTimeout(jt.NetClient.sendKeepAlive, Javatari.SERVER_KEEPALIVE);
      });
  }),
  (jt.Room = function (a, b) {
    "use strict";
    function c(a) {
      var b = Javatari.AUTO_POWER_ON_DELAY;
      b >= 0 &&
        JavatariFullScreenSetup.shouldStartInFullScreen() &&
        (b += 1400),
        (b -= Date.now() - i),
        b < 1 && (b = 1),
        setTimeout(a, b);
    }
    function d() {
      b &&
        (h.console.getCartridgeSocket().inserted()
          ? h.console.userPowerOn()
          : Javatari.CARTRIDGE_SHOW_RECENT &&
            !Javatari.CARTRIDGE_CHANGE_DISABLED &&
            h.screen.openCartridgeChooserDialog(!0));
    }
    function e() {
      h.mainVideoClock = new jt.Clock(h.mainVideoClockPulse);
    }
    function f() {
      (h.peripheralControls = new jt.DOMPeripheralControls(h)),
        (h.consoleControls = new jt.DOMConsoleControls(
          h,
          h.peripheralControls
        )),
        (h.fileDownloader = new jt.FileDownloader()),
        (h.stateMedia = new jt.LocalStorageSaveStateMedia(h)),
        (h.recentROMs = new jt.RecentStoredROMs()),
        (h.fileLoader = new jt.FileLoader(
          h,
          h.recentROMs,
          h.peripheralControls
        )),
        (h.speaker = new jt.WebAudioSpeaker(a)),
        (h.screen = new jt.CanvasDisplay(h, a)),
        h.fileDownloader.connectPeripherals(h.screen),
        h.screen.connectPeripherals(
          h.recentROMs,
          h.fileLoader,
          h.fileDownloader,
          h.consoleControls,
          h.peripheralControls,
          h.stateMedia
        ),
        h.speaker.connectPeripherals(h.screen),
        h.consoleControls.connectPeripherals(h.screen),
        h.stateMedia.connectPeripherals(h.fileDownloader),
        h.peripheralControls.connectPeripherals(
          h.screen,
          h.speaker,
          h.consoleControls,
          h.fileLoader
        );
    }
    function g() {
      (h.console = new jt.AtariConsole()),
        h.mainVideoClock.connect(h.console.getVideoClockSocket()),
        h.stateMedia.connect(h.console.getSavestateSocket()),
        h.fileLoader.connect(h.console),
        h.screen.connect(h.console),
        h.speaker.connect(h.console.getAudioSocket()),
        h.consoleControls.connect(h.console.getConsoleControlsSocket()),
        h.peripheralControls.connect(h.console.getCartridgeSocket()),
        h.console.socketsConnected();
    }
    var h = this;
    (this.powerOn = function () {
      h.screen.powerOn(),
        h.speaker.powerOn(),
        h.consoleControls.powerOn(),
        h.setLoading(!0),
        h.enterStandaloneMode(),
        (i = Date.now());
    }),
      (this.powerOff = function () {
        h.console.powerOff(),
          h.consoleControls.powerOff(),
          h.speaker.powerOff(),
          h.screen.powerOff();
      }),
      (this.getNetServer = function () {
        return (
          this.netServer || (this.netServer = new jt.NetServer(this)),
          this.netServer
        );
      }),
      (this.getNetClient = function () {
        return (
          this.netClient || (this.netClient = new jt.NetClient(this)),
          this.netClient
        );
      }),
      (this.setLoading = function (a) {
        this.isLoading !== a &&
          ((this.isLoading = a),
          this.console.setLoading(this.isLoading),
          this.screen.setLoading(this.isLoading));
      }),
      (this.start = function (a) {
        this.mainVideoClock.detectHostNativeFPSAndCallback(function (b) {
          h.console.vSynchSetSupported(b > 0),
            c(function () {
              h.setLoading(!1), h.screen.start(a || d);
            });
        });
      }),
      (this.showOSD = function (a, b, c) {
        this.console.showOSD(a, b, c);
      }),
      (this.mainVideoClockPulse = function () {
        h.console.isSystemPaused() ||
          (h.netController
            ? h.netController.netVideoClockPulse()
            : (h.console.getConsoleControlsSocket().controlsClockPulse(),
              h.console.videoClockPulse()));
      }),
      (this.enterStandaloneMode = function () {
        var a = this.netPlayMode;
        (this.netPlayMode = 0),
          (this.netController = void 0),
          h.mainVideoClock.go(),
          this.netPlayStateBeforeClientMode &&
            (this.console.loadState(this.netPlayStateBeforeClientMode),
            this.consoleControls.setP1ControlsAndPaddleMode(
              this.netPlayControlsModeBeforeClientMode.p1,
              this.netPlayControlsModeBeforeClientMode.pd
            ),
            (this.netPlayStateBeforeClientMode = void 0)),
          a !== this.netPlayMode &&
            this.screen.roomNetPlayStatusChangeUpdate(a);
      }),
      (this.enterNetServerMode = function (a) {
        var b = this.netPlayMode;
        (this.netPlayMode = 1),
          (this.netController = a),
          h.mainVideoClock.go(),
          b !== this.netPlayMode &&
            this.screen.roomNetPlayStatusChangeUpdate(b);
      }),
      (this.enterNetClientMode = function (a) {
        var b = this.netPlayMode;
        (this.netPlayMode = 2),
          (this.netController = a),
          h.mainVideoClock.pause(),
          (this.netPlayStateBeforeClientMode = this.console.saveState(!0)),
          (this.netPlayControlsModeBeforeClientMode = {
            p1: this.consoleControls.isP1ControlsMode(),
            pd: this.consoleControls.isPaddleMode(),
          }),
          b !== this.netPlayMode &&
            this.screen.roomNetPlayStatusChangeUpdate(b);
      }),
      (this.enterNetPendingMode = function (a) {
        var b = this.netPlayMode;
        (this.netPlayMode = a === this.netServer ? -1 : -2),
          (this.netController = void 0),
          h.mainVideoClock.go(),
          b !== this.netPlayMode &&
            this.screen.roomNetPlayStatusChangeUpdate(b);
      }),
      (this.mainVideoClock = null),
      (this.console = null),
      (this.screen = null),
      (this.speaker = null),
      (this.consoleControls = null),
      (this.fileDownloader = null),
      (this.stateMedia = null),
      (this.recentROMs = null),
      (this.fileLoader = null),
      (this.peripheralControls = null),
      (this.netPlayMode = 0),
      (this.netController = void 0),
      (this.netServer = void 0),
      (this.netClient = void 0),
      (this.netPlayStateBeforeClientMode = void 0),
      (this.netPlayControlsModeBeforeClientMode = void 0),
      (this.isLoading = !1);
    var i;
    (this.runFramesAtTopSpeed = function (a) {
      this.mainVideoClock.pause();
      for (var b = jt.Util.performanceNow(), c = 0; c < a; c++)
        h.mainVideoClockPulse();
      var d = jt.Util.performanceNow() - b;
      jt.Util.log("Done running " + a + " frames in " + (0 | d) + " ms"),
        jt.Util.log((a / (d / 1e3)).toFixed(2) + "  frames/sec"),
        this.mainVideoClock.go();
    }),
      (function () {
        e(), f(), g(), Javatari.userROMFormats.init();
      })();
  }),
  (Javatari.userPreferences = {}),
  (Javatari.userPreferences.currentVersion = 1),
  (Javatari.userPreferences.compatibleVersions = new Set([1])),
  (Javatari.userPreferences.defaults = function () {
    "use strict";
    var a = jt.DOMKeys;
    return {
      joystickKeys: [
        {
          left: a.VK_LEFT,
          up: a.VK_UP,
          right: a.VK_RIGHT,
          down: a.VK_DOWN,
          button: a.VK_SPACE,
          buttonT: a.VK_DELETE,
        },
        {
          left: a.VK_F,
          up: a.VK_T,
          right: a.VK_H,
          down: a.VK_G,
          button: a.VK_A,
          buttonT: a.VK_PERIOD,
        },
      ],
      joystickGamepads: [
        {
          button: 0,
          buttonT: 1,
          select: 8,
          reset: 9,
          pause: 4,
          fastSpeed: 7,
          slowSpeed: 6,
          device: -1,
          xAxis: 0,
          xAxisSig: 1,
          yAxis: 1,
          yAxisSig: 1,
          paddleAxis: 0,
          paddleAxisSig: 1,
          paddleCenter: 0.3,
          paddleSens: 0.75,
          deadzone: 0.3,
        },
        {
          button: 0,
          buttonT: 1,
          select: 8,
          reset: 9,
          pause: 4,
          fastSpeed: 7,
          slowSpeed: 6,
          device: -1,
          xAxis: 0,
          xAxisSig: 1,
          yAxis: 1,
          yAxisSig: 1,
          paddleAxis: 0,
          paddleAxisSig: 1,
          paddleCenter: 0.3,
          paddleSens: 0.75,
          deadzone: 0.3,
        },
      ],
      touch: { directionalBig: !1 },
      hapticFeedback: !0,
      turboFireSpeed: 6,
      vSynch: 1,
      crtFilter: -1,
      audioBufferBase: -1,
      netPlaySessionName: "",
      netPlayNick: "",
    };
  }),
  (Javatari.userPreferences.load = function () {
    var a;
    try {
      (a = JSON.parse(localStorage.javatari4prefs || "{}")),
        a.version && delete a.version;
    } catch (a) {}
    if (
      !a ||
      !Javatari.userPreferences.compatibleVersions.has(a.prefsVersion)
    ) {
      a = {};
    }
    var b = Javatari.userPreferences.defaults();
    for (var c in b) void 0 === a[c] && (a[c] = b[c]);
    (a.prefsVersion = Javatari.userPreferences.currentVersion),
      Javatari.userPreferences.current ||
        (Javatari.userPreferences.current = {});
    var d = Javatari.userPreferences.current;
    for (c in a) d[c] = a[c];
    Javatari.userPreferences.isDirty = !1;
  }),
  (Javatari.userPreferences.setDefaultJoystickKeys = function () {
    (Javatari.userPreferences.current.joystickKeys =
      Javatari.userPreferences.defaults().joystickKeys),
      Javatari.userPreferences.setDirty();
  }),
  (Javatari.userPreferences.save = function () {
    if (Javatari.userPreferences.isDirty)
      try {
        (Javatari.userPreferences.current.javatariVersion = Javatari.VERSION),
          (localStorage.javatari4prefs = JSON.stringify(
            Javatari.userPreferences.current
          )),
          (Javatari.userPreferences.isDirty = !1),
          jt.Util.log("Preferences saved!");
      } catch (a) {}
  }),
  (Javatari.userPreferences.setDirty = function () {
    Javatari.userPreferences.isDirty = !0;
  }),
  (Javatari.userROMFormats = {
    init: function () {
      jt.CartridgeCreator.setUserROMFormats(this),
        (this.userFormats = JSON.parse(
          localStorage.javatariuserformats || "{}"
        ));
    },
    getForROM: function (a) {
      return this.userFormats[a.info.h];
    },
    setForROM: function (a, b, c) {
      a.info.h &&
        (c
          ? delete this.userFormats[a.info.h]
          : (this.userFormats[a.info.h] = b),
        (localStorage.javatariuserformats = JSON.stringify(this.userFormats)));
    },
  }),
  (jt.Images.embedded = !0),
  (jt.Images.urls.logo =
    "data:image/png;base64,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"),
  (jt.Images.urls.loading =
    "data:image/gif;base64,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"),
  (jt.Images.urls.mouseCursor =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABL0lEQVRYw+3VP0oDQRTH8U8k+AcFFRUFERGLiFjEA1jZTo6RG6T3ArmFR9j0WlpaWBiwsNNyiwgW0Vg4CUPELhMt9guPffumeG9nf/MbvlnEYVmWo3a7PcIO1s2R3aT5KQ6wMo/GC/G5nNTWsYr6PHdgE+fJLjRxhFqMbNSxFr96K6nvYxhr7zE+Y8yUWghhNH5pNBr6/f5ksdfrXeA1xiCbBoqiUBSF6RwN7GIptwh/4wR7UyKduQZ0Op1JIc2xHTVSzzpAt9v9sdBqtczTB/6Mfz/A2AOGOYe4DCGMUqI33OAKl1MmNVsjwhmaIYTrxIBu8YA73OMZb7kG2MFhPPPH2ECJJzzG5iU+ch3DMvnfL/HcDxILztZcctPVo9stxXyYCPBDRUVFRUVFRUa+AB+1YCivg1lPAAAAAElFTkSuQmCC"),
  (jt.Images.urls.panel =
    "data:image/jpeg;base64,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"),
  (jt.Images.urls.panelSprites =
    "data:image/jpeg;base64,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"),
  (jt.Images.urls.controllers =
    "data:image/jpeg;base64,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"),
  (jt.Images.urls.iconSprites =
    "data:image/png;base64,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"),
  (jt.Images.urls.muteIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAoCAYAAAC4h3lxAAAEwklEQVRYw+2YbWhbZRTH/+fJTdLbuHWsVTc6cK2DtDcJK2GsbAzpUNEPgjAUZYgyFXUZ8wVxm+ua2bjCuo19UDZQRFQCgkw3/CgMi9M6i9Q1uUntRsigww6duOFi3tr790smMaTvXbLq/t+S53Dv+T3nPOc55wK39R9UOp22DQ4OLq/Eu9RCP9A0zVXJZLK7pqbm8UUHEI/H7xeRd0juAVBXCQBtIR6SSCRqM5nMswACAFoAsFLpqi1AyhjZbDYAYBuAWhEByYoBzDmFOjs7VTQa3SIi75IMiEhtNQrGnCJw7ty5ervd/hKA7SLSWM2KN2uAWCy2QUQCJJ8UEQ1Vllamhkvxb13XCQD9/f32ZcuWPWVZ1g4AfhGRub50cHDwDpfLNe52uzMzsR8ZGVnhdrsvl1v7lxORSKTJZrO9CGApAJC8PD4+fkzTtOsishfAKyIybXkkaYnIm4ZhHCpz6O9USnWRTGWz2R6/3399mog/TPIZACe8Xu/nU0ZA07R6AM+RrAcAEbmgadqHTqeTuVzuoZk4P93ZAdBFcgeACYfDwYGBgZ7169enJqlwD4pIUEQ2kPTE43HLMIyT01YhKagkQjIf503TdDocjh1KqYCIKBGxi8jrLpdrT39/f+0kl2IQwIaCTz6SwVgs5r+prcRk8nq9WcuyRi3L+qVooxwA3qirq9vd19enF6VNB8mgiGwqSksCMEn+uuA38SwgPopGoxrJ/TfKr4g4Se5qaGiwTNM8SLK9sPP3FTuvlPqUZMjj8VyqGgAArlmz5oNkMqkKECsLEDUisgvAKgD3Athc7DzJz0Qk1NraeuGm9EKzka7rTKfT71+8eFFZlrVfRO4uLNWS3CYitmLnReQEyVBLS8tIRdrpmUKEw+H3ABwA8FvRmbCV5PxJACGv1xuv2DwwU/X09FjNzc3HAXwMIFeucGma9rZhGGZFB5pZtuFrSbYAcJQp5ffk8/nN6XRa3ZIA0Wh0LYD9IvLIJCZLRWRfIpHY2dnZqW4pgKGhIZ9SKqiUerSkBTlPMlUUheUism/r1q2B0h6tagCmaRqapgVFZEvJ0leWZT1P8gCAP4sgGgB0JRKJ7eUgKgoQiURalFJBEXmsZOdPAwj5fL4zuVzu6MTERG9JJO4Ska5kMvlCaUtTMYBkMulSSj0N4ImSpa+VUt2GYXwHAH6/PyciR0geIpkuglhBcq9pmu1VAWhqakqJyFkAPxXt/DckQ62trWdK+6YrV64cBnCYZKZgOwHgi1Qq9fNUACR5meQYyTERGSv5f17Dusfj+ZJkiGSE5Lci0u3xePrK2XZ0dKSvXbvWC+BIIRLH8vn8gfb29quTthKjo6NDjY2N/4TYsiz6fL5LhcN3FECO5BYRUfOAOBWLxa4CyBqG8f1Uths3bvxrYGDg4JIlS37I5/Nn29rafp9yIpvBQLLSbrcHCsN8/Vwmsqp+Vmlraxtrbm5+i+SrAM5W8vvPgl1kuq5PeL3eMICdJD8BkF9UADdkGMaPmUzmtcLwMbroAABg3bp1f6xevbqX5MskT1cjpeZ9D+i6To/Hc0rTtJ0icrz48lkUADfkdruHnU7nLgC7AZzHYtbw8PADkUhk06KGCIfDNtzW/0B/A2/7MX7SZ6/PAAAAAElFTkSuQmCC"),
  (jt.Configurator = {
    applyConfig: function () {
      var a = {};
      Javatari.ALLOW_URL_PARAMETERS &&
        ((a = (function () {
          for (
            var a,
              b = (window.location.search || "").split("+").join(" "),
              c = /[?&]?([^=]+)=([^&]*)/g,
              d = {};
            (a = c.exec(b));

          ) {
            var e = decodeURIComponent(a[1]).trim().toUpperCase();
            (e = jt.Configurator.abbreviations[e] || e),
              (d[e] = decodeURIComponent(a[2]).trim());
          }
          return d;
        })()),
        a.PRESETS && (this.applyParam("PRESETS", a.PRESETS), delete a.PRESETS)),
        a.RESET && this.applyReset(),
        this.applyPresets(Javatari.PRESETS);
      for (var b in a) this.applyParam(b, a[b]);
      !(function () {
        (Javatari.AUTO_POWER_ON_DELAY |= 0),
          (Javatari.CARTRIDGE_CHANGE_DISABLED =
            !0 === Javatari.CARTRIDGE_CHANGE_DISABLED ||
            "true" == Javatari.CARTRIDGE_CHANGE_DISABLED),
          (Javatari.SCREEN_RESIZE_DISABLED =
            !0 === Javatari.SCREEN_RESIZE_DISABLED ||
            "true" == Javatari.SCREEN_RESIZE_DISABLED),
          (Javatari.SCREEN_FULLSCREEN_MODE = Javatari.SCREEN_FULLSCREEN_MODE |=
            0),
          (Javatari.SCREEN_FILTER_MODE |= 0),
          (Javatari.SCREEN_CRT_MODE |= 0),
          (Javatari.SCREEN_DEFAULT_SCALE = parseFloat(
            Javatari.SCREEN_DEFAULT_SCALE
          )),
          (Javatari.SCREEN_DEFAULT_ASPECT = parseFloat(
            Javatari.SCREEN_DEFAULT_ASPECT
          )),
          (Javatari.SCREEN_CANVAS_SIZE = 0 | Javatari.SCREEN_CANVAS_SIZE),
          (Javatari.SCREEN_CONTROL_BAR |= 0),
          (Javatari.SCREEN_FORCE_HOST_NATIVE_FPS |= 0),
          (Javatari.SCREEN_VSYNCH_MODE |= 0),
          (Javatari.AUDIO_MONITOR_BUFFER_BASE |= 0),
          (Javatari.AUDIO_MONITOR_BUFFER_SIZE |= 0),
          (Javatari.AUDIO_SIGNAL_BUFFER_RATIO = parseFloat(
            Javatari.AUDIO_SIGNAL_BUFFER_RATIO
          )),
          (Javatari.AUDIO_SIGNAL_ADD_FRAMES |= 0);
      })(),
        Javatari.PAGE_BACK_CSS &&
          (document.body.style.background = Javatari.PAGE_BACK_CSS);
    },
    applyPresets: function (a) {
      for (
        var b = (a || "").trim().toUpperCase().split(","), c = 0;
        c < b.length;
        c++
      )
        this.applyPreset(b[c].trim());
    },
    applyPreset: function (a) {
      if (a) {
        var b = Javatari.PRESETS_CONFIG[a];
        if (b) {
          jt.Util.log("Applying preset: " + a);
          for (var c in b) {
            var d = c.trim().toUpperCase();
            "_" !== d[0]
              ? this.applyParam(d, b[c])
              : "_INCLUDE" === d && this.applyPresets(b[c]);
          }
        } else jt.Util.warning('Preset "' + a + '" not found, skipping...');
      }
    },
    applyParam: function (a, b) {
      if (a.indexOf(".") < 0) Javatari[a] = b;
      else {
        for (var c = Javatari, d = a.split("."), e = 0; e < d.length - 1; ++e)
          c = c[d[e]];
        c[d[d.length - 1]] = b;
      }
    },
    mediaURLSpecs: function () {
      var a = jt.FileLoader.OPEN_TYPE;
      return [
        Javatari.AUTODETECT_URL && {
          url: Javatari.AUTODETECT_URL,
          onSuccess: function (b) {
            Javatari.room.fileLoader.loadFromContent(
              b.url,
              b.content,
              a.AUTO,
              0,
              !0,
              !1
            );
          },
        },
        Javatari.CARTRIDGE_URL && {
          url: Javatari.CARTRIDGE_URL,
          onSuccess: function (b) {
            Javatari.room.fileLoader.loadFromContent(
              b.url,
              b.content,
              a.ROM,
              0,
              !0,
              !1,
              Javatari.CARTRIDGE_FORMAT
            );
          },
        },
      ];
    },
    applyReset: function () {
      jt.Util.warning("Removing all data saved on this client");
      for (var a in localStorage)
        0 === a.indexOf("javatari") && delete localStorage[a];
    },
    abbreviations: {
      P: "PRESETS",
      PRESET: "PRESETS",
      ROM: "CARTRIDGE_URL",
      CART: "CARTRIDGE_URL",
      FORMAT: "CARTRIDGE_FORMAT",
      ROM_FORMAT: "CARTRIDGE_FORMAT",
      CART_FORMAT: "CARTRIDGE_FORMAT",
      ANY: "AUTODETECT_URL",
      AUTO: "AUTODETECT_URL",
      AUTODETECT: "AUTODETECT_URL",
      STATE: "STATE_URL",
      SAVESTATE: "STATE_URL",
      JOIN: "NETPLAY_JOIN",
      NICK: "NETPLAY_NICK",
      VERSION: "VERSION_CHANGE_ATTEMPTED",
    },
  }),
  (Javatari.start = function (a) {
    "use strict";
    if (
      (delete Javatari.start,
      delete Javatari.preLoadImagesAndStart,
      Javatari.userPreferences.load(),
      !Javatari.screenElement &&
        ((Javatari.screenElement = document.getElementById(
          Javatari.SCREEN_ELEMENT_ID
        )),
        !Javatari.screenElement))
    )
      throw new Error(
        'Javatari cannot be started. HTML document is missing screen element with id "' +
          Javatari.SCREEN_ELEMENT_ID +
          '"'
      );

    jt.Configurator.applyConfig(),
      void 0 === a && (a = Javatari.AUTO_POWER_ON_DELAY >= 0),
      (Javatari.room = new jt.Room(Javatari.screenElement, a)),
      Javatari.room.powerOn(),
      jt.Util.log("version " + Javatari.VERSION + " started"),
      jt.CartridgeDatabase.uncompress(),
      jt.NetClient.initKeepAlive();
    var b = Javatari.NETPLAY_JOIN;
    if (!b && Javatari.STATE_URL)
      new jt.MultiDownloader([{ url: Javatari.STATE_URL }], function (a) {
        Javatari.room.start(function () {
          Javatari.room.fileLoader.loadFromContent(
            a[0].url,
            a[0].content,
            jt.FileLoader.OPEN_TYPE.STATE,
            0,
            !1
          );
        });
      }).start();
    else {
      var c = b ? [] : jt.Configurator.mediaURLSpecs();
      new jt.MultiDownloader(c, function () {
        Javatari.room.start(
          b
            ? function () {
                Javatari.room
                  .getNetClient()
                  .joinSession(b, Javatari.NETPLAY_NICK);
              }
            : void 0
        );
      }).start();
    }
    Javatari.shutdown = function () {
      Javatari.room && Javatari.room.powerOff(), jt.Util.log("shutdown");
    };
  }),
  (Javatari.preLoadImagesAndStart = function () {
    function a(a) {
      Javatari.start &&
        Javatari.AUTO_START &&
        (a || (b && 0 === c)) &&
        Javatari.start();
    }
    var b = !1,
      c = jt.Images.embedded ? 0 : jt.Images.count;
    if (
      (document.addEventListener("DOMContentLoaded", function () {
        (b = !0), a(!1);
      }),
      c > 0)
    )
      for (var d in jt.Images.urls) {
        var e = new Image();
        (e.src = jt.Images.urls[d]),
          (e.onload = function () {
            c--, a(!1);
          });
      }
    window.addEventListener("load", function () {
      a(!0);
    });
  }),
  window.applicationCache &&
    (window.applicationCache.status === window.applicationCache.UPDATEREADY
      ? onUpdateReady()
      : window.applicationCache.addEventListener("updateready", onUpdateReady)),
  (Javatari.VERSION = "5.0.4"),
  Javatari.preLoadImagesAndStart();
