import React, { useEffect, useState } from "react";
import { useBlog } from "../Context/BlogContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigationbar from "./Navigationbar";

const BlogPost = () => {
  const { id } = useParams();
  const { selectedBlog, setSelectedBlog } = useBlog();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const loggedInUserId = JSON.parse(localStorage.getItem("loggedInUser"))?._id;

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentInputVisible, setCommentInputVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const fullBlog = await response.json();
        setSelectedBlog(fullBlog.blog);
        setComments(fullBlog.blog.comments || []);
        setEditedTitle(fullBlog.blog.title); // Initialize edited title
        setEditedContent(fullBlog.blog.content); // Initialize edited content
      } catch (error) {
        console.error("Error fetching the blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedBlog || selectedBlog._id !== id) {
      fetchBlog();
    } else {
      setComments(selectedBlog.comments || []);
    }
  }, [id, selectedBlog, setSelectedBlog, token]);

  const handleEdit = async () => {
    const updatedBlogData = {
      author: selectedBlog.author.username,
      title: editedTitle,
      content: editedContent,
      isPublic: selectedBlog.isPublic, // Retain the current visibility status
    };

    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBlogData),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      const updatedBlog = await response.json();
      setSelectedBlog(updatedBlog.blog);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      try {
        await fetch(`/api/blog/${selectedBlog._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        navigate("/blog/home");
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }
      const updatedBlog = await response.json();
      setSelectedBlog((prev) => ({ ...prev, likes: updatedBlog.likes }));
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput) return;

    try {
      const response = await fetch(`/api/blog/${selectedBlog._id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: commentInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const updatedBlog = await response.json();
      setComments(updatedBlog.blog.comments || []);
      setCommentInput("");
      setCommentInputVisible(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
      try {
        await fetch(`/api/blog/${selectedBlog._id}/comment/${commentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        navigate(`/blog/${blog._id}`)
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEditComment=()=>{

  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navigationbar />
      <div className="container collapse shadow-xl mx-auto p-4 text-center">
        <div className="collapse-body text-center">
          {isEditing ? (
            <div>
              <h1 className="text-2xl font-bold">Edit Blog</h1>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Title"
                className="input input-bordered w-full mb-2"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Content"
                className="textarea textarea-bordered w-full mb-2"
              />
              <div className="flex space-x-4">
                <button className="btn btn-primary" onClick={handleEdit}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{selectedBlog.title}</h1>
              <p className="text-sm text-gray-500">
                Author: {selectedBlog.author?.username || "Unknown Author"}
              </p>
              <div className="mt-4">
                <p>{selectedBlog.content}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                {selectedBlog.author?._id === loggedInUserId && (
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="btn btn-outline btn-warning"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pen-fill"></i>
                    </button>
                    <button
                      className="btn btn-outline btn-danger"
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                )}
                <div className="flex space-x-4 sm:space-x-2 items-center">
                  <Link
                    to="#"
                    onClick={() =>
                      setCommentInputVisible(!isCommentInputVisible)
                    }
                  >
                    <i className="bi bi-chat-right-quote-fill text-tahiti-500 btn-outline btn"></i>
                  </Link>
                  <span>{selectedBlog.comments.length || 0}</span>
                  <Link to="#" onClick={handleLike}>
                    <i className="bi bi-heart-fill btn-outline btn text-tahiti-500"></i>
                  </Link>
                  <span>{selectedBlog.likes.length || 0}</span>
                  {isCommentInputVisible && (
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="input input-bordered"
                      />
                      <button type="submit" className="btn btn-primary ml-2">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <div className="mt-4 container items-center">
                {comments.length > 0 ? (
                  <>
                    <h2 className="text-lg font-semibold">Comments</h2>
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="card w-11/12 shadow-xl p-2 my-2"
                      >
                        <div className="card-body ">
                          <p>
                            <strong>
                              {comment.author?.username || "Unknown User"}
                            </strong>
                            : {comment.comment}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                            <span>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.author?._id === loggedInUserId && (
                              <div className="mt-2">
                                <button
                                  className="btn btn-outline btn-danger mx-2"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  <i className="bi bi-trash-fill"></i>
                                </button>
                                <button
                                  className="btn btn-outline"
                                  onClick={handleEditComment(comment._id)}
                                >
                                  <i className="bi bi-pen-fill"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
