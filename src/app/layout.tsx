import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import HolyLoader from "holy-loader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Onborda, OnbordaProvider } from "onborda";
import { tourSteps } from "@/features/tour/steps";
import TourCard from "@/features/tour/card";
import QueryProvider from "@/contexts/queryProvider";

import React from "react";

const font = Lexend_Deca({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Docx App",
  description: "Document management system for HR's",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <QueryProvider>
          <OnbordaProvider>
            <Onborda
              steps={tourSteps}
              showOnborda={true}
              interact={true}
              shadowRgb="55,48,163"
              shadowOpacity="0.8"
              cardComponent={TourCard}
            >
              <NuqsAdapter>
                <Toaster />
                <HolyLoader
                  color="hsl(var(--primary))"
                  height={3}
                  speed={250}
                  easing="linear"
                  showSpinner={false}
                />
                <TooltipProvider>
                  {modal}
                  {children}
                </TooltipProvider>
              </NuqsAdapter>
            </Onborda>
          </OnbordaProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
