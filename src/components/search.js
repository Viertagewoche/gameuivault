// ================================
// SEARCH
// ================================
(function () {

  const ANIMATION_DURATION = 250;

  const trigger       = document.getElementById('search-trigger');
  const triggerMobile = document.querySelector('.modal_search-form-icon_mobile');
  const modal         = document.getElementById('search-modal');
  const backdrop      = document.getElementById('search-backdrop');
  const input         = document.getElementById('search-input');
  const resultsWrap   = document.getElementById('search-results');
  const loading       = document.getElementById('search-loading');
  const container     = modal.querySelector('.modal_search-container');
  const list          = document.querySelector('[fs-list-instance="search"]');

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function openModal() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';

    modal.style.opacity = '0';
    modal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
    container.style.transform = 'translateY(-12px)';
    container.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    modal.style.display = 'flex';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        input.focus();
      });
    });
  }

  function closeModal() {
    modal.style.opacity = '0';
    container.style.transform = 'translateY(-12px)';

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

  trigger.addEventListener('click', openModal);
  if (triggerMobile) triggerMobile.addEventListener('click', openModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  backdrop.addEventListener('click', function (e) {
    if (!e.target.closest('.modal_search-container')) closeModal();
  });

  input.addEventListener('input', () => {
    resultsWrap.style.display =
      input.value.trim().length >= 2 ? 'block' : 'none';
  });

})();
