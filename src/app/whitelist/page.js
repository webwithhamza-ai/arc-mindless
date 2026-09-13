"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import WhitelistForm from "@/components/WhitelistForm";
import Whitelisted from "@/components/Whitelisted";
import ConfirmSpot from "@/components/ConfirmSpot";
import Confirmed from "@/components/Confirmed";
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

// step: form -> whitelisted -> confirmSpot -> confirmed
export default function WhitelistPage() {
  const [step, setStep] = useState("form");
  const [entry, setEntry] = useState(loadEntry);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleFormSubmit = async (data) => {
    setError("");
    setPending(true);
    try {
      const saved = await submitWhitelist(data);
      const next = { ...entry, ...data, ...saved };
      setEntry(next);
      cacheEntry(next);
      setStep("whitelisted");
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
      setStep("confirmed");
    } catch (err) {
      setError(err.message || "Couldn't confirm your spot — try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="app">
      <Navbar />

      {step === "form" && (
        <WhitelistForm onSubmit={handleFormSubmit} initial={entry} pending={pending} error={error} />
      )}

      {step === "whitelisted" && (
        <Whitelisted entry={entry} onNext={() => setStep("confirmSpot")} />
      )}

      {step === "confirmSpot" && (
        <ConfirmSpot onSubmit={handleConfirmSpot} pending={pending} error={error} />
      )}

      {step === "confirmed" && <Confirmed entry={entry} />}
    </div>
  );
}
