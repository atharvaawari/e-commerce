import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({limit: '16kb'}));  
app.use(express.urlencoded({extended: true, limit:"16kb"}));  
app.use(express.static("public")); 
app.use(cookieParser());


//routes
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';
import cartRouter from './routes/cart.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';

//route-declaration
app.use('/api/v1/user', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/enquiry', enquiryRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);

app.use('/test', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Hello world",
  })
})

export {app};