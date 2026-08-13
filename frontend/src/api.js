import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ENDPOINT = import.meta.env.VITE_SHORTEN_ENDPOINT || "/api/shorten";

export async function shortenUrl(url) {
  try {
    // Strip trailing slash from API_URL and leading slash from ENDPOINT to construct a clean URL
    const cleanApiUrl = API_URL.replace(/\/$/, "");
    const cleanEndpoint = ENDPOINT.replace(/^\//, "");

    const response = await axios.post(`${cleanApiUrl}/${cleanEndpoint}`, {
      originalUrl: url,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    // Check all possible return keys from backend
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
        : `${cleanApiUrl}/${shortUrl.replace(/^\//, "")}`,
      raw: data,
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Request failed while shortening URL";

    throw new Error(errorMessage);
  }
}