"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LucideIcon, RotateCcw, XCircle } from "lucide-react";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Image from "next/image";

export default function ErrorPage({
  error,
  message,
  title,
  icon,
  reset,
  noReset,
  actionBtn,
}: {
  error?: Error & { digest?: string };
  message?: string;
  title?: string;
  icon?: LucideIcon;
  reset?: () => void;
  noReset?: boolean;
  actionBtn?: ReactNode;
}) {
  const router = useRouter();
  const Ico = icon || XCircle;
  return (
    <div className="flex flex-col flex-1 items-center bg-muted">
      <div className="m-auto">
        <div className="flex justify-center items-center mb-4">
          <Image src="/app/logo.png" width={150} height={44} alt="HR Docx" />
        </div>
        <div className="flex flex-col p-4 py-10 items-center justify-center text-center border bg-background w-full md:w-[500px]">
          <Ico className="mb-2 size-20 opacity-70" strokeWidth={1.1} />
          <p className="break-all text-xl font-medium">
            {title || "Oh no, Something went wrong!"}
          </p>
          <Label className="text-md mx-auto my-2 max-w-md break-all font-light">
            {message ||
              error?.message ||
              "We don't know what caused this error!"}
          </Label>
          <div className="my-6 space-x-4">
            {!actionBtn ? (
              <Button variant={"outline"} onClick={() => router.back()}>
                <ArrowLeft /> <span> Go Back</span>
              </Button>
            ) : (
              actionBtn
            )}
            {!noReset && (
              <Button
                variant={"outline"}
                onClick={() => (reset ? reset() : router.refresh())}
              >
                <RotateCcw /> Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
