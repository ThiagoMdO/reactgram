const Photo = require("../models/Photo");
const User = require("../models/User")

const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async(req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: req.user.id,
        userName: req.user.name
    })

    // If photo was created successfully, return data
    if (!newPhoto) {
        res.status(500).json({
            errors: ["Houve um erro inesperado, tente novamente mais tarde"]
        })
        return;
    }

    res.status(201).json(newPhoto);
}

// Delete photo by Id
const deletePhoto = async(req, res) => {
    const {id} = req.params;

    const reqUser = req.user;

    try {
            const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        // check if photo exists
        if (!photo) {
            res.status(404).json({errors: ["Foto não encontrada."]})
            return;
        }

        // check if photo belongs to currenct user
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422)
                .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }
        await Photo.findByIdAndDelete(photo._id);

        res.status(200)
            .json({ id: photo._id, message: "Foto excluída com sucesso." });
    } catch (error) {
        return res.status(500).json({errors: ["Houve algum erro, tente mais tarde. DETALHES:" + error]});
    }
}

// Get all photos
const getAllPhotos = async(req, res) => {
    try {
        const photos = await Photo.find({})
            .sort([["createdAt", -1]])
            .exec();

        return res.status(200).json(photos);
        
    } catch (error) {
        return res.status(500).json({errors: ["Houve um problema inesperado, tente mais tarde"]})
    }

}

// Get user photos
const getUserPhotos = async(req, res) => {
    try {
        const { id } = req.params;
    
        const photos = await Photo.find({userId: id})
        .sort([["createdAt", -1]])
        .exec();
    
        if (!photos) return res.status(404).json({errors: ["Nenhum post foi encontrado"]})
        return res.status(200).json(photos)
        
    } catch (error) {
        return res.status(500).json({errors: ["Houve algum erro, tente mais tarde. DETALHES:" + error]});
    }
}

// Get photo by Id
const getAPhotoById = async(req, res) => {
    try {
        const { id } = req.params;
    
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
        
        // check if photo exists
        if (!photo) return res.status(404).json({errors: ["Foto não encontrada"]});

        return res.status(200).json(photo);

    } catch (error) {
        return res.status(500).json({errors: ["Houve algum erro, tente mais tarde. DETALHES:" + error]});
    }
}

// Update a photo
const updatePhoto = async(req, res) => {
    
    try {
        const {id} = req.params;
        const {title} = req.body;
    
        const reqUser = req.user;
        
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        // check if photo exists
        if (!photo) return res.status(404).json({errors: ["Foto não encontrada."]})
        
        // check if photo belongs to user
        if (!photo.userId.equals(reqUser._id)) return res.status(400).json({
            errors: ["Você não pode alterar uma foto de outro usuário"]
        })

        if (title) photo.title = title;

        await photo.save();

        res.status(200).json({photo, message: "Foto atualizada com sucesso."});
    } catch (error) {
        return res.status(500).json({errors: ["Houve algum erro, tente mais tarde. DETALHES:" + error]});
    }
}

// Like functionality
const likePhoto = async(req, res) => {

    const {id} = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) return res.status(404).json({errors: ["Foto não encontrada."]})

    // check if user already liked the photo
    if (photo.likes.includes(reqUser._id)) {
        photo.likes.splice(photo.likes.indexOf(reqUser._id), 1)
        // res.status(422).json({errors: ["Você já curtiu a foto."]})
        photo.save();

        return res.status(200).json({
            photoId: id,
            userId: reqUser._id,
            message: "Você descurtiu a foto."
        })

    } 
    
    // put user id in likes array
    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({
        photoId: id,
        userId: reqUser._id,
        message: "A foto foi curtida."
    })
}

// comment functionality
const commentPhoto = async(req, res) => {
    const {id} = req.params;
    const {comment} = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) return res.status(404).json({errors: ["Foto não encontrada."]})
    
    // put comment in the array comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    }

    photo.comments.push(userComment);

    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: "O comentário foi inserido com sucesso."
    })
}

// Search photo by Title
const searchPhotosByTitle = async(req, res) => {
    const {q} = req.query;

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getAPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotosByTitle
};