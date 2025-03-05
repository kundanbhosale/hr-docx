"use client";

import React, { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardBody } from "@/components/dashboard/body";
// import { parseAsStringEnum, useQueryState } from "nuqs";

export default function CompanyLayout({ children }: { children: ReactNode }) {
  // const [view, setView] = useQueryState(
  //   "view",
  //   parseAsStringEnum(["all", "recent", "saved", "downloaded"]).withDefault(
  //     "all"
  //   )
  // );
  // const navs = [
  //   {
  //     value: "all",
  //     label: "All Documents",
  //   },
  //   {
  //     value: "recent",
  //     label: "Recent",
  //   },
  //   {
  //     value: "favorites",
  //     label: "Favorites",
  //   },
  //   {
  //     value: "downloaded",

  //     label: "Downloaded",
  //   },
  // ];

  return (
    <>
      <DashboardHeader title="HR Templates" label="Page" />
      <DashboardBody>
        <div className="space-y-8">
          {/* <NavigationMenu>
            <NavigationMenuList className="bg-background text-muted-foreground inline-flex items-center justify-center gap-1 rounded-md border p-1">
              {navs.map((nav, i) => (
                <NavigationMenuItem key={i}>
                  <div
                    onClick={() => setView(nav.value as any)}
                    className="cursor-pointer"
                  >
                    <NavigationMenuLink
                      className={cn(
                        "ring-offset-background hover:bg-muted focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        view === nav.value &&
                          "text-primary-foreground bg-primary hover:bg-primary/80"
                      )}
                    >
                      {nav.label}
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu> */}
          {children}
        </div>
      </DashboardBody>
    </>
  );
}
