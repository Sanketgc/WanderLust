const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wraoAsync.js");
const Listing= require("../models/listing.js");
const {isloggedin, isowner,validateListing} = require("../middleware.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const listingController = require("../controller/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedin,
    validateListing,
    wrapAsync(listingController.create));

// .post(upload.single('listing[image][url]'),(req, res) => {
//     res.send(req.file);
// });

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