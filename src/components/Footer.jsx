"use client";

import { CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href={CONFIG.twitterUrl} target="_blank" rel="noopener noreferrer">
          x.com/ArcMindless
        </a>
        <a href={CONFIG.announcementTweetUrl} target="_blank" rel="noopener noreferrer">
          View announcement ↗
        </a>
        <span className="footer-link-disabled" aria-disabled="true" title="Coming after mint">
          OpenSea (soon)
        </span>
      </div>
      <p className="footer-copy">
        Arc Mindless. {CONFIG.supply} mindless beings on {CONFIG.chain}.
      </p>
    </footer>
  );
}
