// Mock Prisma client for demo purposes when Prisma engines aren't available

export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      // Mock user for demo
      if (where.email === 'demo@example.com') {
        return {
          id: 'demo-user-1',
          email: 'demo@example.com',
          name: 'Demo User',
          password: '$2a$10$YourHashedPasswordHere', // bcrypt hash of 'demo123'
        }
      }
      return null
    },
    create: async ({ data }: any) => {
      return {
        id: 'new-user-' + Date.now(),
        email: data.email,
        name: data.name,
        password: data.password,
      }
    }
  },
  project: {
    findMany: async ({ where }: any) => {
      // Mock projects
      return [
        {
          id: 'project-1',
          name: 'Demo Project',
          description: 'This is a demo project',
          userId: where.userId,
          videos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    },
    create: async ({ data }: any) => {
      return {
        id: 'project-' + Date.now(),
        name: data.name,
        description: data.description,
        userId: data.userId,
        videos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    findFirst: async ({ where }: any) => {
      if (where.userId) {
        return {
          id: 'project-1',
          name: 'Demo Project',
          userId: where.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
      return null
    }
  },
  video: {
    create: async ({ data }: any) => {
      return {
        id: 'video-' + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    findFirst: async ({ where, include }: any) => {
      return {
        id: where.id,
        fileName: 'demo-video.mp4',
        originalName: 'demo-video.mp4',
        filePath: '/uploads/demo.mp4',
        fileSize: 1024000,
        duration: 30,
        width: 1920,
        height: 1080,
        format: 'mp4',
        projectId: 'project-1',
        project: {
          userId: 'demo-user-1'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  },
  videoEdit: {
    create: async ({ data }: any) => {
      return {
        id: 'edit-' + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    findMany: async ({ where }: any) => {
      return []
    },
    update: async ({ where, data }: any) => {
      return {
        id: where.id,
        ...data,
        updatedAt: new Date(),
      }
    }
  }
}
