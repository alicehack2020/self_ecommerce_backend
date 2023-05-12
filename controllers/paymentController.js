import UserModel from "../model/User.js";
import Jwt from "jsonwebtoken";
import crypto from "crypto"
import Razorpay from "razorpay"; 
import CheckoutModel from "../model/Checkout.js"
import Product from "../model/Product.js"
class PaymentController {
    //generate order
    
    static ordersData = async (req, res) => {
        try {
            const userId  = req.user._id;
            const list = await CheckoutModel.findOne({ userid: userId,paid: false})
            if (list.length > 0)
            {
                 
                const ids = list[0].lists
                const data = await Product.find({ _id: { $in: ids } });
                let Total = 0
                let ItemCount=0
                for (let i = 0; i < data.length; i++)
                {
                    ItemCount=ItemCount+1
                    Total=Total+(Number(data[i].listPrice))
                }

                const instance = new Razorpay({
                    key_id: process.env.YOUR_KEY_ID,
                    key_secret: process.env.YOUR_KEY_SECRET,
                })

                const options = {
                    amount: Total * 100,
                    currency: "INR",
                    receipt: crypto.randomBytes(10).toString("hex"),
                };

                instance.orders.create(options, (error, order) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Something Went Wrong!" });
                    }
                    res.status(200).json({ data: order });
                });

                 
            }
            else
            {
                res.status(200).json({
                    message: 'No data', data:[]});   
            } 
        } catch (error) {
            console.log("error====>", error)
        }
    }

    static verifyData = async (req, res) => {
        try {
            const userId  = req.user._id;
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature} =req.body;
         
            const list = await CheckoutModel.findOne({ userid: userId,paid: false})
            if (list.length > 0)
            {
                const final = await CheckoutModel.updateOne({ userid: list._id }, { $set: { paid: true }});
                 
                if (final.acknowledged)
                {
                    return res.status(200).json({ message: "Payment successfully" });
                }
            }
            

            // this logic for signature validation
            // const sign = razorpay_order_id + "|" + razorpay_payment_id;
            // const expectedSign = crypto
            //     .createHmac("sha256", process.env.KEY_SECRET)
            //     .update(sign.toString())
            //     .digest("hex");
    
            
            // console.log("expectedSign==>", expectedSign)
            // console.log("razorpay_signature==>", razorpay_signature)
            
            // if (razorpay_signature === expectedSign) {

            //     return res.status(200).json({ message: "Payment verified successfully" });
            // } else {
            //     return res.status(400).json({ message: "Invalid signature sent!" });
            // }

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
            
        }
    }
}

export default PaymentController;