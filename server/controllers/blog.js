const {Blog,Comment} = require('../models/Blog');
const User = require('../models/User');


// Controller to fetch all blogs
const allblogs = async (req, res) => {
    try {
        // Fetch all blogs and populate the author field with user details (e.g., name)
        const blogs = await Blog.find().populate('author', 'username'); // assuming 'username' is the field you want

        res.status(200).json({
            message: "Fetched all blogs successfully",
            blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Controller to create a new blog
const newblog = async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        // Create a new blog entry
        const blog = new Blog({
            title,
            content,
            author: req.user.id, // Store author's ID here
            isPublic: isPublic || false // Default to false if not provided
        });

        await blog.save();

        // Populate the author field with user details before sending response
        const populatedBlog = await blog.populate('author', 'username'); // Include only 'username'

        // Respond with the populated blog
        res.status(201).json({ message: "Blog created successfully", blog: populatedBlog });
    } catch (error) {
        console.error("Error creating blog:", error); // Better error logging
        res.status(500).json({ message: "Failed to create blog", error: error.message });
    }
};

const singleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.author', 'username'); // Populate comments' user field with username

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: "Fetched blog successfully",
            blog
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

const addComment = async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Push the new comment with the blog reference
        const newComment = { author: req.user.id, comment, blog: blog._id }; // Include the blog reference
        blog.comments.push(newComment);
        await blog.save();

        const updatedBlog = await blog.populate('comments.author', 'username');
        res.status(200).json({ message: "Comment added successfully", blog: updatedBlog });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};


const toggleLike = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const userIndex = blog.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            blog.likes.push(req.user.id); // Like the blog
        } else {
            blog.likes.splice(userIndex, 1); // Unlike the blog
        }

        await blog.save();
        res.status(200).json({ message: "Like toggled successfully", likes: blog.likes.length });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Failed to toggle like" });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
         // Assuming `req.user` is set by `authenticateToken` middleware
         console.log(req.user.id)

        // Find the blog by ID
        const blog = await Blog.findById(blogId);
        console.log(blog+" "+blog.author+" "+userId)
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this blog' });
        }

        // Delete comments associated with this blog
        await Comment.deleteMany({ blog: blogId });

        // Remove the blog from all users' likedBlogs array
        await User.updateMany(
            { likedBlogs: blogId },
            { $pull: { likedBlogs: blogId } }
        );

        // Delete the blog itself
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: 'Blog and associated comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const editBlog = async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;

        // Check if blog ID is provided in the request parameters
        if (!req.params.id) {
            return res.status(400).json({ message: "Blog ID is required" });
        }

        // Find the blog by ID
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Update the blog's fields if provided
        if (title !== undefined) {
            blog.title = title; // Update title if provided
        }
        if (content !== undefined) {
            blog.content = content; // Update content if provided
        }
        if (isPublic !== undefined) {
            blog.isPublic = isPublic; // Update visibility if provided
        }

        // Save the updated blog
        await blog.save();

        // Return the updated blog as a response
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Failed to update blog" });
    }
};

const deleteComment = async (req, res) => {
    try {
      const blogId = req.params.id1;
      const commentId = req.params.id2;
      const userId = req.user.id; // Assuming `req.user` is set by `authenticateToken` middleware
  
      // Find the blog by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // Find the comment within the blog's comments array
      const comment = blog.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Check if the logged-in user is the author of the blog
      if (blog.author.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'You do not have permission to delete this comment' });
      }
  
      // Remove the specific comment from the comments array
      comment.remove();
      await blog.save();
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

module.exports = { newblog, allblogs,singleBlog,addComment,toggleLike,deleteBlog,editBlog,deleteComment };
