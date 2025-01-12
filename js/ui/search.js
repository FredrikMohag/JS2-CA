import { API_BASE, API_POSTS } from "../api/constants.js"; // Importera API_URL från constants.js
import { fetchPosts } from "../api/fetch"; // Importera fetchPosts från fetch.js

// Funktion för att hämta alla poster
async function fetchAllPosts() {
  try {
    const posts = await fetchPosts(API_BASE, API_POSTS + "/posts");
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Funktion för att filtrera poster baserat på användarens sökning
async function searchPosts(query) {
  if (!query.trim()) {
    console.log("Empty search query");
    return;
  }

  try {
    const posts = await fetchAllPosts();
    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(filteredPosts);
  } catch (error) {
    console.error("Error during search:", error);
  }
}

// Funktion för att visa sökresultaten på sidan
function displaySearchResults(posts) {
  const resultsContainer = document.querySelector(".search-results");
  resultsContainer.innerHTML = ""; // Rensa gamla resultat

  if (posts.length === 0) {
    resultsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  posts.forEach((post) => {
    const postHTML = `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </div>
    `;
    resultsContainer.insertAdjacentHTML("beforeend", postHTML);
  });
}

// Eventlyssnare för sökinput
document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value;
  searchPosts(query);
});
