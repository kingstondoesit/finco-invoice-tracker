import type { Metadata } from "next";
import "./ui/globals.css";
import { geistMono, geistSans } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Seamlessly Generate, Track, and Manage Customer Invoices",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
