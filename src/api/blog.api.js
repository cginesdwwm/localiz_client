import { BASE_URL } from "../utils/url";

export async function getBlogsFromApi() {
  try {
    const response = await fetch(`${BASE_URL}/blog`);
    const blogsFromBackend = await response.json();
    return blogsFromBackend;
  } catch (error) {
    console.log(error);
  }
}
