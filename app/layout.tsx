import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://agri-export-compliance-ai.mainguyet130e31.chatgpt.site",
  ),
  title: "AgriExport Compliance AI",
  description:
    "Trợ lý tuân thủ xuất khẩu nông sản Việt Nam vào thị trường EU.",
  openGraph: {
    title: "AgriExport Compliance AI",
    description: "Xuất khẩu nông sản vào EU, rõ ràng hơn.",
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 907,
        alt: "AgriExport Compliance AI",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriExport Compliance AI",
    description: "Xuất khẩu nông sản vào EU, rõ ràng hơn.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${lora.variable}`}>
        {children}
      </body>
    </html>
  );
}
