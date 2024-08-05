const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const { reviewSchema } = require("../validateSchema/validateSchema.js");
const Reviews = require("../models/review.js");
const Listings = require("../models/listing.js");

// REVIEW VALIDATION FUNCTION USING Joi

function validateReview(req, res, next) {
  const result = reviewSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    let errMsg = result.error.details.map((e) => e.message).join(",");
    res.status(400);
    throw new Error(errMsg);
  } else {
    next();
  }
}

//ADD REVIEWS

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    const newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// DELETE REVIEW

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
