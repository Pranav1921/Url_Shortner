import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ENDPOINT = import.meta.env.VITE_SHORTEN_ENDPOINT || "/api/shorten";

export async function shortenUrl(url) {
  try {
    const response = await axios.post(`${API_URL}${ENDPOINT}`, {
      originalUrl: url,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

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
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Request failed while shortening URL";

    throw new Error(errorMessage);
  }
}