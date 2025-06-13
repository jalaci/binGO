"use client"

import { useState, useCallback } from "react"
import type { Message, ConversationContext, ConversationMood } from "@/types"

// Sample responses for the AI
const AI_RESPONSES = {
  greeting: [
    "Hello! Welcome to Orbital Nexus. How can I assist you today?",
    "Welcome to this revolutionary interface. What would you like to explore?",
    "Greetings! I'm your AI assistant in this 3D space. What can I help you with?",
  ],
  about: [
    "Orbital Nexus is a revolutionary 3D spatial interface for AI interactions. It breaks traditional chat paradigms by using a dynamic, spatial arrangement of messages in 3D space.",
    "This interface visualizes our conversation as an evolving 3D structure. Each message is a node in space, connected to form a conversation flow. You can interact with nodes by clicking on them.",
  ],
  interface: [
    "This interface works by representing our conversation in 3D space. Messages are displayed as geometric shapes that you can interact with. The space adapts to the emotional tone of our conversation.",
    "You're experiencing a spatial conversation interface. Each message exists as a 3D object, and the connections between them show the flow of our dialogue. The colors and animations reflect the conversation's mood.",
  ],
  revolutionary: [
    "What makes this UI revolutionary is how it breaks away from traditional linear chat layouts. It uses spatial arrangement, real-time visualization of AI thought processes, and adaptive elements that evolve based on conversation patterns.",
    "Traditional interfaces show conversations as linear text exchanges. This interface creates a spatial experience where messages exist in 3D space, with visual connections showing relationships between ideas.",
  ],
  interesting: [
    "The space around you is actually responding to our conversation! Notice how the colors and animations change based on the emotional tone of our exchange. Try asking something positive or complex and watch how the environment shifts.",
    "Did you know this interface visualizes my 'thought process' when I'm formulating responses? When you see the floating spheres appear, those represent different aspects of how I'm processing your message.",
  ],
  default: [
    "That's an interesting point. Let me think about that from multiple perspectives...",
    "I understand what you're asking. Let me explore that further...",
    "That's a great question. Based on my knowledge...",
    "I can help with that. Here's what I know...",
    "Let me think about this carefully...",
  ],
}

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [thoughtProcess, setThoughtProcess] = useState<string[]>([
    "Analyzing context...",
    "Retrieving relevant information...",
    "Formulating response...",
    "Evaluating tone and style...",
    "Finalizing output...",
  ])

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    creativity: 0.7,
    depth: 0.5,
    mood: "Neutral",
    topics: [],
  })

  const [conversationMood, setConversationMood] = useState<ConversationMood>({
    color: "#6366f1",
    energy: 1,
    tempo: 1,
  })

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
    setConversationContext({
      creativity: 0.7,
      depth: 0.5,
      mood: "Neutral",
      topics: [],
    })
    setConversationMood({
      color: "#6366f1",
      energy: 1,
      tempo: 1,
    })
  }, [])

  // Add a new message to the conversation
  const addMessage = useCallback(async (message: Message, shouldRespond = true) => {
    setMessages((prev) => [...prev, message])

    // If it's a user message and we should respond, simulate AI response
    if (message.role === "user" && shouldRespond) {
      setIsProcessing(true)

      // Simulate AI thinking process
      const thoughts = [
        "Analyzing user input...",
        "Identifying key concepts...",
        "Retrieving relevant knowledge...",
        "Formulating response strategy...",
        "Generating natural language...",
      ]

      // Show thinking process with delays
      for (let i = 0; i < thoughts.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setThoughtProcess((prev) => [...prev.slice(-4), thoughts[i]])
      }

      // Determine response category based on user message
      const userMessageLower = message.content.toLowerCase()
      let responseCategory = "default"

      if (userMessageLower.includes("hello") || userMessageLower.includes("hi") || userMessageLower.includes("hey")) {
        responseCategory = "greeting"
      } else if (
        userMessageLower.includes("about") &&
        (userMessageLower.includes("you") || userMessageLower.includes("this"))
      ) {
        responseCategory = "about"
      } else if (userMessageLower.includes("how") && userMessageLower.includes("work")) {
        responseCategory = "interface"
      } else if (userMessageLower.includes("revolutionary") || userMessageLower.includes("different")) {
        responseCategory = "revolutionary"
      } else if (userMessageLower.includes("interesting") || userMessageLower.includes("cool")) {
        responseCategory = "interesting"
      }

      // Get responses for the category
      const responses = AI_RESPONSES[responseCategory as keyof typeof AI_RESPONSES]
      const aiResponse = responses[Math.floor(Math.random() * responses.length)]

      // Simulate AI response after "thinking"
      setTimeout(() => {
        const aiMessage: Message = {
          role: "assistant",
          content: aiResponse,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsProcessing(false)

        // Update conversation mood based on content
        updateConversationMood(message.content, aiMessage.content)
      }, 1500)
    }
  }, [])

  // Update conversation mood based on content analysis
  const updateConversationMood = (userMessage: string, aiResponse: string) => {
    // Simple sentiment analysis simulation
    const isPositive = userMessage.includes("good") || userMessage.includes("great") || userMessage.includes("happy")

    const isNegative = userMessage.includes("bad") || userMessage.includes("sad") || userMessage.includes("problem")

    const isComplex = userMessage.length > 100 || userMessage.includes("why") || userMessage.includes("how")

    // Update mood color
    let newColor = "#6366f1" // Default purple
    if (isPositive) newColor = "#10b981" // Green
    if (isNegative) newColor = "#ef4444" // Red
    if (isComplex) newColor = "#f59e0b" // Amber

    // Update energy and tempo based on message characteristics
    const newEnergy = isComplex ? 0.5 : isPositive ? 1.5 : 1
    const newTempo = isNegative ? 0.7 : isPositive ? 1.3 : 1

    setConversationMood({
      color: newColor,
      energy: newEnergy,
      tempo: newTempo,
    })

    // Update conversation context
    setConversationContext((prev) => ({
      ...prev,
      mood: isPositive ? "Positive" : isNegative ? "Negative" : "Neutral",
      topics: [...new Set([...prev.topics, ...extractTopics(userMessage)])],
    }))
  }

  // Extract potential topics from user message
  const extractTopics = (message: string): string[] => {
    const words = message.toLowerCase().split(/\W+/)
    const commonWords = new Set(["the", "and", "is", "in", "to", "of", "a"])

    return words.filter((word) => word.length > 3 && !commonWords.has(word)).slice(0, 3)
  }

  return {
    messages,
    addMessage,
    clearMessages,
    isProcessing,
    thoughtProcess,
    conversationContext,
    conversationMood,
  }
}
