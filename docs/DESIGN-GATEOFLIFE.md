# The Gate of Life — Design Document

### A browser escape room — out of the Colosseum's underworld before the midday games

*(Rev 2 — post-adversarial-review. Three independent reviewers verified every solution
mathematically; this revision fixes the R5 maze semantics, replaces the R6 mechanic and
the meta's ordering rule with series-fresh ones, closes an item-combo soft-lock, and
patches all knowledge-check gaps. All solutions below re-verified.)*

**Logline:** You are Aulus Pollio, architectus of the Flavian Amphitheatre's underworks,
condemned on a false charge to die in the midday executions. You know these tunnels — you
drew them. Sixty minutes before the lifts come down for the condemned, you find the first
of six bone tesserae left by a man the guards say a lion ate. The lion, for the record,
is sitting next to you.

**Folder:** `gate-of-life/` · **Save key:** `gate-of-life-save-v1` · **Series slot:** Room IV · Ancient Rome

---

## 1. Story

**Setup (R1).** Rome, the reign of Titus. Games day. The holding pens are full, so you were
thrown into the old carcer — a disused cell beside the beast corridors. Your patron fell
from favor; you fell with him: *maiestas*, treason, sentenced to the *meridianum
spectaculum* — the midday executions, when the condemned are sent up on the lifts you
yourself designed. At the hour the sun stands straight — 60:00 on the clock — they come
for you. On the cell wall, a verse signed **"— F."**, and a door chained shut with a
letter-lock by a turnkey who cannot read.

**The trail.** Felix was the hypogeum's beast-carpenter a generation ago — the man who
kept the lifts turning and the cages fed. The registers say a lion killed him. The truth,
scratched along a route only a builder would trust: he found the way out through the
fire-damaged western works to the old **Porta Sanavivaria** — the Gate of Life, the door
a spared gladiator walks out of alive. He left six **bone tesserae** (gladiator
name-tokens) marking the road, each scratched with the emblem of a brother of the sand
and a single letter.

**Midpoint (R4, the lanista's ledger).** Felix petitioned for the *rudis* — the wooden
sword of freedom — and was **DENIED: "too useful below."** The same ledger page orders
his lion **"destroyed when the games close."** That is why Felix built a door out; that
is who the lion is.

**Ending (R7).** Behind a half-bricked arch beside the gate: Felix's bones, his tools,
a finished rudis he carved for himself, and a last tablet — he *could* have left in
September; the lion, chained above for the games, could not; he stayed the winter and the
fever took him. *"If you read this — take him. The word is the one the crowd shouts when
a life is to be spared."* The six tesserae, matched to the procession frieze above the
wicket, spell **MISSIO** — the crowd's cry of mercy. You set the word, heave the gate,
and walk out into the festival crowd with a lion at your heel and a dead man's rudis in
your hand. Victory screen: **MISSIO — GRANTED.**

No twist mechanic this time (Room I's model: story beats, an emotional payoff instead of
a rug-pull). The payoff is Gus — see below.

---

## 2. Gus's form — the Emperor's lion

- **Name/epithet:** `Gus` — *"Gustus — the Emperor's lion, retired by his own decision."*
  Running joke: everyone below assumes Gus is short for **Augustus**; Gus permits this.
- **Form:** an old, enormous, one-torn-ear Colosseum lion who refuses to perform. Felix
  raised him from a cub; since Felix vanished, the handlers pretend he is caged because
  none of them wants to be the one to correct the paperwork. He pads freely through the
  underworks and has decided you are Felix's business, therefore his.
- **Portrait (SVG, `js/gus.js`):** great round amber-maned head, heavy-lidded dignified
  eyes, one ear ragged, faint scar over the brow; warm mane golds (#d1a53f→#8a5a1c),
  amber eyes (#ffcf6a). Small dock version must read clearly at ~64px.
- **Voice:** dry, regal, economical; a cat's contempt with a soldier's loyalty. He speaks
  (the game never explains this; Room I had a ghost, nobody complained).
- **Lines (spec — shell agent writes these exactly):**
  - greetings: 5 lines, e.g. *"You may call me Gus. The Emperor calls me Gustus Ferox.
    The Emperor is not here."* / *"I have eaten precisely no one, whatever the register
    says. Standards."* / *"Felix built half these doors. I watched. Ask."* / *"You smell
    of ink and fear. The ink is more useful. Ask your question."* / *"I know every stone
    down here. Most of them are boring. Ask me about the other ones."*
  - stuck: *"Still circling. I do this too, but I make it look intentional. Shall I spend
    your minutes?"*
  - noMore: *"That is the whole of what I know about this room. The rest wants hands.
    Mine are professionally unavailable."*
  - tierNames: `['A twitch of the tail', 'The stalk', 'The pounce']` · buyLabel: `'Growl it low'`
  - farewell: *"I will be here. Napping. Strategically."*

---

## 3. Global systems & skin

Identical engine (timer, inventory, combining, tiered hints, journal, autosave,
defeat-retry). Skin differences:

- **Journal:** title **"Wax Tablets"**; empty text mentions that every inscription,
  tablet, and tessera you examine is copied here, and that the tesserae matter.
  Collectibles section title: **"Bone Tesserae"**.
- **Inventory label:** `Loculus` (a workman's satchel).
- **Collectible card (`renderCollectible` in main.js):** a bone tablet (rounded-corner
  ivory rectangle, `#e8dcc0` on dark) bearing the tessera's **emblem glyph** (small SVG:
  spear / net / egg-helm / fish-crest / griffin / palm frond) with the **letter**
  beneath in serif. Toast: `Bone tessera pocketed: the <emblem> — "<letter>"`.
- **Palette (rooms + skin):** warm dark. Stone `#241f1a` `#332b23` `#453a2e`, deep shadow
  `#0f0c08`, torchlight `#ffa94d` `#e07b2a` (shared classes `torch-flame`/`glow` mandatory
  on every torch), gold `#c9a227`, arena sand `#c9a45f` (lit: `#e8cf96`), marble/travertine
  `#cfc6b4` `#8a7f6a`, imperial crimson `#8e2f35`, imperial purple `#5a2a52`, bone/ivory
  `#e8dcc0`. Recurring motifs: sand sifting between ceiling planks, shafts of dusty light
  from the arena above, crowd-roar implied by tiered vaults, SPQR/Latin inscriptions
  (`font-family="Palatino Linotype, Georgia, serif"`).
- **Documents:** two styles. Existing `.parchment-note` (+`.aged`) for scrolls/ledgers.
  New **`.wax-tablet`** class in `skin.css`: dark wax panel (#1d1812) inside a wooden
  frame (border #6b4f2c, thick), incised-looking text (#e8dcc0, serif, slight
  letter-spacing), title element `.tab-title` (small caps, gold). Rooms use
  `<div class="wax-tablet"><div class="tab-title">…</div>…</div>`.
- **skin.css also:** title screen = Colosseum arcade silhouette (two tiers of arches) over
  a torch-lit haze, title gradient in gold like Room I but warmer; timer/badge keep serif
  (Rome invented this font, effectively); ember particles stay warm (default). Gus dock
  glow warm amber. `--gold`/`--torch` etc. stay near defaults — Rome IS the warm palette.
- **index.html texts:** title `The Gate of Life`, kicker *"Sixty minutes to the midday
  games"*, tagline *"They say a lion ate the last man who knew the way out. The lion
  disagrees."* New-game button **"Refuse the Sand"**, journal button **Wax Tablets**,
  inventory label **Loculus**, favicon 🏛️. How-to-play modal mirrors Starfall's structure
  with Roman flavor (one hour to the midday executions; glowing regions; loculus items,
  click-to-hold then click scene or second item; tablets auto-record; Gus the lion, three
  growls per chamber −1:00/−2:00/−4:00, paid growls stay readable; autosave).
- **Victory config:** title `Missio`, heading **"MISSIO — GRANTED"**, story: you and the
  lion step out of the Gate of Life into festival crowds that part around a lion the way
  crowds do; nobody stops a man the games have already killed; Felix's rudis in your belt;
  somewhere above, the trumpets call the midday show to sand that will not have you.
- **Defeat config:** title `The Lift Comes Down`, heading **"The Sand Calls"**, story:
  torchlight, the escort, the cage-lift rising toward a white square of roaring daylight —
  and a lion's low voice from the dark: *"Wrong door. We will try the other one."*
  retryLabel `Slip the Escort (this chamber, 15:00)`, restartLabel
  `Wake Again in the Carcer`. restartConfirm mentions losing all progress to the straw.

### The six bone tesserae (meta-puzzle currency)

Journal `category:'sun'`, `sun: { rays: <frieze position 1–6>, letter, emblem }`. `rays`
is internal only (never rendered); the card and toast show the **emblem + letter**.

| # | Journal id | Found in | Emblem | Frieze pos | Letter |
|---|---|---|---|---|---|
| 1 | `token1` | R1 — under the drain grate | egg-helm | 3 | S |
| 2 | `token2` | R2 — in the whetstone trough | spear | 1 | M |
| 3 | `token3` | R3 — behind the votive tablets | net | 2 | I |
| 4 | `token4` | R4 — in the strongroom | griffin | 5 | I |
| 5 | `token5` | R5 — in the lion's old cage | palm frond | 6 | O |
| 6 | `token6` | R6 — in the grease pit | fish-crest | 4 | S |

**The ordering rule (series-fresh — NOT the sort-by-count cipher of Rooms I–II, NOT
Room III's proven-chain):** carved above the R7 wicket is a **procession frieze** — six
marchers of the pompa, left to right: **spear-man · net-man · egg-helm · fish-crest ·
griffin-crest · palm-bearer** (journaled `note_frieze` on examine, listing the order in
words). Felix's scratched line beneath: **"AS THEY MARCH, THEY SPEAK."** Match each
tessera's emblem to its marcher → **M·I·S·S·I·O**. Room-order letters read S·M·I·I·O·S
(meaningless). The emblems are pre-taught: R2's mural names the fish-crest, griffin,
net-man, and egg-helm ("the chaser"); the spear is named on R2's slate; the palm frond
is the victory token (R7's garlands echo it, and the tessera examine text names it).
First-tessera examine text teaches the convention: *"a gladiator's name-token — the
emblem is the man's class, the letter is Felix's addition."*

### Item chain (with consumption — devs must not guess)

```
R1 strigil (looks like junk) ─→ R1 lever the drain grate ─→ R4 scrape the wax palimpsest   KEPT (both uses)
R2 dolabra (pick-crowbar) ────────────────────────────────→ R7 pry the bar seat + the arch  KEPT (all uses)
R2 wool rag ─────────────┐
R3 oil flask (sacred oil) ┴→ COMBO: oiled rag ────────────→ R7 the seized hinge             rag+flask CONSUMED by combo; oiled_rag CONSUMED on hinge
R3 bronze mirror ─────────────────────────────────────────→ R5 throw light on the chalk plan KEPT
R4 winch key (bronze, square) ────────────────────────────→ R6 unlock the windlass brake    CONSUMED (left in the brake; scene renders it seated)
R5 crank handle ──────────────────────────────────────────→ R6 seats in the capstan         CONSUMED (seated; scene renders it)
R7 Felix's rudis ─────────────────────────────────────────→ carried to the ending (story)   KEPT
```

Item ids: `strigil`, `dolabra`, `wool_rag`, `oil_flask`, `bronze_mirror`, `winch_key`,
`crank_handle`, `oiled_rag`, `rudis`. Registration: each item is registered by the room
that introduces it; `oiled_rag` + the combo `[wool_rag, oil_flask] → oiled_rag` are
registered in **room3**. onCombine: remove both, add `oiled_rag`, narrate soaking the
rag. **Combo is seeded early:** when the player takes the oil flask in R3, Gus comments
— *"Felix used to soak rags in that for the hinges. The rag you are carrying would drink
it happily."* (an invitation to combine at zero stakes, four rooms before it's needed).

The strigil is this game's bent spoon: bathhouse junk in R1, the only tool that shaves
wax without gouging the wood in R4.

### Exit gates (fairness — no missable clues/items)

- R1 → R2: requires `strigil` + `token1` journaled. Nag lines are Gus's, and name the
  specific object (the drain).
- R2 → R3: requires `dolabra` + `wool_rag` + `token2`.
- R3 → R4: requires `bronze_mirror` + (`oil_flask` **OR** `oiled_rag`) + `token3` +
  journal `note_charm`. **Global rule: any gate or interaction that checks `wool_rag` or
  `oil_flask` individually must also accept `oiled_rag`** — a player may combine the
  moment both exist (R3), and that must never block progress. Gus's token3 nag names the
  votive wall specifically.
- R4 → R5: requires `winch_key` + `token4` + journal `note_ledger`.
- R5 → R6: requires `crank_handle` + `token5` (plan `note_plan` is intrinsic — the maze
  cannot be solved without it, but gate on it anyway for safety).
- R6 → R7: `token6` (rest intrinsic).
- Wrong answers everywhere: `api.fail(...)` only — never time loss, never lockout.

**Tessera invariant:** every tessera hotspot is present in every scene-state variant of
its chamber from first reachability until journaled, guarded by `!game.journal.has(id)`.

Flag prefixes: `carcer_`, `armory_`, `shrine_`, `tablinum_`, `hypogeum_`, `winch_`,
`porta_`.

---

## 4. The seven chambers

**Rules for ALL chambers (implementers, read first):**
- Keep every hotspot out of the **top-left 220×250 scene-unit reserve** (Gus docks
  there). Flavor art may enter the zone; nothing clickable may.
- Prefix every gradient/filter id and room-local SVG animation name with the room slug:
  `gd_car_`, `gd_arm_`, `gd_shr_`, `gd_tab_`, `gd_hyp_`, `gd_win_`, `gd_por_`.
- Every load-bearing Roman numeral is **additive** (IIII, VIIII — never IV/IX) and is
  **glossed in words** on examine (e.g. *"III — three, says the mason's mark"*), and the
  gloss is journaled with the note.
- Latin terms used in clues are glossed inline the first time (*"Perge — onward"*), as
  the R5 plan does.
- Wrong answers: `api.fail` with a diegetic line; puzzles fully re-openable; solved
  state persists in the scene.

Mechanics check vs series (must not repeat): Room I used counting-combination,
constraint ordering, musical sequence, book cipher, recipe mixing, coupled gears,
count-sort letter meta. Room II used conservation-law observation, pipe routing, UV
cross-reference, logic gates, symbol substitution, subset resource balancing,
twist + count-sort meta. Room III used negative-evidence tracking, river-crossing logic,
border surgery, food-web assembly, mirror symmetry, balance-scale counterfeit,
proven-chain meta. This game: **acrostic, attribute-assignment from mixed physical +
written evidence, jug measuring, palindromic word square, guided maze traversal,
mechanical-advantage assembly, procession-frieze letter meta.**

### CHAMBER 1 — The Carcer (≈5 min, tutorial) — `id: 'carcer'`, file `room1-carcer.js`

**Mechanic: acrostic.** The cell door is chained with a merchant's **letter-lock** —
five sliding tumblers (vertical sliders, deliberately NOT rings, so the game's first
and last locks don't look alike). The turnkey who chained it cannot read; Felix could.
Scratched deep in the plaster, journaled on examine (`note_verse`), Felix's verse —
five lines whose initials spell **ARENA**, signed *"— F. Read me down the margin."*:

> **A**ll my days I counted grains instead of hours.
> **R**emember: sand forgets each man it swallows.
> **E**very door they locked, I learned the hinges of.
> **N**othing holds the man the sand has taught.
> **A**sk the walls; the walls were paid to answer.

*Deduction:* the sign-off states the method; five lines, five tumblers. Unique.

**Puzzle UI (`carcer_lock`):** five sliding tumblers; each slides through the same six
letters `A E N R S V` (click a tumbler to advance it one letter, wrapping). Set
**A·R·E·N·A** → Attempt. On solve: `carcer_lockOpen`, chain falls, door ajar.

**The strigil & token 1:** a bent bronze **strigil** in the straw pallet (hotspot; flag
`carcer_strigilTaken`; item text calls it bathhouse junk). The floor **drain grate** is
finger-proof; using the held strigil on the drain hotspot levers it up → **token1**
(egg-helm, letter S) journaled + `carcer_grateOpen`. Examining the drain without the
strigil says fingers won't do it — something flat and strong might. This teaches
item-on-hotspot before Room 2. Token1's examine/journal text teaches the tessera
convention (name-token, class emblem, Felix's letter).

**Gus's entrance:** onEnter after intro — a lion pads past the bars and sits. He is not
an escaped lion; he is a lion whose paperwork is wrong (his own words). Dock active
from R1.

**Scene:** cramped stone cell; straw pallet; drain grate lower-right; chained door
right; barred slit window upper-right (shaft of daylight, dust, distant crowd);
manacles; Felix's verse wall left-center (NOT in the top-left reserve). Scene state
changes: chain gone when `carcer_lockOpen`; grate ajar + dark hole when
`carcer_grateOpen`; strigil absent once taken.

**Hotspots (7, incl. 3 flavor):** verse wall · letter-lock/door (→ open door → exit
gate) · straw pallet (strigil) · drain grate (item-use; tessera stays until journaled)
· window (flavor: the crowd, the sun climbing) · manacles (flavor) · old bones in the
corner (flavor: not Felix's — too small, a dog's; Gus is offended you looked at him).

**Exit:** door hotspot when open: gate on strigil + token1. Gus's nag: *"The drain.
Felix never left a marker where a guard would sweep."*

**Hints:** ① The lock wants a word and the wall wants a reader — that verse is signed
by a man who opened this door before you. ② Read the verse down the margin: first letter
of each line, top to bottom, five tumblers. ③ A-R-E-N-A. And lever the drain with the
strigil before you go.

### CHAMBER 2 — The Armamentarium (≈7 min) — `id: 'armory'`, file `room2-armory.js`

**Mechanic: attribute assignment from mixed physical + written evidence.** The armory's
far door unbars for the drill-master's inspection: the **practice dummy** must be
dressed correctly. A wooden tag hangs on the dummy (journaled `note_dummy`):
**"SECVTOR — 'the chaser', who follows the net-man. Dress him true for inspection."**
(This line pays the Latin toll — no outside taxonomy needed anywhere.) Wrong kit = the
inspection bell mocks you (`api.fail`), nothing else.

**Racks (each item labeled by its look, never its owner):**
- Helmets: fish-crested bronze · griffin-crested · smooth rounded (small eyeholes) ·
  broad-brimmed visored
- Shields: tall curved scutum · small square shield · round buckler · weighted net
- Weapons: straight short sword (gladius) · curved blade (sica) · trident · long spear

**Clues (half written, half physical — deliberately):**
- Mural + caption (journal `note_mural`): *"Four brothers of the sand: the FISH-CREST
  fights the net-man; the GRIFFIN rides the curved knife; the CHASER wears no crest at
  all, that the net may find no hold on him."*
- Drill-master's wax tablet (journal `note_slate`): *"Complaints, again: the thraex has
  swapped his little square shield for the buckler — the buckler is the provocator's.
  The provocator's brimmed visor is at the smith for a new hinge — he drills bare-headed
  and complains. The net and trident are the net-man's own kit and belong to no rack of
  mine. The long spear is the hoplomachus's — he is no brother of this school, and his
  spear is mis-shelved."*
- **Physical:** examining the tall scutum (journal `note_scutum`): *"the grip is worn
  smooth by two different hands — one broad, one narrow. Two brothers share this
  pattern of shield."* Examining the sica rack hook: bent into a griffin-beak curve by
  years of the same blade (flavor corroboration of the mural).

*Deduction (unique, all in-scene):* the dummy is the chaser (tag). Helmet: crestless
(mural) eliminates fish + griffin crests; the brimmed visor is at the smith (slate) —
only the **smooth rounded** helm remains on a peg for a crestless man. Shield: the tall
scutum is worn by two hands (physical) and the mural's brothers pair the chaser against
the net-man's net — the slate removes net (not of this rack), buckler (provocator's),
and small square (thraex's) → **tall scutum**. Weapon: sica→griffin (mural),
trident→net-man (slate), spear→hoplomachus, no brother (slate) → **gladius**.

**Puzzle UI (`armory_dummy`):** three columns of four options (click to select),
"Sound the Inspection" button. On solve: `armory_dressed`, the release chain drops the
**maintenance locker** open; the dummy renders dressed.

**Items/token:** locker (after solve): **dolabra** + **wool rag**. **Token2** (spear,
letter M) lies in the sand of the **whetstone trough** (visible glint from the start;
stays until journaled).

**Scene:** long vaulted armory; racks of kit; practice dummy center; mural
upper-center — **mural hotspot right of x=220 and below y=250** (reserve rule);
whetstone wheel + trough; locker (closed→open); barred far door (→ open on dressed).
State changes: dummy dressed, locker open, door open.

**Hotspots (9, incl. 3 flavor):** dummy + tag (→ puzzle) · mural · drill-master's
tablet · helmet rack (examine text describes all four) · shield rack (→ `note_scutum`
wear detail) · weapon rack (sica-hook detail) · whetstone trough (token2) · locker
(after solve: dolabra + rag) · far door — flavor: rack of wooden practice swords
(*"a real rudis is earned, not shelved"* — foreshadow), the cold forge, (third flavor
beat lives in the sica hook examine).

**Exit:** far door once `armory_dressed`; gate on dolabra + wool_rag + token2.

**Hints:** ① The dummy is dressed by rumor: a mural of four brothers, a drill-master
who writes down every complaint, and wear-marks on the gear itself. ② The chaser is
the crestless one whose alternative is at the smith; his shield he shares with a
second pair of hands; his blade is whatever the complaints have not already given
away. ③ Smooth egg helm, tall scutum, straight gladius.

### CHAMBER 3 — The Shrine of Nemesis (≈7 min) — `id: 'shrine'`, file `room3-shrine.js`

**Mechanic: jug measuring (classic pour puzzle).** Gladiators pray to Nemesis before the
sand. Her lamp is dark; the passage beyond her altar stays shut until the goddess takes
her libation. Altar inscription (journal `note_rite`): **"NEMESIS TAKES THE EVEN
MEASURE: IIII HEMINAE OF OIL, POURED IN ONE BREATH. NO MORE, NO LESS."** (glossed:
four).

**Vessels:** a bottomless **amphora** of temple oil; a bronze jug stamped **V** (five);
a clay jug stamped **III** (three). Neither jug has interior markings.

**Puzzle UI (`shrine_lamp`):** live state display of both jugs + buttons: Fill V ·
Fill III · Pour V→III · Pour III→V · Empty V · Empty III (back into the amphora — the
goddess minds waste, not tidiness) · Pour into the Lamp (from either jug). Pouring a jug
containing exactly 4 into the lamp solves (`shrine_riteDone`); pouring any other amount
fails with the diegetic line: *"The wick gutters and drowns — the basin tips the spurned
offering back into your jug. The goddess takes the even measure or none."* (jug state
explicitly preserved — the fail line SAYS the oil comes back). Any pour sequence
reaching 4 works (e.g. fill V, V→III leaves 2; empty III; 2→III; fill V; V→III takes 1,
leaves **4**).

**On solve:** the lamp blooms, Nemesis's **wheel emblem turns**, a niche grinds open:
**oil flask** (filled from the amphora, stoppered; taking it triggers Gus's
soak-the-rag line — see item chain) + the passage door beyond the altar unbars. Scene
shows lamp lit + niche open afterward.

**Also in scene from the start:** votive pile (→ **bronze mirror**, item), votive
tablets on the wall — **one hangs crooked, proud of the wall** (first examine says so;
behind it **token3**, net, letter I), and on the doorway plaster the **merchant's
charm** (journal `note_charm`, load-bearing for R4): *"The Sower's square — merchants
scratch it on doorposts against ill luck. It reads the same four ways. Only the first
line survives here:"* followed by a worn 5×5 grid with row 1 legible: **S A T O R**,
rows 2–5 effaced.

**Hotspots (9, incl. 3 flavor):** altar inscription · lamp (→ pour puzzle) · the two
jugs + amphora (one hotspot, flavor/desc — the puzzle modal owns the pouring) · votive
pile (mirror) · votive tablets (token3, crooked-tablet cue) · doorway charm
(`note_charm`) · niche/passage door (post-solve; contains oil flask) — flavor: statue
of Nemesis (Gus dislikes her: professional rivalry), gladiators' scratched prayers
(*"NEMESIS, LET IT BE QUICK OR LET IT BE HIM"*), the cold brazier.

**Exit:** passage door once `shrine_riteDone`; gate on bronze_mirror +
(oil_flask OR oiled_rag) + token3 + `note_charm` (Gus: *"The doorpost. Felix copied
that charm for a reason. Read it before we leave the light."* / for token3: *"The
votive wall. The crooked tablet. Felix was a carpenter; nothing he touched hung
straight by accident."*).

**Hints:** ① The goddess counts heminae; the jugs only know V and III. You may pour
between them as often as you like. ② Fill the five, pour it into the three: what stays
behind is two. The rest is bookkeeping. ③ Fill V, pour into III (2 left), empty III,
move the 2 across, refill V, top up III — the V holds exactly IIII. Pour.

### CHAMBER 4 — The Lanista's Tablinum (≈10 min, peak 1) — `id: 'tablinum'`, file `room4-tablinum.js`

**Mechanic: palindromic word square (the SATOR square — a real Roman charm).** The
lanista's strongroom door is a superstition made of bronze: a **5×5 lettered tile
frame** — set the Sower's square and it opens.

**Fixed/carved:** the middle row is riveted in place: **T E N E T**. Above the frame:
**"QVATTVOR VIIS LEGITVR"** — *it reads by four roads* (journal `note_fourways`, with
translation: same left-to-right, right-to-left, top-to-bottom, bottom-to-top).

**Clue sources (all journaled, all re-readable):**
- Row 1 = **SATOR**: the charm from R3 (`note_charm`).
- Row 2 = **AREPO**: the lanista's desk holds an old **wax tablet, re-waxed**. Using the
  held **strigil** on it shaves the wax cleanly: beneath, incised in the wood, an old
  hand: *"A R E P O — the Sower's own name, whatever it means. The square held while I
  scraped it. — F."* (journal `note_palimpsest`; flag `tablinum_waxScraped`). Without
  the strigil: your thumbnail gouges wax and reveals nothing; the room suggests a barber's
  patience or a bathhouse tool.
- Rows 4–5 derive: four-ways rule ⇒ row 4 = reverse(row 2) = **OPERA**, row 5 =
  reverse(row 1) = **ROTAS** (columns then agree automatically).

**Puzzle UI (`tablinum_square`):** 5×5 grid, row 3 fixed; a tray of letter tiles —
exactly the 20 needed (4×A, 4×O, 4×R, 2×S, 2×T, 2×E, 2×P) plus 3 decoys (C, V, M).
Click a tile, click a cell to place (click a placed tile to return it). "Turn the frame"
button checks all 25 cells against SATOR/AREPO/TENET/OPERA/ROTAS. Solve →
`tablinum_squareSolved`, strongroom swings open.

**Strongroom:** **winch key** (bronze square-socket key on a ring tagged *MACHINAE*) +
**token4** (griffin, letter I) + the **lanista's ledger** (journal `note_ledger`,
parchment-note.aged): *"FELIX, carpenter of beasts — rudis petitioned, DENIED. Too
useful below. // The old lion GVSTVS: crowd-shy, will not perform. To be destroyed when
the games close."* Two lines, both load-bearing for the story. Gus reads it over your
shoulder and says nothing, which is worse.

**Hotspots (7, incl. 3 flavor):** desk/palimpsest (strigil use) · square frame
(→ puzzle) · strongroom interior (post-solve: key + ledger + token4) · corridor door ·
— flavor: wall fresco of the amphitheatre in cutaway (your own drawings, stolen
credit), abacus, scroll shelves.

**Scene:** cramped office; desk with tablets and abacus; strongroom door with the letter
frame; shelves of scrolls; strongbox. Scene states: wax scraped, strongroom open.

**hintContext:** `s => s.flags.tablinum_waxScraped ? 'square' : 'wax'`.
**Hints (`wax`):** ① The door wants the doorpost charm from the shrine — all five lines
of it. You have one line; the desk hides another, under new wax. ② Old tablets get
re-waxed, not erased. Shave the wax with something a bathhouse would lend you. ③ Use
the strigil on the desk tablet: A-R-E-P-O, the second line.
**Hints (`square`):** ① You hold the first two lines; the frame fixes the third. The
plaque above tells you the rest. ② It reads the same four ways: the last row is the
first backward, the fourth is the second backward. ③ SATOR / AREPO / TENET / OPERA /
ROTAS.

### CHAMBER 5 — The Hypogeum (≈8 min, breather with teeth) — `id: 'hypogeum'`, file `room5-hypogeum.js`

**Mechanic: guided maze traversal (relative directions).** The beast level: a lattice of
cage-tunnels under the arena floor, dark except knife-blades of light through the
planking. The stair to the winch gallery is somewhere in the dark; wrong turnings hold
things that are not stairs.

**Felix's chalk plan:** a niche wall by the Lion Gate, chalk long faded into shadow —
holding the **bronze mirror** on the niche hotspot throws a light-shaft onto it
(`hypogeum_planSeen`, journal `note_plan`; the chalk stays visibly rendered in the
scene afterward):
*"FROM THE LION GATE, FACING THE DARK: PERGE II · DEXTRA · PERGE II · SINISTRA ·
PERGE I · DEXTRA · PERGE I · THE STAIR. (Perge — onward. Dextra — turn to the sword
hand. Sinistra — turn to the shield hand.)"* Without the mirror, the niche reads as
smudged chalk; the room notes the light-shaft falls just beside it.

**The maze (4×4 grid, cols A–D west→east, rows 1–4 south→north; enter at A1 facing
north):**
- Open passages: A1↔A2, A2↔A3, A3↔A4, A3↔B3, B3↔C3, C3↔C2, C3↔D3, C3↔C4, C4↔B4,
  C4↔D4, A1↔B1. All other cell borders are walls. Cells **B2, C1, D1, D2 are solid
  rubble from the fire** — rendered filled from the start (not fog), so the map never
  implies hidden content there.
- Goal: **D4** (the stair). True path per the plan: A1→A2→A3 (perge II) · turn E →
  B3→C3 (perge II) · turn N → C4 (perge I) · turn E → D4 (perge I). Verified against
  the passage list.
- **Dens (step in → snarl/scramble, reset to A1, no time cost):** B1 (the wolf pens),
  D3 (the fallen vault — something large breathing).
- Dead ends (flavor, harmless): A4 (empty bear cage), C2 (flooded footing), B4 (old
  feed store).

**Puzzle UI (`hypogeum_maze`):** top-down plan view; visited cells stay revealed
**across den resets**; current position + facing marker; the plan's instruction text is
shown inside the modal once `note_plan` is journaled. Three buttons: **Sinistra**
(turn left **in place** — no step) · **Perge** (one step ahead) · **Dextra** (turn
right **in place** — no step). Only Perge moves. Blocked moves thud (no reset); dens
reset position to A1 with a line (revealed map persists). Reaching D4 solves
(`hypogeum_mazeDone`) — the stair door unbars. Puzzle reopenable; solved state persists.

**Gus's chamber:** his old cage stands open, gate long rusted back. Inside (hotspot):
a name board — **GVSTVS**, a keeper's tally of years, and wedged under the water trough
**token5** (palm frond, letter O). Examining the cage: Felix's carpentry, a sleeping
shelf built too kindly for regulation. Gus waits outside this one; he does not go in.

**Items:** **crank handle** — in the wreck of a broken capstan (hotspot).

**Scene:** timber-and-stone lattice, cage bars, the underside of the arena floor as
ceiling with sand sifting through (animated motes), light knife-blades, the Lion Gate,
the niche (chalk plan renders once seen), capstan wreck, Gus's cage, the (barred→open)
stair door.

**Hotspots (8, incl. 3 flavor):** niche (mirror use → plan) · Lion Gate / maze mouth
(→ maze puzzle) · Gus's cage (token5 + name board) · capstan wreck (crank handle) ·
stair door (exit) — flavor: lift machinery overhead (your own designs — you check the
joints out of habit), claw-grooves in an oak post taller than a man, the old feed
trough.

**Exit:** stair door once `hypogeum_mazeDone`; gate on crank_handle + token5 +
`note_plan`.

**hintContext:** `s => s.flags.hypogeum_planSeen ? 'maze' : 'plan'`.
**Hints (`plan`):** ① Felix chalked the road, but chalk fades — the niche by the Lion
Gate wants more light than the planks let down. ② Something in your loculus throws
light. Hold it, then touch the niche. ③ Hold the bronze mirror on the niche: it
catches the light-shaft and the plan reads clean.
**Hints (`maze`):** ① Dextra is your sword hand, sinistra your shield hand, and you
start facing the dark — north. The turns do not move you; only Perge moves you. ②
Follow the plan exactly, one instruction at a time; the wrong rooms are occupied, but
the map remembers where you have been. ③ Onward two. Turn right, onward two. Turn
left, onward one. Turn right, onward one. The stair is the far corner.

### CHAMBER 6 — The Great Winch (≈9 min, peak 2) — `id: 'winch'`, file `room6-winch.js`

**Mechanic: mechanical-advantage assembly (drum × tackle ratio — NOT a weight/subset
puzzle; Starfall owns that).** The winch gallery: the big geared capstan that hauls the
western cage-lift. The lift platform is your road up to the gate corridor — for you AND
a lion — and its rigging was stripped in the fire.

**Setup steps (both required before the rigging matters):**
1. The windlass **brake** is locked — bronze square socket: **winch key** (flag
   `winch_brakeFree`; key stays seated, renders in scene, leaves inventory).
2. The capstan bars were burned — the **crank handle** seats in the drum socket (flag
   `winch_crankSet`; same treatment).

**The rigging.** Felix's carpentry note, cut into the main beam (journal
`note_mechanica`): **"THE WEST LIFT ASKS TWELVE MEN. A MAN AT THE CRANK IS ONE. THE
GEARED DRUM MULTIPLIES HIM BY ITS MARK; THE BLOCK MULTIPLIES AGAIN BY ITS SHEAVES.
DRUM TIMES BLOCK MUST MAKE THE TWELVE — NO LESS, OR SHE WILL NOT RISE; NO MORE, FOR
THE ROPE IS CUT TO HER LENGTH."**

- **Drum shelf:** three geared drums, marked **II** (two) · **III** (three) · **V**
  (five). Examining journals each mark glossed in words.
- **Block chest:** three pulley blocks with visibly countable sheaves: **I** (single) ·
  **II** (double) · **IIII** (four-sheave). Examine text counts them aloud.

*Unique solution:* need drum × block = **12** exactly. Options: 2×{1,2,4}={2,4,8};
3×{1,2,4}={3,6,**12** ✓}; 5×{1,2,4}={5,10,20}. Only **drum III + four-sheave block**.

**Puzzle UI (`winch_tackle`):** two mounting slots (drum spindle, rope block); click a
drum/block to mount it (mounted choice renders); "Heave" button. If brake or crank not
set, the button answers diegetically with what is missing. Wrong combo: too weak — the
platform shudders and settles (*"She asks twelve men. You have given her
&lt;product&gt;."* — no, do NOT print the product; say *"too few hands"* for under,
*"the rope pays out and dangles, spent, a man's height short"* for over). Exact 12 →
`winch_raised`: the drum turns, the platform grinds up, the gallery's upper door opens.

**Token:** **token6** (fish-crest, letter S) — down in the **grease pit** (visible
glint from the start; stays until journaled).

**Scene:** double-height gallery; the great drum spindle and capstan; ropes rising into
darkness; the cage-lift platform; drum shelf; block chest; the pit; a high slot of
arena light. States: brake freed (key seated), crank seated, drum/block mounted,
raised (platform up, upper door open, ropes taut). Flavor: fire scars on the beams
(the fire that closed the western works — your report, ignored), a wall of tally-chalk
from bored winchmen.

**Hotspots (9, incl. 3 flavor):** brake (winch_key use) · capstan socket (crank_handle
use) · beam note (`note_mechanica`) · drum shelf (examine/journal marks) · block chest
(examine/journal sheaves) · rigging slots (→ mount/heave puzzle) · grease pit (token6)
· upper door / platform (exit) — flavor: fire-scarred beams, winchmen's tally chalk,
the rope shaft rising into dark.

**Exit:** ride the platform / upper door once `winch_raised`; gate on token6.

**hintContext:** `s => (s.flags.winch_brakeFree && s.flags.winch_crankSet) ? 'ratio' : 'setup'`.
**Hints (`setup`):** ① She needs her brake freed and a bar to turn before any rigging
matters — a key from an office, a handle from a wreck. ② The bronze key's square end
matches the brake socket; the crank seats in the capstan. ③ Use the winch key on the
brake, the crank handle on the capstan socket.
**Hints (`ratio`):** ① Felix cut the lift's arithmetic into the beam: twelve men, one
crank. The drum and the block do the multiplying. ② Drum's mark times block's sheaves
— exactly XII, no less, no more. ③ Mount the III drum and the four-sheave block:
three times four is twelve. Heave.

### CHAMBER 7 — The Porta Sanavivaria (≈9 min, finale) — `id: 'porta'`, file `room7-porta.js`

**The gate corridor.** Above ground at last: the walled passage behind the arena's
western wall. At its end, the old **Gate of Life** — oak, iron-bound, bricked around,
forgotten since the fire. Daylight in the seams. Crowd-roar through the stone.

**The gate hotspot is present and clickable from room entry.** Clicking it enumerates
the remaining refusals diegetically (*"The hinge weeps rust. The bar sleeps in its
seat. The wicket lock waits for a word."*) — a free, in-world progress checklist.

**Phase 1 — the way (three item beats, any discovery order):**
1. **The seized hinge** — weeping rust. Held **oiled_rag** (combo of wool rag + sacred
   oil; if the player hasn't combined them, examining the hinge says a dry rag alone
   will just polish the rust, and oil alone runs off — something should hold the oil
   against the pin) → `porta_hingeOiled` (rag consumed).
2. **The bar seat** — the great bar is rusted into its seat. Held **dolabra** pries it,
   creaking up on end → `porta_barPried`.
3. **The half-bricked arch** (side alcove) — dolabra again, loose brick by loose brick
   → `porta_archOpen`. Inside: **Felix**. Bones in a carpenter's apron, his tools
   folded, a finished **rudis** (item, `rudis`), and his last tablet (journal
   `note_felix`, wax-tablet): *"I could have gone in September. The lion could not —
   they chain him above all season, and a door is no use to a friend on the wrong side
   of it. So I winter here. If the fever wins and you are reading this: the lock is
   mine, the word is the one the crowd shouts when a life is to be spared. Take my
   sword — I earned it, even if no lanista signed it. And take the lion. He answers to
   Gus."* Taking the rudis: `porta_rudisTaken`.

**Phase 2 — the word:** the gate's wicket carries Felix's own **six-ring letter-lock**,
each ring cycling the twelve letters `A C E F I L M N O R S T`. Carved above the
wicket, the **procession frieze** — six marchers, left to right: spear-man · net-man ·
egg-helm · fish-crest · griffin-crest · palm-bearer — with Felix's scratched line
beneath: **"AS THEY MARCH, THEY SPEAK."** (journal `note_frieze`, listing the order in
words). Match the tesserae emblems to the marchers → **M I S S I O**. Setting it
(`porta_wordSet`) frees the wicket mechanism with a sound like a verdict.

**Final beat:** the gate hotspot, once hinge oiled + bar pried + word set: if
`porta_rudisTaken` or `note_felix` is missing, Gus plants himself in the doorway —
*"The alcove first. Both of us walked in here because of what is in that alcove."*
Then: the doors swing into white daylight and roar — `completeRoom()` → victory screen
(MISSIO — GRANTED).

**Scene:** torch-dark corridor to a huge double gate rimmed in daylight; the wicket +
rings; the frieze above; the bar; hinges; the bricked arch (→ open, lamplit alcove);
fallen votive garlands (palm fronds among them — echoing token5's emblem). States:
hinge shining, bar upright, arch open, rudis gone, word set (rings show it), gate
open at the very end.

**Hotspots (9, incl. 2 flavor):** the gate (always present — checklist + final open) ·
hinge (oiled_rag use) · bar seat (dolabra use) · wicket rings (→ word puzzle) · frieze
(`note_frieze`) · bricked arch (dolabra use) · alcove (post-open: rudis + `note_felix`)
— flavor: spy-slit view of the sand (the show mid-roar — what you are not dying in
today), the fallen garlands.

**hintContext:**
`s => !(s.flags.porta_hingeOiled && s.flags.porta_barPried && s.flags.porta_archOpen) ? 'way' : !s.flags.porta_wordSet ? 'word' : 'felix'`.
**Hints (`way`):** ① Three refusals: a hinge that wants oil that stays put, a bar
rusted to its seat, and bricks laid in a hurry a generation ago. Your loculus answers
all three. ② Soak the rag in the sacred oil — hold the one, touch the other, in your
loculus. The dolabra was made for the bar and the bricks. ③ Oiled rag on the hinge,
dolabra on the bar, dolabra on the arch.
**Hints (`word`):** ① Six rings, six tesserae in your tablets — and six marchers
carved above the wicket. ② Match each tessera's emblem to its marcher, left to right.
The parade gives the order. ③ M-I-S-S-I-O.
**Hints (`felix`):** ① The alcove is why this gate exists. Gus will not leave without
what it holds. ② Read Felix's tablet. Take the sword he earned. ③ Take the rudis from
the alcove, then open the gate — the word is already set.

---

## 5. Difficulty & pacing

| # | Chamber | Mechanic | Difficulty | Est. min |
|---|---------|----------|------------|----------|
| 1 | The Carcer | acrostic + item-use tutorial | ★☆☆☆☆ | 5 |
| 2 | The Armamentarium | attribute logic (mixed evidence) | ★★☆☆☆ | 7 |
| 3 | The Shrine of Nemesis | jug measuring | ★★★☆☆ | 7 |
| 4 | The Lanista's Tablinum | palindromic word square | ★★★★☆ peak 1 | 10 |
| 5 | The Hypogeum | guided maze traversal | ★★★☆☆ breather-with-teeth | 8 |
| 6 | The Great Winch | mechanical-advantage assembly | ★★★★☆ peak 2 | 9 |
| 7 | The Gate of Life | item synthesis + frieze-matched meta | ★★★☆☆ | 9 |
| | | | **Total** | **55** |

Estimates are **hint-free solver ceilings, not medians** — a first-time player who
reads the story beats and buys a hint or two should still clear the gate with minutes
to spare; the 5-minute margin plus the generous per-room padding is deliberate slack
for den resets, jug fumbling, and Felix's tablets, which are the point.

Fairness rules identical to Rooms I–III: exit gates enforce tesserae and forward items;
wrong answers cost nothing; every clue journals on first examine and stays re-readable;
the finale is solvable entirely from the journal.
