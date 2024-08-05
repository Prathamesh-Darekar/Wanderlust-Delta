const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("../views/users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username: req.body.username,
      email: email,
    });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
      if (err) {
        return next(err);
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("../views/users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to wanderlust");
    const url = res.locals.redirectUrl ? res.locals.redirectUrl : "/listings";
    res.redirect(url);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "you are logged out now!");
      res.redirect("/listings");
    }
  });
});
module.exports = router;
