import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "../Components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dora",
  description:
    "Explore articles, their backlinks, similar articles, and get summaries for them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
