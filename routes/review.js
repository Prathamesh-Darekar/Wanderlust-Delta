const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");
const reviewController = require("../controllers/reviews.js");

//ADD REVIEWS

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

// DELETE REVIEW

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
