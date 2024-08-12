const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // EFFICIENT USE OF TRY AND CATCH TO HANDLE ERRORS
const multer = require("multer");
const { cloudinary, storage, deleteImage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  // validateListing is a middleware function for validation
  validateListing,
  upload.single("listing[image]"), //storing image on cloudinary cloud
  wrapAsync(listingController.createListing)
);

router.get("/filter", listingController.Filteredindex);

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/search", listingController.searchListing);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(
    isLoggedIn,
    isOwner,
    deleteImage, //deleting image from cloudinary cloud
    wrapAsync(listingController.deleteListing)
  )
  .put(
    upload.single("listing[image]"),
    deleteImage, //deleting image from cloudinary cloud
    wrapAsync(listingController.editListing)
  );

module.exports = router;
