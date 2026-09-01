"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { liveRooms } from "../data/rooms";
import { ImageStreamHero, type StreamImage } from "./ui/image-stream-hero";

// The opening cinematic. The room placards (the same cover art the selection
// screen uses) rush the viewer down a perspective corridor, then the whole
// thing flies through and hands off to the dashboard beneath it.
//
// The dashboard is already in the DOM under this overlay; it's held hidden by
// `html[data-intro="play"]` (set pre-paint by an inline script in index.astro,
// so nothing flashes before this client-only island mounts) and revealed by
// flipping to `data-intro="seen"` the moment the fly-through begins.

const coverModules = import.meta.glob("../covers/*.webp", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

const cover = (art: string): string | undefined =>
  coverModules[`../covers/${art}.webp`];

const SEEN_KEY = "escape-intro-seen"; // once per browser session
const HOLD_MS = 6800; // auto fly-through if the player just watches
const EXIT_MS = 850; // must match the .intro-overlay transition

export default function IntroSequence() {
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  const holdTimer = useRef<number>(0);
  const exitTimer = useRef<number>(0);

  // Reveal the dashboard beneath and remember we've played this session.
  const reveal = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — just don't persist */
    }
    document.documentElement.setAttribute("data-intro", "seen");
  }, []);

  // Cinematic exit: reveal underneath, fly the corridor through, then unmount.
  const flyThrough = useCallback(() => {
    window.clearTimeout(holdTimer.current);
    setExiting((already) => {
      if (already) return already;
      reveal();
      exitTimer.current = window.setTimeout(() => setActive(false), EXIT_MS);
      return true;
    });
  }, [reveal]);

  // Instant exit — no motion, straight to the selection screen.
  const skip = useCallback(() => {
    window.clearTimeout(holdTimer.current);
    window.clearTimeout(exitTimer.current);
    reveal();
    setActive(false);
  }, [reveal]);

  // Decide on mount whether the intro should play at all.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* treat unreadable storage as first visit */
    }
    if (seen) {
      document.documentElement.setAttribute("data-intro", "seen");
      return;
    }
    (window as unknown as { __introMounted?: boolean }).__introMounted = true;
    document.documentElement.setAttribute("data-intro", "play");
    setActive(true);
    holdTimer.current = window.setTimeout(flyThrough, HOLD_MS);
    return () => {
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(exitTimer.current);
    };
  }, [flyThrough]);

  // Keyboard: Enter/Space flies through, Escape skips. Focus the primary CTA.
  useEffect(() => {
    if (!active) return;
    enterRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flyThrough();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, flyThrough, skip]);

  if (!active) return null;

  const images: StreamImage[] = liveRooms
    .map((r) => ({ src: cover(r.art) as string, alt: r.title }))
    .filter((im) => im.src);

  return (
    <div
      className={`intro-overlay${exiting ? " is-exiting" : ""}`}
      role="dialog"
      aria-label="Escape Rooms — opening"
    >
      <ImageStreamHero
        images={images}
        cards={10}
        speed={16}
        axis={52}
        className="intro-corridor"
      >
        <div className="intro-veil" />

        <div className="intro-copy">
          <div className="intro-top">
            <p className="intro-kicker">Solo &middot; Duo &middot; Group</p>
            <h1 className="intro-word">ESCAPE&nbsp;ROOMS</h1>
          </div>
          <div className="intro-bottom">
            <p className="intro-sub">Ten doors. One hour each. Choose yours.</p>
            <div className="intro-actions">
              <button ref={enterRef} className="intro-enter" onClick={flyThrough}>
                &#9654;&nbsp; Enter
              </button>
            </div>
          </div>
        </div>

        <button className="intro-skip" onClick={skip} aria-label="Skip the intro">
          Skip &rsaquo;
        </button>
      </ImageStreamHero>
    </div>
  );
}
