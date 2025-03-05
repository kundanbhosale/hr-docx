"use client";
import { User } from "better-auth";
import React, { useState, useTransition } from "react";
import { createSubscription } from "./page.actions";
import { parseAsString, useQueryState } from "nuqs";
import { env } from "@/app/env";
import { Label } from "@/components/ui/label";
import { SelectOrgs } from "@/features/org/client/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { appConfig } from "@/app.config";
import { formatAmount } from "@/lib/intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/features/auth/client";
import { toast } from "sonner";

export const PageClient = ({ user }: { user: User | null | undefined }) => {
  const currency = "inr";
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useQueryState(
    "plan",
    parseAsString.withDefault("")
  );
  const [orgId, setOrgId] = useQueryState("org", parseAsString.withDefault(""));
  const [offerId, setOfferId] = useQueryState(
    "offer",
    parseAsString.withDefault("")
  );

  const [pending, startTrans] = useTransition();

  const currPlan = appConfig.plans.find((p) => p.id === planId);

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTrans(async () => {
      const sub = await createSubscription({
        plan_id: planId,
        org_id: orgId,
        offer_id: offerId,
      });

      const options = {
        key: env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
        //   handler: function (_response: any) {},
        prefill: {
          name: user?.name,
          email: user?.email,
          // contact: user?.phoneNumber,
        },
        subscription_id: sub.id,
        notes: {
          user_id: user?.id,
          org_id: orgId,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  };

  const form = useForm({
    //   resolver: zodResolver(orgSchema.create.validate.shape.general /),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  function onSubmit(data) {
    // trans(() => {
    //   createOrgAction({ general: data }, true)
    // })

    startTrans(async () => {
      const d = await authClient.organization
        .create({
          name: data.name,
          slug: data.slug,
          logo: undefined,
        })
        .then((e) => {
          setOpen(false);
          console.log(e);
          if (e.error) {
            toast.error(e.error.message || "Failed to create organization.");
          } else {
            form.reset({});
          }
          return e;
        });
    });
  }

  return (
    <div>
      <div className="m-auto w-full max-w-md space-y-5 border p-8">
        <div>
          <Label className="mb-3 block">Select Organization</Label>
          <SelectOrgs
            size="lg"
            selected={orgId || undefined}
            setSelected={(val) => setOrgId(val || null)}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4"
              )}
            >
              <>
                <Plus />
                <span>Create New Organization</span>
              </>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription className="mb-10">
                  Lets create a new organization.
                </DialogDescription>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Organization Name</FormLabel>

                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Organization Slug</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </Form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Label htmlFor="option-one" className="mb-3 block">
            Select Plan
          </Label>

          <RadioGroup
            defaultValue={planId || undefined}
            className="grid gap-4"
            onValueChange={(e) => setPlanId(e || null)}
          >
            {appConfig.plans.map((a, i) => (
              <div key={i} className="flex items-center">
                <RadioGroupItem
                  value={a.id!}
                  id={a.id!}
                  className="border-primary text-primary focus-visible:ring-ring peer sr-only aspect-square size-4 w-full rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Label
                  htmlFor={a.id!}
                  className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex w-full cursor-pointer items-center justify-between rounded-md border-2 bg-transparent p-4"
                >
                  <span> {a.name}</span>
                  <span>
                    <>
                      {formatAmount(currency, a?.prices[currency] || 0, {
                        fractionDigits: 2,
                      })}{" "}
                      / {a.interval.value} / {a.interval.frequency}
                    </>
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-[100px,auto] items-center">
          <Label className="block">Total Amount</Label>
          <p className="text-end text-2xl font-semibold">
            {currPlan?.prices[currency] === 0 ? (
              "Free"
            ) : (
              <>
                {formatAmount(currency, currPlan?.prices[currency] || 0, {
                  fractionDigits: 2,
                })}
              </>
            )}
          </p>
        </div>
        <Button
          size={"lg"}
          className="w-full"
          onClick={processPayment}
          disabled={pending}
        >
          Proceed to Pay
        </Button>
      </div>
    </div>
  );
};
