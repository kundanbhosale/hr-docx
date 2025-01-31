"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TemplateFormSchema } from "@/features/templates/schema";
import { useTransition } from "react";
import { createTemplate, updateTemplate } from "@/features/templates/action";
import { toast } from "sonner";
import BackBtn from "@/components/common/backBtn";

export function TemplateForm({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  const form = useFormContext<TemplateFormSchema>();
  console.log(form.formState.errors);
  // 2. Define a submit handler.
  function onSubmit(values: TemplateFormSchema) {
    startTransition(() => {
      if (id === "new") {
        toast.promise(createTemplate(values), {
          loading: "Creating Template...",
          success: `New Template have been created.`,
          error: "Error creating the template.",
        });
      } else {
        toast.promise(updateTemplate(id, values), {
          loading: "Updating Template...",
          success: `Template have been updated.`,
          error: "Error updated the template.",
        });
      }
    });
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "schema", // unique name for your Field Array
    keyName: "_id",
  });

  const add = () => {
    return append({
      id: new Date().getTime().toString(),
      title: "",
      type: "text",
      desc: "",
      value: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BackBtn href="/documents/generate" />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title of the template" {...field} />
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
                <Input placeholder="Slug of the template" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6">
          <div className="flex gap-4 justify-between items-center">
            <Label>Template Variables</Label>
            <Button
              className=""
              type="button"
              variant={"outline"}
              size={"sm"}
              onClick={() => add()}
            >
              <span>
                <Plus />
              </span>{" "}
              Add Variable
            </Button>
          </div>
          <div className="mb-8 space-y-8">
            {fields.map((k, i) => (
              <div
                key={k._id}
                className="p-4 border bg-muted space-y-4 relative"
              >
                <Button
                  className="absolute -top-4 -right-2"
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={() => remove(i)}
                >
                  <Minus />
                </Button>
                <FormField
                  control={form.control}
                  name={`schema.${i}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Name of the Field" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schema.${i}.desc`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Description of the Field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schema.${i}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type of Input" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div
              className="cursor-pointer flex justify-center gap-4 p-4 border border-dashed bg-muted items-center"
              onClick={() => add()}
            >
              <Plus className="size-5" />{" "}
              <p className="text-base">Add Variable</p>
            </div>
          </div>
        </div>
        <Button type="submit" disabled={pending} id="generate-btn">
          {id === "new" ? "Create Template" : "Update Template"}
        </Button>
      </form>
    </Form>
  );
}
