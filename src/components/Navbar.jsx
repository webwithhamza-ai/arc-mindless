"use client";

import Link from "next/link";
import { CONFIG } from "@/lib/config";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="navbar-brand">
        <span className="navbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art.png" alt="" aria-hidden="true" />
        </span>
        <span className="navbar-name">{CONFIG.projectName}</span>
      </Link>

      <nav className="navbar-links">
        <Link href="/sneak-peek">Sneak Peek</Link>
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/whitelist">Whitelist</Link>
      </nav>
      <button className="navbar-burger" aria-label="Menu" type="button">
        ☰
      </button>
    </header>
  );
}
