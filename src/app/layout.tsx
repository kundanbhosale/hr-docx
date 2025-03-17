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
import { getIsSsrMobile } from "@/lib/isMobile";
import ErrorPage from "@/components/pages/error";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
// import { CSPostHogProvider } from "@/contexts/posthog";

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
  const isMobile = getIsSsrMobile();

  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <GoogleAnalytics gaId="G-J6LNP87J9V" />
        {/* <CSPostHogProvider> */}
        {isMobile ? (
          <div className="h-screen flex">
            <ErrorPage
              title="Unsupported view"
              message="Dashboard is only available for desktop screens."
              noReset
              actionBtn={
                <Link
                  href={"https://www.hrdocx.com"}
                  title="HR Docx"
                  className={cn(buttonVariants())}
                >
                  Back to website
                </Link>
              }
            />
          </div>
        ) : (
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
        )}
        {/* </CSPostHogProvider> */}
      </body>
    </html>
  );
}
