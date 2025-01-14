const express = require("express");
const router = express.Router();

// Controller
const {insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getAPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotosByTitle
} = require("../controllers/PhotosController")

// Middlewares
const {
    photoInsertValidation,
    photoUpdateValidation,
    commentInsertIntoPhotoValidation
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post("/",
    authGuard,
    imageUpload.single("image"),
    photoInsertValidation(),
    validate,
    insertPhoto
);
router.delete("/:id",
    authGuard,
    validate,
    deletePhoto
);
router.get("/"
    ,getAllPhotos
)
router.get("/search", authGuard, searchPhotosByTitle)
router.get("/user/:id",
    getUserPhotos
)
router.get("/:id",
    getAPhotoById
)
router.put("/:id",
    authGuard,
    photoUpdateValidation(),
    validate,
    updatePhoto
)
router.put("/like/:id",
    authGuard,
    likePhoto
)
router.put("/:id/comment",
    authGuard,
    commentInsertIntoPhotoValidation(),
    validate,
    commentPhoto
)

module.exports = router;