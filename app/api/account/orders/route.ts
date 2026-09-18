import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
export async function GET(req:NextRequest){ const s=getCustomerSession(req); if(!s) return NextResponse.json({success:false,error:"Unauthorized"},{status:401}); const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,error:"Database unavailable"},{status:503}); const u:any=await User.findById(s.userId).lean(); if(!u) return NextResponse.json({success:false,error:"Unauthorized"},{status:401}); const clauses:any[]=[{"customer.email":u.email}]; if(u.phone) clauses.push({"customer.phone":u.phone}); const orders=await Order.find({$or:clauses}).sort({createdAt:-1}).select("orderNumber trackingCode total status createdAt items.name items.quantity").lean(); return NextResponse.json({success:true,orders}); }
