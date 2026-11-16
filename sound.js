// Lawnquistadors: sword sounds on buttons and cards. Click/tap = the sword unsheathe;
// mouse/pen hover = the sword slash, quieter.
// Rules: muted by default behind one visible toggle; never autoplays (hover, click or
// tap only); keyboard focus never makes a sound; no music; nothing loads until the
// visitor turns sound on. Both sounds are two CC0 takes each in assets/sounds/ (see SPEC-NOTES).
(function () {
  'use strict';

  // Interactive buttons and cards that make sound: CTA pills (incl. the quote submit),
  // the clickable $10-off card, the mobile bar and the service cards.
  // Everything else (review cards, the logo, plain links) is silent.
  var SOUND_TARGETS = '.btn, .offer, .mobile-bar a, .service';
  var SLASH_SRCS = ['assets/sounds/sword-slash.mp3', 'assets/sounds/sword-slash-2.mp3'];
  var UNSHEATHE_SRCS = ['assets/sounds/sword-unsheathe.mp3', 'assets/sounds/sword-unsheathe-2.mp3'];

  // ---- sound: <audio> elements routed into Web Audio for gain, so the CSP can keep
  // connect-src 'none' ----
  var sound = (function () {
    var btn = document.getElementById('sound-toggle');
    var on = false, ctx = null;
    var banks = { slash: [], unsheathe: [] };
    var lastRate = { slash: 1, unsheathe: 1 };

    // two voices per take, so a click can land while a hover slash (or the previous
    // unsheathe) is still ringing
    function bank(srcs) {
      return srcs.map(function (src) {
        var pool = [];
        for (var j = 0; j < 2; j++) {
          var a = new Audio(src);
          a.preload = 'auto';
          // let playbackRate shift pitch too, not just speed
          a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = false;
          var g = ctx.createGain();
          ctx.createMediaElementSource(a).connect(g).connect(ctx.destination);
          pool.push({ el: a, gain: g, at: 0 });
        }
        return pool;
      });
    }

    if (btn) {
      btn.hidden = false;
      btn.title = 'Sound: off';
      btn.addEventListener('click', function () {
        on = !on;
        btn.setAttribute('aria-pressed', String(on));
        btn.title = 'Sound: ' + (on ? 'on' : 'off');
        if (on && !ctx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (AC) {
            ctx = new AC();
            banks.slash = bank(SLASH_SRCS);
            banks.unsheathe = bank(UNSHEATHE_SRCS);
          }
        }
      });
    }

    // level 1 = click/tap (files peak ~-12 dBFS), 0.5 = hover.
    // Every play varies: a random take, playbackRate 0.94-1.06 (never within 0.02 of
    // the previous play of that sound), and gain 0.9-1.0x of the level (jitter only
    // ever quieter).
    function play(kind, level) {
      var voices = banks[kind];
      if (!on || !ctx || !voices.length) return;
      if (ctx.state === 'suspended') ctx.resume();
      var pool = voices[(Math.random() * voices.length) | 0];
      var v = pool[0];
      for (var i = 0; i < pool.length; i++) {
        if (pool[i].el.paused || pool[i].el.ended) { v = pool[i]; break; }
        if (pool[i].at < v.at) v = pool[i]; // all busy: reuse the oldest
      }
      var rate;
      do { rate = 0.94 + Math.random() * 0.12; } while (Math.abs(rate - lastRate[kind]) < 0.02);
      lastRate[kind] = rate;
      v.at = performance.now();
      v.el.playbackRate = rate;
      v.gain.gain.value = level * (0.9 + Math.random() * 0.1);
      v.el.currentTime = 0;
      var p = v.el.play();
      if (p && p.catch) p.catch(function () {});
    }

    return {
      slash: function (level) { play('slash', level); },
      unsheathe: function (level) { play('unsheathe', level); }
    };
  })();

  // Click/tap: full-level unsheathe every time (on touch there is no hover; a tap is a click).
  document.addEventListener('click', function (e) {
    if (e.target.closest(SOUND_TARGETS)) sound.unsheathe(1);
  });

  // Hover: the slash at half level, pointer enter only (mouse/pen), at most once per
  // 400 ms per button, never again while the pointer stays on it. Keyboard focus never
  // makes a sound.
  var HOVER_GAP = 400, SWEEP_GAP = 120, HOVER_LEVEL = 0.5, lastAnyHover = -Infinity;
  Array.prototype.forEach.call(document.querySelectorAll(SOUND_TARGETS), function (el) {
    var lastHover = -Infinity;
    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      var t = performance.now();
      // per-button 400 ms throttle, plus a short global gap so a fast sweep
      // across a row of buttons gives one clean slash instead of a smear
      if (t - lastHover < HOVER_GAP || t - lastAnyHover < SWEEP_GAP) return;
      lastHover = lastAnyHover = t;
      sound.slash(HOVER_LEVEL);
    });
  });
})();
