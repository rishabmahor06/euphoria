// Shared API helpers. Set VITE_API_URL if the server is not on localhost:5000.
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};
export const getRole = () => {
  try {
    return localStorage.getItem("role") || "";
  } catch {
    return "";
  }
};
export const logout = () => {
  ["token", "loggedInUser", "role"].forEach((k) => localStorage.removeItem(k));
};

// api("/api/x", { method, body, auth }) -> parsed JSON, throws Error(message)
export const api = async (path, { method = "GET", body, auth = false, form } = {}) => {
  const headers = {};
  if (auth) headers.Authorization = getToken();
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(API + path, { method, headers, body: payload });
  } catch {
    throw new Error("Could not reach the server. Is it running?");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error?.details?.[0]?.message || json.message || `Request failed (${res.status})`);
  }
  return json;
};
