import style from './Home.module.css'

// Components
import LikeContainer from '../../componentes/LikeContainer';
import PhotoItem from '../../componentes/PhotoItem';
import { Link } from 'react-router-dom';

// hooks
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponent';

// redux
import { getPhotos, like } from '../../slices/photoSlice';

const Home = () => {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const {user} = useSelector((state) => state.auth);
  const {photos, loading} = useSelector((state) => state.photo);

  // Load all photos
  useEffect(() => {
    dispatch(getPhotos())
  }, [dispatch])

  // Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage();
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className={style.home}>
      {photos && photos.map((photo) => (
        <div key={photo._id}>
          <PhotoItem photo={photo} />
          <LikeContainer photo={photo} user={user} handleLike={handleLike} />
          <Link className={style.btn} to={`/photos/${photo._id}`}>Ver mais</Link>
        </div>
      ))}
      {photos && photos.length === 0 && (
        <h2 className={style.no_photos}>
          Ainda não há fotos publicadas, 
          <Link to={`/users/${user._id}`} >Seja o(a) primeiro(a) á publicar na rede</Link>
        </h2>
      )}
    </div>
  )
}

export default Home