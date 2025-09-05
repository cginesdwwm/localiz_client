import { createContext, useState } from "react";

export const LikesContext = createContext({});

export function LikesProvider({ children }) {
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const likedCount = likedIds.length;

  return (
    <LikesContext.Provider value={{ likedIds, toggleLike, likedCount }}>
      {children}
    </LikesContext.Provider>
  );
}
