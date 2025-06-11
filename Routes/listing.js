const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wraoAsync.js");
const ExpressError =require("../Utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing= require("../models/listing.js");

const validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
}

router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

//NEW ROUTE
router.get("/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id", 
    wrapAsync(async(req, res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//create route

router.post("/", 
    validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//EDIT ROUTE
router.get("/:id/edit", 
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
router.put("/:id",
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    let deletedlisting=   await Listing.findByIdAndDelete(id);
    // console.log(deletedlisting);
    res.redirect("/listings");
}));

module.exports = router;