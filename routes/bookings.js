const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const bookingController=require("../controllers/bookings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")

const upload = multer({ storage});

// Booking Page
router.get("/", isLoggedin, bookingController.renderBookingForm);

// Save Booking

router.post("/", isLoggedin, bookingController.createBooking);


module.exports = router;