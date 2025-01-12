// js/storage/storage.js

// Spara till localStorage eller sessionStorage
function save(key, value, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.setItem(key, JSON.stringify(value));
  console.log(`Saved ${key}:`, value);
}

// Läs från localStorage eller sessionStorage
function load(key, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  const storedValue = storage.getItem(key);

  if (storedValue) {
    return JSON.parse(storedValue);
  } else {
    return null;
  }
}

// Ta bort från localStorage eller sessionStorage
function remove(key, useSessionStorage = false) {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.removeItem(key);
  console.log(`Removed ${key}`);
}

// Exportera funktionerna
export { save, load, remove };
