"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Group } from "three"
import { Vector3 } from "three"

interface ThoughtVisualizationProps {
  thoughts: string[]
  position: [number, number, number]
}

export default function ThoughtVisualization({ thoughts, position }: ThoughtVisualizationProps) {
  const groupRef = useRef<Group>(null)

  // Create a circular arrangement of thought bubbles
  const thoughtPositions = useMemo(() => {
    if (!thoughts.length) return []

    return thoughts.map((_, index) => {
      const angle = (index / thoughts.length) * Math.PI * 2
      const radius = 1.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return new Vector3(x, 0, z)
    })
  }, [thoughts])

  // Rotate the thought cloud
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  if (!thoughts.length || !thoughtPositions.length) {
    return null
  }

  return (
    <group ref={groupRef} position={position}>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist_Bold.json"
      >
        AI Thought Process
      </Text>

      {thoughts.map((thought, index) => {
        if (index >= thoughtPositions.length) return null

        return (
          <group key={index} position={thoughtPositions[index]}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#6366f1" transparent opacity={0.3} />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.1}
              maxWidth={0.8}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Geist_Regular.json"
            >
              {thought.length > 30 ? thought.substring(0, 30) + "..." : thought}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
