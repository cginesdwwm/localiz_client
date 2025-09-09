import { useContext, useState } from "react";
import { createContext } from "react";
// import { useAuth } from "./AuthContext";
import { createBlog, getBlogsFromApi } from "../api/blog.api";
import { useEffect } from "react";

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  // const { userConnected } = useAuth();

  console.log({ blogs });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogsFromApi();
        setBlogs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlogs();
  }, []);

  const addBlog = async (values) => {
    console.log({ values });
    try {
      const newBlog = await createBlog(values);
      setBlogs((prev) => [newBlog, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
