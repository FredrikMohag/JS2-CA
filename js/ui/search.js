import { API_BASE, API_KEY, API_POSTS } from "../api/constants.js";
import { fetchPosts } from "../api/fetch.js";
import { load } from "../storage/storage.js";

/**
 * Fetches all posts from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of posts.
 */
async function fetchAllPosts() {
  try {
    const posts = await fetchPosts(API_BASE + API_POSTS);
    return posts || []; // If undefined, return an empty array
  } catch (error) {
    return [];
  }
}

/**
 * Loads posts when the page loads.
 * This function does not display any posts as it is just fetching them for user search.
 */
async function loadPosts() {
  clearResults();  // Clear search results when the page loads
}

/**
 * Searches posts based on a query.
 * Filters posts based on the title or body containing the query.
 * @param {string} query The search query.
 */
async function searchPosts(query) {
  if (!query.trim()) {
    // If no search term is provided, clear results without showing "No posts found"
    clearResults();
    return;
  }

  try {
    // Use the API URL for searching posts with query as a parameter
    const searchUrl = `${API_BASE}/social/posts/search?q=${encodeURIComponent(query)}`;
    const posts = await fetchPosts(searchUrl);

    if (posts.length === 0) {
      displaySearchResults([]);  // If no posts are found, display "No posts found"
    } else {
      const filteredPosts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );

      displaySearchResults(filteredPosts.slice(0, 3)); // Display up to 3 results
    }
  } catch (error) {
    displaySearchResults([]); // If an error occurs, display no results
  }
}

/**
 * Clears the search results displayed on the page.
 */
function clearResults() {
  const resultsContainer = document.getElementById("search-results");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";  // Clear the content of search results
  }
}

/**
 * Displays the search results on the page.
 * @param {Array} posts The array of posts to display.
 */
function displaySearchResults(posts) {
  const resultsContainer = document.getElementById("search-results");
  if (!resultsContainer) {
    return;
  }

  // Clear old results before adding new ones
  resultsContainer.innerHTML = "";

  if (posts.length === 0) {
    resultsContainer.innerHTML = "<p>No posts found.</p>";  // Display message if no posts are found
    return;
  }

  posts.forEach((post) => {
    const postHTML = `
      <div class="post-card" style="border: 1px solid #ccc; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <h3 style="margin-bottom: 0.5rem;">${post.title}</h3>
        <p>${post.body}</p>
      </div>
    `;
    resultsContainer.insertAdjacentHTML("beforeend", postHTML);
  });
}

/**
 * Sets up listeners on the search input to trigger the search.
 */
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    clearResults();  // Clear results before doing a new search
    searchPosts(event.target.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      clearResults();  // Clear results before doing a new search
      searchPosts(event.target.value);
    }
  });
}

/**
 * Generates headers for each API request.
 * @returns {Object} The headers for the API request.
 */
export function headers() {
  const token = load("token"); // Get token from storage

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add Authorization header if token exists
    "X-Noroff-API-key": API_KEY, // Add Noroff API key
  };
}

/**
 * Clears search results when the page first loads.
 */
window.addEventListener('DOMContentLoaded', (event) => {
  clearResults();  // Clear all search results directly on load
});

/**
 * Loads all posts when the page loads (without displaying them).
 */
document.addEventListener("DOMContentLoaded", loadPosts);
