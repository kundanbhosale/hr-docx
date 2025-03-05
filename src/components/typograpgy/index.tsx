import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Heading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn("max-w-xl text-5xl font-medium leading-tight", className)}
    >
      {children}
    </h2>
  );
}

export function SubHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn("max-w-xl text-3xl font-medium leading-tight", className)}
    >
      {children}
    </h2>
  );
}
export function HeadingLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn("max-w-xl text-5xl font-medium leading-tight", className)}
    >
      {children}
    </h2>
  );
}
