import UserModel from "../model/User.js";
import CheckoutModel from "../model/Checkout.js";
import Jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { google } from "googleapis"
import { sendEmailTemp } from "../helper/Helper.js";
import { sendEmailOtp } from "../helper/Helper.js";
class UserController{
  //normal register
  static userRegistration = async (req, res) => {
    const { email, fname, lname, password, mobile } = req.body.userInfo;
    console.log(req.body)
     try {
      const user = await UserModel.findOne({ email: email })
      if(user)
      {
        res.send({ "status": "failed", "message": "Email Already Used" })
      }
          else
          {
            try {
              const doc=new UserModel({
                fname:fname,
                lname:lname,
                email:email,
                password: password,
                mobile: mobile
              })
  
              await doc.save()
              const user = await UserModel.findOne({ email: email })

              const data = {
                userID: user._id,
                email: user.email,
                fname: user.fname
              }
              const token=Jwt.sign(data,
                process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
             
              const result=await sendEmailTemp(user.email,token)
                
              res.send({
                "status": "success", "message": "registration successfully,Verification email has been send on your email please check",
                data,
                token,
                id:user._id
            })
            } catch (error) {
               
              res.send({"status":"failed","message":"unable to register"})
             }
          } 
    } catch (error) {
      console.log(error)
      res.send({"status":"failed","message":"unable to register"})
    }
    
    
  }
  //normal login
  static userLogin = async (req, res) => {
    const { email, password} = req.body;
    try {
      const user = await UserModel.findOne({ email: email })
      if (user)
        if (user.password == password)
        {
          if (user.emailverified=="true")
          {
            const data = {
              userID: user._id,
              email: user.email,
              fame: user.fame,
             }
         
              const token=Jwt.sign(data,
                process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
         
             res.send({
               "status": "success",
               "message": "login successfully",
               data,
               token,
               id:user._id
             })
          }
          else {
            res.send({"status":"failed","message":"Please Verify Your Email"})

          }
         
        }
        else {
          res.send({"status":"failed","message":"invalid email/password"})
        }
       
       else
       {
        res.send({"status":"failed","message":"invalid email/password"})
       }
    } catch (error) {
      console.log(error)
      res.send({"status":"failed","message":"invalid email/password"})
    }

  
  }

  //normal sendEmail
  static sendEmail = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email)
     
      const user = await UserModel.findOne({ email: email })
      
      console.log(user)
      if (user!==null)
      {


        const data = {
          userID: user._id,
          email: user.email,
          fname: user.fname
        }
        const token=Jwt.sign(data,
          process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
        
       const result=await sendEmailTemp(user.email,token)
       console.log("result", result)
       res.send({"status":"sucess","message":"email has been send please check your email"})
      }
      else {
        res.send({"status":"failed","message":"Account not found"})
      } 
    }  
      catch (error) {
      console.log(error)
      res.send({"status":"failed","message":"error"})
    }
  };
 //normal verifyEmail
  static verifyEmail = async (req, res) => {
    try {
      const data = {
        userID: req.user._id,
        email: req.user.email,
        fame: req.user.fame,
      }
        const query = { email: req.user.email };
        const update = { $set: { emailverified: true } };
        const result = await UserModel.updateOne(query, update);
      if (result.acknowledged)
      {
        res.send({
          "status": "success",
          "message": "email has been verified successfully.Now You can login ",
        })  
      } else {
        res.status(400).send({
          "status": "fail",
          "message": "user not found",
        })
     }  

     
    } catch (error) {
      console.log(error)
      res.status(400).send({
        "status": "fail",
        "message": "Invalid token please re-verify email",
      }) 
    }
  }


  //checkout login with otp logic
  static userLoginInCheckOut = async (req, res) => {
    const { email, password,ip} = req.body;
    try {
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const data = {
          userID: user._id,
          email: user.email,
          fame: user.fname,
          lname: user.lname,
          mobile: user.mobile,
        }
        var token = Jwt.sign(data,
          process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
       
        if (user.password == password) {
          if (user.emailverified == "true") {
            
            const list = await CheckoutModel.find({ userid: ip, paid: false })
           
            if (list.length > 0) {
              //updateting user id with temp checkout products
              let updateUserId = await UserModel.updateOne({ userid: ip }, { $set: { userid: user._id } })
              if (updateUserId.acknowledged) {
                res.send({
                  "status": "success",
                  "message": "login successfully",
                  data,
                  verified:true,
                  token,
                  id: user._id
                })
              }
            }
            else {
               //some db issue
               res.send({"status":"failed","message":"something went wrong"})
            }
            
          }
          else {
            var otp = Math.floor(1000 + Math.random() * 9000);
            let update = await UserModel.updateOne({ _id: user._id }, { $set: { otp: otp } })
            if (update.acknowledged) {
              const result = await sendEmailOtp(user.email, otp)
              res.send({ "status": "success", "message": "Verification Otp has been sent on your email",verified:false})
            }
          }
        }
        else {
          res.send({ "status": "failed", "message": "invalid email/password" })
        }
      }
       else
       {
        res.send({"status":"failed","message":"invalid email/password"})
       }
    } catch (error) {
      console.log(error)
      res.send({"status":"failed","message":"invalid email/password"})
    }

  
  }

  static verifyEmailWithOtp = async (req, res) => {
    try {
     
      const { email, pin, ip } = req.body;
   
      if (email && pin && ip) 
      {
        let userData = await UserModel.findOne({ email: email })
       
        if (Object.keys(userData).length !== 0)
        {
          if (userData.otp == pin)
          {
           
            const query = { email: email };
            const update = { $set: { emailverified: true } };
            const result = await UserModel.updateOne(query, update);
           
            if (result.acknowledged)
            {
              
              const user = await UserModel.findOne({ email: email })
             
              const data = {
                userID: user._id,
                email: user.email,
                fame: user.fname,
                lname: user.lname,
                mobile: user.mobile,
              }
              const token=Jwt.sign(data,
                process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
              // console.log("data=====>",data)
              // console.log("user._id", user._id)
              console.log("ip----->",ip)
              let checkoutDataCheck = await CheckoutModel.findOne({ userid: ip })
               console.log("checkoutDataCheck",checkoutDataCheck)
              // console.log("user._id----->",user._id)

              let updateUserId = await CheckoutModel.updateOne({ _id: checkoutDataCheck._id }, { $set: { userid: data.userID } })
              console.log("updateUserId",updateUserId)
              if (updateUserId.acknowledged)
              {
                res.send({
                  "status": "success",
                  "message": "email has been verified successfully",
                  data,
                  token,
                  id: user._id
                })
              }
              else {
                res.status(400).send({
                  "status": "fail",
                  "message": "Please Contact Team",
                })  
              }
            }
          } else {
            res.status(400).send({
              "status": "fail",
              "message": "incorrect otp",
            })  
          }
        }
      } else {
        res.status(400).send({
          "status": "fail",
          "message": "Please Enter otp",
        }) 
      }
    } catch (error) {
      console.log(error)
      res.status(400).send({
        "status": "fail",
        "message": "Invalid token please re-verify email",
      }) 
    }
  }

}

export default UserController;