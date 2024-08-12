const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Listing = require("./models/listing");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

const deleteImage = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let imageUrl = listing.image.url;
  let publicId = "wanderlust_DEV/" + getPublicId(imageUrl);
  cloudinary.uploader.destroy(publicId, (err, res) => {
    if (err) {
      let errMsg = result.error.details.map((e) => e.message).join(",");
      res.status(400);
      throw new Error(errMsg);
    }
  });
  next();
};

function getPublicId(url) {
  let splitUrl = url.split("/wanderlust_DEV/")[1].split(".")[0];
  return splitUrl;
}

module.exports = { cloudinary, storage, deleteImage };
