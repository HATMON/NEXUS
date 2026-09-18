import mongoose,{InferSchemaType,Model,Schema} from "mongoose";
const schema=new Schema({action:{type:String,required:true},entityType:{type:String,required:true},entityId:{type:String,default:""},details:{type:String,default:""},performedBy:{type:String,default:"System"}},{timestamps:true});
export type ActivityLogDocument=InferSchemaType<typeof schema>;
const ActivityLog:Model<ActivityLogDocument>=mongoose.models.ActivityLog?mongoose.models.ActivityLog as Model<ActivityLogDocument>:mongoose.model<ActivityLogDocument>("ActivityLog",schema);
export default ActivityLog;
