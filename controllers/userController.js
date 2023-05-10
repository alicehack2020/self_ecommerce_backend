import UserModel from "../model/User.js";
import Jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { google } from "googleapis"
class UserController{
  //register
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
             
             
              res.send({
                "status": "success", "message": "registration successfully",
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

  //login
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
        
        
        
    
      const CLIENT_ID = process.env.CLIENT_ID;
      const CLEINT_SECRET = process.env.CLEINT_SECRET;
      const REDIRECT_URI = process.env.REDIRECT_URI;
      const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        
      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLEINT_SECRET,
        REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'mangeshdev2042@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
  
      const mailOptions = {
        from: 'SENDER NAME <mangeshdev2042@gmail.com>',
        to: email,
        subject: 'Hello from gmail using API',
        text: 'Hello from gmail email using API',
        html: `<h1>Verify your email </h1><a href=http://localhost:3000/verifyemail/${token}>click here<a/>`,
      };
  
      const result = await transport.sendMail(mailOptions);
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
  

}

export default UserController;