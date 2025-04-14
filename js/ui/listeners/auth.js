import { onAuth } from "../events/onAuth.js";

/**
 * Sets the authentication listener for login and registration forms.
 */
export function setAuthListener() {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", onAuth);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", onAuth);
  }
}
