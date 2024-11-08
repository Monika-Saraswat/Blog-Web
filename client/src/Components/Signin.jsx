import React, { useState } from "react";
import sig from "../assets/img/sgbg.png";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [uploadText, setUploadText] = useState("Upload your picture");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fileInput", fileInput);
    console.log(fileInput)

    try {
      const response = await fetch("/auth/signin", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        navigate("/auth/verifyemail");
      } else {
        console.error("Error:", data.message);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }

    // Reset form fields
    setUsername("");
    setEmail("");
    setPassword("");
    setFileInput(null);
    setUploadText("Upload your picture");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setUploadText(file.name);
      setFileInput(file);
    } else {
      setUploadText("Upload your picture");
    }
  };

  return (
    <div className="hero min-h-screen" style={{ backgroundColor: "#fff" }}>
      <div className="hero-content text-center bg-opacity-60 size-5/6"></div>
      <div className="card lg:card-side bg-base-100 shadow-xl size-11/12">
        <figure>
          <img src={sig} alt="Album" style={{ width: "80%" }} />
        </figure>
        <div className="card-body my-auto">
          <h2 className="mb-5 text-4xl font-bold">Hello there, Sign Up Please!</h2>
          <p className="mb-5">Discover, Share, and Inspire – Create an Account Now!</p>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display error message */}
          <div className="container mx-auto">
            <form className="w-80 mx-auto space-y-3">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <i className="bi bi-camera text-3xl"></i>
                  <span className="text-gray-500">{uploadText}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="fileInput"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)} // Capture email
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  value={username}
                  name="username"
                  onChange={(e) => setUsername(e.target.value)} // Capture username
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)} // Capture password
                />
              </label>
              <div className="form-control mt-6">
                <button type="submit"  onClick={onSubmit()} className="btn btn-primary">
                  Sign Up
                </button>
              </div>
            </form>
            <div className="form-control mt-4 text-center">
              <span>Already have an account?</span>
              <Link to="/auth/login" className="label-text-alt link link-hover mt-2 block">
                Please Log In!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
