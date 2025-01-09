import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";
import { load } from "../../storage/storage.js";

export async function loadPosts() {
  try {
    // Hämta användarens ID från lagringen
    const currentUserId = load("userId");
    if (!currentUserId) {
      console.error("User ID is missing. Please log in.");
      return [];
    }

    // Hämta alla poster från API:et
    const response = await authFetch(`${API_BASE}${API_POSTS}`);
    const { data } = await response.json();

    // Filtrera poster som tillhör den inloggade användaren
    const userPosts = data.filter((post) => post.author.id === currentUserId);

    return userPosts;
  } catch (error) {
    console.error("Failed to load posts:", error);
    return [];
  }
}
