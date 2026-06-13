/* =====================================================================
   main.js  —  all the interactivity for the whole site
   ---------------------------------------------------------------------
   Three small jobs, nothing clever:
     1. Open/close the mobile menu.
     2. Highlight the nav link for the page you're on.
     3. Expand/collapse the project detail panels.
   You shouldn't need to edit this to change text or images.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- 1. MOBILE MENU ---- */
  var toggle  = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.overlay');
  var closeBtn = document.querySelector('.overlay__close');

  function openMenu()  { overlay.dataset.open = 'true';  document.body.style.overflow = 'hidden'; }
  function closeMenu() { overlay.dataset.open = 'false'; document.body.style.overflow = '';       }

  if (toggle && overlay) {
    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Tapping any link inside the overlay closes it.
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // The Escape key also closes it.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- 2. ACTIVE NAV HIGHLIGHT ----
     Reads the current file name (e.g. "about.html") and lights up the
     matching link. This is why every page can share the exact same navbar. */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === '') page = 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (link) {
    if (link.getAttribute('href') === page) link.classList.add('is-active');
  });

  /* ---- 3. PROJECT EXPANDERS ----
     Click a project's header to slide its detail panel open. Clicking it
     again (or opening another) closes it. */
  var toggles = document.querySelectorAll('.project__toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var detail = btn.parentElement.querySelector('.project__detail');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close every panel first (accordion behavior).
      toggles.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var d = other.parentElement.querySelector('.project__detail');
        if (d) d.style.maxHeight = null;
      });

      // Then open the one that was clicked, unless it was already open.
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        detail.style.maxHeight = detail.scrollHeight + 'px';
      }
    });
  });
});