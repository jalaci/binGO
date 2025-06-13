"use client"

import { useState, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, Environment } from "@react-three/drei"
import ConversationSpace from "@/components/conversation-space"
import InteractionPanel from "@/components/interaction-panel"
import ThoughtVisualization from "@/components/thought-visualization"
import AccessibilityControls from "@/components/accessibility-controls"
import ChatHistoryModal from "@/components/chat-history-modal"
import { useConversation } from "@/hooks/use-conversation"
import { useChatHistory } from "@/hooks/use-chat-history"

export default function ConversationInterface() {
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { messages, addMessage, isProcessing, thoughtProcess, conversationContext, conversationMood, clearMessages } =
    useConversation()

  const { saveCurrentChat, loadChat, deleteChat, getAllChats, downloadAllHistory } = useChatHistory()

  const handleNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChat(messages)
    }
    clearMessages()
  }

  const handleLoadChat = (chatId: string) => {
    const chat = loadChat(chatId)
    if (chat) {
      clearMessages()
      // Load messages one by one to trigger animations
      chat.messages.forEach((message, index) => {
        setTimeout(() => {
          addMessage(message, false) // false = don't trigger AI response
        }, index * 100)
      })
    }
    setShowHistory(false)
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Conversation Space */}
      <Canvas ref={canvasRef} className="w-full h-full" dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Stars radius={100} depth={50} count={2000} factor={4} />
          <Environment preset="night" />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.5}
            maxDistance={20}
            minDistance={2}
          />
          <ConversationSpace messages={messages} isProcessing={isProcessing} conversationMood={conversationMood} />
          {isProcessing && thoughtProcess.length > 0 && (
            <ThoughtVisualization thoughts={thoughtProcess} position={[0, -2, 0]} />
          )}
        </Suspense>
      </Canvas>

      {/* Interaction Controls */}
      <InteractionPanel
        onSubmit={addMessage}
        onNewChat={handleNewChat}
        isProcessing={isProcessing}
        conversationContext={conversationContext}
        toggleAccessibility={() => setShowAccessibility(!showAccessibility)}
        toggleHistory={() => setShowHistory(!showHistory)}
      />

      {/* Chat History Modal */}
      {showHistory && (
        <ChatHistoryModal
          onClose={() => setShowHistory(false)}
          onLoadChat={handleLoadChat}
          onDeleteChat={deleteChat}
          onDownloadAll={downloadAllHistory}
          chats={getAllChats()}
        />
      )}

      {/* Accessibility Layer */}
      {showAccessibility && <AccessibilityControls onClose={() => setShowAccessibility(false)} messages={messages} />}

      {/* Ambient Mood Indicator */}
      <div
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${conversationMood.color} 0%, rgba(0,0,0,0) 70%)`,
          animation: "pulse 2s infinite",
        }}
      />
    </div>
  )
}
