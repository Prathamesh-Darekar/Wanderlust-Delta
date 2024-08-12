const Listing = require("./models/listing");
const Review = require("./models/review");

const {
  listingSchema,
  reviewSchema,
} = require("./validateSchema/validateSchema.js");
const ExpressError = require("./utils/ExpressError.js"); // CREATING USEREFINED ERROR CLASS

//TO CHECK WHEATHER USER IS LOGGED IN OR NOT

const isLoggedIn = (req, res, next) => {
  // METHOD OF PASSPORT
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// AFTER LOGGIN IN SENFING THE USER TO THE SAME PAGE THAT HE TRIED TO ACCESS WITHOUT LOGGING IN

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//TO CHECK WHEATHER USER IS OWNER OF THE LISTING OR NOT

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (
    res.locals.currentUser &&
    !listing.owner._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You do not have permission to do this task");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// LISTING VALIDATION FUNCTION USING Joi

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// REVIEW VALIDATION FUNCTION USING Joi

function validateReview(req, res, next) {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    let errMsg = result.error.details.map((e) => e.message).join(",");
    res.status(400);
    throw new Error(errMsg);
  } else {
    next();
  }
}

//TO CHECK WHEATHER USER IS OWNER OF THE REVIEW OR NOT

const isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log(review);
  if (
    res.locals.currentUser &&
    !review.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  validateListing,
  validateReview,
  isReviewOwner,
};
