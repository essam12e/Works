import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

import { prisma } from "./db";

const cookieName = "hafitha-session";
const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(
    process.env.SESSION_SECRET ?? "dev-secret-change-me-before-production",
  );
}

export type SessionPayload = {
  userId: string;
  role: "MANAGER" | "EMPLOYEE";
  companyId?: string | null;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: String(payload.userId),
      role: payload.role as "MANAGER" | "EMPLOYEE",
      companyId: payload.companyId ? String(payload.companyId) : null,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { company: true, employee: true },
  });
}

export async function requireManager() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "MANAGER") redirect("/");
  return user;
}

export async function requireManagerCompany() {
  const user = await requireManager();
  if (!user.companyId) redirect("/onboarding/company");
  return user as typeof user & { companyId: string };
}
