/* =====================================================================
   main.js  —  the only script the site needs
   ---------------------------------------------------------------------
   What it does, in order:
     1. Loads partials/header.html into <div id="site-header"></div>
        and partials/footer.html into <div id="site-footer"></div>.
        This is why you only edit the navbar/footer in ONE place.
     2. Highlights the nav link for the page you're on.
     3. Wires up the mobile menu (it lives inside the injected header).
     4. Wires up the click-to-expand project cards.

   You almost never need to touch this file.

   NOTE: loading the partials uses fetch(), which browsers block when you
   open a file by double-clicking it (the address bar shows file://...).
   It works automatically once the site is online, or locally if you run a
   tiny preview server — see README.txt for the one-line command.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Pages live in /pages, partials live in /partials — so we go up one level.
  var PARTIALS = '../partials/';

  // Load a partial file into a container, then run an optional callback.
  function include(containerId, file, done) {
    var box = document.getElementById(containerId);
    if (!box) return;

    fetch(PARTIALS + file)
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load ' + file);
        return res.text();
      })
      .then(function (html) {
        box.innerHTML = html;
        if (done) done();
      })
      .catch(function (err) {
        box.innerHTML =
          '<p style="font-family:monospace;color:#8A93A6;padding:16px">' +
          'Header/footer could not load. If you opened this by double-clicking ' +
          'the file, see README.txt — you just need a quick local preview server.' +
          '</p>';
        console.error(err);
      });
  }

  // ---- 1 & 2. Load the header, then light up the current page's link ----
  include('site-header', 'header.html', function () {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    document.querySelectorAll('.nav__links a').forEach(function (link) {
      if (link.getAttribute('href') === page) link.classList.add('is-active');
    });

    wireMobileMenu(); // the menu button lives inside the header we just added
  });

  // ---- Load the footer ----
  include('site-footer', 'footer.html');

  // ---- 3. Mobile menu open / close ----
  function wireMobileMenu() {
    var toggle   = document.querySelector('.nav__toggle');
    var overlay  = document.querySelector('.overlay');
    var closeBtn = document.querySelector('.overlay__close');
    if (!toggle || !overlay) return;

    function open()  { overlay.dataset.open = 'true';  document.body.style.overflow = 'hidden'; }
    function close() { overlay.dataset.open = 'false'; document.body.style.overflow = '';       }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // ---- 4. Project expanders (only present on the projects page) ----
  var toggles = document.querySelectorAll('.project__toggle');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var detail = btn.parentElement.querySelector('.project__detail');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all panels first (accordion behavior)...
      toggles.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var d = other.parentElement.querySelector('.project__detail');
        if (d) d.style.maxHeight = null;
      });

      // ...then open the clicked one, unless it was already open.
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        detail.style.maxHeight = detail.scrollHeight + 'px';
      }
    });
  });
});