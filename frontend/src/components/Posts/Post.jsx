import React, { useEffect, useState } from 'react';
import "./Post.css";
import { Avatar, Typography, Dialog, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { addCommentOnPost, deletePost, likePost, updatePost } from '../../Actions/Post';
import { getFollowingPosts, getmyPosts, loadUser } from '../../Actions/User';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);


  const { user } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePost(postId));
    if (isAccount) {
      dispatch(getmyPosts());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  const addCommentHandler = async (e) => {
    console.log('add comment');
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue));
    
    if (isAccount) {
      dispatch(getmyPosts());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  const updateCaptionhandler=(e)=>{
    e.preventDefault();
    dispatch(updatePost(captionValue,postId));
    dispatch(getmyPosts());
  }

  const deletePostHandler = async(e) => {
    e.preventDefault();
    await dispatch(deletePost(postId));
    dispatch(getmyPosts());
    dispatch(loadUser())
};

  useEffect(() => {
    likes.forEach(item => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

 


  return (
    <div className='post'>
      <div className='postHeader'>
        {isAccount && <button onClick={()=>setCaptionToggle(!captionToggle)}><MoreVert /></button>}
      </div>
      <img src={postImage} alt="Post" />
      <div className='postDetails'>
        <Avatar 
          src={ownerImage} 
          alt="user" 
          sx={{ height: "3vmax", width: "3vmax" }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>
        <Typography 
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button 
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0}
      >
        <Typography>{likes.length} Likes</Typography>
      </button>
      <div className='postFooter'>
        <button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </button>
        <button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </button>
        {isDelete && (
          <button onClick={deletePostHandler}>
            <DeleteOutline />
          </button>
        )}
      </div>
      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className='DialogBox'>
          <Typography variant='h4'>Liked by</Typography>
          {likes.map(like => (
            <User 
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
          ))}
        </div>
      </Dialog>

      <Dialog open={commentToggle} onClose={() => setCommentToggle(!commentToggle)}>
        <div className='DialogBox'>
          <Typography variant='h4'>Comments</Typography>
          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              required
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>

          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard 
                key={comment._id}
                userId={comment.user._id} 
                name={comment.user.name}
                avatar={comment.user.avatar.url} 
                comment={comment.comment} 
                commentId={comment._id} 
                postId={postId}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography>No Comments Yet</Typography>
          )}
        </div>
      </Dialog>

      <Dialog open={captionToggle} onClose={() => setCaptionToggle(!captionToggle)}>
        <div className='DialogBox'>
          <Typography variant='h4'>update Caption</Typography>
          <form className="commentForm" onSubmit={updateCaptionhandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>

          
        </div>
      </Dialog>
    </div>
  );
}

export default Post;
