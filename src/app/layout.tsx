import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quant Developer | Options Analytics",
  description: "Advanced options strategy builder and implied volatility surface visualizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8F9FA] text-[#202124] min-h-screen antialiased`}>
        <nav className="border-b border-[#DADCE0] bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center">
                  <span className="text-white font-medium text-lg leading-none">Q</span>
                </div>
                <span className="font-semibold text-xl tracking-tight text-[#202124] flex items-center">
                  Quant Analytics
                </span>
              </div>
              <div className="flex space-x-6">
                <a href="https://quant-options-builder.vercel.app/" target="_blank" rel="noreferrer" className="text-sm font-medium text-[#5F6368] hover:text-[#1A73E8] transition-colors">
                  Live Demo
                </a>
                <a href="https://github.com/Saksham-Gupta-GH" target="_blank" rel="noreferrer" className="text-sm font-medium text-[#5F6368] hover:text-[#1A73E8] transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
