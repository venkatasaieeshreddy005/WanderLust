const listing = require("../models/listing.js");
const Booking=require("../models/booking.js");


module.exports.index=async (req, res) => {
    let alllistings = await listing.find({});
    res.render('listings/index', { alllistings });
};


module.exports.renderNewForm=async (req,res)=>{
    
    res.render('listings/newlisting');
};


module.exports.showListing=async (req,res)=>{
    
        let {id}=req.params;
        
        const l1= await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
        if(!l1){
            req.flash("error","Listing does not exists");
            return res.redirect("/listings");
        }
        res.render('listings/show.ejs',{l1});
};

module.exports.createNewListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;

    const newlisting = new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};

    await newlisting.save();
    req.flash("success"," New Listing Created ");
    res.redirect('/listings');
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const l1= await listing.findById(id);
    if(!l1){
            req.flash("error","Listing does not exists");
            return res.redirect("/listings");
        }
        
        let originalUrl=l1.image.url;
        originalUrl=originalUrl.replace("/upload","/upload/h_300,w_250");

    
    res.render('listings/edit',{l1,originalUrl});
};

module.exports.updateEditForm=async (req,res)=>{
    let {id}=req.params;
    let newListing= await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        await newListing.save();

    }

    req.flash("success"," Listing Updated Successfully ");
    res.redirect(`/listings/${id}`);


};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted ");
    res.redirect('/listings');

};

module.exports.categoyListing = async (req, res) => {
    const { category } = req.params;

    const alllistings = await listing.find({ category: category });

    if (!alllistings.length) {
        req.flash("error", "No listings found for this category");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { alllistings });
};

module.exports.searchListing=async (req, res) => {

    let { query } = req.query;


    if (!query) {
        return res.redirect("/listings");
    }


    let listings = await listing.find({

        $or: [
            {
                location: {
                    $regex: query,
                    $options: "i"
                }
            },

            {
                country: {
                    $regex: query,
                    $options: "i"
                }
            }
        ]

    });


    if (listings.length === 0) {

    req.flash("error", "No listings found for your search.");

    return res.redirect("/listings");

}


res.render("listings/index", {alllistings: listings,currUser: req.user});

};

module.exports.removeFromCancel=async (req, res) => {

    let { id } = req.params;

    await Booking.findByIdAndDelete(id);

    req.flash("success", "Cancelled booking removed successfully");

    res.redirect("/listings/bookings?status=Cancelled");

};