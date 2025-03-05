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
import { Minus, Plus, RefreshCcw } from "lucide-react";
import { TemplateFormSchema } from "@/features/templates/schema";
import { useTransition } from "react";
import {
  createTemplate,
  updateTemplate,
} from "@/features/templates/server.action";
import { toast } from "sonner";
import BackBtn from "@/components/common/backBtn";
import { SelectCategory } from "@/features/categories/client.combobox";
import slugify from "slugify";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MultipleSelector, { Option } from "@/components/ui/multi-select";

const variables = [
  {
    id: "company_name",
    label: "Company Name",
    type: "text",
    desc: "Name of the company",
  },
  {
    id: "company_email",
    label: "Company Email",
    type: "text",
    desc: "Email of the company",
  },
  {
    id: "company_phone",
    label: "Company Phone",
    type: "text",
    desc: "Phone number of the company",
  },
  {
    id: "company_address",
    label: "Company Address",
    type: "text",
    desc: "Address of the company",
  },
  {
    id: "employee_name",
    label: "Employee Name",
    type: "text",
    desc: "Name of the employee",
  },
  {
    id: "employee_email",
    label: "Employee Email",
    type: "text",
    desc: "Email of the employee",
  },
  {
    id: "employee_phone",
    label: "Employee Phone",
    type: "text",
    desc: "Contact number of the employee",
  },
  {
    id: "employee_address",
    label: "Employee Address",
    type: "text",
    desc: "Address of the employee",
  },
];

const OPTIONS: Option[] = variables.map((m) => ({
  label: m.label,
  value: m.id,
}));

export function TemplateForm({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  const form = useFormContext<TemplateFormSchema>();
  // 2. Define a submit handler.
  function onSubmit(values: TemplateFormSchema) {
    startTransition(() => {
      if (id === "new") {
        toast.promise(createTemplate(values), {
          loading: "Creating Template...",
          success: `New Template have been created.`,
          error: (e) => e.message || "Error creating the template.",
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
  const add = () => {
    return append(
      {
        id: new Date().getTime().toString(),
        title: "",
        type: "text",
        desc: "",
        value: "",
      },
      { shouldFocus: false }
    );
  };

  const handleDefaultSelect = (opts: Option[]) => {
    opts.forEach((s) => {
      const field = fields.find((f) => s.value === f.id);
      if (!field) {
        const item = variables.find((f) => f.id === s.value);
        if (!item) return;
        append(
          {
            id: item.id,
            desc: item.desc,
            title: item.label,
            type: item.type as any,
            value: "",
          },
          {
            shouldFocus: false,
          }
        );
      }
    });
  };

  const handleRemoveSelect = (opts: Option[]) => {
    opts.forEach((opt) => {
      const idx = fields.findIndex((f) => f.id === opt.value);
      if (idx === -1) return;
      remove(idx);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BackBtn />
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
                <div className="flex gap-2">
                  <Input placeholder="Template Slug" {...field} />
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
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <SelectCategory
                  // size="lg"
                  selected={field.value || undefined}
                  setSelected={(val) => field.onChange(val || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6 pt-4">
          <div className="flex gap-4 justify-between items-center">
            <FormField
              control={form.control}
              name="schema"
              render={({ field }) => {
                const opts = field.value;
                return (
                  <FormItem className="w-full">
                    <FormLabel>Add Template Variables</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        defaultOptions={OPTIONS}
                        onChange={handleDefaultSelect}
                        creatable={true}
                        value={opts.map((f) => ({
                          value: f.id,
                          label: f.title,
                        }))}
                        onRemove={handleRemoveSelect}
                        placeholder="Select or Add variables you want..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            No results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
        <div>
          {Object.keys(form.formState.errors).length > 0 && (
            <Alert variant={"destructive"}>
              <AlertTitle>Please fix errors:</AlertTitle>

              <AlertDescription>
                <ul className="list-disc pl-2">
                  {Object.keys(form.formState.errors).map((k, i) => (
                    <li key={i}>
                      <span className="font-semibold capitalize"> {k}</span>:
                      {form.formState.errors[k].message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Button type="submit" disabled={pending} id="generate-btn">
          {id === "new" ? "Create Template" : "Update Template"}
        </Button>
      </form>
    </Form>
  );
}
