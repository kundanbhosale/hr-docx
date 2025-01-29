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
import { Check, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
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

export const DocumentEditor = React.forwardRef<HTMLDivElement, TiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const { formState, clearFormUpdates, formUpdates, update, progress } =
      useDocumentStore();
    const [open, setOpen] = React.useState(false);

    const editor = useTiptapEditor({
      value: value,
      onUpdate: onChange,
      onCreate: ({ editor }) => {
        update({ editor });
      },
      ...props,
    });
    const contentRef = React.useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
      contentRef,
      bodyClass: "shadow-none border-none rounded-none",
    });

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

    React.useEffect(() => {
      if (progress !== 100) return;
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }, [progress]);

    if (!editor) {
      return null;
    }

    return (
      <div className={"relative flex-1 flex"}>
        <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
          <DialogContent className="flex items-center justify-center flex-col">
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
                onClick={() => reactToPrintFn()}
              >
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {progress > 0 && (
          <div
            className={cn(
              progress === 100 && "scale-100",
              "transition-all ease-linear text-muted-white max-w-lg w-1/2 m-auto rounded-full border-2 z-50 h-9 bg-neutral-100 border-emerald-600 overflow-hidden drop-shadow-xl absolute bottom-10 inset-x-0 flex items-center justify-end text-end p-4"
            )}
          >
            <div
              className="h-8 block bg-emerald-600 min-w-9 rounded-full absolute left-0 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
            {progress < 100 ? (
              <>
                <span className="font-semibold absolute left-5 inset-y-auto">
                  Progress
                </span>
                <span className="font-semibold absolute right-5 inset-y-auto">
                  {`${100 - progress}% left`}
                </span>
              </>
            ) : (
              <div className="font-semibold absolute left-0 inset-y-auto flex h-9 justify-between w-full pl-6 pr-1 text-start items-center gap-px">
                <div className="flex-1">
                  <p className="fit-content text-white">
                    {" "}
                    Your document is ready!
                  </p>
                </div>
                <a
                  onClick={() => reactToPrintFn()}
                  className="px-4 py-1.5 h-7 flex justify-center items-center bg-white rounded-l-full w-fit cursor-pointer hover:bg-black hover:text-white transition-all ease-linear"
                >
                  <span>
                    <Download className="size-4" />
                  </span>
                  &nbsp; Download
                </a>
                <a className="px-4 py-1.5 flex h-7 justify-center items-center bg-white rounded-r-full w-fit cursor-pointer hover:bg-black hover:text-white transition-all ease-linear">
                  <span>
                    <Share2 className="size-4" />
                  </span>
                </a>
              </div>
            )}
          </div>
        )}

        <MeasuredContainer
          as="div"
          name="editor"
          id="editor-container"
          ref={ref}
          className={cn(
            "flex h-auto min-h-72 w-full flex-col focus-within:border-primary max-h-screen overflow-y-auto bg-muted ",
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
      </div>
    );
  }
);

DocumentEditor.displayName = "DocumentEditor";

export default DocumentEditor;
