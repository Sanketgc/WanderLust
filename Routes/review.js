const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wraoAsync.js");
const ExpressError =require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const {validatereview, isloggedin, isauthor} = require("../middleware.js");



//POST REVIEWS

router.post("/", isloggedin,
     validatereview,
     wrapAsync( async (req, res) => {
   let listing= await Listing.findById(req.params.id);
   let newreview =new Review(req.body.review);
   newreview.author = req.user._id; 

   listing.reviews.push(newreview);

   await newreview.save();
   await listing.save();
   req.flash("success", "New review created");

    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isloggedin, isauthor,
     wrapAsync(async (req, res) => {
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;