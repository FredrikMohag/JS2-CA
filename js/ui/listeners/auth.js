import { onAuth } from "../events/onAuth.js";

export function setAuthListener() {
  console.log("Auth.js körs!"); // Flyttad högst upp
  console.log("setAuthListener körs!");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    console.log(`Register-formulär hittat med ID: ${registerForm.id}`);
    registerForm.addEventListener("submit", onAuth);
    console.log("Lyssnare tillagd för register-formulär!");
  }

  if (loginForm) {
    console.log(`Login-formulär hittat med ID: ${loginForm.id}`);
    loginForm.addEventListener("submit", onAuth);
    console.log("Lyssnare tillagd för login-formulär!");
  }
}
