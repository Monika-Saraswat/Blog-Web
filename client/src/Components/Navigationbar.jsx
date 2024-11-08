import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigationbar = ( ) => {
  const navigate=useNavigate();
  const logout=()=>{
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    navigate('/auth/login')
  }
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return (
    <div className="navbar shadow-xl p-4 mb-10">
      <div className="flex-1">
        <a className="btn btn-ghost text-4xl text-tahiti-400">
          Blog <span className="text-tahiti-500">Website</span>
        </a>
      </div>

      <div className="hidden lg:flex">
        <Link to="/blog/new">
          <i className="bi bi-plus-lg text-2xl m-2 text-tahiti-500"></i>
        </Link>
        <Link to="/public-blog">
          <button className="btn btn-outline btn-info m-2">Public</button>
        </Link>
        <Link to="/private-blog">
          <button className="btn btn-outline btn-info m-2">Private</button>
        </Link>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar m-2"
          >
            <div className="w-20 rounded-full">
              <img
                alt="Profile avatar"
                src={
                  user.fileInput
                    ? `http://localhost:8080/${user.fileInput}`
                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li className="lg:hidden">
              <Link to="/blog/new">
                <i className="bi bi-plus-lg text-tahiti-500"></i> Add New
              </Link>
            </li>
            <li className="lg:hidden">
              <Link to="/public-blog">Public</Link>
            </li>
            <li className="lg:hidden">
              <Link to="/private-blog">Private</Link>
            </li>
            <li>
              <span onClick={logout}>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigationbar;
