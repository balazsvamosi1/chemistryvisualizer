# 3D Chemistry Lab — Beta 0.2103

A modular browser-based chemistry laboratory and ten-level Chemistry Quest educational game. Includes HU/DE/EN support, periodic table, isotope browser, materials, reaction and physics labs, and 2D/3D molecule tools. The sections below retain earlier release notes.

## Version numbering

- **First release:** `0.01`.
- **Current release:** `0.2103`. Future Chemistry Lab public versions will remain below `1.0`.
- **Historical convention:** old `A.B.C` release labels become `0.ABBC`, where A is one digit, B is zero-padded to two digits, and C is one digit. Examples: `1.9.7 → 0.1097`, `2.9.8 → 0.2098`, `2.10.0 → 0.2100`, `2.10.2 → 0.2102`. If C was omitted, use zero: `1.5 → 0.1050`. The original `0.01` is preserved unchanged.
- **Next version:** `0.2104`; after `0.2109`, continue with `0.2110`. Each final patch digit runs from 0 to 9, ensuring an ordered sequence.
- Older technical asset cache keys (such as `?v=2.1.7`) and third-party dependency/API versions are **not** changed: they are not release labels.

## Beta 0.2103 — Arcade maze and renewable resources (2026-11-04)

- Replaced random tree-like levels with six distinct, connected, Pac-Man-inspired corridor maps featuring loops, junctions, a central hub and limited breakable blocks.
- Both correctly and incorrectly attempted atom pickups now return approximately 8–12 seconds later at a **different, reachable corridor**, rather than the old location. Wrong first answers still grant no atom.
- The ion generator also distributes additional atoms around the maze rather than clustering them next to its center.
- Stage five now regenerates the fictional ★ activator on a different reachable corridor after a wasted Al + ★ charge, eliminating the unrecoverable resource softlock.
- Arcade-style glowing wall contours improve visual readability. Original Apache-2.0 browser-only gameplay and GitHub Pages support remain unchanged.
- 10 new regression tests added to `tests/reaction-maze-arcade.test.cjs`; all 51 targeted Reaction Maze/P0/P1 tests passed in a JavaScript test environment. Live mobile/browser E2E validation remains outstanding.

## Beta 0.2102 — P0 answer-label hotfix (2026-11-04)

- **P0 fixed:** Reaction Maze now localizes C, Cl and S quiz choices using the same `optionOrder` shuffle permutation as the underlying answer checker. A displayed correct chemistry term can no longer be rejected merely because its translated label was shown at a different index; incorrect labels do not award atoms.
- New UI-level regression suite `tests/reaction-maze-displayed-answers.test.cjs`: 9 affected question-language combinations × 24 simulated interactions = 216 correct/incorrect rendered-answer click checks. All passed in the JavaScript DOM-mock test environment.
- Keeps the first-attempt-only atom collection rule unchanged and retains the original Apache-2.0 browser-only distribution. Bumps the Reaction Maze UI script cache key for GitHub Pages.
- Full Android/browser end-to-end validation remains outstanding.

## Beta 0.2101 — P1 gameplay and assessment fixes (2026-11-04)

- **Reaction Maze:** Catalyst only accelerates player movement / charge synthesis timing; enemy patrol speed now depends solely on enemy type and temporary enemy-specific boosts.
- **Reaction Maze quizzes:** 8–9 questions per element for H, O, C, Na, Cl, Al, K, S, Ca and Fe, with varied chemistry facts (atomic number, element symbol, periodic position, isotope, next element, electrons). Questions rotate without repeating until the bank is exhausted; each presentation shuffles the four answer positions. Wrong first answers still discard the atom permanently at that pickup location. Replenishment through the generator remains available.
- **Chemistry Quest:** Health reaching zero now creates a persistent Game Over state; gameplay and crafting stop until the existing level-restart button is used. Previously the player immediately regenerated with three HP. The game-over overlay is localized to HU/DE/EN.
- **Common educational assessment:** New `assets/js/game-assessment.js` (original Apache-2.0) tracks right/wrong quiz answers, successful/unsuccessful molecular synthesis, reaction problem attempts, cleared stages and defeats across Chemistry Quest, Reaction Maze and Academy Element Hunt. A responsive summary lives in the Chemistry Academy and is kept in the browser's `localStorage` when permitted. Assessment is descriptive, not an automatically assigned school grade. It does not transmit learner information to external services.
- **Testing:** Existing 25 Reaction Maze and 24 Chemistry Quest scripted regression checks passed in a JavaScript test environment, plus 7 new P1 checks. Live mobile/browser end-to-end checks remain outstanding.
- **Distribution:** The game remains static and GitHub Pages compatible, without any new MIT/BSD/GPL/AGPL dependencies. No external libraries or network requests are needed for the assessment.

## Beta 0.2100 — Reaction Maze / Reakció-labirintus (2026-11-04)

A second independent game has been added under **Learn & Play → Reaction Maze**. The original ten-level **Chemistry Quest remains unchanged**.

- Six top-down, grid-based tactical maze stages with walls, destructible obstacles, a central replenishing ion generator, moving enemies, an exit and a separately controlled chemistry robot.
- Atomic pickup uses a four-choice chemistry quiz. **Only a correct FIRST answer grants the atom; an incorrect answer removes that pickup permanently.** The generator later emits fresh opportunities to avoid softlocking the game.
- Recipe synthesis consumes exact inventory ratios and creates timed charges; cross-shaped beams stop at solid walls, destroy fragile walls, can trigger other charges and damage the player. Charges are limited by the multi-flask upgrade.
- Countermeasure stages: H₂O / Fire Eater; CO₂ / Spark Golem; NaOH / Acid Slime; HCl / Alkaline Crystal; Al + ★ fictional activator / Rust Colossus; K₂S / Heavy-metal Shade.
- Power-ups: range, multi-flask capacity, catalyst and shield. Reactor capacity is twelve atoms; unwanted atoms can be discarded. Wet tiles and discarding sodium on them have a game-specific adverse effect.
- Keyboard: arrow keys or WASD to move, C to synthesize, Space/E to place a charge, 1–6 to select unlocked recipes, P to discard the selected atom. Touch-screen arrow buttons and swipe on the board are supported.
- HU / DE / EN UI, with translated scientific multiple-choice items where needed.
- Scientific caveats: blast patterns and fictional enemy effects are a game model, not practical chemical experiments. The level-five ★ activator is fictional, and the game intentionally gives **no genuine thermite recipe**. Potassium sulfide is K₂S rather than KS; HCl is hydrogen chloride, with hydrochloric acid arising in water.
- Apache-2.0 original JavaScript/CSS, **no MIT/BSD-3/GPL/LGPL/AGPL dependencies** needed; browser-only execution remains compatible with GitHub Pages.
- Tests: `node --test tests/reaction-maze.test.cjs` — 25 core assertions verified in a JavaScript execution environment. Full visual-browser/mobile testing remains outstanding.

## Current release

**Beta 0.2103** is the current Chemistry Lab release (2026-11-04), including Chemistry Quest, Reaction Maze, Academy Element Hunt and the P0 localized quiz-answer hotfix. The core games and laboratories run directly on **GitHub Pages** without a backend. An optional local Python server (`python3 server.py`) supports backend-dependent scientific data features. The release notes below document the state of each historical version.

## Start

```sh
python3 server.py
```

Then open http://localhost:8000/ . A local HTTP server is required to resolve the modular files reliably. No dependency installation or internet connection is necessary.

## Tests

```sh
node --test tests/*.test.cjs
node --check assets/js/app-core.js
node --check assets/js/chemistry-ui.js
node --check assets/js/viewer-3d.js
node --check assets/js/chemistry-engine.js
node --check assets/js/engine-ui.js
```

## What is new

- CSS and JavaScript moved from the monolith to independent assets, without changing the appearance.
- `chemistry-engine.js`: pure, independently testable API (simple valence diagnostics, bond character, educational VSEPR predictions, exact reference coordinates for selected molecules, opt-in H suggestions).
- Existing 3D viewer queries the engine for reference structures before using its old approximate geometry fallback.
- Molecular editor gains a read-only analysis panel and opt-in H completion for common neutral C/N/O structures.
- Original 118-element dataset also exported to `assets/data/elements.json` for future migrations; the embedded boot copy is retained for compatibility.

## Scientific limitations

VSEPR is an approximate educational model, not calculated electron density or a general geometry optimizer. Electronegativity differences alone do not uniquely determine bonding. Ionic/metallic lattice examples are illustrative. Hydrogen completion works only for a deliberately limited set of common neutral cases and does not account for formal charges, radicals, resonance or aromaticity.

## External dependencies

**None added** in this milestone. A third-party repo's top-level MIT license was verified, but no source files from that repo are included because their provenance and transitive dependencies could not be audited in this runtime. Later integration of Wartets/Molecule-Builder and other libraries must pass a file-level MIT/Apache-2.0 license audit. The existing source inherited from Beta 0.1030 has not been independently licensed by its author; do not imply that upstream components are automatically relicensed.


## Beta 0.1050 — Molecular Physics Lab

The original application remains intact. A new **Molecular Physics** tab is added. Run `python3 server.py`, open `http://127.0.0.1:8000`, then open that tab and press **12 referenciaanyag letöltése**. Internet access is needed **only for first-time synchronization**. The PubChem responses are cached in `cache/pubchem/*.json` and subsequently served offline. Individual additional English chemical names can be fetched by editing the built-in list or using the API `POST /api/physics/sync` with `{"names":["benzene"]}`. The UI's name field currently **reads already cached records only**, not arbitrary internet queries.

**Model weights**: explicit optional `MIT MACE-MP-0b2-small` button downloads an allowlisted checkpoint to `cache/models/`. MACE inference and real stability/pressure/temperature computations are **not implemented**. MACE-MP is designed for materials and not universally valid for isolated molecules. No inference libraries or problematic licensed transitive dependencies are bundled.

The PubChem API gives reference properties and 2D/3D coordinates, but not proof of stability. No fabricated energies are returned. The backend binds to `127.0.0.1`, does not execute remote code, and limits cache requests to allowlisted API hosts. Cached public data may have record-specific third-party reuse restrictions.

Check with `python3 -m unittest discover -s tests -p 'test_*.py'`.


## Beta 0.1060 — Spekulatív fizika

A separate top-level **Spekulatív fizika** tab contains **Hard**, **Extreme**, and **Soft / Sandbox** submodes. Existing tabs and the Physics Lab are retained unchanged.

- `assets/data/speculative-models.json` is an editable model catalog. Parameters are educational approximations, not calculated reference binding energies.
- The plot evaluates a Lennard–Jones pair potential and, in Sandbox mode only, an optional hypothetical Gaussian perturbation.
- Temperature and pressure are adjustable but **do not** currently drive thermodynamic, molecular dynamics or phase stability calculations. They are displayed as scenario inputs.
- Save exports a JSON experiment file containing inputs, results, and a model-only warning.
- A minimum on the pair potential is **not** evidence that a novel material can exist.
- No new third-party package or model is bundled. The MIT/Apache-only code policy remains intact.


## Beta 0.1070 — Scientific atom visualization

- Existing Bohr, Quantum, isotope and chemistry features remain unchanged.
- New **Scientific** atom view shows element-colored illustrative orbit/shell motifs, curated uses, selected visible atomic emission lines, and quick element navigation.
- Spectral data are a small, manually curated set of approximate wavelengths for H, He, Li, Ne, Na and Hg. Based on standard atomic emission reference lines; consult the [NIST Atomic Spectra Database](https://physics.nist.gov/asd) for authoritative transitions, accuracy, intensity, and excitation conditions.
- **No spectrum is invented** for elements without curated lines. The viewer is **not** a solution of the many-electron Schrödinger equation and the glowing arcs are not physical electron trajectories.
- No external images or dependencies were added.


## Beta 0.1080: Scientific wavefunctions + NIST cache

Scientific atom panel now includes orbital electron-probability visualization for all 118 elements. Hydrogen orbitals use analytical nonrelativistic hydrogenic shapes; all other neutral atoms use a **screened hydrogenic approximation**, not a numerical many-electron wavefunction. Electron configurations include common corrections, but heavy elements may require relativistic/experimental configuration updates. Rotation of sampled density is a camera effect, not electrons on trajectories.

NIST ASD neutral-atom **visible** line data can be fetched on demand with the `↻ NIST` button and stored in `cache/nist/NNN.json`. The UI never invents missing lines. The NIST endpoint can change: parser errors result in `unverified_empty`, not claims of zero spectral lines. Example: `curl -X POST http://127.0.0.1:8000/api/nist/sync -H 'Content-Type: application/json' -d '{"z":11}'`. Inspect `GET /api/nist/status` and `GET /api/nist/element?z=11`. Not every atom has independently verified NIST lines cached until successfully fetched. NIST source: https://physics.nist.gov/asd . Verify data reuse terms before redistributing cached datasets.

Cache all 118 neutral-atom visible spectra (internet connection required, requests spaced apart): `python3 -m physics.nist --all --delay 2`. Every response is recorded with a status; unverified or failed results are **not** presented as valid spectra.


## Beta 0.1090 — English language + Chemistry Quest prototype

The original scientific tabs remain in place. A third **EN** button adds English element names for all 118 elements, the major navigation labels and core atomic/molecule controls. The Chemistry Quest game is fully localized in HU/DE/EN. Some inherited deep scientific and material explanatory text still falls back to German; full English editorial translation is a follow-up task.

**Chemistry Quest** is a playable self-contained 16-bit-inspired Canvas platform prototype: walk (A/D or left/right arrows), jump (W/Space/up), collect two H and one O atoms, craft H₂O (E or touch button), answer an atomic-number challenge and unlock the cooled lab door. Touch-screen movement buttons are provided. The game uses the existing ChemistryEngine for a simplified valence check. It uses no commercial assets or external engine. Crafting atoms is a **game abstraction**, not a chemically valid mechanism for synthesizing water.

Project assets added: `assets/js/quest.js` (MIT), `assets/js/english.js` (localization extension), `assets/css/quest.css`. No external dependencies were added. Game progress completion is stored in browser localStorage when available.

Launch with `python3 server.py` and visit `http://127.0.0.1:8000`. Test syntax with `node --check assets/js/quest.js` and `node --check assets/js/english.js`.


## Chemistry Quest 0.1092 — jump and progression fixes

- Increased jump impulse from 540 to 600 px/s; gravitational acceleration remains 950 px/s².
- Added jump buffering (0.20 s) and coyote time (0.13 s).
- The mid-level oxygen quiz is now shown above the canvas and **does not pause** game movement.
- Select the answer by clicking/tapping the buttons; the correct oxygen atomic number is 8.
- E builds H₂O using two collected H atoms and one O atom; next to the fire enemy, E splashes the water.
- Existing scientific modules and UI preserved.

## Chemistry Quest 0.1093 — two-level update

- Fixed jump collision with raised platforms: ledges are one-way, allowing jumps from below and landing from above.
- Jump input buffering and coyote time prevent missed jumps; Space/W/Up or touch Jump.
- Level 1: collect 2 H + 1 O, craft H₂O, solve oxygen puzzle, use E on the fire creature, reach the exit.
- Level 2: collect 1 C + 2 O, craft CO₂, use E near a moving fire robot, reach the exit.
- Complete Level 1 to reveal **Next level**; restart resets current level.
- The water/CO₂ fire suppression is a game mechanic, not a general guarantee for real-world fires; CO₂ extinguishers are unsuitable for some fire classes and situations.


## Beta 0.1097 — P0 Stability Fix

- Fixed lanthanide/actinide metal category aliases (`lanth`, `act`).
- Ammonia (NH3) is a molecular material, not an ionic lattice.
- Protected all concurrent `SYNC` state updates and reads with a dedicated state lock; returned snapshots copy the mutable error list.
- Reduced idle CPU/GPU pressure by throttling canvas redraws in hidden and inactive tabs and capping active 2D/3D animation loops. Animation detail is reduced versus the previous release.
- Added a deterministic Chemistry Quest test interface (`ChemQuest.test`) for browser automation. It is a test hook, not a game mechanic.
- Added concurrency, dataset and source regression tests. Run `python3 -m unittest discover -s tests -p 'test_*.py'` and `node --test tests/*.test.cjs`.
- Browser E2E test script in the distribution was attempted but blocked by the current runtime's localhost navigation restrictions; do not treat the game's integration flow as verified.
- Scope: P0 corrections only; no redesign or feature deletion.


## Beta 0.2000 — Chemistry Quest: 10 levels

The Chemistry Quest is now a ten-stage educational platform game. Controls: A/D or arrows to move, Space/W to jump, **C** to craft with a recipe dropdown, **E** to launch the selected reagent, **Q/Tab** to cycle weapons, **1–9/0** to choose an arsenal slot. Atom pickups pause the game until a correctly answered randomized middle-school chemistry question. Ammo persists between stages; level 10 needs carried-over HCl and NaOH and freshly crafted CH4 plus two O2 charges. Finish a stage and click Next Level.

This is an educational model, **not** an instruction for conducting reactions or using real chemicals as weapons. NaCl, NaOH and Ca(OH)2 are ionic substances, not discrete covalent molecules. H2 reduction of rust needs suitable reaction conditions; HCl acid chemistry requires an aqueous solution; methane combustion needs an oxidizer and ignition; some obstacle outcomes are deliberately fictional.

Smoke test: `node --test tests/*.test.cjs && python3 -m unittest discover -s tests -p 'test_*.py'`.

### Implementation scope and limitations (v0.2000)
The 10 stages have distinct target types, recipes, reaction rules and learning facts, but share a common retro level layout rather than ten individually illustrated level maps. The levels 3, 8, and 9 include lightweight additional movement mechanics (hydrogen boost, ghost platform, bubble pad). Complex chemistry, precise quantities, and actual combustion safety are outside the simulation; the rules are didactic abstractions. For stage 2 a water charge is provided so the player can extinguish the opening crate; stage 10 starts with one HCl and NaOH each to prevent an unsolvable boss. The projectile misses are refunded.


## Beta 0.2001: GitHub Ready + Craft recovery

- `cache` downloads, local model weights and Python bytecode are excluded by `.gitignore`. Files already tracked by git require `git rm --cached` to untrack.
- GitHub Actions checks all JavaScript syntax and runs Node and Python tests on push/PR.
- Optional GitHub Pages deployment: Settings → Pages → Deploy from branch → main / (root). The browser-only sections and Chemistry Quest work without the Python backend; the Physics Lab and NIST synchronization explicitly explain they need `python3 server.py`.
- Chemistry Quest: renewable element pickup sources on every level prevent softlocks after failed shots or crafting several reagents. Older unlocked recipes can also be crafted in later stages.
- Atom quiz still pauses movement and grants atoms only after a correct response. Craft: C, use: E, switch: Q/Tab.
- GitHub Pages provides no PubChem/NIST downloads, physics model inference, or Python API. Run locally for those.


## Beta 0.2002 — Quest obstacles and chemical effects

- Restores two visible, jumpable damage hazards per level, with terrain-specific hazard types (sparks, steam, acidic pools, ice, spores, etc.). Hazard contact removes health with an invulnerability interval.
- Eleven crafted reagents have their own projectile visual profiles: water drops, CO₂ cloud, hydrogen bubbles, alkaline droplets, acid mist, ammonia vapour, salt crystals, limewater spray, peroxide foam, methane flame, oxygen bubbles. These are illustrations, not physical computational-fluid simulations.
- Successful reaction-matrix hits create short-lived particle effects and contextual reaction text in HU/DE/EN for selected interactions. Chemical prerequisites are not silently represented as spontaneous reactions (e.g. hydrogen reduction needs heat, methane combustion needs ignition and oxygen).
- Added `tests/quest_visuals.test.cjs` for obstacles, damage, unique projectile profiles and hit effects.
- Run `node --test tests/*.test.cjs` and `python3 -m unittest discover -s tests -p 'test_*.py'`.

This is a gameplay update, not a guarantee of laboratory-grade chemistry or fire-safety guidance.


## Beta 0.2003 — Chemistry Quest Arsenal HUD

The molecule arsenal is displayed above the game canvas. Unlocked recipes have selectable slots with formula, available charge count, and active selection. Select by mouse/touch or keyboard (1–9, 0, Q/Tab). The additional O₂ slot can be selected by click or Q/Tab cycling. C opens crafting and E fires the selected molecule. Slots update after crafting, shooting, changing level and switching weapons. On narrow screens, the weapon bar scrolls horizontally.
\n\n## Open-source maintenance\n\nThe repository includes `.gitignore` for local scientific-data caches, Python bytecode, and editor files. Ignore rules do not automatically untrack files previously committed; use `git rm --cached` when required. `.github/workflows/ci.yml` runs JS syntax checks, Node test suites, Python compilation, and Python unit tests. GitHub Pages is not automatically enabled.\n

## Beta 0.2010 — Interactive bond construction

In Chemistry Quest, levels 1–2 retain the simpler recipe-based crafting. From level 3, covalent recipes require the player to select pairs of atoms and their bond order (single/double/triple) in a new interactive workbench. The resulting labelled molecular graph is compared with the expected structure, treating equivalent atoms as interchangeable. Incorrect structures do not consume atom resources. Ionic compounds remain formula-unit recipes instead of misleading covalent models. This is a structural teaching model, not a realistic chemical synthesis simulator.


## Beta 0.2011 — Three-language Chemistry Quest

All ten Quest stages now provide Hungarian, German and English scientific stage facts, target names, messages, crafting interface, ammunition controls and science explanations. Every collectible element (H, O, C, N, Na, Cl, Ca, S, Mg, Cu, Ag) now has seven quiz question types with translated prompts and, where applicable, answer choices. Quiz state and wrong-answer disabling survive language changes. The game's language follows the existing HU/DE/EN controls; no additional language switch is required. Run `node --test tests/*.test.cjs` for localization regressions.


## Beta 0.2012 — Shared Reaction Engine & Quest Equation Workbench

The existing five laboratory balance exercises now use the reusable `assets/js/reaction-engine.js` module. The module provides explicitly curated reaction models, stoichiometric atom/charge conservation checks, and composition data for additional reactions. It is loaded before `app-core.js` and `quest.js`.

From Quest level 4, a successful chemical hit on an applicable enemy opens a HU/DE/EN equation challenge: select reactants, select products, and supply stoichiometric coefficients. A correct equation allows the target to be defeated; incorrect choices do not silently pass. Physical interactions such as fire extinguishing do not incorrectly require chemical equations. Some reactions have additional physical conditions and remain educational simplifications.

Check `node --test tests/*.test.cjs`, including `tests/reaction_engine.test.cjs`; the game and laboratory still require browser-level integration verification.


## Beta 0.2013 — Escape the Burning Laboratory

Chemistry Quest is now an escape adventure set in a laboratory after a fire breaks out. Its ten stages are numbered 1-1 to 1-5 and 2-1 to 2-5, with localized mission text in HU/DE/EN.

From level four, crafting ammunition requires a correctly balanced, curated preparation reaction in addition to molecular bonding where relevant. This is a teaching model, not a safe or literal synthesis method. The shared ReactionEngine supports all eleven ammo recipes.

From the fifth stage, smaller chemical enemies patrol, attack, and use the same reaction-based defeat mechanic as main enemies. All smaller enemies and main targets must be cleared before the exit opens.


## Beta 0.2014 — Chemistry Science Corrections and Bunsen Lab

- Corrected sulfur's boiling-point field in `assets/js/app-core.js` to approximately 444.6 °C at standard pressure, retaining the melting-point value 115.21 °C as a representative value.
- Added an independent, responsive **Bunsen Lab** tab, with an annotated burner (base, gas inlet, barrel, adjustable collar, air openings), gas on/off, adjustable air supply, and seven illustrative flame tests: lithium, sodium, potassium, calcium, strontium, barium and copper.
- The selected HU/DE/EN language is used for Bunsen controls and teaching explanations.
- Distinguishes the gas/air-mixture effect (yellow luminous or blue non-luminous flame) from metal-ion emission colour. The values are approximate classroom observations, not a calibrated emission spectrum or real burning chemical simulation; colours also depend on contamination and experimental conditions.
- Added `tests/bunsen.test.cjs` for headless scientific-model regression tests.

Future work: stoichiometric quantity calculations, acid-base titration, chemical equilibrium and kinetics, electrochemistry and organic chemistry, retaining the same teaching-model caveats.


## Beta 0.2015 — Mole and Stoichiometry Lab

Adds a standalone **Stoichiometry Lab** tab, independent of Chemistry Quest, localized in Hungarian, German and English. It teaches:

- Molar mass (g/mol) for formulas, including nested parentheses, using the complete set of 118 periodic-table atomic-mass entries in `index.html`.
- Converting mass in grams to amount of substance in mol.
- Calculating solution molarity in mol/L from solute mass and final solution volume.
- Computing theoretical product amount and mass from eight curated balanced reactions using the shared `ReactionEngine`, assuming complete conversion and other reagents in excess.

The calculation implementation is `assets/js/stoichiometry.js` and is usable offline in the browser. For classroom interpretation, the computed yields are theoretical, not experimentally measured; the user interface explicitly states model assumptions.


## Beta 0.2016 — Acid–Base and Titration Laboratory

A standalone, offline-capable **Acid–Base Lab** tab provides a calculated pH, an interactive titration curve, indicator color changes (methyl orange, bromothymol blue and phenolphthalein) and an equivalence-point button. It supports HCl, HNO₃, NaOH, KOH, acetic acid and ammonia in acid–base pairs. Strong electrolytes and monoprotic weak acid/base equilibria are modeled at 25 °C via charge balance and water autoionization; weak-acid/base conjugate species are included. The interface is available in HU/DE/EN. The ideal-model assumptions are explained on screen.

**GitHub Actions CI was intentionally removed** at the user's request. Unit tests remain in the repository for optional manual execution. New static labs do not require the Python API, but the scientific data sync / locally hosted backend features continue to require `python3 server.py`. GitHub Pages deployment is not automatically configured.


## Beta 0.2017 — Bunsen Flame Visualisation Update

The Bunsen flame is now dynamically generated from the air-control slider: a broad, taller yellow luminous flame at low air supply transitions to a narrower, shorter blue non-luminous flame as air intake rises. Animated flame flicker, colored glow and distinct metal-burning effects replace the former static flame paths.

The sample library now includes rubidium, caesium, indium, zinc, boron compounds, magnesium, aluminium and iron, in addition to lithium, sodium, potassium, calcium, strontium, barium and copper. **Magnesium/aluminium burning and iron sparks are not conventional metal-ion flame tests**; the interface explicitly distinguishes their combustion emission from the metal-salt flame-colour test. All explanations remain HU/DE/EN. Scientific colors and flame geometry are illustrative rather than calibrated spectra or CFD.

GitHub Pages assets are cache-busted with the `v=2.1.7` script and stylesheet suffix. No CI workflow was reintroduced.


## Bunsen Lab P0 scientific corrections (2026-11-02)

- **Air/fuel decoupling:** Air collar adjustment now continuously blends the luminous yellow and non-luminous blue flame characteristics instead of abruptly switching at 38%. A separate **gas flow** slider chiefly controls flame height/size. Both remain schematic; neither is a CFD simulation or calibrated temperature model.
- **Spectroscopy:** Emission displays a deliberately schematic excitation/relaxation equation `X + energy → X*; X* → X + hν`, where X can represent an atom, ion or molecular species. An explanatory species label and multiple illustrative spectral lines appear for relevant samples, including the sodium D doublet and potassium's violet/near-infrared features. Calcium, barium and copper also flag possible molecular or ionic contributors. Colour is not inferred from one wavelength alone.
- The existing metal-combustion equations and separate combustion visualisations are preserved; GitHub Actions is not re-enabled.
- Verification: 11 targeted headless Bunsen regression tests passed; full browser integration not established.


## Bunsen Lab P1 completion and follow-up audit (2026-11-02)

Implemented optional educational modes for **flame tests** and **metal combustion** (Mg, Al, Fe), including qualitative illustration of aluminium-oxide passivation, an explicit separate ignition step, a sample-loop insertion/cleaning workflow, concentration and trace-sodium contamination effects, and a simplified spectral-line identification exercise. Existing scientific accuracy notices and the prominent warning that this cannot replace supervised practice with a real Bunsen burner remain in place.

Limitations: colour/intensity/contamination are qualitative RGB models, not measured spectral radiance; the spectroscopy exercise displays representative lines rather than full emission spectra; the loop and ignition sequence is pedagogical and not a real equipment-operating procedure; aluminium passivation is represented only qualitatively. These limitations should be stated when using the tool in a classroom. The browser integration of the latest P1 UI has not yet been visually tested; targeted headless model tests passed. GitHub Actions remains disabled.

## Bunsen Lab P2: Learn / Practice / Exam (2026-11-02)

The existing experimental Lab is retained. Three **new, built-in classroom views** are available:

- **Learn:** 3 short progressively structured lessons per level.
- **Practice:** 4 multiple-choice questions per level, immediate answer feedback.
- **Exam:** 6 multiple-choice questions per level, answers withheld until completion, automatic scores and a topic-based review report.
- Levels: Basic (grades 7–8), Advanced (grades 9–10), Oberstufe (grades 11–13).
- Fully translated educational content and controls in Hungarian, German and English.
- All frontend data stays local to the browser; scores are not uploaded or persisted.
- The existing Bunsen Lab warns that the simulation is no substitute for supervised practical laboratory work.

Automated checks: **20/20 targeted headless Bunsen and education tests passed**. Full browser visual and interaction testing is still needed. No CI workflow was added.

## Bunsen Lab education 0.2040 (2026-11-02)

- **Learn**: six explanatory lessons per level (Basic, Advanced, Oberstufe), deliberately covering the corresponding exam question topics.
- **Practice**: six random questions drawn from a 16-question level-specific bank, immediate correctness feedback and one-click link to the relevant lesson.
- **Exam**: ten questions, randomized question/answer order, no answer disclosure before finishing; scores and missed-topic links to relevant lessons afterwards. Grade summaries remain local to the browser.
- **Spectroscopy**: calibrated illustrative wavelength labels plus a zoomed 586–592 nm view for resolving the sodium D doublet; randomized unknown sample selection.
- **Contamination**: still OFF by default. When enabled, sodium tint blends smoothly according to its slider, and cleaning resets contamination without removing the chosen sample. The colour is pedagogical RGB, not calibrated spectral radiometry.
- **Tests**: 22 targeted headless Bunsen and education checks passed. End-to-end browser operation and classroom usability have not been independently verified.


## Bunsen Lab 0.2040 — education update (2026-11-02)
- Each of the three levels has 6 structured lessons plus 16 linked questions (48 total).
- Practice selects 6 randomized questions; exams select 10, with randomized answer ordering and final-only answer reveal.
- Wrong answers link back to the relevant lesson, and the summary recommends relevant lessons rather than untranslated topic codes.
- The Bunsen spectrum illustration has a wavelength scale, optional 586–592 nm sodium D-doublet zoom, and randomized unknown samples.
- Sodium contamination is a continuously blended, optional visual approximation rather than an abrupt species switch.
- All 22 targeted model/education tests passed locally in a headless JavaScript harness. Full GUI/browser testing was not performed.


## Chemistry Academy — whole-application P0 teaching improvements (2026-11-02)
- A new **Kémia Akadémia / Chemie-Akademie / Chemistry Academy** top-level tab provides a common **Learn → Practice → Exam** workflow.
- Coverage: **10 topics, 30 linked lessons, 40 questions** spanning atomic structure, bonding, stoichiometry, acids/bases, Bunsen flames, Chemistry Quest, Element Hunt, materials, molecular physics, and interpreting speculative models.
- Each topic offers 3 lessons, 3 practice questions and 4 exam questions. A mixed exam contains **12 questions**, covering all ten topics at least once. Question order and choices are randomized. Exam answers appear only in the report; mistakes link to the relevant source lesson.
- Mode-specific scientific fidelity notices clarify Bohr vs quantum models, screened hydrogenic multielectron approximations, limited valence/VSEPR heuristics, reference vs estimated molecular geometry, and Chemistry Quest's fictional atom-crafting, reagent weapons and fire rules. Quest includes a direct comparison with real chemistry.
- Current limitation: this is a self-directed learning and assessment layer, **not** a certified school assessment or laboratory safety qualification. No login, grading upload, or cross-session score storage is added.
- **26/26 targeted headless checks passed** across Academy and previously existing Bunsen education. Live visual/browser verification and the full repo test suite were not performed. GitHub Actions remains intentionally disabled.


## Chemistry Lab 0.2062 — UX consolidation (2026-11-03)
- Chemistry Academy appears immediately before Chemistry Quest and is the **only** Learn / Practice / Exam area. The Bunsen laboratory remains a hands-on simulator with sample spectra, and its separate quizzes / test tabs were removed.
- The entire previous Bunsen teaching bank is available in Academy as Basic, Advanced and Oberstufe subjects: **18 lessons and 48 questions**. Across Academy: **12 subject choices, 45 lessons and 84 questions** (with randomized practice and exam sessions).
- A shared navigation controller enforces one visible top-level laboratory at a time; the Reaction Lab stays nested and visible within Molecule Builder only. The tab bar stays accessible when scrolling, with a fixed bottom previous/next switcher.
- Text layout is responsive and allows long content to wrap. Acid–Base Lab gains a dynamic burette/beaker illustration, indicator colour, approximate pH scale marker and accessible acidic/neutral/basic labels. The existing analytical titration model is unchanged.
- Verified **26/26** Bunsen + Academy targeted headless tests. A separate simulated DOM navigation check confirmed exclusive visibility across Bunsen, Molecule Builder, Acid–Base, Academy, Quest and Periodic Table. Browser visual testing on real devices remains outstanding. CI remains intentionally disabled.


## Chemistry Lab 0.2063 — user-reported UI corrections (2026-11-03)
- Atom viewer: Bohr/Quantum/Scientific mode controls are positioned **above the atom canvas** instead of underneath the illustration; the instructional/model-accuracy text is now in normal document flow rather than layered over the animated atom.
- Long headings, labels and explanatory text are allowed to wrap; existing absolute atom-view overlays have been disabled with targeted CSS rules.
- Chemistry Academy label translates as *Kémia Akadémia / Chemie-Akademie / Chemistry Academy*, including after the global language buttons are used.
- Acid–Base Lab adds a titrant-volume slider, ±1 mL controls and a reset-to-zero button; all are wired to the same validated pH/titration solver as the numeric entry. Choosing incompatible analyte/titrant types automatically changes the opposite reagent. Beaker colour is smoothly interpolated within the chosen indicator's transition range; the pH marker and graph update with dosing, including volumes above twice equivalence.
- Checked representative HCl/NaOH 0.1 M pH values, explicit UI event simulations (dose slider, plus/minus/reset and switch to ammonia), live Academy language-selection simulations, and 26/26 pre-existing targeted tests. Complete real-browser visual and mobile layout testing remain outstanding.


## Chemistry Lab 0.2064 — Element Hunt in Chemistry Academy (2026-11-03)
- Element Hunt moves from the top-level navigation into Chemistry Academy as a fourth activity next to Learn / Practice / Exam.
- Existing eight challenges, choices, answer feedback and in-session score logic are preserved. The former separate tab is hidden, not deleted, to retain compatibility with legacy application code.
- The Academy's Element Hunt topic now opens the embedded activity rather than attempting to activate the hidden tab.
- Element Hunt question and feedback text now supports English in addition to Hungarian and German.
- Added static integration regression assertions in `tests/academy-hunt.test.cjs` (run with `node --test tests/academy-hunt.test.cjs`). Full-browser verification is still outstanding.
- This release **does not integrate RDKit.js or another third-party engine**. Candidate libraries require dependency/license verification and a verified, locally served browser distribution before deployment.


## Chemistry Lab 0.2070 — Molecule learning workshop
- Adds an original, Apache-2.0-compatible, client-side molecular analysis panel inside Molecule Builder: empirical atom counts, molecular formula, approximate molar mass, disconnected component count, and simplified covalent valence warnings.
- Adds an interactive molar-mass question with answer feedback in Hungarian, German and English.
- Reads a snapshot of the existing builder's atoms and bonds without replacing its editor or rendering engine.
- Runs entirely on GitHub Pages without network requests or server-side computation. No BSD-3, GPL, LGPL or AGPL dependencies are bundled or fetched.
- New tests: `node --test tests/molecule-learning.test.cjs tests/academy-hunt.test.cjs`. These tests have been authored but were not executed in this environment; full browser regression testing remains outstanding.
- Kekule.js (MIT) was reviewed but **not bundled**: its optional Open Babel integration introduces GPL license concerns, and the exact distributable dependency closure has not yet been audited. The shipped learning module is original code with no external chemistry engine.
- Limitations: simple bond-order and valence checks are not a full chemical structure validator; formal charges, aromaticity, stereochemistry, radicals and implicit hydrogen counts are not resolved. Molar mass uses a small reference table and displayed formula counts explicitly modeled atoms only.


## Beta 0.2080 — Student-first focus, target pH and Bunsen diagram
- Student-first, reduced-clutter navigation: four localized learning areas (Explore / Experiments / Learn & Play / Advanced) reveal only their relevant lab tabs, while the existing previous/next footer remains available.
- Acid–Base Lab: inverse pH target calculator (0–14), synchronized slider and numeric input, computed titrant volume applied to the existing beaker, indicator and titration curve. The inverse uses the same 25 °C monoprotic charge-balance engine as the forward calculation. Unreachable targets are reported rather than invented.
- Guided interactive mini missions: choose acidic/basic/neutral **before** calculating, then get feedback. No time pressure and no external services.
- Bunsen burner parts 1–5 and their descriptions are displayed immediately below the numbered burner SVG, with existing selection behavior retained.
- All code remains own Apache-2.0 code. No MIT/BSD-3/GPL/AGPL external packages added.
- Added `tests/focused-learning.test.cjs`. Pure inverse-solver cases were executed in the JavaScript runtime and succeeded; full Node tests, mobile-browser regressions and accessibility testing are still pending.
- Navigation/interactivity 9/10 is a design **target**, not a validated score from real students.


## Beta 0.2081 — Interactive pH colour strip (2026-11-03)
- The visible colored pH scale inside Acid–Base Lab is now the **actual target-pH control**, supporting click, pointer dragging, touch dragging and keyboard (Arrow, Page Up/Down, Home/End) interaction. The redundant target-pH range slider was removed; the precise number field remains available.
- White marker represents requested target pH; a separate darker marker represents calculated current pH. An adjacent localized readout explicitly distinguishes the two.
- Releasing a pointer or adjusting via keyboard immediately runs the existing inverse titration calculation and updates dose, indicator, beaker and graph when reachable; unsupported target values remain visibly unreachable.
- Added `tests/ph-scale-ui.test.cjs` static integration/chemistry regression checks. Verified syntax and 15 numerical reverse-pH cases (strong acid/base, weak acid, weak base) using the JavaScript runtime; full DOM integration and live mobile/browser testing remain pending.
- No external dependencies added. Apache-2.0 only; no BSD-3, GPL, LGPL or AGPL code.

### Student-first UI audit notes
- Positive: four learning-area entry points, interactive 3D models, clear colorful pH feedback, accessible input modalities, embedded Element Hunt, short acid-base prediction missions.
- Priority issues: two simultaneously visible navigation systems plus fixed footer may overwhelm new learners; lessons rely heavily on short text and three-option multiple-choice questions; mission prompts and rewards are limited; some labs expose many settings before explaining what to do; color/shape alone must not convey correctness; diagrams need controls and labels placed together; mobile/browser accessibility must be validated in a real browser.
- Target user experience: one main action per scene; discover/predict/try/explain mini loops; progressive reveal of advanced controls; no time pressure or forced animation; optional reduced-motion accommodations.
- Navigation 9/10 and interactivity 9/10 remain desired student-evaluation targets, not measured results.


## Beta 0.2090 — Material families, discoveries, expanded acid exploration & Element Hunt (2026-11-03)
- **Material Library (68 built-in items):** groups cards in 17 curated chemical families, so related substances sit together. This is an educational taxonomy inspired by periodic-table organization, **not** a claim that compounds have elemental periods/groups or that similarity is rigorously computed from molecular fingerprints.
- Optional extended HU/DE/EN explanations combine a family-level property note with each material's existing description and 29 expanded material-specific scientific notes. Explanations, discovery prompts, answers, and side-by-side material comparison are expandable rather than always visible.
- **Acid–Base Lab:** expanded the 25 °C monoprotic equilibrium solver to 13 supported reagent entries; added a collapsible explanation of pH, strong/weak dissociation, indicator endpoints, equivalence points and model limits.
- **Acid + material exploration:** 12 curated qualitative cases (gold, zinc, magnesium, iron, copper, limestone, bicarbonate), with conditions, chemical equations where justified and optional explanations. Unknown combinations are explicitly marked unmodeled; the visual is not a kinetic simulation, hazard assessment or experimental procedure. The acid/material explorer is distinct from the pH titration solver.
- **Element Hunt:** 100 additional 3-language factual questions derived from the existing 118-element catalog, giving 108 question records total. Correct choices are checked against the same local catalog, and all 100 new prompts are unique.
- **Chemistry Quest remains untouched.** No external dependencies added, all new code Apache-2.0-compatible; GitHub Pages continues without a backend.
- Added `tests/material-families-discovery.test.cjs` and performed JavaScript syntax checks and direct module-data verification. Full Node/browser UI testing is still outstanding.


## Beta 0.2091 — Material Library accordion
- All 17 chemical families are collapsed by default, showing only descriptive group names and item counts.
- Expanding one family shows only its related material tiles; multiple families may be opened independently.
- Selecting an item now opens its material details immediately below the tile grid inside the selected family, with no automatic scroll to the bottom of the library. Clicking the same tile again closes details.
- Search filters items and temporarily opens matching groups; the saved open/closed state of normal browsing is retained.
- Existing JSON import, scientific descriptions, discovery cards, and structure model actions are unchanged.
- Added a dedicated regression test file `tests/material-collapsible-ui.test.cjs` and verified syntax of changed JavaScript/test files. Real-browser mobile interaction testing has not yet been performed.


## Beta 0.2094 — Student-centered Material Library browsing (2026-11-03)
- Refined after reviewing [PubChem structure searches](https://pubchem.ncbi.nlm.nih.gov/docs/structure-search) and [MolView's 2D/3D split viewer](https://molview.com/): make related chemistry easy to discover and compare without loading third-party code or presenting the catalog as an algorithmic similarity search.
- Material details open **directly after the clicked tile inside the same family grid**, spanning the available width. The page does not automatically jump to the end of a family.
- The primary interface now offers a search field, collapsed chemical families and a short discovery prompt. Category filters and JSON import/export remain available behind optional disclosure controls.
- Ten curated compound pairs include explanatory comparisons (alkanes/alkenes/alkynes, alcohols, graphite/diamond, table salt/bicarbonate, peroxide/water, acids, polymers). Changes in bonds are emphasized using symbolic side-by-side panels when applicable.
- Related substances are prioritized for comparison. A short, two-option prediction question reveals correct scientific reasoning **only after the student answers**. Complex details are still optional.
- Every user-facing added label is available in HU/DE/EN; it is an offline, static GitHub Pages deployment. All added code is original and Apache-2.0-compatible, with no new dependencies.
- Code-level JS syntax and direct module-data checks were performed. Browser interaction, accessibility and end-to-end test suite execution remain to be verified.


## Beta 0.2095 — Periodic-table-style Material Family map
- Replaced redundant category filters and long collapsible family bars with 17 color-accented **square category cells**, laid out in a compact responsive grid (six columns on desktop, three on narrow phones).
- Each cell uses a short educational chemical mnemonic, family name and count. These mnemonics are category labels **not periodic-table element symbols or a claim of periodic regularity**.
- Selecting a family shows its materials in a single expanded panel below the category grid; selecting a material opens its detailed science and comparison immediately after the selected material tile.
- Search, curated related materials, prediction-first questions, advanced descriptions and optional JSON import/export remain. No new runtime dependencies; all original Apache-2.0-compatible code works as a static GitHub Pages site.
- Static JavaScript syntax and source-level regression assertions checked; browser-level/mobile visual verification remains outstanding.


## Beta 0.2096 — Family-square labels and local expansion
- Material-family square tiles now contain **only the chemical family name and number of listed materials**, not an arbitrary example molecular formula.
- Selecting a family inserts the expanded materials area immediately **after the visual grid row of the clicked square**, rather than below every family square. Responsive calculation matches six/five/three columns at the CSS breakpoints.
- The individual material squares still display their own chemical formula and name. Existing educational comparisons, discovery prompts and JSON import/export remain untouched.
- The application code and stylesheet include versioned asset URLs to avoid stale GitHub Pages browser caches.
- Syntax and source-level invariants checked; no live browser interaction test has been performed.


## Beta 0.2097 — Fixed vanishing Material Library and structure-model access
- Root cause: the `#materialDetail` DOM node was moved inside the dynamic family grid, then removed together with the grid when the family changed. Subsequent `getElementById` calls returned null and aborted the UI render. The node now returns to a stable position whenever its content closes, and an absent node is recreated defensively.
- The material grid is built in a detached `DocumentFragment` and only swaps into the page after construction, preventing a partial redraw from leaving an empty catalogue. A responsive-column fallback is available without `matchMedia`.
- Material 2D/interactive structural views are still present. The 'open structure' action now explicitly activates the modern Molecule tab before centering the selected structure.
- Added regression assertions for detail-node preservation, structure-tab activation and defensive rendering. Validated JavaScript syntax and source-level invariants; live browser/mobile E2E regression not yet run.


## Beta 0.2098 — Inline interactive structure previews and comparison
- A selected material's existing catalogue structure now appears directly in its material details as an **interactive, lightweight SVG 2D viewer**: pan with mouse/touch, zoom with wheel or accessible +/- controls, reset, and keyboard pan/zoom (arrow keys, +/- or Home). Its geometry is explicitly an educational, schematic 2D representation rather than a molecular energy minimization.
- The full existing Molecule laboratory remains available from the material card. No 3D data or imported structure models are removed.
- For the ten curated learning pairs, an expanded comparison displays two independent structural viewers when both catalogue models exist, alongside the existing prediction question and scientific explanation.
- Source-level verification checked that all 68 built-in structure entries yield valid drawable geometry, and a dedicated test file `tests/material-preview.test.cjs` covers geometry, event handlers, language/navigation and DOM state invariants. Browser-based manual and end-to-end tests have not yet been run.
- Original Apache-2.0 implementation with no external runtime dependencies, compatible with GitHub Pages.
