import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ecovolt_customer_session";
const TTL = 60 * 60 * 24 * 14;
export type CustomerSession = { role: "customer"; userId: string; email: string; exp: number };

function secret() {
  const value = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("CUSTOMER_SESSION_SECRET must be at least 32 characters.");
  return value;
}
function sign(payload: string) { return crypto.createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function createCustomerSession(userId: string, email: string) {
  const body: CustomerSession = { role: "customer", userId, email, exp: Math.floor(Date.now()/1000) + TTL };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function verifyCustomerSession(token?: string|null): CustomerSession|null {
  if (!token) return null;
  const [payload,sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a=Buffer.from(sig), b=Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return null;
  try { const s=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as CustomerSession; return s.role==="customer" && s.exp>Date.now()/1000 ? s : null; } catch { return null; }
}
export function getCustomerSession(req: NextRequest) { return verifyCustomerSession(req.cookies.get(COOKIE_NAME)?.value); }
export function setCustomerSessionCookie(res: NextResponse, token: string) { res.cookies.set({name:COOKIE_NAME,value:token,httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:TTL}); }
export function clearCustomerSessionCookie(res: NextResponse) { res.cookies.set({name:COOKIE_NAME,value:"",httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0}); }
