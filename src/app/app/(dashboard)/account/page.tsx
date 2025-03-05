"use client";

import React from "react";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardBody } from "@/components/dashboard/body";
import { parseAsStringEnum, useQueryState } from "nuqs";
import General from "./general";
import SubscriptionInfo from "./subscription";
import { authClient } from "@/features/auth/client";
import Image from "next/image";
import { format } from "date-fns";
import Team from "./team";

export default function CompanyLayout() {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum([
      "general",
      "subscription",
      "team",
      "security",
    ]).withDefault("general")
  );

  const { data, isPending } = authClient.useSession();

  const user = data?.user;

  const navs = [
    {
      value: "general",
      label: "General Info",
    },

    {
      value: "subscription",
      label: "Subscription",
    },
    {
      value: "team",
      label: "Team",
    },
  ];

  return (
    <>
      <DashboardHeader title="My Profile" label="Page" />
      <DashboardBody>
        <div className="space-y-8">
          <NavigationMenu>
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
          </NavigationMenu>
          <div className="grid grid-cols-[300px,auto] gap-8">
            {isPending ? (
              <div className="h-full w-full bg-muted"></div>
            ) : (
              <div>
                <Image
                  src={
                    user?.image?.replace("s96", "s800") ||
                    `https://api.dicebear.com/9.x/initials/png?size=300&seed=${user?.name.replaceAll(
                      " ",
                      "_"
                    )}` ||
                    ""
                  }
                  alt={user?.name || ""}
                  width={300}
                  height={300}
                  className="border rounded-md drop-shadow-lg"
                />
                <div className="grid grid-cols-[75px,auto] my-5 gap-5 [&_p]:text-wrap [&_p]:block [&_p]:truncate text-sm">
                  <p className="font-semibold">Name</p>
                  <p>{user?.name}</p>
                  <p className="font-semibold">Email</p>
                  <p>{user?.email}</p>
                  <p className="font-semibold">ID</p>
                  <p>{user?.id}</p>
                  <p className="font-semibold">Joined On</p>
                  <p>
                    {(user?.createdAt && format(user?.createdAt, "Pp")) || "-"}
                  </p>
                </div>
              </div>
            )}
            <div className="border-l pl-8">
              {view === "general" ? (
                <General />
              ) : view === "team" ? (
                <Team />
              ) : view === "subscription" ? (
                <SubscriptionInfo data={null} />
              ) : null}
            </div>
          </div>
        </div>
      </DashboardBody>
    </>
  );
}
