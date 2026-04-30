import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/EchoUser005/fate-spectrum"),
  title: "Fate Spectrum · 命运光谱",
  description: "Turn birth charts into explainable multidimensional life spectra.",
  openGraph: {
    title: "Fate Spectrum · 命运光谱",
    description: "不是一个笼统总分，而是一组可解释的人生维度光谱。",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
