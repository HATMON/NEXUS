import mongoose,{InferSchemaType,Model,Schema} from "mongoose";
const schema=new Schema({productId:{type:String,required:true,index:true},name:{type:String,required:true},stock:{type:Number,required:true},limit:{type:Number,required:true},recipient:{type:String,required:true},sent:{type:Boolean,default:false}},{timestamps:true});
export type StockAlertDocument=InferSchemaType<typeof schema>;
const StockAlert:Model<StockAlertDocument>=mongoose.models.StockAlert?mongoose.models.StockAlert as Model<StockAlertDocument>:mongoose.model<StockAlertDocument>("StockAlert",schema);
export default StockAlert;
