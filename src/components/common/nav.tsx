import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { Plus } from "lucide-react";

function NavBar() {
  return (
    <div className="p-3 px-6 border-b flex gap-6 w-full justify-between items-center">
      <Link href={"/"} className="font-bold text-base">
        HR DOCX
      </Link>
      <div className="flex gap-6 items-center">
        <Link className="hover:underline" href={"/"}>
          Home
        </Link>
        <Link className="hover:underline" href={"/documents/generate"}>
          My Templates
        </Link>
        <Link
          className={cn(buttonVariants({ size: "sm" }))}
          href={"/documents/generate/new"}
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
