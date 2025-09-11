const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Récupérer tous les blogs
export async function getBlogsFromApi() {
  try {
    const response = await fetch(`${BASE_URL}blog`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Créer un blog
export async function createBlog(data) {
  const response = await fetch(`${BASE_URL}blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erreur lors de la création du blog");
  return response.json();
}

// noter un blog

export async function rateBlog(blogId, rating) {
  try {
    const response = await fetch(`${BASE_URL}rating/${blogId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: rating }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erreur lors de la notation du blog");
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRateBlog(blogId) {
  try {
    const response = await fetch(`${BASE_URL}rating/${blogId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("Erreur lors de la suppression de la note");
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
