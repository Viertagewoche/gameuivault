// gameuivault - Main Bundle
// Version: 1.0.2


// ================================
// ACCORDION FUNCTION
// ================================
const CONFIG = {
  buttonClass: '.filter_accordion_button',
  chevronClass: '.icon_cheveron',
  openClass: 'is-open',
  initialOpenCount: 2,        // Number of accordions open on load
  animationDuration: '0.3s',  // Animation speed
};
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
// SEARCH FUNCTION
// ================================
<script>
(function () {
  const trigger     = document.getElementById('search-trigger');
  const modal       = document.getElementById('search-modal');
  const backdrop    = document.getElementById('search-backdrop');
  const input       = document.getElementById('search-input');
  const resultsWrap = document.getElementById('search-results');
  const loading     = document.getElementById('search-loading');
  const list        = document.querySelector('[fs-list-instance="search"]');

  // Get scrollbar width
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function openModal() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';
    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 50);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    resultsWrap.style.display = 'none';
    loading.style.display = 'none';
  }

  // Show/hide loading state via MutationObserver
  // FS adds/removes fs-loading class on the list element
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

  // Open modal
  trigger.addEventListener('click', openModal);

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  // Close modal on outside click
  backdrop.addEventListener('click', closeModal);

  // Show results only after 2 characters
  input.addEventListener('input', () => {
    resultsWrap.style.display =
      input.value.trim().length >= 2 ? 'block' : 'none';
  });

})();
</script>
