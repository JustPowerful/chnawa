import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chnawa App",
  description: "Chnawa App. The best app for doing compte rendus faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <QueryProvider>
          <body className={`${inter.className} antialiased`}>
            {children}
            <Toaster position="top-center" />
          </body>
        </QueryProvider>
      </SessionProvider>
    </html>
  );
}
