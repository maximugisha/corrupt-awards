// lib/auth.ts
import { jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  role: string;
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getUser() {
  const token = (await cookies()).get('token')?.value;

  if (!token) return null;

  return verifyToken(token);
}