import { loadPosts } from "./js/api/posts/loadPosts.js";

async function displayUserPosts() {
  const profilePosts = document.querySelector(".profile-posts");
  profilePosts.innerHTML = ""; // Rensa tidigare poster

  const userPosts = await loadPosts();

  if (userPosts.length === 0) {
    profilePosts.innerHTML = "<p>No posts to display.</p>";
    return;
  }

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
}

// Kör funktionen för att visa poster
displayUserPosts();

window.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("profile")); // Hämta användarens profil från localStorage

  const avatarElement = document.getElementById("avatar");

  if (user) {
    // Uppdatera profilinformationen med användardata
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
    window.location.href = "/login.html";
  }
});

// Funktion för att hämta en slumpmässig bild på en katt eller hund
async function getRandomAvatar() {
  try {
    // Välj slumpmässigt om du vill ha en katt eller hund
    const isCat = Math.random() < 0.5; // 50% chans för katt eller hund
    let imageUrl = "";

    // Hämta bild från Cat API om det är en katt
    if (isCat) {
      const catResponse = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      );
      const catData = await catResponse.json();
      imageUrl = catData[0].url;
    }
    // Hämta bild från Dog API om det är en hund
    else {
      const dogResponse = await fetch(
        "https://api.thedogapi.com/v1/images/search"
      );
      const dogData = await dogResponse.json();
      imageUrl = dogData[0].url;
    }

    // Återvänd den slumpmässiga bilden (katt eller hund)
    return imageUrl;
  } catch (error) {
    console.error("Fel vid hämtning av slumpmässig bild:", error);
    return "default-avatar.jpg"; // Returnera en standardbild om något går fel
  }
}

// Använd denna funktion för att sätta en bild på en profilavatar
async function setDefaultAvatar() {
  const avatarElement = document.getElementById("avatar"); // Byt ut id med det aktuella elementet för avataren
  const avatarUrl = await getRandomAvatar();
  avatarElement.src = avatarUrl;
}

// Anropa funktionen när sidan laddas
window.addEventListener("DOMContentLoaded", setDefaultAvatar);
