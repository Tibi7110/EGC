import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { createVessel, interpretPrompt, presets, triangleCount } from './model.js';

const icon = (name) => ({arrow:'↗',spark:'✳',cube:'◇',play:'▶',download:'↓',rotate:'↻'}[name]);
const techniques = {
 shape: { number: '01', name: 'Text to 3D', short: 'Shape generation', title: 'From an idea to a starting point.', description: 'Traditionally, an artist builds a mesh vertex by vertex. Text-to-3D research uses learned visual patterns to propose geometry from a description, giving the artist a starting point to refine.', before: 'Build a profile, place vertices, and shape the silhouette by hand.', after: 'Describe a direction, explore variations, then refine the geometry.', steps: ['Describe the object', 'Explore a first draft', 'Refine with an artist'], source: 'DreamFusion · 2022', url:'https://dreamfusion3d.github.io/', caveat: 'Generated geometry can have hidden artifacts. Clean topology, accurate dimensions, and production readiness still need an artist.' },
 material: { number: '02', name: 'AI materials', short: 'Texture synthesis', title: 'Give a surface a new story.', description: 'An artist traditionally paints textures and adjusts material maps. Diffusion-based texture research can generate appearance from a description and project it onto an existing mesh.', before: 'Paint surface detail, align UVs, and tune material properties.', after: 'Describe a material, generate candidates, and check consistency.', steps: ['Keep the geometry', 'Describe the surface', 'Inspect every angle'], source:'Text2Tex · 2023', url:'https://daveredrum.github.io/Text2Tex/', caveat: 'Seams, inconsistent lighting, and physical material properties still require inspection. This demo changes material parameters; it does not run texture diffusion.' },
 refine: { number: '03', name: 'Geometry cleanup', short: 'Surface refinement', title: 'Less cleanup. More creating.', description: 'Scanned geometry often contains noise and outliers. Learned approaches can help estimate cleaner surfaces; artists still check the silhouette and preserve meaningful features.', before: 'Inspect scan noise and correct surface defects manually.', after: 'Use an estimated clean surface as a starting point for review.', steps: ['Inspect the rough input', 'Estimate a clean surface', 'Check preserved details'], source:'PointCleanNet · 2019', url:'https://geometry.cs.ucl.ac.uk/projects/2019/pointcleannet/', caveat:'Denoising can erase real details. PointCleanNet works on point clouds; our noisy-mesh comparison is a conceptual illustration, not an implementation of the paper.' },
};

document.querySelector('#app').innerHTML = `
<header class="site-header"><a class="brand" href="#" aria-label="Form Lab home"><span class="brand-mark">f<span>↗</span></span>form<span class="brand-light">lab</span><span class="brand-dot"></span></a><nav aria-label="Main navigation"><a class="active" href="#playground">Playground</a><a href="#workflow">The workflow</a><a href="#about">About the project ${icon('arrow')}</a></nav><span class="school-badge"><span></span> A GRAPHICS EXPLORATION</span></header>
<main>
<section class="intro"><div><div class="eyebrow"><span class="mini-line"></span> HUMAN CREATIVITY. MACHINE POSSIBILITY.</div><h1>A new dimension<br>of <em>making.</em><span class="asterisk">✳</span></h1><p>Same imagination. A different toolkit.<br>Explore how AI is reshaping the way we build in 3D.</p></div><aside class="intro-aside"><div class="orbit-art" aria-hidden="true"><span></span><span></span><span></span><b>↗</b></div><p>From placing every vertex<br>to exploring every possibility.</p><a href="#playground">Try the interactive demo <span>↓</span></a></aside></section>
<section id="playground" class="lab"><div class="lab-heading"><div><span class="section-kicker">THE INTERACTIVE LAB</span><h2>See the shift. Shape the outcome.</h2></div><span class="live-label"><span></span> LIVE 3D VIEWPORT</span></div>
<div class="workspace"><aside class="tool-panel"><div class="panel-top"><span class="section-kicker">EXPLORE A TECHNIQUE</span><span>01—03</span></div><div class="techniques" role="tablist" aria-label="AI technique">${Object.entries(techniques).map(([key,t],i)=>`<button class="technique ${i===0?'selected':''}" role="tab" id="tab-${key}" aria-controls="technique-panel" aria-selected="${i===0}" data-tech="${key}"><span class="tech-icon">${['◇','◈','⌘'][i]}</span><span><strong>${t.name}</strong><small>${t.short}</small></span><span class="tech-arrow">↗</span></button>`).join('')}</div>
<div class="prompt-section"><label for="prompt">YOUR CREATIVE DIRECTION <span>✳</span></label><form id="prompt-form"><textarea id="prompt" maxlength="240" rows="3">An organic ceramic vase, soft green glaze, sculptural curves</textarea><div class="prompt-bottom"><span>Local concept simulation</span><button type="submit" id="generate" aria-label="Apply creative direction">↗</button></div></form><p class="try-label">TRY A DIRECTION</p><div class="preset-chips">${Object.entries(presets).map(([key,p])=>`<button data-preset="${key}" class="chip ${key==='organic'?'chosen':''}">${p.label}</button>`).join('')}</div></div>
<div class="detail-control"><label for="detail">Surface detail <output id="detail-value">64</output></label><input id="detail" type="range" min="16" max="96" step="8" value="64"/><div><span>Coarse</span><span>Refined</span></div></div><div class="simulation-note"><span>ⓘ</span><p>An interactive illustration, not a live AI model. No account, API key, or upload needed.</p></div></aside>
<div class="viewport-panel"><div class="viewport-top"><span class="viewport-file"><span>◇</span> study_001 / ceramic vessel</span><span class="viewport-mode">PERSPECTIVE</span></div><div id="viewport" role="img" aria-label="Interactive 3D vessel. Left: traditional wireframe. Right: AI-assisted concept. Drag to orbit, scroll to zoom."><div class="viewport-label before"><span>01</span> BEFORE AI <small id="before-label">Manual modeling</small></div><div class="viewport-label after"><span>02</span> WITH AI <small id="after-label">Assisted concept</small></div><div id="split-line"><span>↔</span></div><div id="render-fallback" hidden>3D rendering is unavailable in this browser. Try enabling hardware acceleration. The workflow lessons below remain available.</div><div class="axes" aria-hidden="true"><span>Y</span><span>Z</span><span>X</span></div><p class="orbit-hint">DRAG TO ORBIT <span>·</span> SCROLL TO ZOOM</p></div><div class="viewport-controls"><button id="rotate" aria-label="Auto-rotate" class="control-button" aria-pressed="true">↻ <span>Auto-rotate</span></button><button id="wireframe" aria-label="Wireframe" class="control-button" aria-pressed="false">◇ <span>Wireframe</span></button><button id="reset" class="control-button" aria-label="Reset camera">⟲ <span>Reset view</span></button><span class="mesh-count" id="mesh-count"></span></div><div class="compare-control"><label for="compare">Before <span>Drag to compare</span> After</label><input id="compare" type="range" min="0" max="100" value="50" aria-label="Before and after comparison"/></div></div></div>
<div class="lab-bottom"><p id="status" role="status" aria-live="polite"><span class="status-dot"></span> Your idea, a new starting point. Try a direction above.</p><button id="export" class="export-button">${icon('download')} Export model <span>.obj</span></button></div></section>
<section id="workflow" class="workflow"><div class="workflow-heading"><span class="section-kicker">BEHIND THE PROCESS</span><h2>The tools evolve.<br>The artist stays essential.</h2><p>AI can accelerate exploration. Intent, judgment, and the final decisions are still human.</p></div><div id="technique-panel" class="lesson" role="tabpanel" aria-labelledby="tab-shape"></div></section>
<section id="about" class="about"><div><span class="section-kicker">A NOTE ON THIS EXPERIMENT</span><h2>Real possibilities.<br>Honest limitations.</h2></div><div><p>Form Lab is a school project about AI-assisted graphics modeling. The 3D models here are generated with procedural geometry in your browser. Prompts select curated parameters; no neural network runs in this demo.</p><p>Traditional workflows already include powerful automation. AI adds learned priors and new ways to explore ideas, with tradeoffs in control, consistency, compute cost, and data provenance.</p><a href="https://dreamfusion3d.github.io/" target="_blank" rel="noopener noreferrer">Explore the research that inspired this project ↗</a></div></section>
</main><footer><a class="footer-brand" href="#">formlab<span>✳</span></a><span>AN EXPLORATION OF AI × COMPUTER GRAPHICS</span><span>Made for learning. Built for curiosity.</span></footer>`;

let active = 'shape', current = { ...presets.organic }, detail = 64;
let renderer, controls, camera, beforeScene, afterScene, beforeMesh, afterMesh;
const viewport = document.querySelector('#viewport');
const status = document.querySelector('#status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let rotating = !reducedMotion;
document.querySelector('#rotate').setAttribute('aria-pressed', String(rotating));
function announce(message) { status.textContent = message; }
function updateLesson() {
 const t = techniques[active];
 document.querySelector('#technique-panel').setAttribute('aria-labelledby', `tab-${active}`);
 document.querySelector('#technique-panel').innerHTML = `<div class="lesson-title"><span>${t.number} / ${t.name.toUpperCase()}</span><h3>${t.title}</h3><p>${t.description}</p></div><div class="workflow-cards"><div><span class="card-label">THE TRADITIONAL WAY</span><p>${t.before}</p></div><div><span class="card-label green">THE AI-ASSISTED WAY ↗</span><p>${t.after}</p></div></div><div class="steps">${t.steps.map((s,i)=>`<span><b>0${i+1}</b>${s}</span>`).join('<i>→</i>')}</div><p class="caveat">${t.caveat}</p><a class="research-link" href="${t.url}" target="_blank" rel="noopener noreferrer">RESEARCH REFERENCE · ${t.source} ↗</a>`;
 document.querySelector('#before-label').textContent = active === 'refine' ? 'Noisy input' : active === 'material' ? 'Untextured surface' : 'Manual modeling';
 document.querySelector('#after-label').textContent = active === 'refine' ? 'Refined surface' : active === 'material' ? 'Material concept' : 'Assisted concept';
}
function setupScene() {
 const scene = new THREE.Scene(); scene.background = new THREE.Color('#17201f');
 const hemi = new THREE.HemisphereLight(0xf0f5dd,0x253830,2.7); scene.add(hemi);
 const key = new THREE.DirectionalLight(0xfff5df,5); key.position.set(3,5,4); scene.add(key);
 const rim = new THREE.DirectionalLight(0xc5e9bb,3); rim.position.set(-4,2,-3); scene.add(rim);
 const grid = new THREE.GridHelper(16,32,0x475750,0x2b3933); grid.position.y=-1.34; scene.add(grid);
 const base = new THREE.Mesh(new THREE.CylinderGeometry(1.34,1.34,0.12,80),new THREE.MeshStandardMaterial({color:0x27332e,roughness:0.85}));base.position.y=-1.33;scene.add(base);
 return scene;
}
function rebuild() {
 if (!renderer) return;
 for (const [scene,mesh] of [[beforeScene,beforeMesh],[afterScene,afterMesh]]) if(mesh) { scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose(); }
 const beforeGeometry = createVessel({detail:active==='refine'?40:24,shape:active==='shape'?'round':current.shape,noisy:active==='refine'});
 beforeMesh = new THREE.Mesh(beforeGeometry,new THREE.MeshStandardMaterial({color:active==='material'?0xadb2ac:0x8caa98,roughness:0.9,wireframe:active==='shape',side:THREE.DoubleSide}));
 afterMesh = new THREE.Mesh(createVessel({detail,shape:current.shape}),new THREE.MeshStandardMaterial({color:current.color,roughness:current.roughness,metalness:current.metalness,wireframe:document.querySelector('#wireframe').getAttribute('aria-pressed')==='true',side:THREE.DoubleSide}));
 beforeScene.add(beforeMesh);afterScene.add(afterMesh);
 document.querySelector('#mesh-count').textContent = `${Math.round(triangleCount(afterMesh.geometry)).toLocaleString()} triangles`;
}
function initialize3D() {
 try {
 renderer = new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.domElement.setAttribute('aria-hidden','true');viewport.prepend(renderer.domElement);
 beforeScene=setupScene();afterScene=setupScene();camera=new THREE.PerspectiveCamera(37,1,0.1,100);camera.position.set(3.6,1.65,5.7);
 controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=3.4;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*0.7;controls.autoRotate=rotating;controls.autoRotateSpeed=0.65;
 rebuild();
 new ResizeObserver(()=>{ const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix(); }).observe(viewport);
 const timer = new THREE.Clock();
 renderer.setAnimationLoop(()=>{const delta=Math.min(timer.getDelta(),0.1);controls.update(delta);const w=viewport.clientWidth,h=viewport.clientHeight,split=Math.round(w*Number(document.querySelector('#compare').value)/100);renderer.setScissorTest(true);renderer.setViewport(0,0,w,h);renderer.setScissor(0,0,split,h);renderer.render(beforeScene,camera);renderer.setScissor(split,0,w-split,h);renderer.render(afterScene,camera);renderer.setScissorTest(false);});
 } catch(error) { renderer?.dispose();renderer=null;document.querySelector('#render-fallback').hidden=false;document.querySelector('#export').disabled=true;announce('3D unavailable. You can still explore all three workflow lessons.');console.warn('WebGL unavailable:',error.message); }
}
function applyPreset(key) {
 current={...presets[key]};
 document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('chosen',b.dataset.preset===key));
 rebuild();
}
document.querySelectorAll('[data-tech]').forEach(button=>{
 button.addEventListener('click',()=>{active=button.dataset.tech;document.querySelectorAll('[data-tech]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});updateLesson();rebuild();announce(`${techniques[active].name}: compare the two approaches in the viewport.`);});
 button.tabIndex=button.dataset.tech==='shape'?0:-1;
 button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const tabs=[...document.querySelectorAll('[data-tech]')];let i=tabs.indexOf(button);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+tabs.length)%tabs.length;tabs[i].click();tabs[i].focus();}});
});
const prompts={organic:'An organic ceramic vase, soft green glaze, sculptural curves',terracotta:'A round terracotta vessel, warm clay finish',chrome:'A twisted chrome vase, sculptural silver metal'};
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#prompt').value=prompts[b.dataset.preset];applyPreset(b.dataset.preset);announce(`${presets[b.dataset.preset].label} applied. This is a procedural concept.`);}));
document.querySelector('#prompt-form').addEventListener('submit',e=>{e.preventDefault();const prompt=document.querySelector('#prompt').value.trim();if(!prompt){announce('Add a direction first. Try “terracotta vase” or “twisted chrome”.');return;}const result=interpretPrompt(prompt);applyPreset(result.key);announce(result.supported?`Concept updated: ${result.label}. Keyword-based simulation; no AI inference.`:'This demo supports ceramic, terracotta, and chrome vessels. Showing the organic ceramic preset.');});
document.querySelector('#detail').addEventListener('input',e=>{detail=Number(e.target.value);document.querySelector('#detail-value').value=detail;rebuild();});
document.querySelector('#compare').addEventListener('input',e=>{document.querySelector('#split-line').style.left=`${e.target.value}%`;});
document.querySelector('#rotate').addEventListener('click',e=>{rotating=!rotating;e.currentTarget.setAttribute('aria-pressed',String(rotating));if(controls)controls.autoRotate=rotating;});
document.querySelector('#wireframe').addEventListener('click',e=>{const enabled=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(enabled));if(afterMesh)afterMesh.material.wireframe=enabled;});
document.querySelector('#reset').addEventListener('click',()=>{if(controls){camera.position.set(3.6,1.65,5.7);controls.target.set(0,0,0);controls.update();}document.querySelector('#compare').value=50;document.querySelector('#split-line').style.left='50%';announce('Camera and comparison reset.');});
document.querySelector('#export').addEventListener('click',()=>{if(!afterMesh)return;const data=new OBJExporter().parse(afterMesh);const url=URL.createObjectURL(new Blob([`# Form Lab procedural vessel. Geometry only; materials are not exported.\n${data}`],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='formlab-vessel.obj';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Model exported as OBJ. Import into Blender to continue; materials are not included.');});
updateLesson();initialize3D();
