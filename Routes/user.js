const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wraoAsync.js");
const passport = require("passport");
const { saveredirecrUrl } = require("../middleware.js");

const userController = require("../controller/users.js");

router.route("/signup")
.get(userController.GetSignup )
.post( wrapAsync(userController.PostSignup));


router.route("/login")
.get( userController.GetLogin)
.post(
    saveredirecrUrl,
    passport.authenticate(
    "local", 
    { failureRedirect: '/login', 
        failureFlash: true}) , userController.PostLogin);

router.get("/logout", userController.logout);

module.exports= router;