"use client"

import { useCallback } from "react"
import type { Message, ChatHistory } from "@/types"

const STORAGE_KEY = "orbital_nexus_chat_history"

export function useChatHistory() {
  const saveCurrentChat = useCallback((messages: Message[]) => {
    if (messages.length === 0) return

    const chatHistory: ChatHistory = {
      id: Date.now().toString(),
      title: messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? "..." : ""),
      messages,
      timestamp: Date.now(),
    }

    const existingChats = getAllChats()
    const updatedChats = [chatHistory, ...existingChats].slice(0, 50) // Keep only last 50 chats

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats))
  }, [])

  const getAllChats = useCallback((): ChatHistory[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading chat history:", error)
      return []
    }
  }, [])

  const loadChat = useCallback(
    (chatId: string): ChatHistory | null => {
      const chats = getAllChats()
      return chats.find((chat) => chat.id === chatId) || null
    },
    [getAllChats],
  )

  const deleteChat = useCallback(
    (chatId: string) => {
      const chats = getAllChats()
      const updatedChats = chats.filter((chat) => chat.id !== chatId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats))
    },
    [getAllChats],
  )

  const downloadAllHistory = useCallback(() => {
    const chats = getAllChats()
    const allText = chats
      .map((chat) => {
        const chatText = chat.messages
          .map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`)
          .join("\n\n")
        return `=== ${chat.title} (${new Date(chat.timestamp).toLocaleString()}) ===\n\n${chatText}`
      })
      .join("\n\n" + "=".repeat(50) + "\n\n")

    const blob = new Blob([allText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orbital_nexus_chat_history_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [getAllChats])

  return {
    saveCurrentChat,
    getAllChats,
    loadChat,
    deleteChat,
    downloadAllHistory,
  }
}
