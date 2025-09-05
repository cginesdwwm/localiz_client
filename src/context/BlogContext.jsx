import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { getBlogsFromApi } from "../api/blog.api";

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const response = await getBlogsFromApi();
        setBlogs(response);
      } catch (error) {
        console.log(error);
      }
    };

    getAllBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs }}>{children}</BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
