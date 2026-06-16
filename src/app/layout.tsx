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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0B1319] text-slate-200 min-h-screen antialiased`}>
        <nav className="border-b border-slate-800/60 bg-[#111A22] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-[#00C29A] flex items-center justify-center shadow-[0_0_15px_rgba(0,194,154,0.3)]">
                  <span className="text-[#0B1319] font-bold text-lg leading-none">R</span>
                </div>
                <span className="font-semibold text-xl tracking-tight text-white">Quant Analytics</span>
              </div>
              <div className="flex space-x-6">
                <a href="https://quant-options-builder.vercel.app/" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-300 hover:text-[#00C29A] transition-colors">
                  Live Demo
                </a>
                <a href="https://github.com/Saksham-Gupta-GH" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-300 hover:text-[#00C29A] transition-colors">
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
