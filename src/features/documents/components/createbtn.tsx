import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const CreateBtn = () => {
  return (
    <Link
      href={"/document/create"}
      className="border flex items-center justify-center"
      style={{
        width: "12rem",
        height: "16rem",
      }}
    >
      <div className="text-center flex flex-col justify-center items-center">
        <Plus className="size-8 mb-4" />
        <p className="text-sm text-muted-foreground">New Document</p>
      </div>
    </Link>
  );
};
