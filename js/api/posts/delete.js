import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

const action = "/posts";
const method = "DELETE";

// Ta bort inlägg
export async function deletePost(postId) {
  if (!postId) {
    throw new Error("No post ID provided");
  }

  const deletePostURL = `${(API_BASE, API_POSTS)}${action}/${postId}`;

  try {
    const response = await authFetch(deletePostURL, {
      method,
      headers: {
        "Content-Type": "application/json", // Använd Content-Type i DELETE-förfrågningar när du använder JSON
      },
    });

    // Kontrollera om svaret är OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete post: ${
          errorData.errors?.[0]?.message || "Unknown error"
        }`
      );
    }

    // Returnera svaret om borttagningen var framgångsrik
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error; // Kasta felet vidare för att hantera det vid behov
  }
}
