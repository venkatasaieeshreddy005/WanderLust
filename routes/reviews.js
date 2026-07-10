const express=require('express');
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const review=require("../models/reviews.js");
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedin,isOwner,validatereview,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


// reviews post request

router.post("/",isLoggedin,validatereview,wrapAsync(reviewController.createReview));


// review delete route

router.delete('/:rid',isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;