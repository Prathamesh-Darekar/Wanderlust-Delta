const Reviews = require("../models/review.js");
const Listings = require("../models/listing.js");

module.exports.addReview = async (req, res) => {
  let listing = await Listings.findById(req.params.id);
  const newReview = new Reviews(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
