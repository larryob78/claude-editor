# Setup Guide - AI Video Editor

This guide will walk you through setting up the AI Video Editor application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js 18 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **FFmpeg**
   - **macOS:** `brew install ffmpeg`
   - **Ubuntu/Debian:** `sudo apt-get install ffmpeg`
   - **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html)
   - Verify installation: `ffmpeg -version`

3. **Google Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Keep it safe for later use

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Prisma (database ORM)
- NextAuth.js (authentication)
- Google Generative AI SDK
- FFmpeg wrapper
- UI components and utilities

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Authentication
# Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key-here"

# File Upload Settings (Optional)
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_DIR="./uploads"
```

**Important:**
- Replace `NEXTAUTH_SECRET` with a secure random string (at least 32 characters)
- Replace `GEMINI_API_KEY` with your actual Google Gemini API key

### 3. Initialize the Database

Set up the SQLite database using Prisma:

```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma db push
```

This creates:
- User table (authentication)
- Project table (organizing videos)
- Video table (uploaded videos and metadata)
- VideoEdit table (edit history and status)
- Session and account tables (NextAuth)

### 4. Create Upload Directory

```bash
mkdir uploads
```

This directory will store uploaded videos and edited outputs.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## First Time Use

### 1. Create an Account

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Enter your name, email, and password
4. Click "Sign Up"

### 2. Sign In

1. Use the email and password you just created
2. You'll be redirected to the editor page

### 3. Create Your First Project

1. Click the "+" button in the Projects sidebar
2. Enter a project name (e.g., "My First Video")
3. Click "Add"

### 4. Upload a Video

1. Drag and drop a video file into the upload area
2. Or click "Choose Files" to browse
3. Wait for the upload to complete

### 5. Edit with AI

1. Click on your uploaded video in the sidebar
2. In the "AI Video Editor" panel, type a command like:
   - "Trim the first 5 seconds"
   - "Add a fade in effect"
   - "Make it grayscale"
3. Click Send
4. Watch the progress in the "Edit History" panel
5. Download your edited video when complete

## Troubleshooting

### Database Issues

If you encounter database errors, reset the database:

```bash
# Delete the database
rm prisma/dev.db

# Recreate it
npx prisma db push
```

### FFmpeg Not Found

**Error:** "ffmpeg: command not found" or similar

**Solution:**
1. Ensure FFmpeg is installed (see Prerequisites)
2. Verify it's in your PATH: `which ffmpeg`
3. Restart your terminal/IDE after installation

### Upload Errors

**Error:** Cannot write to uploads directory

**Solution:**
```bash
# Ensure directory exists
mkdir -p uploads

# Set proper permissions (Unix/macOS)
chmod 755 uploads
```

### Gemini API Errors

**Error:** "API key not valid" or "429 Too Many Requests"

**Solutions:**
1. Verify your API key in `.env`
2. Check your API quota at [Google AI Studio](https://makersuite.google.com/)
3. Ensure you're using Gemini 2.0 Flash (free tier available)

### Port Already in Use

**Error:** "Port 3000 is already in use"

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

## Database Management

### View Database Contents

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- Browse all tables
- View user data
- Check video uploads
- Monitor edit status

### Reset Database

```bash
# Delete all data and recreate tables
rm prisma/dev.db
npx prisma db push
```

### Backup Database

```bash
# Create backup
cp prisma/dev.db prisma/dev.db.backup

# Restore from backup
cp prisma/dev.db.backup prisma/dev.db
```

## Production Deployment

### Environment Setup

1. Use a production database (PostgreSQL recommended):
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

2. Generate a strong secret:
```bash
openssl rand -base64 32
```

3. Update NEXTAUTH_URL to your production domain

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Note:** For video processing, consider using:
- External storage (AWS S3, Cloudinary)
- Background job queue (Bull, BullMQ)
- Dedicated processing server

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

## File Structure

```
claude-editor/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── projects/     # Project management
│   │   ├── upload/       # Video upload
│   │   └── videos/       # Video editing
│   ├── auth/             # Auth pages (signin, signup)
│   ├── editor/           # Main editor page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # UI primitives
│   ├── video-upload.tsx  # Upload component
│   ├── video-player.tsx  # Video player
│   ├── ai-prompt-editor.tsx  # AI editor
│   └── edits-list.tsx    # Edit history
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Database client
│   ├── gemini.ts         # AI integration
│   ├── video-processor.ts # FFmpeg wrapper
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   └── schema.prisma     # Database schema
├── public/               # Static files
├── types/                # TypeScript types
├── uploads/              # Video storage
├── .env                  # Environment variables
├── .env.example          # Example env file
├── package.json          # Dependencies
└── README.md             # Documentation
```

## Next Steps

1. **Customize the UI** - Modify components in `components/` directory
2. **Add More Edit Operations** - Extend `lib/video-processor.ts`
3. **Improve AI Prompts** - Fine-tune prompts in `lib/gemini.ts`
4. **Add Cloud Storage** - Integrate S3 or similar for scalability
5. **Implement Job Queue** - Handle long-running video processing

## Support

For issues and questions:
- Check the [README.md](README.md) for usage documentation
- Review the [Troubleshooting](#troubleshooting) section above
- Check GitHub issues

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google Gemini API](https://ai.google.dev/docs)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
