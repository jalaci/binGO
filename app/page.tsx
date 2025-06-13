"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"
import FallbackUI from "@/components/fallback-ui"

// Dynamically import the 3D components with no SSR to avoid hydration issues
const ConversationInterface = dynamic(() => import("@/components/conversation-interface"), {
  ssr: false,
  loading: () => <FallbackUI message="Loading 3D conversation interface..." />,
})

export default function OrbitalNexus() {
  const [mounted, setMounted] = useState(false)

  // Only render the 3D interface after component has mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FallbackUI message="Initializing Orbital Nexus..." />
  }

  return (
    <ThemeProvider>
      <ConversationInterface />
    </ThemeProvider>
  )
}
