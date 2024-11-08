import React, { useState } from "react";
import otp from "../assets/img/otp.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Otp = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.append("code", code);

    try {
      const response = await fetch("/api/auth/verifyemail", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP verification successful:", data);
        console.log(data.user)
        navigate("/blog/home"); // Redirect to the home page on success
      } else {
        console.error("Error:", data.message);
        // Handle error response
      }
    } catch (error) {
      console.error("Request failed:", error);
    }

    // Reset form fields
    setCode("");
  };

  return (
    <div className="hero min-h-screen" style={{ backgroundColor: "#fff" }}>
      <div className="hero-content text-center bg-opacity-60 size-5/6"></div>
      <div className="card lg:card-side bg-base-100 shadow-xl size-11/12">
        <figure>
          <img src={otp} alt="Album" style={{ width: "80%" }} />
        </figure>
        <div className="card-body my-auto">
          <h2 className="mb-5 text-4xl font-bold">Hello there, Verify Your Email</h2>
          <p className="mb-5">Unlock Your Thoughts: One-Time Password Verification!</p>
          <div className="container mx-auto">
            <form className="w-80 mx-auto space-y-3" onSubmit={onSubmit}>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="number"
                  className="grow"
                  placeholder="OTP"
                  value={code}
                  name="code"
                  onChange={(e) => setCode(e.target.value)} 
                />
              </label>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
