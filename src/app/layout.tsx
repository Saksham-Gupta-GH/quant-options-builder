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
      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen antialiased`}>
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">Quant Analytics</span>
              </div>
              <div className="flex space-x-4">
                <a href="https://github.com/Saksham-Gupta-GH" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
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
