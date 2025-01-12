import { load } from "../storage/storage.js";
import { API_KEY } from "../api/constants.js";

// Funktion för att generera headers för varje API-anrop
export function headers() {
  const token = load("token"); // Hämta token från storage

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Lägg till Authorization-header om token finns
    "X-Noroff-API-key": API_KEY, // Lägg till Noroff API-nyckel
  };
}

// Funktion för att hämta alla poster, använder authFetch för att säkerställa att headers hanteras korrekt
export async function fetchPosts(url) {
  try {
    const response = await authFetch(url); // Använd authFetch för att skicka förfrågningen
    return await response.json(); // Returnera JSON-data om responsen är OK
  } catch (error) {
    console.error("Error fetching posts:", error); // Hantera eventuella fel
    return []; // Returnera en tom array om något gick fel
  }
}

// Funktion för att göra API-anrop med autentisering
export async function authFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options, // Behåll existerande options
      headers: headers(), // Lägg till headers
    });

    // Kontrollera om responsen inte är OK
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.[0]?.message || "Ett fel inträffade vid API-anrop.";
      const statusCode = response.status; // Hämta statuskod för vidare felhantering

      console.error(
        `API-fel - Statuskod: ${statusCode}, Meddelande: ${errorMessage}`
      );

      // Om det är ett 401-fel, token kan ha gått ut, hantera det här
      if (statusCode === 401) {
        // Möjlig återkoppling för att logga ut användaren eller be om ny autentisering
        console.error("Token har gått ut eller är ogiltig. Logga in igen.");
      }

      throw new Error(errorMessage);
    }

    return response; // Returnera responsen om den är OK
  } catch (error) {
    console.error("Fel vid API-anrop:", error.message);
    throw error; // Kasta felet vidare
  }
}
