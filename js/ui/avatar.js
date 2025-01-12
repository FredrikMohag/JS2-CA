// js/ui/avatar.js

// Funktion för att hämta en slumpmässig bild på en katt eller hund
export async function getRandomAvatar() {
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

// Funktion för att sätta en avatar
export async function setDefaultAvatar() {
  const avatarElement = document.getElementById("avatar"); // Byt ut id med det aktuella elementet för avataren
  const avatarUrl = await getRandomAvatar();
  avatarElement.src = avatarUrl;
}
