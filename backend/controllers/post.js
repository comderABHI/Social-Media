const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

exports.createPost = async (req, res) => {
    try {
        const myCloud = await cloudinary.uploader.upload(req.body.image, {
            folder: "posts",
        });

        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner: req.user._id
        };

        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);
        user.posts.unshift(post._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//Delete post
exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      
      await cloudinary.uploader.destroy(post.image.public_id);
  
      await post.deleteOne();
      res.status(200).json({
        success: true,
        message: "Post deleted",
      });
  
      const user = await User.findById(req.user._id);
  
      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
  
      await user.save();
  
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
//like and unlike post
exports.likeAndUnlikePost = async (req, res) => {
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        if(post.likes.includes(req.user._id)){
            const index=post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Post unliked successfully"
            })
        }
        else{
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Post liked successfully"
            })
        }
        post.likes.push(req.user._id);
        await post.save();
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//get All posts
exports.getPostOfFollowing=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id);
        const posts=await Post.find({
            owner:{
                $in:user.following,
            },
        }).populate("owner likes comments.user");
        res.status(200).json({
            success:true,
            posts:posts.reverse()
        })
        
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//update caption
exports.updateCaption=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"You are not authorized to update this post"
            });
        }
        post.caption=req.body.caption;
        await post.save();
        res.status(200).json({
            success:true,
            message:"Post updated successfully"
        })
    }
     catch (error) {
       res.status(500).json({
           success:false,
           message:error.message
       }) 
    }
}
//comment on post
exports.addcomment=async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({
            success: false,
            message: "Post not found",
          });
        }
    
        let commentIndex = -1;
    
        // Checking if comment already exists
    
        post.comments.forEach((item, index) => {
          if (item.user.toString() === req.user._id.toString()) {
            commentIndex = index;
          }
        });
    
        if (commentIndex !== -1) {
          post.comments[commentIndex].comment = req.body.comment;
    
          await post.save();
    
          return res.status(200).json({
            success: true,
            message: "Comment Updated",
          });
        } else {
          post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
          });
    
          await post.save();
          return res.status(200).json({
            success: true,
            message: "Comment added",
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}
//Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        if(post.owner.toString()===req.user._id.toString()){
            if(req.body.commentId===undefined){
                return res.status(400).json({
                    success:false,
                    message:"Please provide commentId"
                })

            }
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                  return post.comments.splice(index, 1);
                }
              });
        
              await post.save();
        
              return res.status(200).json({
                success: true,
                message: "Selected Comment has deleted",
              });
        }
        else{
            post.comments.forEach((item,index)=>{
                if(item.user.toString()===req.user._id.toString()){
                    post.comments.splice(index,1);
                }
            });
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment deleted successfully"
            });
        }
    } 
     catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}