import React, { useState } from "react";
import { ArrowRight, Check, Clipboard, Link2, Scissors, Sparkles } from "lucide-react";
import { shortenUrl } from "./api";

function isValidUrl(value) {
  try {
    const urlToTest = /^https?:\/\//i.test(value) ? value : `http://${value}`;
    const parsed = new URL(urlToTest);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);

    const trimmed = url.trim();

    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid web address.");
      return;
    }

    try {
      setLoading(true);
      const result = await shortenUrl(trimmed);
      setShortUrl(result.shortUrl);
    } catch (err) {
      setError(err.message || "Unable to shorten the URL.");
    } finally {
      setLoading(false);
    }
  }

  async function copyShortUrl() {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <nav className="nav">
        <div className="brand">
          <span className="brand-icon"><Scissors size={18} strokeWidth={2.5} /></span>
          <span>URL-Shortner</span>
        </div>
        <span className="nav-pill">Simple URL Shortener</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <Sparkles size={15} />
          Short links. Less clutter.
        </div>

        <h1>Make your links<br /><span>short & simple.</span></h1>

        <p className="subtitle">
          Paste a long URL below and get a clean, shareable short link in seconds.
        </p>

        <form className="shortener-card" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <Link2 size={21} className="input-icon" />
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste your long URL here..."
              type="text"
              aria-label="Long URL"
            />
            <button className="submit-btn" disabled={loading} type="submit">
              {loading ? "Shortening..." : "Enter"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {shortUrl && (
            <div className="result">
              <div className="result-label">
                <span className="success-dot"><Check size={13} /></span>
                Your shortened URL
              </div>
              <div className="result-row">
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
                <button type="button" className="copy-btn" onClick={copyShortUrl}>
                  {copied ? <Check size={17} /> : <Clipboard size={17} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="features">
          <div><span>01</span> Paste your URL</div>
          <div><span>02</span> Press Enter</div>
          <div><span>03</span> Share your short link</div>
        </div>
      </section>

      <footer>Built for fast, clean sharing.</footer>
    </main>
  );
}