import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────
   PURE THREE.JS ONLY — no @react-three/drei
   All materials use meshBasicMaterial (no lights needed)
───────────────────────────────────────────────────────── */

/* ── Large central icosahedron ───────────────────────────── */
function CoreIcosa() {
  const ref = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.10 + mouse.y * 0.25;
    ref.current.rotation.y = t * 0.14 + mouse.x * 0.35;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe opacity={1} transparent={false} />
    </mesh>
  );
}

/* ── Solid pulsing inner sphere ──────────────────────────── */
function InnerSphere() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 0.9 + Math.sin(t * 1.1) * 0.06;
    ref.current.scale.setScalar(s);
    ref.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.03;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.BackSide} />
    </mesh>
  );
}

/* ── Outer wireframe octahedron ──────────────────────────── */
function OuterOcta() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = -t * 0.05;
    ref.current.rotation.y =  t * 0.07;
    ref.current.rotation.z =  t * 0.025;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[3.2, 0]} />
      <meshBasicMaterial color="#ffffff" wireframe opacity={0.35} transparent />
    </mesh>
  );
}

/* ── Three spinning torus rings ──────────────────────────── */
function Ring({ radius, tube, tiltX, tiltZ, speed, opacity }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = tiltX + t * speed * 0.7;
    ref.current.rotation.z = tiltZ + t * speed;
    ref.current.material.opacity = opacity + Math.sin(t * 0.6) * 0.05;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 200]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Particle sphere cloud ───────────────────────────────── */
function Particles({ count = 300 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.8 + Math.random() * 3;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.045}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Floating wireframe cubes ────────────────────────────── */
function Cubes() {
  const data = useMemo(() => Array.from({ length: 12 }, () => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 11,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4
    ),
    speed:  0.3 + Math.random() * 0.7,
    size:   0.06 + Math.random() * 0.16,
    phase:  Math.random() * Math.PI * 2,
    baseY:  0,
  })), []);

  data.forEach(d => d.baseY = d.pos.y);
  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((r, i) => {
      if (!r) return;
      r.rotation.x = t * data[i].speed;
      r.rotation.y = t * data[i].speed * 0.8;
      r.position.y = data[i].baseY + Math.sin(t * 0.5 + data[i].phase) * 0.7;
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => refs.current[i] = el} position={d.pos}>
          <boxGeometry args={[d.size, d.size, d.size]} />
          <meshBasicMaterial color="#ffffff" wireframe opacity={0.55} transparent />
        </mesh>
      ))}
    </>
  );
}

/* ── Star field ──────────────────────────────────────────── */
function Stars({ count = 1500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.12} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Perspective grid ────────────────────────────────────── */
function Grid() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.5, -5]}>
      <planeGeometry args={[50, 50, 28, 28]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Camera drift controller ─────────────────────────────── */
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.10) * 0.6;
    camera.position.y = Math.cos(t * 0.08) * 0.35;
    camera.position.z = 8 + (scrollProgress?.current ?? 0) * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Main export ─────────────────────────────────────────── */
export default function HeroCanvas({ scrollProgress }) {
  const spRef = useRef(0);

  // Convert framer-motion value to ref
  if (scrollProgress?.on) {
    scrollProgress.on('change', v => { spRef.current = v; });
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <CameraRig scrollProgress={spRef} />

        {/* No lights needed — meshBasicMaterial is unlit */}
        <Stars count={1500} />
        <InnerSphere />
        <CoreIcosa />
        <OuterOcta />

        <Ring radius={2.8} tube={0.010} tiltX={1.2} tiltZ={0.0} speed={0.10} opacity={0.70} />
        <Ring radius={3.6} tube={0.007} tiltX={0.5} tiltZ={0.3} speed={0.07} opacity={0.45} />
        <Ring radius={4.4} tube={0.005} tiltX={-0.4} tiltZ={0.6} speed={0.05} opacity={0.28} />

        <Particles count={300} />
        <Cubes />
        <Grid />
      </Canvas>
    </div>
  );
}
