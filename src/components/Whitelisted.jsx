"use client";

import { CONFIG } from "@/lib/config";

export default function Whitelisted({ entry, onNext }) {
  const confettiPieces = Array.from({ length: 18 });

  return (
    <section className="scene" style={{ position: "relative" }}>
      <div className="confetti">
        {confettiPieces.map((_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 97) % 100}%`,
              animationDuration: `${3 + (i % 5)}s`,
              animationDelay: `${(i % 6) * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="card">
        <div className="big-stamp">YOU&apos;RE ON THE LIST.</div>

        <div className="spot-number">
          <span style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", color: "var(--muted)" }}>
            Your spot
          </span>
          <span className="num">
            #{entry.spotNumber} / {CONFIG.supply}
          </span>
        </div>

        <div className="summary-row">
          <span>X handle</span>
          <span>@{entry.twitterUsername}</span>
        </div>
        <div className="summary-row">
          <span>EVM address</span>
          <span>{entry.evmAddress}</span>
        </div>

        <p className="card-lead">Go do something else.</p>

        <button className="btn btn-primary btn-block" onClick={onNext}>
          CONFIRM MY SPOT →
        </button>
      </div>
    </section>
  );
}
