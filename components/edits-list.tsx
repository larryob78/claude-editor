"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, XCircle, Clock, Loader2, Download } from 'lucide-react'

interface Edit {
  id: string
  operation: string
  parameters: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  outputPath?: string
  createdAt: string
}

interface EditsListProps {
  videoId: string
  refreshTrigger?: number
}

export function EditsList({ videoId, refreshTrigger }: EditsListProps) {
  const [edits, setEdits] = useState<Edit[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEdits = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/edit`)
      if (response.ok) {
        const { edits: fetchedEdits } = await response.json()
        setEdits(fetchedEdits)
      }
    } catch (error) {
      console.error('Failed to fetch edits:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEdits()
  }, [videoId, refreshTrigger])

  // Auto-refresh while there are pending/processing edits
  useEffect(() => {
    const hasActiveEdits = edits.some(
      edit => edit.status === 'pending' || edit.status === 'processing'
    )

    if (hasActiveEdits) {
      const interval = setInterval(fetchEdits, 2000)
      return () => clearInterval(interval)
    }
  }, [edits])

  const getStatusIcon = (status: Edit['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: Edit['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      case 'processing':
        return 'Processing'
      default:
        return 'Pending'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit History</CardTitle>
      </CardHeader>
      <CardContent>
        {edits.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No edits yet. Use the AI editor to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {edits.map((edit) => (
              <Card key={edit.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(edit.status)}
                        <span className="font-medium capitalize">
                          {edit.operation}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        {getStatusText(edit.status)}
                      </p>

                      {edit.error && (
                        <p className="text-sm text-red-600">
                          Error: {edit.error}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(edit.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {edit.status === 'completed' && edit.outputPath && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(edit.outputPath, '_blank')
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
