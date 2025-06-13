"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import type { Message } from "@/types"

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 group`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 relative
          ${isUser ? "bg-purple-600 text-white" : "bg-black border border-white/20 text-white"}
          ${isStreaming ? "animate-pulse" : ""}
        `}
      >
        <div className={`text-sm ${isStreaming ? "animate-fade-in" : ""}`}>{message.content}</div>

        {/* Copy button */}
        <Button
          variant="ghost"
          size="icon"
          className={`
            absolute -right-2 top-1/2 transform -translate-y-1/2 h-6 w-6
            opacity-0 group-hover:opacity-100 transition-all duration-200
            bg-black/80 hover:bg-black/90 border border-white/20
          `}
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white/70" />}
        </Button>
      </div>
    </div>
  )
}
