/**
 * LikesContext
 *
 * Contexte simple pour gérer des identifiants "likés" côté client.
 * Fournit :
 * - likedIds: tableau des IDs aimés
 * - toggleLike(id): ajoute/retire un ID
 * - likedCount: nombre total d'éléments aimés
 */
import { createContext, useState } from "react";

const LikesContext = createContext({});

export default function LikesProvider({ children }) {
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

export { LikesContext };
