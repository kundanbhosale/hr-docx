"use client";
import React, { useEffect, useState } from "react";
import { TemplateForm } from "./form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DocumentEditor from "@/features/documents/editor";
import {
  templateFormSchema,
  TemplateFormSchema,
} from "@/features/templates/schema";
import { AwaitedReturn } from "@/lib/types";
import { getSingleTemplate } from "@/features/templates/server.action";

const DocGenerator = ({
  data,
  id,
}: {
  id: string;
  data: AwaitedReturn<typeof getSingleTemplate>["data"];
}) => {
  // 1. Define your form.
  const form = useForm<TemplateFormSchema>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      title: data?.title || "",
      slug: data?.slug || "",
      content: data?.content || "",
      schema: data?.schema || [],
      category: "",
    },
  });
  const [key, setKey] = useState(0);

  const formState = form.watch("schema");
  const content = form.watch("content");
  useEffect(() => {
    setKey(new Date().getTime());
  }, [formState]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-5">
        <div
          className="col-span-2 border-r h-screen overflow-y-auto relative"
          id="info-form"
        >
          <div className="p-8">
            <TemplateForm id={id} />
          </div>
        </div>
        <div className="col-span-3 h-screen relative flex" id="editor">
          <DocumentEditor
            key={key}
            placeholder="Write something here"
            value={content}
            suggestionItems={formState}
            onChange={(e) => form.setValue("content", e || "")}
          />
        </div>
      </div>
    </Form>
  );
};

export default DocGenerator;
