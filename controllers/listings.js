const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.Filteredindex = async (req, res) => {
  const allListings = await Listing.find(req.query);
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.searchListing = async (req, res) => {
  const listingTitle = req.body.title;
  const allListings = await Listing.find({
    title: { $regex: listingTitle, $options: "i" },
  });
  res.render("./listings/index.ejs", { allListings });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  const geoCodingData = await axios.get(
    `https://us1.locationiq.com/v1/search?key=${process.env.OPEN_WEATHER_API_KEY}&q=${newListing.location},${newListing.country}&format=json`
  );
  newListing.coordinates = {
    longitude: geoCodingData.data[0].lon,
    latitude: geoCodingData.data[0].lat,
  };
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Requested Listing Does not Exists!");
    res.redirect("/listings");
  }
  let originalImage = data.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit.ejs", { data, originalImage });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // de constructing the object
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
    await newListing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Requested Listing Does not Exists!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", {
    data,
  });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
