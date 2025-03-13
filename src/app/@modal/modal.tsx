"use client";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export const Modal = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const handleOpenChange = () => {
    router.back();
  };
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className={cn("overflow-y-hidden", className)}>
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
