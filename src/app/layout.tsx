import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import SessionProvider from "../components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legal India - AI for Indian Lawyers",
  description: "AI-powered legal assistance for Indian lawyers and legal professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-gray-900">
        <SessionProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
