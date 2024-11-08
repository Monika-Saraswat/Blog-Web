const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true }, // Reference to Blog
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublic: { type: Boolean, default: true },
    comments: [commentSchema]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Blog, Comment };
