// Dans src/middleware.js
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Routes publiques (laissez passer toutes les requêtes API)
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',  // Laisse passer toutes les requêtes API
  '/_next/static(.*)',
  '/_next/image(.*)',
  '/favicon.ico'
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  
  // Laisser passer toutes les requêtes API
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Vérification de l'authentification uniquement pour les routes non-API
  const { userId } = await auth();
  
  if (!userId && !isPublicRoute(req)) {
    // Redirection vers la page de connexion pour les routes non-API non publiques
    return auth().redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};