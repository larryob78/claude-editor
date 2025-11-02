# Testing Guide - AI Video Editor

## 🎉 Your app is now running!

The development server is running at: **http://localhost:3000**

## Quick Start Testing

### 1. Access the App
Open your browser and navigate to:
```
http://localhost:3000
```

You should see the landing page with the AI Video Editor interface.

### 2. Demo Credentials

The app is running in **DEMO MODE** with a mock database (since Prisma engines couldn't be downloaded in this environment).

**You can test the UI without needing to sign up!** Just navigate directly to:
```
http://localhost:3000/editor
```

If you want to test the auth flow:
- **Email:** demo@example.com
- **Password:** demo123

### 3. Test the Interface

#### Landing Page
- ✅ View the feature showcase
- ✅ See the editing capabilities
- ✅ Navigate between pages

#### Editor Interface
1. **Projects Sidebar**
   - Click the "+" button to create a project
   - Enter a project name
   - Projects will be created (in memory for demo)

2. **Video Upload**
   - Drag and drop a video file (.mp4, .mov, .avi, .mkv, .webm)
   - Or click "Choose Files" to browse
   - The upload interface is fully functional

3. **AI Prompt Editor**
   - Once a video is uploaded, try entering prompts like:
     - "Trim the first 5 seconds"
     - "Add a fade in effect"
     - "Make it grayscale"
   - The AI parsing will work if you add a Gemini API key

4. **Video Player**
   - Watch uploaded videos
   - Use playback controls
   - Scrub through timeline

## Adding Your Gemini API Key

To enable AI-powered editing:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Edit the `.env` file:
```bash
nano .env
```

3. Replace the placeholder:
```env
GEMINI_API_KEY="your-actual-api-key-here"
```

4. Restart the server (Ctrl+C in terminal, then `npm run dev`)

## What Works in Demo Mode

✅ **Fully Functional:**
- Landing page and navigation
- Authentication UI (sign in/sign up pages)
- Editor interface layout
- Video upload interface
- AI prompt input
- Video player controls
- Project management UI

⚠️ **Limited in Demo Mode:**
- Database persistence (data resets on server restart)
- Actual video processing (requires FFmpeg)
- User authentication (mock credentials only)
- File storage (files upload but not processed)

## Full Setup (Optional)

To enable full functionality with real database and video processing:

### Requirements:
1. **FFmpeg** - For video processing
   ```bash
   # macOS
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt-get install ffmpeg
   ```

2. **Prisma Engines** - For database
   ```bash
   # This requires internet access to download engines
   npx prisma generate
   npx prisma db push
   ```

3. **Gemini API Key** - For AI editing
   - Add to `.env` as shown above

## Testing Features

### 1. UI Components
- ✅ Responsive design (resize browser)
- ✅ Button interactions
- ✅ Form validation
- ✅ Modal dialogs
- ✅ Drag and drop areas

### 2. Navigation
- ✅ Landing page → Sign In
- ✅ Sign In → Editor
- ✅ Navigation between projects

### 3. Video Upload
- ✅ Drag and drop works
- ✅ File type validation
- ✅ Progress indicators
- ✅ Multiple file uploads

### 4. AI Prompt Interface
- ✅ Text input functionality
- ✅ Suggestion chips
- ✅ Submit handling
- ✅ Command examples

### 5. Project Management
- ✅ Create projects
- ✅ Switch between projects
- ✅ View project videos
- ✅ Project sidebar navigation

## Sample Test Videos

You can test with any video file. Here are some suggestions:

1. **Screen Recording** - Record your screen for 10-30 seconds
2. **Phone Video** - Use any video from your phone
3. **Sample Videos** - Download from:
   - https://sample-videos.com/
   - https://test-videos.co.uk/

## Example AI Prompts to Try

Once you have a Gemini API key configured:

```
"Trim the first 10 seconds"
"Make the video black and white"
"Add a fade in at the start"
"Speed up the video by 2x"
"Crop to square aspect ratio"
"Add text 'Hello World' at the top"
"Increase the brightness"
"Extract the audio"
"Reverse the video"
"Add a fade out at the end"
```

## Troubleshooting

### Server won't start
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill

# Start again
npm run dev
```

### Can't access localhost:3000
- Check if server is running: Look for "✓ Ready in" message
- Try: http://127.0.0.1:3000
- Check firewall settings

### Video upload errors
- Check uploads/ directory exists: `ls uploads/`
- Check file size (max 100MB by default)
- Supported formats: MP4, MOV, AVI, MKV, WebM

### Gemini API errors
- Verify API key in `.env`
- Check quota at Google AI Studio
- Ensure no extra spaces in API key
- Restart server after changing .env

## Developer Console

Open browser DevTools (F12) to see:
- Network requests
- Console logs
- React component tree
- Performance metrics

## Stopping the Server

To stop the development server:
```bash
# Find the process
ps aux | grep "next dev"

# Kill it
kill <process-id>

# Or use Ctrl+C in the terminal where it's running
```

## Next Steps

1. **Get Gemini API Key** - Enable AI features
2. **Install FFmpeg** - Enable video processing
3. **Upload Test Video** - Try the interface
4. **Test AI Prompts** - See natural language editing
5. **Customize UI** - Modify components to your liking

## Support

The app is now ready for testing! Explore the interface and see how the AI video editor works.

For full production setup, see SETUP.md
