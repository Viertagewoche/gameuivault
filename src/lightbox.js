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
