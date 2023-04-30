import mongoose from "mongoose";
//defining Schema
const productSchema=new mongoose.Schema({
    brandName:{type:String,required:true,trim:true},
    listPrice:{type:String,required:true,trim:true},
    heroImage:{type:String,required:true,trim:true},
    productId:{type:String,required:true,trim:true},
    rating:{type:String,required:true,trim:true},
    reviews:{type:String,required:true,trim:true}
})

//Model
const ProductModel=mongoose.model("product",productSchema);
export default ProductModel;