"use client"

import { useEffect, useMemo, useRef } from "react"
import { rooms, sections, type Room } from "../data/rooms"

// Larger, content-forward rows. Each row slowly auto-cycles and scrolls
// infinitely: the cards are rendered in three identical copies and the scroll
// position is kept in the middle copy, so drifting or dragging in either
// direction wraps seamlessly. Auto-drift pauses on hover/interaction and is
// disabled under prefers-reduced-motion (manual looping still works).

const REPS = 3
const AUTO_SPEED = 0.5 // px per frame (~30px/s) — a slow ambient cycle

const svgModules = import.meta.glob("../svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const coverModules = import.meta.glob("../covers/*.webp", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>

function coverUrl(art: string): string | null {
  return coverModules[`../covers/${art}.webp`] ?? null
}

function artDataUrl(art: string): string {
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

function Placard({ room, clone }: { room: Room; clone?: boolean }) {
  const url = coverUrl(room.art) ?? artDataUrl(room.art)
  const concept = room.status === "concept"

  const inner = (
    <>
      <img className="show-card-img" src={url} alt="" draggable={false} loading="lazy" />
      <div className="show-card-grad" />
      <div className="show-card-meta">
        <span className="show-card-kicker">{room.kicker}</span>
        <h3 className="show-card-title">{room.title}</h3>
        {concept ? (
          <span className="show-card-soon">Coming soon</span>
        ) : (
          <span className="show-card-cta">{room.cta ?? "Enter"} &rsaquo;</span>
        )}
      </div>
    </>
  )

  // Only the first copy is exposed to assistive tech / tab order; the extra
  // copies exist purely to make the loop seamless.
  const hidden = clone ? { "aria-hidden": true as const, tabIndex: -1 } : {}

  return concept ? (
    <div className="show-card concept" aria-label={clone ? undefined : `${room.title} — coming soon`} {...hidden}>
      {inner}
    </div>
  ) : (
    <a className="show-card" href={room.href} aria-label={clone ? undefined : `Enter ${room.title}`} {...hidden}>
      {inner}
    </a>
  )
}

function Row({
  mode,
  title,
  sub,
  how,
  count,
}: {
  mode: string
  title: string
  sub: string
  how: string
  count?: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRooms = useMemo(() => rooms.filter((r) => r.mode === mode), [mode])
  const label = count ?? `${sectionRooms.filter((r) => r.status === "live").length} live`

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const copyWidth = () => track.scrollWidth / REPS

    // The browser floors scrollLeft to an integer, so a sub-pixel per-frame
    // increment would be lost every frame. Keep our own float position and
    // commit it each frame; sync back from any manual scroll.
    let pos: number | null = null
    let paused = false
    let suspendWrap = false
    let idleTimer: number | undefined
    let wrapTimer: number | undefined

    const releaseSoon = () => {
      if (idleTimer) window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => (paused = false), 2200)
    }
    // Pause the auto-cycle during a deliberate scroll gesture (wheel/touch/drag).
    // Hover-pause is handled live in the tick via :hover, which self-corrects even
    // when synthetic pointer events don't fire enter/leave symmetrically.
    const onInteract = () => {
      paused = true
      releaseSoon()
    }
    track.addEventListener("wheel", onInteract, { passive: true })
    track.addEventListener("touchstart", onInteract, { passive: true })
    track.addEventListener("pointerdown", onInteract)

    let raf = 0
    const tick = () => {
      const w = copyWidth()
      if (w > 0) {
        if (pos === null) pos = w // start in the middle copy
        // follow a manual scroll / momentum / smooth nudge (moves scrollLeft > 1px)
        if (Math.abs(track.scrollLeft - pos) > 1) pos = track.scrollLeft
        const hovering = viewport.matches(":hover")
        if (!reduceMq.matches && !paused && !hovering) pos += AUTO_SPEED
        if (suspendWrap) {
          pos = track.scrollLeft // a smooth arrow nudge owns scrollLeft; just follow
        } else {
          if (pos < w * 0.5) pos += w
          else if (pos >= w * 1.5) pos -= w
          track.scrollLeft = pos
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // expose a nudge for the arrow buttons without re-render churn
    ;(track as any)._nudge = (dir: number) => {
      paused = true
      suspendWrap = true
      releaseSoon()
      track.scrollBy({ left: dir * Math.min(track.clientWidth * 0.85, 720), behavior: "smooth" })
      if (wrapTimer) window.clearTimeout(wrapTimer)
      wrapTimer = window.setTimeout(() => (suspendWrap = false), 500)
    }

    return () => {
      cancelAnimationFrame(raf)
      track.removeEventListener("wheel", onInteract)
      track.removeEventListener("touchstart", onInteract)
      track.removeEventListener("pointerdown", onInteract)
      if (idleTimer) window.clearTimeout(idleTimer)
      if (wrapTimer) window.clearTimeout(wrapTimer)
    }
  }, [sectionRooms.length])

  const nudge = (dir: number) => (trackRef.current as any)?._nudge?.(dir)

  return (
    <section className="show-row" data-mode={mode}>
      <div className="show-row-head">
        <h2>{title}</h2>
        <span className="row-help">
          <button className="row-help-btn" aria-label={`How ${title} works`}>?</button>
          <span className="row-help-tip" role="tooltip">
            {how}
          </span>
        </span>
        <span className="show-row-count">{label}</span>
      </div>
      <p className="show-row-sub">{sub}</p>
      <div className="row-viewport" ref={viewportRef}>
        <button className="row-arrow row-arrow-prev" aria-label={`Scroll ${title} left`} onClick={() => nudge(-1)}>
          &lsaquo;
        </button>
        <div className="row-track" ref={trackRef}>
          {Array.from({ length: REPS }).flatMap((_, copy) =>
            sectionRooms.map((room) => <Placard key={`${copy}-${room.id}`} room={room} clone={copy > 0} />),
          )}
        </div>
        <button className="row-arrow row-arrow-next" aria-label={`Scroll ${title} right`} onClick={() => nudge(1)}>
          &rsaquo;
        </button>
      </div>
    </section>
  )
}

export default function RoomShowcase() {
  return (
    <div className="showcase">
      {sections.map((sec) => (
        <Row key={sec.mode} mode={sec.mode} title={sec.title} sub={sec.sub} how={sec.how} count={sec.count} />
      ))}
    </div>
  )
}
