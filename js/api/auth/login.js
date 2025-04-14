import { save } from "../../storage/storage.js";
import { API_AUTH, API_BASE, API_LOGIN } from "../constants.js";

/**
 * Logs in a user with the provided email and password.
 * If login is successful, stores the token, user profile, and username in localStorage,
 * and redirects the user to the profile page.
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} Returns nothing, but redirects upon successful login.
 * @throws {Error} Throws an error if login fails or an unexpected issue occurs.
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (response.ok) {
      if (responseData && responseData.data) {
        const { accessToken, ...profile } = responseData.data;
        const username = profile.name || profile.username || "User";

        save("token", accessToken);
        save("profile", profile);
        save("username", username);

        window.location.href = "/profile/index.html";
      } else {
        throw new Error("Invalid response from server: missing data.");
      }
    } else {
      throw new Error(`Server error: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
}
