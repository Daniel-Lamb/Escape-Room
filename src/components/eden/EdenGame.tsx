"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PointerLockControls, Text } from "@react-three/drei"
import * as THREE from "three"
import {
  useEden,
  gusContext,
  riversAllSolved,
  RIVERS,
  ANIMALS,
  TABLET_NAMES,
  type RiverId,
  type AnimalId,
  type EdenState,
} from "./store"

// EDEN: The Four Rivers — GREYBOX MVP (docs/DESIGN-EDEN.md).
// Primitive geometry + flat color, full puzzle chain, no final art. Higgsfield
// plates and real models replace pieces of this only after the chain plays well.

/* ---------- walkable space (greybox collision: point-in-union + axis slide) ---------- */
function walkable(x: number, z: number, s: EdenState): boolean {
  const inRect = (x0: number, x1: number, z0: number, z1: number) => x >= x0 && x <= x1 && z >= z0 && z <= z1
  const inCircle = (cx: number, cz: number, r: number) => (x - cx) ** 2 + (z - cz) ** 2 <= r * r
  if (inRect(-24, -11, -4, 4)) return true // Exile Vestibule
  if (inCircle(0, 0, 12)) return true // River Rotunda
  if (riversAllSolved(s) && (inRect(-2, 2, -17, -11) || inCircle(0, -24, 8))) return true // Grove
  if (inRect(11, 23, -5, 5)) return true // Gate court
  if (s.gateOpened && inRect(23, 42, -10, 10)) return true // Inner Eden
  return false
}

const KEYS: Record<string, boolean> = {}

function Player() {
  const { camera } = useThree()
  const s = useRef(useEden.getState())
  useEffect(() => useEden.subscribe((st) => (s.current = st)), [])
  useEffect(() => {
    camera.position.set(-20, 1.7, 0)
    camera.lookAt(0, 1.7, 0)
    const dn = (e: KeyboardEvent) => (KEYS[e.code] = true)
    const up = (e: KeyboardEvent) => (KEYS[e.code] = false)
    window.addEventListener("keydown", dn)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", dn)
      window.removeEventListener("keyup", up)
    }
  }, [camera])
  useFrame((_, dt) => {
    const fwd = new THREE.Vector3()
    camera.getWorldDirection(fwd)
    fwd.y = 0
    fwd.normalize()
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0))
    const v = new THREE.Vector3()
    if (KEYS.KeyW || KEYS.ArrowUp) v.add(fwd)
    if (KEYS.KeyS || KEYS.ArrowDown) v.sub(fwd)
    if (KEYS.KeyD || KEYS.ArrowRight) v.add(right)
    if (KEYS.KeyA || KEYS.ArrowLeft) v.sub(right)
    if (v.lengthSq() === 0) return
    v.normalize().multiplyScalar(4.2 * Math.min(dt, 0.05))
    const p = camera.position
    if (walkable(p.x + v.x, p.z + v.z, s.current)) p.add(v)
    else if (walkable(p.x + v.x, p.z, s.current)) p.x += v.x
    else if (walkable(p.x, p.z + v.z, s.current)) p.z += v.z
    p.y = 1.7
  })
  return null
}

/* ---------- interactable helper ---------- */
function Hot({
  children,
  onUse,
  ...props
}: { children: React.ReactNode; onUse: () => void } & JSX.IntrinsicElements["group"]) {
  const [hov, setHov] = useState(false)
  return (
    <group
      {...props}
      onClick={(e) => {
        e.stopPropagation()
        onUse()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHov(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHov(false)
        document.body.style.cursor = "auto"
      }}
    >
      {children}
      {hov && (
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshBasicMaterial color="#ffce9a" />
        </mesh>
      )}
    </group>
  )
}

function Label({ text, y = 2.6, size = 0.28 }: { text: string; y?: number; size?: number }) {
  return (
    <Text position={[0, y, 0]} fontSize={size} color="#f7ece0" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000">
      {text}
    </Text>
  )
}

/* ---------- Exile Vestibule ---------- */
function Vestibule() {
  const st = useEden()
  return (
    <group>
      {/* shell */}
      <mesh position={[-17.5, 3.5, -4.2]}>
        <boxGeometry args={[13, 7, 0.4]} />
        <meshStandardMaterial color="#4a4238" />
      </mesh>
      <mesh position={[-17.5, 3.5, 4.2]}>
        <boxGeometry args={[13, 7, 0.4]} />
        <meshStandardMaterial color="#4a4238" />
      </mesh>
      <mesh position={[-24.2, 3.5, 0]}>
        <boxGeometry args={[0.4, 7, 8.8]} />
        <meshStandardMaterial color="#443c33" />
      </mesh>
      {/* mural (fragment 1) */}
      <Hot position={[-22, 1.6, -3.9]} onUse={st.collectMural}>
        <mesh>
          <planeGeometry args={[3.4, 2.2]} />
          <meshStandardMaterial color="#6b5a42" />
        </mesh>
        <Label text="Mural: a figure of dust · reeds bend east · light reveals" y={1.6} size={0.2} />
      </Hot>
      {/* floor medallion */}
      <Hot position={[-18, 0.03, 0]} onUse={st.rotateMedallion}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshStandardMaterial color="#7a6a4f" />
        </mesh>
        <mesh position={[Math.sin((st.medallionDir * Math.PI) / 2) * 0.8, 0.06, -Math.cos((st.medallionDir * Math.PI) / 2) * 0.8]}>
          <coneGeometry args={[0.18, 0.5, 4]} />
          <meshStandardMaterial color="#ffce9a" />
        </mesh>
        <Label text={`Floor medallion (${["N", "E", "S", "W"][st.medallionDir]})`} y={1.2} size={0.22} />
      </Hot>
      {/* eastern shutter (high on the east wall, above the way out) */}
      <Hot position={[-12.2, 4.6, 2.4]} onUse={st.toggleShutter}>
        <mesh>
          <boxGeometry args={[0.3, 1.4, 1.8]} />
          <meshStandardMaterial color={st.shutterOpen ? "#20180f" : "#5c5044"} />
        </mesh>
        {st.shutterOpen && (
          <mesh position={[-2.5, -1.6, 0]} rotation={[0, 0, Math.PI / 3.2]}>
            <boxGeometry args={[6, 0.5, 1.4]} />
            <meshBasicMaterial color="#ffd9a0" transparent opacity={0.28} />
          </mesh>
        )}
        <Label text={st.shutterOpen ? "Eastern shutter (open)" : "Eastern shutter (closed)"} y={1.2} size={0.2} />
      </Hot>
      {/* bellows */}
      <Hot position={[-16, 0.4, 2.6]} onUse={st.useBellows}>
        <mesh>
          <boxGeometry args={[0.9, 0.5, 0.6]} />
          <meshStandardMaterial color="#8a5a2c" />
        </mesh>
        <Label text="Bronze bellows" y={1} size={0.2} />
      </Hot>
      {/* revealed floor map */}
      {st.compassRecovered && (
        <mesh position={[-15, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.6, 24]} />
          <meshBasicMaterial color="#ffb765" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}

/* ---------- River Rotunda ---------- */
const RIVER_POS: Record<RiverId, [number, number]> = {
  pishon: [7.5, -7.5],
  gihon: [-7.5, -7.5],
  hiddekel: [7.5, 7.5],
  euphrates: [-7.5, 7.5],
}
const MARKER_DIR: Record<RiverId, [number, number]> = { pishon: [1, 0], gihon: [0, -1], hiddekel: [0, 1], euphrates: [-1, 0] }
const MARKER_DESC: Record<RiverId, { color: string; label: string }> = {
  pishon: { color: "#d1a53f", label: "PISHON — the gold vein drinks" },
  gihon: { color: "#3a2a18", label: "GIHON — beneath the roots" },
  hiddekel: { color: "#ffce9a", label: "HIDDEKEL — the sunrise stone" },
  euphrates: { color: "#5b7a3a", label: "EUPHRATES — the reed basin" },
}

function RiverAssembly({ id }: { id: RiverId }) {
  const st = useEden()
  const [cx, cz] = RIVER_POS[id]
  const [mx, mz] = MARKER_DIR[id]
  const o = st.riverOrientation[id]
  const solved = st.riverSolved[id]
  const m = MARKER_DESC[id]
  return (
    <group position={[cx, 0, cz]}>
      <Hot onUse={() => st.rotateRiver(id)}>
        <mesh position={[0, 0.35, 0]} rotation={[0, (-o * Math.PI) / 2, 0]}>
          <boxGeometry args={[0.9, 0.7, 0.9]} />
          <meshStandardMaterial color={solved ? "#3a6ea5" : "#6e6152"} />
        </mesh>
        {/* channel arm — orientation o points [+Z,+X,-Z,-X][o] */}
        <mesh
          position={[[0, 1.1, 0, -1.1][o], 0.35, [1.1, 0, -1.1, 0][o]]}
          rotation={[0, o % 2 === 0 ? 0 : Math.PI / 2, 0]}
        >
          <boxGeometry args={[0.5, 0.5, 1.4]} />
          <meshStandardMaterial color={solved ? "#3a6ea5" : "#595043"} />
        </mesh>
        <Label text={solved ? `${id} — flowing` : `${id} channel`} y={2} size={0.24} />
      </Hot>
      {/* the marker this river must touch */}
      <mesh position={[mx * 2.6, 0.5, mz * 2.6]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color={m.color} emissive={solved ? m.color : "#000"} emissiveIntensity={0.5} />
      </mesh>
      <Text position={[mx * 2.6, 1.8, mz * 2.6]} fontSize={0.22} color="#c39a78" anchorX="center">
        {m.label}
      </Text>
      {/* water */}
      {solved && (
        <mesh position={[-cx / 2, 0.06, -cz / 2]} rotation={[-Math.PI / 2, 0, Math.atan2(cx, cz)]}>
          <planeGeometry args={[0.9, Math.hypot(cx, cz)]} />
          <meshBasicMaterial color="#4fc3d0" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

function Rotunda() {
  const st = useEden()
  const all = riversAllSolved(st)
  const solvedCount = RIVERS.filter((r) => st.riverSolved[r]).length
  return (
    <group>
      {/* floor + wall ring */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12.4, 48]} />
        <meshStandardMaterial color={all ? "#3d4a2e" : "#4d4438"} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[12.6, 12.6, 6, 48, 1, true]} />
        <meshStandardMaterial color="#544a3d" side={THREE.BackSide} />
      </mesh>
      {/* central fountain */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.6, 2, 1, 24]} />
        <meshStandardMaterial color="#6e6152" />
      </mesh>
      {all && (
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.5, 0.9, 5, 16]} />
          <meshBasicMaterial color="#8fe0ea" transparent opacity={0.75} />
        </mesh>
      )}
      {/* river seals rise as rivers solve */}
      {RIVERS.map(
        (r, i) =>
          st.riverSolved[r] && (
            <mesh key={r} position={[Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 3.2, 0.9, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 3.2]}>
              <cylinderGeometry args={[0.18, 0.18, 1.8, 10]} />
              <meshBasicMaterial color="#ffd9a0" />
            </mesh>
          )
      )}
      {RIVERS.map((r) => (
        <RiverAssembly key={r} id={r} />
      ))}
      {/* mural fragment 2 */}
      <Hot position={[0, 1.6, 11.8]} onUse={st.collectMural}>
        <mesh rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.4, 1.6]} />
          <meshStandardMaterial color="#6b5a42" />
        </mesh>
      </Hot>
      {/* grove door (north) */}
      <mesh position={[0, 1.5, -12.2]}>
        <boxGeometry args={[4, 3, 0.5]} />
        <meshStandardMaterial color={all ? "#2e4a2e" : "#3a3228"} transparent opacity={all ? 0.25 : 1} />
      </mesh>
      <Text position={[0, 3.4, -12]} fontSize={0.3} color="#c39a78" anchorX="center">
        {all ? "The roots have parted — the Grove" : `Rooted shut · ${solvedCount}/4 rivers flow`}
      </Text>
      <Text position={[16, 3.6, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} color="#c39a78" anchorX="center">
        {"East — the Angelic Gate"}
      </Text>
    </group>
  )
}

/* ---------- Naming Grove ---------- */
const ANIMAL_DESC: Record<AnimalId, { color: string; behavior: string }> = {
  peacock: { color: "#2e7a8a", behavior: "fans its tail as the sunbeam strikes it" },
  deer: { color: "#f2ede2", behavior: "walks a slow circuit of the four river stones" },
  dove: { color: "#e8e0d0", behavior: "flies, again and again, toward the eastern gate" },
  lion: { color: "#b5762a", behavior: "waits where the dawn light first touches the cave" },
}

function Creature({ id, index }: { id: AnimalId; index: number }) {
  const st = useEden()
  const ref = useRef<THREE.Group>(null)
  const a = (index * Math.PI) / 2 + Math.PI / 4
  const base: [number, number] = [Math.cos(a) * 5, -24 + Math.sin(a) * 5]
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    if (id === "deer") ref.current.position.x = base[0] + Math.sin(t * 0.5) * 1.6
    if (id === "dove") {
      ref.current.position.x = base[0] + ((t * 0.8) % 3)
      ref.current.position.y = 1.4 + Math.sin(t * 2) * 0.2
    }
    if (id === "peacock") ref.current.scale.setScalar(1 + Math.max(0, Math.sin(t * 0.7)) * 0.25)
  })
  const d = ANIMAL_DESC[id]
  return (
    <group>
      <group ref={ref} position={[base[0], id === "dove" ? 1.4 : 0.5, base[1]]}>
        <mesh>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color={d.color} emissive={id === "deer" ? "#fff" : "#000"} emissiveIntensity={0.12} />
        </mesh>
        <Label text={`${id === "deer" ? "white deer (Gus)" : id} — ${d.behavior}`} y={1.4} size={0.18} />
      </group>
      {/* pedestal */}
      <Hot position={[base[0] * 0.55, 0, -24 + (base[1] + 24) * 0.55]} onUse={() => st.cycleTablet(id)}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.7, 1, 0.7]} />
          <meshStandardMaterial color={st.animalNamed[id] ? "#7a6a2f" : "#5c5044"} emissive={st.animalNamed[id] ? "#ffd9a0" : "#000"} emissiveIntensity={0.4} />
        </mesh>
        <Label text={st.pedestalTablet[id] ? TABLET_NAMES[st.pedestalTablet[id]!] : "— empty pedestal —"} y={1.5} size={0.2} />
      </Hot>
    </group>
  )
}

function Grove() {
  const st = useEden()
  if (!riversAllSolved(st)) return null
  return (
    <group>
      <mesh position={[0, -0.01, -24]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8.4, 32]} />
        <meshStandardMaterial color="#37502c" />
      </mesh>
      {ANIMALS.map((a, i) => (
        <Creature key={a} id={a} index={i} />
      ))}
      {/* pool + prism */}
      <mesh position={[0, 0.02, -24]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 24]} />
        <meshBasicMaterial color="#3a8ea5" transparent opacity={0.85} />
      </mesh>
      {st.groveSolved && !st.prismInserted && (
        <mesh position={[0, 0.6, -24]} rotation={[0.4, 0.6, 0]}>
          <octahedronGeometry args={[0.35]} />
          <meshBasicMaterial color="#fff6da" />
        </mesh>
      )}
      <Hot position={[6, 1.4, -28]} onUse={st.collectMural}>
        <mesh>
          <planeGeometry args={[1.8, 1.2]} />
          <meshStandardMaterial color="#6b5a42" />
        </mesh>
      </Hot>
    </group>
  )
}

/* ---------- Angelic Gate ---------- */
function GateCourt() {
  const st = useEden()
  const gateRef = useRef<THREE.Mesh>(null)
  const swordRef = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (swordRef.current) swordRef.current.rotation.y += dt * (st.gateOpened ? 0.2 : 0.8)
    if (gateRef.current) gateRef.current.position.y = THREE.MathUtils.lerp(gateRef.current.position.y, st.gateOpened ? 7.5 : 2.5, dt * 1.2)
  })
  const hits = st.guardianWingAngles.filter((a, i) => a === ["outward", "lowered", "raised", "east"][i]).length
  return (
    <group>
      <mesh position={[17, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#57503f" />
      </mesh>
      {/* guardians */}
      {[-3.2, 3.2].map((z) => (
        <mesh key={z} position={[22, 2.4, z]}>
          <boxGeometry args={[1.2, 4.8, 1.6]} />
          <meshStandardMaterial color="#d9d2c0" />
        </mesh>
      ))}
      {/* sword */}
      <mesh ref={swordRef} position={[22, 2.6, 0]}>
        <coneGeometry args={[0.22, 2.4, 6]} />
        <meshBasicMaterial color={st.gateOpened ? "#ffffff" : "#ffb041"} />
      </mesh>
      {/* wing panels — order: peacock, deer, dove, lion */}
      {ANIMALS.map((a, i) => {
        const z = [-4.4, -1.6, 1.6, 4.4][i]
        return (
          <Hot key={a} position={[20.5, 1.1, z]} onUse={() => st.cycleWing(i)}>
            <mesh rotation={[0, 0, { outward: 0, lowered: -0.7, raised: 0.7, east: 0.25 }[st.guardianWingAngles[i]]]}>
              <boxGeometry args={[0.2, 1.6, 0.7]} />
              <meshStandardMaterial color={st.feathers === 4 ? "#e8d9a0" : "#8a8070"} />
            </mesh>
            <Label text={`${a} wing — ${st.guardianWingAngles[i]}`} y={2} size={0.18} />
          </Hot>
        )
      })}
      {/* prism pedestal */}
      <Hot position={[18, 0, 0]} onUse={st.insertPrism}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 1, 12]} />
          <meshStandardMaterial color="#6e6152" />
        </mesh>
        {st.prismInserted && (
          <mesh position={[0, 1.3, 0]}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#fff6da" />
          </mesh>
        )}
        <Label text={st.prismInserted ? `Prism set — ${hits}/4 seals lit` : "Prism pedestal"} y={2.2} size={0.2} />
      </Hot>
      {/* the gate itself */}
      <mesh ref={gateRef} position={[23.5, 2.5, 0]}>
        <boxGeometry args={[0.6, 5, 8.5]} />
        <meshStandardMaterial color="#c9a227" metalness={0.4} roughness={0.4} />
      </mesh>
      <Hot position={[14, 1.5, -4.6]} onUse={st.collectMural}>
        <mesh>
          <planeGeometry args={[1.8, 1.2]} />
          <meshStandardMaterial color="#6b5a42" />
        </mesh>
      </Hot>
    </group>
  )
}

/* ---------- Inner Eden ---------- */
function InnerEden() {
  const st = useEden()
  if (!st.gateOpened) return null
  const exile = st.endingUnlocked === "exile"
  return (
    <group>
      <mesh position={[32.5, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[19, 20]} />
        <meshStandardMaterial color={exile ? "#6a4438" : "#3f6a33"} />
      </mesh>
      {/* Tree of Life */}
      <group position={[34, 0, 0]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 4, 10]} />
          <meshStandardMaterial color="#5c4630" />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <coneGeometry args={[3, 4, 12]} />
          <meshStandardMaterial color={exile ? "#7a7a72" : "#4f8a3d"} emissive={exile ? "#000" : "#dfffd0"} emissiveIntensity={0.15} />
        </mesh>
      </group>
      {/* Tree of Choice + fruit */}
      <group position={[30, 0, -5]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.35, 0.5, 3.2, 8]} />
          <meshStandardMaterial color="#3a2e22" />
        </mesh>
        <mesh position={[0, 3.6, 0]}>
          <coneGeometry args={[2, 2.6, 10]} />
          <meshStandardMaterial color="#2e4630" />
        </mesh>
        {(!st.fruitTaken || st.fruitReturned) && (
          <Hot position={[0.9, 2.6, 0.6]} onUse={st.takeFruit}>
            <mesh>
              <sphereGeometry args={[0.3, 12, 10]} />
              <meshBasicMaterial color="#ffd23f" />
            </mesh>
            <Label text={st.fruitReturned ? "the fruit — returned" : "the luminous fruit"} y={0.7} size={0.18} />
          </Hot>
        )}
        {st.fruitHeld && (
          <Hot position={[0.9, 2.6, 0.6]} onUse={st.returnFruit}>
            <mesh>
              <sphereGeometry args={[0.12, 8, 6]} />
              <meshBasicMaterial color="#8a7a4a" wireframe />
            </mesh>
            <Label text="return the fruit?" y={0.6} size={0.18} />
          </Hot>
        )}
      </group>
      {/* spring / vessel / sapling / depression */}
      <Hot position={[32, 0, 4]} onUse={st.fillVessel}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[1.2, 20]} />
          <meshBasicMaterial color="#7fd8e8" />
        </mesh>
        <Label text="the clear spring" y={1} size={0.2} />
      </Hot>
      {st.vessel === "none" && (
        <Hot position={[30.6, 0.3, 3.2]} onUse={st.takeVessel}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.26, 0.5, 10]} />
            <meshStandardMaterial color="#a5734a" />
          </mesh>
          <Label text="Mara's vessel" y={0.8} size={0.18} />
        </Hot>
      )}
      <Hot position={[36, 0, 3]} onUse={st.waterSapling}>
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.25, 1.2, 6]} />
          <meshStandardMaterial color={st.saplingWatered ? "#5fae4a" : "#6e5a3a"} />
        </mesh>
        <Label text={st.saplingWatered ? "the sapling — green again" : "a dry sapling"} y={1.6} size={0.2} />
      </Hot>
      <Hot position={[39, 0, 0]} onUse={st.placeInDepression}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.9, 16]} />
          <meshStandardMaterial color="#241a10" />
        </mesh>
        <Label text="a door-shaped hollow" y={1} size={0.2} />
      </Hot>
      <Text position={[31, 0.6, 6.5]} fontSize={0.2} color="#c39a78" anchorX="center">
        {"Mara's journal: “...opens to an empty hand.”"}
      </Text>
    </group>
  )
}

/* ---------- scene wrapper ---------- */
function World() {
  const exile = useEden((s) => s.endingUnlocked === "exile")
  return (
    <>
      <color attach="background" args={[exile ? "#2a0d08" : "#11150d"]} />
      <fog attach="fog" args={[exile ? "#3a1008" : "#141a10", 10, 60]} />
      <hemisphereLight args={[exile ? "#ff8860" : "#cfe8d0", "#2a2015", 0.7]} />
      <directionalLight position={[20, 18, 6]} intensity={exile ? 0.5 : 0.9} color={exile ? "#ff6a3a" : "#ffe0b0"} />
      <Player />
      <Vestibule />
      <Rotunda />
      <Grove />
      <GateCourt />
      <InnerEden />
    </>
  )
}

/* ---------- DOM HUD ---------- */
const hud: Record<string, React.CSSProperties> = {
  wrap: { position: "fixed", inset: 0, pointerEvents: "none", fontFamily: '"Palatino Linotype", Georgia, serif', color: "#f7ece0" },
  narration: {
    position: "absolute", left: "50%", bottom: 18, transform: "translateX(-50%)", maxWidth: "72ch", padding: "12px 20px",
    background: "rgba(16,12,6,0.82)", border: "1px solid rgba(255,150,70,0.3)", borderRadius: 12, fontSize: 15, lineHeight: 1.5, textAlign: "center",
  },
  inv: { position: "absolute", right: 14, bottom: 16, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 340 },
  chip: { padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,150,70,0.4)", background: "rgba(20,11,5,0.8)", fontSize: 12 },
  gus: {
    position: "absolute", left: 14, top: 14, pointerEvents: "auto", cursor: "pointer", padding: "8px 14px", borderRadius: 12,
    background: "rgba(20,11,5,0.85)", border: "1px solid rgba(255,183,101,0.5)", color: "#ffce9a", fontSize: 13,
  },
  gusBox: {
    position: "absolute", left: 14, top: 60, width: 330, padding: 14, borderRadius: 12, pointerEvents: "auto",
    background: "rgba(16,12,6,0.94)", border: "1px solid rgba(255,150,70,0.4)", fontSize: 13, lineHeight: 1.5,
  },
  cross: { position: "absolute", left: "50%", top: "50%", width: 5, height: 5, marginLeft: -2, marginTop: -2, borderRadius: "50%", background: "rgba(255,206,154,0.9)" },
  end: {
    position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(8,5,2,0.88)", pointerEvents: "auto", textAlign: "center",
  },
}

function Hud() {
  const st = useEden()
  const [gusOpen, setGusOpen] = useState(false)
  const { ctx, hints } = gusContext(st)
  const used = st.hintsUsed[ctx] || 0
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.code === "KeyG") setGusOpen((v) => !v)
      if (gusOpen && ["Digit1", "Digit2", "Digit3"].includes(e.code)) {
        const tier = Number(e.code.slice(-1)) - 1
        if (tier >= used) st.buyHint(ctx, tier)
      }
    }
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [gusOpen, ctx, used, st])
  const items: string[] = []
  if (st.compassRecovered) items.push("🧭 Eden Compass")
  if (st.feathers > 0) items.push(`🪶 Feathers ×${st.feathers}`)
  if (st.prismHeld && !st.prismInserted) items.push("🔆 Prism of First Light")
  if (st.fruitHeld) items.push("🍎 the fruit")
  if (st.vessel !== "none") items.push(st.vessel === "full" ? "🏺 vessel (full)" : "🏺 vessel (empty)")
  if (st.muralFragments > 0) items.push(`📜 murals ×${Math.min(st.muralFragments, 4)}`)
  return (
    <div style={hud.wrap}>
      <div style={hud.cross} />
      <button style={hud.gus} onClick={() => setGusOpen((v) => !v)}>
        🦌 Ask Gus <span style={{ opacity: 0.6 }}>(G)</span>
      </button>
      {gusOpen && (
        <div style={hud.gusBox}>
          <b>Gus, the Gentle Wanderer</b>
          <p style={{ fontStyle: "italic", margin: "6px 0" }}>“You walk like someone who lost something. Everyone here did, once.”</p>
          {hints.map((h, i) => (
            <p key={i} style={{ margin: "8px 0", opacity: i < used ? 1 : 0.55 }}>
              <b>{["A glance", "The way of it", "The whole path"][i]}</b>
              {i < used ? ` — ${h}` : ` — press ${i + 1} to follow me (dims the bloom)`}
            </p>
          ))}
        </div>
      )}
      {st.narration && <div style={hud.narration}>{st.narration}</div>}
      <div style={hud.inv}>
        {items.map((t) => (
          <span key={t} style={hud.chip}>
            {t}
          </span>
        ))}
      </div>
      {st.endingUnlocked && (
        <div style={hud.end}>
          <div>
            <h1 style={{ fontSize: 34, color: st.endingUnlocked === "exile" ? "#ff8a5a" : "#ffd9a0", marginBottom: 14 }}>
              {st.endingUnlocked === "exile" ? "EXILE" : "RESTORATION"}
            </h1>
            <p style={{ maxWidth: "46ch", lineHeight: 1.6 }}>
              {st.endingUnlocked === "exile"
                ? "You found Eden. Eden rejected you."
                : "Some places are preserved by those willing to leave them."}
            </p>
            <button
              style={{ ...hud.gus, position: "static", marginTop: 20 }}
              onClick={() => window.location.reload()}
            >
              {st.endingUnlocked === "exile" ? "Wake at the collapsed door (try again)" : "Leave the garden"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- entry ---------- */
export default function EdenGame() {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    ;(window as any).__eden = useEden // greybox debug/verification hook
  }, [])
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0704" }}>
      <Canvas camera={{ fov: 62, near: 0.1, far: 120 }}>
        <World />
        {started && <PointerLockControls onUnlock={() => setStarted(false)} />}
      </Canvas>
      {started && <Hud />}
      {!started && (
        <div style={{ ...hud.end, pointerEvents: "auto" } as React.CSSProperties}>
          <div style={{ textAlign: "center", fontFamily: '"Palatino Linotype", Georgia, serif', color: "#f7ece0" }}>
            <p style={{ letterSpacing: "0.4em", fontSize: 12, color: "#ffb765" }}>ROOM V · GREYBOX</p>
            <h1 style={{ fontSize: 42, margin: "10px 0", color: "#ffd9a0" }}>EDEN: The Four Rivers</h1>
            <p style={{ maxWidth: "52ch", lineHeight: 1.6, margin: "0 auto" }}>
              The tunnel has collapsed behind you. Restore the four rivers, learn the creatures' names, pass the guardians —
              and remember Mara's warning: <i>do not take anything from the garden.</i>
            </p>
            <p style={{ opacity: 0.7, marginTop: 14, fontSize: 13 }}>WASD to move · mouse to look · click to touch · G for Gus · Esc to release</p>
            <button style={{ ...hud.gus, position: "static", marginTop: 18, fontSize: 16 } as React.CSSProperties} onClick={() => setStarted(true)}>
              Enter the boundary
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
