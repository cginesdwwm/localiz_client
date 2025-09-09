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
  //   if (!response.ok) {
  //     console.log(error);
  //   }
  return response.json();
}
