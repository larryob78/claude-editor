import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { promises as fs } from 'fs'
import { EditInstruction } from './gemini'

export interface VideoMetadata {
  duration: number
  width: number
  height: number
  format: string
  codec: string
  bitrate: number
  fps: number
}

export async function getVideoMetadata(filePath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err)
        return
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video')
      if (!videoStream) {
        reject(new Error('No video stream found'))
        return
      }

      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        format: metadata.format.format_name || '',
        codec: videoStream.codec_name || '',
        bitrate: metadata.format.bit_rate || 0,
        fps: eval(videoStream.r_frame_rate || '0') || 0,
      })
    })
  })
}

export async function processVideoEdit(
  inputPath: string,
  outputPath: string,
  instruction: EditInstruction
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)

    switch (instruction.operation) {
      case 'trim':
        command = command
          .setStartTime(instruction.parameters.startTime)
          .setDuration(instruction.parameters.endTime - instruction.parameters.startTime)
        break

      case 'crop':
        command = command.videoFilter(
          `crop=${instruction.parameters.width}:${instruction.parameters.height}:${instruction.parameters.x}:${instruction.parameters.y}`
        )
        break

      case 'resize':
        command = command.size(`${instruction.parameters.width}x${instruction.parameters.height}`)
        break

      case 'rotate':
        const rotateMap: { [key: number]: string } = {
          90: 'transpose=1',
          180: 'transpose=1,transpose=1',
          270: 'transpose=2',
        }
        command = command.videoFilter(rotateMap[instruction.parameters.degrees] || 'transpose=1')
        break

      case 'speed':
        const speed = instruction.parameters.speed
        command = command
          .videoFilter(`setpts=${1 / speed}*PTS`)
          .audioFilter(`atempo=${speed}`)
        break

      case 'fade':
        const fadeType = instruction.parameters.type === 'in' ? 'fade=in' : 'fade=out'
        const duration = instruction.parameters.duration || 1
        command = command.videoFilter(`${fadeType}:st=0:d=${duration}`)
        break

      case 'text':
        const text = instruction.parameters.text.replace(/'/g, "\\'")
        const x = instruction.parameters.x || 10
        const y = instruction.parameters.y || 10
        const fontSize = instruction.parameters.fontSize || 24
        const color = instruction.parameters.color || 'white'
        command = command.videoFilter(
          `drawtext=text='${text}':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=${color}`
        )
        break

      case 'audio':
        if (instruction.parameters.volume === 'mute') {
          command = command.noAudio()
        } else {
          command = command.audioFilter(`volume=${instruction.parameters.volume}`)
        }
        break

      case 'filter':
        const filterMap: { [key: string]: string } = {
          grayscale: 'hue=s=0',
          sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
          blur: 'boxblur=2:1',
          sharpen: 'unsharp=5:5:1.0:5:5:0.0',
          brightness: 'eq=brightness=0.1',
          contrast: 'eq=contrast=1.5',
          saturation: 'eq=saturation=1.5',
        }
        command = command.videoFilter(filterMap[instruction.parameters.filterType] || 'hue=s=0')
        break

      case 'reverse':
        command = command.videoFilter('reverse').audioFilter('areverse')
        break

      case 'extract':
        if (instruction.parameters.type === 'audio') {
          command = command.noVideo()
        }
        if (instruction.parameters.startTime && instruction.parameters.endTime) {
          command = command
            .setStartTime(instruction.parameters.startTime)
            .setDuration(instruction.parameters.endTime - instruction.parameters.startTime)
        }
        break

      default:
        reject(new Error(`Unknown operation: ${instruction.operation}`))
        return
    }

    command
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run()
  })
}

export async function concatenateVideos(
  inputPaths: string[],
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg()

    inputPaths.forEach(inputPath => {
      command = command.input(inputPath)
    })

    command
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .mergeToFile(outputPath, path.dirname(outputPath))
  })
}

export async function extractThumbnail(
  videoPath: string,
  outputPath: string,
  timeInSeconds: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timeInSeconds],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
  })
}
