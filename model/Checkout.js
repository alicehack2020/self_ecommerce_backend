import mongoose from "mongoose";
//defining Schema
const checkoutSchema=new mongoose.Schema({
    userid:{type:String,required:true,trim:true},
    paid:{type:Boolean,required:true,trim:true},
    lists: {
        type: [String],
        default: [],
    }
})

//Model
const CheckoutModel=mongoose.model("checkout",checkoutSchema);
export default CheckoutModel;