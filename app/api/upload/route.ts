import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getVideoMetadata } from "@/lib/video-processor"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "No project ID provided" }, { status: 400 })
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory structure
    const uploadDir = path.join(process.cwd(), "uploads", projectId)
    await mkdir(uploadDir, { recursive: true })

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    // Get video metadata
    let metadata
    try {
      metadata = await getVideoMetadata(filePath)
    } catch (error) {
      console.error("Failed to get video metadata:", error)
      metadata = { duration: 0, width: 0, height: 0, format: '' }
    }

    // Save to database
    const video = await prisma.video.create({
      data: {
        fileName,
        originalName: file.name,
        filePath,
        fileSize: file.size,
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        projectId
      }
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
