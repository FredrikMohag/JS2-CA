export function logout() {
  // Remove user data from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("username"); // This line seems redundant, consider removing it
  localStorage.removeItem("profile");

  // Redirect the user to the login page
  window.location.href = "/index.html";  // Change to your actual login page
}
