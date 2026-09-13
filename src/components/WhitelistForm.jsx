"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";

const EVM_RE = /^0x[a-fA-F0-9]{40}$/;
const HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;
const MIN_MISSIONS = 2;

const FOLLOW_URL = CONFIG.twitterUrl;
const TWEET_URL = CONFIG.announcementTweetUrl;

function Mission({ label, url, opened, verified, onOpen, onVerify }) {
  return (
    <div className={`mission-row ${verified ? "mission-done" : ""}`}>
      <span className="mission-icon">𝕏</span>
      <span className="mission-info">
        <strong>{label}</strong>
        <span className="mission-url">{url}</span>
      </span>
      <span className="mission-actions">
        <a
          className="btn mission-open"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpen}
        >
          OPEN ↗
        </a>
        <button
          type="button"
          className={`btn mission-verify ${verified ? "done" : ""}`}
          disabled={!opened}
          onClick={onVerify}
        >
          {verified ? "VERIFIED ✓" : "VERIFY"}
        </button>
      </span>
    </div>
  );
}

export default function WhitelistForm({ onSubmit, initial, pending, error }) {
  const [username, setUsername] = useState(initial?.twitterUsername || "");
  const [evm, setEvm] = useState(initial?.evmAddress || "");
  const [touched, setTouched] = useState(false);

  const [followOpened, setFollowOpened] = useState(false);
  const [followed, setFollowed] = useState(!!initial?.followed);
  const [repostOpened, setRepostOpened] = useState(false);
  const [reposted, setReposted] = useState(!!initial?.reposted);
  const [likeOpened, setLikeOpened] = useState(false);
  const [liked, setLiked] = useState(!!initial?.liked);

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
            <h2>Tell us who you are</h2>
          </div>
        </div>

        <p className="card-lead" style={{ marginTop: "-0.9rem" }}>
          Two fields. Even you can manage this.
        </p>

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
            <h2>Do three easy things</h2>
          </div>
        </div>

        <p className="card-lead" style={{ marginTop: "-0.9rem" }}>
          Two out of three gets you in. We are not strict, we are mindless.
        </p>

        <Mission
          label={`Follow ${CONFIG.twitterHandle}`}
          url={FOLLOW_URL}
          opened={followOpened}
          verified={followed}
          onOpen={() => setFollowOpened(true)}
          onVerify={() => setFollowed(true)}
        />

        <Mission
          label="Retweet the announcement"
          url={TWEET_URL}
          opened={repostOpened}
          verified={reposted}
          onOpen={() => setRepostOpened(true)}
          onVerify={() => setReposted(true)}
        />

        <Mission
          label="Like the announcement"
          url={TWEET_URL}
          opened={likeOpened}
          verified={liked}
          onOpen={() => setLikeOpened(true)}
          onVerify={() => setLiked(true)}
        />

        <div className="progress-panel">
          <div className="progress-panel-head">
            <span>Progress</span>
            <strong>{missionCount}/3</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(missionCount / 3) * 100}%` }} />
          </div>
          <p className="progress-hint">Finish {MIN_MISSIONS} of 3 to submit.</p>
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "SUBMITTING…" : "SUBMIT AND STOP THINKING →"}
        </button>
        <p className="progress-hint">One wallet per person. Duplicates get removed.</p>
      </form>
    </section>
  );
}
