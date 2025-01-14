const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const { default: mongoose } = require("mongoose");


// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: "7d"});
}

// Register user and sign in
const register = async(req, res) => {
    
    const {name, email, password} = req.body

    // check if user exists
    const user = await User.findOne({email})

    if (user) {
        res.status(409).json({erros: ["Email já em uso, utilize outro"]})
        return
    }

    // Generate password encrypted
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    // If user was created successfully, return token
    if (!newUser) {
        res.status(500).json("Hove um erro, tente mais tarde");
        return
    } 

    res.status(201).json({
        _id: newUser.id,
        token: generateToken(newUser.id)
    });

}

// Sign user in
const login = async(req, res) => {
    
    const { email, password } = req.body

    const user = await User.findOne({email})

    // Check if user exists
    if (!user){
        res.status(404).json({erros: ["Usuário não encontrado"]})
        return
    }

    // Check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(400).json({erros: ["Senha incorreta"]})
        return
    }

    // Returns user with token
    res.status(200).json({
        _id: user.id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

// Get current logged in user
const getCurrentUser = async(req, res) => {
    const user = req.user

    res.status(200).json(user);
}

// Update an user
const update = async(req, res) => {
    const { name, password, bio } = req.body;

    let profileImage = null;

    if (req.file) {
        profileImage = req.filename
    }

    const reqUser = req.user;

    // depois tirar o password
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select(
        "-password"
      );
    if (name) user.name = name;
    if (password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
    }

    if (profileImage) user.profileImage = profileImage;

    if (bio) user.bio = bio;

    await user.save()

    res.status(200).json(user);
}

// Get user by Id
const getUserById = async(req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById( new mongoose.Types.ObjectId(id)).select("-password")
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({erros: ["Usuário não encontrado"]})
    } 
}

module.exports = {register,
                    login,
                    getCurrentUser,
                    update,
                    getUserById
                };