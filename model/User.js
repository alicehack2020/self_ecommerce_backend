import mongoose from "mongoose";
//defining Schema
const userSchema=new mongoose.Schema({
    fname:{type:String,required:true,trim:true},
    lname:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    mobile:{type:String,required:true,trim:true},
    password:{type:String,required:true},
    emailverified:{type:String,default:false},
})

//Model
const UserModel=mongoose.model("user",userSchema);
export default UserModel;