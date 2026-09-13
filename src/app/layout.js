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
  title: "ARC MINDLESS — WL",
  description: "Arc Mindless — 5555 mindless souls, coming to ARC. Get on the WL.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${patrickHand.variable} ${comicNeue.variable}`}>
      <body>{children}</body>
    </html>
  );
}
