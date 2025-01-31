"use client";

import { Input } from "@/components/ui/input";
import React, { Fragment, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/features/documents/store";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function DocumentForm({ downloadPDF }: { downloadPDF: any }) {
  const { formState, setFormValue, progress } = useDocumentStore();

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

  const debounced = useDebouncedCallback((id, value) => {
    setFormValue(id, value);
  }, 200);

  const isEmpty = formState.length === 0;

  return (
    <Fragment>
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
        <div
          className="flex flex-col items-center text-center flex-1 py-12 px-8 my-12 border bg-muted"
          id="generate-btn"
        >
          <FileText className="size-24 mb-8" strokeWidth={1} />
          <h1 className="text-2xl">{isEmpty ? "No Variables." : "Download"}</h1>
          <p className="text-base max-w-sm mb-8">
            You can edit document on right side or simple download pdf by click
            on button below:
          </p>
          <Button
            size={"lg"}
            className="w-full"
            onClick={downloadPDF}
            disabled={progress !== 100}
          >
            Generate PDF Document.
          </Button>
        </div>
      </form>
    </Fragment>
  );
}
