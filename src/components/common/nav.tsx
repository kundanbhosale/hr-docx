"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Plus } from "lucide-react";
import { useOnborda } from "onborda";
import { tourSteps } from "@/features/tour/steps";

function NavBar() {
  const { startOnborda, closeOnborda } = useOnborda();

  // useEffect(() => {
  //   startOnborda(tourSteps[0].tour);
  // }, []);

  return (
    <div className="p-3 px-6 border-b flex gap-6 w-full justify-between items-center">
      <Link href={"/"} className="font-bold text-base">
        HR DOCX
      </Link>
      <div className="flex gap-6 items-center">
        <Link className="hover:underline" href={"/"}>
          Home
        </Link>
        <Link
          className="hover:underline"
          href={"/documents/generate"}
          id="my-templates-link"
        >
          My Templates
        </Link>
        <Button
          variant={"outline"}
          onClick={() => startOnborda("mainTour")}
          size={"sm"}
        >
          Take a tour
        </Button>
        <Link
          className={cn(buttonVariants({ size: "sm" }))}
          href={"/documents/generate/new"}
          id="create-template-link"
        >
          <span>
            <Plus />
          </span>{" "}
          Create New Template
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
