export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ConversationContext {
  creativity: number
  depth: number
  mood: string
  topics: string[]
}

export interface ConversationMood {
  color: string
  energy: number
  tempo: number
}

export interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  timestamp: number
}
