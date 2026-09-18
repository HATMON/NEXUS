import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { confirmOrderPayment } from "@/lib/order-payment";
export async function POST(req:NextRequest){
  try{ const body:any=await req.json(); const cb=body?.Body?.stkCallback; if(!cb) return NextResponse.json({ResultCode:0,ResultDesc:"Accepted"}); const db=await connectToDatabase(); if(!db) return NextResponse.json({ResultCode:1,ResultDesc:"Database unavailable"},{status:503}); const order:any=await Order.findOne({"payment.reference":cb.CheckoutRequestID}); if(!order) return NextResponse.json({ResultCode:0,ResultDesc:"Accepted"}); if(Number(cb.ResultCode)===0){ const items=cb.CallbackMetadata?.Item||[]; const receipt=items.find((i:any)=>i.Name==="MpesaReceiptNumber")?.Value || cb.CheckoutRequestID; await confirmOrderPayment(String(order._id),String(receipt),"M-Pesa payment confirmed successfully."); } else { order.payment.status="failed"; order.trackingHistory.push({status:order.status,message:`M-Pesa payment failed: ${cb.ResultDesc||"Payment not completed"}`,location:"EcoVolt Nexus",date:new Date()}); await order.save(); } return NextResponse.json({ResultCode:0,ResultDesc:"Accepted"}); }
  catch(e){console.error("M-Pesa callback error",e); return NextResponse.json({ResultCode:0,ResultDesc:"Accepted"});}
}
