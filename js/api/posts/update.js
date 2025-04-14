import { API_BASE } from "../constants.js";
import { authFetch } from "../fetch.js";

const action = "/posts";
const method = "PUT";

/**
 * Updates a post with the provided data.
 * @param {Object} postData - The post data to update.
 * @param {string|number} postData.id - The ID of the post to update.
 * @param {string} postData.title - The new title of the post.
 * @param {string} postData.body - The new body/content of the post.
 * @param {Object} [postData.media] - Optional media to attach to the post.
 * @param {string} [postData.media.url] - URL of the media.
 * @param {string} [postData.media.alt] - Alt text for the media.
 * @returns {Object} The updated post data returned from the API.
 * @throws {Error} Throws an error if the post ID is missing or the API request fails.
 */
export async function updatePost(postData) {
  if (!postData.id) {
    throw new Error("No post ID provided");
  }

  const updatePostURL = `${API_BASE}/social${action}/${postData.id}`;

  try {
    const response = await authFetch(updatePostURL, {
      method,
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json", // It's important to specify the Content-Type when sending JSON
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update post: ${errorData.errors?.[0]?.message || "Unknown error"}`
      );
    }

    return await response.json(); // Return the JSON response if everything is okay
  } catch (error) {
    throw error; // Rethrow the error for handling elsewhere
  }
}
