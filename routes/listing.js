const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const { listingSchema } = require("../validateSchema/validateSchema.js");
const ExpressError = require("../utils/ExpressError.js"); // CREATING USEREFINED ERROR CLASS
const Listing = require("../models/listing.js");

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

router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // validateListing is a middleware function for validation
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// UPDATE ROUTE

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // de constructing the object
    res.redirect(`/listings/${id}`);
  })
);

// SHOW ROUTE

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { data });
  })
);

// DELETE ROUTE

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
