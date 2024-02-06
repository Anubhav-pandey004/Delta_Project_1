const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing= require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validatelisting}=require("../middleware.js");
const multer  = require('multer')
const { storage } = require('../cloudconfig.js')
const upload = multer({ storage })

//controllers
const listingController=require("../controllers/listings.js");

//new Listiing Form
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(upload.single('listing[image]'),isLoggedIn,wrapAsync(listingController.createListing))

router.get("/trending",wrapAsync(listingController.trending));
router.get("/mountains",wrapAsync(listingController.mountains));
router.get("/rooms",wrapAsync(listingController.rooms));
router.get("/iconiccity",wrapAsync(listingController.iconiccity));
router.get("/castles",wrapAsync(listingController.castles));
router.get("/amazingpools",wrapAsync(listingController.amazingpools));
router.get("/camping",wrapAsync(listingController.camping));
router.get("/farms",wrapAsync(listingController.farms));
router.get("/arctic",wrapAsync(listingController.arctic));
router.post("/search",wrapAsync(listingController.search));
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(upload.single('listing[image]'),validatelisting,isLoggedIn,isOwner,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
//edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));
module.exports=router;