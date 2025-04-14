import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Deletes a post by its ID.
 *
 * @async
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<Object>} Empty object if successful, or API response if any.
 * @throws {Error} If postId is missing or the request fails.
 */
export async function deletePost(postId) {
  if (!postId) throw new Error("No post ID provided");

  const deletePostURL = `${API_BASE}${API_POSTS}/${postId}`;

  try {
    const response = await authFetch(deletePostURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return {}; // Deletion successful
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete post: ${errorData.errors?.[0]?.message || "Unknown error"}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
}
