# 3D Chemistry Lab — Beta 1.4 (Modular Foundation)

A modular, incremental migration of Beta 1.3. Retains the existing UI, periodic table, isotope browser, materials, reaction lab, element hunt and 2D/3D molecule editor.

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

**None added** in this milestone. A third-party repo's top-level MIT license was verified, but no source files from that repo are included because their provenance and transitive dependencies could not be audited in this runtime. Later integration of Wartets/Molecule-Builder and other libraries must pass a file-level MIT/Apache-2.0 license audit. The existing source inherited from Beta 1.3 has not been independently licensed by its author; do not imply that upstream components are automatically relicensed.


## Beta 1.5 — Molecular Physics Lab

The original application remains intact. A new **Molecular Physics** tab is added. Run `python3 server.py`, open `http://127.0.0.1:8000`, then open that tab and press **12 referenciaanyag letöltése**. Internet access is needed **only for first-time synchronization**. The PubChem responses are cached in `cache/pubchem/*.json` and subsequently served offline. Individual additional English chemical names can be fetched by editing the built-in list or using the API `POST /api/physics/sync` with `{"names":["benzene"]}`. The UI's name field currently **reads already cached records only**, not arbitrary internet queries.

**Model weights**: explicit optional `MIT MACE-MP-0b2-small` button downloads an allowlisted checkpoint to `cache/models/`. MACE inference and real stability/pressure/temperature computations are **not implemented**. MACE-MP is designed for materials and not universally valid for isolated molecules. No inference libraries or problematic licensed transitive dependencies are bundled.

The PubChem API gives reference properties and 2D/3D coordinates, but not proof of stability. No fabricated energies are returned. The backend binds to `127.0.0.1`, does not execute remote code, and limits cache requests to allowlisted API hosts. Cached public data may have record-specific third-party reuse restrictions.

Check with `python3 -m unittest discover -s tests -p 'test_*.py'`.


## Beta 1.6 — Spekulatív fizika

A separate top-level **Spekulatív fizika** tab contains **Hard**, **Extreme**, and **Soft / Sandbox** submodes. Existing tabs and the Physics Lab are retained unchanged.

- `assets/data/speculative-models.json` is an editable model catalog. Parameters are educational approximations, not calculated reference binding energies.
- The plot evaluates a Lennard–Jones pair potential and, in Sandbox mode only, an optional hypothetical Gaussian perturbation.
- Temperature and pressure are adjustable but **do not** currently drive thermodynamic, molecular dynamics or phase stability calculations. They are displayed as scenario inputs.
- Save exports a JSON experiment file containing inputs, results, and a model-only warning.
- A minimum on the pair potential is **not** evidence that a novel material can exist.
- No new third-party package or model is bundled. The MIT/Apache-only code policy remains intact.


## Beta 1.7 — Scientific atom visualization

- Existing Bohr, Quantum, isotope and chemistry features remain unchanged.
- New **Scientific** atom view shows element-colored illustrative orbit/shell motifs, curated uses, selected visible atomic emission lines, and quick element navigation.
- Spectral data are a small, manually curated set of approximate wavelengths for H, He, Li, Ne, Na and Hg. Based on standard atomic emission reference lines; consult the [NIST Atomic Spectra Database](https://physics.nist.gov/asd) for authoritative transitions, accuracy, intensity, and excitation conditions.
- **No spectrum is invented** for elements without curated lines. The viewer is **not** a solution of the many-electron Schrödinger equation and the glowing arcs are not physical electron trajectories.
- No external images or dependencies were added.


## Beta 1.8: Scientific wavefunctions + NIST cache

Scientific atom panel now includes orbital electron-probability visualization for all 118 elements. Hydrogen orbitals use analytical nonrelativistic hydrogenic shapes; all other neutral atoms use a **screened hydrogenic approximation**, not a numerical many-electron wavefunction. Electron configurations include common corrections, but heavy elements may require relativistic/experimental configuration updates. Rotation of sampled density is a camera effect, not electrons on trajectories.

NIST ASD neutral-atom **visible** line data can be fetched on demand with the `↻ NIST` button and stored in `cache/nist/NNN.json`. The UI never invents missing lines. The NIST endpoint can change: parser errors result in `unverified_empty`, not claims of zero spectral lines. Example: `curl -X POST http://127.0.0.1:8000/api/nist/sync -H 'Content-Type: application/json' -d '{"z":11}'`. Inspect `GET /api/nist/status` and `GET /api/nist/element?z=11`. Not every atom has independently verified NIST lines cached until successfully fetched. NIST source: https://physics.nist.gov/asd . Verify data reuse terms before redistributing cached datasets.

Cache all 118 neutral-atom visible spectra (internet connection required, requests spaced apart): `python3 -m physics.nist --all --delay 2`. Every response is recorded with a status; unverified or failed results are **not** presented as valid spectra.


## Beta 1.9 — English language + Chemistry Quest prototype

The original scientific tabs remain in place. A third **EN** button adds English element names for all 118 elements, the major navigation labels and core atomic/molecule controls. The Chemistry Quest game is fully localized in HU/DE/EN. Some inherited deep scientific and material explanatory text still falls back to German; full English editorial translation is a follow-up task.

**Chemistry Quest** is a playable self-contained 16-bit-inspired Canvas platform prototype: walk (A/D or left/right arrows), jump (W/Space/up), collect two H and one O atoms, craft H₂O (E or touch button), answer an atomic-number challenge and unlock the cooled lab door. Touch-screen movement buttons are provided. The game uses the existing ChemistryEngine for a simplified valence check. It uses no commercial assets or external engine. Crafting atoms is a **game abstraction**, not a chemically valid mechanism for synthesizing water.

Project assets added: `assets/js/quest.js` (MIT), `assets/js/english.js` (localization extension), `assets/css/quest.css`. No external dependencies were added. Game progress completion is stored in browser localStorage when available.

Launch with `python3 server.py` and visit `http://127.0.0.1:8000`. Test syntax with `node --check assets/js/quest.js` and `node --check assets/js/english.js`.


## Chemistry Quest 1.9.2 — jump and progression fixes

- Increased jump impulse from 540 to 600 px/s; gravitational acceleration remains 950 px/s².
- Added jump buffering (0.20 s) and coyote time (0.13 s).
- The mid-level oxygen quiz is now shown above the canvas and **does not pause** game movement.
- Select the answer by clicking/tapping the buttons; the correct oxygen atomic number is 8.
- E builds H₂O using two collected H atoms and one O atom; next to the fire enemy, E splashes the water.
- Existing scientific modules and UI preserved.

## Chemistry Quest 1.9.3 — two-level update

- Fixed jump collision with raised platforms: ledges are one-way, allowing jumps from below and landing from above.
- Jump input buffering and coyote time prevent missed jumps; Space/W/Up or touch Jump.
- Level 1: collect 2 H + 1 O, craft H₂O, solve oxygen puzzle, use E on the fire creature, reach the exit.
- Level 2: collect 1 C + 2 O, craft CO₂, use E near a moving fire robot, reach the exit.
- Complete Level 1 to reveal **Next level**; restart resets current level.
- The water/CO₂ fire suppression is a game mechanic, not a general guarantee for real-world fires; CO₂ extinguishers are unsuitable for some fire classes and situations.


## Beta 1.9.7 — P0 Stability Fix

- Fixed lanthanide/actinide metal category aliases (`lanth`, `act`).
- Ammonia (NH3) is a molecular material, not an ionic lattice.
- Protected all concurrent `SYNC` state updates and reads with a dedicated state lock; returned snapshots copy the mutable error list.
- Reduced idle CPU/GPU pressure by throttling canvas redraws in hidden and inactive tabs and capping active 2D/3D animation loops. Animation detail is reduced versus the previous release.
- Added a deterministic Chemistry Quest test interface (`ChemQuest.test`) for browser automation. It is a test hook, not a game mechanic.
- Added concurrency, dataset and source regression tests. Run `python3 -m unittest discover -s tests -p 'test_*.py'` and `node --test tests/*.test.cjs`.
- Browser E2E test script in the distribution was attempted but blocked by the current runtime's localhost navigation restrictions; do not treat the game's integration flow as verified.
- Scope: P0 corrections only; no redesign or feature deletion.


## Beta 2.0 — Chemistry Quest: 10 levels

The Chemistry Quest is now a ten-stage educational platform game. Controls: A/D or arrows to move, Space/W to jump, **C** to craft with a recipe dropdown, **E** to launch the selected reagent, **Q/Tab** to cycle weapons, **1–9/0** to choose an arsenal slot. Atom pickups pause the game until a correctly answered randomized middle-school chemistry question. Ammo persists between stages; level 10 needs carried-over HCl and NaOH and freshly crafted CH4 plus two O2 charges. Finish a stage and click Next Level.

This is an educational model, **not** an instruction for conducting reactions or using real chemicals as weapons. NaCl, NaOH and Ca(OH)2 are ionic substances, not discrete covalent molecules. H2 reduction of rust needs suitable reaction conditions; HCl acid chemistry requires an aqueous solution; methane combustion needs an oxidizer and ignition; some obstacle outcomes are deliberately fictional.

Smoke test: `node --test tests/*.test.cjs && python3 -m unittest discover -s tests -p 'test_*.py'`.

### Implementation scope and limitations (v2.0.0)
The 10 stages have distinct target types, recipes, reaction rules and learning facts, but share a common retro level layout rather than ten individually illustrated level maps. The levels 3, 8, and 9 include lightweight additional movement mechanics (hydrogen boost, ghost platform, bubble pad). Complex chemistry, precise quantities, and actual combustion safety are outside the simulation; the rules are didactic abstractions. For stage 2 a water charge is provided so the player can extinguish the opening crate; stage 10 starts with one HCl and NaOH each to prevent an unsolvable boss. The projectile misses are refunded.
