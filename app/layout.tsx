import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Providers from "../components/providers"

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["800", "900"],
    variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Zenova | Fast-Acting Energy Strips",
  description: "100mg of clean caffeine. Zero crash. Zero sugar. Try Zenova Strawberry Frost energy strips.",
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