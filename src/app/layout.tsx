import type { Metadata } from "next";
import "./ui/globals.css";
import { geistMono, geistSans } from "@/app/ui/fonts";
import UserStatusMonitor from "./ui/UserStatusMonitor";

export const metadata: Metadata = {
  title: {
    template: "%s | Finance Company Invoice Tracker",
    default: "Home | Finance Company Invoice Tracker",
  },
  description: "Seamlessly Generate, Track, and Manage Customer Invoices",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <UserStatusMonitor />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
