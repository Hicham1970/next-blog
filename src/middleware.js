import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(["/dashboard/create-post"])
const isProtectedRoute = createRouteMatcher(["/dashboard/(.*)"])
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = auth()
    if (!userId) {
      // Utilisez NextResponse pour la redirection
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    // Check if the user is not an admin
    if (isAdminRoute(req) && !sessionClaims?.publicMetadata?.isAdmin) {
      // Redirect to /dashboard if not admin
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}