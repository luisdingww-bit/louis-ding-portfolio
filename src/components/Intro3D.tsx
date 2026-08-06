import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Opening WebGL moment (desktop only, mounted by App).
 * Theme: "Architecture × AI × Digital Fabrication".
 *
 * Now driven by REAL glTF models (public/models/*.glb, generated locally,
 * CC0). Each famous building is revealed by a clipping plane that sweeps
 * upward — like it is being 3D-printed / fabricated layer by layer — then
 * the showcase loops to the next icon forever. The page STAYS until the
 * visitor clicks anywhere to ENTER.
 *
 * WebGL capability check + App-level ErrorBoundary guarantee no blank screen.
 */

const H = 4.0; // every model is normalized to this height, base sitting at y=0
const REVEAL_DUR = 1.7; // seconds for the build-up clip reveal
const HOLD = 1.8; // seconds held after reveal before switching
const CYCLE = (REVEAL_DUR + HOLD) * 1000;

const MODELS = [
  { name: 'Pyramid of Giza · 吉萨金字塔', file: 'pyramid.glb' },
  { name: 'Eiffel Tower · 埃菲尔铁塔', file: 'eiffel.glb' },
  { name: 'Empire State · 帝国大厦', file: 'empire.glb' },
  { name: 'Parthenon · 帕特农神庙', file: 'parthenon.glb' },
  { name: 'Colosseum · 罗马斗兽场', file: 'colosseum.glb' },
];

function makeCircleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const N = 600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cA = new THREE.Color('#E8B04B');
    const cB = new THREE.Color('#cfe3ef');
    for (let i = 0; i < N; i++) {
      const r = 3 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = Math.random() * 8 - 2;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const c = Math.random() > 0.7 ? cA : cB;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);
  const tex = useMemo(() => makeCircleTexture(), []);
  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.05;
    p.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        map={tex}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function BuildingShow({
  models,
  index,
  clipPlane,
}: {
  models: THREE.Object3D[];
  index: number;
  clipPlane: THREE.Plane;
}) {
  const group = useRef<THREE.Group>(null);
  const revealStart = useRef<number | null>(null);

  // restart the build-up reveal whenever the building switches
  useEffect(() => {
    revealStart.current = null;
    clipPlane.constant = -0.15; // start hidden to avoid a one-frame flash
  }, [index, clipPlane]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    if (revealStart.current == null) revealStart.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - revealStart.current;
    const p = Math.min(Math.max(t / REVEAL_DUR, 0), 1);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
    // clipped where y > constant; sweep constant from below base to above top
    clipPlane.constant = -0.15 + e * (H + 0.45);
  });

  return (
    <group ref={group}>
      <primitive object={models[index]} />
    </group>
  );
}

/**
 * Camera controls for the intro:
 *  - RIGHT mouse button drag  -> orbit/rotate around the building
 *  - mouse WHEEL              -> dolly in / out (zoom)
 *  - LEFT mouse button        -> left free (used by the wrapper onClick to ENTER)
 * A gentle autoRotate gives the "turntable" showcase feel and pauses while
 * the user is actively dragging.
 */
function Controls() {
  const { camera, gl } = useThree();
  const ref = useRef<OrbitControls | null>(null);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(0, H * 0.5, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.2;
    controls.maxDistance = 16;
    // Map RIGHT -> rotate, MIDDLE -> dolly, LEFT -> null (free for click-to-enter).
    controls.mouseButtons = {
      LEFT: null as unknown as THREE.MOUSE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.update();
    ref.current = controls;
    return () => {
      controls.dispose();
      ref.current = null;
    };
  }, [camera, gl]);
  useFrame(() => ref.current?.update());
  return null;
}

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [titleIn, setTitleIn] = useState(false);
  const [models, setModels] = useState<THREE.Object3D[] | null>(null);
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.15), []);

  useEffect(() => {
    // Guard: if WebGL is unavailable, skip the intro entirely (no crash).
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) {
        onDone();
        return;
      }
    } catch {
      onDone();
      return;
    }
    setTitleIn(true);

    // Preload the real glTF models (same-origin static assets).
    const loader = new GLTFLoader();
    let canceled = false;
    Promise.all(
      MODELS.map((m) =>
        fetch(import.meta.env.BASE_URL + 'models/' + m.file)
          .then((r) => {
            if (!r.ok) throw new Error('http ' + r.status);
            return r.arrayBuffer();
          })
          .then(
            (buf) =>
              new Promise<THREE.Object3D>((res, rej) =>
                loader.parse(buf, '', (g) => res(g.scene), rej)
              )
          )
      )
    )
      .then((scenes) => {
        if (canceled) return;
        scenes.forEach((s) =>
          s.traverse((o) => {
            const mesh = o as THREE.Mesh;
            if (mesh.isMesh && mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((mat) => {
                mat.clippingPlanes = [clipPlane];
                mat.clipShadows = true;
                mat.side = THREE.DoubleSide; // show inner walls when clipped
              });
            }
          })
        );
        setModels(scenes);
      })
      .catch(() => {
        // Any model failure -> just reveal the site, never blank-screen.
        onDone();
      });

    // Loop the building showcase; the page stays until the user clicks to enter.
    const id = window.setInterval(() => {
      setBuildingIndex((i) => (i + 1) % MODELS.length);
    }, CYCLE);
    return () => {
      canceled = true;
      window.clearInterval(id);
    };
  }, [onDone, clipPlane]);

  const enter = () => {
    setHide(true);
    window.setTimeout(onDone, 450);
  };

  return (
    <div
      onClick={enter}
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-[#051A24] transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`@keyframes introFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <Canvas
        camera={{ position: [0, H * 0.55, 8], fov: 42 }}
        dpr={[1, 2]}
        onCreated={({ gl, camera }) => {
          gl.localClippingEnabled = true;
          camera.lookAt(0, H * 0.5, 0);
        }}
      >
        <fog attach="fog" args={['#051A24', 9, 22]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 4]} intensity={1.15} />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#E8B04B" />
        <gridHelper args={[18, 18, '#1d4254', '#0e2433']} position={[0, 0, 0]} />
        <Controls />
        {models && (
          <BuildingShow models={models} index={buildingIndex} clipPlane={clipPlane} />
        )}
        {models && <Particles />}
      </Canvas>

      {/* Theme title */}
      <span
        className={`pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#E8B04B] transition-opacity duration-1000 sm:text-xs ${
          titleIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Architecture × AI × Digital Fabrication
      </span>

      {/* Current building name — fades in on each switch */}
      <span
        key={buildingIndex}
        className="pointer-events-none absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center text-base font-medium tracking-wide text-white/90 sm:text-lg"
        style={{ animation: 'introFade .6s ease both' }}
      >
        {MODELS[buildingIndex].name}
      </span>

      {/* Click to enter */}
      <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.25em] text-white/60">
        左键点击进入 · 右键拖动旋转 · 滚轮缩放
      </span>
    </div>
  );
}
