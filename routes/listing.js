const express=require('express');
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")

const upload = multer({ storage});



router
.route("/")
.get(wrapAsync(listingController.index ))  // index route
.post(isLoggedin,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createNewListing));       // new route post req // POST route


// new route

router.get('/new',isLoggedin,listingController.renderNewForm);


router.get("/category/:category", listingController.categoyListing);

// show route

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateEditForm))  // post edit
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing)); // listing delete


// new route post req

router.get('/:id/edit',isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;
