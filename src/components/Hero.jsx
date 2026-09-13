"use client";

import Link from "next/link";
import { CONFIG, BASE_IMAGES } from "@/lib/config";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Whitelist Open</span>
        <h1 className="title">
          COMING TO
          <span className="accent-line">ARC.</span>
        </h1>
        <p className="subtitle">
          {CONFIG.supply} mindless souls. One wallet, three moves, your shot at the world
          before the gates open.
        </p>
        <div className="hero-links">
          <a href={CONFIG.twitterUrl} target="_blank" rel="noopener noreferrer">
            x.com/ArcMindless
          </a>
          <a href={CONFIG.announcementTweetUrl} target="_blank" rel="noopener noreferrer">
            View announcement ↗
          </a>
        </div>
        <Link href="/whitelist" className="btn btn-primary">
          ENTER WHITELIST →
        </Link>
      </div>

      <div className="hero-bases">
        {BASE_IMAGES.map((src) => (
          <div className="hero-base-item" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Arc Mindless base" />
          </div>
        ))}
      </div>
    </section>
  );
}
