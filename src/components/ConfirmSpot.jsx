"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";

const TWEET_LINK_RE = /^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+/;

const quoteIntentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
  CONFIG.announcementTweetUrl
)}&text=${encodeURIComponent(`I'm mindless on ${CONFIG.chain}. ${CONFIG.projectName} 👹`)}`;

export default function ConfirmSpot({ onSubmit, pending, error }) {
  const [link, setLink] = useState("");
  const [touched, setTouched] = useState(false);

  const validationError = touched && !TWEET_LINK_RE.test(link.trim())
    ? "Paste a valid quote-tweet link (twitter.com/x.com/.../status/...)"
    : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!TWEET_LINK_RE.test(link.trim())) return;
    onSubmit(link.trim());
  };

  return (
    <section className="scene">
      <form className="card" onSubmit={handleSubmit}>
        <h2>CONFIRM YOUR SPOT</h2>
        <p className="card-lead">
          Quote the announcement post, then paste the link to your quote tweet below.
        </p>

        <a
          className="btn btn-block"
          href={quoteIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          QUOTE ON X ↗
        </a>

        <div className="field">
          <label htmlFor="quoteLink">Your quote tweet link</label>
          <input
            id="quoteLink"
            type="text"
            placeholder="https://x.com/you/status/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          {validationError && <span className="error">{validationError}</span>}
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "SAVING…" : "SUBMIT & LOCK IN SPOT"}
        </button>
      </form>
    </section>
  );
}
