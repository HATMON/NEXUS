import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/customer-auth";
export async function POST(){const r=NextResponse.json({success:true}); clearCustomerSessionCookie(r); return r;}
