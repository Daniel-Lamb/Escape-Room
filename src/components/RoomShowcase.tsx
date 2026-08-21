"use client"

import { useMemo } from "react"
import { rooms, sections, type Room } from "../data/rooms"

// Static, content-forward rows: each player-count section is a horizontally
// scrollable row of 16:9 cards that scale on hover. Live rooms show their
// photoreal cover; concept rooms fall back to the (dimmed) SVG placard.

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

function Placard({ room }: { room: Room }) {
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

  return concept ? (
    <div className="show-card concept" aria-label={`${room.title} — coming soon`}>
      {inner}
    </div>
  ) : (
    <a className="show-card" href={room.href} aria-label={`Enter ${room.title}`}>
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
  const sectionRooms = useMemo(() => rooms.filter((r) => r.mode === mode), [mode])
  // Default to this section's own live count (e.g. "4 live"), not the site total.
  const label = count ?? `${sectionRooms.filter((r) => r.status === "live").length} live`

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
      <div className="row-track">
        {sectionRooms.map((room) => (
          <Placard key={room.id} room={room} />
        ))}
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
