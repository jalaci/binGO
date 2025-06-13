"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { Vector3 } from "three"
import type { Group } from "three"
import { MessageNode } from "./message-node"
import { ConversationLink } from "./conversation-link"
import type { Message, ConversationMood } from "@/types"

interface ConversationSpaceProps {
  messages: Message[]
  isProcessing: boolean
  conversationMood: ConversationMood
}

export default function ConversationSpace({ messages, isProcessing, conversationMood }: ConversationSpaceProps) {
  const groupRef = useRef<Group>(null)

  // Calculate node positions in 3D space based on conversation flow
  const nodePositions = useMemo(() => {
    return messages.map((_, index) => {
      // Create a spiral pattern
      const angle = index * 0.5
      const radius = 3 + index * 0.2
      const x = Math.cos(angle) * radius
      const y = index * 0.5
      const z = Math.sin(angle) * radius
      return new Vector3(x, y, z)
    })
  }, [messages])

  // Animate the conversation space based on mood
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation based on conversation mood
      groupRef.current.rotation.y += 0.001 * conversationMood.energy

      // Scale breathing effect based on mood intensity
      const breathingScale = 1 + Math.sin(state.clock.elapsedTime * conversationMood.tempo) * 0.02
      groupRef.current.scale.setScalar(breathingScale)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Welcome message if no messages */}
      {messages.length === 0 && (
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist_Bold.json"
          maxWidth={5}
          textAlign="center"
        >
          Welcome to Orbital Nexus
          {"\n"}
          Type a message to begin
        </Text>
      )}

      {/* Message nodes */}
      {messages.map((message, index) => (
        <MessageNode
          key={index}
          message={message}
          position={nodePositions[index]}
          index={index}
          color={message.role === "user" ? "#4f46e5" : "#10b981"}
        />
      ))}

      {/* Connection links between nodes */}
      {messages.length > 1 &&
        messages
          .slice(1)
          .map((_, index) => (
            <ConversationLink
              key={index}
              start={nodePositions[index]}
              end={nodePositions[index + 1]}
              color={conversationMood.color}
              thickness={0.05}
            />
          ))}

      {/* Processing indicator */}
      {isProcessing && nodePositions.length > 0 && (
        <mesh
          position={[
            nodePositions[nodePositions.length - 1].x + 2,
            nodePositions[nodePositions.length - 1].y,
            nodePositions[nodePositions.length - 1].z,
          ]}
        >
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={conversationMood.color}
            emissive={conversationMood.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  )
}
