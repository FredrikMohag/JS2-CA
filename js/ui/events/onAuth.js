import { login } from "../../api/auth/login.js";
import { register } from "../../api/auth/register.js";
import { save, load } from "../../storage/storage.js"; // Importera storage-funktionerna

export async function onAuth(event) {
  event.preventDefault();

  const name = event.target.name?.value || null; // Hantera fall där `name` inte används
  const email = event.target.email?.value;
  const password = event.target.password?.value;

  if (!email || !password) {
    console.error("Email och lösenord krävs!");
    return;
  }

  try {
    let user; // Deklarera en variabel för att hålla användardata

    if (event.submitter?.dataset.auth === "login") {
      console.log("Försöker logga in...");
      const loginResponse = await login(email, password);
      console.log("Login response:", loginResponse); // Logga svaret från login
      user = loginResponse; // Tilldela användarens profil
      console.log("Inloggning lyckades!");
    } else {
      console.log("Försöker registrera användare...");
      const userData = await register(name, email, password);
      console.log(`Användare registrerad: ${userData.data.name || "okänd"}`);

      // Automatiskt logga in användaren efter registrering
      console.log("Loggar in användare efter registrering...");
      const loginResponse = await login(email, password);
      console.log("Login response:", loginResponse); // Logga svaret från login
      user = loginResponse; // Tilldela användarens profil
      console.log("Registrering och inloggning lyckades!");
    }

    // Spara användarens ID från profilen
    const profile = load("profile"); // Hämta den sparade profilen
    if (profile && profile.name) {
      save("userId", profile.name); // Använd "name" som identifierare
      console.log("Sparat userId:", profile.name);
    } else {
      console.error("Kunde inte spara userId: profile är ogiltig.");
    }
  } catch (error) {
    console.error("Fel i onAuth:", error.message);
  }
}
