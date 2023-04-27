import mongoose from "mongoose";
//defining Schema
const eventSchema=new mongoose.Schema({
    userId:{type:String,required:true,trim:true},
    eventName:{type:String,required:true,trim:true},
    startdate:{type:String,required:true,trim:true},
    enddate:{type:String,required:true,trim:true},
    startTime:{type:String,required:true,trim:true},
    endTime:{type:String,required:true,trim:true},
    location:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    category:{type:String,required:true,trim:true},
    bannerImage:{type:String,required:true},  
})

//Model
const EventModel=mongoose.model("event",eventSchema);
export default EventModel;
