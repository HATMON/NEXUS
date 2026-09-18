import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ecovolt_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSession = {
  role: "admin";
  email: string;
  exp: number;
};

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminSession(email: string) {
  const session: AdminSession = {
    role: "admin",
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string | null): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (session.role !== "admin" || !session.email || session.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getAdminSession(request: NextRequest) {
  return verifyAdminSession(request.cookies.get(COOKIE_NAME)?.value);
}

export function requireAdmin(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      ),
    };
  }
  return { session, response: null };
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
