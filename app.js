if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); 
}

const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError =require("./Utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingrouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to db");
})
 .catch((err) => {
    console.log(err);
});

async function main() {
   await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionoptions ={
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7* 24 *60 *60 *1000,
        maxAge: 7* 24 *60 *60 *1000,
        httpOnly: true,
    },
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeuser = new User({
//         email: "sanketgc@gmail.com",
//         username: "Sanket",
//     });

//     let registereduser = await User.register(fakeuser, "helloworld");
//     res.send(registereduser);
// });

app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let {statusCode= 500, message ="Something went wrong"}  = err ;
    res.status(statusCode).render("listings/error.ejs", { err });
});


app.listen(8080, ()=> {
    // console.log("server is listening");
});