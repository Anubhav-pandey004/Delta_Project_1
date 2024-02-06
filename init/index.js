const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");//

main()
.then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const initDB = async () => {
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65aced45c729de06cb508eb3"}))
    await listing.insertMany(initdata.data);//
    console.log("data was initialized");
};

initDB();