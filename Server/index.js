import dotenv from 'dotenv';
// import { connectDB } from './DB/Db.config.js';
import cookieParser from 'cookie-parser';
// import Userroute from './Routes/Userroute.js';
import express from "express";
import cors from "cors";

const app = express();

dotenv.config({
    path: './.env'
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,

}))


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"})) // encoding the url
app.use(express.static("public")); // folder where we want to keep the files like pdf e.t.c;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});