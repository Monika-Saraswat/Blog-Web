import React, { useEffect, useState } from 'react';
import Navigationbar from './Navigationbar';
import Blog from './Blog';
import Allblogs from './Allblogs';
import { Container } from 'react-bootstrap';
import Newblog from './Newblog';


const Home = () => {
  return (
    <div>
      <Navigationbar /> {/* Pass user data to Navigationbar */}
      <Container className='flex flex-wrap flex-row justify-center mx-auto'>
        <Allblogs />
      </Container>
      {/* <Newblog /> */}
    </div>
  );
};

export default Home;
