const express=require("express");
const router=express.Router({mergeParams:true});//to acess the id from app.js from
const wrapAsync=require("../utils/wrapAsync.js");
const review=require("../models/review.js");
const listing=require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


router.post("/",validatereview,isLoggedIn,wrapAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;