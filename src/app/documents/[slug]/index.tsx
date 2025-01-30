"use client";
import { DocumentForm } from "./form";
import React, { useEffect } from "react";
import { useDocumentStore } from "@/features/documents/store";
import DocumentEditor from "@/features/documents/editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AwaitedReturn } from "@/lib/types";
import { getSingleTemplate } from "@/features/templates/action";

export default function DocPage({
  data,
}: {
  data: AwaitedReturn<typeof getSingleTemplate>;
}) {
  const { formState, reset } = useDocumentStore();

  useEffect(() => {
    reset(data?.schema || []);
  }, [data]);

  const focusedClass = ["node-focused"];
  const router = useRouter();

  useEffect(() => {
    const style = document.createElement("style");

    style.textContent = `
    .node-focused {background:#1ad198 !important;}
    @media print {
    @page {
      .node-focused {background:none !important;}
  }}
    `;
    document.body.appendChild(style);

    const onHashChanged = () => {
      const hash = window.location.hash.substring(1);
      const container = document.getElementById("editor-container");
      const el = document.querySelector(`[data-id="${hash}"]`) as HTMLElement;
      if (!el || !container) return;
      Array.from(document.getElementsByClassName(focusedClass[0])).forEach(
        (e: any) => {
          e.classList.remove(...focusedClass);
        }
      );
      el.classList.add(...focusedClass);
      // Get the element's position relative to the container
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = el.getBoundingClientRect().top;
      const y = elementTop - containerTop + container.scrollTop - 100; // Adjust scrollTop here
      // Smooth scroll to the calculated position
      container.scrollTo({ top: y, behavior: "smooth" });
    };

    window.addEventListener("hashchange", onHashChanged);

    return () => {
      window.removeEventListener("hashchange", onHashChanged);
    };
  }, []);

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-2 border-r h-screen overflow-y-auto relative">
        <div className="p-8">
          <div className="flex gap-2 items-center">
            <Button
              className=""
              variant={"ghost"}
              size={"icon"}
              onClick={() => router.push("/")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-3xl">Fill Information</h1>
          </div>
          <DocumentForm />
        </div>
      </div>
      <div className="col-span-3  relative">
        {/* <div className="bg-muted h-full w-full border" /> */}
        {formState.length > 0 && (
          <DocumentEditor
            placeholder="Write something here"
            value={data?.content || ""}
            suggestionItems={formState}
            onChange={(e) => console.log(e)}
          />
        )}
      </div>
    </div>
  );
}
