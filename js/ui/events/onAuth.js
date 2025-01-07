import { login } from "../../api/auth/login.js";
import { register } from "../../api/auth/register.js";

// Definiera en asynkron funktion för autentisering
export async function onAuth(event) {
  event.preventDefault();

  const name = event.target.name?.value || null; // Hantera fall där `name` inte används
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    if (event.submitter.dataset.auth === "login") {
      console.log("Försöker logga in...");
      await login(email, password);
      console.log("onAuth körs för login!");
    } else {
      console.log("Försöker registrera användare...");
      const userData = await register(name, email, password);
      console.log(
        `Användare registrerad: ${userData.name || userData.id || "okänd"}`
      );

      // Automatiskt inloggning efter registrering
      console.log("Loggar in användare efter registrering...");
      await login(email, password);
      console.log("onAuth körs för register!");
    }
  } catch (error) {
    console.error("Fel i onAuth:", error.message);
  }
}
