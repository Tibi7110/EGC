import * as THREE from 'three';
export const presets = {
  organic: { label: 'Organic ceramic', color: '#adc794', shape: 'organic', roughness: 0.38, metalness: 0.08 },
  terracotta: { label: 'Terracotta vessel', color: '#cb896b', shape: 'round', roughness: 0.85, metalness: 0 },
  chrome: { label: 'Sculptural chrome', color: '#cbd6d9', shape: 'twist', roughness: 0.17, metalness: 0.9 },
};
export function interpretPrompt(prompt) {
  const text = prompt.toLowerCase();
  const key = /chrome|silver|metal|twist/.test(text) ? 'chrome' : /terra|clay|round|warm/.test(text) ? 'terracotta' : 'organic';
  return { ...presets[key], key, supported: /vase|vessel|ceramic|organic|chrome|silver|metal|twist|terra|clay|round|warm|green/.test(text) };
}
export function createVessel({ detail = 64, shape = 'organic', noisy = false } = {}) {
  const levels = Math.max(8, Math.round(detail / 2));
  const points = [];
  // Outer profile continues over the rim and down the interior, making an open vessel.
  function radius(t) {
    const belly = Math.sin(Math.PI * t) * 0.59;
    return shape === 'round' ? 0.38 + belly : shape === 'twist' ? 0.32 + belly * 0.8 + Math.sin(t * 8) * 0.11 : 0.32 + belly + Math.sin(t * 6.4) * 0.11;
  }
  points.push(new THREE.Vector2(0, -1.25));
  for (let i = 0; i <= levels; i++) { const t = i / levels; points.push(new THREE.Vector2(radius(t), t * 2.5 - 1.25)); }
  for (let i = levels; i >= 1; i--) { const t = i / levels; points.push(new THREE.Vector2(Math.max(0.06, radius(t) - 0.075), t * 2.5 - 1.25)); }
  points.push(new THREE.Vector2(0, -1.16));
  const geometry = new THREE.LatheGeometry(points, detail);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const flute = shape === 'twist' ? Math.cos(a * 7 + y * 2) * 0.075 : Math.cos(a * 18 + y * 0.8) * 0.018;
    const noise = noisy ? Math.sin(a * 13 + y * 21) * Math.cos(y * 18) * 0.075 : 0;
    const scale = 1 + flute + noise;
    pos.setXYZ(i, x * scale, y, z * scale);
  }
  geometry.computeVertexNormals();
  return geometry;
}
export function triangleCount(geometry) { return geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3; }
