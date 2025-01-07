import { API_AUTH, API_BASE, API_REGISTER } from "../constants.js";

export async function register(name, email, password) {
  try {
    console.log("Försöker registrera användare...");
    const response = await fetch(`${API_BASE}${API_AUTH}${API_REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    //