
import express from "express";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import dotenv from "dotenv"
 
import bodyParser from "body-parser";
import connectDb from "./config/connectdb.js"
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();
const database_url=process.env.DATABASE_URL;  


connectDb(database_url)
app.use(cookieParser());
 app.use(bodyParser.json())
 

 
 
  
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);


 

//user
app.use("/auth", userRoutes);

//events
app.use('/api/product', productRoutes)
 
//payment 
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send({message:"Welcome"})
})


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
