"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Message } from "@/types"
import { X, Volume2, Type, MousePointer, Contrast } from "lucide-react"

interface AccessibilityControlsProps {
  onClose: () => void
  messages: Message[]
}

export default function AccessibilityControls({ onClose, messages }: AccessibilityControlsProps) {
  const [textSize, setTextSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-md p-6 border-l border-white/10 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Accessibility</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            <Label htmlFor="text-size">Text Size ({textSize}%)</Label>
          </div>
          <Slider
            id="text-size"
            value={[textSize]}
            min={75}
            max={200}
            step={5}
            onValueChange={(value) => setTextSize(value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Contrast className="h-4 w-4 mr-2" />
            <Label htmlFor="high-contrast">High Contrast</Label>
          </div>
          <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            <Label htmlFor="screen-reader">Screen Reader</Label>
          </div>
          <Switch id="screen-reader" checked={screenReader} onCheckedChange={setScreenReader} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MousePointer className="h-4 w-4 mr-2" />
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
          </div>
          <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Text Transcript</h3>
          <div className="bg-black/40 rounded-lg p-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-white/50 italic">No messages yet</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{message.role === "user" ? "You" : "AI"}</p>
                  <p style={{ fontSize: `${textSize}%` }} className={highContrast ? "text-white" : "text-white/80"}>
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
