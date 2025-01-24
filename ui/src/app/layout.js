import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MinimizeButton from "./ui/MinimizeButton";
import CloseButton from "./ui/CloseButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Minimize button */}
        <div className="fixed top-0 right-0 flex items-center justify-center gap-1 px-2">
          <MinimizeButton />
          <CloseButton />
        </div>
        <main className="w-full p-1 h-screen bg-black bg-opacity-50 rounded-xl text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
