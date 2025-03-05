import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export const DashboardBody = ({
  children,
  className,
  noPadding,
}: {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) => {
  return (
    <div
      className={cn("flex-1 flex flex-col p-8", noPadding && "p-0", className)}
    >
      {children}
    </div>
  );
};
