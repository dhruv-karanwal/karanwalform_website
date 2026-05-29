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
  metadataBase: new URL("https://karnwalform-website.vercel.app"),
  title: "KarnwalGroup Form",
  description: "Official KarnwalGroup Registration Form",
  keywords: ["KarnwalGroup", "Form", "Registration", "Survey", "Bilingual Form", "पंजीकरण फॉर्म"],
  authors: [{ name: "KarnwalGroup" }],
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: "KarnwalGroup Form",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "KarnwalGroup Form",
    description: "Official KarnwalGroup Registration Form",
    url: "https://karnwalform-website.vercel.app",
    siteName: "KarnwalGroup Form",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KarnwalGroup Form Social Share Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KarnwalGroup Form",
    description: "Official KarnwalGroup Registration Form",
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

