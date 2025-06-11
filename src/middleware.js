import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)','/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  // const redirectUrl = decodeURIComponent(req.query.redirect_url);
  if (!userId && !isPublicRoute(req)) {
    // Add custom logic to run before redirecting to sign-in
    console.log('User is not authenticated, redirecting to sign-in...')
    return redirectToSignIn(req);
    // User is authenticated, you can access userId here
  }  
// if(!isPublicRoute(req)) await auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
