"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { liveRooms } from "../data/rooms"

// The hero slowly cross-fades through the live rooms as a rolling set of
// "suggestions to play". You can also steer it by hand: drag/swipe across it,
// use the ‹ › buttons, or click a dot. Auto-advance pauses on hover/focus/drag
// and is disabled under prefers-reduced-motion.

const coverModules = import.meta.glob("../covers/*.webp", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>

const cover = (art: string): string | undefined => coverModules[`../covers/${art}.webp`]

const CYCLE_MS = 8000 // a slow, ambient rotation
const SWIPE_PX = 56 // horizontal travel that counts as a deliberate swipe

export default function Billboard() {
  const slides = useMemo(() => liveRooms, [])
  const n = slides.length
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef({ x: 0, active: false, moved: false })

  const step = (dir: number) => {
    setPaused(true)
    setIdx((i) => (i + dir + n) % n)
  }
  const goTo = (i: number) => {
    setPaused(true)
    setIdx(i)
  }

  useEffect(() => {
    if (n < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % n), CYCLE_MS)
    return () => window.clearTimeout(t)
  }, [idx, paused, n])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, active: true, moved: false }
    setPaused(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current.active && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.x
    drag.current.active = false
    if (Math.abs(dx) > SWIPE_PX) setIdx((i) => (i + (dx < 0 ? 1 : -1) + n) % n)
  }
  // a drag that ends on a card/button must not also fire that element's click
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return (
    <section
      className="billboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current.active = false)}
      onClickCapture={onClickCapture}
      style={{ touchAction: "pan-y" }}
    >
      {slides.map((r, i) => (
        <img
          key={r.id}
          className={`billboard-img${i === idx ? " is-active" : ""}`}
          src={cover(r.art)}
          alt=""
          draggable={false}
          aria-hidden={i !== idx}
        />
      ))}
      <div className="billboard-scrim" />

      {slides.map((r, i) => (
        <div
          key={r.id}
          className={`billboard-content${i === idx ? " is-active" : ""}`}
          aria-hidden={i !== idx}
        >
          <p className="billboard-kicker">Featured &middot; {r.kicker}</p>
          <h1 className="billboard-title">{r.title}</h1>
          <div className="billboard-meta">
            <span className="badge-live">&#9679; Live</span>
            {r.chips.map((c, ci) => (
              <Fragment key={ci}>
                <span className="dot">&middot;</span>
                <span>{c}</span>
              </Fragment>
            ))}
          </div>
          <p className="billboard-blurb">{r.blurb}</p>
          <div className="billboard-actions">
            <a className="btn-play" href={r.href} tabIndex={i === idx ? 0 : -1} draggable={false}>
              &#9654;&nbsp; {r.cta ?? "Enter"}
            </a>
            <a className="btn-info" href="#rooms" tabIndex={i === idx ? 0 : -1} draggable={false}>
              &#9776;&nbsp; Browse all rooms
            </a>
          </div>
        </div>
      ))}

      <button className="bb-arrow bb-arrow-prev" aria-label="Previous room" onClick={() => step(-1)}>
        &lsaquo;
      </button>
      <button className="bb-arrow bb-arrow-next" aria-label="Next room" onClick={() => step(1)}>
        &rsaquo;
      </button>

      <div className="billboard-dots" role="tablist" aria-label="Featured rooms">
        {slides.map((r, i) => (
          <button
            key={r.id}
            className={`bb-dot${i === idx ? " on" : ""}`}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show ${r.title}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
