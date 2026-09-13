import { Patrick_Hand, Comic_Neue } from "next/font/google";
import "./globals.css";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Arc Mindless NFT | 5,555 Mindless Beings on ARC",
  description:
    "Arc Mindless NFT. 5,555 mindless beings coming to ARC. No thoughts. No plans. Just vibes. Whitelist open now.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${patrickHand.variable} ${comicNeue.variable}`}>
      <body>{children}</body>
    </html>
  );
}
