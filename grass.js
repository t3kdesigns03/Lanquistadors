// Lawnquistadors: grass-pop effect (Butter Batch popcorn mechanics, with grass).
// Rules: the logo image is never touched; blades always launch UP first, then
// arc and drift down; no music (two sounds, both muted by default behind one
// toggle: a tiny synthesized pop for grass bursts, a sword slash for buttons);
// every blade lives <= LIFE_MAX seconds and is removed from the DOM; bursts are
// clipped to the section they start in. Reduced motion disables all of it.
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return; // hint + sound toggle stay hidden

  // Greens sampled from the grass tuft in Levi's logo (img/logo.png)
  var GREENS = ['#003000', '#004800', '#005400', '#006000', '#006c0c', '#0c780c'];
  var GRAVITY = 1500;      // px/s^2
  var FALL_MAX = 420;      // terminal "drift" speed, px/s
  var LIFE_MAX = 3.4;      // hard cap, seconds
  var FADE = 0.6;          // fade-out window at end of life, seconds
  var MAX_BLADES = 140;

  var blades = [];
  var rafId = 0;
  var last = 0;
  var layers = new WeakMap();
  var fixedLayer = null;
  var scale = Math.min(1, Math.sqrt(window.innerWidth / 900));

  // ---- blade template (cloned per particle; cheap, no image assets) ----
  var NS = 'http://www.w3.org/2000/svg';
  var tpl = document.createElementNS(NS, 'svg');
  tpl.setAttribute('viewBox', '0 0 10 28');
  tpl.setAttribute('class', 'blade');
  tpl.setAttribute('aria-hidden', 'true');
  var path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M5 0C7.2 7 9 17 7.6 28H2.4C1 17 2.8 7 5 0Z');
  path.setAttribute('fill', 'currentColor');
  tpl.appendChild(path);

  function rand(a, b) { return a + Math.random() * (b - a); }

  function layerFor(el) {
    if (el.closest('.site-header, .mobile-bar, .sound-toggle')) return getFixedLayer();
    var host = el.closest('section, .site-footer');
    if (!host) return getFixedLayer();
    var layer = layers.get(host);
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'grass-layer';
      layer.setAttribute('aria-hidden', 'true');
      host.appendChild(layer);
      layers.set(host, layer);
    }
    return layer;
  }
  function getFixedLayer() {
    if (!fixedLayer) {
      fixedLayer = document.createElement('div');
      fixedLayer.className = 'grass-layer is-fixed';
      fixedLayer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(fixedLayer);
    }
    return fixedLayer;
  }
  // viewport point -> layer-local point
  function toLocal(layer, cx, cy) {
    if (layer === fixedLayer) return { x: cx, y: cy, h: window.innerHeight };
    var r = layer.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top, h: r.height };
  }

  function spawn(layer, x, y, maxY, power, life) {
    if (blades.length >= MAX_BLADES) return;
    var el = tpl.cloneNode(true);
    var size = rand(0.75, 1.25);
    el.style.color = GREENS[(Math.random() * GREENS.length) | 0];
    el.style.width = (10 * size).toFixed(1) + 'px';
    el.style.height = (28 * size).toFixed(1) + 'px';
    // Launch angle is always in the upper cone: straight up +/- 35 degrees
    var ang = (-90 + rand(-35, 35)) * Math.PI / 180;
    var speed = power * rand(0.78, 1.12) * scale;
    var b = {
      el: el, x: x, y: y, maxY: maxY + 40,
      vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, // vy < 0 = up
      rot: rand(-25, 25), vr: rand(-420, 420), age: 0, born: performance.now(),
      life: Math.min(life || LIFE_MAX, LIFE_MAX), phase: rand(0, 6.28)
    };
    place(b, 1);
    layer.appendChild(el);
    blades.push(b);
  }

  function place(b, op) {
    b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0) rotate(' + b.rot.toFixed(1) + 'deg)';
    b.el.style.opacity = op;
  }

  function tick(t) {
    var dt = last ? Math.min(0.033, (t - last) / 1000) : 0.016;
    last = t;
    for (var i = blades.length - 1; i >= 0; i--) {
      var b = blades[i];
      // Age is wall-clock time, so a janky/throttled device still removes blades on time;
      // only the physics step (dt) is capped.
      b.age = (t - b.born) / 1000;
      b.vy = Math.min(b.vy + GRAVITY * dt, FALL_MAX);
      b.vx *= 1 - 0.9 * dt;
      var falling = b.vy > 0;
      b.x += b.vx * dt + (falling ? Math.sin(b.age * 7 + b.phase) * 38 * dt : 0); // flutter on the way down
      b.y += b.vy * dt;
      b.rot += b.vr * dt;
      if (falling) b.vr *= 1 - 1.5 * dt;
      if (b.age >= b.life || b.y > b.maxY) {
        b.el.remove();
        blades.splice(i, 1);
        continue;
      }
      place(b, b.age > b.life - FADE ? Math.max(0, (b.life - b.age) / FADE) : 1);
    }
    if (blades.length) rafId = requestAnimationFrame(tick);
    else { rafId = 0; last = 0; }
  }
  function run() {
    if (!rafId) { last = 0; rafId = requestAnimationFrame(tick); }
    // Safety net: even if frames stall entirely, nothing outlives LIFE_MAX.
    setTimeout(sweep, LIFE_MAX * 1000 + 150);
  }
  function sweep() {
    var now = performance.now();
    for (var i = blades.length - 1; i >= 0; i--) {
      if (now - blades[i].born >= LIFE_MAX * 1000) { blades[i].el.remove(); blades.splice(i, 1); }
    }
  }

  function clearAll() {
    blades.forEach(function (b) { b.el.remove(); });
    blades = [];
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0; last = 0;
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearAll(); });
  if (reduce.addEventListener) reduce.addEventListener('change', function () { if (reduce.matches) clearAll(); });

  // ---- bursts ----
  function burstAt(sourceEl, cx, cy, n, power, life, quiet) {
    if (reduce.matches) return;
    var layer = layerFor(sourceEl);
    var p = toLocal(layer, cx, cy);
    for (var i = 0; i < n; i++) spawn(layer, p.x + rand(-6, 6), p.y + rand(-4, 4), p.h, power, life);
    run();
    if (!quiet) sound.pop();
  }

  // Interactive buttons and cards that carry the signature sword slash (hover + click):
  // CTA pills (incl. the quote submit), the clickable $10-off card, and the mobile bar.
  // Plain links, the service/review cards (not links) and small utility buttons don't.
  var SLASH_TARGETS = '.btn, .offer, .mobile-bar a';

  // Tap any button or card: 7-11 blades from the exact tap point
  var TAP_TARGETS = 'a.btn, button, .offer, .service, .review, .mobile-bar a';
  document.addEventListener('click', function (e) {
    var t = e.target.closest(TAP_TARGETS);
    if (!t || t.closest('.brand')) return;
    var cx = e.clientX, cy = e.clientY;
    if (e.detail === 0 || (cx === 0 && cy === 0)) { // keyboard activation: use the element's center
      var r = t.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
    }
    // One sound per interaction: slash targets slash, everything else pops.
    var slashes = t.matches(SLASH_TARGETS);
    burstAt(t, cx, cy, 7 + ((Math.random() * 5) | 0), 640, null, slashes);
    if (slashes) sound.slash(1);
  });

  // Tap the logo: 14 blades burst UP from around it (logo image itself untouched)
  var brand = document.querySelector('.brand');
  var hint = document.getElementById('grass-hint');
  if (hint) hint.hidden = false;
  brand.addEventListener('click', function () {
    if (reduce.matches) return;
    var r = brand.getBoundingClientRect();
    var layer = getFixedLayer();
    for (var i = 0; i < 14; i++) {
      var f = i / 13;
      // ring around the logo: along the bottom edge and up both sides
      var x = r.left + r.width * (0.04 + 0.92 * f);
      var y = r.top + r.height * (f < 0.15 || f > 0.85 ? rand(0.35, 0.8) : rand(0.8, 1));
      spawn(layer, x, y, window.innerHeight, 560, 2.8);
    }
    run();
    sound.pop();
    if (hint && !hint.classList.contains('is-done')) {
      hint.classList.add('is-done');
      setTimeout(function () { hint.hidden = true; }, 450);
    }
  });

  // Intro: one wave along the bottom edge of the hero, once per page open
  function intro() {
    var hero = document.querySelector('.hero');
    if (!hero || reduce.matches) return;
    var r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return; // not on screen (deep link)
    var layer = layerFor(hero);
    var n = Math.max(16, Math.min(46, Math.round(r.width / 26)));
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          var x = (i + 0.5) * (r.width / n) + rand(-8, 8);
          spawn(layer, x, r.height - 12, r.height, rand(520, 760), 3.2);
          run();
        }, i * (520 / n)); // ripples left to right over ~0.5s
      })(i);
    }
  }
  if (document.readyState === 'complete') setTimeout(intro, 200);
  else window.addEventListener('load', function () { setTimeout(intro, 200); }, { once: true });

  // ---- sound: muted by default, no music ----
  // One toggle controls both sounds: the synthesized grass pop and the sword slash
  // (assets/sounds/sword-slash.mp3, CC0, see SPEC-NOTES). Nothing loads until the
  // toggle is turned on. The slash plays through <audio> elements routed into Web
  // Audio for gain, so the CSP can keep connect-src 'none'.
  var SLASH_SRC = 'assets/sounds/sword-slash.mp3';
  var sound = (function () {
    var btn = document.getElementById('sound-toggle');
    var on = false, ctx = null, noise = null, voices = [];
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
            noise = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
            var d = noise.getChannelData(0);
            for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
            // three slash voices so a click can land while a hover slash is still ringing
            for (i = 0; i < 3; i++) {
              var a = new Audio(SLASH_SRC);
              a.preload = 'auto';
              var g = ctx.createGain();
              ctx.createMediaElementSource(a).connect(g).connect(ctx.destination);
              voices.push({ el: a, gain: g, at: 0 });
            }
          }
        }
      });
    }
    var lastPop = -1; // so the very first pop (the toggle's own confirmation) isn't throttled away
    return {
      // Signature sword slash. level 1 = click/tap (file peaks ~-12 dBFS), 0.5 = hover.
      slash: function (level) {
        if (!on || !ctx || !voices.length) return;
        if (ctx.state === 'suspended') ctx.resume();
        var v = voices[0];
        for (var i = 0; i < voices.length; i++) {
          if (voices[i].el.paused || voices[i].el.ended) { v = voices[i]; break; }
          if (voices[i].at < v.at) v = voices[i]; // all busy: reuse the oldest
        }
        v.at = performance.now();
        v.gain.gain.value = level;
        v.el.currentTime = 0;
        var p = v.el.play();
        if (p && p.catch) p.catch(function () {});
      },
      pop: function () {
        if (!on || !ctx) return;
        var now = ctx.currentTime;
        if (now - lastPop < 0.06) return;
        lastPop = now;
        if (ctx.state === 'suspended') ctx.resume();
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(rand(520, 700), now);
        o.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.07, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        o.connect(g).connect(ctx.destination);
        o.start(now); o.stop(now + 0.11);
        var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
        s.buffer = noise; bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.8; ng.gain.value = 0.035;
        s.connect(bp).connect(ng).connect(ctx.destination);
        s.start(now);
      }
    };
  })();

  // Hover: pointer enter only (mouse/pen; touch has no hover, its tap is the click above),
  // at most once per 400 ms per button, never again while the pointer stays on it.
  // Keyboard focus never makes a sound.
  var HOVER_GAP = 400, SWEEP_GAP = 120, HOVER_LEVEL = 0.5, lastAnyHover = -Infinity;
  Array.prototype.forEach.call(document.querySelectorAll(SLASH_TARGETS), function (el) {
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
