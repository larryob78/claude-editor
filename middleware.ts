export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/editor/:path*", "/api/projects/:path*", "/api/upload/:path*", "/api/videos/:path*"]
}
