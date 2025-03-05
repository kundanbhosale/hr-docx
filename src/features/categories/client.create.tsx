import React, { ReactNode, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CreateCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  UpdateCategorySchema,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { toast } from "sonner";
import slugify from "slugify";
import { AwaitedReturn } from "@/lib/types";
import { getAllPublicCategories } from "./server.action";
import {
  createCategory,
  updateCategory,
} from "@/app/admin/(admin-layout)/category/[slug]/sever.action";

const CategoryForm = ({
  data,
  children,
}: {
  data?: NonNullable<AwaitedReturn<typeof getAllPublicCategories>["data"]>[0];
  children: ReactNode;
}) => {
  const [pending, startTrans] = useTransition();
  const form = useForm<UpdateCategorySchema | CreateCategorySchema>({
    resolver: zodResolver(
      data?.id ? updateCategorySchema : createCategorySchema
    ),
    defaultValues: {
      id: data?.id || undefined,
      title: data?.title || "",
      slug: data?.slug || "",
      color: data?.color || "#98B9FF",
    },
  });
  const onSubmit = (d: UpdateCategorySchema) => {
    startTrans(() => {
      toast.promise(d?.id ? updateCategory(d) : createCategory(d), {
        loading: "Submitting...",
        success: `Successfully ${d?.id ? "updated" : "created"} category!`,
        error: `Failed to ${d?.id ? "update" : "create"} category!`,
      });
    });
  };

  const genSlug = (val?: string) => {
    if (!val) {
      val = form.getValues("title");
    }
    return form.setValue(
      "slug",
      slugify(val || "", {
        lower: true,
        trim: true,
      })
    );
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="" asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data?.id ? "Update Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {data?.id
                ? "This action will update category"
                : "This action will create a new category."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category Name"
                        {...field}
                        onBlur={(e) => {
                          const v = form.getValues("slug");
                          if (!v) {
                            genSlug(e.currentTarget.value);
                          }
                          field.onBlur();
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="Category Slug" {...field} />
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          type="button"
                          onClick={() => genSlug()}
                        >
                          <RefreshCcw />
                        </Button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Color</FormLabel>
                    <FormControl>
                      <ColorPicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={pending}>
                {data?.id ? "Update" : "Create"} Category
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryForm;
