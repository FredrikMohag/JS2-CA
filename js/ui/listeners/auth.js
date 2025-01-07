import { onAuth } from "../events/onAuth.js";

export function setAuthListener() {
  console.log("Auth.js körs!"); // Flyttad högst upp
  console.log("setAuthListener körs!");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (regist