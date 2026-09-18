import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import OtpChallenge from "@/models/OtpChallenge";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { deliverOtp } from "@/lib/notifications";

function normalizeTarget(value:string){ return value.trim().toLowerCase(); }
function hash(code:string){ return crypto.createHash("sha256").update(code).digest("hex"); }
export async function POST(req:NextRequest){
  const limit=checkRateLimit(`otp-request:${requestIp(req.headers)}`,5,15*60*1000);
  if(!limit.allowed) return NextResponse.json({success:false,message:"Too many OTP requests. Try again later."},{status:429});
  const body=await req.json(); const target=normalizeTarget(body.target||body.email||body.phone||"");
  if(!target) return NextResponse.json({success:false,message:"Email or phone is required."},{status:400});
  const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,message:"Authentication database unavailable."},{status:503});
  const code=String(Math.floor(100000+Math.random()*900000));
  await OtpChallenge.deleteMany({target});
  await OtpChallenge.create({target,purpose:body.purpose==="register"?"register":"login",codeHash:hash(code),expiresAt:new Date(Date.now()+10*60*1000),firstName:String(body.firstName||""),lastName:String(body.lastName||""),phone:String(body.phone||""),email:String(body.email||"")});
  const email=String(body.email || (target.includes("@") ? target : "")).trim().toLowerCase();
  const phone=String(body.phone || (!target.includes("@") ? target : "")).trim();
  const delivery=await deliverOtp({email:email||undefined,phone:phone||undefined,code});
  if(process.env.NODE_ENV==="production" && !delivery.sent) {
    await OtpChallenge.deleteMany({target});
    return NextResponse.json({success:false,message:"Verification delivery service is not configured."},{status:503});
  }
  const payload:any={success:true,message:delivery.sent?"Verification code sent.":"Development verification code generated."};
  if(process.env.NODE_ENV!=="production" && process.env.EXPOSE_DEV_OTP==="true") payload.devOtp=code;
  return NextResponse.json(payload);
}
