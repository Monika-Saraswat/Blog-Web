import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Newblog = () => {
  const token = localStorage.getItem("authToken");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const onSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      title,
      content,
      isPublic,
    };

    try {
      const response = await fetch("/api/blog/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Blog created successfully");

        // Redirect to Allblogs page
        navigate("/blog/home");
      } else {
        const error = data.message;
        setErrorMessage(error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setErrorMessage("An error occurred while creating the blog");
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <div className="card bg-base-100 w-96 shadow-xl flex justify-center items-center mx-auto">
        <div className="card-body form-control">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Write Your Blog Here</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Your Thought"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Public</span>
              <input
                type="radio"
                name="visibility"
                className="radio checked:bg-red-500"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Private</span>
              <input
                type="radio"
                name="visibility"
                className="radio checked:bg-blue-500"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
            </label>
          </div>
          <div className="card-actions">
            <button type="submit" className="btn btn-outline text-tahiti-400">
              Publish
            </button>
          </div>
          {errorMessage && (
            <div className="mt-4 text-red-600">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default Newblog;
