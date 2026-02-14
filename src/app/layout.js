import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Meeting Action Items Tracker",
  description: "Extract and manage action items from meeting transcripts using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col bg-surface text-text-primary`}
      >
        <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-orange-accent">
              <span className="text-xl">⚡</span> ActionTracker
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-text-secondary transition-colors hover:text-orange-accent">
                Extract
              </Link>
              <Link href="/status" className="text-text-secondary transition-colors hover:text-orange-accent">
                Status
              </Link>
              <Link href="/history" className="rounded-lg bg-orange-accent px-4 py-2 font-semibold text-black transition-colors hover:bg-orange-hover">
                History
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto w-full max-w-5xl flex-grow px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
