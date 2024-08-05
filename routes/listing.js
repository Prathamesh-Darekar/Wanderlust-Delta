const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const { listingSchema } = require("../validateSchema/validateSchema.js");
const ExpressError = require("../utils/ExpressError.js"); // CREATING USEREFINED ERROR CLASS
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// LISTING VALIDATION FUNCTION USING Joi

function validateListing(req, res, next) {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//  INDEX ROUTE

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  })
);

// CREATE ROUTE

router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // validateListing is a middleware function for validation
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// UPDATE ROUTE

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    if (!data) {
      req.flash("error", "Requested Listing Does not Exists!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { data });
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (
      res.locals.currentUser &&
      !listing.owner._id.equals(res.locals.currentUser._id)
    ) {
      req.flash("error", "You do not have permission to do this task");
      return res.redirect(`/listings/${id}`);
    }
    let data = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // de constructing the object
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// SHOW ROUTE

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!data) {
      req.flash("error", "Requested Listing Does not Exists!");
      res.redirect("/listings");
    }
    console.log(data);
    res.render("./listings/show.ejs", { data });
  })
);

// DELETE ROUTE

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
