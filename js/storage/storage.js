/**
 * Save data to localStorage or sessionStorage.
 * @param {string} key - The key under which the data will be stored.
 * @param {any} value - The data to be stored.
 * @param {boolean} [useSessionStorage=false] - Whether to use sessionStorage instead of localStorage.
 */
function save(key, value, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;

  try {
    // If value is not a string, attempt to convert it to JSON
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    storage.setItem(key, stringValue);
  } catch (error) {
    throw new Error(`Error saving ${key}: ${error.message}`);
  }
}

/**
 * Load data from localStorage or sessionStorage.
 * @param {string} key - The key of the data to retrieve.
 * @param {boolean} [useSessionStorage=false] - Whether to use sessionStorage instead of localStorage.
 * @returns {any} The retrieved data or null if not found.
 */
function load(key, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  const storedValue = storage.getItem(key);

  if (storedValue) {
    // Add exceptions for keys that are always strings
    if (["token", "username"].includes(key)) {
      return storedValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      return storedValue; // Return as plain string if JSON parsing fails
    }
  } else {
    return null;
  }
}

/**
 * Remove data from localStorage or sessionStorage.
 * @param {string} key - The key of the data to remove.
 * @param {boolean} [useSessionStorage=false] - Whether to use sessionStorage instead of localStorage.
 */
function remove(key, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.removeItem(key);
}

// Export functions
export { load, remove, save };
