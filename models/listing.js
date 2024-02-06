const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review= require("./review");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,  
    },
    description:{
        type:String,

    },
    image:{
        // type:String,
        // set:(v) => v==="" ? "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlfGVufDB8fDB8fHww" : v ,
        // default:"https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlfGVufDB8fDB8fHww"
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["mountains","trending","rooms","iconiccity","castles","amazingpools","camping","farms","arctic"]
    },
});

listingSchema.post("findOneAndDelete",async function(listing){
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
   
})

const listing= mongoose.model("listing",listingSchema);
module.exports=listing;