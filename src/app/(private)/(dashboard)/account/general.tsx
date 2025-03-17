"use client";

import { Input } from "@/components/ui/input";
import { authClient } from "@/features/auth/client";
import React, { useEffect, useTransition } from "react";
import Loading from "./loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect, RedirectType } from "next/navigation";
import { User } from "better-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
export default function General() {
  const { data, isPending } = authClient.useSession();
  const org = authClient.useActiveOrganization();

  const [pending, startTrans] = useTransition();

  const user = data?.user || null;

  const handleDelete = () => {
    startTrans(async () => {
      await authClient.deleteUser();
      redirect("/", RedirectType.replace);
    });
  };

  if (isPending) return <Loading />;

  return (
    <div className="space-y-6">
      <ProfileForm user={user} />
      <Separator />
      <OrgForm org={org} />
      <Separator />
      <Card className="bg-destructive/10">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            This will permanently delete your account from our database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleDelete}
            disabled={pending}
            variant={"destructive"}
          >
            Permanently Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [user]);

  function onSubmit({ name }: z.infer<typeof formSchema>) {
    toast.promise(
      authClient.updateUser({
        name,
      }),
      {
        loading: "Saving user...",
        error: "Failed to save user",
        success: "Successfully updated user.",
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-primary text-lg font-semibold">Profile Details</p>
        <label className="text-muted-foreground">
          Here are the details about your profile.
        </label>
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button variant={"outline"}>Save Changes</Button>

        {/* <p>Jointed on </p> */}
      </form>
    </Form>
  );
}

function OrgForm({
  org,
}: {
  org: ReturnType<typeof authClient.useActiveOrganization>;
}) {
  const formSchema = z.object({
    name: z.string().min(2),
    slug: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    form.reset(org.data as any);
  }, [org.data]);

  async function onSubmit({ name, slug }: z.infer<typeof formSchema>) {
    // if (org.data?.slug !== slug) {
    //   await authClient.organization.checkSlug({
    //     slug,
    //   });
    // }

    toast.promise(
      authClient.organization
        .update({
          data: {
            name,
            slug,
          },
        })
        .then((e) => {
          console.log(e.error);
          if (e.error) throw e.error;
        }),
      {
        loading: "Saving company details...",
        error: (e) =>
          e.message ||
          "Failed to save company details, (If you are updating slug, the slug might be already used by another company.)",
        success: "Successfully updated company details.",
      }
    );
  }

  if (org.isPending) {
    return (
      <>
        <Skeleton className="h-10" />
        <Skeleton className="h-32" />
      </>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-primary text-lg font-semibold">Company Details</p>
        <label className="text-muted-foreground">
          Here are the details about your company.
        </label>
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button variant={"outline"}>Save Changes</Button>

        {/* <p>Jointed on </p> */}
      </form>
    </Form>
  );
}
