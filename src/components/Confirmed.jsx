"use client";

import { CONFIG } from "@/lib/config";

export default function Confirmed({ entry }) {
  return (
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
      </div>
    </section>
  );
}
