import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req:NextRequest){
  const session=getCustomerSession(req); if(!session) return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
  const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,error:"Database unavailable"},{status:503});
  const body=await req.json();
  const allowed:any={};
  for(const key of ["name","phone","county","town","address"]){ if(typeof body[key]==="string") allowed[key]=body[key].trim(); }
  if(allowed.name && allowed.name.length>120) return NextResponse.json({success:false,error:"Name is too long."},{status:400});
  if(allowed.address && allowed.address.length>500) return NextResponse.json({success:false,error:"Address is too long."},{status:400});
  const user:any=await User.findByIdAndUpdate(session.userId,{$set:allowed},{new:true,runValidators:true}).lean();
  if(!user) return NextResponse.json({success:false,error:"User not found."},{status:404});
  return NextResponse.json({success:true,user:{id:String(user._id),name:user.name,email:user.email,phone:user.phone,authProvider:user.authProvider,avatar:user.avatar,county:user.county,town:user.town,address:user.address,createdAt:user.createdAt,isVerified:user.isVerified}});
}
