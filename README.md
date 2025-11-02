# AI Video Editor - Powered by Gemini 2.5

An intelligent video editing platform that allows you to edit videos using natural language commands powered by Google's Gemini 2.5 AI model.

## Features

### 🎬 Easy Video Upload
- Drag and drop interface for video uploads
- Support for multiple video formats (MP4, MOV, AVI, MKV, WebM)
- Project-based organization

### 🤖 AI-Powered Editing
- Edit videos using natural language prompts
- Powered by Google Gemini 2.5 for intelligent command parsing
- No complex tools or timeline manipulation required

### ✂️ Comprehensive Editing Tools

**Basic Operations:**
- Trim and cut videos
- Crop and resize
- Rotate videos (90°, 180°, 270°)
- Adjust playback speed

**Effects & Filters:**
- Fade in/out effects
- Visual filters (grayscale, sepia, blur, sharpen)
- Brightness, contrast, and saturation adjustments
- Video stabilization

**Audio:**
- Volume adjustment
- Mute/unmute
- Extract audio tracks
- Audio noise reduction

**Advanced Features:**
- Text overlays with customization
- Concatenate multiple videos
- Reverse video playback
- Extract video segments

### 🔐 User Authentication
- Secure user registration and login
- Session management with NextAuth.js
- User-specific projects and videos

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **AI:** Google Gemini 2.5 API
- **Video Processing:** FFmpeg (via fluent-ffmpeg)
- **UI Components:** Radix UI, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- FFmpeg installed on your system
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd claude-editor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key-here"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Create uploads directory:
```bash
mkdir uploads
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating Your First Project

1. Sign up for an account or sign in
2. Click the "+" button in the Projects sidebar
3. Enter a project name and click "Add"

### Uploading Videos

1. Select a project from the sidebar
2. Drag and drop video files into the upload area, or click to browse
3. Wait for the upload to complete

### Editing with AI

1. Select a video from your project
2. Use the AI Video Editor panel to describe your edit in plain English

**Example prompts:**
- "Trim the first 5 seconds and add a fade in"
- "Make the video grayscale and increase the contrast"
- "Cut from 10 to 30 seconds and speed it up by 2x"
- "Add text 'Subscribe!' at the bottom center"
- "Crop to 16:9 and brighten the video"

3. Click Send or press Enter
4. Monitor the edit progress in the Edit History panel
5. Download completed edits

## License

MIT License