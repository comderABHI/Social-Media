const User=require("../models/User");
const Post=require("../models/Post");
const{sendEmail}=require("../middlewares/sendEmail");
const crypto=require("crypto");
const cloudinary=require("cloudinary").v2;
//Registering the user
exports.register=async(req,res)=>{
    try{
        const {name,email,password,avatar}=req.body;
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }
        const myCloud=await cloudinary.uploader.upload(avatar,{
            folder:"avatars",
        });

        user=await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            },

        });
        const token =await user.generateToken();
        const options={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }
        res.status(201).cookie("token",token,options)
        .json({
            success:true,
            message:"User Logged In Successfully",
            user,
            token
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//Logging in the user
exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password").populate("posts followers following");
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user Does Not Exist"
        });    
    }
    const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"incorrect password"
            });
        }
        const token =await user.generateToken();
        const options={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }
        res.status(201).cookie("token",token,options)
        .json({
            success:true,
            message:"User Logged In Successfully",
            user,
            token
        });
  }
  catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}
//Logout
exports.logout=async(req,res)=>{
    try{
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
        .json({
            success:true,
            message:"Logged Out Successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
} 
//Follow others
exports.followUser=async(req,res)=>{
    try{
        const userToFollow=await User.findById(req.params.id);
        const loggedInUser=await User.findById(req.user._id);
        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }
        if(loggedInUser.following.includes(userToFollow._id)){ 
            const indexfollowing=loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexfollowing,1);
            const indexfollowers=userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexfollowers,1);
            await loggedInUser.save();
            await userToFollow.save();
            res.status(200).json({
                success:true,
                message:"User Unfollowed Successfully"
            });
        }
        else{
            loggedInUser.following.push(userToFollow._id);
             userToFollow.followers.push(loggedInUser._id);
            await loggedInUser.save();
            await userToFollow.save();
        res.status(200).json({
            success:true,
            message:"User Followed Successfully"
        });
        }   
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
//Update Password
exports.updatePassword=async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("+password");
        const {oldPassword,newPassword}=req.body;
        if(!oldPassword||!newPassword){
            return res.status(400).json({
                success:false,
                message:"Please Enter Old Password and New Password"
            });
        }
        const comparePassword=await user.comparePassword(oldPassword);
        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Incorrect Old Password"
            });
        }
        user.password=newPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password Updated Successfully"
        });
    } 
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
//update profile
exports.updateProfile=async(req,res)=>{
    try {
    const user=await User.findById(req.user._id);
    const {name,email,avatar}=req.body;
    if(name){
        user.name=name;
    }
    if(email){
        user.email=email;
    } 
    if(avatar){
        await cloudinary.uploader.destroy(user.avatar.public_id);
        const myCloud=await cloudinary.uploader.upload(avatar,{
            folder:"avatars",
        });
        user.avatar.public_id=myCloud.public_id;
        user.avatar.url=myCloud.secure_url;
    }
    await user.save();
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully"
    });   
    }
     catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//DeleteProfile
exports.deleteMyProfile=async(req,res)=>{
    try{
         const user=await User.findById(req.user._id);
         const posts=user.posts;
         const followers=user.followers;
         const following=user.following;
         const userId=user._id;

        await cloudinary.uploader.destroy(user.avatar.public_id);


         await user.deleteOne();
         res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
         for (let i = 0; i < posts.length; i++) {
            const post=await Post.findById(posts[i]);
            await cloudinary.uploader.destroy(post.image.public_id);
            await post.deleteOne();
         }
         for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
      
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
          }
         for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
      
            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
          }

          const poosts = await Post.find();
          for(let i=0;i<poosts.length;i++){
            const post=await Post.findById(poosts[i]._id);
            for(let j=0;j<post.comments.length;j++){
                if(post.comments[j].user===userId){
                    post.comments.splice(j,1);
                    
                }
            }
            await post.save();
          }

          for(let i=0;i<poosts.length;i++){
            const post=await Post.findById(poosts[i]._id);
            for(let j=0;j<post.likes.length;j++){
                if(post.likes[j].user===userId){
                    post.likes.splice(j,1);
                    
                }
            }
            await post.save();
          }

         res.status(200).json({
             success:true,
             message:"Profile deleted successfully"
         });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//My Profile
exports.myprofile=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).populate("posts followers following");
        res.status(200).json({
            success:true,
            user
        });
    } 
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
//Get user profile
exports.getUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).populate("posts followers following");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        res.status(200).json({
            success:true,
            user
        }); 
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
//Get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({
        name: { $regex: req.query.name, $options: "i" }
      });
      res.status(200).json({
        success: true,
        users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
//forgot password
exports.forgotPassword=async(req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }
        const resetPasswordToken=user.getResetPasswordToken();
        await user.save();
        const resetUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;
        const message=`Your Password Reset Token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
        try {
            await sendEmail({email:user.email,
                subject:"Reset Password",
                message
            });
            res.status(200).json({
                success:true,
                message:`Email Sent to ${user.email}`
            });
        } catch (error) {
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save();
            return res.status(500).json({
                success:false,
                message:"Email Could Not Be Sent"
            });
        }
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
//Reset Password
exports.resetPassword=async(req,res)=>{
    try {
        const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user=await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Token"    
        });
    } 
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password Reset Successfully"
    });
}
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });    
    }
}
//get my posts
exports.getMyPosts=async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
    
        const posts = [];
    
        for (let i = 0; i < user.posts.length; i++) {
          const post = await Post.findById(user.posts[i]).populate(
            "likes comments.user owner"
          );
          posts.push(post);
        }
    
        res.status(200).json({
          success: true,
          posts,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}

//getUserPosts
exports.getUserPost=async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
    
        const posts = [];
    
        for (let i = 0; i < user.posts.length; i++) {
          const post = await Post.findById(user.posts[i]).populate(
            "likes comments.user owner"
          );
          posts.push(post);
        }
    
        res.status(200).json({
          success: true,
          posts,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}
