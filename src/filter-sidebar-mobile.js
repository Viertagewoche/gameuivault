// ================================
// FILTER SIDEBAR (Mobile only)
// ================================
(function () {

  const TRANSITION_MS = 300;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const MOBILE_BREAKPOINT = 991;
  const OPEN_CLASS = 'is-open';

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

    if (isMobile()) applyMobileStyles();

    window.addEventListener('resize', function () {
      if (isMobile()) {
        applyMobileStyles();
      } else {
        resetDesktopStyles();
      }
    });

    function recalcAccordions() {
      const openButtons = container.querySelectorAll('.' + OPEN_CLASS);
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

    document.addEventListener('change', function (e) {
      if (e.target.closest('.filter_checkbox_component')) {
        setTimeout(closeSidebar, 150);
      }
    });

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
