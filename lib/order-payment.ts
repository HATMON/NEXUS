import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function confirmOrderPayment(orderId:string, reference:string, message:string){
  const session=await mongoose.startSession();
  try{
    let result:any=null;
    await session.withTransaction(async()=>{
      const order:any=await Order.findById(orderId).session(session);
      if(!order) throw new Error("Order not found.");
      if(order.payment.status==="paid"){ result=order; return; }
      for(const item of order.items){
        const update=await Product.updateOne({slug:item.slug,stock:{$gte:item.quantity}},{$inc:{stock:-item.quantity}},{session});
        if(update.modifiedCount!==1) throw new Error(`Insufficient stock for ${item.name}.`);
      }
      order.payment.status="paid";
      order.payment.reference=reference;
      order.status="payment-confirmed";
      order.trackingHistory.push({status:"payment-confirmed",message,location:"EcoVolt Nexus",date:new Date()});
      await order.save({session}); result=order;
    });
    return result;
  } finally { await session.endSession(); }
}
