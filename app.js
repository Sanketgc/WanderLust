const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./Utils/wraoAsync.js");
const ExpressError =require("./Utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { error } = require("console");
const Review= require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const { wrap } = require("module");
const review = require("./models/review.js");


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

app.get("/", (req, res) =>{
    res.send("Hi i am root");
});

const validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
}

const validatereview = (req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
}

//INDEX ROUTE

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//NEW ROUTE
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", 
    wrapAsync(async(req, res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//create route

app.post("/listings", 
    validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//EDIT ROUTE
app.get("/listings/:id/edit", 
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    let deletedlisting=   await Listing.findByIdAndDelete(id);
    // console.log(deletedlisting);
    res.redirect("/listings");
}));

//REVIEWS

app.post("/listings/:id/reviews",
     validatereview, 
     wrapAsync( async (req, res) => {
   let listing= await Listing.findById(req.params.id);
   let newreview =new Review(req.body.review);

   listing.reviews.push(newreview);

   await newreview.save();
   await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId",
     wrapAsync(async (req, res) => {
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

app.use((err, req, res, next) => {
    let {statusCode= 500, message ="Something went wrong"}  = err ;
    res.status(statusCode).render("listings/error.ejs", { err });
});


app.listen(8080, ()=> {
    // console.log("server is listening");
});