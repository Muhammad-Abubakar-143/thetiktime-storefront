'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

function WatchRings() {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    const targetX = pointer.y * 0.25;
    const targetY = pointer.x * 0.4;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.05
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.x * 0.3,
      0.04
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      pointer.y * 0.2,
      0.04
    );
  });

  const rings = useMemo(
    () => [
      { radius: 1.6, tube: 0.045, speed: 0.18, color: '#c9a86a' },
      { radius: 1.15, tube: 0.035, speed: -0.24, color: '#e8e6e1' },
      { radius: 0.75, tube: 0.03, speed: 0.32, color: '#c9a86a' },
      { radius: 0.42, tube: 0.025, speed: -0.4, color: '#8a6f3e' },
    ],
    []
  );

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <Float
          key={i}
          speed={ring.speed * 6}
          rotationIntensity={0.4}
          floatIntensity={0.6}
          floatingRange={[-0.05, 0.05]}
        >
          <mesh rotation={[Math.PI / 2 + i * 0.18, i * 0.4, 0]}>
            <torusGeometry args={[ring.radius, ring.tube, 48, 180]} />
            <meshStandardMaterial
              color={ring.color}
              metalness={1}
              roughness={0.15}
              envMapIntensity={1.4}
            />
          </mesh>
        </Float>
      ))}

      {/* central dial */}
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 64]} />
        <meshStandardMaterial
          color="#0a0a0b"
          metalness={0.9}
          roughness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 64]} />
        <meshStandardMaterial
          color="#1a1a1d"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 0.26;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.06, Math.sin(angle) * r]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.018, 0.004, 0.04]} />
            <meshStandardMaterial
              color="#c9a86a"
              metalness={1}
              roughness={0.2}
              emissive="#3a2a14"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      {/* hands */}
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.012, 0.004, 0.18]} />
        <meshStandardMaterial color="#e8e6e1" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.075, 0]} rotation={[0, Math.PI / 2, -0.9]}>
        <boxGeometry args={[0.01, 0.003, 0.13]} />
        <meshStandardMaterial color="#c9a86a" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#c9a86a" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function FloatingGears() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.08;
      ref.current.rotation.x += delta * 0.04;
    }
  });
  return (
    <group ref={ref} position={[2.6, 1.2, -1]}>
      <mesh>
        <torusGeometry args={[0.35, 0.05, 24, 80]} />
        <meshStandardMaterial
          color="#8a6f3e"
          metalness={1}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      pointer.y * 0.15,
      0.03
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#c9a86a"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8e6" />
        <pointLight position={[-4, -2, 2]} intensity={1.5} color="#c9a86a" />
        <spotLight
          position={[0, 6, 4]}
          angle={0.4}
          penumbra={1}
          intensity={2.2}
          color="#ffeec8"
        />

        <WatchRings />
        <FloatingGears />
        <FloatingParticles />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
