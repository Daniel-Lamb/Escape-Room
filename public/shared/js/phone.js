// Phone helpers shared by the engine and the dev modal gallery.

const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 560px)';

/**
 * Rendered size, in CSS px, of a text element. SVG text scales with its
 * drawing, so it is measured from the SVG's layout box (not its on-screen
 * box, which a modal's opening zoom would shrink for a moment).
 * @param {Element} el
 */
export function renderedPx(el) {
  const f = parseFloat(getComputedStyle(el).fontSize);
  const svg = /** @type {SVGSVGElement | null} */ (el.closest('svg'));
  if (!svg) return f;
  const vb = svg.viewBox && svg.viewBox.baseVal;
  if (!vb || !vb.width || !vb.height || !svg.clientWidth) return f;
  return f * Math.min(svg.clientWidth / vb.width, svg.clientHeight / vb.height);
}

/**
 * On a phone held upright, a puzzle's wide drawing shrinks until its labels
 * are hard to read (under 11px). Say so under the header band: with the phone
 * on its side the same drawing is readable. CSS hides the line in landscape.
 * @param {HTMLElement} body the puzzle modal's body
 * @returns {boolean} whether the line was added
 */
export function noteSmallDrawing(body) {
  if (!matchMedia(PORTRAIT_PHONE).matches || body.querySelector('.puzzle-rotate-hint')) return false;
  const small = [...body.querySelectorAll('svg text')]
    .some(t => t.textContent.trim() && t.getBoundingClientRect().width > 0 && renderedPx(t) < 11);
  if (!small) return false;
  const p = document.createElement('p');
  p.className = 'puzzle-rotate-hint';
  p.textContent = '↻ Turn your phone sideways to read this drawing.';
  const hero = body.querySelector('.puzzle-hero');
  if (hero) hero.after(p); else body.prepend(p);
  return true;
}
