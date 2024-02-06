const User=require("../models/user"); 

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.signup=async(req,res)=>{
    try {
    let {username,password,email}=req.body;
    const newUser=new User({username,email});
    const regestereduser=await User.register(newUser,password)
    console.log(regestereduser);
    req.login(regestereduser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })

    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login=async(req,res)=>{
    req.flash("success","Wellcome back to Wanderlust You are logged in!")
    let redirectUrl=res.locals.redirectUrl||"/listings";// if user logiin from home page 
    res.redirect(redirectUrl);//redirects to the lagepage user try to acess
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);  
        }
        req.flash("success","Successfully logged out");
        res.redirect("/listings");
    })
};