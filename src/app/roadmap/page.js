import Navbar from "@/components/Navbar";
import Roadmap from "@/components/Roadmap";

export const metadata = { title: "Roadmap — Arc Mindless" };

export default function RoadmapPage() {
  return (
    <div className="app">
      <Navbar />
      <Roadmap />
    </div>
  );
}
