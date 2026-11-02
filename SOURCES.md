# Research references

These original project pages provide the conceptual basis for the lesson text. The app does not implement or benchmark these systems.

1. **DreamFusion: Text-to-3D using 2D Diffusion** — Poole et al., 2022. Uses a pretrained text-to-image model to guide optimization of a 3D representation. [Project and paper](https://dreamfusion3d.github.io/). Our analogy: turn a description into an editable first concept; our implementation uses keyword presets and lathed geometry.
2. **Text2Tex: Text-driven Texture Synthesis via Diffusion Models** — Chen et al., ICCV 2023. Generates and refines appearance across views and projects it to a texture. [Project and paper](https://daveredrum.github.io/Text2Tex/). Our analogy: describe surface appearance; our implementation changes standard material properties without generated texture maps.
3. **PointCleanNet: Learning to Denoise and Remove Outliers from Dense Point Clouds** — Rakotosaona et al., 2019. Learns outlier removal and point correction. [Project and paper](https://geometry.cs.ucl.ac.uk/projects/2019/pointcleannet/). Our analogy: assist geometry cleanup; our implementation compares deterministic noisy and clean meshes.

The sources support examples of research approaches, not blanket claims about current products, guaranteed speedups, or superiority over manual work.
