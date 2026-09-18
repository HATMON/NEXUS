import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { initiateStkPush } from "@/lib/mpesa";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
export async function POST(req:NextRequest){
  const limit=checkRateLimit(`mpesa:${requestIp(req.headers)}`,5,10*60*1000); if(!limit.allowed) return NextResponse.json({success:false,error:"Too many payment requests."},{status:429});
  try{ const {orderNumber}=await req.json(); const db=await connectToDatabase(); if(!db) return NextResponse.json({success:false,error:"Database unavailable."},{status:503}); const order:any=await Order.findOne({orderNumber:String(orderNumber||"").toUpperCase()}); if(!order) return NextResponse.json({success:false,error:"Order not found."},{status:404}); if(order.payment.method!=="mpesa") return NextResponse.json({success:false,error:"Order is not an M-Pesa order."},{status:400}); if(order.payment.status==="paid") return NextResponse.json({success:false,error:"Order is already paid."},{status:409}); const result:any=await initiateStkPush({phone:order.customer.phone,amount:order.total,accountReference:order.orderNumber,description:"EcoVolt order"}); order.payment.reference=result.CheckoutRequestID||result.MerchantRequestID||""; await order.save(); return NextResponse.json({success:true,checkoutRequestId:result.CheckoutRequestID,customerMessage:result.CustomerMessage}); }
  catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Unable to initiate M-Pesa."},{status:500});}
}
