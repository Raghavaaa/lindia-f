import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalIndia.ai - AI-Powered Legal Assistant",
  description: "AI-powered legal assistance for Indian lawyers and legal professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-neutral-50">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}