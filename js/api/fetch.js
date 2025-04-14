import { API_KEY } from "../api/constants.js";
import { load } from "../storage/storage.js";

/**
 * Generates headers for API requests, including authentication and API key.
 * @returns {Object} The headers object including Content-Type, Authorization, and API key.
 */
export function headers() {
  const token = load("token"); // Retrieve token from storage

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add Authorization header if token exists
    "X-Noroff-API-key": API_KEY, // Add Noroff API key
  };
}

/**
 * Fetches posts from a given URL.
 * @param {string} url - The URL to fetch posts from.
 * @returns {Array} An array of posts from the API response.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function fetchPosts(url) {
  try {
    const response = await authFetch(url);
    const data = await response.json();

    // Noroff API returns posts in the "data" property
    return data.data || []; // Return an empty array if no data is found
  } catch (error) {
    throw new Error("Error fetching posts: " + error.message);
  }
}

/**
 * Makes an authenticated fetch request to the given URL with provided options.
 * @param {string} url - The URL to make the request to.
 * @param {Object} [options={}] - Additional options for the fetch request.
 * @returns {Response} The response from the fetch request.
 * @throws {Error} Throws an error if the request fails or the response is not OK.
 */
export async function authFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options, // Keep existing options
      headers: headers(), // Add headers
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.[0]?.message || "An error occurred with the API request.";
      const statusCode = response.status; // Get status code for further error handling

      // If it's a 401 error, the token might have expired
      if (statusCode === 401) {
        // Possible feedback to log out the user or request new authentication
      }

      throw new Error(errorMessage);
    }

    return response; // Return the response if it's OK
  } catch (error) {
    throw new Error("Error during API request: " + error.message);
  }
}
