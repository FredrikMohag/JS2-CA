import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

export async function loadFeedPosts() {
  try {
    const apiUrl = `${API_BASE}${API_POSTS}`;
    console.log("API URL:", apiUrl);

    const response = await authFetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    console.log("Raw data from API:", data);

    if (!Array.isArray(data)) {
      throw new Error("Unexpected API response format");
    }

    // Sortera posterna efter "createdAt", senaste först
    data.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA; // Senaste först
    });

    console.log(
      "Sorted data (latest first):",
      data.map((post) => post.createdAt)
    );
    return data;
  } catch (error) {
    console.error("Failed to load feed posts:", error);
    return [];
  }
}
