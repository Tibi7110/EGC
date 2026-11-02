# Five-minute presentation guide

## 1. Introduce the question — 30 seconds

“How can AI assist 3D modeling, and what work still belongs to the artist?” Explain that the demo is a procedural illustration of AI workflows, not a running neural network.

## 2. Shape exploration — 1 minute

Select **Text to 3D**. Orbit the vase and move the comparison slider. The wireframe illustrates an early manual modeling stage, while the shaded side illustrates a proposed first draft. Traditional software can also produce excellent final results; the comparison concerns workflow, not a quality ceiling. Research such as DreamFusion explores learned text-to-3D generation.

## 3. Materials — 1 minute

Select **AI materials**, then **Terracotta vessel** and **Sculptural chrome**. Compare the neutral and styled surfaces. Explain that this demonstration sets material parameters; actual research such as Text2Tex generates textures using diffusion. Artists still inspect seams, material accuracy, and consistency.

## 4. Cleanup — 1 minute

Select **Geometry cleanup**. Compare the rough input with the clean surface and change the detail slider. Explain that denoising and adding polygons are different operations. Here the noise is synthetic; PointCleanNet learns to remove outliers and denoise point clouds. Oversmoothing can erase intentional detail.

## 5. Human judgment and takeaways — 1 minute

Pause rotation, toggle wireframe, and export an OBJ model. Discuss topology, dimensions, style, copyright/provenance, and compute costs. AI can help explore or clean up; humans decide whether the result meets the brief. Show the research links and the project's transparent limitations.

## Questions to prepare for

- **Is the model actually AI-generated?** No. A deterministic procedural mesh demonstrates the concept without paid APIs or long inference jobs.
- **Does AI always make modeling faster?** No measured claim is made. Results depend on the task, model, revision needs, and computing resources.
- **Is more geometry always better?** No. Resolution costs memory and rendering time; appropriate topology depends on use.
- **Can I edit the exported result?** Yes. Import the OBJ into Blender or another modeling package. Materials are not included.
- **Why is the manual side unfinished?** It represents a workflow stage for teaching; manual modeling can achieve the same or higher final quality.
