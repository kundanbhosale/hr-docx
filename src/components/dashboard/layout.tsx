"use client";
import { appConfig } from "@/app.config";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { adminNavs, dashboardNavs } from "@/client.config";

export const DashboardLayout = ({
  children,
  navs,
}: {
  children: ReactNode;
  navs: typeof adminNavs | typeof dashboardNavs;
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const path = usePathname();

  useEffect(() => {
    Object.keys(navs).map((k) => {
      navs[k as keyof typeof navs].map((e) => {
        if ((path || "/") === e.url) {
          setActive(e.url);
        }
      });
    });
  }, [path]);

  const handleNavClick = (e: React.MouseEvent) => {
    // Only toggle the sidebar if the click is directly on the nav element
    // and not on any of its children
    if (e.currentTarget === e.target) {
      setOpen((o) => !o);
    }
  };

  return (
    <main className="flex min-h-screen">
      <motion.nav
        className="flex flex-col justify-between h-screen sticky top-0 left-0 p-4 border-r"
        onClick={handleNavClick}
        animate={{
          width: open ? "250px" : "75px",
          background: open ? "hsl(var(--primary))" : "",
          color: open ? "hsl(var(--primary-foreground))" : "",
        }}
      >
        <motion.div>
          <Image
            key={String(open)}
            src={!open ? appConfig.logo.icon : appConfig.logo.logoWhite}
            alt={appConfig.title.short}
            width={!open ? 40 : 200}
            height={!open ? 40 : 40}
          />
        </motion.div>
        <div className="space-y-2">
          {navs.primary.map((n, i) => (
            <div key={i}>
              <Link
                className={cn(
                  "flex items-center justify-center text-lg font-semibold py-2 border-b border-border/20 truncate rounded-md",
                  open && "justify-start rounded-none",
                  active === n.url && "bg-primary"
                )}
                href={n.url}
              >
                {open ? (
                  <span className="flex justify-between gap-2 w-full items-center">
                    {n.label}
                    {active === n.url && (
                      <span className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </span>
                ) : (
                  <n.icon
                    className={cn(
                      "stroke-primary size-6",
                      active === n.url && "stroke-primary-foreground"
                    )}
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {navs.secondary.map((n, i) => (
            <Link
              key={i}
              className={cn(
                "flex items-center justify-center text-lg font-semibold py-2 border-b border-border/20 truncate rounded-md",
                open && "justify-start rounded-none",
                active === n.url && "bg-primary"
              )}
              href={n.url}
            >
              {open ? (
                <span className="flex justify-between gap-2 w-full items-center">
                  {n.label}
                  {active === n.url && (
                    <span className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </span>
              ) : (
                <n.icon
                  className={cn(
                    "stroke-primary size-6",
                    active === n.url && "stroke-primary-foreground"
                  )}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.nav>
      <div className="flex-1 flex flex-col">{children}</div>
    </main>
  );
};
