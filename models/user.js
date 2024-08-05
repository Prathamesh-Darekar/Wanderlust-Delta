const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportlocalmongoose); // USERNAME AND PASSWORD IS AUTOMATICALLY DEFINED BY "passport-local-mongoose"

module.exports = mongoose.model("User", userSchema);
