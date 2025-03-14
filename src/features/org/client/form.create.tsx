import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/features/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { ClientError } from "@/lib/error";

const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, { message: "Invalid slug" })
    .min(2)
    .max(200)
    .transform((t) => slugify(t)),
});

type SchemaType = z.infer<typeof schema>;

const CreateOrgForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [pending, setTrans] = useTransition();
  const router = useRouter();
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  function handleSubmit(values: SchemaType) {
    setTrans(async () => {
      onSubmit();
      toast.promise(authClient.organization.create(values), {
        loading: "Creating Organization...",
        success: async (data) => {
          if (data.error) {
            throw new ClientError(data.error);
          }
          await authClient.organization
            .setActive({ organizationSlug: data.data?.slug })
            .then(() => {
              router.push("/");
            });

          return "Successfully created organization";
        },
        error: (e) => e.message || "Error creating organization",
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc" {...field} />
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
                <Input placeholder="acme-inc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending}>Create Organization</Button>
      </form>
    </Form>
  );
};

const CreateOrgDialog = ({
  children,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex gap-2 items-center">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
        </DialogHeader>
        <div>
          <CreateOrgForm onSubmit={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export {
  CreateOrgDialog,
  CreateOrgForm,
  schema as CreateOrgSchema,
  type SchemaType as CreateOrgSchemaType,
};
