import express from "express"
const router = express.Router();
import PaymentController from "../controllers/paymentController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//user checkout add,remove,list,update products
router.post('/orders',PaymentController.ordersData);
router.post('/verify', PaymentController.verifyData);

export default router;