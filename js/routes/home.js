import { setAuthListener } from "../ui/listeners/auth.js";

export async function homepage() {
  console.log("homepage funktionen är anropad!");
  setAuthListener();
}
