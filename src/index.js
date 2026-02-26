// gameuivault - Source Entry Point
// Version: 1.4.0
//
// Importreihenfolge ist bewusst gewählt:
//   1. Components (DOM-unabhängig, initialisieren sich selbst)
//   2. Animations (benötigen GSAP, warten auf window.load)

// ── Components ──────────────────────────────────────────────────────────────
import './components/accordion.js';
import './components/filter-sidebar-mobile.js';
import './components/search.js';
import './components/lightbox.js';
import './components/card-marquee.js';
import './components/text-scramble.js';

// ── Animations ───────────────────────────────────────────────────────────────
import './animations/button-hover.js';

// build trigger.
