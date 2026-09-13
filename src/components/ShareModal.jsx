"use client";

import { CONFIG } from "@/lib/config";

export default function ShareModal({ entry, onClose }) {
  const shareText = `I'm #${entry.spotNumber} of ${CONFIG.supply} on the Arc Mindless whitelist on ${CONFIG.chain}.`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
    CONFIG.announcementTweetUrl
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          CLOSE ✕
        </button>
        <span className="eyebrow" style={{ justifyContent: "center" }}>
          Spot Confirmed
        </span>
        <h2 style={{ fontSize: "1.4rem" }}>TELL SOMEONE</h2>
        <p className="card-lead">
          Let people know you&apos;re on the list. One post helps more people find this.
        </p>
        <a
          className="btn btn-primary btn-block"
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          SHARE ON X ↗
        </a>
      </div>
    </div>
  );
}
