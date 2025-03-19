"use client";

import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
// import { useMediaQuery } from "@/hooks/mediaQuery"
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DefaultCombobox {
  image: string | undefined;
  value: string;
  label: string;
}

export function DefaultComboBox({
  data,
  name,
  placeholder,
  selected,
  setSelected,
  onSearch,
  loading,
  size = "default",
  disabled,
}: {
  data: DefaultCombobox[] | undefined;
  placeholder: string;
  name: string;
  selected: DefaultCombobox | null;
  setSelected: (val: DefaultCombobox | null) => void;
  onSearch?: (val: string) => void;
  loading?: boolean;
  size?: "lg" | "default" | "full";
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  // const isDesktop = useMediaQuery("(min-width: 768px)")
  // if (isDesktop) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          ref={ref}
          variant="outline"
          size={size === "full" ? "default" : size}
          className={cn(
            "w-[200px] justify-start",
            size === "lg" && "w-full",
            size === "full",
            "w-full"
          )}
        >
          {selected ? (
            <>
              {selected.image && (
                <span className="bg-muted block size-5 rounded-full border overflow-hidden">
                  <span
                    className="size-full block"
                    style={{
                      backgroundImage:
                        selected.image && `url(${selected.image})`,

                      backgroundSize: "contain",
                    }}
                  />
                </span>
              )}

              <span className=" truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate">{name}</span>
          )}
          <span className="ml-auto">
            <ChevronDown />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0")}
        style={{ width: `${ref.current?.clientWidth || 200}px` }}
        align="start"
      >
        <StatusList
          setOpen={setOpen}
          setSelected={setSelected}
          data={data}
          placeholder={placeholder}
          onSearch={onSearch}
          loading={loading}
        />
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  setOpen,
  setSelected,
  data,
  placeholder,
  loading,
  onSearch,
}: {
  setOpen: (open: boolean) => void;
  setSelected: (val: DefaultCombobox | null) => void;
  data: DefaultCombobox[] | undefined;
  placeholder: string;
  loading?: boolean;
  onSearch?: (val: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} onValueChange={onSearch} />
      <CommandList className="">
        {loading ? (
          <CommandLoading className="m-auto flex min-h-24 flex-1 items-center justify-center px-4">
            <Loader2 className="animate-spin" />
          </CommandLoading>
        ) : data?.length === 0 ? (
          <CommandEmpty className="flex min-h-24 flex-1 items-center justify-center px-4">
            No results found.
          </CommandEmpty>
        ) : null}

        <CommandGroup>
          {data?.map((d) => (
            <CommandItem
              key={d.value}
              value={d.value}
              onSelect={(value) => {
                setSelected(
                  data.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              {d.image && (
                <span className="bg-muted block size-5 overflow-hidden rounded-full border">
                  <span
                    className="block size-full"
                    style={{
                      backgroundImage: d.image && `url(${d.image})`,
                      backgroundSize: "contain",
                    }}
                  />
                </span>
              )}
              <span className="truncate">{d.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
