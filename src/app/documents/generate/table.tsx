"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTemplates } from "@/features/templates/action";
import { AwaitedReturn } from "@/lib/types";
import { formatRelative } from "date-fns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function TemplatesTable({
  data,
}: {
  data: AwaitedReturn<typeof getTemplates>;
}) {
  const router = useRouter();
  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead className="w-[200px]">Created on</TableHead>
          <TableHead className="w-[100px] text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d, i) => (
          <TableRow
            key={i}
            className="cursor-pointer"
            onClick={() => router.push(`generate/${d.id}`)}
          >
            <TableCell>{d.title}</TableCell>
            <TableCell>
              {formatRelative(new Date(d.created_at || ""), new Date())}
            </TableCell>
            <TableCell>
              <Button variant={"outline"} size={"icon"}>
                <Ellipsis />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
