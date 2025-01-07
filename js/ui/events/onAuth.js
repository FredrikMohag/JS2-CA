import { login } from "../../api/auth/login.js";
import { register } from "../../api/auth/register.js";

// Definiera en asynkron funktion för autentisering
export async function onAuth(event) {
  event.preventDefault();

  const name = event.target.name?.value || null; // Hantera fall där `name` inte används
  const email = event.target.email.value;
  const password = event.target.password.value;

  try 