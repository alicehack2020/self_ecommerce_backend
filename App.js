
import express from "express";
import cors from "cors"
 
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
 
import dotenv from "dotenv"
 
 import bodyParser from "body-parser";
import connectDb from "./config/connectdb.js"

dotenv.config()

const app = express();
const database_url=process.env.DATABASE_URL;  
//database connection
connectDb(database_url)
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
 app.use('/api/product',productRoutes)

app.get("/", (req, res) => {
    res.send({message:"Welcome"})
})


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
