import React, { createContext, useContext, useState } from 'react';

// Create a context for blog data
const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <BlogContext.Provider value={{ selectedBlog, setSelectedBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
