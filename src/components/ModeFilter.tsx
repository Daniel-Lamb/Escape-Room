import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// React-island port of the dashboard's segmented filter. It owns its own UI
// (the sliding pill) and communicates only by setting data-mode-filter on
// <body> — CSS in dashboard.css does the section show/hide — plus a
// 'dashboard:filter' event the page script uses to reveal newly shown cards.
//
// The pill geometry lives in React state (not poked onto the DOM via a ref) so
// re-renders and the CSS width-transition can't leave it stale.

type Filter = 'all' | 'single' | 'duo' | 'group';

const TABS: { filter: Filter; label: string }[] = [
  { filter: 'all', label: 'All' },
  { filter: 'single', label: 'Single Player' },
  { filter: 'duo', label: 'Two Player' },
  { filter: 'group', label: 'Group' },
];

export default function ModeFilter() {
  const [active, setActive] = useState<Filter>('all');
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const measure = () => {
    const i = TABS.findIndex((t) => t.filter === active);
    const btn = btnRefs.current[i];
    if (btn) setPill({ left: btn.offsetLeft - 5, width: btn.offsetWidth });
  };

  // useLayoutEffect already runs after layout, so measure synchronously (no
  // rAF). A font load can change button widths, so re-measure once fonts settle.
  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    document.body.dataset.modeFilter = active;
    document.dispatchEvent(new CustomEvent('dashboard:filter', { detail: active }));
  }, [active]);

  return (
    <div className="seg-wrap">
      <div className="seg" role="tablist" aria-label="Filter by players">
        <span
          className="seg-ind"
          aria-hidden="true"
          style={pill ? { width: `${pill.width}px`, transform: `translateX(${pill.left}px)` } : undefined}
        ></span>
        {TABS.map((tab, i) => (
          <button
            key={tab.filter}
            className={`seg-btn${tab.filter === active ? ' active' : ''}`}
            role="tab"
            aria-selected={tab.filter === active}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            onClick={() => setActive(tab.filter)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
