import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { sendEmail } from "@/lib/notifications";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(req:NextRequest){
  const limit=checkRateLimit(`inquiry:${requestIp(req.headers)}`,5,60*60*1000);
  if(!limit.allowed) return NextResponse.json({success:false,error:"Too many requests. Please try again later."},{status:429});
  try{
    const body=await req.json();
    const type=body.type==="quote"?"quote":"contact";
    const name=String(body.name||"").trim(), phone=String(body.phone||"").trim(), email=String(body.email||"").trim().toLowerCase();
    if(!name || (!phone && !email)) return NextResponse.json({success:false,error:"Name and a phone number or email are required."},{status:400});
    if(name.length>120 || String(body.message||"").length>3000) return NextResponse.json({success:false,error:"Submission is too long."},{status:400});
    const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,error:"Database unavailable."},{status:503});
    const inquiry:any=await Inquiry.create({type,name,phone,email,county:String(body.county||"").trim(),subject:String(body.subject||"").trim(),message:String(body.message||"").trim(),quote:type==="quote"?body.quote||null:null});
    const admin=process.env.ADMIN_EMAIL;
    if(admin){ const details=type==="quote"?JSON.stringify(body.quote||{},null,2):String(body.message||""); await sendEmail(admin,`EcoVolt ${type} inquiry from ${name}`,`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nCounty: ${body.county||""}\nSubject: ${body.subject||""}\n\n${details}`); }
    return NextResponse.json({success:true,id:String(inquiry._id)},{status:201});
  }catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Unable to submit inquiry."},{status:500});}
}
