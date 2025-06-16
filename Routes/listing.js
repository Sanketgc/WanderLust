const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wraoAsync.js");
const Listing= require("../models/listing.js");
const {isloggedin, isowner,validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controller/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedin,
    upload.single('listing[image][url]'),
    wrapAsync(listingController.create)
);


//NEW ROUTE
router.get("/new", isloggedin, listingController.Newform);

router.route("/:id")
.put(isloggedin,
    isowner,
    validateListing,
    wrapAsync(listingController.update))
.delete(isloggedin, isowner,
    wrapAsync(listingController.delete))
.get(wrapAsync(listingController.show));

//EDIT ROUTE
router.get("/:id/edit", isloggedin, isowner,
    wrapAsync(listingController.edit));


module.exports = router;