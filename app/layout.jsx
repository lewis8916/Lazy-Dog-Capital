import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Lazy Dog Capital — Hard Money Lending Made Simple",
  description:
    "Fast, flexible private capital for real estate investors. Fix-and-flip, bridge, ground-up construction, and rental DSCR loans nationwide.",
  themeColor: "#21413A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
