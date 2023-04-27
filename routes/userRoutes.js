import express from "express"
const router=express.Router();
import passport from 'passport';

import UserController from "../controllers/userController.js"

//public routes
router.post("/login", UserController.userLogin)
router.post("/register", UserController.userRegistration)
	 

 


export default router;