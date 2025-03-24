const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
   await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) =>{
    res.send("Hi i am root");
});

app.get("/testListing",async (req, res)=> {
    let sampListing = new Listing({
        title: "My new villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute ,Goa",
        country: "India",
    });

    await sampListing.save().then(() => {
        console.log("Saved Successfully");
        res.send("working");
    })
    .catch((err) => {
        console.log(err);
    });
    
});


//INDEX ROUTE

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

//NEW ROUTE
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", async(req, res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//create route

app.post("/listings", async (req, res) => {
    const newListing= new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
});

//EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let {id}= req.params;
    let deletedlisting=   await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
});

app.listen(8080, ()=> {
    console.log("server is listening");
});