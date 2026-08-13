const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ENDPOINT = import.meta.env.VITE_SHORTEN_ENDPOINT || "/shorten";

export async function shortenUrl(url) {
  const response = await fetch(`${API_URL}${ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    // Keep the original HTTP error if the backend doesn't return JSON.
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed with status ${response.status}`
    );
  }

  // Supports common backend response names while keeping the API isolated
  // to this file. Once the teammate's exact response is confirmed, this
  // can be reduced to the exact field.
  const shortUrl =
    data.shortUrl ||
    data.shortURL ||
    data.short_url ||
    data.url ||
    data.shortenedUrl ||
    data.shortCode;

  if (!shortUrl) {
    throw new Error("The backend response did not contain a short URL.");
  }

  return {
    shortUrl: shortUrl.startsWith("http")
      ? shortUrl
      : `${API_URL.replace(/\/$/, "")}/${shortUrl.replace(/^\//, "")}`,
    raw: data,
  };
}