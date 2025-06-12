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

const listings = require("./Routes/listing.js");
const reviews = require("./Routes/review.js");


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
app.use(express.urlencoded({extended: true}));
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

app.get("/", (req, res) =>{
    res.send("hi, I am root");
});

app.use(session(sessionoptions));
app.use(flash());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
//   console.log(res.locals.success );
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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