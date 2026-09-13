"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;
const MIN_MISSIONS = 2;

export default function WhitelistForm({ onSubmit, initial, pending, error }) {
  const [username, setUsername] = useState(initial?.twitterUsername || "");
  const [evm, setEvm] = useState(initial?.evmAddress || "");
  const [followed, setFollowed] = useState(!!initial?.followed);
  const [reposted, setReposted] = useState(!!initial?.reposted);
  const [liked, setLiked] = useState(!!initial?.liked);
  const [touched, setTouched] = useState(false);

  const usernameValid = HANDLE_RE.test(username.trim());
  const evmValid = EVM_RE.test(evm.trim());
  const missionCount = [followed, reposted, liked].filter(Boolean).length;
  const valid = usernameValid && evmValid && missionCount >= MIN_MISSIONS;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({
      twitterUsername: username.trim().replace(/^@/, ""),
      evmAddress: evm.trim(),
      followed,
      reposted,
      liked,
    });
  };

  return (
    <section className="section" id="whitelist">
      <form className="card" style={{ width: "min(92vw, 560px)" }} onSubmit={handleSubmit}>
        <div className="section-num">
          <span className="section-num-box">01</span>
          <div>
            <div className="section-num-label">Identity</div>
            <h2>Mark your signal</h2>
          </div>
        </div>

        <div className="field">
          <label htmlFor="username">X username</label>
          <input
            id="username"
            type="text"
            placeholder="@yourhandle"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {touched && !usernameValid && (
            <span className="error">Enter a valid X username</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="evm">{CONFIG.chain} / EVM wallet</label>
          <input
            id="evm"
            type="text"
            placeholder="0x..."
            value={evm}
            onChange={(e) => setEvm(e.target.value)}
          />
          {touched && !evmValid && (
            <span className="error">Enter a valid EVM address (0x + 40 hex chars)</span>
          )}
        </div>

        <div className="section-num">
          <span className="section-num-box">02</span>
          <div>
            <div className="section-num-label">Missions</div>
            <h2>Show up for the tribe</h2>
          </div>
        </div>

        <label className="mission-row">
          <span className="mission-icon">𝕏</span>
          <span className="mission-info">
            <strong>Follow {CONFIG.twitterHandle}</strong>
            <span>X // Required</span>
          </span>
          <a
            className="mission-open"
            href={`https://x.com/${CONFIG.twitterHandle.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN ↗
          </a>
          <input
            type="checkbox"
            className="mission-check"
            checked={followed}
            onChange={(e) => setFollowed(e.target.checked)}
          />
        </label>

        <label className="mission-row">
          <span className="mission-icon">𝕏</span>
          <span className="mission-info">
            <strong>Retweet the announcement</strong>
            <span>X // Required</span>
          </span>
          <a
            className="mission-open"
            href={CONFIG.announcementTweetUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN ↗
          </a>
          <input
            type="checkbox"
            className="mission-check"
            checked={reposted}
            onChange={(e) => setReposted(e.target.checked)}
          />
        </label>

        <label className="mission-row">
          <span className="mission-icon">𝕏</span>
          <span className="mission-info">
            <strong>Like the announcement</strong>
            <span>X // Required</span>
          </span>
          <a
            className="mission-open"
            href={CONFIG.announcementTweetUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPEN ↗
          </a>
          <input
            type="checkbox"
            className="mission-check"
            checked={liked}
            onChange={(e) => setLiked(e.target.checked)}
          />
        </label>

        <div className="progress-panel">
          <div className="progress-panel-head">
            <span>Ritual progress</span>
            <strong>{missionCount}/3</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(missionCount / 3) * 100}%` }} />
          </div>
          <p className="progress-hint">Complete at least {MIN_MISSIONS} missions to transmit.</p>
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "TRANSMITTING…" : "TRANSMIT APPLICATION →"}
        </button>
      </form>
    </section>
  );
}
