const express = require('express');
const { register, login, followUser, logout, updatePassword, updateProfile, deleteMyProfile, myprofile, getUserProfile, getAllUsers, forgotPassword, resetPassword, getMyPosts, getUserPost } = require('../controllers/user');
const {isAuthenticated}=require("../middlewares/auth")
const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.route("/follow/:id").get(isAuthenticated,followUser)
router.route("/update/password").put(isAuthenticated,updatePassword)
router.route("/update/profile").put(isAuthenticated,updateProfile)
router.route("/delete/me").delete(isAuthenticated,deleteMyProfile)
router.route("/my/posts").get(isAuthenticated,getMyPosts)
router.route("/userposts/:id").get(isAuthenticated,getUserPost)
router.route("/me").get(isAuthenticated,myprofile)
router.route("/user/:id").get(isAuthenticated,getUserProfile)
router.route("/users").get(isAuthenticated,getAllUsers)
router.route("/forgot/password").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
module.exports = router;