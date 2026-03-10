import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Providers from "../components/providers"

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["800", "900"],
    variable: "--font-montserrat",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://zenovastrips.com"),
  title: "Zenova | Fast-Acting Energy Strips",
  description: "100mg of clean caffeine. Zero crash. Zero sugar. Try Zenova Strawberry Frost energy strips.",
  openGraph: {
    title: "Zenova | Fast-Acting Energy Strips",
    description: "100mg of clean caffeine. Zero crash. Zero sugar.",
    siteName: "Zenova",
    images: [{ url: "/herozenova.jpeg", width: 1200, height: 630, alt: "Zenova Energy Strips" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenova | Fast-Acting Energy Strips",
    description: "100mg of clean caffeine. Zero crash. Zero sugar.",
    images: ["/herozenova.jpeg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}