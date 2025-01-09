import { authFetch } from "../fetch.js";
import { API_BASE, API_POSTS } from "../constants.js";

// Hämta sektionen för att visa inlägg
const profilePosts = document.querySelector(".profile-posts");

// Hämta och rendera alla poster
async function loadPosts() {
  try {
    const response = await authFetch(`${API_BASE}${API_POSTS}`);
    const { data } = await response.json();

    // Rensa nuvarande poster
    profilePosts.innerHTML = "";

    // Rendera varje inlägg
    data.forEach(addPostToProfile);
  } catch (error) {
    console.error("Failed to load posts:", error.message);
  }
}

// Lägg till ett inlägg till DOM
function addPostToProfile(post) {
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

  // Lägg till inlägget i början av sektionen
  profilePosts.insertAdjacentHTML("afterbegin", postHTML);
}

// Ladda poster när sidan laddas
document.addEventListener("DOMContentLoaded", loadPosts);
