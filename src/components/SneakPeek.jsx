"use client";

import { SNEAK_PEEK_IMAGES, CONFIG } from "@/lib/config";

export default function SneakPeek() {
  return (
    <section className="section" id="sneak-peek">
      <div className="section-head">
        <span className="eyebrow">The Beings</span>
        <h2 className="section-title">THE BEINGS.</h2>
        <p className="section-lead">
          A few of them. There are {CONFIG.supply} more where these came from.
        </p>
      </div>

      <div className="gallery-grid">
        {SNEAK_PEEK_IMAGES.map((src) => (
          <div className="gallery-item" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Arc Mindless NFT preview" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
