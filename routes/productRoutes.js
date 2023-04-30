import express from "express"
const router = express.Router();
import ProductController from "../controllers/productController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";






//user checkout add,remove,list,update products
router.post('/addCheckout', checkUserAuth, ProductController.addEvent);
router.get('/listCheckout',checkUserAuth,ProductController.eventList);
router.delete('/removeCheckout',checkUserAuth,ProductController.eventList);
router.put('/updateCheckout',checkUserAuth,ProductController.eventList);



//list products
router.get('/listProducts', ProductController.productList);
router.get('/singleProduct', ProductController.productDetails);





export default router;