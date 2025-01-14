const express = require("express");
const router = express.Router();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotosRoutes"));

// router test
router.get("/", (req, res) => {
    res.send("App working");
})

module.exports = router;