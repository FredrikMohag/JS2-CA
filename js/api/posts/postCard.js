import { deletePost } from "../posts/delete.js";
import { updatePost } from "../posts/update.js";

/**
 * Creates HTML markup for a post.
 * @param {Object} post - The post object.
 * @param {string|number} post.id - The ID of the post.
 * @param {Object} [post.author] - Information about the author.
 * @param {string} [post.author.username] - Username of the author.
 * @param {string} [post.author.name] - Name of the author.
 * @param {string} [post.title] - Title of the post.
 * @param {string} [post.body] - Body/content of the post.
 * @param {Object} [post.media] - Optional media attached to the post.
 * @param {string} [post.media.url] - URL to the media.
 * @param {string} [post.media.alt] - Alt text for the media.
 * @returns {string} HTML markup for the post.
 */
export function createPostHTML(post) {
  const authorName = post?.author?.username || post?.author?.name || "Anonymous";

  return `
    <div class="col-12 col-md-4">
      <div class="post card" data-post-id="${post.id}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="author-name">${authorName}</span>
          <button class="btn btn-danger btn-sm delete-post" data-post-id="${post.id}">&times;</button>
        </div>
        ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || 'Image'}" class="card-img-top">` : ""}
        <div class="card-body">
          <h5 class="card-title">${post.title || "No title"}</h5>
          <p class="card-text">${post.body || "No content"}</p>
        </div>
        <div class="card-footer text-right">
          <button class="btn btn-primary btn-sm update-post" data-post-id="${post.id}">Update</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Adds a post's HTML to the DOM and sets up its buttons.
 * @param {string} postHTML - The post's HTML markup.
 * @param {string} profilePostsSelector - The CSS selector for the container element.
 */
export function addPostToDOM(postHTML, profilePostsSelector) {
  const profilePosts = document.querySelector(profilePostsSelector);
  if (!profilePosts) return;

  // Lägg till i slutet istället för början
  profilePosts.insertAdjacentHTML("beforeend", postHTML);

  const postId = postHTML.match(/data-post-id="([^"]+)"/)[1];
  setupDeleteButton(postId);
  setupUpdateButton(postId);
}



/**
 * Sets up the delete button functionality for a post.
 * @param {string} postId - The ID of the post.
 */
export function setupDeleteButton(postId) {
  const deleteButton = document.querySelector(`.delete-post[data-post-id="${postId}"]`);
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      try {
        await deletePost(postId);
        const postElement = deleteButton.closest(".col-12");
        if (postElement) {
          postElement.remove();
        }
      } catch (error) {
        // Handle deletion error (optional UI feedback could go here)
      }
    });
  }
}

/**
 * Sets up the update button functionality for a post.
 * @param {string} postId - The ID of the post.
 */
export function setupUpdateButton(postId) {
  const updateButton = document.querySelector(`.update-post[data-post-id="${postId}"]`);
  if (updateButton) {
    updateButton.addEventListener("click", async () => {
      try {
        const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
        const currentTitle = postElement.querySelector('.card-title').textContent;
        const currentBody = postElement.querySelector('.card-text').textContent;

        const modalHTML = `
          <div class="modal fade" id="updatePostModal" tabindex="-1" aria-labelledby="updatePostModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="updatePostModalLabel">Update Post</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form id="updatePostForm">
                    <div class="mb-3">
                      <label for="updatePostTitle" class="form-label">Post Title</label>
                      <input type="text" class="form-control" id="updatePostTitle" value="${currentTitle}" required />
                    </div>
                    <div class="mb-3">
                      <label for="updatePostBody" class="form-label">Post Content</label>
                      <textarea class="form-control" id="updatePostBody" rows="4" required>${currentBody}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Post</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        `;

        if (!document.getElementById('updatePostModal')) {
          document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const updatePostModal = new bootstrap.Modal(document.getElementById('updatePostModal'));
        updatePostModal.show();

        const modalElement = document.getElementById('updatePostModal');
        modalElement.addEventListener('hidden.bs.modal', () => {
          modalElement.remove();
        });

        const updatePostForm = document.getElementById('updatePostForm');
        updatePostForm.onsubmit = async (e) => {
          e.preventDefault();

          const newTitle = document.getElementById('updatePostTitle').value;
          const newBody = document.getElementById('updatePostBody').value;

          const updatedPostData = {
            id: postId,
            title: newTitle,
            body: newBody
          };

          const updatedPost = await updatePost(updatedPostData);

          postElement.querySelector('.card-title').textContent = updatedPost.title;
          postElement.querySelector('.card-text').textContent = updatedPost.body;

          updatePostModal.hide();
        };
      } catch (error) {
        // Handle update error (optional UI feedback could go here)
      }
    });
  }
}
