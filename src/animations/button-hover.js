// ================================
// BUTTON HOVER ANIMATION
// ================================
(function () {
  'use strict';

  const BTN_SELECTOR      = '.button_component';
  const BRACKETS_SELECTOR = '.corner_element';
  const TEXT_SELECTOR     = '.button_component_label';

  const COLOR_WHITE       = '#e5e5e5';
  const COLOR_BLACK       = '#020202';
  const COLOR_TRANSPARENT = 'rgba(0,0,0,0)';

  const DURATION = 0.28;
  const EASE     = 'power2.inOut'; // easeInOutCubic

  const SPREAD = {
    'is-top-left':     { x: -5, y: -5 },
    'is-top-right':    { x:  5, y: -5 },
    'is-bottom-left':  { x: -5, y:  5 },
    'is-bottom-right': { x:  5, y:  5 },
  };

  function getSpread(el) {
    for (const [cls, val] of Object.entries(SPREAD)) {
      if (el.classList.contains(cls)) return val;
    }
    return { x: 0, y: 0 };
  }

  function initButton(btn) {
    if (btn._btnAnimInit) return;
    btn._btnAnimInit = true;

    const brackets = btn.querySelectorAll(BRACKETS_SELECTOR);
    const text     = btn.querySelector(TEXT_SELECTOR);

    btn.addEventListener('mouseenter', () => {
      brackets.forEach(el => {
        const { x, y } = getSpread(el);
        gsap.killTweensOf(el);
        gsap.fromTo(el,
          { x: 0, y: 0, opacity: 1 },
          { x, y, opacity: 0, duration: DURATION, ease: EASE }
        );
      });

      gsap.killTweensOf(btn);
      gsap.to(btn, { backgroundColor: COLOR_WHITE, duration: DURATION, ease: EASE });

      if (text) {
        gsap.killTweensOf(text);
        gsap.to(text, { color: COLOR_BLACK, duration: DURATION, ease: EASE });
      }
    });

    btn.addEventListener('mouseleave', () => {
      brackets.forEach(el => {
        gsap.killTweensOf(el);
        gsap.to(el, { x: 0, y: 0, opacity: 1, duration: DURATION, ease: EASE });
      });

      gsap.killTweensOf(btn);
      gsap.to(btn, { backgroundColor: COLOR_TRANSPARENT, duration: DURATION, ease: EASE });

      if (text) {
        gsap.killTweensOf(text);
        gsap.to(text, { color: COLOR_WHITE, duration: DURATION, ease: EASE });
      }
    });
  }

  function init() {
    document.querySelectorAll(BTN_SELECTOR).forEach(initButton);
  }

  window.addEventListener('load', init);

})();
