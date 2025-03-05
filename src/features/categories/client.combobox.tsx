"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { geCategoryComboBox } from "./server.action";
import { DefaultCombobox, DefaultComboBox } from "@/components/ui/combobox";

export function SelectCategory({
  size,
  selected = undefined,
  setSelected,
  disabled,
}: {
  size?: Parameters<typeof DefaultComboBox>[0]["size"];
  selected: string | undefined;
  setSelected: (val: string | undefined) => void;
  disabled?: boolean;
}) {
  const [search, setSearch] = useState(selected || "");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["combobox-category", search],
    queryFn: async () =>
      (await geCategoryComboBox({ search: debouncedSearch })).data,
  });

  const handleSelected = (val: DefaultCombobox | null) => {
    setSelected(val?.value || undefined);
  };

  const curr = useMemo(() => {
    return data?.find((d) => d.value === selected) || null;
  }, [selected]);

  return (
    <DefaultComboBox
      name="Select Category"
      placeholder="Search Category"
      data={data}
      loading={isLoading}
      onSearch={setSearch}
      selected={curr}
      setSelected={handleSelected}
      size={size}
      disabled={disabled}
    />
  );
}
