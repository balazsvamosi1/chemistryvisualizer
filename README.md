# Chemistry Visualizer

Chemistry Visualizer is an interactive, browser-based chemistry learning lab. It combines a periodic table, visual atom models, molecule building, chemistry references, and introductory molecular-physics tools in one application.

## Languages

The website is available in **Hungarian and German on an equal basis**. Use the HU/DE language buttons in the interface to switch languages.

## Features

- Explore all 118 elements in an interactive periodic table, with atom and isotope information.
- View illustrative atomic orbitals and selected reference spectral lines.
- Build and inspect molecules in 2D and 3D, with educational bonding and geometry analysis.
- Browse example materials and use the reaction and element-hunt activities.
- Explore reference molecular data and an optional speculative pair-potential model.

## Run locally

The current modular application is in `chemistry_lab_beta_v18/`. It requires Python 3.10 or newer and has no Python package dependencies.

```sh
cd chemistry_lab_beta_v18
python3 server.py
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser. Some reference-data synchronization features need an internet connection; the rest of the local application can be explored without one.

## Scientific scope

This project is an educational visualizer, not a general-purpose computational chemistry package. Atomic orbital views use simplified models for most elements, and molecular geometry and pair-potential views are illustrative approximations. They do not establish that a material exists or is stable. The optional MACE model download is provided as a resource; MACE inference is not implemented.

## Project contents

- `chemistry_lab_beta_v18/` — modular Beta 1.8 application and its source files.
- `chemistry_lab.html` and `chemistry_lab_beta.html` — standalone earlier application files.
- `chemistry_materials_example.json` — example materials data.
- `chemistry_lab_beta_v18.zip` — archive of the Beta 1.8 project.
