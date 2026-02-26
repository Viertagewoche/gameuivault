// ================================
// BACK TO TOP BUTTON
// ================================
(function () {
  'use strict';

  const BTN_SELECTOR    = '.back_to_top_button';
  const FOOTER_SELECTOR = '.footer_component';
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

      const nearFooter     = (scrollY + windowHeight) >= footerTop;
      const scrolledEnough = scrollY > SHOW_AFTER_PX;

      if (scrolledEnough && !nearFooter) {
        gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: DURATION, ease: EASE });
      } else {
        gsap.to(btn, { opacity: 0, pointerEvents: 'none', duration: DURATION, ease: EASE });
      }
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
