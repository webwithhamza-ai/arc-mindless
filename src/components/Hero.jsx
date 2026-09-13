"use client";

import Link from "next/link";
import { CONFIG } from "@/lib/config";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">WHITELIST // PHASE 01</span>
        <h1 className="title">
          PROVE YOU&apos;RE
          <span className="accent-line">NOT MINDLESS.</span>
        </h1>
        <p className="subtitle">
          {CONFIG.supply} mindless souls on {CONFIG.chain}. One wallet, three moves, your shot
          at the world before the gates open.
        </p>
        <Link href="/whitelist" className="btn btn-primary">
          ENTER WHITELIST →
        </Link>
      </div>

      <div className="hero-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art.png" alt="The Arc Mindless creature" />
      </div>
    </section>
  );
}
