import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عالمك الخاص ✨ | عيد ميلاد سعيد",
  description: "رحلة تفاعلية سينمائية ساحرة تم تصميمها خصيصاً للاحتفال بيومك المميز.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#080608",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-[#080608] text-ivory antialiased selection:bg-gold/20 selection:text-gold-light">
        {children}
      </body>
    </html>
  );
}
