import Navbar from "@/components/Navbar";
import SneakPeek from "@/components/SneakPeek";

export const metadata = { title: "Sneak Peek — Arc Mindless" };

export default function SneakPeekPage() {
  return (
    <div className="app">
      <Navbar />
      <SneakPeek />
    </div>
  );
}
