"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Session, User } from "better-auth";

function AppNavBar({
  user,
  session,
}: {
  user: User | undefined;
  session: Session | undefined;
}) {
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
        <Link
          className="hover:underline"
          href={"/documents/generate"}
          id="my-templates-link"
        >
          My Templates
        </Link>
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
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-8">
                <AvatarImage
                  src={
                    user?.image ||
                    `https://api.dicebear.com/9.x/initials/png?seed=${user?.name.replaceAll(
                      " ",
                      "_"
                    )}`
                  }
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="">
              <DropdownMenuLabel>
                <div className="text-xs flex gap-2 items-center justify-start w-40">
                  <div>
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          user?.image ||
                          `https://api.dicebear.com/9.x/initials/png?seed=${user?.name.replaceAll(
                            " ",
                            "_"
                          )}`
                        }
                        alt={user?.name}
                      />
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    {" "}
                    <p className="block semi-bold truncate w-32">
                      {user?.name}
                    </p>
                    <p className="block font-light truncate  w-32">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default AppNavBar;
