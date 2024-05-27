// File for models

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        //set if if image exist but not available ,this is set for frontend
        // default is when image is undefined (not exist)
        default: "https://unsplash.com/photos/gray-wooden-sea-dock-near-green-pine-trees-under-white-sky-at-daytime-1EYMue_AwDw",
        set: (v) => v === "" ? "https://unsplash.com/photos/gray-wooden-sea-dock-near-green-pine-trees-under-white-sky-at-daytime-1EYMue_AwDw" : v
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;