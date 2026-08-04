import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL = "https://lazydogcapital.com";
const TITLE = "Lazy Dog Capital — Fix & Flip Lending in Dallas–Fort Worth";
const DESCRIPTION =
  "Short-term private capital for fix & flip investors in Dallas–Fort Worth. One loan covers purchase and rehab, with rehab draws reimbursed as work completes and no prepayment penalty. Run by operators with 800+ deals behind them.";

export const metadata = {
  // Required for Open Graph image URLs to resolve to absolute paths.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Lazy Dog Capital",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Lazy Dog Capital",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Lazy Dog Capital",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
