import { API_AUTH, API_BASE, API_REGISTER } from "../constants.js";

/**
 * Registers a new user with the provided information.
 * Optional fields like bio, avatar, banner, and venueManager can be included.
 *
 * @async
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the account.
 * @param {string|null} [bio=null] - A short bio for the user (optional).
 * @param {string|null} [avatar=null] - A URL to the user's avatar image (optional).
 * @param {string|null} [banner=null] - A URL to the user's banner image (optional).
 * @param {boolean} [venueManager=false] - Whether the user is a venue manager (optional).
 * @returns {Promise<Object>} The API response data.
 * @throws {Error} Throws an error if registration fails.
 */
export async function register(
  name,
  email,
  password,
  bio = null,
  avatar = null,
  banner = null,
  venueManager = false
) {
  try {
    const requestBody = {
      name,
      email,
      password,
    };

    if (bio) requestBody.bio = bio;
    if (avatar) requestBody.avatar = avatar;
    if (banner) requestBody.banner = banner;
    if (venueManager) requestBody.venueManager = venueManager;

    const response = await fetch(`${API_BASE}${API_AUTH}${API_REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to register. Server responded with status ${response.status}: ${errorDetails}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`);
  }
}
