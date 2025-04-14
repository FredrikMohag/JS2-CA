import { createPost } from "../api/posts/create.js";
import { loadFeedPosts } from "../api/posts/loadFeedPosts.js";
import { loadProfilePosts } from "../api/posts/loadProfilePosts.js";
import { addPostToDOM, createPostHTML } from "../api/posts/postCard.js";
import { getRandomAvatar, setDefaultAvatar } from "../ui/avatar.js";
import { setAuthListener } from "../ui/listeners/auth.js";
import { logout } from "../ui/logout.js";
import "../ui/search.js";

/**
 * Displays posts in the feed section.
 */
async function displayFeedPosts() {
  const feedPosts = document.querySelector(".feed-posts");
  feedPosts.innerHTML = ""; // Clear previous posts

  const posts = await loadFeedPosts();

  if (posts.length === 0) {
    feedPosts.innerHTML = "<p>No posts to display.</p>";
    return;
  }

  posts.forEach((post) => {
    const postHTML = createPostHTML(post);
    addPostToDOM(postHTML, ".feed-posts");
  });
}

/**
 * Displays the user's own posts on the profile page.
 */
async function displayProfilePosts() {
  const profilePosts = document.querySelector(".profile-posts");
  profilePosts.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("profile"));
  const username = user?.name;

  if (!username) {
    return;
  }

  const userPosts = await loadProfilePosts(username);

  if (userPosts.length === 0) {
    profilePosts.innerHTML = "<p>No posts to display.</p>";
    return;
  }

  userPosts.forEach((post) => {
    const postHTML = createPostHTML(post);
    addPostToDOM(postHTML, ".profile-posts");
  });
}

/**
 * Displays the user's profile information.
 */
async function displayUserProfile() {
  const user = JSON.parse(localStorage.getItem("profile"));
  const avatarElement = document.getElementById("avatar");

  if (user) {
    document.getElementById("username").textContent =
      user.name || "Name not available";
    avatarElement.src = user.avatarUrl || (await getRandomAvatar());
    document.getElementById("posts").textContent = `Posts: ${user.posts || 0}`;
    document.getElementById("followers").textContent = `Followers: ${user.followers || 0}`;
    document.getElementById("following").textContent = `Following: ${user.following || 0}`;
  } else {
    alert("You must be logged in to view the profile.");
    window.location.href = "/login.html";
  }
}

/**
 * Handles the form submission for creating a new post.
 */
document.getElementById("postForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

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

  try {
    await createPost(postData);
    await displayFeedPosts();
    await displayProfilePosts();
  } catch (error) {
    throw new Error("Failed to create post: " + error.message);
  }
});

/**
 * Handles the logout event.
 */
document.getElementById("logoutButton")?.addEventListener("click", () => {
  logout();
});

/**
 * Handles filtering posts from filter form.
 */
document.getElementById("filterForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const filterValue = document.getElementById("filterBy").value;
  let posts = await loadFeedPosts();

  switch (filterValue) {
    case "recent":
      posts.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case "oldest":
      posts.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case "hasMedia":
      posts = posts.filter(post => post.media?.url);
      break;
    case "noMedia":
      posts = posts.filter(post => !post.media?.url);
      break;
    default:
      break;
  }

  const feedPosts = document.querySelector(".feed-posts");
  feedPosts.innerHTML = "";

  if (posts.length === 0) {
    feedPosts.innerHTML = "<p>No posts found based on filter.</p>";
    return;
  }

  posts.forEach(post => {
    const postHTML = createPostHTML(post);
    addPostToDOM(postHTML, ".feed-posts");
  });
});

/**
 * Executes on page load.
 */
window.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".feed-posts")) {
    await displayFeedPosts();
  }

  if (document.querySelector(".profile-posts")) {
    await displayProfilePosts();
  }

  if (document.getElementById("avatar")) {
    await displayUserProfile();
    setDefaultAvatar();
  }
});

/**
 * Homepage function to set authentication listener.
 */
export async function homepage() {
  setAuthListener();
}
