import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Babycon — Premium baby essentials, thoughtfully made",
    template: "%s | Babycon",
  },
  description: site.description,
  applicationName: "Babycon",
  keywords: [
    "premium baby clothes India",
    "muslin baby essentials",
    "newborn gifts",
    "baby girl dresses",
    "baby boy outfits",
    "baby blankets",
    "newborn combo sets",
    "babycon",
  ],
  authors: [{ name: "Babycon" }],
  creator: "Babycon",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: "Babycon",
    title: "Babycon — Premium baby essentials, thoughtfully made",
    description: site.description,
    images: [
      {
        url: "/images/banners/hero-1.jpg",
        width: 1200,
        height: 1200,
        alt: "Babycon premium baby essentials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Babycon — Premium baby essentials",
    description: site.description,
    images: ["/images/banners/hero-1.jpg"],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "shopping",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Babycon",
  description: site.description,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  image: `${site.url}/images/banners/hero-1.jpg`,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 12, Kutchery Road, Mylapore",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600004",
    addressCountry: "IN",
  },
  sameAs: [site.instagram, site.facebook],
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking, Cash on Delivery",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${jost.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
