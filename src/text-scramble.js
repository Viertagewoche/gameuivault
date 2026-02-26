// ================================
// TEXT SCRAMBLE EFFECT
// ================================
(function () {
  'use strict';

  const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_';
  const DEFAULT_SPEED = 20;
  const REVEAL_SPEED  = 10;

  class TextScramble {
    constructor(el) {
      this.el       = el;
      this.chars    = el.dataset.scrambleChars || DEFAULT_CHARS;
      this.speed    = parseInt(el.dataset.scrambleSpeed) || DEFAULT_SPEED;
      this.original = this._getTextNode(el);
      this.frame    = null;
    }

    // FIX Bug 1: Span-Wrapper erzwingen damit innerHTML-Änderungen
    // nicht auf dem <a>-Tag selbst landen → verhindert mouseenter-Loop
    _getTextNode(el) {
      const spans = el.querySelectorAll('span');
      for (const span of spans) {
        if (!span.querySelector('span') && span.textContent.trim().length > 2) {
          this._textEl = span;
          return span.textContent;
        }
      }
      const wrapper = document.createElement('span');
      wrapper.textContent = el.textContent.trim();
      el.textContent = '';
      el.appendChild(wrapper);
      this._textEl = wrapper;
      return wrapper.textContent;
    }

    restore() {
      cancelAnimationFrame(this.frame);
      if (this._textEl && this._textEl !== this.el) {
        this._textEl.textContent = this.original;
      } else {
        this.el.textContent = this.original;
      }
    }

    scramble() {
      cancelAnimationFrame(this.frame);

      const text = this.original;

      this.queue = text.split('').map((char, i) => ({
        to: char,
        start: Math.floor(i / REVEAL_SPEED),
        end: Math.floor(i / REVEAL_SPEED) + Math.floor(Math.random() * 8) + 4,
      }));

      let iteration = 0;

      const update = () => {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
          const { to, start, end } = this.queue[i];

          if (iteration >= end) {
            complete++;
            output += to;
          } else if (iteration >= start) {
            if (' :—-.,/'.includes(to)) {
              output += to;
            } else {
              output += `<span style="opacity:0.4;pointer-events:none">${this.chars[Math.floor(Math.random() * this.chars.length)]}</span>`;
            }
          } else {
            output += `<span style="opacity:0.15;pointer-events:none">${to}</span>`;
          }
        }

        if (this._textEl && this._textEl !== this.el) {
          this._textEl.innerHTML = output;
        } else {
          this.el.innerHTML = output;
        }

        if (complete === this.queue.length) {
          if (this._textEl && this._textEl !== this.el) {
            this._textEl.textContent = this.original;
          }
          return;
        }

        iteration++;
        this.frame = requestAnimationFrame(() => setTimeout(update, this.speed));
      };

      update();
    }
  }

  const CARD_SELECTORS  = ['.games-card_component', '.screenshot-card_component'];
  const TARGET_SELECTOR = '.vault_file_ref';

  function initCard(card) {
    if (card.dataset.cardScrambleInit) return;
    card.dataset.cardScrambleInit = 'true';

    const target = card.querySelector(TARGET_SELECTOR);
    if (!target) return;

    const scrambler = new TextScramble(target);

    card.addEventListener('mouseenter', () => scrambler.scramble());
    card.addEventListener('mouseleave', () => scrambler.restore());
    card.addEventListener('click',      () => scrambler.restore(), true);
  }

  // FIX Bug 2: mouseleave hinzugefügt
  function initScrambleEl(el) {
    if (el.dataset.scrambleInit) return;
    el.dataset.scrambleInit = 'true';

    const scrambler = new TextScramble(el);
    el.addEventListener('mouseenter', () => scrambler.scramble());
    el.addEventListener('touchstart', () => scrambler.scramble(), { passive: true });
    el.addEventListener('click',      () => scrambler.restore(), true);
    el.addEventListener('mouseleave', () => scrambler.restore());
  }

  function initAll() {
    document.querySelectorAll('[data-scramble]').forEach(initScrambleEl);
    CARD_SELECTORS.forEach(sel => document.querySelectorAll(sel).forEach(initCard));
  }

  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;

          CARD_SELECTORS.forEach(sel => {
            if (node.matches(sel)) initCard(node);
            node.querySelectorAll(sel).forEach(initCard);
          });

          if (node.matches('[data-scramble]')) initScrambleEl(node);
          node.querySelectorAll('[data-scramble]').forEach(initScrambleEl);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    initAll();
    observeDOM();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Webflow = window.Webflow || [];
  window.Webflow.push(init);

})();
