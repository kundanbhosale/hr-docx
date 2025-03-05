"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LucideIcon, RotateCcw, XCircle } from "lucide-react"

import { Button } from "../ui/button"
import { Label } from "../ui/label"

export default function ErrorPage({
  error,
  message,
  title,
  icon,
}: {
  error?: Error & { digest?: string }
  message?: string
  title?: string
  icon?: LucideIcon
}) {
  const router = useRouter()
  const Ico = icon || XCircle
  return (
    <div className="m-auto flex w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 text-center">
      <Ico className="mb-2 size-20 opacity-70" strokeWidth={1.1} />
      <p className="break-all text-xl font-medium">
        {title || "Oh no, Something went wrong!"}
      </p>
      <Label className="text-md mx-auto my-2 max-w-md break-all font-light">
        {message || error?.message || "We don't know what caused this error!"}
      </Label>
      <div className="my-6 space-x-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          <ArrowLeft /> <span> Go Back</span>
        </Button>
        <Button variant={"outline"} onClick={() => router.refresh()}>
          <RotateCcw /> Try Again
        </Button>
      </div>
    </div>
  )
}
