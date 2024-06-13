import { createReducer } from "@reduxjs/toolkit";

const initialUserState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
};

export const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase('LoginRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoginSuccess', (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase('LoginFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase('RegisterRequest', (state) => {
            state.loading = true;
        })
        .addCase('RegisterSuccess', (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase('RegisterFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase('LoadUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoadUserSuccess', (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase('LoadUserFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })

        .addCase('LogoutUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('LogoutUserSuccess', (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase('LogoutUserFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = true;
        })

        .addCase('clearError', (state) => {
            state.error = null;
        });
});

const initialPostsState = {
 
};

export const postOfFollowingReducer = createReducer(initialPostsState, (builder) => {
    builder
        .addCase('postOfFollowingRequest', (state) => {
            state.loading = true;
        })
        .addCase('postOfFollowingSuccess', (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase('postOfFollowingFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('clearError', (state) => {
            state.error = null;
        });
});

export const allUserReducer = createReducer(initialPostsState, (builder) => {
    builder
        .addCase('allUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('allUserSuccess', (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase('allUserFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('clearError', (state) => {
            state.error = null;
        });
});

export const UserProfileReducer = createReducer(initialPostsState, (builder) => {
    builder
        .addCase('userProfileRequest', (state) => {
            state.loading = true;
        })
        .addCase('userProfileSuccess', (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase('userProfileFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('clearError', (state) => {
            state.error = null;
        });
});
