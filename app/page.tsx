import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Sparkles, Upload, Scissors, Wand2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Video className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold">AI Video Editor</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Edit videos with natural language using Gemini 2.5
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Upload className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Easy Upload</CardTitle>
              <CardDescription>
                Drag and drop your videos or browse from your device
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="w-8 h-8 text-primary mb-2" />
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Powered by Google Gemini 2.5 for intelligent video editing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Wand2 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Natural Language</CardTitle>
              <CardDescription>
                Just describe what you want - no complex tools needed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Scissors className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Professional Tools</CardTitle>
              <CardDescription>
                Access best-in-class editing features with simple commands
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>What You Can Do</CardTitle>
            <CardDescription>
              Powerful editing capabilities at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Basic Editing</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Trim and cut videos</li>
                <li>• Crop and resize</li>
                <li>• Rotate and flip</li>
                <li>• Adjust playback speed</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Effects & Filters</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Add fade in/out effects</li>
                <li>• Apply visual filters</li>
                <li>• Adjust brightness & contrast</li>
                <li>• Video stabilization</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Audio</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adjust volume levels</li>
                <li>• Extract audio tracks</li>
                <li>• Mute or remove audio</li>
                <li>• Audio noise reduction</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Advanced</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Add text overlays</li>
                <li>• Concatenate multiple videos</li>
                <li>• Reverse playback</li>
                <li>• Extract video segments</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
