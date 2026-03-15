import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Providers from "../components/providers"
import { Analytics } from "@vercel/analytics/next"

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
  icons: {
    icon: "/icon.png",
  },
  title: "Zenova | Fast-Acting Energy Strips",
  description: "Your wellness routine, simplified. Zenova's sublingual strips deliver clean energy, better sleep, and beauty nutrients faster than any pill or drink.",
  verification: {
    google: "yB8bR1ZxfoW-oe5htiB0CjD8SH-QSAFc-MB12TEAfsc",
  },
  openGraph: {
    title: "Zenova | Fast-Acting Energy Strips",
    description: "Your wellness routine, simplified. Zenova's sublingual strips deliver clean energy, better sleep, and beauty nutrients faster than any pill or drink.",
    siteName: "Zenova",
    images: [{ url: "/OGphoto.jpeg", width: 1200, height: 630, alt: "Zenova Energy Strips" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenova | Fast-Acting Energy Strips",
    description: "Your wellness routine, simplified. Zenova's sublingual strips deliver clean energy, better sleep, and beauty nutrients faster than any pill or drink.",
    images: ["/OGphoto.jpeg"],
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
        <Analytics />
      </body>
    </html>
  )
}