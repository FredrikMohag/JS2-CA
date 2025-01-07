import { save } from "../../storage/save.js";
import { API_AUTH, API_BASE, API_LOGIN } from "../constants.js";

// Logga in en användare
export async function login(email, password) {
  const response = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, ...profile } = (await response.json()).data;
    save("token", 