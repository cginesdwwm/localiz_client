import { useContext } from "react";
import { default as BlogContext } from "./BlogContext";

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return ctx;
}

export default useBlog;
