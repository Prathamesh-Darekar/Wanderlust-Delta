const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("../views/users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("../views/users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcome to wanderlust");
  const url = res.locals.redirectUrl ? res.locals.redirectUrl : "/listings";
  res.redirect(url);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "you are logged out now!");
      res.redirect("/listings");
    }
  });
};
