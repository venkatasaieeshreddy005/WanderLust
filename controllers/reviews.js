const listing = require("../models/listing.js");
const review = require("../models/reviews.js");

module.exports.createReview=async (req, res) => {
        let newlisting = await listing.findById(req.params.id);
        let newreview = new review(req.body.review);
        newreview.author=req.user._id;

        newlisting.reviews.push(newreview);

        await newreview.save();
        await newlisting.save();
        req.flash("success"," New Review Created ");

        res.redirect(`/listings/${req.params.id}`);
};


module.exports.destroyReview=async(req,res)=>{

    let {id,rid}=req.params;
    

    await listing.findByIdAndUpdate(id,{$pull:{reviews:rid}});
    await review.findByIdAndDelete(rid);
    req.flash("success","Review Deleted ");
    res.redirect(`/listings/${req.params.id}`)
    
};


