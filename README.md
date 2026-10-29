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
