import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface EditInstruction {
  operation: string
  parameters: {
    [key: string]: any
  }
  description: string
}

export async function parseVideoEditPrompt(prompt: string): Promise<EditInstruction[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const systemPrompt = `You are a video editing assistant. Parse user requests into structured video editing operations.

Available operations:
- trim: Cut video (params: startTime, endTime in seconds)
- crop: Crop video (params: x, y, width, height)
- resize: Resize video (params: width, height)
- rotate: Rotate video (params: degrees)
- speed: Change playback speed (params: speed - 0.5 = half speed, 2.0 = double speed)
- fade: Add fade effect (params: type - "in" or "out", duration in seconds)
- text: Add text overlay (params: text, x, y, fontSize, color, duration, startTime)
- audio: Adjust audio (params: volume - 0.0 to 2.0, or "mute")
- filter: Apply visual filter (params: filterType - "grayscale", "sepia", "blur", "sharpen", "brightness", "contrast", "saturation")
- extract: Extract audio or specific segment (params: type - "audio" or "video", startTime, endTime)
- concatenate: Join multiple videos (params: videoIds array)
- reverse: Reverse video playback
- stabilize: Stabilize shaky footage
- denoise: Remove audio or video noise (params: type - "audio" or "video")

Return ONLY a JSON array of operations. Example:
[
  {
    "operation": "trim",
    "parameters": {"startTime": 5, "endTime": 15},
    "description": "Trim video from 5 to 15 seconds"
  }
]

User request: ${prompt}`

  const result = await model.generateContent(systemPrompt)
  const response = await result.response
  const text = response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error("Could not parse editing instructions")
  }

  return JSON.parse(jsonMatch[0])
}

export async function generateEditDescription(operations: EditInstruction[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const prompt = `Summarize these video editing operations in a single clear sentence:
${JSON.stringify(operations, null, 2)}

Return only the summary sentence.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text().trim()
}

export async function suggestEdits(videoMetadata: any): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const prompt = `Based on this video metadata, suggest 5 useful editing operations:
${JSON.stringify(videoMetadata, null, 2)}

Return a JSON array of suggestion strings. Example:
["Trim the first 5 seconds", "Add a fade in effect", "Increase volume by 20%"]`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    return []
  }

  return JSON.parse(jsonMatch[0])
}
