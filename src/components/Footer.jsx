"use client";

import { CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-copy">
        Arc Mindless. {CONFIG.supply} mindless beings on {CONFIG.chain}.
      </p>
      <div className="footer-links">
        <a href={CONFIG.twitterUrl} target="_blank" rel="noopener noreferrer">
          x.com/ArcMindless
        </a>
        <span className="footer-link-disabled" aria-disabled="true" title="Coming after mint">
          OpenSea (soon)
        </span>
      </div>
    </footer>
  );
}
