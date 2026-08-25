"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { liveRooms } from "../data/rooms"

// The hero slowly cross-fades through the live rooms as a rolling set of
// "suggestions to play". Auto-advance pauses on hover/focus and is disabled
// under prefers-reduced-motion (the dots still let you pick a room by hand).

const coverModules = import.meta.glob("../covers/*.webp", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>

const cover = (art: string): string | undefined => coverModules[`../covers/${art}.webp`]

const CYCLE_MS = 8000 // a slow, ambient rotation

export default function Billboard() {
  const slides = useMemo(() => liveRooms, [])
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % slides.length), CYCLE_MS)
    return () => window.clearTimeout(t)
  }, [idx, paused, slides.length])

  return (
    <section
      className="billboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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
            <a className="btn-play" href={r.href} tabIndex={i === idx ? 0 : -1}>
              &#9654;&nbsp; {r.cta ?? "Enter"}
            </a>
            <a className="btn-info" href="#rooms" tabIndex={i === idx ? 0 : -1}>
              &#9776;&nbsp; Browse all rooms
            </a>
          </div>
        </div>
      ))}

      <div className="billboard-dots" role="tablist" aria-label="Featured rooms">
        {slides.map((r, i) => (
          <button
            key={r.id}
            className={`bb-dot${i === idx ? " on" : ""}`}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show ${r.title}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </section>
  )
}
