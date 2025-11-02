"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoUpload } from '@/components/video-upload'
import { VideoPlayer } from '@/components/video-player'
import { AIPromptEditor } from '@/components/ai-prompt-editor'
import { EditsList } from '@/components/edits-list'
import { Video, LogOut, Plus, FolderOpen } from 'lucide-react'

export default function Editor() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [editRefreshTrigger, setEditRefreshTrigger] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const { projects: fetchedProjects } = await response.json()
        setProjects(fetchedProjects)

        if (fetchedProjects.length > 0 && !currentProject) {
          setCurrentProject(fetchedProjects[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const createProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProjectName }),
      })

      if (response.ok) {
        const { project } = await response.json()
        setProjects([project, ...projects])
        setCurrentProject(project)
        setNewProjectName('')
        setShowNewProject(false)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleVideoUpload = (video: any) => {
    setSelectedVideo(video)
    fetchProjects() // Refresh to get updated project with new video
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">AI Video Editor</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session?.user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Projects */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewProject(!showNewProject)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {showNewProject && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Project name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && createProject()}
                    />
                    <Button size="sm" onClick={createProject}>
                      Add
                    </Button>
                  </div>
                )}

                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects yet
                  </p>
                ) : (
                  projects.map((project) => (
                    <Button
                      key={project.id}
                      variant={currentProject?.id === project.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentProject(project)
                        setSelectedVideo(null)
                      }}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {project.name}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Videos in current project */}
            {currentProject && currentProject.videos?.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {currentProject.videos.map((video: any) => (
                    <Button
                      key={video.id}
                      variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                      className="w-full justify-start text-sm"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Video className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{video.originalName}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {!currentProject ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No Project Selected</p>
                  <p className="text-muted-foreground">
                    Create a new project to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Video Upload */}
                <VideoUpload
                  projectId={currentProject.id}
                  onUploadComplete={handleVideoUpload}
                />

                {/* Video Player & Editor */}
                {selectedVideo ? (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <VideoPlayer videoPath={selectedVideo.filePath} />

                      <AIPromptEditor
                        videoId={selectedVideo.id}
                        onEditComplete={() => setEditRefreshTrigger(prev => prev + 1)}
                      />
                    </div>

                    <div>
                      <EditsList
                        videoId={selectedVideo.id}
                        refreshTrigger={editRefreshTrigger}
                      />
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">No Video Selected</p>
                      <p className="text-muted-foreground">
                        Upload a video or select one from your project
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
