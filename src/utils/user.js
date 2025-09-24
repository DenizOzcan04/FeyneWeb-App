const NAME_KEY = "feynetasks_profile_name";

export function getUserName() {
  return localStorage.getItem(NAME_KEY) || "Guest";
}

export function setUserName(name) {
  const value = name?.trim() || "Guest";
  localStorage.setItem(NAME_KEY, value);
  // Navbar'a haber ver
  window.dispatchEvent(new Event("profile:updated"));
  return value;
}
