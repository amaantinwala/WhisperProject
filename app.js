//jshint esversion:6
import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption"
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})
// console.log(process.env.API_KEY);
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret,encryptedFields:['password']});
const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const newUser = User({
        email:username,
        password:password
    });

    newUser.save().then(()=>{
        console.log("User Registered in our Database");
        res.render("login")
    }).catch(e=>{
        console.log(e);
    })
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }else{
                res.json("No User Found")
            }
        }else{
            res.redirect("/")
        }
    }).catch(e=>{
        console.log(e);
    })

})

app.listen(port,()=>{
    console.log("Server Started on port:",port)
})