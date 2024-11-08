import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Components/Signin';
import Login from './Components/Login';
import Root from './Components/Root';
import Home from './Components/Home';
import Otp from './Components/Otp';
import Newblog from './Components/Newblog';
import Blog from './Components/Blog';
import BlogPost from './Components/BlogPost';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/blog/home" element={<Home />} />
        <Route path="/auth/verifyemail" element={<Otp />} />
        <Route path='/blog/new' element={ <Newblog />} />
        {/* <Route path="/blog/:id/comments" component={BlogComments} /> */}
        <Route path="/blog/:id" element={<BlogPost/>} />
      </Routes>
    </Router>
  );
};

export default App;
