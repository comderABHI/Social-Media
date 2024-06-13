import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followAndUnfollowUser, getUserPosts, getUserProfile, loadUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import { toast } from "react-hot-toast";
import Post from '../Posts/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import User from '../User/User';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading,error:UserError } = useSelector((state) => state.userProfile);
  const { user: me } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const { error: followError, message, loading: followLoading } = useSelector((state) => state.like);
  const params = useParams();
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandler = async() => {
    setFollowing(!following);
   await dispatch(followAndUnfollowUser(user._id))
    dispatch(getUserProfile(params.id));
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
    dispatch(getUserPosts(params.id));
    dispatch(getUserProfile(params.id));
    
    
  }, [dispatch, params.id]);

  useEffect(()=>{
    if (me._id === params.id) {
      setMyProfile(true);
    }
    if(user){
      user.followers.forEach(item=>{
          if(item._id===me._id){
            setFollowing(true);
          }
          else{
            setFollowing(false);
          }
      })
    }
  },[user,me._id,params.id])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (followError) {
      toast.error(followError);
      dispatch({ type: "clearErrors" });
    }
    if(UserError){
      toast.error(UserError);
      dispatch({type:"clearErrors"});
    }

    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [followError, message, dispatch, error,UserError]);

  if (loading || userLoading) {
    return <Loader />;
  }

  return (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            post && (
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
              />
            )
          ))
        ) : (
          <Typography variant="h6">User has not made any posts</Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <>
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
            {!myProfile && (
              <Button
                variant="contained"
                onClick={followHandler}
                style={{ background: following ? "red" : "" }}
                disabled={followLoading}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </>
        )}
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

export default UserProfile;
