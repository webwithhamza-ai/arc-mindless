"use client";

import { SNEAK_PEEK_IMAGES, CONFIG } from "@/lib/config";

export default function SneakPeek() {
  return (
    <section className="section" id="sneak-peek">
      <div className="section-head">
        <span className="eyebrow">Sneak Peek</span>
        <h2 className="section-title">SOME OF THE TRIBE</h2>
        <p className="section-lead">
          A handful of the {CONFIG.supply} mindless souls, generated from the trait system.
          The rest stay hidden until reveal.
        </p>
      </div>

      <div className="gallery-grid">
        {SNEAK_PEEK_IMAGES.map((src) => (
          <div className="gallery-item" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Arc Mindless preview" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
