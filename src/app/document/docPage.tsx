"use client";
import { DocumentForm } from "./form";
import React, { FocusEvent, useEffect, useState } from "react";
import { useDocumentStore } from "@/features/documents/store";
import DocumentEditor from "@/features/documents/editor";

import { createPDF } from "@/features/pdf/actions";
import { useQuery } from "@tanstack/react-query";
import BackBtn from "@/components/common/backBtn";
import {
  createDocument,
  getSingleDocument,
  updateDocument,
} from "@/features/documents/server.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Save } from "lucide-react";
import { Counter } from "@/components/common/counter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { captureScreenshot } from "@/lib/screenshot";
import { authClient } from "@/features/auth/client";
import { useRouter } from "next/navigation";

export default function DocPage({
  documentId,
  templateId,
}: {
  documentId?: string;
  templateId?: string;
}) {
  const {
    formState,
    reset,
    editor,
    update,
    progress,
    inputFocused,
    title,
    nodeFocused,
    id: stateDocId,
    template: stateTemplate,
  } = useDocumentStore();
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["document", { documentId, templateId }],
    queryFn: async () =>
      await getSingleDocument({ id: documentId, template: templateId }),
  });

  const { data: activeOrg, isPending } = authClient.useActiveOrganization();
  const [filled, setFilled] = useState(false);

  const router = useRouter();
  const data = result?.data;
  const sess = authClient.useSession();
  const [open, setOpen] = React.useState(false);
  const [downloads, setDownloads] = React.useState(0);
  const [pending, startTransition] = React.useTransition();
  const [key, setKey] = useState(0);
  const saveFn = async (shouldDownload?: boolean) => {
    if (!sess.data?.session)
      return router.push(
        "/login?cb=" + window.location.pathname + window.location.search
      );

    if (!sess.data?.session.activeOrganizationId) {
      return router.push("/org");
    }

    if ((activeOrg?.metadata?.credits?.download || 0) === 0) {
      return router.push(
        "/upgrade?cb=" + window.location.pathname + window.location.search
      );
    }

    const el = document.getElementsByClassName("-tiptap-editor")[0];
    const thumbnail = await captureScreenshot(el as any);

    const exec = async () => {
      const val = editor?.getHTML();
      if (documentId && documentId !== "new") {
        await updateDocument({
          id: documentId,
          schema: formState,
          content: val || "",
          title,
          thumbnail,
        });
      } else {
        await createDocument({
          schema: formState,
          content: val || "",
          title,
          template: data.template!,
          thumbnail,
        });
      }
      if (!shouldDownload) return;
      await createPDF(val || "").then((res) => {
        if (res.error) {
        }
        const d = res.data;
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
    };

    toast.promise(exec, {
      loading: `${shouldDownload ? "Downloading" : "Saving"} Document`,
      success: `Successfully ${shouldDownload ? "download" : "save"} document`,
      error: (e) =>
        e.message ||
        `Failed to ${shouldDownload ? "download" : "save"} document`,
    });
  };

  const saveDocument = () => {
    startTransition(async () => {
      saveFn();
    });
  };

  const downloadPDF = async () => {
    startTransition(() => {
      saveFn(true);
    });
  };

  useEffect(() => {
    if (!data || (stateDocId == data.id && data.template == stateTemplate))
      return;
    console.log(
      !data,
      stateDocId == data.id && data.template == stateTemplate,
      data,
      stateDocId,
      data.id,
      data.template,
      stateTemplate
    );
    reset(data);
    if (data?.schema.length === 0) {
      update({ progress: 100 });
    }
    setKey(new Date().getTime());

    return () => reset(data);
  }, [data, templateId, documentId]);

  const focusedClass = ["node-focused"];

  React.useEffect(() => {
    const focused = (e: FocusEvent) => {
      const target = (e as any)?.srcElement as HTMLElement | null;

      if (target?.tagName === "INPUT") {
        update({ inputFocused: true });
      }
    };

    const notFocused = () => update({ inputFocused: false });

    document.addEventListener("focusin", focused as any);
    document.addEventListener("focusout", notFocused);

    return () => {
      document.removeEventListener("focusin", focused as any);
      document.removeEventListener("focusout", notFocused);
    };
  }, []);

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
  }, []);

  useEffect(() => {
    const onHashChanged = () => {
      const hash = nodeFocused;
      if (!hash) return;
      const container = document.getElementById("editor-container");
      const el = Array.from(document.querySelectorAll(`[data-id="${hash}"]`));
      if (!el || el.length === 0 || !container) return;
      Array.from(document.getElementsByClassName(focusedClass[0])).forEach(
        (e: any) => {
          e.classList.remove(...focusedClass);
        }
      );
      el.map((e) => {
        e.classList.add(...focusedClass);
      });

      // Get the element's position relative to the container
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = el[0].getBoundingClientRect().top;
      const y = elementTop - containerTop + container.scrollTop - 100; // Adjust scrollTop here
      // Smooth scroll to the calculated position
      container.scrollTo({ top: y, behavior: "smooth" });
    };
    onHashChanged();
  }, [nodeFocused]);

  useEffect(() => {
    if (progress !== 100) {
      return setFilled(false);
    }
    const timer = setTimeout(() => {
      setFilled(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress, filled]);
  return (
    <div className="grid grid-cols-5">
      <div
        className="col-span-2 border-r h-screen overflow-y-auto relative flex flex-col flex-1"
        id="info-form"
      >
        {isLoading || isPending ? (
          <div className="flex-1 p-8 flex flex-col gap-5">
            <Skeleton className="h-10" />
            <Skeleton className="flex-1" />
          </div>
        ) : (
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
            <DocumentForm />
          </div>
        )}
      </div>
      <div className="col-span-3 flex relative" id="editor">
        {isLoading ? (
          <div className="flex-1 p-8 flex flex-col gap-5">
            <Skeleton className="h-10" />
            <Skeleton className="flex-1" />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "bg-primary gap-1 fixed  z-40 bottom-20 right-20 flex items-center justify-center overflow-hidden p-2  rounded-lg drop-shadow-lg pointer-events-none",
                pending && "hidden"
              )}
            >
              {inputFocused && !filled ? (
                <>
                  <div
                    className={cn(
                      "size-16 flex text-primary-foreground flex-col items-center justify-center",
                      !inputFocused && "hidden"
                    )}
                  >
                    {/* <motion.pre className="block font-semibold text-2xl">{`${rounded.get()}%`}</motion.pre> */}
                    <span className="block font-semibold text-2xl">
                      <Counter value={progress} />%
                    </span>

                    <p className="block font-semibold">Progress</p>
                  </div>
                </>
              ) : (
                <div className="flex">
                  <a
                    onClick={downloadPDF}
                    className={cn(
                      "rounded-md flex justify-center cursor-pointer text-background p-2 w-20 h-16 [&_svg]:size-7 hover:bg-white hover:text-primary shadow-none pointer-events-auto z-40 relative"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Download />
                      <span className="!hover:text-primary-foreground text-[12px]">
                        Download
                      </span>
                    </div>
                  </a>
                  <a
                    className="rounded-md flex justify-center cursor-pointer text-background p-2 w-20 h-16 [&_svg]:size-7 hover:bg-white hover:text-primary shadow-none pointer-events-auto z-40 relative"
                    onClick={saveDocument}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Save />
                      <span className="!hover:text-primary-foreground text-[12px]">
                        Save
                      </span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            <DocumentEditor
              key={key}
              placeholder="Write something here"
              value={data?.content || ""}
              suggestionItems={formState}
              onChange={(e) => e}
              open={open}
              setOpen={setOpen}
              downloads={downloads}
              downloadPDF={downloadPDF}
              pending={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
