import { useState } from 'react';

// Phase 0 smoke test: a trivial React island to prove @astrojs/react
// hydrates in the static build. Not used by the real dashboard yet.
export default function HelloIsland() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => setCount((c) => c + 1)}
      className="rounded-md border border-orange-400 px-3 py-1 text-orange-300 hover:bg-orange-400/10"
    >
      React island clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
}
