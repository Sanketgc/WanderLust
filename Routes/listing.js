const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wraoAsync.js");
const Listing= require("../models/listing.js");
const {isloggedin, isowner,validateListing} = require("../middleware.js");



router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

//NEW ROUTE
router.get("/new", isloggedin, (req, res) =>{  
    res.render("listings/new.ejs");
});

//SHOW ROUTE
router.get("/:id", 
    wrapAsync(async(req, res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id).
    populate({path : "reviews", populate: {
        path: "author",
    },
}).
    populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings"); 
    }
    res.render("listings/show.ejs", {listing});
}));

//create route

router.post("/", isloggedin,
    validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
}));

//EDIT ROUTE
router.get("/:id/edit", isloggedin, isowner,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
router.put("/:id",isloggedin,
    isowner,
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated"); 
    res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
router.delete("/:id", isloggedin, isowner,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    let deletedlisting=   await Listing.findByIdAndDelete(id);
     console.log(deletedlisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;