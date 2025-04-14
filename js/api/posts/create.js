import { load } from "../../storage/storage.js";
import { API_BASE, API_POSTS } from "../constants.js";
import { authFetch } from "../fetch.js";
import { loadProfilePosts } from "./loadProfilePosts.js";
import {
  addPostToDOM,
  createPostHTML,
  setupDeleteButton,
  setupUpdateButton,
} from "./postCard.js";

/**
 * Adds a post to the user's profile section in the DOM.
 *
 * @param {Object} post - The post object to render.
 */
function addPostToProfile(post) {
  const postHTML = createPostHTML(post);
  addPostToDOM(postHTML, ".feed-posts");

  setupDeleteButton(post.id);
  setupUpdateButton(post.id);
}

/**
 * Creates a new post and updates the profile view with the new list of posts.
 *
 * @async
 * @param {Object} postData - Data for the new post including title, body, and media.
 * @returns {Promise<void>}
 * @throws {Error} Throws if the post creation fails.
 */
export async function createPost(postData) {
  const createPostURL = `${API_BASE}${API_POSTS}?_author=true&_media=true`;

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
      throw new Error(errorData.errors[0]?.message || "Something went wrong!");
    }

    const res = await response.json();
    addPostToProfile(res.data);

    const username = load("username");
    if (!username) {
      return;
    }

    const userPosts = await loadProfilePosts(username);
    const profilePosts = document.querySelector(".feed-posts");

    if (profilePosts) {
      profilePosts.innerHTML = "";
      userPosts.forEach((post) => addPostToProfile(post));
    }

    // Close the modal after successful post creation
    const modalElement = document.getElementById("makePostModal");
    const modal = bootstrap.Modal.getInstance(modalElement); // Get the existing modal instance
    modal.hide();  // This hides the modal after successful post creation

  } catch (error) {
    console.error(`Post creation failed: ${error.message}`);
    // Optional: show error to user in UI
  }
}

// Setup form event listener on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const createPostForm = document.getElementById("createPostForm");

  if (createPostForm) {
    createPostForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form from submitting normally

      const postTitle = document.getElementById("postTitle").value;
      const postBody = document.getElementById("postBody").value;
      const postImage = document.getElementById("postImage").value;

      const postData = {
        title: postTitle,
        body: postBody,
        media: postImage ? { url: postImage } : null,
      };

      try {
        await createPost(postData); // Call the createPost function to send the post data
      } catch (error) {
        // Optional: show error to user in UI
      }
    });
  }
});
