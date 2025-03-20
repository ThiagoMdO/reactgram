const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .isString().withMessage("O nome é obrigatorio.")
            .isLength({min: 3}).withMessage("O nome precisa no minimo 3 caracters."),
        body("email")
            .isString().withMessage("Campo email é obrigatório.")
            .isEmail().withMessage("Precisa ser um email valido."),
        body("password")
            .isString().withMessage("Insira uma senha")
            .isLength({min: 6}).withMessage("A senha precisa ter no minimo 6 caracters"),
        body("confirmPassword")
            .isString().withMessage("A confirmação da senha é obrigatória.")
            .custom((value, {req}) => {
                if (value != req.body.password) {
                    throw new Error("As senhas precisam ser iguais.")
                }
                return true;
            })  
    ]
}

const loginValidation = () => {
    return [
        body("email")
            .isString().withMessage("Campo email é obrigatório.")
            .isEmail().withMessage("Precisa ser um email valido."),
        body("password")
            .isString().withMessage("Digite sua senha")
    ]
}

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min: 3}).withMessage("O nome precisa no minimo 3 caracters."),
        body("password")
            .optional()
            .isLength({min: 6}).withMessage("A senha precisa ter no minimo 6 caracters"),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
};