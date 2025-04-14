import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Loads all posts authored by a specific user.
 *
 * @async
 * @param {string} username - The username to filter posts by.
 * @returns {Promise<Object[]>} An array of the user's posts.
 */
export async function loadProfilePosts(username) {
  try {
    if (!username) {
      return [];
    }

    const response = await authFetch(`${API_BASE}${API_POSTS}?_author=true&_media=true`);

    if (!response.ok) {
      return [];
    }

    const { data } = await response.json();

    if (!data || data.length === 0) {
      return [];
    }

    const userPosts = data.filter(
      (post) => post.author?.username === username || post.author?.name === username
    );

    const sortedUserPosts = userPosts.sort((a, b) => {
      const dateA = new Date(a.created || a.createdAt);
      const dateB = new Date(b.created || b.createdAt);
      return dateB - dateA;
    });

    return sortedUserPosts;
  } catch (error) {
    return [];
  }
}
