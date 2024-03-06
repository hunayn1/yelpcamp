const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            else {
                req.flash("success", "Welcome to Yelp-Camp");
                res.redirect("/campgrounds");
            }
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}
module.exports.login = (req, res) => {
    // this logic because if someone tries to login without hitting isLoggedIn middleware, then returnTo would be empty
    const redirectedUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    req.flash("success", "Welcome Back");
    res.redirect(redirectedUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        else {
            req.flash("success", "Goodbye");
            res.redirect("/campgrounds");
        }
    });
}