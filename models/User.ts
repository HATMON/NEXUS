import mongoose, { InferSchemaType, Model, Schema } from "mongoose";
const userSchema = new Schema({
  firstName:{type:String,default:"",trim:true}, lastName:{type:String,default:"",trim:true}, name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,index:true,lowercase:true,trim:true}, phone:{type:String,default:"",index:true,trim:true},
  authProvider:{type:String,enum:["otp","google"],required:true}, googleSub:{type:String,default:"",index:true}, avatar:{type:String,default:""},
  county:{type:String,default:""}, town:{type:String,default:""}, address:{type:String,default:""}, isVerified:{type:Boolean,default:true}
},{timestamps:true});
export type UserDocument = InferSchemaType<typeof userSchema>;
const User: Model<UserDocument> = mongoose.models.User ? mongoose.models.User as Model<UserDocument> : mongoose.model<UserDocument>("User", userSchema);
export default User;
