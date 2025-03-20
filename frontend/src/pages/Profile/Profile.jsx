import style from './Profile.module.css';

import { uploads } from '../../utils/config';

// components
import Message from '../../componentes/Message';
import { Link } from 'react-router-dom';
import { BsFillEyeFill, BsPencilFill, BsPSquareFill, BsXLg } from 'react-icons/bs';

// hooks
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// redux
import { getUserDetails } from '../../slices/UserSlice';
import {
    publishPhoto,
    getUserPhotos,
    resetMessage,
    deletePhoto,
    updatePhoto
} from '../../slices/photoSlice';


const Profile = () => {

    const {id} = useParams();

    const dispatch = useDispatch();

    const {user, loading} = useSelector((state) => state.user);
    const {user: userAuth} = useSelector((state) => state.auth);
    const { 
        photos,
        loadingPhoto,
        loadingUserPhotos,
        message: messagePhoto,
        error: errorPhoto
    } = useSelector((state) => state.photo);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");

    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editTitle, setEditTitle] = useState("");

    // New form and edit form refs
    const newPhotoForm = useRef();
    const editPhotoForm = useRef();
    
    // load user data
    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id));
    }, [dispatch, id]);

    const handleFile = (e) => {
        const image = e.target.files[0];

        setImage(image);
    }

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    const submitHandle = (e) => {
        e.preventDefault();

        const photoData = {
            title,
            image
        }
        
        // build form data
        const formData = new FormData();

        const photoFormData = Object.keys(photoData).forEach((key) => 
            formData.append(key, photoData[key])
        );

        formData.append("photo", photoFormData);

        dispatch(publishPhoto(formData));

        setTitle("");

        resetComponentMessage();
    }
    
    // Delete a photo
    const handleDelete = (id) => {

        dispatch(deletePhoto(id))

        resetComponentMessage();
    }

    // Show or hide forms
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle("hide");
        editPhotoForm.current.classList.toggle("hide");
    }

    // Update a photo
    const handleUpdate = (e) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            id: editId
        }

        console.log(photoData);

        dispatch(updatePhoto(photoData));

        resetComponentMessage();

    }

    // Open edit form
    const handleEdit = (photo) => {
        if (editPhotoForm.current.classList.contains("hide")) {
            hideOrShowForms();
        }

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditImage(photo.image);
    }

    // Cancel Update a photo
    const handleCancelEdit = () => {
        hideOrShowForms();
    }

    if (loading) return <p>Carregando...</p>

    return (

        <div id={style.profile}>
            <div className={style.profile_header}>
                {user.profileImage && (
                 <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />   
                )}
                <div className={style.profile_description}>
                    <h2>{user.name}</h2>
                    <p>{user.bio}</p>
                </div>
            </div>
            {id === userAuth._id && (
                <>
                    <div className='new_photo' ref={newPhotoForm}>
                        <h3>Compartilhe algum momento seu:</h3>
                        <form onSubmit={submitHandle}>
                            <label>
                                <span>Titulo para a foto:</span>
                                <input 
                                    type="text"
                                    name="title"
                                    placeholder='Insira um título'
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title || ""}/>
                            </label>
                            <label>
                                <span>Imagem:</span>
                                <input type="file" onChange={handleFile}/>
                            </label>
                            {!loadingPhoto && <input type="submit" value="Postar" />}
                            {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
                        </form>
                    </div>
                    <div className={`${style.edit_photo} hide`} ref={editPhotoForm}>
                        <p>Editando:</p>
                        {editImage && (
                            <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                        )}
                        <form onSubmit={handleUpdate}>
                           
                            <input 
                                type="text"
                                placeholder='Insira novo título'
                                onChange={(e) => setEditTitle(e.target.value)}
                                value={editTitle || ""}/>

                            
                            <input type="submit" value="Atualizar" />
                            <button 
                                className={style.cancel_btn}
                                onClick={handleCancelEdit}>
                                    Cancelar edição
                            </button>
                        </form>
                    </div>
                    {errorPhoto && <Message msg={errorPhoto} type="error"/>}
                    {messagePhoto && <Message msg={messagePhoto} type="success"/>}
                </>
            )}
            <div className={style.user_photos}>
                <h2>Fotos publicadas</h2>
                <div className={style.photos_container}>
                    {photos && (
                        photos.map((photo) => (
                            <div className={style.photo} key={photo._id}>
                                {photo.image && (
                                    <img 
                                        src={`${uploads}/photos/${photo.image}`}
                                        alt={photo.title}
                                    />
                                )}
                                {id === userAuth._id ? (
                                    <div className={style.actions}>
                                        <Link to={`/photos/${photo._id}`} >
                                            <BsFillEyeFill />
                                        </Link>
                                        <BsPencilFill onClick={() => handleEdit(photo)}/>
                                        <BsXLg onClick={() => handleDelete(photo._id)}/>
                                    </div>
                                ) : (
                                    <Link className={style.btn} to={`/photos/${photo._id}`}>Ver</Link>
                                )}
                            </div>
                        ))
                    )}
                    {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
                </div>
            </div>
        </div>
    )
}

export default Profile;