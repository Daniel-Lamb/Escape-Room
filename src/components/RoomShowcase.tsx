"use client"

import { useEffect, useMemo, useState } from "react"
import { rooms, sections, liveRooms, type Room } from "../data/rooms"

// The scroll-morph revamp: the three player-count sections become three
// labeled rows. Each room is a 16:9 placard; on load they scatter in and
// settle (the "morph"), then each row scrolls infinitely, looping its rooms.
//
// Implemented with CSS (compositor keyframes + a duplicated-track marquee)
// rather than framer-motion: same morph + loop + hover behaviour, lighter, and
// it renders without a JS animation loop. Styles live in dashboard.css.

const svgModules = import.meta.glob("../svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

// How many times each section's rooms repeat in the track. The track holds
// LANES copies; the marquee shifts by exactly one copy (-100/LANES %) and loops
// seamlessly. 5 keeps the viewport filled up to ~4x the room-set width.
const LANES = 5

function artDataUrl(art: string): string {
  // trim: the extracted SVGs are indented, and a data-URL SVG won't parse with
  // leading whitespace before <svg>.
  const svg = (svgModules[`../svg/${art}.svg`] ?? "").trim()
  const vb = svg.match(/viewBox="([-\d.\s]+)"/)
  let w = 400
  let h = 190
  if (vb) {
    const p = vb[1].trim().split(/\s+/).map(Number)
    if (p.length === 4) {
      w = p[2]
      h = p[3]
    }
  }
  const sized = /<svg[^>]*\swidth=/.test(svg) ? svg : svg.replace(/<svg/, `<svg width="${w}" height="${h}"`)
  return "data:image/svg+xml," + encodeURIComponent(sized)
}

// Deterministic pseudo-random in [0,1). Uses Math.imul (exact 32-bit, identical
// across engines) — NOT Math.sin, whose precision is implementation-defined and
// so differs between Node (SSR) and the browser, causing hydration mismatches.
function rand(n: number, salt = 0): number {
  let h = Math.imul(n ^ 0x9e3779b9, 2654435761) ^ Math.imul(salt + 1, 40503)
  h = Math.imul(h ^ (h >>> 15), 2246822519)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

function Placard({ room, url, index, setLen }: { room: Room; url: string; index: number; setLen: number }) {
  const concept = room.status === "concept"
  const stagger = (index % setLen) * 0.05
  const style = {
    "--dx": `${(rand(index) - 0.5) * 1500}px`,
    "--dy": `${(rand(index, 1) - 0.5) * 700}px`,
    "--rot": `${(rand(index, 2) - 0.5) * 120}deg`,
    "--delay": `${stagger}s`,
  } as React.CSSProperties

  const inner = (
    <>
      <img className="show-card-img" src={url} alt="" draggable={false} />
      <div className="show-card-grad" />
      <div className="show-card-meta">
        <span className="show-card-kicker">{room.kicker}</span>
        <h3 className="show-card-title">{room.title}</h3>
        {concept ? (
          <span className="show-card-soon">Coming soon</span>
        ) : (
          <span className="show-card-cta">{room.cta ?? "Enter"} →</span>
        )}
      </div>
    </>
  )

  // Only the first copy of each room is real; the marquee duplicates are hidden
  // from assistive tech and skipped in the tab order.
  const dup = index >= setLen
  return (
    <li className="show-card-wrap" style={style} aria-hidden={dup ? "true" : undefined}>
      {concept ? (
        <div className="show-card concept" aria-label={`${room.title} — coming soon`}>
          {inner}
        </div>
      ) : (
        <a
          className="show-card"
          href={room.href}
          aria-label={`Enter ${room.title}`}
          tabIndex={dup ? -1 : undefined}
        >
          {inner}
        </a>
      )}
    </li>
  )
}

function Row({ mode, title, sub, count }: { mode: string; title: string; sub: string; count: string }) {
  const sectionRooms = useMemo(() => rooms.filter((r) => r.mode === mode), [mode])
  const urls = useMemo(() => Object.fromEntries(sectionRooms.map((r) => [r.art, artDataUrl(r.art)])), [sectionRooms])
  const setLen = sectionRooms.length

  // Repeat the room set LANES times to form the seamless marquee track.
  const cards = useMemo(
    () =>
      Array.from({ length: LANES * setLen }, (_, i) => {
        const room = sectionRooms[i % setLen]
        return { room, key: i }
      }),
    [sectionRooms, setLen]
  )

  const duration = Math.max(18, setLen * 7)

  return (
    <section className="show-row" data-mode={mode}>
      <div className="show-row-head">
        <h2>{title}</h2>
        <span className="show-row-count">{count}</span>
        <p className="show-row-sub">{sub}</p>
      </div>
      <div className="show-marquee">
        <ul
          className="show-track"
          style={{ "--dur": `${duration}s`, "--shift": `${-100 / LANES}%` } as React.CSSProperties}
        >
          {cards.map(({ room, key }) => (
            <Placard key={key} room={room} url={urls[room.art]} index={key} setLen={setLen} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function RoomShowcase() {
  const [ready, setReady] = useState(false)

  // Start the marquees only after the scatter-in has had time to settle, so the
  // rows don't fly in while already scrolling. Timer-based (not rAF) so it also
  // fires in reduced-motion / non-animating environments.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setReady(true)
      return
    }
    const t = setTimeout(() => setReady(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const liveCount = liveRooms.length

  return (
    <div className={`showcase ${ready ? "ready" : ""}`}>
      {sections.map((sec) => (
        <Row
          key={sec.mode}
          mode={sec.mode}
          title={sec.title}
          sub={sec.sub}
          count={sec.count ?? `${liveCount} rooms · live`}
        />
      ))}
    </div>
  )
}
