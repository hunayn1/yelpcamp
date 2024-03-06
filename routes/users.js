const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users")

// Grouping Same Routes Together

router.route("/register")
    .get(users.renderRegister)
    .post(wrapAsync(users.register))

router.route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

router.get("/logout", users.logout);


// Register
// router.get("/register", users.renderRegister);
// router.post("/register", wrapAsync(users.register));

// Login
// router.get("/login", users.renderLogin);
// router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

// Logout
// router.get("/logout", users.logout);

module.exports = router;