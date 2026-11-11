// Lawnquistadors spec site. No network calls, no storage, no cookies.
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 720px)');
  var mqNav = window.matchMedia('(max-width: 1020px)');
  function onChange(m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else m.addListener(fn); }

  // ----- Mobile menu (hamburger below 1020px) -----
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-toggle');
  var header = document.querySelector('.site-header');
  menuBtn.hidden = false;

  function setMenu(open, returnFocus) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    if (open) nav.querySelector('a').focus();
    else if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && mqNav.matches) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  onChange(mqNav, function () { if (!mqNav.matches) setMenu(false); });

  // ----- Story: collapse the long version on phones -----
  var more = document.getElementById('story-more');
  var toggle = document.querySelector('.read-more');
  function syncStory() {
    if (mq.matches) {
      if (toggle.getAttribute('aria-expanded') !== 'true') more.classList.add('is-collapsed');
      toggle.hidden = false;
    } else {
      more.classList.remove('is-collapsed');
      toggle.hidden = true;
    }
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    more.classList.toggle('is-collapsed', open);
    toggle.textContent = open ? 'Read Levi’s story' : 'Show less';
  });
  onChange(mq, syncStory);
  syncStory();

  // ----- Quote form: front-end only -----
  // SPEC DEMO: nothing is sent anywhere (CSP also blocks it). Values are
  // validated, summarised in the confirmation, then cleared.
  var form = document.getElementById('quote-form');
  var done = document.getElementById('quote-done');
  var reset = document.getElementById('quote-reset');
  var doneTitle = document.getElementById('done-title');
  var doneMsg = document.getElementById('done-msg');
  var email = document.getElementById('q-email');
  var fields = ['q-name', 'q-phone', 'q-email', 'q-address', 'q-service'].map(function (id) {
    return document.getElementById(id);
  });

  function check(el) {
    var v = el.value.trim();
    var ok;
    if (el === email) ok = v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    else ok = v.length > 0;
    if (ok && el.id === 'q-phone') ok = v.replace(/\D/g, '').length >= 10;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var err = document.getElementById(el.id + '-err');
    err.hidden = ok;
    if (!ok) el.setAttribute('aria-describedby', err.id); else el.removeAttribute('aria-describedby');
    return ok;
  }

  fields.forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value) check(el); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    el.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (el) { if (!check(el) && !firstBad) firstBad = el; });
    if (firstBad) { firstBad.focus(); return; }

    var first = document.getElementById('q-name').value.trim().split(/\s+/)[0];
    var how = (form.querySelector('input[name="contact"]:checked') || {}).value === 'Text' ? 'text' : 'call';
    var when = document.getElementById('q-time').value;
    doneTitle.textContent = 'Thanks, ' + first + '!';
    doneMsg.textContent = 'Levi will ' + how + ' you back with a free estimate' +
      (when ? ' (you said ' + when.toLowerCase() + ' works best).' : '.');

    form.reset();
    fields.forEach(function (el) { el.removeAttribute('aria-invalid'); });
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  reset.addEventListener('click', function () {
    done.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });

  // ----- Mobile bar: get out of the way while someone is typing -----
  var bar = document.querySelector('.mobile-bar');
  form.addEventListener('focusin', function () { bar.classList.add('is-hidden'); });
  form.addEventListener('focusout', function () {
    setTimeout(function () {
      if (!form.contains(document.activeElement)) bar.classList.remove('is-hidden');
    }, 0);
  });
})();
