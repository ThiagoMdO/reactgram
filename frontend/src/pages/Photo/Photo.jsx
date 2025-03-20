import style from './Photo.module.css'

import { uploads } from '../../utils/config';

// components
import Message from '../../componentes/Message';
import { Link } from 'react-router-dom';
import PhotoItem from '../../componentes/PhotoItem';

// hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useResetComponentMessage } from '../../hooks/useResetComponent';

// Redux
import { getPhoto, like, comment } from '../../slices/photoSlice';
import LikeContainer from '../../componentes/LikeContainer';

const Photo = () => {
    const {id} = useParams();

    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    const {user} = useSelector((state) => state.auth);
    const {photo, loading, error, message} = useSelector((state) => state.photo);

    const [commentText, setCommentText] = useState("");

    // Load photo data
    useEffect(() => {
        dispatch(getPhoto(id))
    }, [dispatch, id]);

    // Insert a Like
    const handleLike = () => {
        dispatch(like(photo._id));

        resetMessage();
    }

    // Insert a comment
    const handleComment = (e) => {
        e.preventDefault();

        const commentData = {
            comment: commentText,
            id: photo._id
        }

        dispatch(comment(commentData));

        setCommentText("");

        resetMessage();
    }

    if (loading) return <p>Carregando...</p>

    return(
        <div className={style.photo}>
           <PhotoItem photo={photo}/>
           <LikeContainer photo={photo} 
                        user={user}
                        handleLike={handleLike}/>
            <div className={style.message_container}>
                {error && <Message msg={error} type="error" />}
                {message && <Message msg={message} type="success" />}
            </div>
            <div className={style.comments}>
                {photo.comments && (
                    <>
                        <h3>Comentários: ({photo.comments.length})</h3>
                        <form onSubmit={handleComment}>
                            <input 
                                type="text"
                                placeholder='Insira seu comentário...'
                                onChange={(e) => setCommentText(e.target.value)}
                                value={commentText || ""}
                            />
                            <input type="submit" value="Enviar"/>
                            {photo.comments.length === 0 && <p>Não há comentários</p>}
                            {photo.comments.map((comment) => (
                                <div className={style.comment} key={comment.comment}>
                                    <div className={style.author}>
                                        {comment.userImage && (
                                            <img 
                                                src={`${uploads}/users/${comment.userImage}`}
                                                alt={comment.userName}
                                            />
                                        )}
                                        <Link to={`/users/${comment.userId}`}>
                                            <p>{comment.userName}</p>
                                        </Link>
                                    </div>
                                    <p>{comment.comment}</p>
                                </div>
                            ))}
                        </form>
                    </>
                )}
                
            </div>
        </div>
    )
}

export default Photo;