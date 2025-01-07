// Load data from localStorage
export function load(key) {
  return JSON.parse(localStorage.getItem(key));
}
