import { Editor } from "@tiptap/core";
import SectionFive from "./components/section/five";
import SectionFour from "./components/section/four";
import SectionOne from "./components/section/one";
import SectionThree from "./components/section/three";
import SectionTwo from "./components/section/two";
import { Separator } from "@/components/ui/separator";
import { SearchAndReplaceToolbar } from "./components/search-replace";

export const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2 sticky top-0 bg-background z-10">
    <div className="flex w-max items-center gap-px">
      <SearchAndReplaceToolbar editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      {/* <ToggleVoidButton editor={editor} /> */}

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    </div>
  </div>
);
