import { authFetch } from "../fetch.js";
import { API_BASE, API_POSTS } from "../constants.js";
import { load } from "../../storage/storage.js"; // Lägg till denna rad
import { loadProfilePosts } from "./loadProfilePosts.js"; // Importera den funktion som hämtar profil-poster

// Lägg till ett inlägg till DOM
function addPostToProfile(post) {
  console.log("addPostToProfile körs, inlägg:", post); // Lägg till en logg för att se när inlägget läggs till

  const profilePosts = document.querySelector(".profile-posts");
  const postHTML = `
    <div class="col-12 col-md-4">
      <div class="post card">
        ${
          post.media && post.media.url
            ? `<img src="${post.media.url}" alt="${post.media.alt}" class="card-img-top">`
            : ""
        }
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
        </div>
      </div>
    </div>
  `;

  // Logga när vi försöker lägga till i DOM
  console.log("Lägger till inlägg i DOM");

  // Lägg till inlägget i början av sektionen
  profilePosts.insertAdjacentHTML("afterbegin", postHTML);
  console.log("Inlägg tillagt på profilsidan."); // Logga när inlägget har lagts till
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
    const userId = load("userId"); // Hämtar användarens ID från localStorage

    if (!userId) {
      console.error("User ID saknas, kan inte ladda profil-poster.");
      return;
    }

    // Hämta och visa användarens uppdaterade profilposter
    const userPosts = await loadProfilePosts(userId);
    console.log("Uppdaterade profilposter:", userPosts); // Lägg till logg för att visa vad som hämtas

    if (userPosts.length === 0) {
      console.log("Inga poster att visa på profil.");
    }

    // Om du vill uppdatera DOM här för att visa användarens senaste inlägg:
    const profilePosts = document.querySelector(".profile-posts");
    profilePosts.innerHTML = ""; // Rensa alla gamla inlägg
    userPosts.forEach((post) => addPostToProfile(post)); // Lägg till alla användarens poster
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
    event.preventDefault(); // Förhindra standardbeteendet (omformulär)

    // Hämta värden från formulärfälten
    const postTitle = document.getElementById("postTitle").value;
    const postBody = document.getElementById("postBody").value;
    const postImage = document.getElementById("postImage").value;

    // Logga värdena innan vi skapar inlägget
    console.log("Inlämnat formulär med följande värden:", {
      title: postTitle,
      body: postBody,
      media: postImage,
    });

    // Skapa ett objekt med inläggsdata
    const postData = {
      title: postTitle,
      body: postBody,
      media: postImage ? { url: postImage } : null, // Om en bild-URL är angiven, inkludera den
    };

    console.log("Skickar inlägg:", postData); // Logga den data som skickas

    // Anropa createPost-funktionen för att skapa inlägget
    try {
      await createPost(postData); // Vänta på att inlägget ska skapas
      console.log("Inlägg skapad framgångsrikt!"); // Logga när inlägget har skapats framgångsrikt
    } catch (error) {
      console.error("Något gick fel vid skapande av inlägg:", error);
    }
  });
});
