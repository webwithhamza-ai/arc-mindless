import Navbar from "@/components/Navbar";
import SneakPeek from "@/components/SneakPeek";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The Beings | Arc Mindless NFT",
  description: "A first look at the Arc Mindless NFT collection. 5,555 mindless beings on ARC.",
};

export default function SneakPeekPage() {
  return (
    <div className="app">
      <Navbar />
      <SneakPeek />
      <Footer />
    </div>
  );
}
