import express from "express"
const router=express.Router();
 

import UserController from "../controllers/userController.js"

//public routes
router.post("/login", UserController.userLogin)
router.post("/register", UserController.userRegistration)
	 

 


export default router;
