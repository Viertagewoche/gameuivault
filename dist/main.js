// gameuivault - Main Bundle
// Version: 1.2.3

// ================================
// CONFIGURATION - Adjust as needed
// ================================
const CONFIG = {
  buttonClass: '.filter_accordion_button',
  chevronClass: '.icon_cheveron',
  openClass: 'is-open',
  initialOpenCount: 1,            // Desktop: only first accordion open on load
  animationDuration: '0.3s',      // Animation speed
};
// ================================


// ================================
// ACCORDION
// ================================
document.addEventListener('DOMContentLoaded', function () {
  const accordionButtons = document.querySelectorAll(CONFIG.buttonClass);

  accordionButtons.forEach(function (button, index) {
    const contents = button.nextElementSibling;
    const chevron = button.querySelector(CONFIG.chevronClass);
    if (!contents) return;
    contents.style.overflow = 'hidden';
    contents.style.transition = `max-height ${CONFIG.animationDuration} ease`;
    if (chevron) {
      chevron.style.transition = `transform ${CONFIG.animationDuration} ease`;
    }
    if (index < CONFIG.initialOpenCount) {
      contents.style.maxHeight = contents.scrollHeight + 'px';
      if (chevron) chevron.style.transform = 'rotate(0deg)';
      button.classList.add(CONFIG.openClass);
    } else {
      contents.style.maxHeight = '0px';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
    button.addEventListener('click', function () {
      const isOpen = button.classList.contains(CONFIG.openClass);
      if (isOpen) {
        contents.style.maxHeight = '0px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        button.classList.remove(CONFIG.openClass);
      } else {
        contents.style.maxHeight = contents.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        button.classList.add(CONFIG.openClass);
      }
    });
  });
});


// ================================
// FILTER SIDEBAR (Mobile only)
// ================================
(function () {
  const TRANSITION_MS = 300;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const MOBILE_BREAKPOINT = 991; // Webflow's tablet breakpoint

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function init() {
    const triggerBtn = document.querySelector('.filter_button_mobile');
    const wrapper    = document.querySelector('.filter_accordion-wrapper');
    const container  = document.querySelector('.filter_accordion-container');
    const closeBtn   = document.querySelector('.filter_sidebar_mobile_close-button');

    if (!triggerBtn || !wrapper || !container) return;

    function applyMobileStyles() {
      container.style.transition = `transform ${TRANSITION_MS}ms ${EASE}`;
      container.style.willChange = 'transform';
      container.style.transform  = 'translateX(-100%)';
    }

    function resetDesktopStyles() {
      container.style.transition = '';
      container.style.willChange = '';
      container.style.transform  = '';
      wrapper.style.display      = '';
      document.body.style.overflow = '';
    }

    // Set correct initial state
    if (isMobile()) {
      applyMobileStyles();
    }

    // Re-evaluate on resize
    window.addEventListener('resize', function () {
      if (isMobile()) {
        applyMobileStyles();
      } else {
        resetDesktopStyles();
      }
    });

    function recalcAccordions() {
      const openButtons = container.querySelectorAll('.' + CONFIG.openClass);
      openButtons.forEach(function (button) {
        const contents = button.nextElementSibling;
        if (contents) contents.style.maxHeight = contents.scrollHeight + 'px';
      });
    }

    function openSidebar() {
      if (!isMobile()) return;
      wrapper.style.display        = 'block';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.transform = 'translateX(0)';
          recalcAccordions();
        });
      });
    }

    function closeSidebar() {
      if (!isMobile()) return;
      container.style.transform    = 'translateX(-100%)';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setTimeout(() => {
        wrapper.style.display = 'none';
      }, TRANSITION_MS);
    }

    triggerBtn.addEventListener('click', openSidebar);

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    wrapper.addEventListener('click', function (e) {
      if (!container.contains(e.target)) closeSidebar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });

    // Checkbox selection closes sidebar
    document.addEventListener('change', function (e) {
      if (e.target.closest('.filter_checkbox_component')) {
        setTimeout(closeSidebar, 150);
      }
    });

    // Dropdown link selection closes sidebar
    document.addEventListener('click', function (e) {
      if (e.target.closest('.dropdown_dropdown-link')) {
        setTimeout(closeSidebar, 150);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// ================================
// SEARCH
// ================================
(function () {
  const ANIMATION_DURATION = 250; // ms

  const trigger       = document.getElementById('search-trigger');
  const triggerMobile = document.querySelector('.modal_search-form-icon_mobile');
  const modal         = document.getElementById('search-modal');
  const backdrop      = document.getElementById('search-backdrop');
  const input         = document.getElementById('search-input');
  const resultsWrap   = document.getElementById('search-results');
  const loading       = document.getElementById('search-loading');
  const container     = modal.querySelector('.modal_search-container');
  const list          = document.querySelector('[fs-list-instance="search"]');

  // Get scrollbar width to prevent layout shift
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function openModal() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';

    // Set start state before display:flex
    modal.style.opacity = '0';
    modal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
    container.style.transform = 'translateY(-12px)';
    container.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    modal.style.display = 'flex';

    // Double rAF: ensures browser registers start state before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        input.focus();
      });
    });
  }

  function closeModal() {
    // Animate out
    modal.style.opacity = '0';
    container.style.transform = 'translateY(-12px)';

    // Wait for animation to finish before hiding
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      resultsWrap.style.display = 'none';
      loading.style.display = 'none';
    }, ANIMATION_DURATION);
  }

  // Show/hide loading spinner via MutationObserver on FS fs-loading class
  const observer = new MutationObserver(() => {
    if (list.classList.contains('fs-loading')) {
      loading.style.display = 'flex';
      list.style.display = 'none';
    } else {
      loading.style.display = 'none';
      list.style.display = 'block';
    }
  });

  observer.observe(list, { attributes: true, attributeFilter: ['class'] });

  // Open modal triggers
  trigger.addEventListener('click', openModal);
  if (triggerMobile) triggerMobile.addEventListener('click', openModal);

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  // Close modal on outside click (backdrop)
  backdrop.addEventListener('click', function (e) {
    if (!e.target.closest('.modal_search-container')) closeModal();
  });

  // Show results only after 2 characters
  input.addEventListener('input', () => {
    resultsWrap.style.display =
      input.value.trim().length >= 2 ? 'block' : 'none';
  });
})();


// ================================
// LIGHTBOX
// ================================
(function () {
  let currentIndex = -1;
  let items = [];
  let suppressClose = false;
  let urlOpenDone = false;
  let isClosing = false;

  function getItems() {
    items = Array.from(document.querySelectorAll('.lightbox_component'));
    return items;
  }

  function getCollectionItems() {
    return Array.from(document.querySelectorAll('.w-dyn-item')).filter(
      item => item.querySelector('.lightbox_component')
    );
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function getSlugForIndex(index) {
    const collectionItems = getCollectionItems();
    const item = collectionItems[index];
    if (!item) return null;
    return item.querySelector('[data-lightbox-slug]')?.textContent.trim() || null;
  }

  function findIndexBySlug(slug) {
    const collectionItems = getCollectionItems();
    return collectionItems.findIndex(
      item => item.querySelector('[data-lightbox-slug]')?.textContent.trim() === slug
    );
  }

  function setUrlSlug(slug) {
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set('screenshot', slug);
    } else {
      url.searchParams.delete('screenshot');
    }
    history.replaceState(null, '', url.toString());
  }

  function openLightbox(index, animate) {
    getItems();
    if (index < 0 || index >= items.length) return;
    items.forEach(lb => {
      lb.style.display = 'none';
      lb.style.transition = '';
      lb.style.opacity = '';
      const c = lb.querySelector('.lightobx_container');
      if (c) {
        c.style.transition = '';
        c.style.transform = '';
        c.style.opacity = '';
      }
    });
    currentIndex = index;

    const lb = items[currentIndex];
    lb.style.display = 'flex';

    const slug = getSlugForIndex(index);
    setUrlSlug(slug);

    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';

    if (animate) {
      const container = lb.querySelector('.lightobx_container');
      lb.style.opacity = '0';
      if (container) {
        container.style.transform = 'scale(0.95) translateY(12px)';
        container.style.opacity = '0';
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lb.style.transition = 'opacity 250ms ease';
          lb.style.opacity = '1';
          if (container) {
            container.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease';
            container.style.transform = 'scale(1) translateY(0)';
            container.style.opacity = '1';
          }
        });
      });
    }
  }

  function closeLightbox() {
    if (isClosing || currentIndex === -1) return;
    isClosing = true;

    getItems();
    const lb = items[currentIndex];
    const container = lb?.querySelector('.lightobx_container');

    setUrlSlug(null);

    if (lb) {
      lb.style.transition = 'opacity 200ms ease';
      lb.style.opacity = '0';
    }
    if (container) {
      container.style.transition = 'transform 200ms cubic-bezier(0.4, 0, 1, 1), opacity 200ms ease';
      container.style.transform = 'scale(0.95) translateY(8px)';
      container.style.opacity = '0';
    }

    setTimeout(() => {
      getItems();
      items.forEach(lb => {
        lb.style.display = 'none';
        lb.style.transition = '';
        lb.style.opacity = '';
        const c = lb.querySelector('.lightobx_container');
        if (c) {
          c.style.transition = '';
          c.style.transform = '';
          c.style.opacity = '';
        }
      });
      currentIndex = -1;
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      isClosing = false;
    }, 200);
  }

  function navigate(direction) {
    getItems();
    if (currentIndex === -1) return;
    const next = currentIndex + direction;
    if (next >= 0 && next < items.length) openLightbox(next, false);
  }

  function getCurrentImage() {
    if (currentIndex === -1) return null;
    getItems();
    const container = items[currentIndex].querySelector('.lightobx_container');
    if (!container) return null;
    return container.querySelector('[data-lightbox-image]');
  }

  function getFilename() {
    if (currentIndex === -1) return 'screenshot.png';
    getItems();
    const lb = items[currentIndex];
    const screenshotName = lb.querySelector('.lightbox-title_text')?.textContent.trim() || 'Screenshot';
    const gameName = lb.querySelector('.lightbox-game-title')?.textContent.trim() || '';
    const sanitize = str => str.replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '').trim().replace(/\s+/g, '-');
    return gameName
      ? `${sanitize(screenshotName)}_${sanitize(gameName)}.png`
      : `${sanitize(screenshotName)}.png`;
  }

  async function getImageBlob(img) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        canvas.toBlob(blob => blob ? resolve(blob) : reject('Blob error'), 'image/png');
      };
      image.onerror = reject;
      image.src = img.src;
    });
  }

  async function downloadImage() {
    const img = getCurrentImage();
    if (!img) return;
    suppressClose = true;
    try {
      const blob = await getImageBlob(img);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      suppressClose = false;
    }
  }

  async function copyImage() {
    const img = getCurrentImage();
    if (!img) return;
    suppressClose = true;
    try {
      const blob = await getImageBlob(img);
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      suppressClose = false;
    }
  }

  function tryOpenFromUrl() {
    const slug = new URL(window.location.href).searchParams.get('screenshot');
    if (!slug || urlOpenDone) return;
    const index = findIndexBySlug(slug);
    if (index !== -1) {
      urlOpenDone = true;
      openLightbox(index, true);
    }
  }

  function pollForSlug() {
    const slug = new URL(window.location.href).searchParams.get('screenshot');
    if (!slug) return;
    let attempts = 0;
    const maxAttempts = 20;
    function attempt() {
      if (urlOpenDone) return;
      const index = findIndexBySlug(slug);
      if (index !== -1) {
        urlOpenDone = true;
        openLightbox(index, true);
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(attempt, 500);
        if (attempts === 2) {
          const loadMoreBtn = document.querySelector('[fs-cmsload-element="load-more"]');
          if (loadMoreBtn) loadMoreBtn.click();
        }
      }
    }
    attempt();
  }

  document.addEventListener('click', function (e) {
    const actionBtn = e.target.closest('[data-lightbox-action]');
    if (actionBtn) {
      const action = actionBtn.getAttribute('data-lightbox-action');
      if (action === 'download') downloadImage();
      if (action === 'copy') copyImage();
      return;
    }
    if (e.target.closest('.lightbox_close-button')) {
      closeLightbox();
      return;
    }
    const trigger = e.target.closest('.screenshot-card_component');
    if (trigger) {
      e.preventDefault();
      const collectionItem = trigger.closest('.w-dyn-item');
      const allCollectionItems = getCollectionItems();
      const index = allCollectionItems.indexOf(collectionItem);
      if (index !== -1) openLightbox(index, true);
      return;
    }
    if (currentIndex !== -1 && !suppressClose && !isClosing) {
      const clickedInsideContainer = e.target.closest('.lightobx_container');
      if (!clickedInsideContainer) closeLightbox();
    }
  });

  window.addEventListener('wheel', function () {
    if (currentIndex === -1 || isClosing) return;
    closeLightbox();
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (currentIndex === -1 || isClosing) return;
    if (Math.abs(e.touches[0].clientY - touchStartY) > 20) closeLightbox();
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (currentIndex === -1 || isClosing) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    function (listInstances) {
      listInstances.forEach(function (listInstance) {
        listInstance.on('renderitems', function () {
          if (currentIndex === -1) tryOpenFromUrl();
        });
      });
    },
  ]);

  window.fsAttributes.push([
    'cmsfilter',
    function (filterInstances) {
      filterInstances.forEach(function (filterInstance) {
        filterInstance.listInstance.on('renderitems', function () {
          if (currentIndex === -1) tryOpenFromUrl();
        });
      });
    },
  ]);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pollForSlug);
  } else {
    pollForSlug();
  }
})();


// ================================
// RECENTLY ADDED TAG
// ================================
(function () {
  'use strict';

  const RECENT_COUNT = 3;
  const DAYS_THRESHOLD = 30;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes guiv-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }
    [data-guiv="tag-pulse"] {
      animation: guiv-pulse 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  function tagRecentGames() {
    const list = document.querySelector('[fs-list-instance="games"][fs-list-element="list"]');
    if (!list) return;

    const now       = Date.now();
    const threshold = DAYS_THRESHOLD * 24 * 60 * 60 * 1000;

    // Hole alle Items, filtere aber die heraus, die Finsweet gerade versteckt hat
    const allItems = Array.from(list.querySelectorAll('.collection_item_wrapper.w-dyn-item:not(.guiv-sk)'));
    const visibleItems = allItems.filter(item => 
      item.style.display !== 'none' && !item.classList.contains('fs-cmsfilter_hide')
    );

    // 1. Alle Tags verstecken
    allItems.forEach((item) => {
      const tag = item.querySelector('.card_tag_component');
      if (tag) tag.style.display = 'none';
    });

    // 2. Tags nur auf die ersten sichtbaren anwenden
    visibleItems.slice(0, RECENT_COUNT).forEach((item) => {
      const tag    = item.querySelector('.card_tag_component');
      const dateEl = item.querySelector('[fs-list-field="created-on"]');
      if (!tag || !dateEl) return;

      const addedDate = new Date(dateEl.textContent.trim()).getTime();
      const isNew     = !isNaN(addedDate) && (now - addedDate) < threshold;

      if (isNew) tag.style.display = 'flex';
    });
  }

  // Korrekte Finsweet V2 Integration
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    function (filterInstances) {
      filterInstances.forEach(function (filterInstance) {
        filterInstance.listInstance.on('renderitems', () => {
          requestAnimationFrame(tagRecentGames); // Verhindert Lag beim Rendern
        });
      });
    }
  ]);

  window.addEventListener('load', () => setTimeout(tagRecentGames, 500));
})();


// ================================
// CARD TITLE MARQUEE
// ================================
(function () {
  'use strict';

  const CARD_CONFIGS = [
    { cardSelector: '.games-card_component', titleSelector: '.games-card_title' },
    { cardSelector: '.screenshot-card_component', titleSelector: '.screenshot-card_title' },
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

  // EINER für alle - rettet die Performance!
  const marqueeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const card = entry.target;
      const title = card.querySelector('.games-card_title, .screenshot-card_title');
      if (!title) continue;

      const offset = title.scrollWidth - title.clientWidth;
      if (offset > 0) {
        title.style.setProperty('--guiv-marquee-offset', `-${offset}px`);
        card._guivMarqueeTruncated = true;
      } else {
        card._guivMarqueeTruncated = false;
        title.classList.remove('is-marquee-active', 'is-marquee-return');
        title.style.transform = '';
      }
    }
  });

  function setupCard(card, titleSelector) {
    if (card._guivMarqueeInit) return; // Nur beim ersten Mal anheften

    const title = card.querySelector(titleSelector);
    if (!title) return;

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

    marqueeObserver.observe(card);
  }

  function initMarquee() {
    CARD_CONFIGS.forEach(({ cardSelector, titleSelector }) => {
      document.querySelectorAll(cardSelector).forEach((card) => {
        setupCard(card, titleSelector);
      });
    });
  }

  // Korrekte Finsweet V2 Integration
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    function (filterInstances) {
      filterInstances.forEach(function (filterInstance) {
        filterInstance.listInstance.on('renderitems', () => {
          requestAnimationFrame(initMarquee); 
        });
      });
    }
  ]);

  window.addEventListener('load', () => setTimeout(initMarquee, 500));
})();
