import {configureStore} from '@reduxjs/toolkit';
import { UserProfileReducer, allUserReducer, postOfFollowingReducer, userReducer } from './Reducers/User';
import { likeReducer, myPostsReducer, userPostsReducer } from './Reducers/Post';

const store=configureStore({
    reducer:{
        user:userReducer,
        postOfFollowing:postOfFollowingReducer,
        allUsers:allUserReducer,
        like:likeReducer,
        myPosts:myPostsReducer,
        userProfile:UserProfileReducer,
        userPosts:userPostsReducer,
    },
});
export default store;