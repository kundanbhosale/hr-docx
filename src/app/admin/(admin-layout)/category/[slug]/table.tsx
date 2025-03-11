"use client";
import { Button } from "@/components/ui/button";

import {
  deleteTemplate,
  getTemplatesGroup,
} from "@/features/templates/server.action";
import { AwaitedReturn } from "@/lib/types";
import { RefreshCw, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import Image from "next/image";
export default function TemplatesTable({
  data,
}: {
  data: AwaitedReturn<typeof getTemplatesGroup>;
}) {
  const router = useRouter();
  const [deletes, setDeletes] = useState<string[]>([]);

  const handleDel = (id: string) => {
    setDeletes((p) => [...p, id]);
    toast.promise(deleteTemplate(id), {
      loading: "Deleting Template...",
      success: () => {
        setDeletes((p) => p.filter((e) => e !== id));
        return `Template have been deleted.`;
      },
      error: () => {
        setDeletes((p) => p.filter((e) => e !== id));
        return "Error deleting the template.";
      },
    });
  };

  return (
    <>
      {/* <Table id="templates-table">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="w-[200px]">Created on</TableHead>
            <TableHead className="w-[100px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((d, i) => (
            <TableRow key={i} className={cn("cursor-pointer")}>
              <TableCell
                onClick={() =>
                  !deletes.includes(d.id) &&
                  router.push(`/admin/template/${d.id}`)
                }
              >
                {d.title}
              </TableCell>
              <TableCell
                onClick={() =>
                  !deletes.includes(d.id) &&
                  router.push(`/admin/template/${d.id}`)
                }
              >
                {formatRelative(new Date(d.created_at || ""), new Date())}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="relative z-10 "
                      disabled={deletes.includes(d.id)}
                    >
                      {!deletes.includes(d.id) ? (
                        <Trash />
                      ) : (
                        <RefreshCw className="animate-spin size-4 store-muted-foreground" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your template and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDel(d.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      <div className="flex flex-wrap gap-x-8 gap-y-14">
        {data?.data?.map((t, i) => (
          <a
            onClick={(e) =>
              (e.target as HTMLElement).tagName === "IMG" &&
              !deletes.includes(t.id) &&
              router.push(`/admin/template/${t.id}`)
            }
            key={i}
            className="cursor-pointer"
            style={{
              height: "16rem",
              width: "12rem",
            }}
          >
            <div className=" mb-1 relative group">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="absolute z-10 -top-2 -right-2 hidden group-hover:flex"
                    disabled={deletes.includes(t.id)}
                  >
                    {!deletes.includes(t.id) ? (
                      <Trash />
                    ) : (
                      <RefreshCw className="animate-spin size-4 store-muted-foreground" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your template and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDel(t.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div
                className="overflow-hidden relative border rounded-md"
                style={{
                  height: "16rem",
                }}
              >
                <Image
                  key={i}
                  src={t.thumbnail || "/docs.png"}
                  alt=""
                  fill
                  quality={100}
                />
              </div>
            </div>
            <p className="block w-full font-medium text-muted-foreground break-words capitalize">
              {t.title}
            </p>
          </a>
        ))}
      </div>
    </>
  );
}
