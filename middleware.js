const listing=require("./models/listing");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewschema}=require('./schema.js');
const review=require("./models/reviews.js");


module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //save the redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create new listing!");
        return res.redirect("/login");
        
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
        let Listing=await listing.findById(id);
        if(!Listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validatereview = (req, res, next) => {

    let { error } = reviewschema.validate(req.body || {}); 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,rid}=req.params;
        let Review=await review.findById(rid);
        if(!Review.author.equals(res.locals.currUser._id)){
            req.flash("error","You not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
    next();
};
