// jshint esversion:8
const express = require("express");
const https = require("https");
const path = require("path");
// const request=require("request");
const app = express();
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { urlencoded } = require("express");
// mongoose.connect("mongodb+srv://ShreyasJakati:20169361Shreyas@cluster0.m7dbtps.mongodb.net/todoListDB",{useNewUrlParser:true});
mongoose.connect("mongodb+srv://shreyasDB:20169361@cluster0.o581j5a.mongodb.net/shreyasDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const pizzaSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});
const Pizza = new mongoose.model("Pizza", pizzaSchema);

//offers Schema
const offerSchema = new mongoose.Schema({
  offername: String,
  offerquantity: Number,
  offerprice: Number,
});
const Offer = new mongoose.model("Offer", offerSchema);

//User data Schema

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  pizzasordered: { type: Array },
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home1");
});
app.get("/menu", function (req, res) {
  res.render("home2", {
    Good: "Hello123",
    Bad: "Naughty",
  });
});

let s = 0;
app.get("/pizzas/:x/:t", function (req, res) {
  let oname = req.params.x;
  console.log(oname);
  let oprice = req.params.t;
  let f = oprice.substr(1, 4);
  let uid=req.query.id;
  console.log(uid);
  let user=User.findOne({_id:uid},async function(err,foundok){
    if(foundok)
    {
      let cric=0;
      let oarray=[];
      oarray=foundok.pizzasordered;
      if(oarray.length===0)
      {
        console.log("Hey kid");
        const offerpizza = new Offer({
          offername: oname,
          offerquantity: 1,
          offerprice: f,
        });
        // let save1=offerpizza.save();
          User.updateOne(
            { _id: uid },
            { $push: { pizzasordered: offerpizza } },
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
      }
      else{
        
        for(var i=0;i<oarray.length;i++)
        {
          if(oarray[i].offername===oname)
          {
            console.log("Found bro");
              oarray[i].offerquantity=parseInt(oarray[i].offerquantity)+1;
              cric=1;
          }
        }
            const user1 =await User.findOne({_id:foundok._id});
            if(user1){
              
             user1.pizzasordered=oarray;
             let data= user1.save();
        }

             const offerpizza = new Offer({
              offername: oname,
              offerquantity: 1,
              offerprice: f,
            });
            let save1=await offerpizza.save();
            if(cric===0)
             {
              console.log("Try try bro");
              User.updateOne(
                { _id: foundok._id },
                { $push: { pizzasordered: offerpizza } },
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            if (save1) {
              return res.status(200).json({
                message: "data create success",
              });
            } else {
              return res.status(500).json({
                message: "Internal server error",
              });
            }
          }
        }
      }
  });
});

//offerpizzas
app.get("/offer1/:a/:b", function (req, res) {
  let oname = req.params.a;
  console.log(oname);
  let oprice = req.params.b;
  let f = oprice.substr(1, 4);
  let uid=req.query.uid;
  console.log(uid);
  let user=User.findOne({_id:uid},async function(err,foundok){
    if(foundok)
    {
      let cric=0;
      let oarray=[];
      oarray=foundok.pizzasordered;
      if(oarray.length===0)
      {
        console.log("Hey kid");
        const offerpizza = new Offer({
          offername: oname,
          offerquantity: 1,
          offerprice: f,
        });
        // let save1=offerpizza.save();
          User.updateOne(
            { _id: uid },
            { $push: {pizzasordered: offerpizza}},
            function(err) {
              if (err){
                console.log(err);
              }
            }
          );
      }
      else{
        
        for(var i=0;i<oarray.length;i++)
        {
          if(oarray[i].offername===oname)
          {
            console.log("Found bro");
              oarray[i].offerquantity=parseInt(oarray[i].offerquantity)+1;
              cric=1;
          }
        }
            const user1 =await User.findOne({_id:foundok._id});
            if(user1){
              
             user1.pizzasordered=oarray;
             let data= user1.save();
        }

             const offerpizza = new Offer({
              offername: oname,
              offerquantity: 1,
              offerprice: f,
            });
            let save1=await offerpizza.save();
            if(cric===0)
             {
              console.log("Try try bro");
              User.updateOne(
                { _id: foundok._id },
                { $push: { pizzasordered: offerpizza } },
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            if (save1) {
              return res.status(200).json({
                message: "data create success",
              });
            } else {
              return res.status(500).json({
                message: "Internal server error",
              });
            }
          }
        }
      }
  });
});
app.get("/loginpage", function (req, res) {
  if (req.isAuthenticated()) {
    
    res.render("orders");
  } else {
    res.render("login");
  }
});

app.get("/loginpage1",function(req,res){
  res.render("login");
});

//For offers page
app.get("/offers", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("offers");
  } else {
    res.render("offers1");
  }
});


app.get("/orders", function (req, res) {
  let uid=req.query.id;
  res.render("orders",{
   pizzas123:"Hello"
  })
  if (req.isAuthenticated()) {

   let user1223= User.findOne({_id:uid},async function(err,userfound){
     if(userfound)
     {
      // res.render("orders",{
      //   pizzas:userfound.pizzasordered
      // });
      let pizzaarray=[];
      pizzaarray=userfound.pizzasordered;
     console.log("Hello");
     res.render("orders",{
      febchar:pizzaarray
    });
     }
   });
  } else {
    res.redirect("/loginpage");
  }
});
app.get("/register", function (req, res) {
  res.render("register");
});

//register
app.post("/register", function (req, res) {
  User.register(
    { name: req.body.firstname, username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/loginpage1");
        });
      }
    }
  );
});

//relogin
app.get("/relogin", function (req, res) {
  res.render("relogin");
});

app.post("/login", function (req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/relogin");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.render("home", {
        Good: user._id,
        Bad: user.name,
      });
    });
  })(req, res, next);
});

app.post("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
