import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

/**
 * Route categories:
 *
 * EXPLORER_ROUTES   — accessible by anyone (logged in or not)
 * AUTH_ROUTES       — only for unauthenticated users
 * ONBOARDING_ROUTES — require session; redirect away if onboarding complete
 * PROTECTED_ROUTES  — require session + completed onboarding
 */

// These pages are accessible regardless of auth state (landing page, marketing, etc.)
const EXPLORER_ROUTES = ['/', '/about', '/pricing', '/contact', '/explore'];

// Only for logged-out users — redirect logged-in users away
const AUTH_ROUTES = ['/auth', '/signup', '/auth'];

const ONBOARDING_SEGMENT = '/onboarding';

function isExplorer(pathname: string) {
  return EXPLORER_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

function isOnboardingRoute(pathname: string) {
  return pathname.includes(ONBOARDING_SEGMENT);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  // Explorer routes: always pass through — no auth needed
  if (isExplorer(pathname)) {
    return NextResponse.next();
  }

  // No session
  if (!token) {
    if (isAuthRoute(pathname)) {
      return NextResponse.next();   // /login and /signup are fine without a session
    }
    // All other routes need a session
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('next', pathname);  // remember where they were going
    return NextResponse.redirect(loginUrl);
  }

  // Has a token — verify it
  const session = await decrypt(token);

  if (!session) {
    // Expired or tampered — clear cookie and send to login
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('session');
    return response;
  }

  const role = session.role.toLowerCase();

  // Logged-in user hitting /login or /signup
  if (isAuthRoute(pathname)) {
    if (!session.onboardingComplete) {
      return NextResponse.redirect(
        new URL(`/${role}/onboarding?step=${session.currentStep}`, request.url)
      );
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Onboarding routes
  if (isOnboardingRoute(pathname)) {
    if (session.onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Correct the path if the role in the URL doesn't match the session
    const expectedPath = `/${role}/onboarding`;
    if (!pathname.startsWith(expectedPath)) {
      return NextResponse.redirect(
        new URL(`${expectedPath}?step=${session.currentStep}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // All other protected routes — require completed onboarding
  if (!session.onboardingComplete) {
    return NextResponse.redirect(
      new URL(`/${role}/onboarding?step=${session.currentStep}`, request.url)
    );
  }

  return NextResponse.next();
}

// Apply middleware to all routes except Next.js internals, static files, and public images
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
