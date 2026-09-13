"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/config";

const SCROLL_TRIGGER_PX = 24;

export default function Landing({ scene, onEnter }) {
  const zooming = scene === "zooming";
  const scrollRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (scene !== "landing") return;
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (triggeredRef.current) return;
      if (el.scrollTop > SCROLL_TRIGGER_PX) {
        triggeredRef.current = true;
        onEnter();
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scene, onEnter]);

  return (
    <div className={`landing-scroll ${zooming ? "zooming" : ""}`} ref={scrollRef}>
      <section className="landing-fold">
        {!zooming && (
          <div className="landing-copy">
            <h1 className="title">{CONFIG.projectName}</h1>
            <p className="subtitle">
              {CONFIG.supply} MINDLESS SOULS ON {CONFIG.chain}
            </p>
            <span className="scroll-hint" aria-hidden="true" />
          </div>
        )}

        <div className={`art-wrap ${zooming ? "zooming" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art.png" alt="The Arc Mindless creature" className="art-img" />
        </div>
      </section>

      {!zooming && <div className="landing-spacer" aria-hidden="true" />}

      {zooming && <div className="zoom-caption">AAAAAAAAAAAA</div>}
      {zooming && <div className="blackout" />}
    </div>
  );
}
