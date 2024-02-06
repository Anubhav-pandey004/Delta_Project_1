
const listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        //redirectUrl
        req.session.redirectUrl=req.originalUrl;
        console.log(req);
        req.flash("error","You must be logged in to make a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        console.log(req.session);
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    let listing1= await listing.findById(id);
    if(!listing1.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);  //if listing is not found then redirect to listings page.
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body); //to validate the data before saving it to db.
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);  //400 is the status code for bad request.
    }
    else{
        next();  //if data is valid then next() is called.
    }
}
module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); //to validate the data before saving it to db.
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);  //400 is the status code for bad request.
    }
    else{
        next();  //if data is valid then next() is called.
    }
}
module.exports.isReviewAuthor= async(req,res,next)=>{
    const {id,reviewId}=req.params;
    let review1= await review.findById(reviewId);
    if(!review1.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`);  //if listing is not found then redirect to listings page.
    }
    next();
}