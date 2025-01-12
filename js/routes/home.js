import { setAuthListener } from "../ui/listeners/auth.js";
import { loadFeedPosts } from "../api/posts/loadFeedPosts.js";
import { loadProfilePosts } from "../api/posts/loadProfilePosts.js";
import { getRandomAvatar, setDefaultAvatar } from "../ui/avatar.js";
import { createPost } from "../api/posts/create.js";
import { createPostHTML, addPostToDOM } from "../api/posts/postCard.js"; // Importera funktioner från postCard.js

// Funktion för att visa alla poster i feeden
async function displayFeedPosts() {
  const feedPosts = document.querySelector(".feed-posts");
  feedPosts.innerHTML = ""; // Rensa tidigare poster

  console.log("Laddar feed-poster...");
  const posts = await loadFeedPosts();

  if (posts.length === 0) {
    feedPosts.innerHTML = "<p>No posts to display.</p>";
    console.log("Inga poster att visa i feeden.");
    return;
  }

  console.log("Hämtade poster från feed:", posts);

  // Använd postCard.js för att skapa och lägga till inlägg i DOM
  posts.forEach((post) => {
    const postHTML = createPostHTML(post); // Skapa HTML för inlägget
    addPostToDOM(postHTML, ".feed-posts"); // Lägg till inlägget i feed-sektionen
  });

  console.log("Feed-poster har lagts till på sidan.");
}

// Funktion för att visa användarens egna poster på profil-sidan
async function displayProfilePosts() {
  const profilePosts = document.querySelector(".profile-posts");
  profilePosts.innerHTML = ""; // Rensa tidigare poster

  console.log("Laddar profil-poster...");
  const user = JSON.parse(localStorage.getItem("profile")); // Hämta användarens profil från localStorage
  const userId = user?.name;

  if (!userId) {
    console.error("Ingen användare är inloggad.");
    return;
  }

  const userPosts = await loadProfilePosts(userId);

  if (userPosts.length === 0) {
    profilePosts.innerHTML = "<p>Inga poster att visa.</p>";
    console.log("Inga poster att visa på profil.");
    return;
  }

  console.log("Hämtade användarposter:", userPosts);

  // Använd postCard.js för att skapa och lägga till inlägg i DOM
  userPosts.forEach((post) => {
    const postHTML = createPostHTML(post); // Skapa HTML för inlägget
    addPostToDOM(postHTML, ".profile-posts"); // Lägg till inlägget i profil-sektionen
  });

  console.log("Profil-poster har lagts till på sidan.");
}

// Funktion för att visa användarens profilinformation
async function displayUserProfile() {
  const user = JSON.parse(localStorage.getItem("profile")); // Hämta användarens profil från localStorage
  const avatarElement = document.getElementById("avatar");

  console.log("Visar användarprofil...");

  if (user) {
    console.log("Användarprofil funnen:", user);
    document.getElementById("username").textContent =
      user.name || "Namn inte tillgängligt";
    avatarElement.src = user.avatarUrl || (await getRandomAvatar());
    document.getElementById("posts").textContent = `Posts: ${user.posts || 0}`;
    document.getElementById("followers").textContent = `Followers: ${
      user.followers || 0
    }`;
    document.getElementById("following").textContent = `Following: ${
      user.following || 0
    }`;
  } else {
    alert("Du måste vara inloggad för att visa profilen.");
    console.log("Ingen användarprofil hittades, omdirigerar till login...");
    window.location.href = "/login.html";
  }
}

// Funktion för att hantera formuläret för att skapa ett nytt inlägg
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Formulär skickas för att skapa nytt inlägg...");

  const title = document.querySelector("#postTitle").value;
  const body = document.querySelector("#postBody").value;
  const mediaUrl = document.querySelector("#postMediaUrl").value;
  const mediaAlt = document.querySelector("#postMediaAlt").value;

  const postData = {
    title,
    body,
    media: mediaUrl
      ? {
          url: mediaUrl,
          alt: mediaAlt || "Default alt text",
        }
      : null,
  };

  console.log("Data för inlägg:", postData);

  try {
    await createPost(postData);
    console.log("Inlägg skapat framgångsrikt!");
    await displayFeedPosts();
    await displayProfilePosts();
  } catch (error) {
    console.error("Failed to create post:", error);
  }
});

// Kör funktionerna vid sidladdning
window.addEventListener("DOMContentLoaded", async () => {
  console.log("Sidan har laddats.");

  if (document.querySelector(".feed-posts")) {
    console.log("Feed-sidan har laddats.");
    await displayFeedPosts();
  }

  if (document.querySelector(".profile-posts")) {
    console.log("Profil-sidan har laddats.");
    await displayProfilePosts();
  }

  if (document.getElementById("avatar")) {
    console.log("Användarprofil ska visas.");
    await displayUserProfile();
    setDefaultAvatar();
  }
});

export async function homepage() {
  console.log("homepage funktionen är anropad!");
  setAuthListener();
}
