const THEME_KEY = "feynetasks_theme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  const root = document.documentElement; // <html>
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
export function initTheme() {
  setTheme(getTheme());
}
