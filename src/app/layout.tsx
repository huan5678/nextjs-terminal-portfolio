import type { Metadata } from "next";
import localFont from 'next/font/local';
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import "primeicons/primeicons.css";
import "@/styles/globals.css";
import MergedBackground from "@/app/components/MergedBackground";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
    <html lang="zh-tw">
      <body className={fusionPixel.variable}>
        <ThemeProvider>
          <MergedBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
