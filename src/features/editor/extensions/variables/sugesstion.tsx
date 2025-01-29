/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { createRoot } from "react-dom/client";
import { ReactRenderer } from "@tiptap/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import * as Popover from "@radix-ui/react-popover";
import { UseTiptapEditorProps } from "../../hooks/use-tiptap";

const VariableList = React.forwardRef((props: any, ref) => {
  const { items, command } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectItem = (index) => {
    const item = items[index];
    if (item) {
      command({ id: item.id, label: item.title });
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
      return true;
    }

    if (event.key === "ArrowDown") {
      setSelectedIndex((selectedIndex + 1) % items.length);
      return true;
    }

    if (event.key === "Enter") {
      selectItem(selectedIndex);
      return true;
    }

    return false;
  };

  React.useImperativeHandle(ref, () => ({
    onKeyDown,
  }));

  return (
    <Command className="rounded-lg border shadow-md" style={{ width: "300px" }}>
      <CommandInput placeholder="Search variables..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item, index) => (
            <CommandItem
              key={item}
              onSelect={() => selectItem(index)}
              className={`cursor-pointer ${
                index === selectedIndex ? "bg-accent" : ""
              }`}
            >
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
});

VariableList.displayName = "VariableList";

const VariablePopover = ({ editor, children, clientRect }) => {
  return (
    <Popover.Root open={true} onOpenChange={() => {}}>
      <Popover.Content
        side="bottom"
        align="start"
        style={{
          position: "absolute",
          left: clientRect?.left,
          top: clientRect?.bottom + 10,
        }}
      >
        {children}
      </Popover.Content>
    </Popover.Root>
  );
};

export const variableSuggestion = (
  items: UseTiptapEditorProps["suggestionItems"] = []
) => ({
  items: ({ query }) => {
    return items.filter((item) =>
      item.id.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component;
    let root;

    return {
      onStart: (props) => {
        if (!props.clientRect) {
          return;
        }

        const element = document.createElement("div");
        document.body.appendChild(element);
        root = createRoot(element);

        component = new ReactRenderer(VariableList, {
          props,
          editor: props.editor,
        });

        root.render(
          <VariablePopover
            editor={props.editor}
            clientRect={props.clientRect()}
          >
            <div
              ref={(el) => {
                if (el && !el.children.length) {
                  el.appendChild(component.element);
                }
              }}
            />
          </VariablePopover>
        );
      },

      onUpdate(props) {
        component?.updateProps(props);
      },

      onKeyDown(props) {
        return component?.ref?.onKeyDown(props);
      },

      onExit() {
        root?.unmount();
        component?.destroy();
      },
    };
  },
});

export default variableSuggestion;
