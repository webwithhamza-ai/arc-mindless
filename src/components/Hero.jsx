"use client";

import Link from "next/link";
import { CONFIG, BASE_IMAGES } from "@/lib/config";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Whitelist Open</span>
        <h1 className="title">
          MINDLESS COMING TO <span className="accent-line">ARC.</span>
        </h1>
        <p className="subtitle">
          {CONFIG.supply} mindless beings. They don&apos;t think. They don&apos;t plan. They
          just exist.
        </p>
        <Link href="/whitelist" className="btn btn-primary">
          GET ON THE LIST →
        </Link>
      </div>

      <span className="eyebrow">Six bases. One expression.</span>

      <div className="hero-bases">
        {BASE_IMAGES.map(({ src, color }) => (
          <div className="hero-base-item" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Arc Mindless NFT base, ${color}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
