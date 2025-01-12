import { setAuthListener } from "../ui/listeners/auth.js";
import { loadFeedPosts } from "../api/posts/loadFeedPosts.js"; // Import för att ladda feed-poster
import { loadProfilePosts } from "../api/posts/loadProfilePosts.js"; // Import för att ladda profil-poster
import { getRandomAvatar, setDefaultAvatar } from "../ui/avatar.js"; // Import för avatarhantering
import { createPost } from "../api/posts/create.js"; // Import för att skapa inlägg (från create.js)

// Funktion för att visa alla poster i feeden
async function displayFeedPosts() {
  const feedPosts = document.querySelector(".feed-posts"); // Se till att detta finns i din feed.html
  feedPosts.innerHTML = ""; // Rensa tidigare poster

  console.log("Laddar feed-poster...");

  const posts = await loadFeedPosts();

  if (posts.length === 0) {
    feedPosts.innerHTML = "<p>No posts to display.</p>";
    console.log("Inga poster att visa i feeden.");
    return;
  }

  console.log("Hämtade poster från feed:", posts);

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("col-12", "col-md-4");
    postElement.innerHTML = `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        ${
          post.media?.url
            ? `<img src="${post.media.url}" alt="${
                post.media.alt || "Post image"
              }" class="img-fluid">`
            : ""
        }
      </div>
    `;
    feedPosts.appendChild(postElement);
  });

  console.log("Feed-poster har lagts till på sidan.");
}

// Funktion för att visa användarens egna poster på profil-sidan
async function displayProfilePosts() {
  const profilePosts = document.querySelector(".profile-posts");
  profilePosts.innerHTML = ""; // Rensa tidigare poster

  console.log("Laddar profil-poster...");

  const user = JSON.parse(localStorage.getItem("profile")); // Hämtar användaren från localStorage
  const userId = user?.name; // Eller använd ett specifikt ID här beroende på API-strukturen

  if (!userId) {
    console.error("Ingen användare är inloggad.");
    return;
  }

  const userPosts = await loadProfilePosts(userId); // Skicka användarens ID till funktionen

  if (userPosts.length === 0) {
    profilePosts.innerHTML = "<p>Inga poster att visa.</p>";
    console.log("Inga poster att visa på profil.");
    return;
  }

  console.log("Hämtade användarposter:", userPosts);

  userPosts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("col-12", "col-md-4");
    postElement.innerHTML = `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        ${
          post.media?.url
            ? `<img src="${post.media.url}" alt="${
                post.media.alt || "Post image"
              }" class="img-fluid">`
            : ""
        }
      </div>
    `;
    profilePosts.appendChild(postElement);
  });

  console.log("Profil-poster har lagts till på sidan.");
}

// Funktion för att visa användarens profilinformation
async function displayUserProfile() {
  const user = JSON.parse(localStorage.getItem("profile")); // Hämta användarens profil från localStorage
  const avatarElement = document.getElementById("avatar");

  console.log("Visar användarprofil...");

  if (user) {
    // Uppdatera profilinformationen med användardata
    console.log("Användarprofil funnen:", user);
    document.getElementById("username").textContent =
      user.name || "Namn inte tillgängligt";
    avatarElement.src = user.avatarUrl || (await getRandomAvatar()); // Standardbild eller slumpmässig bild
    document.getElementById("posts").textContent = `Posts: ${user.posts || 0}`;
    document.getElementById("followers").textContent = `Followers: ${
      user.followers || 0
    }`;
    document.getElementById("following").textContent = `Following: ${
      user.following || 0
    }`;
  } else {
    // Om ingen användardata finns, omdirigera till login-sidan
    alert("Du måste vara inloggad för att visa profilen.");
    console.log("Ingen användarprofil hittades, omdirigerar till login...");
    window.location.href = "/login.html";
  }
}

// Funktion för att hantera formuläret för att skapa ett nytt inlägg
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault(); // Förhindra att formuläret skickas normalt

  console.log("Formulär skickas för att skapa nytt inlägg...");

  const title = document.querySelector("#postTitle").value; // Hämtar titeln på inlägget
  const body = document.querySelector("#postBody").value; // Hämtar texten på inlägget
  const mediaUrl = document.querySelector("#postMediaUrl").value; // Hämtar media-URL om den finns
  const mediaAlt = document.querySelector("#postMediaAlt").value; // Hämtar media alt text om den finns

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

  // Skapa inlägg
  try {
    await createPost(postData); // Skapa inlägg via create.js
    console.log("Inlägg skapat framgångsrikt!");

    // Efter att inlägget skapats, ladda om feed och profilposter
    await displayFeedPosts();
    await displayProfilePosts();
  } catch (error) {
    console.error("Failed to create post:", error);
  }
});

// Kör funktionerna vid sidladdning
window.addEventListener("DOMContentLoaded", async () => {
  console.log("Sidan har laddats.");

  // Kontrollera vilken sida som är laddad och visa relevant innehåll
  if (document.querySelector(".feed-posts")) {
    console.log("Feed-sidan har laddats.");
    await displayFeedPosts(); // Visa feed-poster om feed-sidan är laddad
  }

  if (document.querySelector(".profile-posts")) {
    console.log("Profil-sidan har laddats.");
    await displayProfilePosts(); // Visa profil-poster om profil-sidan är laddad
  }

  if (document.getElementById("avatar")) {
    console.log("Användarprofil ska visas.");
    await displayUserProfile(); // Visa användarens profilinformation
    setDefaultAvatar(); // Sätt en standardavatar om ingen finns
  }
});

export async function homepage() {
  console.log("homepage funktionen är anropad!");
  setAuthListener();
}
