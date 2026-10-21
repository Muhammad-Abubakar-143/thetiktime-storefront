'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function AbstractForm() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.05;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial
            color="#c9a86a"
            metalness={0.9}
            roughness={0.3}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={1}>
        <mesh rotation={[0.5, 0, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 120]} />
          <meshStandardMaterial
            color="#e8e6e1"
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function StoryScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff8e6" />
        <pointLight position={[-4, -2, 2]} intensity={1} color="#c9a86a" />
        <AbstractForm />
      </Suspense>
    </Canvas>
  );
}
