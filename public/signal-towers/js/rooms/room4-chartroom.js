// SCENE 4 — The Chart Room (combine half-charts).
// West chart shows ROCKS (channels I & IV fouled). East chart shows DEPTHS
// (channels II & IV too shallow). Only Channel III is both clear and deep.
// East (P2) finds bearing-mark H (depth 3).

import { getRole, isWest, towerName } from '../role.js';
import { defs, backdrop, rain, towerTag } from '../scenekit.js';

const SLUG = 'chart';
const SAFE = 'III';
const CHANNELS = ['I', 'II', 'III', 'IV'];

// what THIS tower's chart reveals about each channel
const WEST_ROCKS = { I: 'fouled — Kestrel reef', II: 'clear of rock', III: 'clear of rock', IV: 'fouled — the Black Tooth' };
const EAST_DEPTH = { I: '9 fathoms — deep', II: '1 fathom — dries at low water', III: '8 fathoms — deep', IV: '2 fathoms — shoal' };

function plotted(state) { return !!state.flags.chartroom_plotted; }

export default {
  id: 'chartroom',
  get title() { return `${towerName()} · The Chart Room`; },
  get intro() {
    return isWest()
      ? 'The chart table holds the West survey — every rock and reef in the bay marked in red. But the soundings have washed away; you cannot tell deep water from a puddle. Your partner\'s chart can.'
      : 'The East chart is a field of depth soundings — you can see exactly where the water runs deep. But the rocks are fogged out on your copy. Your partner can see those.';
  },

  scene(state) {
    const done = plotted(state);
    const markHere = getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_h');
    const chosen = state.flags.chartroom_choice || null;

    // four channel lanes drawn on the chart, with role-specific marks
    const lanes = CHANNELS.map((c, i) => {
      const y = 360 + i * 90;
      const west = WEST_ROCKS[c].startsWith('fouled');
      const east = !EAST_DEPTH[c].includes('deep');
      let mark = '';
      if (isWest() && west) mark = `<text x="1180" y="${y + 6}" font-size="20" fill="#ff8f8f" font-family="Consolas, monospace">✖ rock</text>`;
      else if (isWest()) mark = `<text x="1180" y="${y + 6}" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">clear</text>`;
      else if (east) mark = `<text x="1180" y="${y + 6}" font-size="18" fill="#ff8f8f" font-family="Consolas, monospace">${EAST_DEPTH[c].split(' — ')[0]} ✖</text>`;
      else mark = `<text x="1180" y="${y + 6}" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">${EAST_DEPTH[c].split(' — ')[0]}</text>`;
      const sel = chosen === c ? 'stroke="#e8c85a" stroke-width="6"' : 'stroke="#5b6b7d" stroke-width="3" stroke-dasharray="10 8"';
      return `<line x1="360" y1="${y}" x2="1120" y2="${y}" ${sel}/>
        <text x="320" y="${y + 7}" text-anchor="end" font-size="22" fill="#cfe4f0" font-family="Consolas, monospace">${c}</text>
        ${mark}`;
    }).join('');

    return `
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs(SLUG)}</defs>
      ${backdrop(SLUG)}

      <!-- chart table surface -->
      <rect x="240" y="250" width="1120" height="600" rx="14" fill="#0e2032" stroke="#8a7f6a" stroke-width="10"/>
      <text x="800" y="300" text-anchor="middle" font-size="18" fill="#9fc7dd" font-family="Consolas, monospace" letter-spacing="3">
        ${isWest() ? 'WEST SURVEY — ROCKS & REEFS' : 'EAST SURVEY — DEPTH SOUNDINGS'}</text>

      <!-- the two headlands + harbour mouth -->
      <path d="M240 340 q120 -40 220 0 l0 470 -220 0 z" fill="#1c2431" opacity="0.7"/>
      <path d="M1360 340 q-120 -40 -220 0 l0 470 220 0 z" fill="#1c2431" opacity="0.7"/>
      <text x="360" y="820" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">KESTREL PT</text>
      <text x="1240" y="820" text-anchor="middle" font-size="13" fill="#7f8a99" font-family="Consolas, monospace">GANNET RK</text>

      <!-- the four channels -->
      ${lanes}

      ${done ? `<text x="800" y="835" text-anchor="middle" font-size="18" fill="#8fe0a0" font-family="Consolas, monospace">CHANNEL III BUOYED — the safe water is lit</text>` : ''}

      ${markHere ? `
      <g class="beckon">
        <circle cx="290" cy="300" r="22" fill="rgba(201,162,39,0.08)" stroke="#c9a227" stroke-width="3"/>
        <text x="290" y="308" text-anchor="middle" font-size="20" fill="#e8c85a" font-family="Consolas, monospace" font-weight="bold">3</text>
      </g>` : ''}

      ${towerTag()}
      ${rain(SLUG)}
    </svg>`;
  },

  hotspots(state) {
    const spots = [];
    const done = plotted(state);

    spots.push({
      id: 'chart', x: 340, y: 340, w: 820, h: 400, label: isWest() ? 'The rock chart' : 'The depth chart',
      onInteract(game) {
        const src = isWest() ? WEST_ROCKS : EAST_DEPTH;
        const rows = CHANNELS.map(c => {
          const bad = isWest() ? src[c].startsWith('fouled') : !src[c].includes('deep');
          return `<tr><td style="padding:3px 16px;color:#fff6df;">Channel ${c}</td>
            <td style="padding:3px 16px;color:${bad ? '#ff8f8f' : '#8fe0a0'};">${src[c]}</td></tr>`;
        }).join('');
        const html = `<div class="chartcard"><div class="chart-title">${isWest() ? 'West survey — rocks' : 'East survey — depths'}</div>
          <table style="margin:0 auto;font-family:Consolas,monospace;font-size:15px;">${rows}</table></div>
          <div class="relay">You can see only ${isWest() ? 'the rocks' : 'the depths'}. Ask your partner which channels are ${isWest() ? 'deep enough' : 'clear of rock'} — the safe channel is the one that passes <strong>both</strong> tests.</div>`;
        game.journal.add('note_chart', { title: isWest() ? 'West rock chart' : 'East depth chart', category: 'note', html });
        game.dialog({ title: isWest() ? 'The Rock Chart' : 'The Depth Chart', html });
      },
    });

    if (getRole() === 'p2' && !state.journal.some(e => e.id === 'mark_h')) {
      spots.push({
        id: 'mark_h', x: 250, y: 260, w: 90, h: 90, label: 'A brass bearing-mark',
        onInteract(game) {
          game.journal.add('mark_h', { title: 'East Tower — pinned to the chart', category: 'sun', sun: { rays: 3, letter: 'H' } });
          game.say('A brass mark pins the corner of the chart: bearing 3, letter H. Logged.');
          game.refreshScene();
        },
      });
    }

    if (!done) {
      spots.push({
        id: 'plot', x: 500, y: 760, w: 600, h: 80, label: 'Choose the safe channel',
        onInteract(game) { openChannelPicker(game); },
      });
    } else {
      spots.push({
        id: 'up', x: 500, y: 760, w: 600, h: 80, label: 'The stair up',
        onInteract(game) {
          if (getRole() === 'p2' && !game.journal.has('mark_h')) { game.say('Take the bearing-mark pinning the chart before you go.'); return; }
          game.completeRoom({ delay: 600 });
        },
      });
    }

    return spots;
  },

  hintContext() { return getRole(); },
  hints() {
    return [
      { text: 'Your chart shows only half the danger. Your partner sees the half you can\'t — trade what each channel is on your chart.', cost: 60 },
      { text: isWest()
          ? 'You can rule out the rock-fouled channels; ask your partner which of the rest are deep enough.'
          : 'You can rule out the shallow channels; ask your partner which of the rest are clear of rock.', cost: 120 },
      { text: 'The only channel both clear of rock AND deep enough is Channel III.', cost: 240 },
    ];
  },
};

function openChannelPicker(game) {
  game.openPuzzle({
    id: 'chartroom_plot',
    title: 'Buoy the Safe Channel',
    render(body, api) {
      body.innerHTML = `
        <div class="puzzle-hero" style="background-image:url(art/pz-chart.webp)"></div>
        <p class="puzzle-desc">Only one channel is both clear of rock and deep enough. Compare
        your chart with your partner's, then buoy it.</p>
        <div class="puzzle-row" id="ch-opts"></div>
        <div class="puzzle-feedback"></div>`;
      const row = body.querySelector('#ch-opts');
      CHANNELS.forEach(c => {
        const t = document.createElement('div');
        t.className = 'tile';
        t.style.minWidth = '84px';
        t.innerHTML = `<div style="font-size:26px;color:#e8c85a;font-family:Consolas,monospace;">${c}</div>
          <div style="font-size:11px;color:var(--text-dim);letter-spacing:0.14em;">CHANNEL</div>`;
        t.addEventListener('click', () => {
          game.playSfx('click');
          game.setFlag('chartroom_choice', c);
          if (c === SAFE) {
            game.setFlag('chartroom_plotted');
            api.solved({ message: 'You drop the buoys down Channel III and light them. Clear water, deep water — the only road home.' });
            game.refreshScene();
          } else {
            api.fail(`Channel ${c} won't do — check it against your partner's chart.`);
            game.refreshScene();
          }
        });
        row.appendChild(t);
      });
    },
  });
}
