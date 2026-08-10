import type { Metadata } from "next";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoVolt Nexus | Solar Products in Kenya",
  description:
    "Shop solar panels, inverters, batteries, solar kits, water pumps, street lights and complete solar solutions in Kenya.",
  keywords: [
    "Solar Kenya",
    "Solar Panels",
    "Solar Inverters",
    "Lithium Batteries",
    "Solar Kits",
    "EcoVolt Nexus",
    "Renewable Energy",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16 lg:pb-0" suppressHydrationWarning>
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
