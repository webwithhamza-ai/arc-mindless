"use client";

import { CONFIG } from "@/lib/config";

export default function ShareModal({ entry, onClose }) {
  const shareText = `I just secured my spot on the ${CONFIG.projectName} whitelist (#${entry.spotNumber}/${CONFIG.supply}) on ${CONFIG.chain}. 👹`;
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
        <h2 style={{ fontSize: "1.4rem" }}>SPREAD THE SCREAM</h2>
        <p className="card-lead">
          Let the tribe know you&apos;re in. One post helps more mindless souls find the mouth.
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
