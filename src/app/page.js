import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Arc Mindless NFT | 5,555 Mindless Beings on ARC",
  description:
    "Arc Mindless NFT. 5,555 mindless beings coming to ARC. No thoughts. No plans. Just vibes. Whitelist open now.",
};

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
