"use client";
import * as React from "react";
import "@/features/editor/styles/index.css";
import type { Content, Editor } from "@tiptap/react";
import {
  createExtensions,
  type UseTiptapEditorProps,
} from "@/features/editor/hooks/use-tiptap";
import { EditorContent, generateJSON, useEditor } from "@tiptap/react";
import { cn } from "@/lib/utils";

import { LinkBubbleMenu } from "@/features/editor/components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "@/features/editor/components/measured-container";
import { Toolbar } from "@/features/editor/toolbar";
import { useDocumentStore } from "../documents/store";
import { useThrottle } from "@/features/editor/hooks/use-throttle";
import { getOutput } from "@/features/editor/utils";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";

export interface TiptapProps extends Omit<UseTiptapEditorProps, "onUpdate"> {
  value?: string;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

export const useTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  suggestionItems,
  onCreate,
  ...props
}: UseTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay
  );

  const handleUpdate = React.useCallback(
    (editor: Editor) => {
      return throttledSetValue(getOutput(editor, output));
    },
    [output, throttledSetValue]
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(
          generateJSON(
            value || "",
            createExtensions(placeholder, suggestionItems)
          )
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onCreate && onCreate({ editor });
    },
    [value]
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  );

  const editor = useEditor({
    ...props,

    extensions: createExtensions(placeholder, suggestionItems),

    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
  });

  return editor;
};

export const DocumentEditor = React.forwardRef<
  HTMLDivElement,
  TiptapProps & {
    pending: any;
    open: any;
    setOpen: any;
    downloadPDF: any;
  }
>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      pending,
      open,
      setOpen,
      downloadPDF,

      ...props
    },
    ref
  ) => {
    const { formState, clearFormUpdates, formUpdates, update } =
      useDocumentStore();

    const editor = useTiptapEditor({
      value: value,
      onUpdate: onChange,
      onCreate: ({ editor }) => {
        update({ editor });
      },
      ...props,
    });
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!editor) return;

      formUpdates.map((key) => {
        const field = formState.find((f) => f.id === key);
        clearFormUpdates(key);

        if (!field) return;

        editor.commands.updateCustomNode(
          field.id,
          field?.value || field?.title || ""
        );
      });
    }, [formUpdates]);

    // React.useEffect(() => {
    //   if (progress < 100 || downloads > 0 || pending || formState.length === 0)
    //     return;
    //   const timer = setTimeout(() => {
    //     setOpen(true);
    //   }, 5000);
    //   return () => clearTimeout(timer);
    // }, [progress, pending, downloads, formState, formUpdates]);

    if (!editor) {
      return null;
    }

    return (
      <div className={"relative flex-1 flex"}>
        <Dialog open={open || pending} onOpenChange={(v) => setOpen(v)}>
          <DialogContent className="flex items-center justify-center flex-col">
            {pending ? (
              <div className="w-full h-[300px] bg-white flex items-center justify-center">
                <Loading title="Submitting..." />
              </div>
            ) : (
              <>
                <DialogHeader className="flex flex-col items-center justify-center mb-10">
                  <span className="p-4 border bg-emerald-400 rounded-full mb-4">
                    <Check className="size-14" />
                  </span>
                  <DialogTitle className="text-center text-2xl">
                    Your document is ready!
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Download your document as pdf by clicking on download button
                    below
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-6 w-full">
                  <Button
                    className="w-full text-lg"
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full text-lg"
                    size={"lg"}
                    onClick={() => downloadPDF()}
                  >
                    Download PDF
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <MeasuredContainer
          as="div"
          name="editor"
          id="editor-container"
          ref={ref}
          className={cn(
            "flex h-auto min-h-72 w-full flex-col focus-within:border-primary max-h-screen overflow-y-auto bg-accent ",
            className
          )}
        >
          <Toolbar editor={editor} />
          <EditorContent
            editor={editor}
            ref={contentRef}
            className={cn(
              "-tiptap-editor p-10 border m-8 shadow-xl flex-1 bg-white rounded-lg print:m-0 print:border-none print:shadow-none print:rounded-none",
              editorContentClassName
            )}
            placeholder="Write something here..."
          />

          <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
        {/* <DocEditor suggestionItems={props.suggestionItems} /> */}
      </div>
    );
  }
);

DocumentEditor.displayName = "DocumentEditor";

export default DocumentEditor;
