import mongoose, { InferSchemaType, Model, Schema } from "mongoose";
const inquirySchema = new Schema({
  type:{type:String,enum:["contact","quote"],required:true,index:true},
  name:{type:String,required:true,trim:true}, phone:{type:String,default:"",trim:true}, email:{type:String,default:"",trim:true,lowercase:true}, county:{type:String,default:"",trim:true},
  subject:{type:String,default:"",trim:true}, message:{type:String,default:"",trim:true},
  quote:{type:Schema.Types.Mixed,default:null}, status:{type:String,enum:["new","contacted","closed"],default:"new",index:true}
},{timestamps:true});
export type InquiryDocument=InferSchemaType<typeof inquirySchema>;
const Inquiry:Model<InquiryDocument>=mongoose.models.Inquiry?mongoose.models.Inquiry as Model<InquiryDocument>:mongoose.model<InquiryDocument>("Inquiry",inquirySchema);
export default Inquiry;
