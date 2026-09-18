import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import OtpChallenge from "@/models/OtpChallenge";
import User from "@/models/User";
import { createCustomerSession, setCustomerSessionCookie } from "@/lib/customer-auth";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
function hash(code:string){ return crypto.createHash("sha256").update(code).digest("hex"); }
export async function POST(req:NextRequest){
  const limit=checkRateLimit(`otp-verify:${requestIp(req.headers)}`,10,15*60*1000); if(!limit.allowed) return NextResponse.json({success:false,message:"Too many attempts."},{status:429});
  const {target,code}=await req.json(); if(!target||!code) return NextResponse.json({success:false,message:"Target and code are required."},{status:400});
  const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,message:"Authentication database unavailable."},{status:503});
  const challenge=await OtpChallenge.findOne({target:String(target).trim().toLowerCase(),expiresAt:{$gt:new Date()}}).sort({createdAt:-1});
  if(!challenge) return NextResponse.json({success:false,message:"Code expired or not found."},{status:400});
  challenge.attempts+=1; await challenge.save();
  if(challenge.attempts>5 || hash(String(code).trim())!==challenge.codeHash) return NextResponse.json({success:false,message:"Invalid verification code."},{status:401});
  const email=(challenge.email|| (String(target).includes("@")?String(target):`${String(target).replace(/\D/g,"")}@phone.ecovolt.local`)).toLowerCase();
  let user=await User.findOne({email});
  if(!user){ const name=`${challenge.firstName} ${challenge.lastName}`.trim() || email.split("@")[0]; user=await User.create({firstName:challenge.firstName,lastName:challenge.lastName,name,email,phone:challenge.phone||(!String(target).includes("@")?String(target):""),authProvider:"otp",isVerified:true}); }
  await OtpChallenge.deleteMany({target:challenge.target});
  const response=NextResponse.json({success:true,user:{id:String(user._id),name:user.name,email:user.email,phone:user.phone,authProvider:user.authProvider,avatar:user.avatar,county:user.county,town:user.town,address:user.address,createdAt:(user as any).createdAt?.toISOString?.()||new Date().toISOString(),isVerified:true}});
  setCustomerSessionCookie(response,createCustomerSession(String(user._id),user.email)); return response;
}
