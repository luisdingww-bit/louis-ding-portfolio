// Generate 5 iconic-building GLB models procedurally with three.js.
// Output: public/models/{pyramid,eiffel,empire,parthenon,colosseum}.glb
// All geometry original (CC0, no attribution needed). Standard glTF 2.0 binary.
import * as THREE from 'three';
import * as BGU from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import fs from 'fs';
import path from 'path';

const mergeGeometries = BGU.mergeGeometries || BGU.mergeBufferGeometries;
const TARGET_H = 4.0; // every model normalized to this height, base at y=0

function m4(pos, rot = [0, 0, 0], scl = [1, 1, 1]) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2]));
  m.compose(new THREE.Vector3(pos[0], pos[1], pos[2]), q, new THREE.Vector3(scl[0], scl[1], scl[2]));
  return m;
}

// ---- building generators: return a merged, normalized BufferGeometry ----
function build(triangles) {
  const parts = [];
  const add = (geo, pos, rot, scl) => {
    pos = pos || [0, 0, 0];
    rot = rot || [0, 0, 0];
    scl = scl || [1, 1, 1];
    geo.applyMatrix4(m4(pos, rot, scl));
    if (geo.index) geo = geo.toNonIndexed(); // keep all parts non-indexed for a clean merge
    parts.push(geo);
  };
  triangles(add);
  let merged = mergeGeometries(parts, false);
  merged.computeBoundingBox();
  const bb = merged.boundingBox;
  const cx = (bb.min.x + bb.max.x) / 2;
  const cz = (bb.min.z + bb.max.z) / 2;
  merged.translate(-cx, -bb.min.y, -cz);
  merged.computeBoundingBox();
  const h = merged.boundingBox.max.y || 1;
  merged.scale(TARGET_H / h, TARGET_H / h, TARGET_H / h);
  if (!merged.attributes.normal) merged.computeVertexNormals();
  return merged;
}

// 1) Pyramid of Giza -------------------------------------------------------
function genPyramid() {
  return build((add) => {
    add(new THREE.BoxGeometry(3.4, 0.3, 3.4), [0, 0.15, 0]);
    const py = new THREE.ConeGeometry(2.4, 3.2, 4);
    py.rotateY(Math.PI / 4);
    add(py, [0, 0.3 + 1.6, 0]);
  });
}

// 2) Eiffel Tower ----------------------------------------------------------
function genEiffel() {
  return build((add) => {
    const leg = (angle, rB, rT, yB, yT, steps, tB, tT, center = false) => {
      for (let i = 0; i < steps; i++) {
        const s = (i + 0.5) / steps;
        const r = rB + (rT - rB) * s;
        const y = yB + (yT - yB) * s;
        const t = tB + (tT - tB) * s;
        const px = center ? 0 : Math.cos(angle) * r;
        const pz = center ? 0 : Math.sin(angle) * r;
        const rotY = center ? 0 : Math.PI / 2 - angle;
        add(new THREE.BoxGeometry(t, (yT - yB) / steps * 1.3, t), [px, y, pz], [0, rotY, 0]);
      }
    };
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    angles.forEach((a) => leg(a, 1.7, 0.8, 0, 1.4, 7, 0.5, 0.32));
    angles.forEach((a) => leg(a, 0.8, 0.32, 1.4, 2.4, 6, 0.32, 0.18));
    // two platforms (square frames)
    const frame = (y, r, t) => {
      add(new THREE.BoxGeometry(r * 2 + t, 0.1, t), [0, y, r]);
      add(new THREE.BoxGeometry(r * 2 + t, 0.1, t), [0, y, -r]);
      add(new THREE.BoxGeometry(t, 0.1, r * 2 + t), [r, y, 0]);
      add(new THREE.BoxGeometry(t, 0.1, r * 2 + t), [-r, y, 0]);
    };
    frame(1.4, 0.8, 0.12);
    frame(2.4, 0.32, 0.1);
    // tapering top tower + antenna
    leg(0, 0.32, 0.05, 2.4, 3.4, 6, 0.16, 0.04, true);
    add(new THREE.CylinderGeometry(0.03, 0.05, 0.45, 10), [0, 3.62, 0]);
  });
}

// 3) Empire State Building ------------------------------------------------
function genEmpire() {
  return build((add) => {
    add(new THREE.BoxGeometry(2.4, 1.2, 2.4), [0, 0.6, 0]);
    add(new THREE.BoxGeometry(1.95, 0.5, 1.95), [0, 1.45, 0]);
    add(new THREE.BoxGeometry(1.55, 0.5, 1.55), [0, 1.95, 0]);
    add(new THREE.BoxGeometry(1.15, 1.0, 1.15), [0, 2.7, 0]);
    add(new THREE.BoxGeometry(0.85, 0.4, 0.85), [0, 3.4, 0]);
    add(new THREE.CylinderGeometry(0.07, 0.13, 0.9, 12), [0, 4.05, 0]);
  });
}

// 4) Parthenon -------------------------------------------------------------
function genParthenon() {
  return build((add) => {
    add(new THREE.BoxGeometry(3.4, 0.2, 1.8), [0, 0.1, 0]);
    add(new THREE.BoxGeometry(3.1, 0.18, 1.6), [0, 0.29, 0]);
    const colH = 1.7, colR = 0.14, base = 0.29;
    const col = (x, z) => add(new THREE.CylinderGeometry(colR, colR, colH, 14), [x, base + colH / 2, z]);
    [-1.35, -0.675, 0, 0.675, 1.35].forEach((x) => { col(x, 0.62); col(x, -0.62); });
    [-0.31, 0.31].forEach((z) => { col(1.35, z); col(-1.35, z); });
    const colTop = base + colH; // 1.99
    add(new THREE.BoxGeometry(3.5, 0.35, 1.9), [0, colTop + 0.175, 0]);
    const tri = new THREE.Shape();
    tri.moveTo(-1.78, 0); tri.lineTo(1.78, 0); tri.lineTo(0, 0.7); tri.closePath();
    const ped = new THREE.ExtrudeGeometry(tri, { depth: 1.9, bevelEnabled: false });
    ped.translate(0, colTop + 0.35, -0.95);
    add(ped);
  });
}

// 5) Colosseum -------------------------------------------------------------
function genColosseum() {
  return build((add) => {
    const Hw = 1.6, Ri = 1.0, Ro = 1.28;
    const pts = [
      new THREE.Vector2(Ri, 0),
      new THREE.Vector2(Ro, 0),
      new THREE.Vector2(Ro, Hw),
      new THREE.Vector2(Ri, Hw),
      new THREE.Vector2(Ri, 0),
    ];
    const wall = new THREE.LatheGeometry(pts, 80);
    wall.scale(1.35, 1, 1);
    add(wall);
    const Rmid = (Ri + Ro) / 2;
    const Rx = Rmid * 1.35, Rz = Rmid;
    const Ndiv = 22;
    for (let i = 0; i < Ndiv; i++) {
      const a = (i / Ndiv) * Math.PI * 2;
      add(new THREE.BoxGeometry(0.05, Hw, 0.05), [Math.cos(a) * Rx, Hw / 2, Math.sin(a) * Rz]);
    }
    [0.5, 1.05].forEach((y) => {
      const ring = new THREE.TorusGeometry(Rmid, 0.04, 6, 80);
      ring.rotateX(Math.PI / 2);
      ring.scale(1.35, 1, 1);
      add(ring, [0, y, 0]);
    });
  });
}

// ---- GLB writer (standard glTF 2.0 binary) ----
function writeGLB(geometry, color, outPath) {
  const pos = geometry.attributes.position;
  const nor = geometry.attributes.normal;
  const index = geometry.index;
  let idxArr;
  if (index) {
    idxArr = index.array instanceof Uint32Array ? index.array : new Uint32Array(index.array);
  } else {
    idxArr = new Uint32Array(pos.count);
    for (let i = 0; i < pos.count; i++) idxArr[i] = i;
  }
  const posF = new Float32Array(pos.array);
  const norF = new Float32Array(nor.array);
  const posBytes = Buffer.from(posF.buffer, posF.byteOffset, posF.byteLength);
  const norBytes = Buffer.from(norF.buffer, norF.byteOffset, norF.byteLength);
  const idxBytes = Buffer.from(idxArr.buffer, idxArr.byteOffset, idxArr.byteLength);
  const bin = Buffer.concat([posBytes, norBytes, idxBytes]);

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.count; i++) {
    for (let c = 0; c < 3; c++) {
      const v = posF[i * 3 + c];
      if (v < min[c]) min[c] = v;
      if (v > max[c]) max[c] = v;
    }
  }

  const gltf = {
    asset: { version: '2.0', generator: 'louis-portfolio-gen' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0, mode: 4 }] }],
    materials: [{
      pbrMetallicRoughness: {
        baseColorFactor: [color[0], color[1], color[2], 1.0],
        metallicFactor: 0.05,
        roughnessFactor: 0.85,
      },
    }],
    buffers: [{ byteLength: bin.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes.length, target: 34962 },
      { buffer: 0, byteOffset: posBytes.length, byteLength: norBytes.length, target: 34962 },
      { buffer: 0, byteOffset: posBytes.length + norBytes.length, byteLength: idxBytes.length, target: 34963 },
    ],
    accessors: [
      { bufferView: 0, componentType: 5126, count: pos.count, type: 'VEC3', min, max },
      { bufferView: 1, componentType: 5126, count: pos.count, type: 'VEC3' },
      { bufferView: 2, componentType: 5125, count: idxArr.length, type: 'SCALAR' },
    ],
  };

  let jsonBuf = Buffer.from(JSON.stringify(gltf), 'utf8');
  const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
  if (jsonPad) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);
  const binPad = (4 - (bin.length % 4)) % 4;
  const binPadded = binPad ? Buffer.concat([bin, Buffer.alloc(binPad, 0)]) : bin;

  const total = 12 + 8 + jsonBuf.length + 8 + binPadded.length;
  const out = Buffer.alloc(total);
  const dv = new DataView(out.buffer);
  let o = 0;
  dv.setUint32(o, 0x46546c67, true); o += 4; // 'glTF'
  dv.setUint32(o, 2, true); o += 4; // version
  dv.setUint32(o, total, true); o += 4; // total length
  dv.setUint32(o, jsonBuf.length, true); o += 4;
  dv.setUint32(o, 0x4e4f534a, true); o += 4; // 'JSON'
  jsonBuf.copy(out, o); o += jsonBuf.length;
  dv.setUint32(o, binPadded.length, true); o += 4;
  dv.setUint32(o, 0x004e4942, true); o += 4; // 'BIN\0'
  binPadded.copy(out, o);

  fs.writeFileSync(outPath, out);
}

// ---- run ----
const OUT = path.resolve('public/models');
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  { file: 'pyramid.glb', color: [0.83, 0.73, 0.53], gen: genPyramid },
  { file: 'eiffel.glb', color: [0.34, 0.29, 0.26], gen: genEiffel },
  { file: 'empire.glb', color: [0.87, 0.86, 0.83], gen: genEmpire },
  { file: 'parthenon.glb', color: [0.93, 0.92, 0.89], gen: genParthenon },
  { file: 'colosseum.glb', color: [0.81, 0.73, 0.59], gen: genColosseum },
];

for (const j of jobs) {
  const geo = j.gen();
  const p = path.join(OUT, j.file);
  writeGLB(geo, j.color, p);
  const kb = (fs.statSync(p).size / 1024).toFixed(1);
  console.log(`wrote ${j.file}  ${kb} KB  verts=${geo.attributes.position.count} tris=${(geo.attributes.position.count / 3) | 0}`);
}
console.log('done');
