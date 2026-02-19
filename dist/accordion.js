// Accordion
// Version: 1.0.1

// ================================
// CONFIGURATION - Adjust as needed
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
