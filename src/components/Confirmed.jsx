"use client";

import { useState } from "react";
import ShareModal from "@/components/ShareModal";
import { CONFIG } from "@/lib/config";

export default function Confirmed({ entry }) {
  const [showShare, setShowShare] = useState(true);

  return (
    <>
      <section className="scene">
        <div className="card">
          <div className="big-stamp">SPOT CONFIRMED ✅</div>
          <p className="card-lead">
            Welcome to the mindless {entry.spotNumber ? `#${entry.spotNumber}` : ""}.
            Follow {CONFIG.twitterHandle} for mint updates.
          </p>
          <div className="summary-row">
            <span>X handle</span>
            <span>@{entry.twitterUsername}</span>
          </div>
          <div className="summary-row">
            <span>EVM address</span>
            <span>{entry.evmAddress}</span>
          </div>
          <div className="summary-row">
            <span>Quote link</span>
            <span>{entry.quoteLink}</span>
          </div>

          <button className="btn btn-block" type="button" onClick={() => setShowShare(true)}>
            SHARE ON X ↗
          </button>
        </div>
      </section>

      {showShare && <ShareModal entry={entry} onClose={() => setShowShare(false)} />}
    </>
  );
}
