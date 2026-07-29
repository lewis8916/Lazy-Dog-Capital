import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Lazy Dog Capital — Fix & Flip Lending in Dallas–Fort Worth",
  description:
    "Short-term private capital for fix & flip investors in Dallas–Fort Worth. One loan covers purchase and rehab, with staged draws and no prepayment penalty. Run by operators with 800+ deals behind them.",
};

export const viewport = {
  themeColor: "#1E3C36",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Navbar />
        <main className="overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
