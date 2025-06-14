const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wraoAsync.js");
const ExpressError =require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const {validatereview, isloggedin, isauthor} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

//POST REVIEWS

router.post("/", isloggedin,
     validatereview,
     wrapAsync(reviewController.postReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isloggedin, isauthor,
     wrapAsync(reviewController.deleteReview));

module.exports = router;