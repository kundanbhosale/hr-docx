"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackBtn({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <Button
      className=""
      variant={"outline"}
      size={"icon"}
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
    >
      <ArrowLeft />
    </Button>
  );
}

export default BackBtn;
