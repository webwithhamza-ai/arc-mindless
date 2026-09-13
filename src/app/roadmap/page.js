import Navbar from "@/components/Navbar";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Roadmap | Arc Mindless NFT",
  description:
    "The Arc Mindless NFT roadmap. Whitelist, mint, holder utilities and $MINDLESS on ARC.",
};

export default function RoadmapPage() {
  return (
    <div className="app">
      <Navbar />
      <Roadmap />
      <Footer />
    </div>
  );
}
