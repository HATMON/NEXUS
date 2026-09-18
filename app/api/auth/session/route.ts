import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
export async function GET(req:NextRequest){ const s=getCustomerSession(req); if(!s) return NextResponse.json({authenticated:false},{status:401}); const db=await connectToDatabase(); if(!db) return NextResponse.json({authenticated:false},{status:503}); const u=await User.findById(s.userId).lean(); if(!u) return NextResponse.json({authenticated:false},{status:401}); return NextResponse.json({authenticated:true,user:{id:String((u as any)._id),name:(u as any).name,email:(u as any).email,phone:(u as any).phone,authProvider:(u as any).authProvider,avatar:(u as any).avatar,county:(u as any).county,town:(u as any).town,address:(u as any).address,createdAt:(u as any).createdAt}}); }
