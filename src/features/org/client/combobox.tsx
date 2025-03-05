"use client";

import { useEffect, useMemo, useState } from "react";

import { DefaultCombobox, DefaultComboBox } from "@/components/ui/combobox";
import { authClient } from "@/features/auth/client";

export function SelectOrgs({
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
  //   const [search, setSearch] = useState(selected || "");
  //   const [debouncedSearch] = useDebounce(search, 500);
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const [data, setData] = useState<DefaultCombobox[]>([]);

  //   const { data, isLoading } = useQuery({
  //     queryKey: ["combobox-orgs", search],
  //     queryFn: async () => await getOrgsComboBox({ search: debouncedSearch }),
  //   });

  useEffect(() => {
    if (organizations?.length === 0) return;
    const d: DefaultCombobox[] =
      (organizations?.map((m) => ({
        image: m.logo,
        value: m.id,
        label: m.name,
      })) as any) || [];
    setData(d);
  }, [organizations]);

  const handleSelected = (val: DefaultCombobox | null) => {
    setSelected(val?.value || undefined);
  };

  const curr = useMemo(() => {
    return data?.find((d) => d.value === selected) || null;
  }, [selected, data]);

  return (
    <DefaultComboBox
      name="Select Organization"
      placeholder="Search Organization"
      data={data}
      loading={isPending}
      // onSearch={setSearch}
      selected={curr}
      setSelected={handleSelected}
      size={size}
      disabled={disabled}
    />
  );
}
