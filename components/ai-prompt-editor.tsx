"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Sparkles, Send, Loader2 } from 'lucide-react'

interface AIPromptEditorProps {
  videoId: string
  onEditStart?: () => void
  onEditComplete?: (edits: any[]) => void
}

export function AIPromptEditor({ videoId, onEditStart, onEditComplete }: AIPromptEditorProps) {
  const [prompt, setPrompt] = useState('')
  const [processing, setProcessing] = useState(false)
  const [suggestions] = useState([
    "Trim the first 5 seconds and add a fade in",
    "Make the video grayscale and add dramatic music",
    "Cut from 10 to 30 seconds and increase the speed by 2x",
    "Add text 'Subscribe!' at the bottom center",
    "Crop to 16:9 aspect ratio and brighten the video"
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || processing) return

    setProcessing(true)
    if (onEditStart) onEditStart()

    try {
      const response = await fetch(`/api/videos/${videoId}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to process edit')
      }

      const { edits } = await response.json()

      if (onEditComplete) {
        onEditComplete(edits)
      }

      setPrompt('')
      alert('Edit processing started! Check the edits panel for progress.')
    } catch (error) {
      console.error('Edit error:', error)
      alert('Failed to process edit. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Video Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to do... (e.g., 'Trim the first 10 seconds and add a fade effect')"
            className="flex-1"
            disabled={processing}
          />
          <Button type="submit" disabled={processing}>
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Suggestions (click to use):
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => useSuggestion(suggestion)}
                disabled={processing}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Available commands:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Trim, crop, resize, rotate video</li>
            <li>Add text overlays and effects</li>
            <li>Adjust speed, add fades</li>
            <li>Apply filters (grayscale, sepia, blur, etc.)</li>
            <li>Extract audio, reverse video</li>
            <li>Adjust volume or mute audio</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
