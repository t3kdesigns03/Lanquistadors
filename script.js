// Lawnquistadors spec site. No network calls, no storage, no cookies.
(function () {
  'use strict';

  // ----- Story: collapse the long version on phones -----
  var more = document.getElementById('story-more');
  var toggle = document.querySelector('.read-more');
  var mq = window.matchMedia('(max-width: 720px)');
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
  if (mq.addEventListener) mq.addEventListener('change', syncStory); else mq.addListener(syncStory);
  syncStory();

  // ----- Quote form: front-end only -----
  // SPEC DEMO: nothing is sent anywhere. Values are validated, then cleared.
  var form = document.getElementById('quote-form');
  var done = document.getElementById('quote-done');
  var reset = document.getElementById('quote-reset');
  var fields = ['q-name', 'q-phone', 'q-address', 'q-service'].map(function (id) {
    return document.getElementById(id);
  });

  function check(el) {
    var v = el.value.trim();
    var ok = v.length > 0;
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
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (el) { if (!check(el) && !firstBad) firstBad = el; });
    if (firstBad) { firstBad.focus(); return; }

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
})();
