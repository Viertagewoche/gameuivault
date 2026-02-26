// ================================
// BACK TO TOP BUTTON
// ================================
(function () {
  'use strict';

  const BTN_SELECTOR    = '.back_to_top_button';
  const FOOTER_SELECTOR = 'footer';
  const SHOW_AFTER_PX   = 300;
  const DURATION        = 0.3;
  const EASE            = 'power2.inOut';

  function init() {
    const btn    = document.querySelector(BTN_SELECTOR);
    const footer = document.querySelector(FOOTER_SELECTOR);

    if (!btn) return;

    // Startzustand
    gsap.set(btn, { opacity: 0, pointerEvents: 'none' });

    function update() {
      const scrollY      = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight    = document.documentElement.scrollHeight;

      // Footer-Grenze berechnen
      const footerTop = footer
        ? footer.getBoundingClientRect().top + scrollY
        : docHeight;

      const nearFooter = (scrollY + windowHeight) >= footerTop;
      const scrolledEnough = scrollY > SHOW_AFTER_PX;

      if (scrolledEnough && !nearFooter) {
        // Sichtbar
        gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: DURATION, ease: EASE });
      } else {
        // Unsichtbar
        gsap.to(btn, { opacity: 0, pointerEvents: 'none', duration: DURATION, ease: EASE });
      }
    }

    // Scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update(); // Initial check
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
