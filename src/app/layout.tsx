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
      <body className={`${inter.className} bg-gradient-to-br from-[#F0FAFA] via-white to-[#E6F7F5] text-slate-900 min-h-screen antialiased`}>
        <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#00C29A] flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg leading-none">R</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">Quant Analytics</span>
              </div>
              <div className="flex space-x-6">
                <a href="https://quant-options-builder.vercel.app/" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-[#00C29A] transition-colors">
                  Live Demo
                </a>
                <a href="https://github.com/Saksham-Gupta-GH" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-[#00C29A] transition-colors">
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
