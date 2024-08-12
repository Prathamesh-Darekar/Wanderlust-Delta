if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //ejs-Mate     FOR BOILERPLATE
const ExpressError = require("./utils/ExpressError.js"); // CREATING USERDEFINED ERROR CLASS
const reviewsRouter = require("./routes/review.js"); // CONTAINS ALL ROUTES RELATED TO REVIEWS
const listingsRouter = require("./routes/listing.js"); // CONTAINS ALL ROUTES RELATED TO LISTINGS
const userRouter = require("./routes/user.js"); // CONTAINS ALL ROUTES RELATED TO USER

const session = require("express-session");
const MongoStore = require("connect-mongo"); // MONGO SESSION
const flash = require("connect-flash");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");

app.engine("ejs", ejsMate); //ejs-Mate
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//CONNECTING SERVER TO DATABASE

const MONGO_URL = process.env.ATLASDB_URL;

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

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000, //EXPIRES AFTER 7 DAYS(VALUE INTERMS OF MILLISECONDS)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //  FOR SECURITY
  },
};

app.use(session(sessionOptions));
app.use(flash());

//USING PASSPORT MODULE FOR AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// STORING FLASH INTO LOCALS

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //PRINTING SUCCESS MESSAGE (FLASH MESSAGE)
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; //  PRINTING ERROR MESSAGE (FLASH MESSAGE)
  next();
});

//Modularising the routes

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

// CODE FOR PAGE NOT FOUND

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLING MIDDLEWARE

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!" } = err;
  res.render("listings/error.ejs", { message });
});
