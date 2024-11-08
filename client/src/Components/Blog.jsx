import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../Context/BlogContext';

const Blog = ({ blog }) => {
  const { setSelectedBlog } = useBlog();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleReadMore = async () => {
    try {
      const response = await fetch(`/api/blog/${blog._id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }); // Make a GET request to fetch the full blog

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }
      const fullBlog = await response.json(); // Parse the JSON response
      setSelectedBlog(fullBlog.blog);
      
      // Navigate to the Post component with the full blog data and current user ID
      navigate(`/blog/${blog._id}`);
    } catch (error) {
      console.error("Error fetching the blog:", error);
      alert("Failed to load the blog. Please try again later.");
    }
  };

  return (
    <div className="collapse bg-base-100 shadow-xl p-4"> {/* Added padding to container */}
      <div className="collapse-body text-center">
        <h2 className="collapse-title text-xl font-semibold">{blog.title}</h2>
        <p>{blog.content.substring(0, 100)}...</p>
        {blog.author && (
          <p className="text-sm text-gray-500">Author: {blog.author.username}</p>
        )}

        {/* Button container with responsive alignment */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
          <button 
            className="btn btn-outline btn-info sm:mr-auto mb-2 sm:mb-0"
            onClick={handleReadMore}
          >
            Read More
          </button>
          <div className="flex space-x-4 sm:space-x-2 items-center">
            <Link to="">
              <i className="bi bi-chat-right-quote-fill text-tahiti-500"></i>
            </Link>
            <span className="text-sm">{blog.comments?.length || 0}</span> {/* Display comments count */}
            <Link to="/blog/like">
              <i className="bi bi-heart-fill text-tahiti-500"></i>
            </Link>
            <span className="text-sm">{blog.likes?.length|| 0}</span> {/* Display likes count */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
