"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;

export default function Tasks({ onSubmit, initial, pending, error }) {
  const [username, setUsername] = useState(initial?.twitterUsername || "");
  const [liked, setLiked] = useState(!!initial?.likedRetweeted);
  const [evm, setEvm] = useState(initial?.evmAddress || "");
  const [touched, setTouched] = useState(false);

  const usernameError = touched && !HANDLE_RE.test(username.trim())
    ? "Enter a valid X username (letters, numbers, underscore)"
    : "";
  const evmError = touched && !EVM_RE.test(evm.trim())
    ? "Enter a valid EVM address (0x + 40 hex chars)"
    : "";

  const valid = HANDLE_RE.test(username.trim()) && liked && EVM_RE.test(evm.trim());

  const doneCount = [HANDLE_RE.test(username.trim()), liked, EVM_RE.test(evm.trim())].filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({
      twitterUsername: username.trim().replace(/^@/, ""),
      likedRetweeted: true,
      evmAddress: evm.trim(),
    });
  };

  return (
    <section className="scene">
      <form className="card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2>PROVE YOU&apos;RE MINDLESS</h2>
          <span className="badge">{doneCount}/3</span>
        </div>
        <div className="step-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`step-dot ${i < doneCount ? "done" : ""}`} />
          ))}
        </div>

        <div className="task-block">
          <div className="task-title-row">
            <span className="task-num">1</span>
            <strong>Enter your X username</strong>
          </div>
          <div className="field">
            <input
              type="text"
              placeholder="@yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <span className="error">{usernameError}</span>}
          </div>
        </div>

        <div className="task-block">
          <div className="task-title-row">
            <span className="task-num">2</span>
            <strong>Like &amp; Retweet the post</strong>
          </div>
          <a
            className="btn btn-block"
            href={CONFIG.announcementTweetUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN POST ON X ↗
          </a>
          <label className="checkline">
            <input
              type="checkbox"
              checked={liked}
              onChange={(e) => setLiked(e.target.checked)}
            />
            I liked &amp; retweeted it
          </label>
        </div>

        <div className="task-block">
          <div className="task-title-row">
            <span className="task-num">3</span>
            <strong>Add your EVM address</strong>
          </div>
          <div className="field">
            <input
              type="text"
              placeholder="0x..."
              value={evm}
              onChange={(e) => setEvm(e.target.value)}
            />
            {evmError && <span className="error">{evmError}</span>}
          </div>
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "SAVING…" : "CLAIM MY WL SPOT"}
        </button>
      </form>
    </section>
  );
}
