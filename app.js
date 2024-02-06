if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
//constans

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError.js");


//routing
const listingRouter= require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const MongoStore = require('connect-mongo');
const dburl=process.env.ATLASTDB_URL;

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60,
});
store.on("error",()=>{
    console.log("session store error");
})
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));  //form can only send urlencoded data
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currentUser=req.user;
    next();
});

main()
.then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    //await mongoose.connect("mongodb://localhost:27017/wanderlust");
    await mongoose.connect(dburl);
    }


//using routing
app.use("/listings",listingRouter);  // replace ever /listing with the address of the /listing which in is routes folder
app.use("/listings/:id",reviewRouter);// /listing/:id/reviews is the common address in all review paths
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Some thing went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{err});
});

app.listen(8080,()=>{
    console.log(`server is listing to port 8080`);
});