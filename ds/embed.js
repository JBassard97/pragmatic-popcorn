!(function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    ("undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : this
    ).localforage = e();
  }
})(function () {
  return (function e(t, r, n) {
    function o(i, u) {
      if (!r[i]) {
        if (!t[i]) {
          var s = "function" == typeof require && require;
          if (!u && s) return s(i, !0);
          if (a) return a(i, !0);
          var l = new Error("Cannot find module '" + i + "'");
          throw ((l.code = "MODULE_NOT_FOUND"), l);
        }
        var c = (r[i] = { exports: {} });
        t[i][0].call(
          c.exports,
          function (e) {
            var r = t[i][1][e];
            return o(r || e);
          },
          c,
          c.exports,
          e,
          t,
          r,
          n
        );
      }
      return r[i].exports;
    }
    for (
      var a = "function" == typeof require && require, i = 0;
      i < n.length;
      i++
    )
      o(n[i]);
    return o;
  })(
    {
      1: [
        function (e, t, r) {
          (function (e) {
            "use strict";
            var r,
              n,
              o = e.MutationObserver || e.WebKitMutationObserver;
            if (o) {
              var a = 0,
                i = new o(c),
                u = e.document.createTextNode("");
              i.observe(u, { characterData: !0 }),
                (r = function () {
                  u.data = a = ++a % 2;
                });
            } else if (e.setImmediate || void 0 === e.MessageChannel)
              r =
                "document" in e &&
                "onreadystatechange" in e.document.createElement("script")
                  ? function () {
                      var t = e.document.createElement("script");
                      (t.onreadystatechange = function () {
                        c(),
                          (t.onreadystatechange = null),
                          t.parentNode.removeChild(t),
                          (t = null);
                      }),
                        e.document.documentElement.appendChild(t);
                    }
                  : function () {
                      setTimeout(c, 0);
                    };
            else {
              var s = new e.MessageChannel();
              (s.port1.onmessage = c),
                (r = function () {
                  s.port2.postMessage(0);
                });
            }
            var l = [];
            function c() {
              var e, t;
              n = !0;
              for (var r = l.length; r; ) {
                for (t = l, l = [], e = -1; ++e < r; ) t[e]();
                r = l.length;
              }
              n = !1;
            }
            t.exports = function (e) {
              1 !== l.push(e) || n || r();
            };
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        {},
      ],
      2: [
        function (e, t, r) {
          "use strict";
          var n = e(1);
          function o() {}
          var a = {},
            i = ["REJECTED"],
            u = ["FULFILLED"],
            s = ["PENDING"];
          function l(e) {
            if ("function" != typeof e)
              throw new TypeError("resolver must be a function");
            (this.state = s),
              (this.queue = []),
              (this.outcome = void 0),
              e !== o && m(this, e);
          }
          function c(e, t, r) {
            (this.promise = e),
              "function" == typeof t &&
                ((this.onFulfilled = t),
                (this.callFulfilled = this.otherCallFulfilled)),
              "function" == typeof r &&
                ((this.onRejected = r),
                (this.callRejected = this.otherCallRejected));
          }
          function d(e, t, r) {
            n(function () {
              var n;
              try {
                n = t(r);
              } catch (t) {
                return a.reject(e, t);
              }
              n === e
                ? a.reject(
                    e,
                    new TypeError("Cannot resolve promise with itself")
                  )
                : a.resolve(e, n);
            });
          }
          function f(e) {
            var t = e && e.then;
            if (
              e &&
              ("object" == typeof e || "function" == typeof e) &&
              "function" == typeof t
            )
              return function () {
                t.apply(e, arguments);
              };
          }
          function m(e, t) {
            var r = !1;
            function n(t) {
              r || ((r = !0), a.reject(e, t));
            }
            function o(t) {
              r || ((r = !0), a.resolve(e, t));
            }
            var i = p(function () {
              t(o, n);
            });
            "error" === i.status && n(i.value);
          }
          function p(e, t) {
            var r = {};
            try {
              (r.value = e(t)), (r.status = "success");
            } catch (e) {
              (r.status = "error"), (r.value = e);
            }
            return r;
          }
          (t.exports = l),
            (l.prototype.catch = function (e) {
              return this.then(null, e);
            }),
            (l.prototype.then = function (e, t) {
              if (
                ("function" != typeof e && this.state === u) ||
                ("function" != typeof t && this.state === i)
              )
                return this;
              var r = new this.constructor(o);
              this.state !== s
                ? d(r, this.state === u ? e : t, this.outcome)
                : this.queue.push(new c(r, e, t));
              return r;
            }),
            (c.prototype.callFulfilled = function (e) {
              a.resolve(this.promise, e);
            }),
            (c.prototype.otherCallFulfilled = function (e) {
              d(this.promise, this.onFulfilled, e);
            }),
            (c.prototype.callRejected = function (e) {
              a.reject(this.promise, e);
            }),
            (c.prototype.otherCallRejected = function (e) {
              d(this.promise, this.onRejected, e);
            }),
            (a.resolve = function (e, t) {
              var r = p(f, t);
              if ("error" === r.status) return a.reject(e, r.value);
              var n = r.value;
              if (n) m(e, n);
              else {
                (e.state = u), (e.outcome = t);
                for (var o = -1, i = e.queue.length; ++o < i; )
                  e.queue[o].callFulfilled(t);
              }
              return e;
            }),
            (a.reject = function (e, t) {
              (e.state = i), (e.outcome = t);
              for (var r = -1, n = e.queue.length; ++r < n; )
                e.queue[r].callRejected(t);
              return e;
            }),
            (l.resolve = function (e) {
              if (e instanceof this) return e;
              return a.resolve(new this(o), e);
            }),
            (l.reject = function (e) {
              var t = new this(o);
              return a.reject(t, e);
            }),
            (l.all = function (e) {
              var t = this;
              if ("[object Array]" !== Object.prototype.toString.call(e))
                return this.reject(new TypeError("must be an array"));
              var r = e.length,
                n = !1;
              if (!r) return this.resolve([]);
              var i = new Array(r),
                u = 0,
                s = -1,
                l = new this(o);
              for (; ++s < r; ) c(e[s], s);
              return l;
              function c(e, o) {
                t.resolve(e).then(
                  function (e) {
                    (i[o] = e), ++u !== r || n || ((n = !0), a.resolve(l, i));
                  },
                  function (e) {
                    n || ((n = !0), a.reject(l, e));
                  }
                );
              }
            }),
            (l.race = function (e) {
              var t = this;
              if ("[object Array]" !== Object.prototype.toString.call(e))
                return this.reject(new TypeError("must be an array"));
              var r = e.length,
                n = !1;
              if (!r) return this.resolve([]);
              var i = -1,
                u = new this(o);
              for (; ++i < r; )
                (s = e[i]),
                  t.resolve(s).then(
                    function (e) {
                      n || ((n = !0), a.resolve(u, e));
                    },
                    function (e) {
                      n || ((n = !0), a.reject(u, e));
                    }
                  );
              var s;
              return u;
            });
        },
        { 1: 1 },
      ],
      3: [
        function (e, t, r) {
          (function (t) {
            "use strict";
            "function" != typeof t.Promise && (t.Promise = e(2));
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        { 2: 2 },
      ],
      4: [
        function (e, t, r) {
          "use strict";
          var n =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                };
          var o = (function () {
            try {
              if ("undefined" != typeof indexedDB) return indexedDB;
              if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
              if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
              if ("undefined" != typeof OIndexedDB) return OIndexedDB;
              if ("undefined" != typeof msIndexedDB) return msIndexedDB;
            } catch (e) {
              return;
            }
          })();
          function a(e, t) {
            (e = e || []), (t = t || {});
            try {
              return new Blob(e, t);
            } catch (o) {
              if ("TypeError" !== o.name) throw o;
              for (
                var r = new (
                    "undefined" != typeof BlobBuilder
                      ? BlobBuilder
                      : "undefined" != typeof MSBlobBuilder
                      ? MSBlobBuilder
                      : "undefined" != typeof MozBlobBuilder
                      ? MozBlobBuilder
                      : WebKitBlobBuilder
                  )(),
                  n = 0;
                n < e.length;
                n += 1
              )
                r.append(e[n]);
              return r.getBlob(t.type);
            }
          }
          "undefined" == typeof Promise && e(3);
          var i = Promise;
          function u(e, t) {
            t &&
              e.then(
                function (e) {
                  t(null, e);
                },
                function (e) {
                  t(e);
                }
              );
          }
          function s(e, t, r) {
            "function" == typeof t && e.then(t),
              "function" == typeof r && e.catch(r);
          }
          function l(e) {
            return (
              "string" != typeof e &&
                (console.warn(e + " used as a key, but it is not a string."),
                (e = String(e))),
              e
            );
          }
          function c() {
            if (
              arguments.length &&
              "function" == typeof arguments[arguments.length - 1]
            )
              return arguments[arguments.length - 1];
          }
          var d = "local-forage-detect-blob-support",
            f = void 0,
            m = {},
            p = Object.prototype.toString,
            h = "readonly",
            _ = "readwrite";
          function v(e) {
            return "boolean" == typeof f
              ? i.resolve(f)
              : (function (e) {
                  return new i(function (t) {
                    var r = e.transaction(d, _),
                      n = a([""]);
                    r.objectStore(d).put(n, "key"),
                      (r.onabort = function (e) {
                        e.preventDefault(), e.stopPropagation(), t(!1);
                      }),
                      (r.oncomplete = function () {
                        var e = navigator.userAgent.match(/Chrome\/(\d+)/),
                          r = navigator.userAgent.match(/Edge\//);
                        t(r || !e || parseInt(e[1], 10) >= 43);
                      });
                  }).catch(function () {
                    return !1;
                  });
                })(e).then(function (e) {
                  return (f = e);
                });
          }
          function S(e) {
            var t = m[e.name],
              r = {};
            (r.promise = new i(function (e, t) {
              (r.resolve = e), (r.reject = t);
            })),
              t.deferredOperations.push(r),
              t.dbReady
                ? (t.dbReady = t.dbReady.then(function () {
                    return r.promise;
                  }))
                : (t.dbReady = r.promise);
          }
          function y(e) {
            var t = m[e.name].deferredOperations.pop();
            if (t) return t.resolve(), t.promise;
          }
          function g(e, t) {
            var r = m[e.name].deferredOperations.pop();
            if (r) return r.reject(t), r.promise;
          }
          function w(e, t) {
            return new i(function (r, n) {
              if (
                ((m[e.name] = m[e.name] || {
                  forages: [],
                  db: null,
                  dbReady: null,
                  deferredOperations: [],
                }),
                e.db)
              ) {
                if (!t) return r(e.db);
                S(e), e.db.close();
              }
              var a = [e.name];
              t && a.push(e.version);
              var i = o.open.apply(o, a);
              t &&
                (i.onupgradeneeded = function (t) {
                  var r = i.result;
                  try {
                    r.createObjectStore(e.storeName),
                      t.oldVersion <= 1 && r.createObjectStore(d);
                  } catch (r) {
                    if ("ConstraintError" !== r.name) throw r;
                    console.warn(
                      'The database "' +
                        e.name +
                        '" has been upgraded from version ' +
                        t.oldVersion +
                        " to version " +
                        t.newVersion +
                        ', but the storage "' +
                        e.storeName +
                        '" already exists.'
                    );
                  }
                }),
                (i.onerror = function (e) {
                  e.preventDefault(), n(i.error);
                }),
                (i.onsuccess = function () {
                  r(i.result), y(e);
                });
            });
          }
          function F(e) {
            return w(e, !1);
          }
          function E(e) {
            return w(e, !0);
          }
          function M(e, t) {
            if (!e.db) return !0;
            var r = !e.db.objectStoreNames.contains(e.storeName),
              n = e.version < e.db.version,
              o = e.version > e.db.version;
            if (
              (n &&
                (e.version !== t &&
                  console.warn(
                    'The database "' +
                      e.name +
                      "\" can't be downgraded from version " +
                      e.db.version +
                      " to version " +
                      e.version +
                      "."
                  ),
                (e.version = e.db.version)),
              o || r)
            ) {
              if (r) {
                var a = e.db.version + 1;
                a > e.version && (e.version = a);
              }
              return !0;
            }
            return !1;
          }
          function b(e) {
            return a(
              [
                (function (e) {
                  for (
                    var t = e.length,
                      r = new ArrayBuffer(t),
                      n = new Uint8Array(r),
                      o = 0;
                    o < t;
                    o++
                  )
                    n[o] = e.charCodeAt(o);
                  return r;
                })(atob(e.data)),
              ],
              { type: e.type }
            );
          }
          function A(e) {
            return e && e.__local_forage_encoded_blob;
          }
          function T(e) {
            var t = this,
              r = t._initReady().then(function () {
                var e = m[t._dbInfo.name];
                if (e && e.dbReady) return e.dbReady;
              });
            return s(r, e, e), r;
          }
          function k(e, t, r, n) {
            void 0 === n && (n = 1);
            try {
              var o = e.db.transaction(e.storeName, t);
              r(null, o);
            } catch (o) {
              if (
                n > 0 &&
                (!e.db ||
                  "InvalidStateError" === o.name ||
                  "NotFoundError" === o.name)
              )
                return i
                  .resolve()
                  .then(function () {
                    if (
                      !e.db ||
                      ("NotFoundError" === o.name &&
                        !e.db.objectStoreNames.contains(e.storeName) &&
                        e.version <= e.db.version)
                    )
                      return e.db && (e.version = e.db.version + 1), E(e);
                  })
                  .then(function () {
                    return (function (e) {
                      S(e);
                      for (
                        var t = m[e.name], r = t.forages, n = 0;
                        n < r.length;
                        n++
                      ) {
                        var o = r[n];
                        o._dbInfo.db &&
                          (o._dbInfo.db.close(), (o._dbInfo.db = null));
                      }
                      return (
                        (e.db = null),
                        F(e)
                          .then(function (t) {
                            return (e.db = t), M(e) ? E(e) : t;
                          })
                          .then(function (n) {
                            e.db = t.db = n;
                            for (var o = 0; o < r.length; o++)
                              r[o]._dbInfo.db = n;
                          })
                          .catch(function (t) {
                            throw (g(e, t), t);
                          })
                      );
                    })(e).then(function () {
                      k(e, t, r, n - 1);
                    });
                  })
                  .catch(r);
              r(o);
            }
          }
          var D = {
            _driver: "asyncStorage",
            _initStorage: function (e) {
              var t = this,
                r = { db: null };
              if (e) for (var n in e) r[n] = e[n];
              var o = m[r.name];
              o ||
                ((o = {
                  forages: [],
                  db: null,
                  dbReady: null,
                  deferredOperations: [],
                }),
                (m[r.name] = o)),
                o.forages.push(t),
                t._initReady || ((t._initReady = t.ready), (t.ready = T));
              var a = [];
              function u() {
                return i.resolve();
              }
              for (var s = 0; s < o.forages.length; s++) {
                var l = o.forages[s];
                l !== t && a.push(l._initReady().catch(u));
              }
              var c = o.forages.slice(0);
              return i
                .all(a)
                .then(function () {
                  return (r.db = o.db), F(r);
                })
                .then(function (e) {
                  return (r.db = e), M(r, t._defaultConfig.version) ? E(r) : e;
                })
                .then(function (e) {
                  (r.db = o.db = e), (t._dbInfo = r);
                  for (var n = 0; n < c.length; n++) {
                    var a = c[n];
                    a !== t &&
                      ((a._dbInfo.db = r.db), (a._dbInfo.version = r.version));
                  }
                });
            },
            _support: (function () {
              try {
                if (!o) return !1;
                var e =
                    "undefined" != typeof openDatabase &&
                    /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
                    !/Chrome/.test(navigator.userAgent) &&
                    !/BlackBerry/.test(navigator.platform),
                  t =
                    "function" == typeof fetch &&
                    -1 !== fetch.toString().indexOf("[native code");
                return (
                  (!e || t) &&
                  "undefined" != typeof indexedDB &&
                  "undefined" != typeof IDBKeyRange
                );
              } catch (e) {
                return !1;
              }
            })(),
            iterate: function (e, t) {
              var r = this,
                n = new i(function (t, n) {
                  r.ready()
                    .then(function () {
                      k(r._dbInfo, h, function (o, a) {
                        if (o) return n(o);
                        try {
                          var i = a
                              .objectStore(r._dbInfo.storeName)
                              .openCursor(),
                            u = 1;
                          (i.onsuccess = function () {
                            var r = i.result;
                            if (r) {
                              var n = r.value;
                              A(n) && (n = b(n));
                              var o = e(n, r.key, u++);
                              void 0 !== o ? t(o) : r.continue();
                            } else t();
                          }),
                            (i.onerror = function () {
                              n(i.error);
                            });
                        } catch (e) {
                          n(e);
                        }
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            },
            getItem: function (e, t) {
              var r = this;
              e = l(e);
              var n = new i(function (t, n) {
                r.ready()
                  .then(function () {
                    k(r._dbInfo, h, function (o, a) {
                      if (o) return n(o);
                      try {
                        var i = a.objectStore(r._dbInfo.storeName).get(e);
                        (i.onsuccess = function () {
                          var e = i.result;
                          void 0 === e && (e = null), A(e) && (e = b(e)), t(e);
                        }),
                          (i.onerror = function () {
                            n(i.error);
                          });
                      } catch (e) {
                        n(e);
                      }
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            },
            setItem: function (e, t, r) {
              var n = this;
              e = l(e);
              var o = new i(function (r, o) {
                var a;
                n.ready()
                  .then(function () {
                    return (
                      (a = n._dbInfo),
                      "[object Blob]" === p.call(t)
                        ? v(a.db).then(function (e) {
                            return e
                              ? t
                              : ((r = t),
                                new i(function (e, t) {
                                  var n = new FileReader();
                                  (n.onerror = t),
                                    (n.onloadend = function (t) {
                                      var n = btoa(t.target.result || "");
                                      e({
                                        __local_forage_encoded_blob: !0,
                                        data: n,
                                        type: r.type,
                                      });
                                    }),
                                    n.readAsBinaryString(r);
                                }));
                            var r;
                          })
                        : t
                    );
                  })
                  .then(function (t) {
                    k(n._dbInfo, _, function (a, i) {
                      if (a) return o(a);
                      try {
                        var u = i.objectStore(n._dbInfo.storeName);
                        null === t && (t = void 0);
                        var s = u.put(t, e);
                        (i.oncomplete = function () {
                          void 0 === t && (t = null), r(t);
                        }),
                          (i.onabort = i.onerror =
                            function () {
                              var e = s.error ? s.error : s.transaction.error;
                              o(e);
                            });
                      } catch (e) {
                        o(e);
                      }
                    });
                  })
                  .catch(o);
              });
              return u(o, r), o;
            },
            removeItem: function (e, t) {
              var r = this;
              e = l(e);
              var n = new i(function (t, n) {
                r.ready()
                  .then(function () {
                    k(r._dbInfo, _, function (o, a) {
                      if (o) return n(o);
                      try {
                        var i = a.objectStore(r._dbInfo.storeName).delete(e);
                        (a.oncomplete = function () {
                          t();
                        }),
                          (a.onerror = function () {
                            n(i.error);
                          }),
                          (a.onabort = function () {
                            var e = i.error ? i.error : i.transaction.error;
                            n(e);
                          });
                      } catch (e) {
                        n(e);
                      }
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            },
            clear: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      k(t._dbInfo, _, function (n, o) {
                        if (n) return r(n);
                        try {
                          var a = o.objectStore(t._dbInfo.storeName).clear();
                          (o.oncomplete = function () {
                            e();
                          }),
                            (o.onabort = o.onerror =
                              function () {
                                var e = a.error ? a.error : a.transaction.error;
                                r(e);
                              });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            length: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      k(t._dbInfo, h, function (n, o) {
                        if (n) return r(n);
                        try {
                          var a = o.objectStore(t._dbInfo.storeName).count();
                          (a.onsuccess = function () {
                            e(a.result);
                          }),
                            (a.onerror = function () {
                              r(a.error);
                            });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            key: function (e, t) {
              var r = this,
                n = new i(function (t, n) {
                  e < 0
                    ? t(null)
                    : r
                        .ready()
                        .then(function () {
                          k(r._dbInfo, h, function (o, a) {
                            if (o) return n(o);
                            try {
                              var i = a.objectStore(r._dbInfo.storeName),
                                u = !1,
                                s = i.openCursor();
                              (s.onsuccess = function () {
                                var r = s.result;
                                r
                                  ? 0 === e
                                    ? t(r.key)
                                    : u
                                    ? t(r.key)
                                    : ((u = !0), r.advance(e))
                                  : t(null);
                              }),
                                (s.onerror = function () {
                                  n(s.error);
                                });
                            } catch (e) {
                              n(e);
                            }
                          });
                        })
                        .catch(n);
                });
              return u(n, t), n;
            },
            keys: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      k(t._dbInfo, h, function (n, o) {
                        if (n) return r(n);
                        try {
                          var a = o
                              .objectStore(t._dbInfo.storeName)
                              .openCursor(),
                            i = [];
                          (a.onsuccess = function () {
                            var t = a.result;
                            t ? (i.push(t.key), t.continue()) : e(i);
                          }),
                            (a.onerror = function () {
                              r(a.error);
                            });
                        } catch (e) {
                          r(e);
                        }
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            dropInstance: function (e, t) {
              t = c.apply(this, arguments);
              var r,
                n = this.config();
              if (
                ((e = ("function" != typeof e && e) || {}).name ||
                  ((e.name = e.name || n.name),
                  (e.storeName = e.storeName || n.storeName)),
                e.name)
              ) {
                var a =
                  e.name === n.name && this._dbInfo.db
                    ? i.resolve(this._dbInfo.db)
                    : F(e).then(function (t) {
                        var r = m[e.name],
                          n = r.forages;
                        r.db = t;
                        for (var o = 0; o < n.length; o++) n[o]._dbInfo.db = t;
                        return t;
                      });
                r = e.storeName
                  ? a.then(function (t) {
                      if (t.objectStoreNames.contains(e.storeName)) {
                        var r = t.version + 1;
                        S(e);
                        var n = m[e.name],
                          a = n.forages;
                        t.close();
                        for (var u = 0; u < a.length; u++) {
                          var s = a[u];
                          (s._dbInfo.db = null), (s._dbInfo.version = r);
                        }
                        return new i(function (t, n) {
                          var a = o.open(e.name, r);
                          (a.onerror = function (e) {
                            a.result.close(), n(e);
                          }),
                            (a.onupgradeneeded = function () {
                              a.result.deleteObjectStore(e.storeName);
                            }),
                            (a.onsuccess = function () {
                              var e = a.result;
                              e.close(), t(e);
                            });
                        })
                          .then(function (e) {
                            n.db = e;
                            for (var t = 0; t < a.length; t++) {
                              var r = a[t];
                              (r._dbInfo.db = e), y(r._dbInfo);
                            }
                          })
                          .catch(function (t) {
                            throw (
                              ((g(e, t) || i.resolve()).catch(function () {}),
                              t)
                            );
                          });
                      }
                    })
                  : a.then(function (t) {
                      S(e);
                      var r = m[e.name],
                        n = r.forages;
                      t.close();
                      for (var a = 0; a < n.length; a++) n[a]._dbInfo.db = null;
                      return new i(function (t, r) {
                        var n = o.deleteDatabase(e.name);
                        (n.onerror = n.onblocked =
                          function (e) {
                            var t = n.result;
                            t && t.close(), r(e);
                          }),
                          (n.onsuccess = function () {
                            var e = n.result;
                            e && e.close(), t(e);
                          });
                      })
                        .then(function (e) {
                          r.db = e;
                          for (var t = 0; t < n.length; t++) y(n[t]._dbInfo);
                        })
                        .catch(function (t) {
                          throw (
                            ((g(e, t) || i.resolve()).catch(function () {}), t)
                          );
                        });
                    });
              } else r = i.reject("Invalid arguments");
              return u(r, t), r;
            },
          };
          var P =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            R = "~~local_forage_type~",
            I = /^~~local_forage_type~([^~]+)~/,
            N = "__lfsc__:",
            H = N.length,
            x = "arbf",
            C = "blob",
            O = "si08",
            B = "ui08",
            L = "uic8",
            j = "si16",
            U = "si32",
            z = "ur16",
            Y = "ui32",
            W = "fl32",
            q = "fl64",
            G = H + x.length,
            K = Object.prototype.toString;
          function V(e) {
            var t,
              r,
              n,
              o,
              a,
              i = 0.75 * e.length,
              u = e.length,
              s = 0;
            "=" === e[e.length - 1] && (i--, "=" === e[e.length - 2] && i--);
            var l = new ArrayBuffer(i),
              c = new Uint8Array(l);
            for (t = 0; t < u; t += 4)
              (r = P.indexOf(e[t])),
                (n = P.indexOf(e[t + 1])),
                (o = P.indexOf(e[t + 2])),
                (a = P.indexOf(e[t + 3])),
                (c[s++] = (r << 2) | (n >> 4)),
                (c[s++] = ((15 & n) << 4) | (o >> 2)),
                (c[s++] = ((3 & o) << 6) | (63 & a));
            return l;
          }
          function X(e) {
            var t,
              r = new Uint8Array(e),
              n = "";
            for (t = 0; t < r.length; t += 3)
              (n += P[r[t] >> 2]),
                (n += P[((3 & r[t]) << 4) | (r[t + 1] >> 4)]),
                (n += P[((15 & r[t + 1]) << 2) | (r[t + 2] >> 6)]),
                (n += P[63 & r[t + 2]]);
            return (
              r.length % 3 == 2
                ? (n = n.substring(0, n.length - 1) + "=")
                : r.length % 3 == 1 &&
                  (n = n.substring(0, n.length - 2) + "=="),
              n
            );
          }
          var J = {
            serialize: function (e, t) {
              var r = "";
              if (
                (e && (r = K.call(e)),
                e &&
                  ("[object ArrayBuffer]" === r ||
                    (e.buffer && "[object ArrayBuffer]" === K.call(e.buffer))))
              ) {
                var n,
                  o = N;
                e instanceof ArrayBuffer
                  ? ((n = e), (o += x))
                  : ((n = e.buffer),
                    "[object Int8Array]" === r
                      ? (o += O)
                      : "[object Uint8Array]" === r
                      ? (o += B)
                      : "[object Uint8ClampedArray]" === r
                      ? (o += L)
                      : "[object Int16Array]" === r
                      ? (o += j)
                      : "[object Uint16Array]" === r
                      ? (o += z)
                      : "[object Int32Array]" === r
                      ? (o += U)
                      : "[object Uint32Array]" === r
                      ? (o += Y)
                      : "[object Float32Array]" === r
                      ? (o += W)
                      : "[object Float64Array]" === r
                      ? (o += q)
                      : t(new Error("Failed to get type for BinaryArray"))),
                  t(o + X(n));
              } else if ("[object Blob]" === r) {
                var a = new FileReader();
                (a.onload = function () {
                  var r = R + e.type + "~" + X(this.result);
                  t(N + C + r);
                }),
                  a.readAsArrayBuffer(e);
              } else
                try {
                  t(JSON.stringify(e));
                } catch (r) {
                  console.error(
                    "Couldn't convert value into a JSON string: ",
                    e
                  ),
                    t(null, r);
                }
            },
            deserialize: function (e) {
              if (e.substring(0, H) !== N) return JSON.parse(e);
              var t,
                r = e.substring(G),
                n = e.substring(H, G);
              if (n === C && I.test(r)) {
                var o = r.match(I);
                (t = o[1]), (r = r.substring(o[0].length));
              }
              var i = V(r);
              switch (n) {
                case x:
                  return i;
                case C:
                  return a([i], { type: t });
                case O:
                  return new Int8Array(i);
                case B:
                  return new Uint8Array(i);
                case L:
                  return new Uint8ClampedArray(i);
                case j:
                  return new Int16Array(i);
                case z:
                  return new Uint16Array(i);
                case U:
                  return new Int32Array(i);
                case Y:
                  return new Uint32Array(i);
                case W:
                  return new Float32Array(i);
                case q:
                  return new Float64Array(i);
                default:
                  throw new Error("Unkown type: " + n);
              }
            },
            stringToBuffer: V,
            bufferToString: X,
          };
          function Q(e, t, r, n) {
            e.executeSql(
              "CREATE TABLE IF NOT EXISTS " +
                t.storeName +
                " (id INTEGER PRIMARY KEY, key unique, value)",
              [],
              r,
              n
            );
          }
          function $(e, t, r, n, o, a) {
            e.executeSql(
              r,
              n,
              o,
              function (e, i) {
                i.code === i.SYNTAX_ERR
                  ? e.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
                      [t.storeName],
                      function (e, u) {
                        u.rows.length
                          ? a(e, i)
                          : Q(
                              e,
                              t,
                              function () {
                                e.executeSql(r, n, o, a);
                              },
                              a
                            );
                      },
                      a
                    )
                  : a(e, i);
              },
              a
            );
          }
          var Z = {
            _driver: "webSQLStorage",
            _initStorage: function (e) {
              var t = this,
                r = { db: null };
              if (e)
                for (var n in e)
                  r[n] = "string" != typeof e[n] ? e[n].toString() : e[n];
              var o = new i(function (e, n) {
                try {
                  r.db = openDatabase(
                    r.name,
                    String(r.version),
                    r.description,
                    r.size
                  );
                } catch (e) {
                  return n(e);
                }
                r.db.transaction(function (o) {
                  Q(
                    o,
                    r,
                    function () {
                      (t._dbInfo = r), e();
                    },
                    function (e, t) {
                      n(t);
                    }
                  );
                }, n);
              });
              return (r.serializer = J), o;
            },
            _support: "function" == typeof openDatabase,
            iterate: function (e, t) {
              var r = this,
                n = new i(function (t, n) {
                  r.ready()
                    .then(function () {
                      var o = r._dbInfo;
                      o.db.transaction(function (r) {
                        $(
                          r,
                          o,
                          "SELECT * FROM " + o.storeName,
                          [],
                          function (r, n) {
                            for (
                              var a = n.rows, i = a.length, u = 0;
                              u < i;
                              u++
                            ) {
                              var s = a.item(u),
                                l = s.value;
                              if (
                                (l && (l = o.serializer.deserialize(l)),
                                void 0 !== (l = e(l, s.key, u + 1)))
                              )
                                return void t(l);
                            }
                            t();
                          },
                          function (e, t) {
                            n(t);
                          }
                        );
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            },
            getItem: function (e, t) {
              var r = this;
              e = l(e);
              var n = new i(function (t, n) {
                r.ready()
                  .then(function () {
                    var o = r._dbInfo;
                    o.db.transaction(function (r) {
                      $(
                        r,
                        o,
                        "SELECT * FROM " +
                          o.storeName +
                          " WHERE key = ? LIMIT 1",
                        [e],
                        function (e, r) {
                          var n = r.rows.length ? r.rows.item(0).value : null;
                          n && (n = o.serializer.deserialize(n)), t(n);
                        },
                        function (e, t) {
                          n(t);
                        }
                      );
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            },
            setItem: function (e, t, r) {
              return function e(t, r, n, o) {
                var a = this;
                t = l(t);
                var s = new i(function (i, u) {
                  a.ready()
                    .then(function () {
                      void 0 === r && (r = null);
                      var s = r,
                        l = a._dbInfo;
                      l.serializer.serialize(r, function (r, c) {
                        c
                          ? u(c)
                          : l.db.transaction(
                              function (e) {
                                $(
                                  e,
                                  l,
                                  "INSERT OR REPLACE INTO " +
                                    l.storeName +
                                    " (key, value) VALUES (?, ?)",
                                  [t, r],
                                  function () {
                                    i(s);
                                  },
                                  function (e, t) {
                                    u(t);
                                  }
                                );
                              },
                              function (r) {
                                if (r.code === r.QUOTA_ERR) {
                                  if (o > 0)
                                    return void i(e.apply(a, [t, s, n, o - 1]));
                                  u(r);
                                }
                              }
                            );
                      });
                    })
                    .catch(u);
                });
                return u(s, n), s;
              }.apply(this, [e, t, r, 1]);
            },
            removeItem: function (e, t) {
              var r = this;
              e = l(e);
              var n = new i(function (t, n) {
                r.ready()
                  .then(function () {
                    var o = r._dbInfo;
                    o.db.transaction(function (r) {
                      $(
                        r,
                        o,
                        "DELETE FROM " + o.storeName + " WHERE key = ?",
                        [e],
                        function () {
                          t();
                        },
                        function (e, t) {
                          n(t);
                        }
                      );
                    });
                  })
                  .catch(n);
              });
              return u(n, t), n;
            },
            clear: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        $(
                          t,
                          n,
                          "DELETE FROM " + n.storeName,
                          [],
                          function () {
                            e();
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            length: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        $(
                          t,
                          n,
                          "SELECT COUNT(key) as c FROM " + n.storeName,
                          [],
                          function (t, r) {
                            var n = r.rows.item(0).c;
                            e(n);
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            key: function (e, t) {
              var r = this,
                n = new i(function (t, n) {
                  r.ready()
                    .then(function () {
                      var o = r._dbInfo;
                      o.db.transaction(function (r) {
                        $(
                          r,
                          o,
                          "SELECT key FROM " +
                            o.storeName +
                            " WHERE id = ? LIMIT 1",
                          [e + 1],
                          function (e, r) {
                            var n = r.rows.length ? r.rows.item(0).key : null;
                            t(n);
                          },
                          function (e, t) {
                            n(t);
                          }
                        );
                      });
                    })
                    .catch(n);
                });
              return u(n, t), n;
            },
            keys: function (e) {
              var t = this,
                r = new i(function (e, r) {
                  t.ready()
                    .then(function () {
                      var n = t._dbInfo;
                      n.db.transaction(function (t) {
                        $(
                          t,
                          n,
                          "SELECT key FROM " + n.storeName,
                          [],
                          function (t, r) {
                            for (var n = [], o = 0; o < r.rows.length; o++)
                              n.push(r.rows.item(o).key);
                            e(n);
                          },
                          function (e, t) {
                            r(t);
                          }
                        );
                      });
                    })
                    .catch(r);
                });
              return u(r, e), r;
            },
            dropInstance: function (e, t) {
              t = c.apply(this, arguments);
              var r = this.config();
              (e = ("function" != typeof e && e) || {}).name ||
                ((e.name = e.name || r.name),
                (e.storeName = e.storeName || r.storeName));
              var n,
                o = this;
              return (
                u(
                  (n = e.name
                    ? new i(function (t) {
                        var n;
                        (n =
                          e.name === r.name
                            ? o._dbInfo.db
                            : openDatabase(e.name, "", "", 0)),
                          e.storeName
                            ? t({ db: n, storeNames: [e.storeName] })
                            : t(
                                (function (e) {
                                  return new i(function (t, r) {
                                    e.transaction(
                                      function (n) {
                                        n.executeSql(
                                          "SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",
                                          [],
                                          function (r, n) {
                                            for (
                                              var o = [], a = 0;
                                              a < n.rows.length;
                                              a++
                                            )
                                              o.push(n.rows.item(a).name);
                                            t({ db: e, storeNames: o });
                                          },
                                          function (e, t) {
                                            r(t);
                                          }
                                        );
                                      },
                                      function (e) {
                                        r(e);
                                      }
                                    );
                                  });
                                })(n)
                              );
                      }).then(function (e) {
                        return new i(function (t, r) {
                          e.db.transaction(
                            function (n) {
                              function o(e) {
                                return new i(function (t, r) {
                                  n.executeSql(
                                    "DROP TABLE IF EXISTS " + e,
                                    [],
                                    function () {
                                      t();
                                    },
                                    function (e, t) {
                                      r(t);
                                    }
                                  );
                                });
                              }
                              for (
                                var a = [], u = 0, s = e.storeNames.length;
                                u < s;
                                u++
                              )
                                a.push(o(e.storeNames[u]));
                              i.all(a)
                                .then(function () {
                                  t();
                                })
                                .catch(function (e) {
                                  r(e);
                                });
                            },
                            function (e) {
                              r(e);
                            }
                          );
                        });
                      })
                    : i.reject("Invalid arguments")),
                  t
                ),
                n
              );
            },
          };
          function ee(e, t) {
            var r = e.name + "/";
            return e.storeName !== t.storeName && (r += e.storeName + "/"), r;
          }
          function te() {
            return (
              !(function () {
                try {
                  return (
                    localStorage.setItem("_localforage_support_test", !0),
                    localStorage.removeItem("_localforage_support_test"),
                    !1
                  );
                } catch (e) {
                  return !0;
                }
              })() || localStorage.length > 0
            );
          }
          var re = {
              _driver: "localStorageWrapper",
              _initStorage: function (e) {
                var t = {};
                if (e) for (var r in e) t[r] = e[r];
                return (
                  (t.keyPrefix = ee(e, this._defaultConfig)),
                  te()
                    ? ((this._dbInfo = t), (t.serializer = J), i.resolve())
                    : i.reject()
                );
              },
              _support: (function () {
                try {
                  return (
                    "undefined" != typeof localStorage &&
                    "setItem" in localStorage &&
                    !!localStorage.setItem
                  );
                } catch (e) {
                  return !1;
                }
              })(),
              iterate: function (e, t) {
                var r = this,
                  n = r.ready().then(function () {
                    for (
                      var t = r._dbInfo,
                        n = t.keyPrefix,
                        o = n.length,
                        a = localStorage.length,
                        i = 1,
                        u = 0;
                      u < a;
                      u++
                    ) {
                      var s = localStorage.key(u);
                      if (0 === s.indexOf(n)) {
                        var l = localStorage.getItem(s);
                        if (
                          (l && (l = t.serializer.deserialize(l)),
                          void 0 !== (l = e(l, s.substring(o), i++)))
                        )
                          return l;
                      }
                    }
                  });
                return u(n, t), n;
              },
              getItem: function (e, t) {
                var r = this;
                e = l(e);
                var n = r.ready().then(function () {
                  var t = r._dbInfo,
                    n = localStorage.getItem(t.keyPrefix + e);
                  return n && (n = t.serializer.deserialize(n)), n;
                });
                return u(n, t), n;
              },
              setItem: function (e, t, r) {
                var n = this;
                e = l(e);
                var o = n.ready().then(function () {
                  void 0 === t && (t = null);
                  var r = t;
                  return new i(function (o, a) {
                    var i = n._dbInfo;
                    i.serializer.serialize(t, function (t, n) {
                      if (n) a(n);
                      else
                        try {
                          localStorage.setItem(i.keyPrefix + e, t), o(r);
                        } catch (e) {
                          ("QuotaExceededError" !== e.name &&
                            "NS_ERROR_DOM_QUOTA_REACHED" !== e.name) ||
                            a(e),
                            a(e);
                        }
                    });
                  });
                });
                return u(o, r), o;
              },
              removeItem: function (e, t) {
                var r = this;
                e = l(e);
                var n = r.ready().then(function () {
                  var t = r._dbInfo;
                  localStorage.removeItem(t.keyPrefix + e);
                });
                return u(n, t), n;
              },
              clear: function (e) {
                var t = this,
                  r = t.ready().then(function () {
                    for (
                      var e = t._dbInfo.keyPrefix, r = localStorage.length - 1;
                      r >= 0;
                      r--
                    ) {
                      var n = localStorage.key(r);
                      0 === n.indexOf(e) && localStorage.removeItem(n);
                    }
                  });
                return u(r, e), r;
              },
              length: function (e) {
                var t = this.keys().then(function (e) {
                  return e.length;
                });
                return u(t, e), t;
              },
              key: function (e, t) {
                var r = this,
                  n = r.ready().then(function () {
                    var t,
                      n = r._dbInfo;
                    try {
                      t = localStorage.key(e);
                    } catch (e) {
                      t = null;
                    }
                    return t && (t = t.substring(n.keyPrefix.length)), t;
                  });
                return u(n, t), n;
              },
              keys: function (e) {
                var t = this,
                  r = t.ready().then(function () {
                    for (
                      var e = t._dbInfo, r = localStorage.length, n = [], o = 0;
                      o < r;
                      o++
                    ) {
                      var a = localStorage.key(o);
                      0 === a.indexOf(e.keyPrefix) &&
                        n.push(a.substring(e.keyPrefix.length));
                    }
                    return n;
                  });
                return u(r, e), r;
              },
              dropInstance: function (e, t) {
                if (
                  ((t = c.apply(this, arguments)),
                  !(e = ("function" != typeof e && e) || {}).name)
                ) {
                  var r = this.config();
                  (e.name = e.name || r.name),
                    (e.storeName = e.storeName || r.storeName);
                }
                var n,
                  o = this;
                return (
                  u(
                    (n = e.name
                      ? new i(function (t) {
                          e.storeName
                            ? t(ee(e, o._defaultConfig))
                            : t(e.name + "/");
                        }).then(function (e) {
                          for (var t = localStorage.length - 1; t >= 0; t--) {
                            var r = localStorage.key(t);
                            0 === r.indexOf(e) && localStorage.removeItem(r);
                          }
                        })
                      : i.reject("Invalid arguments")),
                    t
                  ),
                  n
                );
              },
            },
            ne = function (e, t) {
              for (var r, n, o = e.length, a = 0; a < o; ) {
                if (
                  (r = e[a]) === (n = t) ||
                  ("number" == typeof r &&
                    "number" == typeof n &&
                    isNaN(r) &&
                    isNaN(n))
                )
                  return !0;
                a++;
              }
              return !1;
            },
            oe =
              Array.isArray ||
              function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              },
            ae = {},
            ie = {},
            ue = { INDEXEDDB: D, WEBSQL: Z, LOCALSTORAGE: re },
            se = [
              ue.INDEXEDDB._driver,
              ue.WEBSQL._driver,
              ue.LOCALSTORAGE._driver,
            ],
            le = ["dropInstance"],
            ce = [
              "clear",
              "getItem",
              "iterate",
              "key",
              "keys",
              "length",
              "removeItem",
              "setItem",
            ].concat(le),
            de = {
              description: "",
              driver: se.slice(),
              name: "localforage",
              size: 4980736,
              storeName: "keyvaluepairs",
              version: 1,
            };
          function fe(e, t) {
            e[t] = function () {
              var r = arguments;
              return e.ready().then(function () {
                return e[t].apply(e, r);
              });
            };
          }
          function me() {
            for (var e = 1; e < arguments.length; e++) {
              var t = arguments[e];
              if (t)
                for (var r in t)
                  t.hasOwnProperty(r) &&
                    (oe(t[r])
                      ? (arguments[0][r] = t[r].slice())
                      : (arguments[0][r] = t[r]));
            }
            return arguments[0];
          }
          var pe = new ((function () {
            function e(t) {
              for (var r in ((function (e, t) {
                if (!(e instanceof t))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              ue))
                if (ue.hasOwnProperty(r)) {
                  var n = ue[r],
                    o = n._driver;
                  (this[r] = o), ae[o] || this.defineDriver(n);
                }
              (this._defaultConfig = me({}, de)),
                (this._config = me({}, this._defaultConfig, t)),
                (this._driverSet = null),
                (this._initDriver = null),
                (this._ready = !1),
                (this._dbInfo = null),
                this._wrapLibraryMethodsWithReady(),
                this.setDriver(this._config.driver).catch(function () {});
            }
            return (
              (e.prototype.config = function (e) {
                if ("object" === (void 0 === e ? "undefined" : n(e))) {
                  if (this._ready)
                    return new Error(
                      "Can't call config() after localforage has been used."
                    );
                  for (var t in e) {
                    if (
                      ("storeName" === t && (e[t] = e[t].replace(/\W/g, "_")),
                      "version" === t && "number" != typeof e[t])
                    )
                      return new Error("Database version must be a number.");
                    this._config[t] = e[t];
                  }
                  return (
                    !("driver" in e && e.driver) ||
                    this.setDriver(this._config.driver)
                  );
                }
                return "string" == typeof e ? this._config[e] : this._config;
              }),
              (e.prototype.defineDriver = function (e, t, r) {
                var n = new i(function (t, r) {
                  try {
                    var n = e._driver,
                      o = new Error(
                        "Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"
                      );
                    if (!e._driver) return void r(o);
                    for (
                      var a = ce.concat("_initStorage"), s = 0, l = a.length;
                      s < l;
                      s++
                    ) {
                      var c = a[s];
                      if ((!ne(le, c) || e[c]) && "function" != typeof e[c])
                        return void r(o);
                    }
                    !(function () {
                      for (
                        var t = function (e) {
                            return function () {
                              var t = new Error(
                                  "Method " +
                                    e +
                                    " is not implemented by the current driver"
                                ),
                                r = i.reject(t);
                              return u(r, arguments[arguments.length - 1]), r;
                            };
                          },
                          r = 0,
                          n = le.length;
                        r < n;
                        r++
                      ) {
                        var o = le[r];
                        e[o] || (e[o] = t(o));
                      }
                    })();
                    var d = function (r) {
                      ae[n] &&
                        console.info("Redefining LocalForage driver: " + n),
                        (ae[n] = e),
                        (ie[n] = r),
                        t();
                    };
                    "_support" in e
                      ? e._support && "function" == typeof e._support
                        ? e._support().then(d, r)
                        : d(!!e._support)
                      : d(!0);
                  } catch (e) {
                    r(e);
                  }
                });
                return s(n, t, r), n;
              }),
              (e.prototype.driver = function () {
                return this._driver || null;
              }),
              (e.prototype.getDriver = function (e, t, r) {
                var n = ae[e]
                  ? i.resolve(ae[e])
                  : i.reject(new Error("Driver not found."));
                return s(n, t, r), n;
              }),
              (e.prototype.getSerializer = function (e) {
                var t = i.resolve(J);
                return s(t, e), t;
              }),
              (e.prototype.ready = function (e) {
                var t = this,
                  r = t._driverSet.then(function () {
                    return (
                      null === t._ready && (t._ready = t._initDriver()),
                      t._ready
                    );
                  });
                return s(r, e, e), r;
              }),
              (e.prototype.setDriver = function (e, t, r) {
                var n = this;
                oe(e) || (e = [e]);
                var o = this._getSupportedDrivers(e);
                function a() {
                  n._config.driver = n.driver();
                }
                function u(e) {
                  return (
                    n._extend(e),
                    a(),
                    (n._ready = n._initStorage(n._config)),
                    n._ready
                  );
                }
                var l =
                  null !== this._driverSet
                    ? this._driverSet.catch(function () {
                        return i.resolve();
                      })
                    : i.resolve();
                return (
                  (this._driverSet = l
                    .then(function () {
                      var e = o[0];
                      return (
                        (n._dbInfo = null),
                        (n._ready = null),
                        n.getDriver(e).then(function (e) {
                          (n._driver = e._driver),
                            a(),
                            n._wrapLibraryMethodsWithReady(),
                            (n._initDriver = (function (e) {
                              return function () {
                                var t = 0;
                                return (function r() {
                                  for (; t < e.length; ) {
                                    var o = e[t];
                                    return (
                                      t++,
                                      (n._dbInfo = null),
                                      (n._ready = null),
                                      n.getDriver(o).then(u).catch(r)
                                    );
                                  }
                                  a();
                                  var s = new Error(
                                    "No available storage method found."
                                  );
                                  return (
                                    (n._driverSet = i.reject(s)), n._driverSet
                                  );
                                })();
                              };
                            })(o));
                        })
                      );
                    })
                    .catch(function () {
                      a();
                      var e = new Error("No available storage method found.");
                      return (n._driverSet = i.reject(e)), n._driverSet;
                    })),
                  s(this._driverSet, t, r),
                  this._driverSet
                );
              }),
              (e.prototype.supports = function (e) {
                return !!ie[e];
              }),
              (e.prototype._extend = function (e) {
                me(this, e);
              }),
              (e.prototype._getSupportedDrivers = function (e) {
                for (var t = [], r = 0, n = e.length; r < n; r++) {
                  var o = e[r];
                  this.supports(o) && t.push(o);
                }
                return t;
              }),
              (e.prototype._wrapLibraryMethodsWithReady = function () {
                for (var e = 0, t = ce.length; e < t; e++) fe(this, ce[e]);
              }),
              (e.prototype.createInstance = function (t) {
                return new e(t);
              }),
              e
            );
          })())();
          t.exports = pe;
        },
        { 3: 3 },
      ],
    },
    {},
    [4]
  )(4);
});
var player = document.querySelector("desmond-player");
if (player) {
  var shadow = player.attachShadow({ mode: "open" });
  shadow.innerHTML =
    '<div id="player">\n        <canvas id="top" width="256" height="192"></canvas>\n        <canvas id="bottom" width="256" height="192"></canvas>';
  var getFileBlob = function (e, t) {
      var r = new XMLHttpRequest();
      r.open("GET", e),
        (r.responseType = "blob"),
        r.addEventListener("load", function () {
          t(r.response);
        }),
        r.send();
    },
    blobToFile = function (e, t) {
      return (e.lastModifiedDate = new Date()), (e.name = t), e;
    },
    getFileObject = function (e, t) {
      getFileBlob(e, function (e) {
        t(blobToFile(e, "test.jpg"));
      });
    };
  function loadURL(e, t) {
    getFileObject(e, function (e) {
      console.log(e), tryLoadROM(e), status(), t();
    });
  }
  function status() {
    console.log("loaded");
  }
  player.loadURL = function (e, t) {
    (player.enableMicrophone = function () {
      var e = Module._realloc(0, 4096),
        t = Module.HEAPU8.subarray(e, e + 4096);
      console.log(e, t),
        navigator.mediaDevices
          .getUserMedia({ audio: !0, video: !1 })
          .then(function (r) {
            var n = new AudioContext(),
              o = n.createMediaStreamSource(r),
              a = n.createScriptProcessor(2048, 1, 1);
            o.connect(a),
              (a.onaudioprocess = function (r) {
                for (
                  var n = r.inputBuffer.getChannelData(0), o = 0, a = 0;
                  a <= 2045;
                  a += 3
                ) {
                  var i = Math.floor(
                    64 * ((n[a] + n[a + 1] + n[a + 2]) / 3 + 1)
                  );
                  i > 127 ? (i = 127) : i < 0 && (i = 0), (t[o++] = i);
                }
                Module._micWriteSamples(e, 682);
                for (var u = 0; u < 1; u++)
                  for (
                    n = r.outputBuffer.getChannelData(u), a = 0;
                    a < 2048;
                    a++
                  )
                    n[a] = 0;
              }),
              a.connect(n.destination);
          });
    }),
      t ? loadURL(e, t) : loadURL(e);
  };
  var plugins = {},
    config = {
      swapTopBottom: !1,
      swapTopBottomL: !1,
      powerSave: !0,
      micWhenR: !0,
      vkEnabled: !0,
    };
  function loadConfig() {
    var e = JSON.parse(window.localStorage.config || "{}");
    for (var t in e) config[t] = e[t];
  }
  function uiSaveConfig() {
    window.localStorage.config = JSON.stringify(config);
  }
  function uiMenuBack() {
    uiSaveConfig(),
      emuIsGameLoaded ? uiSwitchTo("player") : uiSwitchTo("welcome");
  }
  function uiSaveBackup() {
    localforage.getItem("sav-" + gameID).then((e) => {
      var t = new Blob([e], { type: "application/binary" }),
        r = document.createElement("a");
      (r.href = window.URL.createObjectURL(t)),
        (r.download = "sav-" + gameID + ".dsv"),
        r.click();
    });
  }
  async function uiSaveRestore() {
    var e = $id("restore-file").files[0];
    if (e)
      if (e.size > 2306867.2) alert("Too large! It should not be a save file.");
      else {
        var t = new Uint8Array(await e.arrayBuffer());
        localforage.setItem("sav-" + gameID, t).then(() => {
          alert("Save file loaded."), location.reload();
        });
      }
  }
  function $id(e) {
    return document.getElementById(e);
  }
  loadConfig();
  var isIOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
    isWebApp = navigator.standalone || !1,
    isSaveSupported = !0,
    isSaveNagAppeared = !1;
  if (isIOS && !isWebApp) {
    isSaveSupported = !1;
    var divIosHint = $id("ios-hint");
    (divIosHint.hidden = !1),
      (divIosHint.style =
        "position: absolute; bottom: " + divIosHint.clientHeight + "px;");
  }
  var emuKeyState = new Array(14);
  const e = [
    "right",
    "left",
    "down",
    "up",
    "select",
    "start",
    "b",
    "a",
    "y",
    "x",
    "l",
    "r",
    "debug",
    "lid",
  ];
  for (
    var vkStickPos, vkMap = {}, vkState = {}, keyNameToKeyId = {}, i = 0;
    i < e.length;
    i++
  )
    keyNameToKeyId[e[i]] = i;
  var isLandscape = !1;
  // ! REMAP KEYBOARD INPUT HERE!!!
  // ! ----------------------------------------
  const t = [68, 65, 83, 87, 16, 13, 75, 76, 73, 79, 81, 80, -1, 8];
  // const tKeyNames = [
  //   "D",           // 68 → right
  //   "A",           // 65 → left
  //   "S",           // 83 → down
  //   "W",           // 87 → up
  //   "Shift",       // 16 → select
  //   "Enter",       // 13 → start
  //   "K",           // 75 → b
  //   "L",           // 76 → a
  //   "I",           // 73 → y
  //   "O",           // 79 → x
  //   "Q",           // 81 → l
  //   "P",           // 80 → r
  //   "Unknown",     // -1 → debug (not mapped to a real key)
  //   "Backspace"    // 8  → lid
  // ];
  // ! ----------------------------------------
  var audioContext,
    audioBuffer,
    audioWorkletNode,
    fbSize,
    emuGameID = "unknown",
    emuIsRunning = !1,
    emuIsGameLoaded = !1,
    fileInput = $id("rom"),
    romSize = 0,
    FB = [0, 0],
    screenCanvas = [
      shadow.getElementById("top"),
      shadow.getElementById("bottom"),
    ],
    ctx2d = screenCanvas.map((e) => e.getContext("2d", { alpha: !1 })),
    tmpAudioBuffer = new Int16Array(32768),
    frameCount = 0,
    touched = 0,
    touchX = 0,
    touchY = 0,
    prevSaveFlag = 0,
    lastTwoFrameTime = 10;
  function callPlugin(e, t) {
    for (var r in plugins) plugins[r].handler && plugins[r].handler(e, t);
  }
  function showMsg(e) {
    (document.getElementById("msg-text").innerText = e),
      (document.getElementById("msg-layer").hidden = !1),
      setTimeout(function () {
        document.getElementById("msg-layer").hidden = !0;
      }, 1e3);
  }
  function emuRunFrame() {
    processGamepadInput();
    for (var e = 0, t = 0; t < 14; t++) emuKeyState[t] && (e |= 1 << t);
    if (
      (emuKeyState[11] && (console.log("mic"), (e |= 16384)),
      config.powerSave && Module._runFrame(0, e, touched, touchX, touchY),
      Module._runFrame(1, e, touched, touchX, touchY),
      ctx2d[0].putImageData(FB[0], 0, 0),
      ctx2d[1].putImageData(FB[1], 0, 0),
      audioWorkletNode)
    )
      try {
        var r = Module._fillAudioBuffer(4096);
        tmpAudioBuffer.set(audioBuffer.subarray(0, 2 * r)),
          audioWorkletNode.port.postMessage(tmpAudioBuffer.subarray(0, 2 * r));
      } catch (e) {
        console.log(e);
      }
    frameCount += 1;
  }
  function wasmReady() {
    Module._setSampleRate(47860);
  }
  function checkSaveGame() {
    var e = Module._savUpdateChangeFlag();
    if (0 == e && 1 == prevSaveFlag) {
      var t = Module._savGetSize();
      if (t > 0 && isSaveSupported) {
        var r = Module._savGetPointer(0),
          n = new Uint8Array(t);
        n.set(Module.HEAPU8.subarray(r, r + t)),
          localforage.setItem("sav-" + gameID, n),
          showMsg("Auto saving...");
      }
    }
    prevSaveFlag = e;
  }
  async function tryLoadROM(e) {
    if (e && !(e.size < 1024)) {
      var t = new Uint8Array(await e.slice(0, 1024).arrayBuffer());
      gameID = "";
      for (var r = 0; r < 16; r++)
        gameID += 0 == t[r] ? " " : String.fromCharCode(t[r]);
      "#" == gameID[12] && (gameID = e.name),
        console.log("gameID", gameID),
        (romSize = e.size);
      var n = Module._prepareRomBuffer(romSize);
      console.log(romSize, n),
        Module.HEAPU8.set(new Uint8Array(await e.arrayBuffer()), n);
      var o = await localforage.getItem("sav-" + gameID);
      if (
        (o && Module.HEAPU8.set(o, Module._savGetPointer(o.length)),
        Module._savUpdateChangeFlag(),
        1 == Module._loadROM(romSize))
      ) {
        ptrFrontBuffer = Module._getSymbol(5);
        var a = Module._getSymbol(4);
        for (r = 0; r < 2; r++)
          FB[r] = new ImageData(
            new Uint8ClampedArray(Module.HEAPU8.buffer).subarray(
              a + 196608 * r,
              a + 196608 * (r + 1)
            ),
            256,
            192
          );
        var i = Module._getSymbol(6);
        (audioBuffer = new Int16Array(Module.HEAPU8.buffer).subarray(
          i / 2,
          i / 2 + 32768
        )),
          console.log("Start!!!"),
          (emuIsGameLoaded = !0),
          (emuIsRunning = !0),
          (shadow.querySelector("#player").hidden = !1),
          callPlugin("loaded", gameID);
      } else alert("LoadROM failed.");
    }
  }
  function tryInitSound() {
    try {
      if (audioContext)
        return void ("running" != audioContext.state && audioContext.resume());
      (audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 1e-4,
        sampleRate: 48e3,
      })).audioWorklet
        ? audioContext.audioWorklet
            .addModule(
              URL.createObjectURL(
                new Blob(
                  [
                    "class MyAudioWorklet extends AudioWorkletProcessor {\n    constructor() {\n        super()\n        this.FIFO_CAP = 5000\n        this.fifo0 = new Int16Array(this.FIFO_CAP)\n        this.fifo1 = new Int16Array(this.FIFO_CAP)\n        this.fifoHead = 0\n        this.fifoLen = 0\n        this.port.onmessage = (e) => {\n            //console.log(this.fifoLen)\n            var buf = e.data\n            var samplesReceived = buf.length / 2\n            if (this.fifoLen + samplesReceived >= this.FIFO_CAP) {\n                console.log('o')\n                return\n            }\n\n            for (var i = 0; i < buf.length; i+=2) {\n                this.fifoEnqueue(buf[i], buf[i+1])\n            }\n        }\n    }\n\n    fifoDequeue() {\n        this.fifoHead += 1\n        this.fifoHead %= this.FIFO_CAP\n        this.fifoLen -= 1\n    }\n\n    fifoEnqueue(a, b) {\n        const pos = (this.fifoHead + this.fifoLen) % this.FIFO_CAP\n        this.fifo0[pos] = a\n        this.fifo1[pos] = b\n        this.fifoLen += 1\n    }\n\n    process(inputs, outputs, parameters) {\n        const output = outputs[0]\n        const chan0 = output[0]\n        const chan1 = output[1]\n\n        for (var i = 0; i < chan0.length; i++) {\n            if (this.fifoLen < 1) {\n                console.log(\"u\")\n                break\n            }\n            chan0[i] = this.fifo0[this.fifoHead] / 32768.0\n            chan1[i] = this.fifo1[this.fifoHead] / 32768.0\n            this.fifoDequeue()\n        }\n        return true\n    }\n}\n\nregisterProcessor('my-worklet', MyAudioWorklet)",
                  ],
                  { type: "text/javascript" }
                )
              )
            )
            .then(() => {
              (audioWorkletNode = new AudioWorkletNode(
                audioContext,
                "my-worklet",
                { outputChannelCount: [2] }
              )).connect(audioContext.destination);
            })
        : alert("AudioWorklet is not supported in your browser..."),
        audioContext.resume();
    } catch (e) {
      console.log(e);
    }
  }
  var prevRunFrameTime = performance.now();
  function emuLoop() {
    if ((window.requestAnimationFrame(emuLoop), emuIsRunning)) {
      if (config.powerSave && performance.now() - prevRunFrameTime < 32) return;
      (prevRunFrameTime = performance.now()), emuRunFrame();
    }
  }
  emuLoop();
  var stickTouchID = null,
    tpadTouchID = null;
  function isPointInRect(e, t, r) {
    return e >= r.x && e < r.x + r.width && t >= r.y && t < r.y + r.height;
  }
  function clamp01(e) {
    return e < 0 ? 0 : e > 1 ? 1 : e;
  }
  function handleTouch(t) {
    if ((tryInitSound(), emuIsRunning)) {
      t.preventDefault(), t.stopPropagation();
      for (
        var r = !1,
          n = 0,
          o = 0,
          a = !1,
          i = vkStickPos[0],
          u = vkStickPos[1],
          s = vkStickPos[2],
          l = vkStickPos[3],
          c = 0.4 * s,
          d = null,
          f = null,
          m = screenCanvas[1].getBoundingClientRect(),
          p = 0;
        p < emuKeyState.length;
        p++
      )
        emuKeyState[p] = !1;
      for (var h in vkState) vkState[h][1] = 0;
      for (p = 0; p < t.touches.length; p++) {
        var _ = t.touches[p],
          v = _.identifier;
        h = (g = document.elementFromPoint(_.clientX, _.clientY))
          ? g.getAttribute("data-k")
          : null;
        if (v === stickTouchID || (g == vkMap.stick && v != tpadTouchID)) {
          !0, (vkState.stick[1] = 1);
          var S = _.clientX,
            y = _.clientY;
          S < u - c && (emuKeyState[1] = !0),
            S > u + c && (emuKeyState[0] = !0),
            y < i - c && (emuKeyState[3] = !0),
            y > i + c && (emuKeyState[2] = !0),
            (S = Math.max(u - s / 2, S)),
            (S = Math.min(u + s / 2, S)),
            (y = Math.max(i - l / 2, y)),
            (u = S),
            (i = y = Math.min(i + l / 2, y)),
            (a = !0),
            (d = v);
        } else
          v === tpadTouchID || (isPointInRect(_.clientX, _.clientY, m) && !h)
            ? ((r = !0),
              (n = 256 * clamp01((_.clientX - m.x) / m.width)),
              (o = 192 * clamp01((_.clientY - m.y) / m.height)),
              (f = v))
            : h && (vkState[h][1] = 1);
      }
      for (var h in ((touched = r ? 1 : 0),
      (touchX = n),
      (touchY = o),
      vkState))
        if (vkState[h][0] != vkState[h][1]) {
          var g = vkMap[h];
          (vkState[h][0] = vkState[h][1]),
            vkState[h][1]
              ? (g.classList.add("vk-touched"),
                "menu" == h && uiSwitchTo("menu"))
              : (g.classList.remove("vk-touched"), "stick" == h && (a = !0));
        }
      for (p = 0; p < emuKeyState.length; p++) {
        h = e[p];
        vkState[h] && vkState[h][1] && (emuKeyState[p] = !0);
      }
      a &&
        (vkMap.stick.style = makeVKStyle(
          i - s / 2,
          u - s / 2,
          s,
          l,
          vkStickPos[4]
        )),
        (stickTouchID = d),
        (tpadTouchID = f);
    }
  }
  function convertKeyCode(e) {
    for (var r = 0; r < 14; r++) if (e == t[r]) return r;
    return -1;
  }
  [
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "touchenter",
    "touchleave",
  ].forEach((e) => {
    window.addEventListener(e, handleTouch);
  }),
    (window.onmousedown =
      window.onmouseup =
      window.onmousemove =
        (e) => {
          if (emuIsRunning) {
            "mousedown" == e.type && tryInitSound();
            var t = screenCanvas[1].getBoundingClientRect();
            e.preventDefault(), e.stopPropagation();
            var r = 0 != e.buttons && isPointInRect(e.clientX, e.clientY, t),
              n = ((e.clientX - t.x) / t.width) * 256,
              o = ((e.clientY - t.y) / t.height) * 192;
            (touched = r ? 1 : 0), (touchX = n), (touchY = o);
          }
        }),
    (window.onkeydown = window.onkeyup =
      (e) => {
        if (emuIsRunning) {
          e.preventDefault();
          var t = "keydown" === e.type,
            r = convertKeyCode(e.keyCode);
          r >= 0 && (emuKeyState[r] = t), 27 == e.keyCode && uiSwitchTo("menu");
        }
      });
  var currentConnectedGamepad = -1,
    gamePadKeyMap = {
      a: 1,
      b: 0,
      x: 3,
      y: 2,
      l: 4,
      r: 5,
      select: 9,
      start: 16,
      up: 12,
      down: 13,
      left: 14,
      right: 15,
    };
  function processGamepadInput() {
    if (!(currentConnectedGamepad < 0)) {
      var e = navigator.getGamepads()[currentConnectedGamepad];
      if (!e)
        return (
          showMsg("Gamepad disconnected."), void (currentConnectedGamepad = -1)
        );
      for (var t = 0; t < emuKeyState.length; t++) emuKeyState[t] = !1;
      for (var r in gamePadKeyMap)
        e.buttons[gamePadKeyMap[r]].pressed &&
          (emuKeyState[keyNameToKeyId[r]] = !0);
      e.axes[0] < -0.5 && (emuKeyState[keyNameToKeyId.left] = !0),
        e.axes[0] > 0.5 && (emuKeyState[keyNameToKeyId.right] = !0),
        e.axes[1] < -0.5 && (emuKeyState[keyNameToKeyId.up] = !0),
        e.axes[1] > 0.5 && (emuKeyState[keyNameToKeyId.down] = !0);
    }
  }
  function whatsNew() {
    alert("\n1. Added setting option to hide the virtual keyboard.\n");
  }
  window.addEventListener("gamepadconnected", function (e) {
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    ),
      showMsg("Gamepad connected."),
      (currentConnectedGamepad = e.gamepad.index);
  });
} else console.log("No Desmond player found!");
var read_,
  readAsync,
  readBinary,
  setWindowTitle,
  fs,
  nodePath,
  requireNodeFS,
  Module = void 0 !== Module ? Module : {},
  moduleOverrides = Object.assign({}, Module),
  arguments_ = [],
  thisProgram = "./this.program",
  quit_ = (e, t) => {
    throw t;
  },
  ENVIRONMENT_IS_WEB = "object" == typeof window,
  ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
  ENVIRONMENT_IS_NODE =
    "object" == typeof process &&
    "object" == typeof process.versions &&
    "string" == typeof process.versions.node,
  scriptDirectory = "";
function locateFile(e) {
  return Module.locateFile
    ? Module.locateFile(e, scriptDirectory)
    : scriptDirectory + e;
}
function logExceptionOnExit(e) {
  if (e instanceof ExitStatus) return;
  err("exiting due to exception: " + e);
}
ENVIRONMENT_IS_NODE
  ? ((scriptDirectory = ENVIRONMENT_IS_WORKER
      ? require("path").dirname(scriptDirectory) + "/"
      : __dirname + "/"),
    (requireNodeFS = () => {
      nodePath || ((fs = require("fs")), (nodePath = require("path")));
    }),
    (read_ = function (e, t) {
      return (
        requireNodeFS(),
        (e = nodePath.normalize(e)),
        fs.readFileSync(e, t ? void 0 : "utf8")
      );
    }),
    (readBinary = (e) => {
      var t = read_(e, !0);
      return t.buffer || (t = new Uint8Array(t)), t;
    }),
    (readAsync = (e, t, r) => {
      requireNodeFS(),
        (e = nodePath.normalize(e)),
        fs.readFile(e, function (e, n) {
          e ? r(e) : t(n.buffer);
        });
    }),
    process.argv.length > 1 &&
      (thisProgram = process.argv[1].replace(/\\/g, "/")),
    (arguments_ = process.argv.slice(2)),
    "undefined" != typeof module && (module.exports = Module),
    process.on("uncaughtException", function (e) {
      if (!(e instanceof ExitStatus)) throw e;
    }),
    process.on("unhandledRejection", function (e) {
      throw e;
    }),
    (quit_ = (e, t) => {
      if (keepRuntimeAlive()) throw ((process.exitCode = e), t);
      logExceptionOnExit(t), process.exit(e);
    }),
    (Module.inspect = function () {
      return "[Emscripten Module object]";
    }))
  : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
    (ENVIRONMENT_IS_WORKER
      ? (scriptDirectory = self.location.href)
      : "undefined" != typeof document &&
        document.currentScript &&
        (scriptDirectory = document.currentScript.src),
    (scriptDirectory =
      0 !== scriptDirectory.indexOf("blob:")
        ? scriptDirectory.substr(
            0,
            scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1
          )
        : ""),
    (read_ = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }),
    ENVIRONMENT_IS_WORKER &&
      (readBinary = (e) => {
        var t = new XMLHttpRequest();
        return (
          t.open("GET", e, !1),
          (t.responseType = "arraybuffer"),
          t.send(null),
          new Uint8Array(t.response)
        );
      }),
    (readAsync = (e, t, r) => {
      var n = new XMLHttpRequest();
      n.open("GET", e, !0),
        (n.responseType = "arraybuffer"),
        (n.onload = () => {
          200 == n.status || (0 == n.status && n.response)
            ? t(n.response)
            : r();
        }),
        (n.onerror = r),
        n.send(null);
    }),
    (setWindowTitle = (e) => (document.title = e)));
var out = Module.print || console.log.bind(console),
  err = Module.printErr || console.warn.bind(console);
Object.assign(Module, moduleOverrides),
  (moduleOverrides = null),
  Module.arguments && (arguments_ = Module.arguments),
  Module.thisProgram && (thisProgram = Module.thisProgram),
  Module.quit && (quit_ = Module.quit);
var wasmBinary,
  tempRet0 = 0,
  setTempRet0 = (e) => {
    tempRet0 = e;
  };
Module.wasmBinary && (wasmBinary = Module.wasmBinary);
var wasmMemory,
  noExitRuntime = Module.noExitRuntime || !0;
"object" != typeof WebAssembly && abort("no native wasm support detected");
var EXITSTATUS,
  ABORT = !1;
function assert(e, t) {
  e || abort(t);
}
var buffer,
  HEAP8,
  HEAPU8,
  HEAP16,
  HEAPU16,
  HEAP32,
  HEAPU32,
  HEAPF32,
  HEAPF64,
  UTF8Decoder =
    "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
function UTF8ArrayToString(e, t, r) {
  for (var n = t + r, o = t; e[o] && !(o >= n); ) ++o;
  if (o - t > 16 && e.subarray && UTF8Decoder)
    return UTF8Decoder.decode(e.subarray(t, o));
  for (var a = ""; t < o; ) {
    var i = e[t++];
    if (128 & i) {
      var u = 63 & e[t++];
      if (192 != (224 & i)) {
        var s = 63 & e[t++];
        if (
          (i =
            224 == (240 & i)
              ? ((15 & i) << 12) | (u << 6) | s
              : ((7 & i) << 18) | (u << 12) | (s << 6) | (63 & e[t++])) < 65536
        )
          a += String.fromCharCode(i);
        else {
          var l = i - 65536;
          a += String.fromCharCode(55296 | (l >> 10), 56320 | (1023 & l));
        }
      } else a += String.fromCharCode(((31 & i) << 6) | u);
    } else a += String.fromCharCode(i);
  }
  return a;
}
function UTF8ToString(e, t) {
  return e ? UTF8ArrayToString(HEAPU8, e, t) : "";
}
function stringToUTF8Array(e, t, r, n) {
  if (!(n > 0)) return 0;
  for (var o = r, a = r + n - 1, i = 0; i < e.length; ++i) {
    var u = e.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((1023 & u) << 10)) | (1023 & e.charCodeAt(++i));
    if (u <= 127) {
      if (r >= a) break;
      t[r++] = u;
    } else if (u <= 2047) {
      if (r + 1 >= a) break;
      (t[r++] = 192 | (u >> 6)), (t[r++] = 128 | (63 & u));
    } else if (u <= 65535) {
      if (r + 2 >= a) break;
      (t[r++] = 224 | (u >> 12)),
        (t[r++] = 128 | ((u >> 6) & 63)),
        (t[r++] = 128 | (63 & u));
    } else {
      if (r + 3 >= a) break;
      (t[r++] = 240 | (u >> 18)),
        (t[r++] = 128 | ((u >> 12) & 63)),
        (t[r++] = 128 | ((u >> 6) & 63)),
        (t[r++] = 128 | (63 & u));
    }
  }
  return (t[r] = 0), r - o;
}
function stringToUTF8(e, t, r) {
  return stringToUTF8Array(e, HEAPU8, t, r);
}
function lengthBytesUTF8(e) {
  for (var t = 0, r = 0; r < e.length; ++r) {
    var n = e.charCodeAt(r);
    n >= 55296 &&
      n <= 57343 &&
      (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++r))),
      n <= 127 ? ++t : (t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4);
  }
  return t;
}
function allocateUTF8(e) {
  var t = lengthBytesUTF8(e) + 1,
    r = _malloc(t);
  return r && stringToUTF8Array(e, HEAP8, r, t), r;
}
function writeArrayToMemory(e, t) {
  HEAP8.set(e, t);
}
function writeAsciiToMemory(e, t, r) {
  for (var n = 0; n < e.length; ++n) HEAP8[t++ >> 0] = e.charCodeAt(n);
  r || (HEAP8[t >> 0] = 0);
}
function updateGlobalBufferAndViews(e) {
  (buffer = e),
    (Module.HEAP8 = HEAP8 = new Int8Array(e)),
    (Module.HEAP16 = HEAP16 = new Int16Array(e)),
    (Module.HEAP32 = HEAP32 = new Int32Array(e)),
    (Module.HEAPU8 = HEAPU8 = new Uint8Array(e)),
    (Module.HEAPU16 = HEAPU16 = new Uint16Array(e)),
    (Module.HEAPU32 = HEAPU32 = new Uint32Array(e)),
    (Module.HEAPF32 = HEAPF32 = new Float32Array(e)),
    (Module.HEAPF64 = HEAPF64 = new Float64Array(e));
}
var wasmTable,
  INITIAL_MEMORY = Module.INITIAL_MEMORY || 681574400,
  __ATPRERUN__ = [],
  __ATINIT__ = [],
  __ATMAIN__ = [],
  __ATPOSTRUN__ = [],
  runtimeInitialized = !1,
  runtimeExited = !1,
  runtimeKeepaliveCounter = 0;
function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
}
function preRun() {
  if (Module.preRun)
    for (
      "function" == typeof Module.preRun && (Module.preRun = [Module.preRun]);
      Module.preRun.length;

    )
      addOnPreRun(Module.preRun.shift());
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  (runtimeInitialized = !0),
    Module.noFSInit || FS.init.initialized || FS.init(),
    (FS.ignorePermissions = !1),
    TTY.init(),
    callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  runtimeExited = !0;
}
function postRun() {
  if (Module.postRun)
    for (
      "function" == typeof Module.postRun &&
      (Module.postRun = [Module.postRun]);
      Module.postRun.length;

    )
      addOnPostRun(Module.postRun.shift());
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(e) {
  __ATPRERUN__.unshift(e);
}
function addOnInit(e) {
  __ATINIT__.unshift(e);
}
function addOnPostRun(e) {
  __ATPOSTRUN__.unshift(e);
}
var runDependencies = 0,
  runDependencyWatcher = null,
  dependenciesFulfilled = null;
function getUniqueRunDependency(e) {
  return e;
}
function addRunDependency(e) {
  runDependencies++,
    Module.monitorRunDependencies &&
      Module.monitorRunDependencies(runDependencies);
}
function removeRunDependency(e) {
  if (
    (runDependencies--,
    Module.monitorRunDependencies &&
      Module.monitorRunDependencies(runDependencies),
    0 == runDependencies &&
      (null !== runDependencyWatcher &&
        (clearInterval(runDependencyWatcher), (runDependencyWatcher = null)),
      dependenciesFulfilled))
  ) {
    var t = dependenciesFulfilled;
    (dependenciesFulfilled = null), t();
  }
}
function abort(e) {
  throw (
    (Module.onAbort && Module.onAbort(e),
    err((e = "Aborted(" + e + ")")),
    (ABORT = !0),
    (EXITSTATUS = 1),
    (e += ". Build with -s ASSERTIONS=1 for more info."),
    new WebAssembly.RuntimeError(e))
  );
}
(Module.preloadedImages = {}), (Module.preloadedAudios = {});
var wasmBinaryFile,
  tempDouble,
  tempI64,
  dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(e) {
  return e.startsWith(dataURIPrefix);
}
function isFileURI(e) {
  return e.startsWith("file://");
}
function getBinary(e) {
  try {
    if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
    if (readBinary) return readBinary(e);
    throw "both async and sync fetching of the wasm failed";
  } catch (e) {
    abort(e);
  }
}
function getBinaryPromise() {
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if ("function" == typeof fetch && !isFileURI(wasmBinaryFile))
      return fetch("https://js-emulators.github.io/desmond/dist/desmond.wasm", {
        credentials: "same-origin",
      })
        .then(function (e) {
          if (!e.ok)
            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
          return e.arrayBuffer();
        })
        .catch(function () {
          return getBinary(wasmBinaryFile);
        });
    if (readAsync)
      return new Promise(function (e, t) {
        readAsync(
          wasmBinaryFile,
          function (t) {
            e(new Uint8Array(t));
          },
          t
        );
      });
  }
  return Promise.resolve().then(function () {
    return getBinary(wasmBinaryFile);
  });
}
function createWasm() {
  var e = { a: asmLibraryArg };
  function t(e, t) {
    var r = e.exports;
    (Module.asm = r),
      updateGlobalBufferAndViews((wasmMemory = Module.asm.x).buffer),
      (wasmTable = Module.asm.S),
      addOnInit(Module.asm.y),
      removeRunDependency("wasm-instantiate");
  }
  function r(e) {
    t(e.instance);
  }
  function n(t) {
    return getBinaryPromise()
      .then(function (t) {
        return WebAssembly.instantiate(t, e);
      })
      .then(function (e) {
        return e;
      })
      .then(t, function (e) {
        err("failed to asynchronously prepare wasm: " + e), abort(e);
      });
  }
  if ((addRunDependency("wasm-instantiate"), Module.instantiateWasm))
    try {
      return Module.instantiateWasm(e, t);
    } catch (e) {
      return err("Module.instantiateWasm callback failed with error: " + e), !1;
    }
  return (
    wasmBinary ||
    "function" != typeof WebAssembly.instantiateStreaming ||
    isDataURI(wasmBinaryFile) ||
    isFileURI(wasmBinaryFile) ||
    "function" != typeof fetch
      ? n(r)
      : fetch("https://js-emulators.github.io/desmond/dist/desmond.wasm", {
          credentials: "same-origin",
        }).then(function (t) {
          return WebAssembly.instantiateStreaming(t, e).then(r, function (e) {
            return (
              err("wasm streaming compile failed: " + e),
              err("falling back to ArrayBuffer instantiation"),
              n(r)
            );
          });
        }),
    {}
  );
}
isDataURI(
  (wasmBinaryFile = "https://js-emulators.github.io/desmond/dist/desmond.wasm")
) || (wasmBinaryFile = wasmBinaryFile);
var ASM_CONSTS = {
  464896: function () {
    wasmReady();
  },
};
function callRuntimeCallbacks(e) {
  for (; e.length > 0; ) {
    var t = e.shift();
    if ("function" != typeof t) {
      var r = t.func;
      "number" == typeof r
        ? void 0 === t.arg
          ? getWasmTableEntry(r)()
          : getWasmTableEntry(r)(t.arg)
        : r(void 0 === t.arg ? null : t.arg);
    } else t(Module);
  }
}
function withStackSave(e) {
  var t = stackSave(),
    r = e();
  return stackRestore(t), r;
}
function demangle(e) {
  return e;
}
function demangleAll(e) {
  return e.replace(/\b_Z[\w\d_]+/g, function (e) {
    var t = demangle(e);
    return e === t ? e : t + " [" + e + "]";
  });
}
(Module.callRuntimeCallbacks = callRuntimeCallbacks),
  (Module.withStackSave = withStackSave),
  (Module.demangle = demangle),
  (Module.demangleAll = demangleAll);
var wasmTableMirror = [];
function getWasmTableEntry(e) {
  var t = wasmTableMirror[e];
  return (
    t ||
      (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1),
      (wasmTableMirror[e] = t = wasmTable.get(e))),
    t
  );
}
function handleException(e) {
  if (e instanceof ExitStatus || "unwind" == e) return EXITSTATUS;
  quit_(1, e);
}
function jsStackTrace() {
  var e = new Error();
  if (!e.stack) {
    try {
      throw new Error();
    } catch (t) {
      e = t;
    }
    if (!e.stack) return "(no stack trace available)";
  }
  return e.stack.toString();
}
function setWasmTableEntry(e, t) {
  wasmTable.set(e, t), (wasmTableMirror[e] = t);
}
function stackTrace() {
  var e = jsStackTrace();
  return (
    Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()),
    demangleAll(e)
  );
}
function ___assert_fail(e, t, r, n) {
  abort(
    "Assertion failed: " +
      UTF8ToString(e) +
      ", at: " +
      [
        t ? UTF8ToString(t) : "unknown filename",
        r,
        n ? UTF8ToString(n) : "unknown function",
      ]
  );
}
function ___cxa_allocate_exception(e) {
  return _malloc(e + 16) + 16;
}
function ExceptionInfo(e) {
  (this.excPtr = e),
    (this.ptr = e - 16),
    (this.set_type = function (e) {
      HEAP32[(this.ptr + 4) >> 2] = e;
    }),
    (this.get_type = function () {
      return HEAP32[(this.ptr + 4) >> 2];
    }),
    (this.set_destructor = function (e) {
      HEAP32[(this.ptr + 8) >> 2] = e;
    }),
    (this.get_destructor = function () {
      return HEAP32[(this.ptr + 8) >> 2];
    }),
    (this.set_refcount = function (e) {
      HEAP32[this.ptr >> 2] = e;
    }),
    (this.set_caught = function (e) {
      (e = e ? 1 : 0), (HEAP8[(this.ptr + 12) >> 0] = e);
    }),
    (this.get_caught = function () {
      return 0 != HEAP8[(this.ptr + 12) >> 0];
    }),
    (this.set_rethrown = function (e) {
      (e = e ? 1 : 0), (HEAP8[(this.ptr + 13) >> 0] = e);
    }),
    (this.get_rethrown = function () {
      return 0 != HEAP8[(this.ptr + 13) >> 0];
    }),
    (this.init = function (e, t) {
      this.set_type(e),
        this.set_destructor(t),
        this.set_refcount(0),
        this.set_caught(!1),
        this.set_rethrown(!1);
    }),
    (this.add_ref = function () {
      var e = HEAP32[this.ptr >> 2];
      HEAP32[this.ptr >> 2] = e + 1;
    }),
    (this.release_ref = function () {
      var e = HEAP32[this.ptr >> 2];
      return (HEAP32[this.ptr >> 2] = e - 1), 1 === e;
    });
}
(Module.wasmTableMirror = wasmTableMirror),
  (Module.getWasmTableEntry = getWasmTableEntry),
  (Module.handleException = handleException),
  (Module.jsStackTrace = jsStackTrace),
  (Module.setWasmTableEntry = setWasmTableEntry),
  (Module.stackTrace = stackTrace),
  (Module.___assert_fail = ___assert_fail),
  (Module.___cxa_allocate_exception = ___cxa_allocate_exception),
  (Module.ExceptionInfo = ExceptionInfo);
var exceptionLast = 0;
Module.exceptionLast = exceptionLast;
var uncaughtExceptionCount = 0;
function ___cxa_throw(e, t, r) {
  throw (
    (new ExceptionInfo(e).init(t, r),
    (exceptionLast = e),
    uncaughtExceptionCount++,
    e)
  );
}
function setErrNo(e) {
  return (HEAP32[___errno_location() >> 2] = e), e;
}
(Module.uncaughtExceptionCount = uncaughtExceptionCount),
  (Module.___cxa_throw = ___cxa_throw),
  (Module.setErrNo = setErrNo);
var PATH = {
  splitPath: function (e) {
    return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
      .exec(e)
      .slice(1);
  },
  normalizeArray: function (e, t) {
    for (var r = 0, n = e.length - 1; n >= 0; n--) {
      var o = e[n];
      "." === o
        ? e.splice(n, 1)
        : ".." === o
        ? (e.splice(n, 1), r++)
        : r && (e.splice(n, 1), r--);
    }
    if (t) for (; r; r--) e.unshift("..");
    return e;
  },
  normalize: function (e) {
    var t = "/" === e.charAt(0),
      r = "/" === e.substr(-1);
    return (
      (e = PATH.normalizeArray(
        e.split("/").filter(function (e) {
          return !!e;
        }),
        !t
      ).join("/")) ||
        t ||
        (e = "."),
      e && r && (e += "/"),
      (t ? "/" : "") + e
    );
  },
  dirname: function (e) {
    var t = PATH.splitPath(e),
      r = t[0],
      n = t[1];
    return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : ".";
  },
  basename: function (e) {
    if ("/" === e) return "/";
    var t = (e = (e = PATH.normalize(e)).replace(/\/$/, "")).lastIndexOf("/");
    return -1 === t ? e : e.substr(t + 1);
  },
  extname: function (e) {
    return PATH.splitPath(e)[3];
  },
  join: function () {
    var e = Array.prototype.slice.call(arguments, 0);
    return PATH.normalize(e.join("/"));
  },
  join2: function (e, t) {
    return PATH.normalize(e + "/" + t);
  },
};
function getRandomDevice() {
  if (
    "object" == typeof crypto &&
    "function" == typeof crypto.getRandomValues
  ) {
    var e = new Uint8Array(1);
    return function () {
      return crypto.getRandomValues(e), e[0];
    };
  }
  if (ENVIRONMENT_IS_NODE)
    try {
      var t = require("crypto");
      return function () {
        return t.randomBytes(1)[0];
      };
    } catch (e) {}
  return function () {
    abort("randomDevice");
  };
}
(Module.PATH = PATH), (Module.getRandomDevice = getRandomDevice);
var PATH_FS = {
  resolve: function () {
    for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
      var n = r >= 0 ? arguments[r] : FS.cwd();
      if ("string" != typeof n)
        throw new TypeError("Arguments to path.resolve must be strings");
      if (!n) return "";
      (e = n + "/" + e), (t = "/" === n.charAt(0));
    }
    return (
      (t ? "/" : "") +
        (e = PATH.normalizeArray(
          e.split("/").filter(function (e) {
            return !!e;
          }),
          !t
        ).join("/")) || "."
    );
  },
  relative: function (e, t) {
    function r(e) {
      for (var t = 0; t < e.length && "" === e[t]; t++);
      for (var r = e.length - 1; r >= 0 && "" === e[r]; r--);
      return t > r ? [] : e.slice(t, r - t + 1);
    }
    (e = PATH_FS.resolve(e).substr(1)), (t = PATH_FS.resolve(t).substr(1));
    for (
      var n = r(e.split("/")),
        o = r(t.split("/")),
        a = Math.min(n.length, o.length),
        i = a,
        u = 0;
      u < a;
      u++
    )
      if (n[u] !== o[u]) {
        i = u;
        break;
      }
    var s = [];
    for (u = i; u < n.length; u++) s.push("..");
    return (s = s.concat(o.slice(i))).join("/");
  },
};
Module.PATH_FS = PATH_FS;
var TTY = {
  ttys: [],
  init: function () {},
  shutdown: function () {},
  register: function (e, t) {
    (TTY.ttys[e] = { input: [], output: [], ops: t }),
      FS.registerDevice(e, TTY.stream_ops);
  },
  stream_ops: {
    open: function (e) {
      var t = TTY.ttys[e.node.rdev];
      if (!t) throw new FS.ErrnoError(43);
      (e.tty = t), (e.seekable = !1);
    },
    close: function (e) {
      e.tty.ops.flush(e.tty);
    },
    flush: function (e) {
      e.tty.ops.flush(e.tty);
    },
    read: function (e, t, r, n, o) {
      if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
      for (var a = 0, i = 0; i < n; i++) {
        var u;
        try {
          u = e.tty.ops.get_char(e.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (void 0 === u && 0 === a) throw new FS.ErrnoError(6);
        if (null == u) break;
        a++, (t[r + i] = u);
      }
      return a && (e.node.timestamp = Date.now()), a;
    },
    write: function (e, t, r, n, o) {
      if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
      try {
        for (var a = 0; a < n; a++) e.tty.ops.put_char(e.tty, t[r + a]);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      return n && (e.node.timestamp = Date.now()), a;
    },
  },
  default_tty_ops: {
    get_char: function (e) {
      if (!e.input.length) {
        var t = null;
        if (ENVIRONMENT_IS_NODE) {
          var r = Buffer.alloc(256),
            n = 0;
          try {
            n = fs.readSync(process.stdin.fd, r, 0, 256, -1);
          } catch (e) {
            if (!e.toString().includes("EOF")) throw e;
            n = 0;
          }
          t = n > 0 ? r.slice(0, n).toString("utf-8") : null;
        } else
          "undefined" != typeof window && "function" == typeof window.prompt
            ? null !== (t = window.prompt("Input: ")) && (t += "\n")
            : "function" == typeof readline &&
              null !== (t = readline()) &&
              (t += "\n");
        if (!t) return null;
        e.input = intArrayFromString(t, !0);
      }
      return e.input.shift();
    },
    put_char: function (e, t) {
      null === t || 10 === t
        ? (out(UTF8ArrayToString(e.output, 0)), (e.output = []))
        : 0 != t && e.output.push(t);
    },
    flush: function (e) {
      e.output &&
        e.output.length > 0 &&
        (out(UTF8ArrayToString(e.output, 0)), (e.output = []));
    },
  },
  default_tty1_ops: {
    put_char: function (e, t) {
      null === t || 10 === t
        ? (err(UTF8ArrayToString(e.output, 0)), (e.output = []))
        : 0 != t && e.output.push(t);
    },
    flush: function (e) {
      e.output &&
        e.output.length > 0 &&
        (err(UTF8ArrayToString(e.output, 0)), (e.output = []));
    },
  },
};
function zeroMemory(e, t) {
  HEAPU8.fill(0, e, e + t);
}
function alignMemory(e, t) {
  return Math.ceil(e / t) * t;
}
function mmapAlloc(e) {
  abort();
}
(Module.TTY = TTY),
  (Module.zeroMemory = zeroMemory),
  (Module.alignMemory = alignMemory),
  (Module.mmapAlloc = mmapAlloc);
var MEMFS = {
  ops_table: null,
  mount: function (e) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode: function (e, t, r, n) {
    if (FS.isBlkdev(r) || FS.isFIFO(r)) throw new FS.ErrnoError(63);
    MEMFS.ops_table ||
      (MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink,
          },
          stream: { llseek: MEMFS.stream_ops.llseek },
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync,
          },
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink,
          },
          stream: {},
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: FS.chrdev_stream_ops,
        },
      });
    var o = FS.createNode(e, t, r, n);
    return (
      FS.isDir(o.mode)
        ? ((o.node_ops = MEMFS.ops_table.dir.node),
          (o.stream_ops = MEMFS.ops_table.dir.stream),
          (o.contents = {}))
        : FS.isFile(o.mode)
        ? ((o.node_ops = MEMFS.ops_table.file.node),
          (o.stream_ops = MEMFS.ops_table.file.stream),
          (o.usedBytes = 0),
          (o.contents = null))
        : FS.isLink(o.mode)
        ? ((o.node_ops = MEMFS.ops_table.link.node),
          (o.stream_ops = MEMFS.ops_table.link.stream))
        : FS.isChrdev(o.mode) &&
          ((o.node_ops = MEMFS.ops_table.chrdev.node),
          (o.stream_ops = MEMFS.ops_table.chrdev.stream)),
      (o.timestamp = Date.now()),
      e && ((e.contents[t] = o), (e.timestamp = o.timestamp)),
      o
    );
  },
  getFileDataAsTypedArray: function (e) {
    return e.contents
      ? e.contents.subarray
        ? e.contents.subarray(0, e.usedBytes)
        : new Uint8Array(e.contents)
      : new Uint8Array(0);
  },
  expandFileStorage: function (e, t) {
    var r = e.contents ? e.contents.length : 0;
    if (!(r >= t)) {
      (t = Math.max(t, (r * (r < 1048576 ? 2 : 1.125)) >>> 0)),
        0 != r && (t = Math.max(t, 256));
      var n = e.contents;
      (e.contents = new Uint8Array(t)),
        e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0);
    }
  },
  resizeFileStorage: function (e, t) {
    if (e.usedBytes != t)
      if (0 == t) (e.contents = null), (e.usedBytes = 0);
      else {
        var r = e.contents;
        (e.contents = new Uint8Array(t)),
          r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))),
          (e.usedBytes = t);
      }
  },
  node_ops: {
    getattr: function (e) {
      var t = {};
      return (
        (t.dev = FS.isChrdev(e.mode) ? e.id : 1),
        (t.ino = e.id),
        (t.mode = e.mode),
        (t.nlink = 1),
        (t.uid = 0),
        (t.gid = 0),
        (t.rdev = e.rdev),
        FS.isDir(e.mode)
          ? (t.size = 4096)
          : FS.isFile(e.mode)
          ? (t.size = e.usedBytes)
          : FS.isLink(e.mode)
          ? (t.size = e.link.length)
          : (t.size = 0),
        (t.atime = new Date(e.timestamp)),
        (t.mtime = new Date(e.timestamp)),
        (t.ctime = new Date(e.timestamp)),
        (t.blksize = 4096),
        (t.blocks = Math.ceil(t.size / t.blksize)),
        t
      );
    },
    setattr: function (e, t) {
      void 0 !== t.mode && (e.mode = t.mode),
        void 0 !== t.timestamp && (e.timestamp = t.timestamp),
        void 0 !== t.size && MEMFS.resizeFileStorage(e, t.size);
    },
    lookup: function (e, t) {
      throw FS.genericErrors[44];
    },
    mknod: function (e, t, r, n) {
      return MEMFS.createNode(e, t, r, n);
    },
    rename: function (e, t, r) {
      if (FS.isDir(e.mode)) {
        var n;
        try {
          n = FS.lookupNode(t, r);
        } catch (e) {}
        if (n) for (var o in n.contents) throw new FS.ErrnoError(55);
      }
      delete e.parent.contents[e.name],
        (e.parent.timestamp = Date.now()),
        (e.name = r),
        (t.contents[r] = e),
        (t.timestamp = e.parent.timestamp),
        (e.parent = t);
    },
    unlink: function (e, t) {
      delete e.contents[t], (e.timestamp = Date.now());
    },
    rmdir: function (e, t) {
      var r = FS.lookupNode(e, t);
      for (var n in r.contents) throw new FS.ErrnoError(55);
      delete e.contents[t], (e.timestamp = Date.now());
    },
    readdir: function (e) {
      var t = [".", ".."];
      for (var r in e.contents) e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    },
    symlink: function (e, t, r) {
      var n = MEMFS.createNode(e, t, 41471, 0);
      return (n.link = r), n;
    },
    readlink: function (e) {
      if (!FS.isLink(e.mode)) throw new FS.ErrnoError(28);
      return e.link;
    },
  },
  stream_ops: {
    read: function (e, t, r, n, o) {
      var a = e.node.contents;
      if (o >= e.node.usedBytes) return 0;
      var i = Math.min(e.node.usedBytes - o, n);
      if (i > 8 && a.subarray) t.set(a.subarray(o, o + i), r);
      else for (var u = 0; u < i; u++) t[r + u] = a[o + u];
      return i;
    },
    write: function (e, t, r, n, o, a) {
      if (!n) return 0;
      var i = e.node;
      if (
        ((i.timestamp = Date.now()),
        t.subarray && (!i.contents || i.contents.subarray))
      ) {
        if (a) return (i.contents = t.subarray(r, r + n)), (i.usedBytes = n), n;
        if (0 === i.usedBytes && 0 === o)
          return (i.contents = t.slice(r, r + n)), (i.usedBytes = n), n;
        if (o + n <= i.usedBytes)
          return i.contents.set(t.subarray(r, r + n), o), n;
      }
      if (
        (MEMFS.expandFileStorage(i, o + n), i.contents.subarray && t.subarray)
      )
        i.contents.set(t.subarray(r, r + n), o);
      else for (var u = 0; u < n; u++) i.contents[o + u] = t[r + u];
      return (i.usedBytes = Math.max(i.usedBytes, o + n)), n;
    },
    llseek: function (e, t, r) {
      var n = t;
      if (
        (1 === r
          ? (n += e.position)
          : 2 === r && FS.isFile(e.node.mode) && (n += e.node.usedBytes),
        n < 0)
      )
        throw new FS.ErrnoError(28);
      return n;
    },
    allocate: function (e, t, r) {
      MEMFS.expandFileStorage(e.node, t + r),
        (e.node.usedBytes = Math.max(e.node.usedBytes, t + r));
    },
    mmap: function (e, t, r, n, o, a) {
      if (0 !== t) throw new FS.ErrnoError(28);
      if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
      var i,
        u,
        s = e.node.contents;
      if (2 & a || s.buffer !== buffer) {
        if (
          ((n > 0 || n + r < s.length) &&
            (s = s.subarray
              ? s.subarray(n, n + r)
              : Array.prototype.slice.call(s, n, n + r)),
          (u = !0),
          !(i = mmapAlloc(r)))
        )
          throw new FS.ErrnoError(48);
        HEAP8.set(s, i);
      } else (u = !1), (i = s.byteOffset);
      return { ptr: i, allocated: u };
    },
    msync: function (e, t, r, n, o) {
      if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
      if (2 & o) return 0;
      MEMFS.stream_ops.write(e, t, 0, n, r, !1);
      return 0;
    },
  },
};
function asyncLoad(e, t, r, n) {
  var o = n ? "" : getUniqueRunDependency("al " + e);
  readAsync(
    e,
    function (r) {
      assert(r, 'Loading data file "' + e + '" failed (no arrayBuffer).'),
        t(new Uint8Array(r)),
        o && removeRunDependency(o);
    },
    function (t) {
      if (!r) throw 'Loading data file "' + e + '" failed.';
      r();
    }
  ),
    o && addRunDependency(o);
}
(Module.MEMFS = MEMFS), (Module.asyncLoad = asyncLoad);
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: !1,
  ignorePermissions: !0,
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  lookupPath: (e, t = {}) => {
    if (!(e = PATH_FS.resolve(FS.cwd(), e))) return { path: "", node: null };
    if (
      (t = Object.assign({ follow_mount: !0, recurse_count: 0 }, t))
        .recurse_count > 8
    )
      throw new FS.ErrnoError(32);
    for (
      var r = PATH.normalizeArray(
          e.split("/").filter((e) => !!e),
          !1
        ),
        n = FS.root,
        o = "/",
        a = 0;
      a < r.length;
      a++
    ) {
      var i = a === r.length - 1;
      if (i && t.parent) break;
      if (
        ((n = FS.lookupNode(n, r[a])),
        (o = PATH.join2(o, r[a])),
        FS.isMountpoint(n) &&
          (!i || (i && t.follow_mount)) &&
          (n = n.mounted.root),
        !i || t.follow)
      )
        for (var u = 0; FS.isLink(n.mode); ) {
          var s = FS.readlink(o);
          if (
            ((o = PATH_FS.resolve(PATH.dirname(o), s)),
            (n = FS.lookupPath(o, { recurse_count: t.recurse_count + 1 }).node),
            u++ > 40)
          )
            throw new FS.ErrnoError(32);
        }
    }
    return { path: o, node: n };
  },
  getPath: (e) => {
    for (var t; ; ) {
      if (FS.isRoot(e)) {
        var r = e.mount.mountpoint;
        return t ? ("/" !== r[r.length - 1] ? r + "/" + t : r + t) : r;
      }
      (t = t ? e.name + "/" + t : e.name), (e = e.parent);
    }
  },
  hashName: (e, t) => {
    for (var r = 0, n = 0; n < t.length; n++)
      r = ((r << 5) - r + t.charCodeAt(n)) | 0;
    return ((e + r) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: (e) => {
    var t = FS.hashName(e.parent.id, e.name);
    (e.name_next = FS.nameTable[t]), (FS.nameTable[t] = e);
  },
  hashRemoveNode: (e) => {
    var t = FS.hashName(e.parent.id, e.name);
    if (FS.nameTable[t] === e) FS.nameTable[t] = e.name_next;
    else
      for (var r = FS.nameTable[t]; r; ) {
        if (r.name_next === e) {
          r.name_next = e.name_next;
          break;
        }
        r = r.name_next;
      }
  },
  lookupNode: (e, t) => {
    var r = FS.mayLookup(e);
    if (r) throw new FS.ErrnoError(r, e);
    for (
      var n = FS.hashName(e.id, t), o = FS.nameTable[n];
      o;
      o = o.name_next
    ) {
      var a = o.name;
      if (o.parent.id === e.id && a === t) return o;
    }
    return FS.lookup(e, t);
  },
  createNode: (e, t, r, n) => {
    var o = new FS.FSNode(e, t, r, n);
    return FS.hashAddNode(o), o;
  },
  destroyNode: (e) => {
    FS.hashRemoveNode(e);
  },
  isRoot: (e) => e === e.parent,
  isMountpoint: (e) => !!e.mounted,
  isFile: (e) => 32768 == (61440 & e),
  isDir: (e) => 16384 == (61440 & e),
  isLink: (e) => 40960 == (61440 & e),
  isChrdev: (e) => 8192 == (61440 & e),
  isBlkdev: (e) => 24576 == (61440 & e),
  isFIFO: (e) => 4096 == (61440 & e),
  isSocket: (e) => 49152 == (49152 & e),
  flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
  modeStringToFlags: (e) => {
    var t = FS.flagModes[e];
    if (void 0 === t) throw new Error("Unknown file open mode: " + e);
    return t;
  },
  flagsToPermissionString: (e) => {
    var t = ["r", "w", "rw"][3 & e];
    return 512 & e && (t += "w"), t;
  },
  nodePermissions: (e, t) =>
    FS.ignorePermissions
      ? 0
      : (!t.includes("r") || 292 & e.mode) &&
        (!t.includes("w") || 146 & e.mode) &&
        (!t.includes("x") || 73 & e.mode)
      ? 0
      : 2,
  mayLookup: (e) => {
    var t = FS.nodePermissions(e, "x");
    return t || (e.node_ops.lookup ? 0 : 2);
  },
  mayCreate: (e, t) => {
    try {
      FS.lookupNode(e, t);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(e, "wx");
  },
  mayDelete: (e, t, r) => {
    var n;
    try {
      n = FS.lookupNode(e, t);
    } catch (e) {
      return e.errno;
    }
    var o = FS.nodePermissions(e, "wx");
    if (o) return o;
    if (r) {
      if (!FS.isDir(n.mode)) return 54;
      if (FS.isRoot(n) || FS.getPath(n) === FS.cwd()) return 10;
    } else if (FS.isDir(n.mode)) return 31;
    return 0;
  },
  mayOpen: (e, t) =>
    e
      ? FS.isLink(e.mode)
        ? 32
        : FS.isDir(e.mode) && ("r" !== FS.flagsToPermissionString(t) || 512 & t)
        ? 31
        : FS.nodePermissions(e, FS.flagsToPermissionString(t))
      : 44,
  MAX_OPEN_FDS: 4096,
  nextfd: (e = 0, t = FS.MAX_OPEN_FDS) => {
    for (var r = e; r <= t; r++) if (!FS.streams[r]) return r;
    throw new FS.ErrnoError(33);
  },
  getStream: (e) => FS.streams[e],
  createStream: (e, t, r) => {
    FS.FSStream ||
      ((FS.FSStream = function () {}),
      (FS.FSStream.prototype = {
        object: {
          get: function () {
            return this.node;
          },
          set: function (e) {
            this.node = e;
          },
        },
        isRead: {
          get: function () {
            return 1 != (2097155 & this.flags);
          },
        },
        isWrite: {
          get: function () {
            return 0 != (2097155 & this.flags);
          },
        },
        isAppend: {
          get: function () {
            return 1024 & this.flags;
          },
        },
      })),
      (e = Object.assign(new FS.FSStream(), e));
    var n = FS.nextfd(t, r);
    return (e.fd = n), (FS.streams[n] = e), e;
  },
  closeStream: (e) => {
    FS.streams[e] = null;
  },
  chrdev_stream_ops: {
    open: (e) => {
      var t = FS.getDevice(e.node.rdev);
      (e.stream_ops = t.stream_ops), e.stream_ops.open && e.stream_ops.open(e);
    },
    llseek: () => {
      throw new FS.ErrnoError(70);
    },
  },
  major: (e) => e >> 8,
  minor: (e) => 255 & e,
  makedev: (e, t) => (e << 8) | t,
  registerDevice: (e, t) => {
    FS.devices[e] = { stream_ops: t };
  },
  getDevice: (e) => FS.devices[e],
  getMounts: (e) => {
    for (var t = [], r = [e]; r.length; ) {
      var n = r.pop();
      t.push(n), r.push.apply(r, n.mounts);
    }
    return t;
  },
  syncfs: (e, t) => {
    "function" == typeof e && ((t = e), (e = !1)),
      FS.syncFSRequests++,
      FS.syncFSRequests > 1 &&
        err(
          "warning: " +
            FS.syncFSRequests +
            " FS.syncfs operations in flight at once, probably just doing extra work"
        );
    var r = FS.getMounts(FS.root.mount),
      n = 0;
    function o(e) {
      return FS.syncFSRequests--, t(e);
    }
    function a(e) {
      if (e) return a.errored ? void 0 : ((a.errored = !0), o(e));
      ++n >= r.length && o(null);
    }
    r.forEach((t) => {
      if (!t.type.syncfs) return a(null);
      t.type.syncfs(t, e, a);
    });
  },
  mount: (e, t, r) => {
    var n,
      o = "/" === r,
      a = !r;
    if (o && FS.root) throw new FS.ErrnoError(10);
    if (!o && !a) {
      var i = FS.lookupPath(r, { follow_mount: !1 });
      if (((r = i.path), (n = i.node), FS.isMountpoint(n)))
        throw new FS.ErrnoError(10);
      if (!FS.isDir(n.mode)) throw new FS.ErrnoError(54);
    }
    var u = { type: e, opts: t, mountpoint: r, mounts: [] },
      s = e.mount(u);
    return (
      (s.mount = u),
      (u.root = s),
      o
        ? (FS.root = s)
        : n && ((n.mounted = u), n.mount && n.mount.mounts.push(u)),
      s
    );
  },
  unmount: (e) => {
    var t = FS.lookupPath(e, { follow_mount: !1 });
    if (!FS.isMountpoint(t.node)) throw new FS.ErrnoError(28);
    var r = t.node,
      n = r.mounted,
      o = FS.getMounts(n);
    Object.keys(FS.nameTable).forEach((e) => {
      for (var t = FS.nameTable[e]; t; ) {
        var r = t.name_next;
        o.includes(t.mount) && FS.destroyNode(t), (t = r);
      }
    }),
      (r.mounted = null);
    var a = r.mount.mounts.indexOf(n);
    r.mount.mounts.splice(a, 1);
  },
  lookup: (e, t) => e.node_ops.lookup(e, t),
  mknod: (e, t, r) => {
    var n = FS.lookupPath(e, { parent: !0 }).node,
      o = PATH.basename(e);
    if (!o || "." === o || ".." === o) throw new FS.ErrnoError(28);
    var a = FS.mayCreate(n, o);
    if (a) throw new FS.ErrnoError(a);
    if (!n.node_ops.mknod) throw new FS.ErrnoError(63);
    return n.node_ops.mknod(n, o, t, r);
  },
  create: (e, t) => (
    (t = void 0 !== t ? t : 438), (t &= 4095), (t |= 32768), FS.mknod(e, t, 0)
  ),
  mkdir: (e, t) => (
    (t = void 0 !== t ? t : 511), (t &= 1023), (t |= 16384), FS.mknod(e, t, 0)
  ),
  mkdirTree: (e, t) => {
    for (var r = e.split("/"), n = "", o = 0; o < r.length; ++o)
      if (r[o]) {
        n += "/" + r[o];
        try {
          FS.mkdir(n, t);
        } catch (e) {
          if (20 != e.errno) throw e;
        }
      }
  },
  mkdev: (e, t, r) => (
    void 0 === r && ((r = t), (t = 438)), (t |= 8192), FS.mknod(e, t, r)
  ),
  symlink: (e, t) => {
    if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
    var r = FS.lookupPath(t, { parent: !0 }).node;
    if (!r) throw new FS.ErrnoError(44);
    var n = PATH.basename(t),
      o = FS.mayCreate(r, n);
    if (o) throw new FS.ErrnoError(o);
    if (!r.node_ops.symlink) throw new FS.ErrnoError(63);
    return r.node_ops.symlink(r, n, e);
  },
  rename: (e, t) => {
    var r,
      n,
      o = PATH.dirname(e),
      a = PATH.dirname(t),
      i = PATH.basename(e),
      u = PATH.basename(t);
    if (
      ((r = FS.lookupPath(e, { parent: !0 }).node),
      (n = FS.lookupPath(t, { parent: !0 }).node),
      !r || !n)
    )
      throw new FS.ErrnoError(44);
    if (r.mount !== n.mount) throw new FS.ErrnoError(75);
    var s,
      l = FS.lookupNode(r, i),
      c = PATH_FS.relative(e, a);
    if ("." !== c.charAt(0)) throw new FS.ErrnoError(28);
    if ("." !== (c = PATH_FS.relative(t, o)).charAt(0))
      throw new FS.ErrnoError(55);
    try {
      s = FS.lookupNode(n, u);
    } catch (e) {}
    if (l !== s) {
      var d = FS.isDir(l.mode),
        f = FS.mayDelete(r, i, d);
      if (f) throw new FS.ErrnoError(f);
      if ((f = s ? FS.mayDelete(n, u, d) : FS.mayCreate(n, u)))
        throw new FS.ErrnoError(f);
      if (!r.node_ops.rename) throw new FS.ErrnoError(63);
      if (FS.isMountpoint(l) || (s && FS.isMountpoint(s)))
        throw new FS.ErrnoError(10);
      if (n !== r && (f = FS.nodePermissions(r, "w")))
        throw new FS.ErrnoError(f);
      FS.hashRemoveNode(l);
      try {
        r.node_ops.rename(l, n, u);
      } catch (e) {
        throw e;
      } finally {
        FS.hashAddNode(l);
      }
    }
  },
  rmdir: (e) => {
    var t = FS.lookupPath(e, { parent: !0 }).node,
      r = PATH.basename(e),
      n = FS.lookupNode(t, r),
      o = FS.mayDelete(t, r, !0);
    if (o) throw new FS.ErrnoError(o);
    if (!t.node_ops.rmdir) throw new FS.ErrnoError(63);
    if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
    t.node_ops.rmdir(t, r), FS.destroyNode(n);
  },
  readdir: (e) => {
    var t = FS.lookupPath(e, { follow: !0 }).node;
    if (!t.node_ops.readdir) throw new FS.ErrnoError(54);
    return t.node_ops.readdir(t);
  },
  unlink: (e) => {
    var t = FS.lookupPath(e, { parent: !0 }).node;
    if (!t) throw new FS.ErrnoError(44);
    var r = PATH.basename(e),
      n = FS.lookupNode(t, r),
      o = FS.mayDelete(t, r, !1);
    if (o) throw new FS.ErrnoError(o);
    if (!t.node_ops.unlink) throw new FS.ErrnoError(63);
    if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
    t.node_ops.unlink(t, r), FS.destroyNode(n);
  },
  readlink: (e) => {
    var t = FS.lookupPath(e).node;
    if (!t) throw new FS.ErrnoError(44);
    if (!t.node_ops.readlink) throw new FS.ErrnoError(28);
    return PATH_FS.resolve(FS.getPath(t.parent), t.node_ops.readlink(t));
  },
  stat: (e, t) => {
    var r = FS.lookupPath(e, { follow: !t }).node;
    if (!r) throw new FS.ErrnoError(44);
    if (!r.node_ops.getattr) throw new FS.ErrnoError(63);
    return r.node_ops.getattr(r);
  },
  lstat: (e) => FS.stat(e, !0),
  chmod: (e, t, r) => {
    var n;
    "string" == typeof e
      ? (n = FS.lookupPath(e, { follow: !r }).node)
      : (n = e);
    if (!n.node_ops.setattr) throw new FS.ErrnoError(63);
    n.node_ops.setattr(n, {
      mode: (4095 & t) | (-4096 & n.mode),
      timestamp: Date.now(),
    });
  },
  lchmod: (e, t) => {
    FS.chmod(e, t, !0);
  },
  fchmod: (e, t) => {
    var r = FS.getStream(e);
    if (!r) throw new FS.ErrnoError(8);
    FS.chmod(r.node, t);
  },
  chown: (e, t, r, n) => {
    var o;
    "string" == typeof e
      ? (o = FS.lookupPath(e, { follow: !n }).node)
      : (o = e);
    if (!o.node_ops.setattr) throw new FS.ErrnoError(63);
    o.node_ops.setattr(o, { timestamp: Date.now() });
  },
  lchown: (e, t, r) => {
    FS.chown(e, t, r, !0);
  },
  fchown: (e, t, r) => {
    var n = FS.getStream(e);
    if (!n) throw new FS.ErrnoError(8);
    FS.chown(n.node, t, r);
  },
  truncate: (e, t) => {
    if (t < 0) throw new FS.ErrnoError(28);
    var r;
    "string" == typeof e
      ? (r = FS.lookupPath(e, { follow: !0 }).node)
      : (r = e);
    if (!r.node_ops.setattr) throw new FS.ErrnoError(63);
    if (FS.isDir(r.mode)) throw new FS.ErrnoError(31);
    if (!FS.isFile(r.mode)) throw new FS.ErrnoError(28);
    var n = FS.nodePermissions(r, "w");
    if (n) throw new FS.ErrnoError(n);
    r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
  },
  ftruncate: (e, t) => {
    var r = FS.getStream(e);
    if (!r) throw new FS.ErrnoError(8);
    if (0 == (2097155 & r.flags)) throw new FS.ErrnoError(28);
    FS.truncate(r.node, t);
  },
  utime: (e, t, r) => {
    var n = FS.lookupPath(e, { follow: !0 }).node;
    n.node_ops.setattr(n, { timestamp: Math.max(t, r) });
  },
  open: (e, t, r, n, o) => {
    if ("" === e) throw new FS.ErrnoError(44);
    var a;
    if (
      ((r = void 0 === r ? 438 : r),
      (r =
        64 & (t = "string" == typeof t ? FS.modeStringToFlags(t) : t)
          ? (4095 & r) | 32768
          : 0),
      "object" == typeof e)
    )
      a = e;
    else {
      e = PATH.normalize(e);
      try {
        a = FS.lookupPath(e, { follow: !(131072 & t) }).node;
      } catch (e) {}
    }
    var i = !1;
    if (64 & t)
      if (a) {
        if (128 & t) throw new FS.ErrnoError(20);
      } else (a = FS.mknod(e, r, 0)), (i = !0);
    if (!a) throw new FS.ErrnoError(44);
    if ((FS.isChrdev(a.mode) && (t &= -513), 65536 & t && !FS.isDir(a.mode)))
      throw new FS.ErrnoError(54);
    if (!i) {
      var u = FS.mayOpen(a, t);
      if (u) throw new FS.ErrnoError(u);
    }
    512 & t && FS.truncate(a, 0), (t &= -131713);
    var s = FS.createStream(
      {
        node: a,
        path: FS.getPath(a),
        flags: t,
        seekable: !0,
        position: 0,
        stream_ops: a.stream_ops,
        ungotten: [],
        error: !1,
      },
      n,
      o
    );
    return (
      s.stream_ops.open && s.stream_ops.open(s),
      !Module.logReadFiles ||
        1 & t ||
        (FS.readFiles || (FS.readFiles = {}),
        e in FS.readFiles || (FS.readFiles[e] = 1)),
      s
    );
  },
  close: (e) => {
    if (FS.isClosed(e)) throw new FS.ErrnoError(8);
    e.getdents && (e.getdents = null);
    try {
      e.stream_ops.close && e.stream_ops.close(e);
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(e.fd);
    }
    e.fd = null;
  },
  isClosed: (e) => null === e.fd,
  llseek: (e, t, r) => {
    if (FS.isClosed(e)) throw new FS.ErrnoError(8);
    if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(70);
    if (0 != r && 1 != r && 2 != r) throw new FS.ErrnoError(28);
    return (
      (e.position = e.stream_ops.llseek(e, t, r)), (e.ungotten = []), e.position
    );
  },
  read: (e, t, r, n, o) => {
    if (n < 0 || o < 0) throw new FS.ErrnoError(28);
    if (FS.isClosed(e)) throw new FS.ErrnoError(8);
    if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
    if (!e.stream_ops.read) throw new FS.ErrnoError(28);
    var a = void 0 !== o;
    if (a) {
      if (!e.seekable) throw new FS.ErrnoError(70);
    } else o = e.position;
    var i = e.stream_ops.read(e, t, r, n, o);
    return a || (e.position += i), i;
  },
  write: (e, t, r, n, o, a) => {
    if (n < 0 || o < 0) throw new FS.ErrnoError(28);
    if (FS.isClosed(e)) throw new FS.ErrnoError(8);
    if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
    if (!e.stream_ops.write) throw new FS.ErrnoError(28);
    e.seekable && 1024 & e.flags && FS.llseek(e, 0, 2);
    var i = void 0 !== o;
    if (i) {
      if (!e.seekable) throw new FS.ErrnoError(70);
    } else o = e.position;
    var u = e.stream_ops.write(e, t, r, n, o, a);
    return i || (e.position += u), u;
  },
  allocate: (e, t, r) => {
    if (FS.isClosed(e)) throw new FS.ErrnoError(8);
    if (t < 0 || r <= 0) throw new FS.ErrnoError(28);
    if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
    if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode))
      throw new FS.ErrnoError(43);
    if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
    e.stream_ops.allocate(e, t, r);
  },
  mmap: (e, t, r, n, o, a) => {
    if (0 != (2 & o) && 0 == (2 & a) && 2 != (2097155 & e.flags))
      throw new FS.ErrnoError(2);
    if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(2);
    if (!e.stream_ops.mmap) throw new FS.ErrnoError(43);
    return e.stream_ops.mmap(e, t, r, n, o, a);
  },
  msync: (e, t, r, n, o) =>
    e && e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, o) : 0,
  munmap: (e) => 0,
  ioctl: (e, t, r) => {
    if (!e.stream_ops.ioctl) throw new FS.ErrnoError(59);
    return e.stream_ops.ioctl(e, t, r);
  },
  readFile: (e, t = {}) => {
    if (
      ((t.flags = t.flags || 0),
      (t.encoding = t.encoding || "binary"),
      "utf8" !== t.encoding && "binary" !== t.encoding)
    )
      throw new Error('Invalid encoding type "' + t.encoding + '"');
    var r,
      n = FS.open(e, t.flags),
      o = FS.stat(e).size,
      a = new Uint8Array(o);
    return (
      FS.read(n, a, 0, o, 0),
      "utf8" === t.encoding
        ? (r = UTF8ArrayToString(a, 0))
        : "binary" === t.encoding && (r = a),
      FS.close(n),
      r
    );
  },
  writeFile: (e, t, r = {}) => {
    r.flags = r.flags || 577;
    var n = FS.open(e, r.flags, r.mode);
    if ("string" == typeof t) {
      var o = new Uint8Array(lengthBytesUTF8(t) + 1),
        a = stringToUTF8Array(t, o, 0, o.length);
      FS.write(n, o, 0, a, void 0, r.canOwn);
    } else {
      if (!ArrayBuffer.isView(t)) throw new Error("Unsupported data type");
      FS.write(n, t, 0, t.byteLength, void 0, r.canOwn);
    }
    FS.close(n);
  },
  cwd: () => FS.currentPath,
  chdir: (e) => {
    var t = FS.lookupPath(e, { follow: !0 });
    if (null === t.node) throw new FS.ErrnoError(44);
    if (!FS.isDir(t.node.mode)) throw new FS.ErrnoError(54);
    var r = FS.nodePermissions(t.node, "x");
    if (r) throw new FS.ErrnoError(r);
    FS.currentPath = t.path;
  },
  createDefaultDirectories: () => {
    FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user");
  },
  createDefaultDevices: () => {
    FS.mkdir("/dev"),
      FS.registerDevice(FS.makedev(1, 3), {
        read: () => 0,
        write: (e, t, r, n, o) => n,
      }),
      FS.mkdev("/dev/null", FS.makedev(1, 3)),
      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops),
      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops),
      FS.mkdev("/dev/tty", FS.makedev(5, 0)),
      FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var e = getRandomDevice();
    FS.createDevice("/dev", "random", e),
      FS.createDevice("/dev", "urandom", e),
      FS.mkdir("/dev/shm"),
      FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: () => {
    FS.mkdir("/proc");
    var e = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd"),
      FS.mount(
        {
          mount: () => {
            var t = FS.createNode(e, "fd", 16895, 73);
            return (
              (t.node_ops = {
                lookup: (e, t) => {
                  var r = +t,
                    n = FS.getStream(r);
                  if (!n) throw new FS.ErrnoError(8);
                  var o = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: { readlink: () => n.path },
                  };
                  return (o.parent = o), o;
                },
              }),
              t
            );
          },
        },
        {},
        "/proc/self/fd"
      );
  },
  createStandardStreams: () => {
    Module.stdin
      ? FS.createDevice("/dev", "stdin", Module.stdin)
      : FS.symlink("/dev/tty", "/dev/stdin"),
      Module.stdout
        ? FS.createDevice("/dev", "stdout", null, Module.stdout)
        : FS.symlink("/dev/tty", "/dev/stdout"),
      Module.stderr
        ? FS.createDevice("/dev", "stderr", null, Module.stderr)
        : FS.symlink("/dev/tty1", "/dev/stderr");
    FS.open("/dev/stdin", 0),
      FS.open("/dev/stdout", 1),
      FS.open("/dev/stderr", 1);
  },
  ensureErrnoError: () => {
    FS.ErrnoError ||
      ((FS.ErrnoError = function (e, t) {
        (this.node = t),
          (this.setErrno = function (e) {
            this.errno = e;
          }),
          this.setErrno(e),
          (this.message = "FS error");
      }),
      (FS.ErrnoError.prototype = new Error()),
      (FS.ErrnoError.prototype.constructor = FS.ErrnoError),
      [44].forEach((e) => {
        (FS.genericErrors[e] = new FS.ErrnoError(e)),
          (FS.genericErrors[e].stack = "<generic error, no stack>");
      }));
  },
  staticInit: () => {
    FS.ensureErrnoError(),
      (FS.nameTable = new Array(4096)),
      FS.mount(MEMFS, {}, "/"),
      FS.createDefaultDirectories(),
      FS.createDefaultDevices(),
      FS.createSpecialDirectories(),
      (FS.filesystems = { MEMFS: MEMFS });
  },
  init: (e, t, r) => {
    (FS.init.initialized = !0),
      FS.ensureErrnoError(),
      (Module.stdin = e || Module.stdin),
      (Module.stdout = t || Module.stdout),
      (Module.stderr = r || Module.stderr),
      FS.createStandardStreams();
  },
  quit: () => {
    FS.init.initialized = !1;
    for (var e = 0; e < FS.streams.length; e++) {
      var t = FS.streams[e];
      t && FS.close(t);
    }
  },
  getMode: (e, t) => {
    var r = 0;
    return e && (r |= 365), t && (r |= 146), r;
  },
  findObject: (e, t) => {
    var r = FS.analyzePath(e, t);
    return r.exists ? r.object : null;
  },
  analyzePath: (e, t) => {
    try {
      e = (n = FS.lookupPath(e, { follow: !t })).path;
    } catch (e) {}
    var r = {
      isRoot: !1,
      exists: !1,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: !1,
      parentPath: null,
      parentObject: null,
    };
    try {
      var n = FS.lookupPath(e, { parent: !0 });
      (r.parentExists = !0),
        (r.parentPath = n.path),
        (r.parentObject = n.node),
        (r.name = PATH.basename(e)),
        (n = FS.lookupPath(e, { follow: !t })),
        (r.exists = !0),
        (r.path = n.path),
        (r.object = n.node),
        (r.name = n.node.name),
        (r.isRoot = "/" === n.path);
    } catch (e) {
      r.error = e.errno;
    }
    return r;
  },
  createPath: (e, t, r, n) => {
    e = "string" == typeof e ? e : FS.getPath(e);
    for (var o = t.split("/").reverse(); o.length; ) {
      var a = o.pop();
      if (a) {
        var i = PATH.join2(e, a);
        try {
          FS.mkdir(i);
        } catch (e) {}
        e = i;
      }
    }
    return i;
  },
  createFile: (e, t, r, n, o) => {
    var a = PATH.join2("string" == typeof e ? e : FS.getPath(e), t),
      i = FS.getMode(n, o);
    return FS.create(a, i);
  },
  createDataFile: (e, t, r, n, o, a) => {
    var i = t;
    e &&
      ((e = "string" == typeof e ? e : FS.getPath(e)),
      (i = t ? PATH.join2(e, t) : e));
    var u = FS.getMode(n, o),
      s = FS.create(i, u);
    if (r) {
      if ("string" == typeof r) {
        for (var l = new Array(r.length), c = 0, d = r.length; c < d; ++c)
          l[c] = r.charCodeAt(c);
        r = l;
      }
      FS.chmod(s, 146 | u);
      var f = FS.open(s, 577);
      FS.write(f, r, 0, r.length, 0, a), FS.close(f), FS.chmod(s, u);
    }
    return s;
  },
  createDevice: (e, t, r, n) => {
    var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), t),
      a = FS.getMode(!!r, !!n);
    FS.createDevice.major || (FS.createDevice.major = 64);
    var i = FS.makedev(FS.createDevice.major++, 0);
    return (
      FS.registerDevice(i, {
        open: (e) => {
          e.seekable = !1;
        },
        close: (e) => {
          n && n.buffer && n.buffer.length && n(10);
        },
        read: (e, t, n, o, a) => {
          for (var i = 0, u = 0; u < o; u++) {
            var s;
            try {
              s = r();
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (void 0 === s && 0 === i) throw new FS.ErrnoError(6);
            if (null == s) break;
            i++, (t[n + u] = s);
          }
          return i && (e.node.timestamp = Date.now()), i;
        },
        write: (e, t, r, o, a) => {
          for (var i = 0; i < o; i++)
            try {
              n(t[r + i]);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          return o && (e.node.timestamp = Date.now()), i;
        },
      }),
      FS.mkdev(o, a, i)
    );
  },
  forceLoadFile: (e) => {
    if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
    if ("undefined" != typeof XMLHttpRequest)
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    if (!read_)
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    try {
      (e.contents = intArrayFromString(read_(e.url), !0)),
        (e.usedBytes = e.contents.length);
    } catch (e) {
      throw new FS.ErrnoError(29);
    }
  },
  createLazyFile: (e, t, r, n, o) => {
    function a() {
      (this.lengthKnown = !1), (this.chunks = []);
    }
    if (
      ((a.prototype.get = function (e) {
        if (!(e > this.length - 1 || e < 0)) {
          var t = e % this.chunkSize,
            r = (e / this.chunkSize) | 0;
          return this.getter(r)[t];
        }
      }),
      (a.prototype.setDataGetter = function (e) {
        this.getter = e;
      }),
      (a.prototype.cacheLength = function () {
        var e = new XMLHttpRequest();
        if (
          (e.open("HEAD", r, !1),
          e.send(null),
          !((e.status >= 200 && e.status < 300) || 304 === e.status))
        )
          throw new Error("Couldn't load " + r + ". Status: " + e.status);
        var t,
          n = Number(e.getResponseHeader("Content-length")),
          o = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
          a = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t,
          i = 1048576;
        o || (i = n);
        var u = this;
        u.setDataGetter((e) => {
          var t = e * i,
            o = (e + 1) * i - 1;
          if (
            ((o = Math.min(o, n - 1)),
            void 0 === u.chunks[e] &&
              (u.chunks[e] = ((e, t) => {
                if (e > t)
                  throw new Error(
                    "invalid range (" +
                      e +
                      ", " +
                      t +
                      ") or no bytes requested!"
                  );
                if (t > n - 1)
                  throw new Error(
                    "only " + n + " bytes available! programmer error!"
                  );
                var o = new XMLHttpRequest();
                if (
                  (o.open("GET", r, !1),
                  n !== i &&
                    o.setRequestHeader("Range", "bytes=" + e + "-" + t),
                  (o.responseType = "arraybuffer"),
                  o.overrideMimeType &&
                    o.overrideMimeType("text/plain; charset=x-user-defined"),
                  o.send(null),
                  !((o.status >= 200 && o.status < 300) || 304 === o.status))
                )
                  throw new Error(
                    "Couldn't load " + r + ". Status: " + o.status
                  );
                return void 0 !== o.response
                  ? new Uint8Array(o.response || [])
                  : intArrayFromString(o.responseText || "", !0);
              })(t, o)),
            void 0 === u.chunks[e])
          )
            throw new Error("doXHR failed!");
          return u.chunks[e];
        }),
          (!a && n) ||
            ((i = n = 1),
            (n = this.getter(0).length),
            (i = n),
            out(
              "LazyFiles on gzip forces download of the whole file when length is accessed"
            )),
          (this._length = n),
          (this._chunkSize = i),
          (this.lengthKnown = !0);
      }),
      "undefined" != typeof XMLHttpRequest)
    ) {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var i = new a();
      Object.defineProperties(i, {
        length: {
          get: function () {
            return this.lengthKnown || this.cacheLength(), this._length;
          },
        },
        chunkSize: {
          get: function () {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          },
        },
      });
      var u = { isDevice: !1, contents: i };
    } else u = { isDevice: !1, url: r };
    var s = FS.createFile(e, t, u, n, o);
    u.contents
      ? (s.contents = u.contents)
      : u.url && ((s.contents = null), (s.url = u.url)),
      Object.defineProperties(s, {
        usedBytes: {
          get: function () {
            return this.contents.length;
          },
        },
      });
    var l = {};
    return (
      Object.keys(s.stream_ops).forEach((e) => {
        var t = s.stream_ops[e];
        l[e] = function () {
          return FS.forceLoadFile(s), t.apply(null, arguments);
        };
      }),
      (l.read = (e, t, r, n, o) => {
        FS.forceLoadFile(s);
        var a = e.node.contents;
        if (o >= a.length) return 0;
        var i = Math.min(a.length - o, n);
        if (a.slice) for (var u = 0; u < i; u++) t[r + u] = a[o + u];
        else for (u = 0; u < i; u++) t[r + u] = a.get(o + u);
        return i;
      }),
      (s.stream_ops = l),
      s
    );
  },
  createPreloadedFile: (e, t, r, n, o, a, i, u, s, l) => {
    var c = t ? PATH_FS.resolve(PATH.join2(e, t)) : e,
      d = getUniqueRunDependency("cp " + c);
    function f(r) {
      function f(r) {
        l && l(),
          u || FS.createDataFile(e, t, r, n, o, s),
          a && a(),
          removeRunDependency(d);
      }
      Browser.handledByPreloadPlugin(r, c, f, () => {
        i && i(), removeRunDependency(d);
      }) || f(r);
    }
    addRunDependency(d),
      "string" == typeof r ? asyncLoad(r, (e) => f(e), i) : f(r);
  },
  indexedDB: () =>
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB,
  DB_NAME: () => "EM_FS_" + window.location.pathname,
  DB_VERSION: 20,
  DB_STORE_NAME: "FILE_DATA",
  saveFilesToDB: (e, t, r) => {
    (t = t || (() => {})), (r = r || (() => {}));
    var n = FS.indexedDB();
    try {
      var o = n.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return r(e);
    }
    (o.onupgradeneeded = () => {
      out("creating db"), o.result.createObjectStore(FS.DB_STORE_NAME);
    }),
      (o.onsuccess = () => {
        var n = o.result.transaction([FS.DB_STORE_NAME], "readwrite"),
          a = n.objectStore(FS.DB_STORE_NAME),
          i = 0,
          u = 0,
          s = e.length;
        function l() {
          0 == u ? t() : r();
        }
        e.forEach((e) => {
          var t = a.put(FS.analyzePath(e).object.contents, e);
          (t.onsuccess = () => {
            ++i + u == s && l();
          }),
            (t.onerror = () => {
              i + ++u == s && l();
            });
        }),
          (n.onerror = r);
      }),
      (o.onerror = r);
  },
  loadFilesFromDB: (e, t, r) => {
    (t = t || (() => {})), (r = r || (() => {}));
    var n = FS.indexedDB();
    try {
      var o = n.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return r(e);
    }
    (o.onupgradeneeded = r),
      (o.onsuccess = () => {
        var n = o.result;
        try {
          var a = n.transaction([FS.DB_STORE_NAME], "readonly");
        } catch (e) {
          return void r(e);
        }
        var i = a.objectStore(FS.DB_STORE_NAME),
          u = 0,
          s = 0,
          l = e.length;
        function c() {
          0 == s ? t() : r();
        }
        e.forEach((e) => {
          var t = i.get(e);
          (t.onsuccess = () => {
            FS.analyzePath(e).exists && FS.unlink(e),
              FS.createDataFile(
                PATH.dirname(e),
                PATH.basename(e),
                t.result,
                !0,
                !0,
                !0
              ),
              ++u + s == l && c();
          }),
            (t.onerror = () => {
              u + ++s == l && c();
            });
        }),
          (a.onerror = r);
      }),
      (o.onerror = r);
  },
};
Module.FS = FS;
var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
  calculateAt: function (e, t, r) {
    if ("/" === t[0]) return t;
    var n;
    if (-100 === e) n = FS.cwd();
    else {
      var o = FS.getStream(e);
      if (!o) throw new FS.ErrnoError(8);
      n = o.path;
    }
    if (0 == t.length) {
      if (!r) throw new FS.ErrnoError(44);
      return n;
    }
    return PATH.join2(n, t);
  },
  doStat: function (e, t, r) {
    try {
      var n = e(t);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(t) !== PATH.normalize(FS.getPath(e.node))
      )
        return -54;
      throw e;
    }
    return (
      (HEAP32[r >> 2] = n.dev),
      (HEAP32[(r + 4) >> 2] = 0),
      (HEAP32[(r + 8) >> 2] = n.ino),
      (HEAP32[(r + 12) >> 2] = n.mode),
      (HEAP32[(r + 16) >> 2] = n.nlink),
      (HEAP32[(r + 20) >> 2] = n.uid),
      (HEAP32[(r + 24) >> 2] = n.gid),
      (HEAP32[(r + 28) >> 2] = n.rdev),
      (HEAP32[(r + 32) >> 2] = 0),
      (tempI64 = [
        n.size >>> 0,
        ((tempDouble = n.size),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (0 |
                Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
      (HEAP32[(r + 40) >> 2] = tempI64[0]),
      (HEAP32[(r + 44) >> 2] = tempI64[1]),
      (HEAP32[(r + 48) >> 2] = 4096),
      (HEAP32[(r + 52) >> 2] = n.blocks),
      (HEAP32[(r + 56) >> 2] = (n.atime.getTime() / 1e3) | 0),
      (HEAP32[(r + 60) >> 2] = 0),
      (HEAP32[(r + 64) >> 2] = (n.mtime.getTime() / 1e3) | 0),
      (HEAP32[(r + 68) >> 2] = 0),
      (HEAP32[(r + 72) >> 2] = (n.ctime.getTime() / 1e3) | 0),
      (HEAP32[(r + 76) >> 2] = 0),
      (tempI64 = [
        n.ino >>> 0,
        ((tempDouble = n.ino),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (0 |
                Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
      (HEAP32[(r + 80) >> 2] = tempI64[0]),
      (HEAP32[(r + 84) >> 2] = tempI64[1]),
      0
    );
  },
  doMsync: function (e, t, r, n, o) {
    var a = HEAPU8.slice(e, e + r);
    FS.msync(t, a, o, r, n);
  },
  doMkdir: function (e, t) {
    return (
      "/" === (e = PATH.normalize(e))[e.length - 1] &&
        (e = e.substr(0, e.length - 1)),
      FS.mkdir(e, t, 0),
      0
    );
  },
  doMknod: function (e, t, r) {
    switch (61440 & t) {
      case 32768:
      case 8192:
      case 24576:
      case 4096:
      case 49152:
        break;
      default:
        return -28;
    }
    return FS.mknod(e, t, r), 0;
  },
  doReadlink: function (e, t, r) {
    if (r <= 0) return -28;
    var n = FS.readlink(e),
      o = Math.min(r, lengthBytesUTF8(n)),
      a = HEAP8[t + o];
    return stringToUTF8(n, t, r + 1), (HEAP8[t + o] = a), o;
  },
  doAccess: function (e, t) {
    if (-8 & t) return -28;
    var r = FS.lookupPath(e, { follow: !0 }).node;
    if (!r) return -44;
    var n = "";
    return (
      4 & t && (n += "r"),
      2 & t && (n += "w"),
      1 & t && (n += "x"),
      n && FS.nodePermissions(r, n) ? -2 : 0
    );
  },
  doDup: function (e, t, r) {
    var n = FS.getStream(r);
    return n && FS.close(n), FS.open(e, t, 0, r, r).fd;
  },
  doReadv: function (e, t, r, n) {
    for (var o = 0, a = 0; a < r; a++) {
      var i = HEAP32[(t + 8 * a) >> 2],
        u = HEAP32[(t + (8 * a + 4)) >> 2],
        s = FS.read(e, HEAP8, i, u, n);
      if (s < 0) return -1;
      if (((o += s), s < u)) break;
    }
    return o;
  },
  doWritev: function (e, t, r, n) {
    for (var o = 0, a = 0; a < r; a++) {
      var i = HEAP32[(t + 8 * a) >> 2],
        u = HEAP32[(t + (8 * a + 4)) >> 2],
        s = FS.write(e, HEAP8, i, u, n);
      if (s < 0) return -1;
      o += s;
    }
    return o;
  },
  varargs: void 0,
  get: function () {
    return (SYSCALLS.varargs += 4), HEAP32[(SYSCALLS.varargs - 4) >> 2];
  },
  getStr: function (e) {
    return UTF8ToString(e);
  },
  getStreamFromFD: function (e) {
    var t = FS.getStream(e);
    if (!t) throw new FS.ErrnoError(8);
    return t;
  },
  get64: function (e, t) {
    return e;
  },
};
function ___syscall_fcntl64(e, t, r) {
  SYSCALLS.varargs = r;
  try {
    var n = SYSCALLS.getStreamFromFD(e);
    switch (t) {
      case 0:
        return (o = SYSCALLS.get()) < 0
          ? -28
          : FS.open(n.path, n.flags, 0, o).fd;
      case 1:
      case 2:
        return 0;
      case 3:
        return n.flags;
      case 4:
        var o = SYSCALLS.get();
        return (n.flags |= o), 0;
      case 5:
        o = SYSCALLS.get();
        return (HEAP16[(o + 0) >> 1] = 2), 0;
      case 6:
      case 7:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        return setErrNo(28), -1;
      default:
        return -28;
    }
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
}
function ___syscall_ftruncate64(e, t, r) {
  try {
    var n = SYSCALLS.get64(t, r);
    return FS.ftruncate(e, n), 0;
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
}
function ___syscall_ioctl(e, t, r) {
  SYSCALLS.varargs = r;
  try {
    var n = SYSCALLS.getStreamFromFD(e);
    switch (t) {
      case 21509:
      case 21505:
        return n.tty ? 0 : -59;
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508:
        return n.tty ? 0 : -59;
      case 21519:
        if (!n.tty) return -59;
        var o = SYSCALLS.get();
        return (HEAP32[o >> 2] = 0), 0;
      case 21520:
        return n.tty ? -28 : -59;
      case 21531:
        o = SYSCALLS.get();
        return FS.ioctl(n, t, o);
      case 21523:
      case 21524:
        return n.tty ? 0 : -59;
      default:
        abort("bad ioctl syscall " + t);
    }
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
}
function ___syscall_open(e, t, r) {
  SYSCALLS.varargs = r;
  try {
    var n = SYSCALLS.getStr(e),
      o = r ? SYSCALLS.get() : 0;
    return FS.open(n, t, o).fd;
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
}
function __localtime_js(e, t) {
  var r = new Date(1e3 * HEAP32[e >> 2]);
  (HEAP32[t >> 2] = r.getSeconds()),
    (HEAP32[(t + 4) >> 2] = r.getMinutes()),
    (HEAP32[(t + 8) >> 2] = r.getHours()),
    (HEAP32[(t + 12) >> 2] = r.getDate()),
    (HEAP32[(t + 16) >> 2] = r.getMonth()),
    (HEAP32[(t + 20) >> 2] = r.getFullYear() - 1900),
    (HEAP32[(t + 24) >> 2] = r.getDay());
  var n = new Date(r.getFullYear(), 0, 1),
    o = ((r.getTime() - n.getTime()) / 864e5) | 0;
  (HEAP32[(t + 28) >> 2] = o),
    (HEAP32[(t + 36) >> 2] = -60 * r.getTimezoneOffset());
  var a = new Date(r.getFullYear(), 6, 1).getTimezoneOffset(),
    i = n.getTimezoneOffset(),
    u = 0 | (a != i && r.getTimezoneOffset() == Math.min(i, a));
  HEAP32[(t + 32) >> 2] = u;
}
function _tzset_impl(e, t, r) {
  var n = new Date().getFullYear(),
    o = new Date(n, 0, 1),
    a = new Date(n, 6, 1),
    i = o.getTimezoneOffset(),
    u = a.getTimezoneOffset(),
    s = Math.max(i, u);
  function l(e) {
    var t = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return t ? t[1] : "GMT";
  }
  (HEAP32[e >> 2] = 60 * s), (HEAP32[t >> 2] = Number(i != u));
  var c = l(o),
    d = l(a),
    f = allocateUTF8(c),
    m = allocateUTF8(d);
  u < i
    ? ((HEAP32[r >> 2] = f), (HEAP32[(r + 4) >> 2] = m))
    : ((HEAP32[r >> 2] = m), (HEAP32[(r + 4) >> 2] = f));
}
function __tzset_js(e, t, r) {
  __tzset_js.called || ((__tzset_js.called = !0), _tzset_impl(e, t, r));
}
function _abort() {
  abort("");
}
(Module.SYSCALLS = SYSCALLS),
  (Module.___syscall_fcntl64 = ___syscall_fcntl64),
  (Module.___syscall_ftruncate64 = ___syscall_ftruncate64),
  (Module.___syscall_ioctl = ___syscall_ioctl),
  (Module.___syscall_open = ___syscall_open),
  (Module.__localtime_js = __localtime_js),
  (Module._tzset_impl = _tzset_impl),
  (Module.__tzset_js = __tzset_js),
  (Module._abort = _abort);
var readAsmConstArgsArray = [];
function readAsmConstArgs(e, t) {
  var r;
  for (readAsmConstArgsArray.length = 0, t >>= 2; (r = HEAPU8[e++]); ) {
    var n = r < 105;
    n && 1 & t && t++,
      readAsmConstArgsArray.push(n ? HEAPF64[t++ >> 1] : HEAP32[t]),
      ++t;
  }
  return readAsmConstArgsArray;
}
function _emscripten_asm_const_int(e, t, r) {
  var n = readAsmConstArgs(t, r);
  return ASM_CONSTS[e].apply(null, n);
}
function _emscripten_memcpy_big(e, t, r) {
  HEAPU8.copyWithin(e, t, t + r);
}
function _emscripten_get_heap_max() {
  return HEAPU8.length;
}
function abortOnCannotGrowMemory(e) {
  abort("OOM");
}
function _emscripten_resize_heap(e) {
  HEAPU8.length;
  abortOnCannotGrowMemory((e >>>= 0));
}
function _emscripten_run_script(e) {}
(Module.readAsmConstArgsArray = readAsmConstArgsArray),
  (Module.readAsmConstArgs = readAsmConstArgs),
  (Module._emscripten_asm_const_int = _emscripten_asm_const_int),
  (Module._emscripten_memcpy_big = _emscripten_memcpy_big),
  (Module._emscripten_get_heap_max = _emscripten_get_heap_max),
  (Module.abortOnCannotGrowMemory = abortOnCannotGrowMemory),
  (Module._emscripten_resize_heap = _emscripten_resize_heap),
  (Module._emscripten_run_script = _emscripten_run_script);
var ENV = {};
function getExecutableName() {
  return thisProgram || "./this.program";
}
function getEnvStrings() {
  if (!getEnvStrings.strings) {
    var e = {
      USER: "web_user",
      LOGNAME: "web_user",
      PATH: "/",
      PWD: "/",
      HOME: "/home/web_user",
      LANG:
        (
          ("object" == typeof navigator &&
            navigator.languages &&
            navigator.languages[0]) ||
          "C"
        ).replace("-", "_") + ".UTF-8",
      _: getExecutableName(),
    };
    for (var t in ENV) void 0 === ENV[t] ? delete e[t] : (e[t] = ENV[t]);
    var r = [];
    for (var t in e) r.push(t + "=" + e[t]);
    getEnvStrings.strings = r;
  }
  return getEnvStrings.strings;
}
function _environ_get(e, t) {
  var r = 0;
  return (
    getEnvStrings().forEach(function (n, o) {
      var a = t + r;
      (HEAP32[(e + 4 * o) >> 2] = a),
        writeAsciiToMemory(n, a),
        (r += n.length + 1);
    }),
    0
  );
}
function _environ_sizes_get(e, t) {
  var r = getEnvStrings();
  HEAP32[e >> 2] = r.length;
  var n = 0;
  return (
    r.forEach(function (e) {
      n += e.length + 1;
    }),
    (HEAP32[t >> 2] = n),
    0
  );
}
function _fd_close(e) {
  try {
    var t = SYSCALLS.getStreamFromFD(e);
    return FS.close(t), 0;
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
}
function _fd_read(e, t, r, n) {
  try {
    var o = SYSCALLS.getStreamFromFD(e),
      a = SYSCALLS.doReadv(o, t, r);
    return (HEAP32[n >> 2] = a), 0;
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
}
function _fd_seek(e, t, r, n, o) {
  try {
    var a = SYSCALLS.getStreamFromFD(e),
      i = 4294967296 * r + (t >>> 0);
    return i <= -9007199254740992 || i >= 9007199254740992
      ? -61
      : (FS.llseek(a, i, n),
        (tempI64 = [
          a.position >>> 0,
          ((tempDouble = a.position),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (0 |
                  Math.min(
                    +Math.floor(tempDouble / 4294967296),
                    4294967295
                  )) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
        (HEAP32[o >> 2] = tempI64[0]),
        (HEAP32[(o + 4) >> 2] = tempI64[1]),
        a.getdents && 0 === i && 0 === n && (a.getdents = null),
        0);
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
}
function _fd_write(e, t, r, n) {
  try {
    var o = SYSCALLS.getStreamFromFD(e),
      a = SYSCALLS.doWritev(o, t, r);
    return (HEAP32[n >> 2] = a), 0;
  } catch (e) {
    if (void 0 === FS || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
}
function _setTempRet0(e) {
  setTempRet0(e);
}
function __isLeapYear(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
function __arraySum(e, t) {
  for (var r = 0, n = 0; n <= t; r += e[n++]);
  return r;
}
(Module.ENV = ENV),
  (Module.getExecutableName = getExecutableName),
  (Module.getEnvStrings = getEnvStrings),
  (Module._environ_get = _environ_get),
  (Module._environ_sizes_get = _environ_sizes_get),
  (Module._fd_close = _fd_close),
  (Module._fd_read = _fd_read),
  (Module._fd_seek = _fd_seek),
  (Module._fd_write = _fd_write),
  (Module._setTempRet0 = _setTempRet0),
  (Module.__isLeapYear = __isLeapYear),
  (Module.__arraySum = __arraySum);
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Module.__MONTH_DAYS_LEAP = __MONTH_DAYS_LEAP;
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(e, t) {
  for (var r = new Date(e.getTime()); t > 0; ) {
    var n = __isLeapYear(r.getFullYear()),
      o = r.getMonth(),
      a = (n ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[o];
    if (!(t > a - r.getDate())) return r.setDate(r.getDate() + t), r;
    (t -= a - r.getDate() + 1),
      r.setDate(1),
      o < 11
        ? r.setMonth(o + 1)
        : (r.setMonth(0), r.setFullYear(r.getFullYear() + 1));
  }
  return r;
}
function _strftime(e, t, r, n) {
  var o = HEAP32[(n + 40) >> 2],
    a = {
      tm_sec: HEAP32[n >> 2],
      tm_min: HEAP32[(n + 4) >> 2],
      tm_hour: HEAP32[(n + 8) >> 2],
      tm_mday: HEAP32[(n + 12) >> 2],
      tm_mon: HEAP32[(n + 16) >> 2],
      tm_year: HEAP32[(n + 20) >> 2],
      tm_wday: HEAP32[(n + 24) >> 2],
      tm_yday: HEAP32[(n + 28) >> 2],
      tm_isdst: HEAP32[(n + 32) >> 2],
      tm_gmtoff: HEAP32[(n + 36) >> 2],
      tm_zone: o ? UTF8ToString(o) : "",
    },
    i = UTF8ToString(r),
    u = {
      "%c": "%a %b %d %H:%M:%S %Y",
      "%D": "%m/%d/%y",
      "%F": "%Y-%m-%d",
      "%h": "%b",
      "%r": "%I:%M:%S %p",
      "%R": "%H:%M",
      "%T": "%H:%M:%S",
      "%x": "%m/%d/%y",
      "%X": "%H:%M:%S",
      "%Ec": "%c",
      "%EC": "%C",
      "%Ex": "%m/%d/%y",
      "%EX": "%H:%M:%S",
      "%Ey": "%y",
      "%EY": "%Y",
      "%Od": "%d",
      "%Oe": "%e",
      "%OH": "%H",
      "%OI": "%I",
      "%Om": "%m",
      "%OM": "%M",
      "%OS": "%S",
      "%Ou": "%u",
      "%OU": "%U",
      "%OV": "%V",
      "%Ow": "%w",
      "%OW": "%W",
      "%Oy": "%y",
    };
  for (var s in u) i = i.replace(new RegExp(s, "g"), u[s]);
  var l = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    c = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  function d(e, t, r) {
    for (var n = "number" == typeof e ? e.toString() : e || ""; n.length < t; )
      n = r[0] + n;
    return n;
  }
  function f(e, t) {
    return d(e, t, "0");
  }
  function m(e, t) {
    function r(e) {
      return e < 0 ? -1 : e > 0 ? 1 : 0;
    }
    var n;
    return (
      0 === (n = r(e.getFullYear() - t.getFullYear())) &&
        0 === (n = r(e.getMonth() - t.getMonth())) &&
        (n = r(e.getDate() - t.getDate())),
      n
    );
  }
  function p(e) {
    switch (e.getDay()) {
      case 0:
        return new Date(e.getFullYear() - 1, 11, 29);
      case 1:
        return e;
      case 2:
        return new Date(e.getFullYear(), 0, 3);
      case 3:
        return new Date(e.getFullYear(), 0, 2);
      case 4:
        return new Date(e.getFullYear(), 0, 1);
      case 5:
        return new Date(e.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(e.getFullYear() - 1, 11, 30);
    }
  }
  function h(e) {
    var t = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
      r = new Date(t.getFullYear(), 0, 4),
      n = new Date(t.getFullYear() + 1, 0, 4),
      o = p(r),
      a = p(n);
    return m(o, t) <= 0
      ? m(a, t) <= 0
        ? t.getFullYear() + 1
        : t.getFullYear()
      : t.getFullYear() - 1;
  }
  var _ = {
    "%a": function (e) {
      return l[e.tm_wday].substring(0, 3);
    },
    "%A": function (e) {
      return l[e.tm_wday];
    },
    "%b": function (e) {
      return c[e.tm_mon].substring(0, 3);
    },
    "%B": function (e) {
      return c[e.tm_mon];
    },
    "%C": function (e) {
      return f(((e.tm_year + 1900) / 100) | 0, 2);
    },
    "%d": function (e) {
      return f(e.tm_mday, 2);
    },
    "%e": function (e) {
      return d(e.tm_mday, 2, " ");
    },
    "%g": function (e) {
      return h(e).toString().substring(2);
    },
    "%G": function (e) {
      return h(e);
    },
    "%H": function (e) {
      return f(e.tm_hour, 2);
    },
    "%I": function (e) {
      var t = e.tm_hour;
      return 0 == t ? (t = 12) : t > 12 && (t -= 12), f(t, 2);
    },
    "%j": function (e) {
      return f(
        e.tm_mday +
          __arraySum(
            __isLeapYear(e.tm_year + 1900)
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            e.tm_mon - 1
          ),
        3
      );
    },
    "%m": function (e) {
      return f(e.tm_mon + 1, 2);
    },
    "%M": function (e) {
      return f(e.tm_min, 2);
    },
    "%n": function () {
      return "\n";
    },
    "%p": function (e) {
      return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM";
    },
    "%S": function (e) {
      return f(e.tm_sec, 2);
    },
    "%t": function () {
      return "\t";
    },
    "%u": function (e) {
      return e.tm_wday || 7;
    },
    "%U": function (e) {
      var t = new Date(e.tm_year + 1900, 0, 1),
        r = 0 === t.getDay() ? t : __addDays(t, 7 - t.getDay()),
        n = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
      if (m(r, n) < 0) {
        var o =
            __arraySum(
              __isLeapYear(n.getFullYear())
                ? __MONTH_DAYS_LEAP
                : __MONTH_DAYS_REGULAR,
              n.getMonth() - 1
            ) - 31,
          a = 31 - r.getDate() + o + n.getDate();
        return f(Math.ceil(a / 7), 2);
      }
      return 0 === m(r, t) ? "01" : "00";
    },
    "%V": function (e) {
      var t,
        r = new Date(e.tm_year + 1900, 0, 4),
        n = new Date(e.tm_year + 1901, 0, 4),
        o = p(r),
        a = p(n),
        i = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
      return m(i, o) < 0
        ? "53"
        : m(a, i) <= 0
        ? "01"
        : ((t =
            o.getFullYear() < e.tm_year + 1900
              ? e.tm_yday + 32 - o.getDate()
              : e.tm_yday + 1 - o.getDate()),
          f(Math.ceil(t / 7), 2));
    },
    "%w": function (e) {
      return e.tm_wday;
    },
    "%W": function (e) {
      var t = new Date(e.tm_year, 0, 1),
        r =
          1 === t.getDay()
            ? t
            : __addDays(t, 0 === t.getDay() ? 1 : 7 - t.getDay() + 1),
        n = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
      if (m(r, n) < 0) {
        var o =
            __arraySum(
              __isLeapYear(n.getFullYear())
                ? __MONTH_DAYS_LEAP
                : __MONTH_DAYS_REGULAR,
              n.getMonth() - 1
            ) - 31,
          a = 31 - r.getDate() + o + n.getDate();
        return f(Math.ceil(a / 7), 2);
      }
      return 0 === m(r, t) ? "01" : "00";
    },
    "%y": function (e) {
      return (e.tm_year + 1900).toString().substring(2);
    },
    "%Y": function (e) {
      return e.tm_year + 1900;
    },
    "%z": function (e) {
      var t = e.tm_gmtoff,
        r = t >= 0;
      return (
        (t = ((t = Math.abs(t) / 60) / 60) * 100 + (t % 60)),
        (r ? "+" : "-") + String("0000" + t).slice(-4)
      );
    },
    "%Z": function (e) {
      return e.tm_zone;
    },
    "%%": function () {
      return "%";
    },
  };
  for (var s in ((i = i.replace(/%%/g, "\0\0")), _))
    i.includes(s) && (i = i.replace(new RegExp(s, "g"), _[s](a)));
  var v = intArrayFromString((i = i.replace(/\0\0/g, "%")), !1);
  return v.length > t ? 0 : (writeArrayToMemory(v, e), v.length - 1);
}
function _strftime_l(e, t, r, n) {
  return _strftime(e, t, r, n);
}
function _time(e) {
  var t = (Date.now() / 1e3) | 0;
  return e && (HEAP32[e >> 2] = t), t;
}
(Module.__MONTH_DAYS_REGULAR = __MONTH_DAYS_REGULAR),
  (Module.__addDays = __addDays),
  (Module._strftime = _strftime),
  (Module._strftime_l = _strftime_l),
  (Module._time = _time);
var FSNode = function (e, t, r, n) {
    e || (e = this),
      (this.parent = e),
      (this.mount = e.mount),
      (this.mounted = null),
      (this.id = FS.nextInode++),
      (this.name = t),
      (this.mode = r),
      (this.node_ops = {}),
      (this.stream_ops = {}),
      (this.rdev = n);
  },
  readMode = 365,
  writeMode = 146;
function intArrayFromString(e, t, r) {
  var n = r > 0 ? r : lengthBytesUTF8(e) + 1,
    o = new Array(n),
    a = stringToUTF8Array(e, o, 0, o.length);
  return t && (o.length = a), o;
}
Object.defineProperties(FSNode.prototype, {
  read: {
    get: function () {
      return (this.mode & readMode) === readMode;
    },
    set: function (e) {
      e ? (this.mode |= readMode) : (this.mode &= ~readMode);
    },
  },
  write: {
    get: function () {
      return (this.mode & writeMode) === writeMode;
    },
    set: function (e) {
      e ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    },
  },
  isFolder: {
    get: function () {
      return FS.isDir(this.mode);
    },
  },
  isDevice: {
    get: function () {
      return FS.isChrdev(this.mode);
    },
  },
}),
  (FS.FSNode = FSNode),
  FS.staticInit();
var calledRun,
  asmLibraryArg = {
    a: ___assert_fail,
    c: ___cxa_allocate_exception,
    b: ___cxa_throw,
    h: ___syscall_fcntl64,
    w: ___syscall_ftruncate64,
    v: ___syscall_ioctl,
    u: ___syscall_open,
    p: __localtime_js,
    o: __tzset_js,
    f: _abort,
    n: _emscripten_asm_const_int,
    m: _emscripten_memcpy_big,
    d: _emscripten_resize_heap,
    e: _emscripten_run_script,
    t: _environ_get,
    s: _environ_sizes_get,
    g: _fd_close,
    r: _fd_read,
    l: _fd_seek,
    q: _fd_write,
    k: _setTempRet0,
    j: _strftime_l,
    i: _time,
  },
  asm = createWasm(),
  ___wasm_call_ctors = (Module.___wasm_call_ctors = function () {
    return (___wasm_call_ctors = Module.___wasm_call_ctors =
      Module.asm.y).apply(null, arguments);
  }),
  _malloc = (Module._malloc = function () {
    return (_malloc = Module._malloc = Module.asm.z).apply(null, arguments);
  }),
  _realloc = (Module._realloc = function () {
    return (_realloc = Module._realloc = Module.asm.A).apply(null, arguments);
  }),
  _setSampleRate = (Module._setSampleRate = function () {
    return (_setSampleRate = Module._setSampleRate = Module.asm.B).apply(
      null,
      arguments
    );
  }),
  _main = (Module._main = function () {
    return (_main = Module._main = Module.asm.C).apply(null, arguments);
  }),
  _prepareRomBuffer = (Module._prepareRomBuffer = function () {
    return (_prepareRomBuffer = Module._prepareRomBuffer = Module.asm.D).apply(
      null,
      arguments
    );
  }),
  _getSymbol = (Module._getSymbol = function () {
    return (_getSymbol = Module._getSymbol = Module.asm.E).apply(
      null,
      arguments
    );
  }),
  _loadROM = (Module._loadROM = function () {
    return (_loadROM = Module._loadROM = Module.asm.F).apply(null, arguments);
  }),
  _savGetSize = (Module._savGetSize = function () {
    return (_savGetSize = Module._savGetSize = Module.asm.G).apply(
      null,
      arguments
    );
  }),
  _savGetPointer = (Module._savGetPointer = function () {
    return (_savGetPointer = Module._savGetPointer = Module.asm.H).apply(
      null,
      arguments
    );
  }),
  _savUpdateChangeFlag = (Module._savUpdateChangeFlag = function () {
    return (_savUpdateChangeFlag = Module._savUpdateChangeFlag =
      Module.asm.I).apply(null, arguments);
  }),
  _runFrame = (Module._runFrame = function () {
    return (_runFrame = Module._runFrame = Module.asm.J).apply(null, arguments);
  }),
  _fillAudioBuffer = (Module._fillAudioBuffer = function () {
    return (_fillAudioBuffer = Module._fillAudioBuffer = Module.asm.K).apply(
      null,
      arguments
    );
  }),
  _zlibCompress = (Module._zlibCompress = function () {
    return (_zlibCompress = Module._zlibCompress = Module.asm.L).apply(
      null,
      arguments
    );
  }),
  _zlibDecompress = (Module._zlibDecompress = function () {
    return (_zlibDecompress = Module._zlibDecompress = Module.asm.M).apply(
      null,
      arguments
    );
  }),
  _chtGetList = (Module._chtGetList = function () {
    return (_chtGetList = Module._chtGetList = Module.asm.N).apply(
      null,
      arguments
    );
  }),
  _chtAddItem = (Module._chtAddItem = function () {
    return (_chtAddItem = Module._chtAddItem = Module.asm.O).apply(
      null,
      arguments
    );
  }),
  _utilStrLen = (Module._utilStrLen = function () {
    return (_utilStrLen = Module._utilStrLen = Module.asm.P).apply(
      null,
      arguments
    );
  }),
  _micWriteSamples = (Module._micWriteSamples = function () {
    return (_micWriteSamples = Module._micWriteSamples = Module.asm.Q).apply(
      null,
      arguments
    );
  }),
  ___errno_location = (Module.___errno_location = function () {
    return (___errno_location = Module.___errno_location = Module.asm.R).apply(
      null,
      arguments
    );
  }),
  _htons = (Module._htons = function () {
    return (_htons = Module._htons = Module.asm.T).apply(null, arguments);
  }),
  stackSave = (Module.stackSave = function () {
    return (stackSave = Module.stackSave = Module.asm.U).apply(null, arguments);
  }),
  stackRestore = (Module.stackRestore = function () {
    return (stackRestore = Module.stackRestore = Module.asm.V).apply(
      null,
      arguments
    );
  }),
  stackAlloc = (Module.stackAlloc = function () {
    return (stackAlloc = Module.stackAlloc = Module.asm.W).apply(
      null,
      arguments
    );
  }),
  dynCall_jiji = (Module.dynCall_jiji = function () {
    return (dynCall_jiji = Module.dynCall_jiji = Module.asm.X).apply(
      null,
      arguments
    );
  }),
  dynCall_viijii = (Module.dynCall_viijii = function () {
    return (dynCall_viijii = Module.dynCall_viijii = Module.asm.Y).apply(
      null,
      arguments
    );
  }),
  dynCall_iiiiij = (Module.dynCall_iiiiij = function () {
    return (dynCall_iiiiij = Module.dynCall_iiiiij = Module.asm.Z).apply(
      null,
      arguments
    );
  }),
  dynCall_iiiiijj = (Module.dynCall_iiiiijj = function () {
    return (dynCall_iiiiijj = Module.dynCall_iiiiijj = Module.asm._).apply(
      null,
      arguments
    );
  }),
  dynCall_iiiiiijj = (Module.dynCall_iiiiiijj = function () {
    return (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = Module.asm.$).apply(
      null,
      arguments
    );
  });
function ExitStatus(e) {
  (this.name = "ExitStatus"),
    (this.message = "Program terminated with exit(" + e + ")"),
    (this.status = e);
}
Module.UTF8ToString = UTF8ToString;
var calledMain = !1;
function callMain(e) {
  var t = Module._main;
  try {
    var r = t(0, 0);
    return exit(r, !0), r;
  } catch (e) {
    return handleException(e);
  } finally {
    calledMain = !0;
  }
}
function run(e) {
  function t() {
    calledRun ||
      ((calledRun = !0),
      (Module.calledRun = !0),
      ABORT ||
        (initRuntime(),
        preMain(),
        Module.onRuntimeInitialized && Module.onRuntimeInitialized(),
        shouldRunNow && callMain(e),
        postRun()));
  }
  (e = e || arguments_),
    runDependencies > 0 ||
      (preRun(),
      runDependencies > 0 ||
        (Module.setStatus
          ? (Module.setStatus("Running..."),
            setTimeout(function () {
              setTimeout(function () {
                Module.setStatus("");
              }, 1),
                t();
            }, 1))
          : t()));
}
function exit(e, t) {
  (EXITSTATUS = e), keepRuntimeAlive() || exitRuntime(), procExit(e);
}
function procExit(e) {
  (EXITSTATUS = e),
    keepRuntimeAlive() || (Module.onExit && Module.onExit(e), (ABORT = !0)),
    quit_(e, new ExitStatus(e));
}
if (
  ((dependenciesFulfilled = function e() {
    calledRun || run(), calledRun || (dependenciesFulfilled = e);
  }),
  (Module.run = run),
  Module.preInit)
)
  for (
    "function" == typeof Module.preInit && (Module.preInit = [Module.preInit]);
    Module.preInit.length > 0;

  )
    Module.preInit.pop()();
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1), run();
