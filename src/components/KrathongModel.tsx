import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { BaseType, FlowerType } from '../types'

interface KrathongModelProps {
  baseType: BaseType
  flowerType: FlowerType
  scale?: number
  animateFloat?: boolean
  spin?: boolean
  position?: [number, number, number]
  senderName?: string
  wishMessage?: string
  onSelect?: () => void
  selected?: boolean
}

const greenPalette = ['#245b36', '#347b45', '#4b9852', '#d4a52d']
const lotusPalette = ['#b65b9a', '#d77bb4', '#ed9bc9', '#f4c1dd']

function PetalRing({
  count,
  radius,
  height,
  petalLength,
  petalWidth,
  colors,
  offset = 0,
}: {
  count: number
  radius: number
  height: number
  petalLength: number
  petalWidth: number
  colors: string[]
  offset?: number
}) {
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 20, 14), [])
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + offset
        const color = colors[index % colors.length]
        return (
          <mesh
            key={index}
            geometry={geometry}
            position={[Math.sin(angle) * radius, height, Math.cos(angle) * radius]}
            rotation={[0.10, angle, 0.06]}
            scale={[petalWidth, 0.045, petalLength]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={color} roughness={0.58} metalness={0.04} side={THREE.DoubleSide} />
          </mesh>
        )
      })}
    </group>
  )
}

function BananaBase() {
  return (
    <group>
      <mesh position={[0, 0.07, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.43, 0.31, 0.13, 48]} />
        <meshStandardMaterial color="#1f5632" roughness={0.62} />
      </mesh>
      <PetalRing count={13} radius={0.39} height={0.12} petalLength={0.48} petalWidth={0.19} colors={greenPalette} />
      <PetalRing count={12} radius={0.29} height={0.18} petalLength={0.38} petalWidth={0.17} colors={['#3b874b', '#62a65d', '#c69d37']} offset={0.22} />
      <PetalRing count={10} radius={0.18} height={0.23} petalLength={0.27} petalWidth={0.14} colors={['#2f7544', '#66a761', '#d6ad49']} offset={0.1} />
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.12, 32]} />
        <meshStandardMaterial color="#b28b32" metalness={0.52} roughness={0.3} />
      </mesh>
    </group>
  )
}

function LotusBase() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.43, 0.3, 0.13, 48]} />
        <meshStandardMaterial color="#8e477f" roughness={0.5} />
      </mesh>
      <PetalRing count={14} radius={0.37} height={0.12} petalLength={0.48} petalWidth={0.18} colors={lotusPalette} />
      <PetalRing count={12} radius={0.27} height={0.18} petalLength={0.38} petalWidth={0.16} colors={['#d47db4', '#e99bc9', '#f4c5dc']} offset={0.24} />
      <PetalRing count={10} radius={0.16} height={0.23} petalLength={0.28} petalWidth={0.14} colors={['#c76aa8', '#eda8d0', '#f8d5e8']} offset={0.1} />
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.11, 32]} />
        <meshStandardMaterial color="#c38a38" metalness={0.55} roughness={0.28} />
      </mesh>
    </group>
  )
}

function CoconutBase() {
  const bowlPoints = useMemo(() => [
    new THREE.Vector2(0.08, 0.02), new THREE.Vector2(0.2, 0.03),
    new THREE.Vector2(0.34, 0.1), new THREE.Vector2(0.43, 0.23),
    new THREE.Vector2(0.46, 0.34), new THREE.Vector2(0.44, 0.39),
  ], [])
  return (
    <group>
      <mesh position={[0, 0.02, 0]}>
        <latheGeometry args={[bowlPoints, 48]} />
        <meshStandardMaterial color="#754328" roughness={0.3} metalness={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.39, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.035, 12, 64]} />
        <meshStandardMaterial color="#e7bd5e" metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.36, 0.2, 0.1, 48]} />
        <meshStandardMaterial color="#a36a3d" roughness={0.46} />
      </mesh>
      <PetalRing count={9} radius={0.3} height={0.23} petalLength={0.23} petalWidth={0.12} colors={['#bd8d43', '#dab46a']} />
    </group>
  )
}

function Marigold({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 }, (_, layer) => (
        <PetalRing
          key={layer}
          count={12}
          radius={0.015 + layer * 0.012}
          height={0.02 + layer * 0.025}
          petalLength={0.17 - layer * 0.025}
          petalWidth={0.075}
          colors={layer === 1 ? ['#f59e0b', '#fbbf24', '#fcd34d'] : ['#d97706', '#f59e0b', '#facc15']}
          offset={layer * 0.25}
        />
      ))}
      <mesh position={[0, 0.095, 0]}>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshStandardMaterial color="#8b4b13" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Orchid({ position }: { position: [number, number, number] }) {
  const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed']
  return (
    <group position={position}>
      <PetalRing count={5} radius={0.025} height={0.05} petalLength={0.2} petalWidth={0.115} colors={colors} offset={0.25} />
      <PetalRing count={5} radius={0.02} height={0.075} petalLength={0.13} petalWidth={0.075} colors={['#c4b5fd', '#e9d5ff', '#a78bfa']} offset={0.55} />
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.07, 18, 18]} />
        <meshStandardMaterial color="#f6d365" emissive="#6d3c18" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

function Gomphrena({ position }: { position: [number, number, number] }) {
  const geometry = useMemo(() => new THREE.SphereGeometry(0.095, 16, 16), [])
  return (
    <group position={position}>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2
        return (
          <mesh key={index} geometry={geometry} position={[Math.sin(angle) * 0.075, 0.045 + (index % 3) * 0.025, Math.cos(angle) * 0.075]}>
            <meshStandardMaterial color={index % 2 ? '#d946a6' : '#f0a6d6'} roughness={0.65} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshStandardMaterial color="#c02686" roughness={0.7} />
      </mesh>
    </group>
  )
}

function FlowerArrangement({ type }: { type: FlowerType }) {
  const Flower = type === 'marigold' ? Marigold : type === 'orchid' ? Orchid : Gomphrena
  return (
    <group position={[0, 0.48, 0]}>
      <Flower position={[0, 0.08, 0]} />
      <Flower position={[-0.22, 0.015, 0.06]} />
      <Flower position={[0.22, 0.015, 0.06]} />
      <Flower position={[0, 0.015, -0.2]} />
    </group>
  )
}

function CandleAndIncense() {
  const flame = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const smoke = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (flame.current) {
      flame.current.scale.set(0.88 + Math.sin(t * 12) * 0.1, 1 + Math.sin(t * 16) * 0.16, 0.88 + Math.cos(t * 11) * 0.08)
      flame.current.rotation.z = Math.sin(t * 8) * 0.08
    }
    if (light.current) light.current.intensity = 1.8 + Math.sin(t * 13) * 0.28
    if (smoke.current) smoke.current.rotation.y = Math.sin(t * 0.8) * 0.12
  })
  return (
    <group>
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.09, 0.48, 24]} />
        <meshStandardMaterial color="#fff0c1" roughness={0.36} />
      </mesh>
      <mesh position={[0, 1.07, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.055, 8]} />
        <meshStandardMaterial color="#34221a" />
      </mesh>
      <mesh ref={flame} position={[0, 1.17, 0]}>
        <sphereGeometry args={[0.062, 16, 16]} />
        <meshBasicMaterial color="#ffe46b" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#fff8d9" />
      </mesh>
      <pointLight ref={light} position={[0, 1.25, 0]} color="#ffca55" intensity={2} distance={4.3} decay={2} />
      <group ref={smoke}>
        {[-0.16, 0, 0.16].map((x, index) => (
          <group key={index} position={[x, 0.88, index === 1 ? -0.13 : 0.12]}>
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.012, 0.018, 0.55, 8]} />
              <meshStandardMaterial color="#b7b3aa" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.63, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#ff8b48" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

export default function KrathongModel({
  baseType,
  flowerType,
  scale = 1,
  animateFloat = true,
  spin = false,
  position = [0, 0, 0],
  senderName,
  wishMessage,
  onSelect,
  selected = false,
}: KrathongModelProps) {
  const root = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useFrame(({ clock }) => {
    if (!root.current) return
    const t = clock.getElapsedTime()
    root.current.position.y = position[1] + (animateFloat ? 0.14 + Math.sin(t * 1.5 + position[0]) * 0.055 : 0)
    root.current.rotation.y = spin ? t * 0.22 : Math.sin(t * 0.28 + position[0]) * 0.035
    root.current.rotation.z = Math.sin(t * 1.2 + position[2]) * 0.018
  })

  return (
    <group
      ref={root}
      position={[position[0], position[1], position[2]]}
      scale={scale}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect?.() }}
    >
      {baseType === 'banana' ? <BananaBase /> : baseType === 'lotus' ? <LotusBase /> : <CoconutBase />}
      <FlowerArrangement type={flowerType} />
      <CandleAndIncense />
      {(hovered || selected) && senderName && wishMessage && (
        <Html position={[0, 2.05, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="krathong-tooltip">
            <strong>{senderName}</strong>
            <span>{wishMessage}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
