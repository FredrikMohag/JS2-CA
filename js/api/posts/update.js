import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";

const action = "/posts";
const method = "PUT";

// Uppdatera inlägg
export async function updatePost(postData) {
  if (!postData.id) {
    throw new Error("No post ID provided");
  }

  const updatePostURL = `${(API_BASE, API_POSTS)}${action}/${postData.id}`;

  try {
    const response = await authFetch(updatePostURL, {
      method,
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json", // Viktigt att ange Content-Type när du skickar JSON
      },
    });

    // Kontrollera om svaret är OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update post: ${
          errorData.errors?.[0]?.message || "Unknown error"
        }`
      );
    }

    return await response.json(); // Returnera JSON-svaret om allt är okej
  } catch (error) {
    console.error("Error updating post:", error);
    throw error; // Kasta felet vidare för att hantera det vid behov
  }
}
