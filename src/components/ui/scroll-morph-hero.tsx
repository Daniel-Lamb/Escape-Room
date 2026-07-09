"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { rooms } from "../../data/rooms"

// Intro overlay: on load the room placards scatter in, gather into a line, then
// a circle, then spread into the three player-count rows — after which the
// overlay fades to reveal the live dashboard (the marquee showcase) beneath.
//
// Adapted from the scroll-morph-hero component: the scroll-hijack is replaced
// with a timed auto-play, the stock photos with room art, and the single arc
// with three section bands. Mounted client:only, so no SSR/hydration concerns.

const svgModules = import.meta.glob("../../svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function artUrl(art: string): string {
  const svg = (svgModules[`../../svg/${art}.svg`] ?? "").trim()
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

type Phase = "scatter" | "line" | "circle" | "rows"
type Target = { x: number; y: number; rot: number; scale: number; opacity: number }

const CARD_W = 96
const CARD_H = 54 // 16:9
const PER_BAND = 6
const SECTIONS = ["single", "duo", "group"] as const

interface Card {
  url: string
  si: number // section index 0..2
  bi: number // slot within the band 0..PER_BAND-1
  i: number // global index
}

function buildCards(): Card[] {
  const out: Card[] = []
  SECTIONS.forEach((mode, si) => {
    const rr = rooms.filter((r) => r.mode === mode)
    for (let bi = 0; bi < PER_BAND; bi++) {
      const room = rr[bi % rr.length]
      out.push({ url: artUrl(room.art), si, bi, i: out.length })
    }
  })
  return out
}

function targetFor(phase: Phase, c: Card, W: number, H: number, N: number, scatter: Target): Target {
  if (phase === "scatter") return scatter
  if (phase === "line") {
    const sp = CARD_W * 0.55
    return { x: (c.i - (N - 1) / 2) * sp, y: 0, rot: 0, scale: 0.85, opacity: 1 }
  }
  if (phase === "circle") {
    const R = Math.min(Math.min(W, H) * 0.34, 300)
    const a = (c.i / N) * Math.PI * 2
    return { x: Math.cos(a) * R, y: Math.sin(a) * R, rot: (a * 180) / Math.PI + 90, scale: 1, opacity: 1 }
  }
  // rows: three horizontal bands, biased downward toward where the real rows sit
  const bandGap = CARD_H + 74
  const y = H * 0.04 + (c.si - 1) * bandGap
  const x = (c.bi - (PER_BAND - 1) / 2) * (CARD_W + 22)
  return { x, y, rot: 0, scale: 1.12, opacity: 1 }
}

export default function ScrollMorphHero() {
  const cards = useMemo(buildCards, [])
  const N = cards.length

  const [phase, setPhase] = useState<Phase>("scatter")
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const [scatter, setScatter] = useState<Target[]>(() =>
    cards.map(() => ({ x: 0, y: 0, rot: 0, scale: 0.6, opacity: 0 }))
  )

  // Remove the SSR bridge cover once our opaque overlay is up.
  useEffect(() => {
    document.getElementById("intro-cover")?.remove()
  }, [])

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setGone(true)
      return
    }
    setSize({ w: window.innerWidth, h: window.innerHeight })
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", onResize)
    setScatter(
      cards.map(() => ({
        x: (Math.random() - 0.5) * Math.min(window.innerWidth * 1.4, 1600),
        y: (Math.random() - 0.5) * Math.min(window.innerHeight * 1.1, 900),
        rot: (Math.random() - 0.5) * 160,
        scale: 0.6,
        opacity: 0,
      }))
    )
    const timers = [
      window.setTimeout(() => setPhase("line"), 550),
      window.setTimeout(() => setPhase("circle"), 2150),
      window.setTimeout(() => setPhase("rows"), 4200),
      window.setTimeout(() => setFading(true), 5400),
      window.setTimeout(() => setGone(true), 6400),
    ]
    return () => {
      window.removeEventListener("resize", onResize)
      timers.forEach((t) => window.clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skip = () => {
    setFading(true)
    window.setTimeout(() => setGone(true), 700)
  }

  if (gone) return null

  const showTitle = phase === "circle"

  return (
    <motion.div
      className="intro-overlay"
      onPointerDown={skip}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ pointerEvents: fading ? "none" : "auto" }}
    >
      <div className="intro-stage">
        <motion.div
          className="intro-title"
          animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 12 }}
          transition={{ duration: 0.7 }}
        >
          <p className="intro-kicker">Choose your door</p>
          <h1>Escape Rooms</h1>
        </motion.div>

        {cards.map((c) => {
          const t = targetFor(phase, c, size.w, size.h, N, scatter[c.i])
          return (
            <motion.div
              key={c.i}
              className="intro-card"
              initial={false}
              animate={{ x: t.x, y: t.y, rotate: t.rot, scale: t.scale, opacity: t.opacity }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
              style={{ width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2 }}
            >
              <img src={c.url} alt="" draggable={false} />
            </motion.div>
          )
        })}

        <p className="intro-skip">click to skip</p>
      </div>
    </motion.div>
  )
}
