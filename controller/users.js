const User = require("../models/user");

module.exports.GetSignup= (req, res)=> {
    res.render("Users/signup.ejs");
}

module.exports.PostSignup =async(req, res) => {
    try{
    let {username, email, password} =req.body;
    const newUser= new User({username, email});
    const registereduser= await  User.register(newUser, password);
    console.log(registereduser);
    req.login(registereduser, (err) => {
        if(err){
            return next(err);
        } 
     req.flash("successs", "Welcome to WanderLust");
    res.redirect("/listings");
    })
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/listings");
    }
}

module.exports.GetLogin=(req, res) =>{
    res.render("users/login.ejs");
}

module.exports.PostLogin=async(req, res) =>{
        req.flash("success", "Welcome back to Wanderlust! You are logged in");
        let redirecturl = res.locals.redirectUrl || "/listings"
        res.redirect( redirecturl);
}


module.exports.logout=(req, res, next) =>{
    req.logout((err) => {
        if(err){
           return next(err);
        } 
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
}