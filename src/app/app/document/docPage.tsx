"use client";
import { DocumentForm } from "./form";
import React, { useEffect, useState } from "react";
import { useDocumentStore } from "@/features/documents/store";
import DocumentEditor from "@/features/documents/editor";

import { useRouter } from "next/navigation";

import { createPDF } from "@/features/pdf/actions";
import { useQuery } from "@tanstack/react-query";
import BackBtn from "@/components/common/backBtn";
import { getSingleDocument } from "@/features/documents/server.action";

export default function DocPage({
  documentId,
  templateId,
}: {
  documentId: string;
  templateId: string;
}) {
  const { formState, reset, editor, update } = useDocumentStore();
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () =>
      await getSingleDocument({ id: documentId, template: templateId }),
  });
  const data = result?.data;

  console.log(data);

  const [open, setOpen] = React.useState(false);
  const [downloads, setDownloads] = React.useState(0);
  const [pending, startTransition] = React.useTransition();
  const [key, setKey] = useState(0);

  const downloadPDF = () => {
    startTransition(() => {
      const val = editor?.getHTML();
      createPDF(val).then((d) => {
        const byteCharacters = atob(d);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(null)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Create a temporary download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloads((p) => p + 1);
      });
    });
  };

  useEffect(() => {
    reset(data?.schema || []);
    if (data?.schema.length === 0) {
      update({ progress: 100 });
    }
    setKey(new Date().getTime());

    return () => reset(data?.schema || []);
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
      <div
        className="col-span-2 border-r h-screen overflow-y-auto relative flex flex-col flex-1"
        id="info-form"
      >
        <div className="p-8 flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            {/* <Button
              className=""
              variant={"ghost"}
              size={"icon"}
              onClick={() => router.push("/")}
            >
              <ArrowLeft />
            </Button> */}
            <BackBtn />
            <h1 className="text-3xl">Fill Information</h1>
          </div>
          <DocumentForm downloadPDF={downloadPDF} />
        </div>
      </div>
      <div className="col-span-3 flex relative" id="editor" key={key}>
        {/* <div className="bg-muted h-full w-full border" /> */}

        <DocumentEditor
          placeholder="Write something here"
          value={data?.content || ""}
          suggestionItems={formState}
          onChange={(e) => console.log(e)}
          open={open}
          setOpen={setOpen}
          downloads={downloads}
          downloadPDF={downloadPDF}
          pending={pending}
        />
      </div>
    </div>
  );
}
