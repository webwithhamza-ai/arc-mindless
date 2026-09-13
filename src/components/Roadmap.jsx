"use client";

import { ROADMAP } from "@/lib/config";

export default function Roadmap() {
  return (
    <section className="section" id="roadmap">
      <div className="section-head">
        <span className="eyebrow">Roadmap</span>
        <h2 className="section-title">HOW THIS GOES</h2>
      </div>

      <div className="roadmap-list">
        {ROADMAP.map((step) => (
          <div className={`roadmap-item ${step.highlight ? "highlight" : ""}`} key={step.phase}>
            <span className="roadmap-phase">{step.phase}</span>
            <div className="roadmap-body">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
