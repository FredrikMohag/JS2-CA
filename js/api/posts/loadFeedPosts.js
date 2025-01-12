import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

export async function loadFeedPosts() {
  try {
    const response = await authFetch(`${API_BASE}${API_POSTS}`);
    const { data } = await response.json();

    // Sortera poster så att det senaste kommer först (om det finns ett datumfält)
    data.sort((a, b) => {
      // Anta att varje post har ett "createdAt" fält
      // Om "createdAt" inte finns, kan du istället jämföra baserat på ID (eller något annat unikt fält)
      return new Date(b.createdAt) - new Date(a.createdAt); // Sortera i fallande ordning
    });

    return data; // Returnera de sorterade posterna
  } catch (error) {
    console.error("Failed to load feed posts:", error);
    return [];
  }
}
