import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseVideoEditPrompt } from "@/lib/gemini"
import { processVideoEdit, concatenateVideos } from "@/lib/video-processor"
import path from "path"

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // Fetch video and verify ownership
    const video = await prisma.video.findFirst({
      where: {
        id: params.videoId,
        project: {
          userId: session.user.id
        }
      },
      include: {
        project: true
      }
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Parse the prompt using Gemini
    const instructions = await parseVideoEditPrompt(prompt)

    // Create edit records
    const edits = await Promise.all(
      instructions.map(instruction =>
        prisma.videoEdit.create({
          data: {
            videoId: video.id,
            prompt,
            operation: instruction.operation,
            parameters: JSON.stringify(instruction.parameters),
            status: 'pending'
          }
        })
      )
    )

    // Process edits in the background
    processEditsInBackground(video.id, video.filePath, instructions, edits)

    return NextResponse.json({
      message: "Edit processing started",
      edits: edits.map(e => ({
        id: e.id,
        operation: e.operation,
        status: e.status
      }))
    })
  } catch (error) {
    console.error("Edit error:", error)
    return NextResponse.json(
      { error: "Failed to process edit" },
      { status: 500 }
    )
  }
}

async function processEditsInBackground(
  videoId: string,
  inputPath: string,
  instructions: any[],
  edits: any[]
) {
  let currentPath = inputPath

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i]
    const edit = edits[i]

    try {
      // Update status to processing
      await prisma.videoEdit.update({
        where: { id: edit.id },
        data: { status: 'processing' }
      })

      const outputPath = path.join(
        path.dirname(inputPath),
        `edited-${Date.now()}-${path.basename(inputPath)}`
      )

      await processVideoEdit(currentPath, outputPath, instruction)

      // Update edit with output path
      await prisma.videoEdit.update({
        where: { id: edit.id },
        data: {
          status: 'completed',
          outputPath
        }
      })

      currentPath = outputPath
    } catch (error: any) {
      console.error(`Failed to process edit ${edit.id}:`, error)
      await prisma.videoEdit.update({
        where: { id: edit.id },
        data: {
          status: 'failed',
          error: error.message
        }
      })
      break
    }
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const edits = await prisma.videoEdit.findMany({
      where: {
        videoId: params.videoId,
        video: {
          project: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ edits })
  } catch (error) {
    console.error("Failed to fetch edits:", error)
    return NextResponse.json(
      { error: "Failed to fetch edits" },
      { status: 500 }
    )
  }
}
