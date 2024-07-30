const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //ejs-Mate     FOR BOILERPLATE
const ExpressError = require("./utils/ExpressError.js"); // CREATING USERDEFINED ERROR CLASS
const reviews = require("./routes/review.js"); // CONTAINS ALL ROUTES RELATED TO REVIEWS
const listings = require("./routes/listing.js"); // CONTAINS ALL ROUTES RELATED TO LISTINGS

app.engine("ejs", ejsMate); //ejs-Mate
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(3000, () => {
  console.log("Server Online");
});

app.get("/", (req, res) => {
  res.send("hello");
});

// TEST API

app.get("/testlisting", async (req, res) => {
  let samplelisting = new Listing({
    title: "My new Villa",
    description: "By the brach",
    price: 1500,
    location: "Goa",
    country: "India",
  });
  await samplelisting.save();
  console.log("listing saved");
  res.send("Success");
});

//Modularising the routes

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

// CODE FOR PAGE NOT FOUND

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLING MIDDLEWARE

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!" } = err;
  res.render("listings/error.ejs", { message });
});
