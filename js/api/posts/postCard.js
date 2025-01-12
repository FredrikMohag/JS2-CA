import { deletePost } from "../posts/delete.js"; // Importera delete-funktionen
import { updatePost } from "../posts/update.js"; // Importera update-funktionen

export function createPostHTML(post) {
  // Kontrollera om post.author finns och använd det riktiga användarnamnet
  const authorName =
    post.author && post.author.name ? post.author.name : "Anonym";

  return `
    <div class="col-12 col-md-4">
      <div class="post card">
        <!-- Användarens namn överst till vänster -->
        <div class="card-header d-flex justify-content-between align-items-center">
          <span class="author-name">${authorName}</span>
          <!-- Kryss för att radera inlägg -->
          <button class="btn btn-danger btn-sm delete-post" data-post-id="${
            post.id
          }">&times;</button>
        </div>

        <!-- Postens media, t.ex. bild -->
        ${
          post.media && post.media.url
            ? `<img src="${post.media.url}" alt="${
                post.media.alt || "Bild"
              }" class="card-img-top">`
            : ""
        }

        <!-- Postens titel och innehåll -->
        <div class="card-body">
          <h5 class="card-title">${post.title || "Ingen titel"}</h5>
          <p class="card-text">${post.body || "Inget innehåll"}</p>
        </div>

        <!-- Uppdatera-knapp längst ner -->
        <div class="card-footer text-right">
          <button class="btn btn-primary btn-sm update-post" data-post-id="${
            post.id
          }">Update</button>
        </div>
      </div>
    </div>
  `;
}

// Lägger till ett inlägg i DOM
export function addPostToDOM(postHTML, profilePostsSelector) {
  const profilePosts = document.querySelector(profilePostsSelector);
  if (!profilePosts) {
    console.error(
      `Ingen DOM-element hittad för selektorn ${profilePostsSelector}`
    );
    return;
  }

  profilePosts.insertAdjacentHTML("afterbegin", postHTML);
}

// Funktion för att sätta upp eventlyssnare för radera-knappen
export function setupDeleteButton(postId) {
  const deleteButton = document.querySelector(
    `.delete-post[data-post-id="${postId}"]`
  );
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      try {
        console.log(`Försöker radera inlägg med ID: ${postId}`);
        await deletePost(postId); // Använd deletePost-funktionen
        const postElement = deleteButton.closest(".col-12");
        if (postElement) {
          postElement.remove();
          console.log(`Inlägg med ID: ${postId} raderat.`);
        }
      } catch (error) {
        console.error("Fel vid radering av inlägg:", error);
      }
    });
  }
}

// Funktion för att sätta upp eventlyssnare för uppdatera-knappen
export function setupUpdateButton(postId) {
  const updateButton = document.querySelector(
    `.update-post[data-post-id="${postId}"]`
  );
  if (updateButton) {
    updateButton.addEventListener("click", async () => {
      try {
        console.log(`Försöker uppdatera inlägg med ID: ${postId}`);
        // Du kan lägga till en modal eller input-fält för uppdatering
        const newTitle = prompt("Ange ny titel:");
        const newBody = prompt("Ange nytt innehåll:");
        if (newTitle || newBody) {
          const updatedPost = await updatePost(postId, {
            title: newTitle || undefined,
            body: newBody || undefined,
          });
          console.log("Inlägg uppdaterat:", updatedPost);
          location.reload(); // Ladda om sidan för att visa den uppdaterade posten
        }
      } catch (error) {
        console.error("Fel vid uppdatering av inlägg:", error);
      }
    });
  }
}
