const { required, string } = require("joi");
const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review");

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }, 
    image: {
        url: {
        type :String,
        default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v) => 
        v===""? 
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,
    },
},
    price: {
        type:Number,
        required: true,
    },
    location: {
        type: String ,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
 },
],
owner: {
    type: Schema.Types.ObjectId, 
    ref: "User"
},
// category: {
//     type: string,
//     enum: ["mountains", "arctic", "farms", "deserts"],
// },
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;