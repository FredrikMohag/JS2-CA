import { load } from "../../storage/storage.js";
import { authFetch } from "../fetch.js"; // Se till att du importerar authFetch
import { API_BASE, API_POSTS } from "../constants.js";

export async function loadProfilePosts() {
  try {
    const currentUserId = load("userId"); // Hämtar användarens ID från storage
    console.log("Hämtad userId i loadProfilePosts.js:", currentUserId); // Debugging

    if (!currentUserId) {
      console.error("User ID saknas. Logga in.");
      return []; // Om userId saknas, returnera tom array
    }

    // Hämta alla poster från API
    const response = await authFetch(`${API_BASE}${API_POSTS}`);

    if (!response.ok) {
      console.error("Misslyckades att hämta inlägg från API.");
      return [];
    }

    const { data } = await response.json();
    console.log("API-svar:", data); // Loggar hela svaret från API

    if (!data || data.length === 0) {
      console.log("API returnerade inga inlägg.");
      return [];
    }

    // Filtrera poster så att vi endast får de som tillhör den aktuella användaren
    const userPosts = data.filter((post) => {
      return post.author && post.author.id === currentUserId;
    });

    console.log("Filtrerade poster för användare:", userPosts); // Loggar filtrerade inlägg

    if (userPosts.length === 0) {
      console.log("Inga poster för denna användare.");
      return []; // Om inga poster finns, returnera en tom array
    }

    // Sortera posterna i fallande ordning efter createdAt
    const sortedUserPosts = userPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Nyaste först
    });

    console.log("Sorterade användarposter:", sortedUserPosts); // Loggar de sorterade posterna

    return sortedUserPosts;
  } catch (error) {
    console.error("Misslyckades att hämta profilerade poster:", error);
    return []; // Om det uppstår ett fel, returnera tom array
  }
}
