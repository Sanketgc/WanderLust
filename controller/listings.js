const Listing= require("../models/listing.js");

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}


module.exports.Newform =(req, res) =>{  
    res.render("listings/new.ejs");
}

module.exports.show =async(req, res) =>{
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
};

module.exports.edit =async (req, res) => {
    let {id}= req.params;
    console.log(id); 
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.create = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url," ",filename);
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
}


module.exports.update= async (req, res) => {
    let {id}= req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated"); 
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let {id}= req.params;
    let deletedlisting=   await Listing.findByIdAndDelete(id);
     console.log(deletedlisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

// module.exports.search = async (req, res) => {
//     let {search} = req.query;
//     console.log(search);
//     let allListings = await Listing.find({
//         "listing.location": {$regex: search, $options: "i"}
//     });
//     if(allListings.length === 0){
//         req.flash("error", "No listings found");
//         return res.redirect("/listings");
//     }
//     res.render("listings/index.ejs", {allListings});
// }