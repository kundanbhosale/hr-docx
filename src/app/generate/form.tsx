"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  schema: z.array(
    z.object({
      name: z.string(),
      desc: z.string(),
      type: z.enum(["text"]),
    })
  ),
});

export function TemplateForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      schema: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "schema", // unique name for your Field Array
    keyName: "_id",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="p-4 border space-y-6">
          <div className="flex gap-4 justify-between items-center">
            <Label>Template Variables</Label>
            <Button
              className=""
              type="button"
              variant={"outline"}
              size={"sm"}
              onClick={() => append({ name: "", type: "text", desc: "" })}
            >
              <span>
                <Plus />
              </span>{" "}
              Add Variable
            </Button>
          </div>
          <div className="mb-8 space-y-8">
            {fields.length === 0 && (
              <p className="p-4 border bg-muted mt-8">No Variables Yet.</p>
            )}
            {fields.map((k, i) => (
              <div key={k._id} className="flex gap-4">
                <Button
                  className=""
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={() => remove(i)}
                >
                  <Minus />
                </Button>
                <FormField
                  control={form.control}
                  name={`schema.${i}.name`}
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
                          placeholder="Description of the field"
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
                    <FormItem className="w-24">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type of input" />
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
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
