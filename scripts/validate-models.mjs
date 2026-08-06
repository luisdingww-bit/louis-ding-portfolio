import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';

const loader = new GLTFLoader();
const files = ['pyramid', 'eiffel', 'empire', 'parthenon', 'colosseum'];
let pending = files.length;
for (const f of files) {
  const buf = fs.readFileSync('public/models/' + f + '.glb');
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  loader.parse(
    ab,
    '',
    (gltf) => {
      let meshes = 0, verts = 0;
      const colors = [];
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          meshes++;
          verts += o.geometry.attributes.position.count;
          const m = o.material;
          if (m && m.color) colors.push(m.color.getHexString());
        }
      });
      console.log(f.padEnd(10), 'OK meshes=' + meshes, 'verts=' + verts, 'color=' + (colors[0] || '?'));
      if (--pending === 0) console.log('ALL OK');
    },
    (err) => {
      console.log(f, 'PARSE ERR', err && err.message);
      if (--pending === 0) console.log('done');
    }
  );
}
