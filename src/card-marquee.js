// ================================
// CARD TITLE MARQUEE
// ================================
(function () {
  'use strict';

  const CARD_CONFIGS = [
    {
      cardSelector:  '.games-card_component',
      titleSelector: '.games-card_title',
    },
    {
      cardSelector:  '.screenshot-card_component',
      titleSelector: '.screenshot-card_title',
    },
  ];

  const style = document.createElement('style');
  style.textContent = `
    .games-card_title,
    .screenshot-card_title {
      white-space: nowrap;
      display: block;
    }

    @keyframes guiv-marquee {
      0%   { transform: translateX(0); }
      40%  { transform: translateX(var(--guiv-marquee-offset)); }
      60%  { transform: translateX(var(--guiv-marquee-offset)); }
      100% { transform: translateX(0); }
    }

    .is-marquee-active {
      animation: guiv-marquee 3s ease-in-out infinite;
    }

    .is-marquee-return {
      transition: transform 0.6s ease-in-out;
      transform: translateX(0) !important;
    }
  `;
  document.head.appendChild(style);

  function setupCard(card, titleSelector) {
    const title = card.querySelector(titleSelector);
    if (!title) return;

    if (card._guivMarqueeInit) {
      const offset = title.scrollWidth - title.clientWidth;
      if (offset > 0) {
        title.style.setProperty('--guiv-marquee-offset', `-${offset}px`);
        card._guivMarqueeTruncated = true;
      } else {
        card._guivMarqueeTruncated = false;
        title.classList.remove('is-marquee-active', 'is-marquee-return');
        title.style.transform = '';
      }
      return;
    }

    card._guivMarqueeInit      = true;
    card._guivMarqueeTruncated = false;

    card.addEventListener('mouseenter', () => {
      if (!card._guivMarqueeTruncated) return;
      title.classList.remove('is-marquee-return');
      title.classList.add('is-marquee-active');
    });

    card.addEventListener('mouseleave', () => {
      if (!card._guivMarqueeTruncated) return;
      title.classList.remove('is-marquee-active');
      title.classList.add('is-marquee-return');
      setTimeout(() => title.classList.remove('is-marquee-return'), 600);
    });

    const ro = new ResizeObserver(() => {
      const offset = title.scrollWidth - title.clientWidth;
      if (offset > 0) {
        title.style.setProperty('--guiv-marquee-offset', `-${offset}px`);
        card._guivMarqueeTruncated = true;
      } else {
        card._guivMarqueeTruncated = false;
        title.classList.remove('is-marquee-active', 'is-marquee-return');
        title.style.transform = '';
      }
    });

    ro.observe(card);
  }

  function initMarquee() {
    CARD_CONFIGS.forEach(({ cardSelector, titleSelector }) => {
      document.querySelectorAll(cardSelector).forEach((card) => {
        setupCard(card, titleSelector);
      });
    });
  }

  document.addEventListener('fs-list-ready',  initMarquee);
  document.addEventListener('fs-list-render', initMarquee);
  window.addEventListener('load', () => setTimeout(initMarquee, 500));

})();
