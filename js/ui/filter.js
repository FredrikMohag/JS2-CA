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
  feedPosts.innerHTML = ""; // Rensa

  if (posts.length === 0) {
    feedPosts.innerHTML = "<p>No posts found based on filter.</p>";
    return;
  }

  posts.forEach(post => {
    const postHTML = createPostHTML(post);
    addPostToDOM(postHTML, ".feed-posts");
  });
});
