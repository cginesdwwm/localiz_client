// import { BASE_URL } from "../utils/url";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function getBlogsFromApi() {
  return [];
  // try {
  //   const response = await fetch(`${BASE_URL}blog`);
  //   const blogsFromBackend = await response.json();
  //   return blogsFromBackend;
  // } catch (error) {
  //   console.log(error);
  // }
}
