import { authFetch } from "../fetch.js";
import { API_BASE, API_POSTS } from "../constants.js";
import { load } from "../../storage/storage.js";
import { loadProfilePosts } from "./loadProfilePosts.js";
import {
  createPostHTML,
  addPostToDOM,
  setupDeleteButton,
  setupUpdateButton,
} from "./postCard.js";

// Lägg till ett inlägg till DOM
function addPostToProfile(post) {
  console.log("addPostToProfile körs, inlägg:", post);

  // Skapa HTML för inlägget
  const postHTML = createPostHTML(post);

  // Lägg till inlägget i DOM
  addPostToDOM(postHTML, ".feed-posts");

  console.log("Inlägg tillagt på profilsidan.");

  // Lägg till eventlyssnare för radera- och uppdatera-knappar
  setupDeleteButton(post.id);
  setupUpdateButton(post.id);
}

// Skapa ett inlägg
export async function createPost(postData) {
  const createPostURL = `${API_BASE}${API_POSTS}`;

  try {
    const response = await authFetch(createPostURL, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fel från servern:", errorData);
      throw new Error(errorData.errors[0]?.message || "Något gick fel!");
    }

    const res = await response.json();
    console.log("Inlägg skapad framgångsrikt:", res.data);

    // Lägg till inlägget direkt på profilsidan
    addPostToProfile(res.data);

    // Hämtar användarens id från localStorage
    const userId = load("userId");

    if (!userId) {
      console.error("User ID saknas, kan inte ladda profil-poster.");
      return;
    }

    // Hämta och visa användarens uppdaterade profilposter
    const userPosts = await loadProfilePosts(userId);
    console.log("Uppdaterade profilposter:", userPosts);

    const profilePosts = document.querySelector(".feed-posts");
    profilePosts.innerHTML = ""; // Rensa alla gamla inlägg
    userPosts.forEach((post) => addPostToProfile(post));
  } catch (error) {
    console.error("Fel vid skapande av inlägg:", error);
    throw error;
  }
}

// Sätta upp eventlyssnare för formuläret när sidan laddas
document.addEventListener("DOMContentLoaded", () => {
  const createPostForm = document.getElementById("createPostForm");

  console.log("Sätter upp eventlyssnare för formulär");

  createPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const postTitle = document.getElementById("postTitle").value;
    const postBody = document.getElementById("postBody").value;
    const postImage = document.getElementById("postImage").value;

    const postData = {
      title: postTitle,
      body: postBody,
      media: postImage ? { url: postImage } : null,
    };

    console.log("Skickar inlägg:", postData);

    try {
      await createPost(postData);
      console.log("Inlägg skapad framgångsrikt!");
    } catch (error) {
      console.error("Något gick fel vid skapande av inlägg:", error);
    }
  });
});
