const review=require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let listing1=await listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;
    // The req.user object in Express is an object that contains information about the authenticated user.
    //  It is populated by the authentication middleware, which is typically implemented using a third-party library such as Passport.js.
    listing1.reviews.push(newreview);
    await newreview.save();
    await listing1.save();

    res.redirect(`/listings/${listing1._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(reviewId);
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}); //
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};