const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await listing.deleteMany();
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "66adcb05d76f26b9c2944bee",
  }));
  await listing.insertMany(initdata.data);
  console.log("data added");
};

initDB();
