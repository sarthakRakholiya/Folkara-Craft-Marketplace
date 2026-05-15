import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { Role, SessionPayload } from '@/types/auth';

// ── Key setup ────────────────────────────────────────────────────────────────
// Converts the string secret to a Uint8Array that jose requires
const getKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return new TextEncoder().encode(secret);
};

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// ── encrypt() ────────────────────────────────────────────────────────────────
// Takes a payload object, returns a signed JWT string
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey());
}

// ── decrypt() ────────────────────────────────────────────────────────────────
// Verifies and decodes a JWT string. Returns null if expired or tampered.
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;  // Don't crash — just treat as unauthenticated
  }
}

// ── getSession() ─────────────────────────────────────────────────────────────
// Reads the cookie from the incoming request and decrypts it.
// Returns null if no cookie or if the token is invalid/expired.
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function setSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt(payload);
  cookieStore.set('session', token, sessionCookieOptions(expires));
}

// ── sessionCookieOptions() ───────────────────────────────────────────────────
// Shared cookie options — avoids copy-paste drift across multiple set() calls.
export function sessionCookieOptions(expires: Date) {
  return {
    expires,
    httpOnly: true,                                   // JS cannot read this cookie
    secure: process.env.NODE_ENV === 'production',    // HTTPS only in prod
    sameSite: 'lax' as const,                         // CSRF protection
    path: '/',                                        // Cookie sent on all routes
  };
}
