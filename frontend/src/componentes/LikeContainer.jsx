import style from './LikeContainer.module.css';

import { BsHeart, BsHeartFill } from 'react-icons/bs';

const LikeContainer = ({photo, user, handleLike}) => {
    return (
        <div className={style.like}>
            {photo.likes && user && (
                <>
                    
                    {photo.likes.includes(user._id) ? (
                        <BsHeartFill />
                    ) : (
                        <BsHeart onClick={() => handleLike(photo)}/>
                    )}
                    <p>{photo.likes.length} like(s)</p>
                </>
            )}
        </div>
    )
}

export default LikeContainer;
