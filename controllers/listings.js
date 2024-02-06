const listing=require("../models/listing");
const { all } = require("../routes/listing");
const { login } = require("./users");

module.exports.index =async(req,res)=>{
    const alllistings=await listing.find({});  //to get all listing data from db
    res.render("listings/index.ejs",{alllistings});
};

module.exports.renderNewForm =(req,res)=>{  // /listings/new is written before /listings/:id because we want to show the form first and then show the listing details.
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing1 = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing1){
        req.flash("error","Listing Not Found"); 
        return res.redirect("/listings");  //if listing is not found then redirect to listings page.
    }
    res.render("listings/show.ejs",{listing1});
};

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;  //to get the path of the uploaded image.
    let filename=req.file.filename;  //to get the name of the uploaded image.

    let newlisting= await new listing(req.body.listing); //
    newlisting.owner=req.user._id;  //to set the owner of the listing to the current user.
    newlisting.image={url,filename};  //to set the image of the listing to the uploaded image.
    let category=req.body.category
    newlisting.category=category;
    console.log(newlisting);
    await newlisting.save();
    req.flash("success","Successfully made a new listing");  //flash is used to show the message on the screen.
    res.redirect("/listings");
};

module.exports.editForm=async(req,res)=>{
    const {id}=req.params;
    const listing1 = await listing.findById(id);
    if(!listing1){
        req.flash("error","Listing Not Found"); 
        return res.redirect("/listings");  //if listing is not found then redirect to listings page.
    }
    req.flash("success","Listing Updated!");
    let originalImg=listing1.image.url;
    originalImg=originalImg.replace("/upload","/upload/h_300,w_250")

    res.render("listings/edit.ejs",{listing1,originalImg});
};

module.exports.updateListing=async(req,res)=>{
    const {id}=req.params;
    let listing1=await listing.findByIdAndUpdate(id,{...req.body.listing});  ///
    if(typeof req.file !== "undefined"){
        let url=req.file.path;  //to get the path of the uploaded image.
        let filename=req.file.filename;  //to get the name of the uploaded image.
        listing1.image={url,filename}; 
        await listing1.save();  
    }
    req.flash("success","Listing Updated!");  
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    const {id}=req.params;
    let deletedlisting=await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

module.exports.trending=async(req,res)=>{
    let alllistings=await listing.find({"category":"trending"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.mountains=async(req,res)=>{
    let alllistings=await listing.find({"category":"mountains"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.rooms=async(req,res)=>{
    let alllistings=await listing.find({"category":"rooms"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.iconiccity=async(req,res)=>{
    let alllistings=await listing.find({"category":"iconiccity"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.castles=async(req,res)=>{
    let alllistings=await listing.find({"category":"castles"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.amazingpools=async(req,res)=>{
    let alllistings=await listing.find({"category":"amazingpools"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.camping=async(req,res)=>{
    let alllistings=await listing.find({"category":"camping"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.farms=async(req,res)=>{
    let alllistings=await listing.find({"category":"farms"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};
module.exports.arctic=async(req,res)=>{
    let alllistings=await listing.find({"category":"arctic"});
    console.log(alllistings);
    res.render("listings/index.ejs",{alllistings});
};

module.exports.search=async(req, res)=>{
    const {search}=req.body;
    let searchloc=search.charAt(0).toUpperCase() + search.slice(1);
    let searchedlist=await listing.find({"location":searchloc}); ///
    alllistings=searchedlist;
    res.render("listings/index.ejs", {alllistings});
};