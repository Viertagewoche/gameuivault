(() => {
  // src/components/accordion.js
  (function() {
    const CONFIG = {
      buttonClass: ".filter_accordion_button",
      chevronClass: ".icon_cheveron",
      openClass: "is-open",
      initialOpenCount: 2,
      animationDuration: "0.3s"
    };
    document.addEventListener("DOMContentLoaded", function() {
      const accordionButtons = document.querySelectorAll(CONFIG.buttonClass);
      accordionButtons.forEach(function(button, index) {
        const contents = button.nextElementSibling;
        const chevron = button.querySelector(CONFIG.chevronClass);
        if (!contents)
          return;
        contents.style.overflow = "hidden";
        contents.style.transition = `max-height ${CONFIG.animationDuration} ease`;
        if (chevron) {
          chevron.style.transition = `transform ${CONFIG.animationDuration} ease`;
        }
        if (index < CONFIG.initialOpenCount) {
          contents.style.maxHeight = contents.scrollHeight + "px";
          if (chevron)
            chevron.style.transform = "rotate(0deg)";
          button.classList.add(CONFIG.openClass);
        } else {
          contents.style.maxHeight = "0px";
          if (chevron)
            chevron.style.transform = "rotate(180deg)";
        }
        button.addEventListener("click", function() {
          const isOpen = button.classList.contains(CONFIG.openClass);
          if (isOpen) {
            contents.style.maxHeight = "0px";
            if (chevron)
              chevron.style.transform = "rotate(180deg)";
            button.classList.remove(CONFIG.openClass);
          } else {
            contents.style.maxHeight = contents.scrollHeight + "px";
            if (chevron)
              chevron.style.transform = "rotate(0deg)";
            button.classList.add(CONFIG.openClass);
          }
        });
      });
    });
  })();

  // src/components/filter-sidebar-mobile.js
  (function() {
    const TRANSITION_MS = 300;
    const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
    const MOBILE_BREAKPOINT = 991;
    const OPEN_CLASS = "is-open";
    function isMobile() {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    function init() {
      const triggerBtn = document.querySelector(".filter_button_mobile");
      const wrapper = document.querySelector(".filter_accordion-wrapper");
      const container = document.querySelector(".filter_accordion-container");
      const closeBtn = document.querySelector(".filter_sidebar_mobile_close-button");
      if (!triggerBtn || !wrapper || !container)
        return;
      function applyMobileStyles() {
        container.style.transition = `transform ${TRANSITION_MS}ms ${EASE}`;
        container.style.willChange = "transform";
        container.style.transform = "translateX(-100%)";
      }
      function resetDesktopStyles() {
        container.style.transition = "";
        container.style.willChange = "";
        container.style.transform = "";
        wrapper.style.display = "";
        document.body.style.overflow = "";
      }
      if (isMobile())
        applyMobileStyles();
      window.addEventListener("resize", function() {
        if (isMobile()) {
          applyMobileStyles();
        } else {
          resetDesktopStyles();
        }
      });
      function recalcAccordions() {
        const openButtons = container.querySelectorAll("." + OPEN_CLASS);
        openButtons.forEach(function(button) {
          const contents = button.nextElementSibling;
          if (contents)
            contents.style.maxHeight = contents.scrollHeight + "px";
        });
      }
      function openSidebar() {
        if (!isMobile())
          return;
        wrapper.style.display = "block";
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            container.style.transform = "translateX(0)";
            recalcAccordions();
          });
        });
      }
      function closeSidebar() {
        if (!isMobile())
          return;
        container.style.transform = "translateX(-100%)";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        setTimeout(() => {
          wrapper.style.display = "none";
        }, TRANSITION_MS);
      }
      triggerBtn.addEventListener("click", openSidebar);
      if (closeBtn)
        closeBtn.addEventListener("click", closeSidebar);
      wrapper.addEventListener("click", function(e) {
        if (!container.contains(e.target))
          closeSidebar();
      });
      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape")
          closeSidebar();
      });
      document.addEventListener("change", function(e) {
        if (e.target.closest(".filter_checkbox_component")) {
          setTimeout(closeSidebar, 150);
        }
      });
      document.addEventListener("click", function(e) {
        if (e.target.closest(".dropdown_dropdown-link")) {
          setTimeout(closeSidebar, 150);
        }
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();

  // src/components/search.js
  (function() {
    const ANIMATION_DURATION = 250;
    const trigger = document.getElementById("search-trigger");
    const triggerMobile = document.querySelector(".modal_search-form-icon_mobile");
    const modal = document.getElementById("search-modal");
    const backdrop = document.getElementById("search-backdrop");
    const input = document.getElementById("search-input");
    const resultsWrap = document.getElementById("search-results");
    const loading = document.getElementById("search-loading");
    const container = modal.querySelector(".modal_search-container");
    const list = document.querySelector('[fs-list-instance="search"]');
    function getScrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    }
    function openModal() {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = scrollbarWidth + "px";
      modal.style.opacity = "0";
      modal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
      container.style.transform = "translateY(-12px)";
      container.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      modal.style.display = "flex";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modal.style.opacity = "1";
          container.style.transform = "translateY(0)";
          input.focus();
        });
      });
    }
    function closeModal() {
      modal.style.opacity = "0";
      container.style.transform = "translateY(-12px)";
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        resultsWrap.style.display = "none";
        loading.style.display = "none";
      }, ANIMATION_DURATION);
    }
    const observer = new MutationObserver(() => {
      if (list.classList.contains("fs-loading")) {
        loading.style.display = "flex";
        list.style.display = "none";
      } else {
        loading.style.display = "none";
        list.style.display = "block";
      }
    });
    observer.observe(list, { attributes: true, attributeFilter: ["class"] });
    trigger.addEventListener("click", openModal);
    if (triggerMobile)
      triggerMobile.addEventListener("click", openModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex")
        closeModal();
    });
    backdrop.addEventListener("click", function(e) {
      if (!e.target.closest(".modal_search-container"))
        closeModal();
    });
    input.addEventListener("input", () => {
      resultsWrap.style.display = input.value.trim().length >= 2 ? "block" : "none";
    });
  })();

  // src/components/lightbox.js
  (function() {
    let currentIndex = -1;
    let items = [];
    let suppressClose = false;
    let urlOpenDone = false;
    let isClosing = false;
    function getItems() {
      items = Array.from(document.querySelectorAll(".lightbox_component"));
      return items;
    }
    function getCollectionItems() {
      return Array.from(document.querySelectorAll(".w-dyn-item")).filter(
        (item) => item.querySelector(".lightbox_component")
      );
    }
    function getScrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    }
    function getSlugForIndex(index) {
      const collectionItems = getCollectionItems();
      const item = collectionItems[index];
      if (!item)
        return null;
      return item.querySelector("[data-lightbox-slug]")?.textContent.trim() || null;
    }
    function findIndexBySlug(slug) {
      const collectionItems = getCollectionItems();
      return collectionItems.findIndex(
        (item) => item.querySelector("[data-lightbox-slug]")?.textContent.trim() === slug
      );
    }
    function setUrlSlug(slug) {
      const url = new URL(window.location.href);
      if (slug) {
        url.searchParams.set("screenshot", slug);
      } else {
        url.searchParams.delete("screenshot");
      }
      history.replaceState(null, "", url.toString());
    }
    function openLightbox(index, animate) {
      getItems();
      if (index < 0 || index >= items.length)
        return;
      items.forEach((lb2) => {
        lb2.style.display = "none";
        lb2.style.transition = "";
        lb2.style.opacity = "";
        const c = lb2.querySelector(".lightobx_container");
        if (c) {
          c.style.transition = "";
          c.style.transform = "";
          c.style.opacity = "";
        }
      });
      currentIndex = index;
      const lb = items[currentIndex];
      lb.style.display = "flex";
      const slug = getSlugForIndex(index);
      setUrlSlug(slug);
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = scrollbarWidth + "px";
      if (animate) {
        const container = lb.querySelector(".lightobx_container");
        lb.style.opacity = "0";
        if (container) {
          container.style.transform = "scale(0.95) translateY(12px)";
          container.style.opacity = "0";
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lb.style.transition = "opacity 250ms ease";
            lb.style.opacity = "1";
            if (container) {
              container.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease";
              container.style.transform = "scale(1) translateY(0)";
              container.style.opacity = "1";
            }
          });
        });
      }
    }
    function closeLightbox() {
      if (isClosing || currentIndex === -1)
        return;
      isClosing = true;
      getItems();
      const lb = items[currentIndex];
      const container = lb?.querySelector(".lightobx_container");
      setUrlSlug(null);
      if (lb) {
        lb.style.transition = "opacity 200ms ease";
        lb.style.opacity = "0";
      }
      if (container) {
        container.style.transition = "transform 200ms cubic-bezier(0.4, 0, 1, 1), opacity 200ms ease";
        container.style.transform = "scale(0.95) translateY(8px)";
        container.style.opacity = "0";
      }
      setTimeout(() => {
        getItems();
        items.forEach((lb2) => {
          lb2.style.display = "none";
          lb2.style.transition = "";
          lb2.style.opacity = "";
          const c = lb2.querySelector(".lightobx_container");
          if (c) {
            c.style.transition = "";
            c.style.transform = "";
            c.style.opacity = "";
          }
        });
        currentIndex = -1;
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        isClosing = false;
      }, 200);
    }
    function navigate(direction) {
      getItems();
      if (currentIndex === -1)
        return;
      const next = currentIndex + direction;
      if (next >= 0 && next < items.length)
        openLightbox(next, false);
    }
    function getCurrentImage() {
      if (currentIndex === -1)
        return null;
      getItems();
      const container = items[currentIndex].querySelector(".lightobx_container");
      if (!container)
        return null;
      return container.querySelector("[data-lightbox-image]");
    }
    function getFilename() {
      if (currentIndex === -1)
        return "screenshot.png";
      getItems();
      const lb = items[currentIndex];
      const screenshotName = lb.querySelector(".lightbox-title_text")?.textContent.trim() || "Screenshot";
      const gameName = lb.querySelector(".lightbox-game-title")?.textContent.trim() || "";
      const sanitize = (str) => str.replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, "").trim().replace(/\s+/g, "-");
      return gameName ? `${sanitize(screenshotName)}_${sanitize(gameName)}.png` : `${sanitize(screenshotName)}.png`;
    }
    async function getImageBlob(img) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function() {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          canvas.toBlob((blob) => blob ? resolve(blob) : reject("Blob error"), "image/png");
        };
        image.onerror = reject;
        image.src = img.src;
      });
    }
    async function downloadImage() {
      const img = getCurrentImage();
      if (!img)
        return;
      suppressClose = true;
      try {
        const blob = await getImageBlob(img);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = getFilename();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        suppressClose = false;
      }
    }
    async function copyImage() {
      const img = getCurrentImage();
      if (!img)
        return;
      suppressClose = true;
      try {
        const blob = await getImageBlob(img);
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
      } catch (err) {
        console.error("Copy failed:", err);
      } finally {
        suppressClose = false;
      }
    }
    function tryOpenFromUrl() {
      const slug = new URL(window.location.href).searchParams.get("screenshot");
      if (!slug || urlOpenDone)
        return;
      const index = findIndexBySlug(slug);
      if (index !== -1) {
        urlOpenDone = true;
        openLightbox(index, true);
      }
    }
    function pollForSlug() {
      const slug = new URL(window.location.href).searchParams.get("screenshot");
      if (!slug)
        return;
      let attempts = 0;
      const maxAttempts = 20;
      function attempt() {
        if (urlOpenDone)
          return;
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
            if (loadMoreBtn)
              loadMoreBtn.click();
          }
        }
      }
      attempt();
    }
    document.addEventListener("click", function(e) {
      const actionBtn = e.target.closest("[data-lightbox-action]");
      if (actionBtn) {
        const action = actionBtn.getAttribute("data-lightbox-action");
        if (action === "download")
          downloadImage();
        if (action === "copy")
          copyImage();
        return;
      }
      if (e.target.closest(".lightbox_close-button")) {
        closeLightbox();
        return;
      }
      const trigger = e.target.closest(".screenshot-card_component");
      if (trigger) {
        e.preventDefault();
        const collectionItem = trigger.closest(".w-dyn-item");
        const allCollectionItems = getCollectionItems();
        const index = allCollectionItems.indexOf(collectionItem);
        if (index !== -1)
          openLightbox(index, true);
        return;
      }
      if (currentIndex !== -1 && !suppressClose && !isClosing) {
        const clickedInsideContainer = e.target.closest(".lightobx_container");
        if (!clickedInsideContainer)
          closeLightbox();
      }
    });
    window.addEventListener("wheel", function() {
      if (currentIndex === -1 || isClosing)
        return;
      closeLightbox();
    }, { passive: true });
    let touchStartY = 0;
    window.addEventListener("touchstart", function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchmove", function(e) {
      if (currentIndex === -1 || isClosing)
        return;
      if (Math.abs(e.touches[0].clientY - touchStartY) > 20)
        closeLightbox();
    }, { passive: true });
    document.addEventListener("keydown", function(e) {
      if (currentIndex === -1 || isClosing)
        return;
      if (e.key === "Escape")
        closeLightbox();
      if (e.key === "ArrowRight")
        navigate(1);
      if (e.key === "ArrowLeft")
        navigate(-1);
    });
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsload",
      function(listInstances) {
        listInstances.forEach(function(listInstance) {
          listInstance.on("renderitems", function() {
            if (currentIndex === -1)
              tryOpenFromUrl();
          });
        });
      }
    ]);
    window.fsAttributes.push([
      "cmsfilter",
      function(filterInstances) {
        filterInstances.forEach(function(filterInstance) {
          filterInstance.listInstance.on("renderitems", function() {
            if (currentIndex === -1)
              tryOpenFromUrl();
          });
        });
      }
    ]);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", pollForSlug);
    } else {
      pollForSlug();
    }
  })();

  // src/components/card-marquee.js
  (function() {
    "use strict";
    const CARD_CONFIGS = [
      {
        cardSelector: ".games-card_component",
        titleSelector: ".games-card_title"
      },
      {
        cardSelector: ".screenshot-card_component",
        titleSelector: ".screenshot-card_title"
      }
    ];
    const style = document.createElement("style");
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
      if (!title)
        return;
      if (card._guivMarqueeInit) {
        const offset = title.scrollWidth - title.clientWidth;
        if (offset > 0) {
          title.style.setProperty("--guiv-marquee-offset", `-${offset}px`);
          card._guivMarqueeTruncated = true;
        } else {
          card._guivMarqueeTruncated = false;
          title.classList.remove("is-marquee-active", "is-marquee-return");
          title.style.transform = "";
        }
        return;
      }
      card._guivMarqueeInit = true;
      card._guivMarqueeTruncated = false;
      card.addEventListener("mouseenter", () => {
        if (!card._guivMarqueeTruncated)
          return;
        title.classList.remove("is-marquee-return");
        title.classList.add("is-marquee-active");
      });
      card.addEventListener("mouseleave", () => {
        if (!card._guivMarqueeTruncated)
          return;
        title.classList.remove("is-marquee-active");
        title.classList.add("is-marquee-return");
        setTimeout(() => title.classList.remove("is-marquee-return"), 600);
      });
      const ro = new ResizeObserver(() => {
        const offset = title.scrollWidth - title.clientWidth;
        if (offset > 0) {
          title.style.setProperty("--guiv-marquee-offset", `-${offset}px`);
          card._guivMarqueeTruncated = true;
        } else {
          card._guivMarqueeTruncated = false;
          title.classList.remove("is-marquee-active", "is-marquee-return");
          title.style.transform = "";
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
    document.addEventListener("fs-list-ready", initMarquee);
    document.addEventListener("fs-list-render", initMarquee);
    window.addEventListener("load", () => setTimeout(initMarquee, 500));
  })();

  // src/components/text-scramble.js
  (function() {
    "use strict";
    const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    const DEFAULT_SPEED = 20;
    const REVEAL_SPEED = 10;
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = el.dataset.scrambleChars || DEFAULT_CHARS;
        this.speed = parseInt(el.dataset.scrambleSpeed) || DEFAULT_SPEED;
        this.original = this._getTextNode(el);
        this.frame = null;
      }
      // FIX Bug 1: Span-Wrapper erzwingen damit innerHTML-Änderungen
      // nicht auf dem <a>-Tag selbst landen → verhindert mouseenter-Loop
      _getTextNode(el) {
        const spans = el.querySelectorAll("span");
        for (const span of spans) {
          if (!span.querySelector("span") && span.textContent.trim().length > 2) {
            this._textEl = span;
            return span.textContent;
          }
        }
        const wrapper = document.createElement("span");
        wrapper.textContent = el.textContent.trim();
        el.textContent = "";
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
        this.queue = text.split("").map((char, i) => ({
          to: char,
          start: Math.floor(i / REVEAL_SPEED),
          end: Math.floor(i / REVEAL_SPEED) + Math.floor(Math.random() * 8) + 4
        }));
        let iteration = 0;
        const update = () => {
          let output = "";
          let complete = 0;
          for (let i = 0; i < this.queue.length; i++) {
            const { to, start, end } = this.queue[i];
            if (iteration >= end) {
              complete++;
              output += to;
            } else if (iteration >= start) {
              if (" :\u2014-.,/".includes(to)) {
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
    const CARD_SELECTORS = [".games-card_component", ".screenshot-card_component"];
    const TARGET_SELECTOR = ".vault_file_ref";
    function initCard(card) {
      if (card.dataset.cardScrambleInit)
        return;
      card.dataset.cardScrambleInit = "true";
      const target = card.querySelector(TARGET_SELECTOR);
      if (!target)
        return;
      const scrambler = new TextScramble(target);
      card.addEventListener("mouseenter", () => scrambler.scramble());
      card.addEventListener("mouseleave", () => scrambler.restore());
      card.addEventListener("click", () => scrambler.restore(), true);
    }
    function initScrambleEl(el) {
      if (el.dataset.scrambleInit)
        return;
      el.dataset.scrambleInit = "true";
      const scrambler = new TextScramble(el);
      el.addEventListener("mouseenter", () => scrambler.scramble());
      el.addEventListener("touchstart", () => scrambler.scramble(), { passive: true });
      el.addEventListener("click", () => scrambler.restore(), true);
      el.addEventListener("mouseleave", () => scrambler.restore());
    }
    function initAll() {
      document.querySelectorAll("[data-scramble]").forEach(initScrambleEl);
      CARD_SELECTORS.forEach((sel) => document.querySelectorAll(sel).forEach(initCard));
    }
    function observeDOM() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1)
              return;
            CARD_SELECTORS.forEach((sel) => {
              if (node.matches(sel))
                initCard(node);
              node.querySelectorAll(sel).forEach(initCard);
            });
            if (node.matches("[data-scramble]"))
              initScrambleEl(node);
            node.querySelectorAll("[data-scramble]").forEach(initScrambleEl);
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    function init() {
      initAll();
      observeDOM();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
    window.Webflow = window.Webflow || [];
    window.Webflow.push(init);
  })();

  // src/components/back-to-top.js
  (function() {
    "use strict";
    const BTN_SELECTOR = ".back_to_top_button";
    const FOOTER_SELECTOR = "footer";
    const SHOW_AFTER_PX = 300;
    const DURATION = 0.3;
    const EASE = "power2.inOut";
    function init() {
      const btn = document.querySelector(BTN_SELECTOR);
      const footer = document.querySelector(FOOTER_SELECTOR);
      if (!btn)
        return;
      gsap.set(btn, { opacity: 0, pointerEvents: "none" });
      function update() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const footerTop = footer ? footer.getBoundingClientRect().top + scrollY : docHeight;
        const nearFooter = scrollY + windowHeight >= footerTop;
        const scrolledEnough = scrollY > SHOW_AFTER_PX;
        if (scrolledEnough && !nearFooter) {
          gsap.to(btn, { opacity: 1, pointerEvents: "auto", duration: DURATION, ease: EASE });
        } else {
          gsap.to(btn, { opacity: 0, pointerEvents: "none", duration: DURATION, ease: EASE });
        }
      }
      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      window.addEventListener("scroll", update, { passive: true });
      update();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();

  // src/animations/button-hover.js
  (function() {
    "use strict";
    const BTN_SELECTOR = ".button_component";
    const BRACKETS_SELECTOR = ".corner_element";
    const TEXT_SELECTOR = ".button_component_label";
    const COLOR_WHITE = "#e5e5e5";
    const COLOR_BLACK = "#020202";
    const COLOR_TRANSPARENT = "rgba(0,0,0,0)";
    const DURATION = 0.28;
    const EASE = "power2.inOut";
    const SPREAD = {
      "is-top-left": { x: -5, y: -5 },
      "is-top-right": { x: 5, y: -5 },
      "is-bottom-left": { x: -5, y: 5 },
      "is-bottom-right": { x: 5, y: 5 }
    };
    function getSpread(el) {
      for (const [cls, val] of Object.entries(SPREAD)) {
        if (el.classList.contains(cls))
          return val;
      }
      return { x: 0, y: 0 };
    }
    function initButton(btn) {
      if (btn._btnAnimInit)
        return;
      btn._btnAnimInit = true;
      const brackets = btn.querySelectorAll(BRACKETS_SELECTOR);
      const text = btn.querySelector(TEXT_SELECTOR);
      btn.addEventListener("mouseenter", () => {
        brackets.forEach((el) => {
          const { x, y } = getSpread(el);
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
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
      btn.addEventListener("mouseleave", () => {
        brackets.forEach((el) => {
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
    window.addEventListener("load", init);
    const observer = new MutationObserver(() => {
      document.querySelectorAll(BTN_SELECTOR).forEach(initButton);
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  })();
})();
