const isLoggedIn = (req, res, next) => {
  // METHOD OF PASSPORT
  console.log(req.session);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User must be logged in!");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports = { isLoggedIn, saveRedirectUrl };
