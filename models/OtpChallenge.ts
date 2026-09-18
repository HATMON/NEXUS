import mongoose, { InferSchemaType, Model, Schema } from "mongoose";
const schema = new Schema({ target:{type:String,required:true,index:true,trim:true,lowercase:true}, purpose:{type:String,enum:["login","register"],required:true}, codeHash:{type:String,required:true}, expiresAt:{type:Date,required:true,index:{expires:0}}, attempts:{type:Number,default:0}, firstName:{type:String,default:""}, lastName:{type:String,default:""}, phone:{type:String,default:""}, email:{type:String,default:""} },{timestamps:true});
export type OtpChallengeDocument = InferSchemaType<typeof schema>;
const OtpChallenge: Model<OtpChallengeDocument> = mongoose.models.OtpChallenge ? mongoose.models.OtpChallenge as Model<OtpChallengeDocument> : mongoose.model<OtpChallengeDocument>("OtpChallenge", schema);
export default OtpChallenge;
