const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require('multer');
const { storage } = require("../cloudinary");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

// Grouping Same routes Together

router.route("/")
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, wrapAsync(campgrounds.createCampground))
// .post(upload.single("image"), (req, res) => {
//     console.log(req.body, req.file);
//     res.send("It Worked");
// })
// .post(upload.array("image"), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It Worked");
// })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));


// index
// router.get("/", wrapAsync(campgrounds.index));

// new and create
// router.get("/new", isLoggedIn, campgrounds.renderNewForm);
// router.post("/", isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

// show
// router.get("/:id", wrapAsync(campgrounds.showCampground));

// edit and update
// router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));
// router.put("/:id", isLoggedIn, isAuthor, validateCampground, wrapAsync(campgrounds.updateCampground));

// delete
// router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));


module.exports = router;