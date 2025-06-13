const Listing = require("./models/listing");
const ExpressError =require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review= require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirecrUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async (req, res, next) =>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){ 
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
} ;

module.exports.validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
}

module.exports.validatereview = (req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map(el => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else{
        next();
    }
};

module.exports.isauthor = async (req, res, next ) => {
    let {id, reviewId }= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){ 
        req.flash("error","you are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}