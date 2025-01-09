import { load } from "../storage/storage.js";
import { API_KEY } from "../api/constants.js";

export function headers() {
  const token = load("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-key": API_KEY,
  };
}

export async function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: headers(),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(JSON.stringify(err.errors, null, 2));
        });
      }

      return response;
    })
    .catch((error) => {
      throw error;
    });
}
