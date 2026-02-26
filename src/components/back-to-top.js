// ================================
// BACK TO TOP BUTTON
// ================================
(function () {
  'use strict';

  const BTN_SELECTOR    = '.back_to_top_button';
  const FOOTER_SELECTOR = '.footer_component';
  const DURATION        = 0.25;
  const EASE            = 'power2.inOut';

  // Zeige Button nach X% der Seitenhöhe
  function getThreshold() {
    const docHeight = document.documentElement.scrollHeight;
    const w = window.innerWidth;
    if (w <= 479)  return docHeight * 0.05;  // Mobile:  5%
    if (w <= 991)  return docHeight * 0.08;  // Tablet:  8%
    return docHeight * 0.15;                  // Desktop: 15%
  }

  function init() {
    const btn    = document.querySelector(BTN_SELECTOR);
    const footer = document.querySelector(FOOTER_SELECTOR);

    if (!btn) return;

    let isVisible = false;

    gsap.set(btn, { opacity: 0, pointerEvents: 'none' });

    function show() {
      if (isVisible) return;
      isVisible = true;
      gsap.killTweensOf(btn);
      gsap.to(btn, { opacity: 1, pointerEvents: 'auto', duration: DURATION, ease: EASE });
    }

    function hide() {
      if (!isVisible) return;
      isVisible = false;
      gsap.killTweensOf(btn);
      gsap.to(btn, { opacity: 0, pointerEvents: 'none', duration: DURATION, ease: EASE });
    }

    function update() {
      const scrollY      = window.scrollY;
      const windowHeight = window.innerHeight;
      const footerTop    = footer
        ? footer.getBoundingClientRect().top + scrollY
        : document.documentElement.scrollHeight;

      const nearFooter     = (scrollY + windowHeight) >= footerTop;
      const scrolledEnough = scrollY > getThreshold();

      if (scrolledEnough && !nearFooter) {
        show();
      } else {
        hide();
      }
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
