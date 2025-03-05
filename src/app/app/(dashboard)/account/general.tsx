"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/client";
import Image from "next/image";
import React, { useTransition } from "react";
import Loading from "./loading";
import { format } from "date-fns";
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

export default function General() {
  const { data, isPending } = authClient.useSession();

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
      <div className="space-y-5">
        <p className="text-primary text-lg font-semibold">Profile Details</p>
        <label className="text-muted-foreground">
          Here are the details about your profile.
        </label>
        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={user?.name} />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" defaultValue={user?.email} disabled />
        </div>
        <Button variant={"outline"}>Save Changes</Button>

        {/* <p>Jointed on </p> */}
      </div>
      <Separator />
      <div className="space-y-5">
        <p className="text-primary text-lg font-semibold">
          Organization Details
        </p>
        <label className="text-muted-foreground">
          Here are the details about your organization.
        </label>

        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={""} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input name="slug" defaultValue={""} />
        </div>
        <Button variant={"outline"}>Save Changes</Button>
      </div>
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
