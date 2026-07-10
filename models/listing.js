const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review=require("./reviews.js");
const User=require("./user.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename:String,
    url:String,
    
  },
  price: Number,
  location: String,
  country: String,

  reviews:[{
    type : Schema.Types.ObjectId,
    ref:"review"
  }
  ],
  
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  category: {
    type: String,
    enum: [
        "Rooms",
        "Mountains",
        "Castles",
        "Camping",
        "Farms",
        "Beach",
        "Arctic"
    ],
    required: true
}
});


listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await review.deleteMany({_id: {$in: listing.reviews}})
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;