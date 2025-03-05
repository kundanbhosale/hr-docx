"use client";

import { Input } from "@/components/ui/input";
import React, { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/features/documents/store";
import { useDebouncedCallback } from "use-debounce";
import { FileText } from "lucide-react";
import confetti from "canvas-confetti";
import Loading from "@/components/common/loading";

export function DocumentForm({ downloadPDF }: { downloadPDF: any }) {
  const { formState, setFormValue, progress } = useDocumentStore();
  const [loading, setLoading] = useState(true);
  const onSubmit = (vals) => {
    console.log(vals);
  };
  useEffect(() => {
    const onHashChanged = () => {
      const name = window.location.hash.split(":")[1];
      document.getElementsByName(name)[0]?.focus();
    };

    window.addEventListener("hashchange", onHashChanged);

    return () => {
      window.removeEventListener("hashchange", onHashChanged);
    };
  }, []);

  function handleConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 1, x: 0.7 },
    });
  }

  useEffect(() => {
    if (progress === 100) {
      handleConfetti();
    }
  }, [progress]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const debounced = useDebouncedCallback((id, value) => {
    setFormValue(id, value);
  }, 200);

  const isEmpty = formState.length === 0;
  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <div
        className={cn(
          "flex flex-col items-center text-center flex-1 py-12 px-8 my-12 border bg-muted",
          !isEmpty && "p-4 flex-row text-start gap-6 items-center"
        )}
        id="generate-btn"
      >
        <FileText
          className={cn("size-24 mb-8", !isEmpty && "size-20 mb-0")}
          strokeWidth={1}
        />
        <div>
          <h1 className="text-2xl font-semibold">
            {isEmpty
              ? "No Variables."
              : progress < 100
              ? "Please fill the form"
              : "Your document is ready!"}
          </h1>

          <p className={cn("text-base max-w-sm mb-8", !isEmpty && "mb-0")}>
            You can edit document on right side or simple download pdf by click
            on button below:
          </p>
        </div>

        {/* <Button
            size={"lg"}
            className={cn("w-full")}
            onClick={downloadPDF}
            disabled={progress !== 100}
          >
            Generate PDF Document.
          </Button> */}
      </div>
      <form className="py-8 space-y-6" onSubmit={onSubmit}>
        {formState.map((f, i) => (
          <Fragment key={i}>
            <div className="">
              <div>
                <Label className="mb-0 font-medium">{f.title}</Label>
              </div>
              <Input
                name={f.id}
                placeholder={f.desc}
                className={cn("bg-transparent")}
                autoComplete="off"
                onChange={(e) => debounced(f.id, e.currentTarget.value)}
                onFocus={() => {
                  window.location.hash = f.id;
                }}
                onBlur={() => {
                  window.location.hash = "";
                }}
              />
              {/* <p className="text-xs text-muted-foreground mt-px">{f.desc}</p> */}
            </div>
          </Fragment>
        ))}

        {/* <Button
          type="button"
          id="generate-btn"
          onClick={downloadPDF}
          disabled={progress !== 100}
        >
          Generate Document
        </Button> */}
      </form>
    </div>
  );
}
