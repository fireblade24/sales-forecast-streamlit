const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function api(path: string, method = "GET", body?: unknown) {
  const token = localStorage.getItem("idToken") || "dev-token";
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

export async function registerPush() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
  await Notification.requestPermission();
  await navigator.serviceWorker.register("/sw.js");
  return "demo-fcm-token";
}
