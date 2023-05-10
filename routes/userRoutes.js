import express from "express"
const router=express.Router();
 

import UserController from "../controllers/userController.js"
import checkUserAuth from "../middlewares/auth-middleware.js"
//public routes
router.post("/login", UserController.userLogin)
router.post("/register", UserController.userRegistration)

router.post("/sendEmail", UserController.sendEmail)
router.get("/verifyEmail",checkUserAuth,UserController.verifyEmail)
	 
export default router;
