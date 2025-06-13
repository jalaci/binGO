"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Text } from "@react-three/drei"
import { Vector3 } from "three"
import type { Group, Mesh } from "three"
import type { Message } from "@/types"

interface MessageNodeProps {
  message: Message
  position: Vector3 | [number, number, number]
  index: number
  color: string
}

export function MessageNode({ message, position, index, color }: MessageNodeProps) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Calculate size based on content length
  const size = Math.max(0.3, Math.min(0.8, message.content.length / 500))

  // Hover animation
  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.lerp(new Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1)
      }
    }

    // Subtle floating animation
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0005
    }
  })

  const pos = position instanceof Vector3 ? position : new Vector3(...position)

  return (
    <group ref={groupRef} position={pos}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setExpanded(!expanded)}
      >
        {message.role === "user" ? <boxGeometry args={[size, size, size]} /> : <sphereGeometry args={[size, 16, 16]} />}
        <meshStandardMaterial
          color={color}
          wireframe={message.role === "user"}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Role indicator */}
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist_Regular.json"
      >
        {message.role.toUpperCase()}
      </Text>

      {/* Message content (shown when expanded) */}
      {expanded && (
        <Html position={[size * 1.5, 0, 0]} transform distanceFactor={10} sprite>
          <div className="bg-black/80 text-white p-4 rounded-lg max-w-xs backdrop-blur-sm border border-white/20">
            <p className="text-sm">{message.content}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
