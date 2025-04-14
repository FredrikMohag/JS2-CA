import { login } from "../../api/auth/login.js";
import { register } from "../../api/auth/register.js";
import { load, save } from "../../storage/storage.js"; // Import storage functions

/**
 * Handles authentication (login or registration) when a form is submitted.
 * @param {Event} event - The submit event triggered by the form.
 */
export async function onAuth(event) {
  event.preventDefault();

  const name = event.target.name?.value || null; // Handle cases where `name` is not used
  const email = event.target.email?.value;
  const password = event.target.password?.value;

  if (!email || !password) {
    throw new Error("Email and password are required!");
  }

  try {
    let user; // Declare a variable to hold user data

    if (event.submitter?.dataset.auth === "login") {
      const loginResponse = await login(email, password);

      if (loginResponse?.data) {
        user = loginResponse.data; // Assign user profile from login response
      } else {
        throw new Error("Login failed: No user data received.");
      }
    } else {
      const userData = await register(name, email, password);

      // Automatically log in the user after registration
      const loginResponse = await login(email, password);

      if (loginResponse?.data) {
        user = loginResponse.data; // Assign user profile from login response
      } else {
        throw new Error("Login failed after registration.");
      }
    }

    // Save user's data after successful login or registration
    const profile = load("profile"); // Retrieve saved profile
    if (profile && profile.name) {
      save("username", profile.name); // Save username as "username"
      save("userId", profile.id); // Save user's ID if needed
    } else {
      throw new Error("Failed to save user data: profile is invalid.");
    }
  } catch (error) {
    throw new Error(`Error in onAuth: ${error.message}`);
  }
}
