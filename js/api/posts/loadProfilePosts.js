import { load } from "../../storage/storage.js";
import { authFetch } from "../fetch.js"; // Se till att du importerar authFetch
import { API_BASE, API_POSTS } from "../constants.js";

export async function loadProfilePosts(userId) {
  try {
    console.log("Laddar profilposter för användare:", userId); // Lägg till logg här för att se vilket användar-ID som skickas
    const response = await authFetch(`${API_BASE}${API_POSTS}`);
    const { data } = await response.json();

    // Filtrera poster baserat på användarens ID
    const userPosts = data.filter((post) => post.author?.id === userId);

    // Sortera poster i fallande ordning efter createdAt
    const sortedUserPosts = userPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Nyaste först
    });

    console.log("Hämtade poster:", sortedUserPosts); // Logga de hämtade posterna
    return sortedUserPosts;
  } catch (error) {
    console.error("Misslyckades att hämta profil-poster:", error);
    return []; // Retur en tom array om det går fel
  }
}
