"use client";

import { Input } from "@/components/ui/input";
import React, { Fragment, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/features/documents/store";
import { useDebouncedCallback } from "use-debounce";

export function DocumentForm() {
  const { formState, setFormValue } = useDocumentStore();

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
      </form>
    </Fragment>
  );
}
