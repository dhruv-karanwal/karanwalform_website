import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://karanwalform-website.vercel.app"),
  title: "KaranwalGroup Form",
  description: "Official KaranwalGroup Registration Form",
  keywords: ["KaranwalGroup", "Form", "Registration", "Survey", "Bilingual Form", "पंजीकरण फॉर्म"],
  authors: [{ name: "KaranwalGroup" }],
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: "KaranwalGroup Form",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "KaranwalGroup Form",
    description: "Official KaranwalGroup Registration Form",
    url: "https://karanwalform-website.vercel.app",
    siteName: "KaranwalGroup Form",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KaranwalGroup Form Social Share Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KaranwalGroup Form",
    description: "Official KaranwalGroup Registration Form",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

