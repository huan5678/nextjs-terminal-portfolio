import MergedBackground from "./components/MergedBackground";
import type { Metadata } from "next";
import localFont from 'next/font/local';
import "../styles/globals.css";

const fusionPixel = localFont({
  src: '../../public/fonts/fusion-pixel-12px-monospaced-zh_hant.otf.woff2',
  display: 'swap',
  variable: '--font-fusion-pixel',
});

export const metadata: Metadata = {
  title: "SHR-HUAN-AI",
  description: "Next.js Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fusionPixel.variable}>
      <body className="relative z-10">
        <MergedBackground />
        {children}
      </body>
    </html>
  );
}
