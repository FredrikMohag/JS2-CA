// Save data to localStorage
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
