"use client";

import { useState } from "react";
import Landing from "@/components/Landing";
import Tasks from "@/components/Tasks";
import Whitelisted from "@/components/Whitelisted";
import ConfirmSpot from "@/components/ConfirmSpot";
import Confirmed from "@/components/Confirmed";
import { playScream } from "@/lib/scream";
import { submitWhitelist, confirmSpot } from "@/lib/api";

const STORAGE_KEY = "arcMindlessEntry";

function loadEntry() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function cacheEntry(entry) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // ignore storage failures (private browsing, etc.)
  }
}

// scene: landing -> zooming -> tasks -> whitelisted -> confirmSpot -> confirmed
export default function Page() {
  const [scene, setScene] = useState("landing");
  const [entry, setEntry] = useState(loadEntry);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleEnter = () => {
    playScream();
    setScene("zooming");
    setTimeout(() => setScene("tasks"), 3000);
  };

  const handleTasksSubmit = async (data) => {
    setError("");
    setPending(true);
    try {
      const saved = await submitWhitelist(data);
      const next = { ...entry, ...data, ...saved };
      setEntry(next);
      cacheEntry(next);
      setScene("whitelisted");
    } catch (err) {
      setError(err.message || "Couldn't save your entry — try again.");
    } finally {
      setPending(false);
    }
  };

  const handleConfirmSpot = async (quoteLink) => {
    setError("");
    setPending(true);
    try {
      const saved = await confirmSpot({ evmAddress: entry.evmAddress, quoteLink });
      const next = { ...entry, quoteLink, ...saved };
      setEntry(next);
      cacheEntry(next);
      setScene("confirmed");
    } catch (err) {
      setError(err.message || "Couldn't confirm your spot — try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={`app scene-${scene}`}>
      {(scene === "landing" || scene === "zooming") && (
        <Landing scene={scene} onEnter={handleEnter} />
      )}

      {scene === "tasks" && (
        <Tasks onSubmit={handleTasksSubmit} initial={entry} pending={pending} error={error} />
      )}

      {scene === "whitelisted" && (
        <Whitelisted entry={entry} onNext={() => setScene("confirmSpot")} />
      )}

      {scene === "confirmSpot" && (
        <ConfirmSpot onSubmit={handleConfirmSpot} pending={pending} error={error} />
      )}

      {scene === "confirmed" && <Confirmed entry={entry} />}
    </div>
  );
}
