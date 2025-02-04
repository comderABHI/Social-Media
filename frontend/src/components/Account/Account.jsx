import React, { useEffect, useState } from 'react';
import './Account.css';
import { useDispatch, useSelector } from 'react-redux';
import { getmyPosts, logoutUser, loadUser, DeleteMyprofile } from '../../Actions/User';
import Loader from '../Loader/Loader';
import { toast } from "react-hot-toast";
import Post from '../Posts/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import User from '../User/User';

const Account = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading} = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const { error: likeError, message,loading:deleteLoading } = useSelector((state) => state.like);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  const logoutHandler = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
  };

  const deleteProfilehandler=async()=>{
    await dispatch(DeleteMyprofile());
    dispatch(logoutUser())
  };

  const fetchFollowers = async () => {
    setFollowersLoading(true);
    await dispatch(loadUser());
    setFollowersLoading(false);
  };

  const fetchFollowing = async () => {
    setFollowingLoading(true);
    await dispatch(loadUser());
    setFollowingLoading(false);
  };

  useEffect(() => {
    dispatch(getmyPosts());
  }, [dispatch]);

  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch({type:"clearErrors"});
    }
    
    if (likeError) {
      toast.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [likeError, message, dispatch,error]);

  if (loading || userLoading) {
    return <Loader />;
  }

  return (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount={true}
              isDelete={true}
            />
          ))
        ) : (
          <Typography variant="h6">You have not made any posts</Typography>
        )}
      </div>
      <div className="accountright">
        <Avatar src={user.avatar.url} sx={{ height: "8vmax", width: "8vmax" }} />
        <Typography variant="h5">{user.name}</Typography>
        <div>
          <button onClick={() => { setFollowersToggle(!followersToggle); fetchFollowers(); }}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{user.followers.length}</Typography>
        </div>
        <div>
          <button onClick={() => { setFollowingToggle(!followingToggle); fetchFollowing(); }}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user.following.length}</Typography>
        </div>
        <div>
          <Typography>Posts</Typography>
          <Typography>{user.posts.length}</Typography>
        </div>
        <Button variant="contained" onClick={logoutHandler}>Logout</Button>
        <Link to="/update/profile">Edit Profile</Link>
        <Link to="/update/password">Change Password</Link>
        <Button variant="text" style={{ color: "red", margin: "2vmax" }} 
        onClick={deleteProfilehandler}
        disabled={deleteLoading}
        >
          Delete My Profile
        </Button>

        <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>
            {followersLoading ? <Loader /> : (
              user && user.followers.length > 0 ? (
                user.followers.map((follower) => (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar ? follower.avatar.url : undefined}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You have no followers
                </Typography>
              )
            )}
          </div>
        </Dialog>

        <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>
            {followingLoading ? <Loader /> : (
              user && user.following.length > 0 ? (
                user.following.map((follow) => (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={follow.avatar ? follow.avatar.url : undefined}
                  />
                ))
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You are not following anyone
                </Typography>
              )
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Account;
