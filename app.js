
require("dotenv").config();
//Requiring all modules before we use them
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true}
));

//Connecting to the mongodb,creating(connectig if already exists) a database called wikiDB
async function main(){
  await mongoose.connect('mongodb://localhost:27017/userDB');
}
main().catch(function(err){
  console.log(err);
});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);



//rending home page for home route
app.get("/",function(req,res){
  res.render("home");
});

//rending other route pages
app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  console.log(password);
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }
      }
    }
  });
});


















app.listen(3000,function(){
  console.log("Server started on port 3000");
});
