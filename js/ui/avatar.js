// js/ui/avatar.js

// Function to fetch a random image of a cat or a dog
export async function getRandomAvatar() {
  try {
    // Randomly choose if you want a cat or a dog
    const isCat = Math.random() < 0.5; // 50% chance for either a cat or a dog
    let imageUrl = "";

    // Fetch image from the Cat API if it's a cat
    if (isCat) {
      const catResponse = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      );
      const catData = await catResponse.json();
      imageUrl = catData[0].url;
    }
    // Fetch image from the Dog API if it's a dog
    else {
      const dogResponse = await fetch(
        "https://api.thedogapi.com/v1/images/search"
      );
      const dogData = await dogResponse.json();
      imageUrl = dogData[0].url;
    }

    // Return the random image (cat or dog)
    return imageUrl;
  } catch (error) {
    console.error("Error fetching random image:", error);
    return "default-avatar.jpg"; // Return a default image if something goes wrong
  }
}

// Function to set an avatar
export async function setDefaultAvatar() {
  const avatarElement = document.getElementById("avatar"); // Replace with the actual element ID for the avatar
  const avatarUrl = await getRandomAvatar();
  avatarElement.src = avatarUrl;
}
