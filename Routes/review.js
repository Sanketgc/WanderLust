const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wraoAsync.js");
const ExpressError =require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");

const validatereview = (req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
}

//REVIEWS

router.post("/",
     validatereview, 
     wrapAsync( async (req, res) => {
   let listing= await Listing.findById(req.params.id);
   let newreview =new Review(req.body.review);

   listing.reviews.push(newreview);

   await newreview.save();
   await listing.save();
   req.flash("success", "New review created");

    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
router.delete("/:reviewId",
     wrapAsync(async (req, res) => {
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;