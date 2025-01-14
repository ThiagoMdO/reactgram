const { body } = require("express-validator");

const photoInsertValidation = () => {
    return [
        body("title").not().equals("undefined").withMessage("Título obrigatório.")
            .isString().withMessage("Título é obrigatório.")
            .isLength({min: 3}).withMessage("Título precisa no minimo 3 caracters"),
        body("image").custom((value, {req}) => {
            if (!req.file) throw new Error("A imagem é obrigatória.");
            return true;
        })

    ]
}

const photoUpdateValidation = () => {
    return [
        body("title")
            .optional()
            .isString().withMessage("O título é obrigatório.")
            .isLength({min: 3}).withMessage("Precisa ter no minimo 3 caracters")
    ]
}

const commentInsertIntoPhotoValidation = () => {
    return [
        body("comment")
            .isString().withMessage("O coméntario é obrigatório.")
            .isLength({min: 3}).withMessage("O comentário precisa no minimo 3 caracters")
    ]
}

module.exports = {
    photoInsertValidation,
    photoUpdateValidation,
    commentInsertIntoPhotoValidation
};