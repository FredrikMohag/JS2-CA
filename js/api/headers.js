// headers.js
export function getFetchHeaders() {
  const authToken = localStorage.getItem("authToken"); // Hämtar autentiseringstoken från localStorage
  return {
    "Content-Type": "application/json",
    Authorization: authToken ? `Bearer ${authToken}` : "", // Om token finns, använd den
  };
}
