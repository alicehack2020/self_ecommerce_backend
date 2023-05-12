import express from "express"
const router = express.Router();
import PaymentController from "../controllers/paymentController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//user checkout add,remove,list,update products
router.post('/orders',checkUserAuth,PaymentController.ordersData);
router.post('/verify',checkUserAuth,PaymentController.verifyData);

export default router;