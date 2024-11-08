import React, { useState } from 'react';
import log from "../assets/img/logbg.png";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'NOT_VERIFIED') {
                    navigate('/auth/verifyemail');
                } else {
                    setErrorMessage(data.message || "Login failed. Please try again.");
                }
            } else {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                navigate('/blog/home');
            }
        } catch (error) {
            console.error("Request failed:", error);
            setErrorMessage("An error occurred. Please try again.");
        }

        // Reset form fields only on success
        
            setPassword("");
            setUsername("");
    };

    return (
        <div className="hero min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <figure>
                    <img src={log} alt="Login background" />
                </figure>
                <div className="text-center lg:text-left"></div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={onsubmit}>
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <p className="py-6">Welcome Back! Let’s Continue the Journey Together.</p>
                        {errorMessage && (
                            <div className="text-red-500 text-center mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Type Your Username"
                                name="username"
                                value={username}
                                className="input input-bordered"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                name="password"
                                value={password}
                                className="input input-bordered"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">
                                    Forgot password?
                                </a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                        <div className="form-control mt-4 text-center">
                            <span>Don't have an account?</span>
                            <Link to='/auth/signin' className="label-text-alt link link-hover mt-2">
                                Please Register!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
