import React from 'react';
import back from '../assets/img/backg.png';
import { Link } from 'react-router-dom';

const Root = () => {
  return (
    <div
      className="min-h-screen flex items-center align-center" 
      style={{
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover'
      }}
    >
      <div className="hero-content w-1/3 flex flex-col text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl text-tahiti-500 font-bold">Hello there</h1>
          <p className="mb-10 text-3xl text-tahiti-400">
            Welcome to Our Blog Website
          </p>
          <Link to='/auth/login'>
          <button className="btn btn-outline m-2">Sign In</button>
          </Link>
          <Link to='/auth/signin'>
          <button className="btn btn-outline m-2">Sign Up</button>
          </Link>
        </div>
      </div>
      <div ></div>
    </div>
  );
};

export default Root;
