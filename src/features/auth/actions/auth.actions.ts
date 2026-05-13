'use server';

import { db } from '@/lib/db';
import { users, shops } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';
import { encrypt, sessionCookieOptions, SESSION_DURATION_MS } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signupSchema, loginSchema, type SignupInput, type LoginInput } from '@/types/auth';

type ActionResult = { error: string } | undefined;

export async function signup(data: SignupInput): Promise<ActionResult> {
  // 1. Validate input server-side
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // 2. Check email uniqueness
  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
    columns: { id: true },     
  });
  if (existing) return { error: 'An account with this email already exists' };

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  // 4. Insert new user
  const [newUser] = await db
    .insert(users)
    .values({
      id: createId(),           
      email: parsed.data.email,
      password: hashedPassword,
      role: parsed.data.role,
    })
    .returning({ id: users.id, role: users.role });

  // 5. Create JWT and set cookie
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({
    userId: newUser.id,
    role: newUser.role,
    onboardingComplete: false,
    currentStep: 1,
  });
  const cookieStore = await cookies();
  cookieStore.set('session', session, sessionCookieOptions(expires));

  // 6. Redirect 
  const onboardingRoute = parsed.data.role === 'SELLER' ? '/seller/onboarding' : '/buyer/onboarding';
  redirect(`${onboardingRoute}?step=1`);
}

export async function login(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });

  // SECURITY: same message whether email or password is wrong.
  // If you say "email not found", attackers can enumerate which emails exist.
  if (!user) return { error: 'Invalid email or password' };

  const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);
  if (!isPasswordValid) return { error: 'Invalid email or password' };

  const shop = user.role === 'SELLER' 
    ? await db.query.shops.findFirst({ where: eq(shops.userId, user.id) })
    : null;

  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({
    userId: user.id,
    role: user.role,
    onboardingComplete: user.isOnboardingComplete,
    currentStep: user.currentStep,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    shopName: shop?.name,
  });
  const cookieStore = await cookies();
  cookieStore.set('session', session, sessionCookieOptions(expires));

  if (!user.isOnboardingComplete) {
    redirect(`/${user.role.toLowerCase()}/onboarding?step=${user.currentStep}`);
  }
  redirect(`/${user.role.toLowerCase()}/overview`);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/auth');
}
