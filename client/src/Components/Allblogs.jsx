import React, { useEffect, useState } from 'react';
import Blog from './Blog';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Allblogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const currentUserId = user._id;
  const blogsPerPage = 3;

  async function getBlogs() {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("/api/blog/home", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 403) {
        const d = await response.json();
        alert(d.message);
        navigate('/auth/login');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);
  
  const handleLike = async (blogid) => {
    const response = await fetch(`/api/blog/${blogid}/like`, { method: 'POST' });
    const updatedBlog = await response.json();
    setBlogs(blogs.map(blog => blog._id === blogid ? updatedBlog : blog));
  };

  const handleComment = async (blogid, content) => {
    const response = await fetch(`/api/blog/${blogid}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const updatedBlog = await response.json();
    setBlogs(blogs.map(blog => blog._id === blogid ? updatedBlog : blog));
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container className="flex flex-col items-center mx-auto w-1/2 gap-4 w-auto">
      <div className="flex flex-row flex-wrap justify-center gap-4 w-11/12">
        {currentBlogs.map((blog) => (
          <Blog
            key={blog._id}
            blog={blog}
            currentUserId={currentUserId}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2 ">
        <Button
          variant="outline-primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='btn btn-outline'
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline-primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='btn btn-outline'
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default Allblogs;
