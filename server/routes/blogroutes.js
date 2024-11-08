const express = require('express');
const { newblog,allblogs, singleBlog,addComment,toggleLike,deleteBlog,editBlog,deleteComment } = require('../controllers/blog');
const { authenticateJWT } = require('../middleware/auth.middleware');

const blogroutes = express.Router();

blogroutes.get('/home',authenticateJWT,allblogs)
blogroutes.post('/new',authenticateJWT,newblog)
blogroutes.get('/:id',authenticateJWT,singleBlog); // Route for fetching a single blog by ID
blogroutes.post('/:id/comment', authenticateJWT,addComment); // Route for adding a comment
blogroutes.post('/:id/like', authenticateJWT,toggleLike); 
blogroutes.delete('/:id',authenticateJWT, deleteBlog);
blogroutes.put('/:id', authenticateJWT,editBlog);
blogroutes.delete('/:id1/comment/:id2',authenticateJWT,deleteComment)

module.exports = blogroutes;