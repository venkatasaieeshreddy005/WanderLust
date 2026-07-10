const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then(()=>{
    console.log('connected to database wanderlust');
}).catch(err => console.log(err));

async function main() {
    // the database name is wanderlust
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async () => {
  await Listing.deleteMany({});

  // Clean approach: Assign the owner while keeping the original 'image' object intact
  const formattedData = initData.data.map((obj) => ({
    ...obj,
    owner: '6a3a30f00bb9ebe631a01ecd', // keep your owner ID
    // REMOVED: image: obj.image.url (Do not overwrite the image object!)
  }));

  await Listing.insertMany(formattedData);
  console.log("data was initialized");
};

initDB();