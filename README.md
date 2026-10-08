# TACROSS project page

Research project website for **TACROSS: An Efficient and Low-Cost Scalable Human Touch System Across Heterogeneous Tactile Sensors for Dexterous Robot Learning**.

- [Project page](https://tacross-touch-project.github.io/)
- [Paper](https://agentic-intelligence-lab.org/files/TACROSS.pdf)

## Website contents

Four task demonstrations with success and failure examples, an interactive training/deployment overview, hardware and dataset information, and experimental results from the manuscript.

This repository contains the project website. Research code, hardware designs, and the dataset are planned for release; this website repository is not the algorithm implementation.

## Local preview

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/.

## Editing

- `index.html`: text, author list, resource links, results and citation.
- `style.css`: responsive layout and visual style.
- `app.js`: task video selection and method interactions.
- `assets/`: web-optimized research images and videos.

GitHub Pages publishes the repository root from the `codex/project-page` branch. Videos retain the source playback speed marked in the footage. Failure examples are not ablation baselines.

All research imagery and footage are supplied by the TACROSS authors. No additional license is granted by this website repository.
