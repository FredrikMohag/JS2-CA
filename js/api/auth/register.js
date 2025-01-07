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

    // Kontrollera om svar är OK
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to register. Server responded with status ${response.status}: ${errorDetails}`
      );
    }

    const data = await response.json();

    // Logga framgångsrik registrering med detaljer om användaren
    console.log(
      `SUCCESS: Användare registrerad framgångsrikt: ${
        data.name || data.id || "ingen identifierare tillgänglig"
      }`
    );

    // Omdirigera användaren till feed/index.html efter registreringen
    window.location.href = "/feed/index.html";

    return data;
  } catch (error) {
    console.error("Fel vid registrering:", error.message);
    throw error; // Släng vidare felet för att hanteras av den som anropar
  }
}
