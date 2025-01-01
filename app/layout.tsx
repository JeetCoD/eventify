import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Plus_Jakarta_Sans",
});

export const metadata: Metadata = {
  title: "Eventify",
  description: "Onestop app for event management",
  icons: {
    icon: "/assets/images/favicon.ico", //custom path for the icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
