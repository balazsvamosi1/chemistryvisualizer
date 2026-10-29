# Chemistry Visualizer

Chemistry Visualizer is a personal hobby project: an interactive browser-based chemistry lab combining a periodic table, atom and molecule visualizations, reference data, and experimental physics tools.

## Languages

The website is available in **Hungarian and German on an equal basis**. Use the HU/DE buttons in the interface to switch languages.

## Current features

- Explore all 118 elements in an interactive periodic table, with atom and isotope information.
- View illustrative atomic orbitals and selected reference spectral lines.
- Build and inspect molecules in 2D and 3D, with bonding and geometry analysis.
- Browse example materials and try the reaction and element-hunt activities.
- Explore reference molecular data and an optional speculative pair-potential model.

## Run locally

The current modular application is in `chemistry_lab_beta_v18/`. It requires Python 3.10 or newer and has no Python package dependencies.

```sh
cd chemistry_lab_beta_v18
python3 server.py
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser. Some reference-data synchronization features need an internet connection; the rest of the local application can be explored without one.

## Scientific scope

Atomic orbital views use simplified models for most elements. Molecular geometry and pair-potential views are approximations; they do not establish that a material exists or is stable. The optional MACE model download is provided as a resource, but MACE inference is not implemented.

## Development roadmap

Beta 1.8 is the current starting point. The roadmap below is a set of proposed directions for this hobby project; version numbers indicate an intended sequence, not a release schedule.

### Scientific engines and reference data

| Version | Planned work | Main capabilities | Priority |
| --- | --- | --- | --- |
| 1.9 | Quantum Engine 2.0 | PySCF integration, calculated atomic and molecular orbitals, energy levels | P0 |
| 2.0 | Molecular Dynamics | Thermal motion, changing bond lengths, geometry optimization, temperature and pressure inputs | P0 |
| 2.1 | Bonding Engine 3.0 | Lewis structures, electron pairs, VSEPR, hybridization, bond energies | P0 |
| 2.2 | Reaction Engine 2.0 | Assemble reactants, balance equations, check thermodynamics and kinetics | P0 |
| 2.3 | Scientific Materials Database | PubChem and NIST cache, broader molecule coverage, sourced reference data | P1 |
| 2.4 | Materials AI | Explore MACE/MatterGen models, crystal candidates, stability estimates | P1 |

Calculation methods should be clearly identified by accuracy level. Visual approximations should not be presented as DFT or experimental results.

### Chemistry modules

| Version | Module | Planned capabilities | Priority |
| --- | --- | --- | --- |
| 2.5 | Moles and stoichiometry | Amount of substance, molar mass, limiting reagent, yield, equation balancing | P0 |
| 2.6 | Acids, bases, and pH | pH calculations, acid/base strength, buffers, titration curves | P0 |
| 2.7 | Redox and electrochemistry | Electron transfer, oxidation states, galvanic cells, electrolysis, Nernst equation | P0 |
| 2.8 | Chemical equilibrium | Law of mass action, Le Chatelier principle, concentration/temperature/pressure changes | P0 |
| 2.9 | Reaction kinetics | Reaction rates, activation energy, catalysts, Arrhenius plots | P1 |
| 3.0 | Organic chemistry | Functional groups, isomers, IUPAC names, introductory reaction mechanisms | P1 |
| 3.1 | Macromolecules | Polymers, polymerization, proteins, biochemical structures | P1 |
| 3.2 | Qualitative analysis | Flame tests, ion identification, precipitation reactions, indicators | P1 |
| 3.3 | Crystals and materials | Ionic and metallic lattices, diamond, graphite, conductors, semiconductors | P1 |
| 3.4 | Chemistry Practice Lab | Topic map, question generator, experiment planning, knowledge checks | P2 |

### Additional simulation ideas

| Version | Module | Planned capabilities | Priority |
| --- | --- | --- | --- |
| 3.5 | Spectroscopy Lab | Emission and absorption spectra, UV–Vis, IR, molecular vibrations | P0 |
| 3.6 | Interactive Dissolution | Salt dissociation, hydration, solubility, saturated solutions | P1 |
| 3.7 | Crystal Lattice Simulator | Unit cells, lattice constants, coordination numbers, X-ray diffraction | P1 |
| 3.8 | Intermolecular Forces | Hydrogen bonding, dipole interactions, dispersion forces | P0 |
| 3.9 | Thermodynamics | Enthalpy, entropy, Gibbs energy, phase diagrams | P0 |
| 4.0 | Nuclear Chemistry | Radioactive decay, half-life, isotope stability | P1 |
| 4.1 | Coordination Chemistry | Complex ions, ligands, crystal-field splitting, magnetism | P2 |
| 4.2 | Photochemistry | Photon absorption, excitation, fluorescence, phosphorescence | P1 |
| 4.3 | Virtual Instruments | Spectrophotometer, pH meter, calorimeter, chromatography | P1 |
| 4.4 | Research Notebook | Saved experiments, charts, CSV/JSON export, reproducibility | P0 |

Ideas from other projects can inform feature design. Before adopting any third-party code or model, review its license and full dependency chain.

### Speculative physics branch

The speculative physics area is planned as a separate part of the app, with modes that distinguish established physical assumptions from user-defined hypothetical ones.

| Module | Planned capability | Basis |
| --- | --- | --- |
| Hard | Candidate materials built from known elements | Established physics |
| Extreme | High pressure, temperature, and external fields | Established physics with model limits |
| Soft / Sandbox | Custom interactions and hypothetical fields | User-defined assumptions |
| Material Generator | MatterGen-based crystal candidates | Generative materials research |
| Stability Analyzer | Energy and geometry stability estimates | MACE or quantum-chemistry calculations |
| Physics Consistency Checker | Check assumptions and conservation laws | Mathematical model validation |

### Suggested development order

These groups combine related roadmap items and are starting points for prioritization:

1. **Quantum chemistry and bonding:** versions 1.9, 2.1, and 3.8 — calculated orbitals, clearer bonding analysis, and intermolecular forces.
2. **Chemistry calculations:** versions 2.5–2.8 — stoichiometry, pH, redox, and equilibrium.
3. **Spectroscopy and photochemistry:** versions 3.5 and 4.2 — reference spectra, energy levels, transitions, and photons.
4. **Molecular physics and thermodynamics:** versions 2.0, 2.2, and 3.9 — temperature, pressure, reaction energy, and stability.
5. **Materials exploration:** version 2.4 and the speculative physics modules — candidate materials and carefully labeled hypothetical models.

### Shared infrastructure

- **Physics Data Registry:** versioned JSON datasets, sources, units, and cache management.
- **Calculation Engine Registry:** separate engines for stoichiometry, thermodynamics, quantum chemistry, and materials science.
- **Scientific Confidence Labels:** identify results as measured, calculated, approximate, or speculative.
- **Workspace Profiles:** organize the app's tools and views for different project workflows.

Establishing shared data, calculation, and confidence systems before adding more engines would make future results easier to inspect and compare.

## Project contents

- `chemistry_lab_beta_v18/` — modular Beta 1.8 application and its source files.
- `chemistry_lab.html` and `chemistry_lab_beta.html` — standalone earlier application files.
- `chemistry_materials_example.json` — example materials data.
- `chemistry_lab_beta_v18.zip` — archive of the Beta 1.8 project.
