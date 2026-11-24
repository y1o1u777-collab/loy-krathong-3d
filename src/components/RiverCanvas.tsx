import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import KrathongModel from './KrathongModel'
import type { BaseType, FlowerType, Krathong } from '../types'

interface RiverCanvasProps {
  mode: 'showcase' | 'preview' | 'river' | 'launch'
  baseType?: BaseType
  flowerType?: FlowerType
  items?: Krathong[]
  selectedId?: string | null
  onSelect?: (item: Krathong) => void
}

function RiverWater({ lowPower }: { lowPower: boolean }) {
  const water = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(54, 60, lowPower ? 48 : 90, lowPower ? 56 : 100)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [lowPower])

  useFrame(({ clock }) => {
    if (!water.current) return
    const t = clock.getElapsedTime()
    const position = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i)
      const z = position.getZ(i)
      const wave = Math.sin(x * 0.42 + t * 0.72) * 0.035 + Math.cos(z * 0.3 - t * 0.58) * 0.028
      position.setY(i, wave)
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={water} geometry={geometry} position={[0, -0.08, -5]} receiveShadow>
      <meshStandardMaterial color="#17102b" metalness={0.72} roughness={0.22} emissive="#20103f" emissiveIntensity={0.18} />
    </mesh>
  )
}

function MoonAndReflection() {
  const glow = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (glow.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.7) * 0.025
      glow.current.scale.setScalar(pulse)
    }
  })
  return (
    <group>
      <mesh position={[0, 7.1, -22]}>
        <sphereGeometry args={[1.48, 48, 48]} />
        <meshBasicMaterial color="#ffe7a0" />
      </mesh>
      <mesh ref={glow} position={[0, 7.1, -22]}>
        <sphereGeometry args={[1.95, 40, 40]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 4.8, -17]} color="#f9d67b" intensity={1.9} distance={32} decay={2} />
      {Array.from({ length: 19 }, (_, i) => (
        <mesh key={i} position={[(i % 3 - 1) * (0.12 + i * 0.012), -0.015 + i * 0.001, 4 - i * 1.18]} scale={[0.08 + (i % 4) * 0.025, 0.012, 0.32 + (i % 3) * 0.12]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.12 + (i % 4) * 0.035} />
        </mesh>
      ))}
    </group>
  )
}

function Fireflies({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null)
  const points = useMemo(() => Array.from({ length: lowPower ? 24 : 44 }, (_, i) => ({
    x: Math.sin(i * 78.23) * 13,
    y: 0.5 + ((i * 17) % 19) * 0.21,
    z: -19 + ((i * 29) % 39),
    phase: i * 0.73,
    size: 0.018 + (i % 4) * 0.009,
  })), [lowPower])
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.children.forEach((child, index) => {
        const point = points[index]
        child.position.y = point.y + Math.sin(clock.getElapsedTime() * 1.4 + point.phase) * 0.14
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        material.opacity = 0.35 + (Math.sin(clock.getElapsedTime() * 2.2 + point.phase) + 1) * 0.3
      })
    }
  })
  return (
    <group ref={group}>
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[point.size, 8, 8]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function RiverWorld({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <color attach="background" args={['#10071f']} />
      <fog attach="fog" args={['#10071f', 18, 47]} />
      <ambientLight intensity={0.85} color="#a89bd2" />
      <directionalLight position={[-6, 10, 5]} intensity={1.05} color="#b9a6ff" castShadow={!lowPower} />
      <pointLight position={[8, 5, 2]} intensity={0.7} color="#7c3aed" distance={30} />
      <Stars radius={90} depth={55} count={lowPower ? 650 : 1600} factor={2.3} saturation={0.4} fade speed={0.35} />
      <MoonAndReflection />
      <RiverWater lowPower={lowPower} />
      <Fireflies lowPower={lowPower} />
    </>
  )
}

function LaunchDrift({ baseType, flowerType }: { baseType: BaseType; flowerType: FlowerType }) {
  const group = useRef<THREE.Group>(null)
  const start = useRef<number | null>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    const startedAt = start.current ?? clock.getElapsedTime()
    if (start.current === null) start.current = startedAt
    const elapsed = clock.getElapsedTime() - startedAt
    const progress = Math.min(elapsed / 7, 1)
    group.current.position.z = 3 - progress * 9.5
    group.current.position.x = Math.sin(progress * Math.PI * 2) * 0.28
    group.current.scale.setScalar(1.12 - progress * 0.24)
  })
  return (
    <group ref={group}>
      <KrathongModel baseType={baseType} flowerType={flowerType} scale={1.05} spin />
    </group>
  )
}

function LaunchCamera() {
  const start = useRef<number | null>(null)
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock, camera }) => {
    const startedAt = start.current ?? clock.getElapsedTime()
    if (start.current === null) start.current = startedAt
    const progress = Math.min((clock.getElapsedTime() - startedAt) / 7, 1)
    const krathongZ = 3 - progress * 9.5
    desiredPosition.set(0, 6.5, krathongZ + 11)
    lookTarget.set(0, 0.85, krathongZ)
    camera.position.lerp(desiredPosition, 0.045)
    camera.lookAt(lookTarget)
  })
  return null
}

export default function RiverCanvas({ mode, baseType = 'banana', flowerType = 'marigold', items = [], selectedId, onSelect }: RiverCanvasProps) {
  const isRiver = mode === 'river'
  const isLaunch = mode === 'launch'
  const isShowcase = mode === 'showcase'
  const isPreview = mode === 'preview'
  const visibleItems = items.slice(0, 18)
  const smallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches

  return (
    <Canvas
      shadows={!smallScreen}
      dpr={smallScreen ? [1, 1.25] : [1, 1.7]}
      camera={isRiver ? { position: [0, 9.5, 19], fov: 50 } : isLaunch ? { position: [0, 6.5, 14], fov: 44 } : { position: [4.2, 3.9, 8.5], fov: 42 }}
      gl={{ antialias: !smallScreen, alpha: false, powerPreference: smallScreen ? 'default' : 'high-performance' }}
    >
      <Suspense fallback={null}>
        <RiverWorld lowPower={smallScreen} />
        {isShowcase && (
          <Float speed={1.45} rotationIntensity={0.08} floatIntensity={0.22}>
            <KrathongModel baseType={baseType} flowerType={flowerType} scale={1.35} animateFloat={false} spin />
          </Float>
        )}
        {isPreview && <KrathongModel baseType={baseType} flowerType={flowerType} scale={1.15} spin />}
        {isLaunch && <LaunchDrift baseType={baseType} flowerType={flowerType} />}
        {isRiver && visibleItems.map((item, index) => {
          const column = index % 6
          const row = Math.floor(index / 6)
          const x = (column - 2.5) * 2.45 + (row % 2 ? 0.55 : 0)
          const z = 5 - row * 5.6 + (column % 2) * 0.7
          return (
            <KrathongModel
              key={item.id}
              baseType={item.base_type}
              flowerType={item.flower_type}
              position={[x, 0, z]}
              scale={0.66}
              senderName={item.sender_name}
              wishMessage={item.wish_message}
              selected={selectedId === item.id}
              onSelect={() => onSelect?.(item)}
            />
          )
        })}
        {isLaunch ? <LaunchCamera /> : (
          <OrbitControls
            makeDefault
            target={isRiver ? [0, 1.4, -4] : [0, 1.35, 0]}
            enablePan={isRiver}
            enableZoom={isRiver || isPreview || isShowcase}
            minDistance={isRiver ? 9 : 5}
            maxDistance={isRiver ? 30 : 13}
            maxPolarAngle={Math.PI * 0.49}
            autoRotate={isShowcase}
            autoRotateSpeed={0.55}
            enableDamping
            dampingFactor={0.07}
          />
        )}
      </Suspense>
    </Canvas>
  )
}
