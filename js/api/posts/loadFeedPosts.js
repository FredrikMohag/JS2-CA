import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Loads all posts for the main feed, sorted by creation date (newest first).
 *
 * @async
 * @returns {Promise<Object[]>} An array of post objects.
 * @throws {Error} If the request fails or the data is not valid.
 */
export async function loadFeedPosts() {
  const apiUrl = `${API_BASE}${API_POSTS}?_author=true&_media=true`;

  try {
    const response = await authFetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response from API. Expected an array.");
    }

    data.sort((a, b) => {
      const dateA = a.created ? new Date(a.created) : 0;
      const dateB = b.created ? new Date(b.created) : 0;
      return dateB - dateA;
    });

    return data;
  } catch (error) {
    return [];
  }
}
