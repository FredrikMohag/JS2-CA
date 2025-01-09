import { API_AUTH, API_BASE, API_REGISTER } from "../constants.js";

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
    console.log("Försöker registrera användare...");

    // Skapa request-body
    const requestBody = {
      name,
      email,
      password,
    };

    // Lägg till valfria fält om de finns
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

    // Kontrollera om svar är OK
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to register. Server responded with status ${response.status}: ${errorDetails}`
      );
    }

    const data = await response.json();
    console.log("API-respons:", data);

    // Kontrollera och logga användarens namn
    const userName = data?.data?.name || "okänd";
    console.log(`SUCCESS: Användare registrerad framgångsrikt: ${userName}`);

    window.location.href = "/profile/index.html";

    return data;
  } catch (error) {
    console.error("Fel vid registrering:", error.message);
    throw error; // Släng vidare felet för att hanteras av den som anropar
  }
}
