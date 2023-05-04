import UserModel from "../model/User.js";
import Jwt  from "jsonwebtoken";
class UserController{
  //register
  static userRegistration = async (req, res) => {
    const { email, fname, lname, password } = req.body;
     try {
      const user = await UserModel.findOne({ email: email })
      if(user)
      {
        res.send({"status": "failed", "message": "Email Already Used"})}
          else
          {
            try {
                       
              
              const doc=new UserModel({
                fname:fname,
                lname:lname,
                email:email,
                password: password
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
              console.log(error)
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
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email)
    console.log(password)
    try {
      const user = await UserModel.findOne({ email: email })
      if (user)
        if (user.password == password)
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
  

}

export default UserController;