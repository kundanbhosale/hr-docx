"use client";

import React, { useTransition } from "react";

import { format } from "date-fns";
import { formatAmount } from "@/lib/intl";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyPage from "@/components/pages/empty";
import { AuthSessions } from "@/_server/db/types";
import { useQuery } from "@tanstack/react-query";
import {
  cancelSubscription,
  getSubscriptionAndPayments,
} from "@/features/payments/server.actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SubscriptionInfo({
  session,
}: {
  session: AuthSessions;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["sub", session?.activeOrganizationId],
    queryFn: () => getSubscriptionAndPayments(),
    enabled: !!session?.activeOrganizationId,
  });
  const [pending, startTran] = useTransition();
  const handleCancel = () => {
    startTran(() => {
      toast.promise(cancelSubscription, {
        success: "Canncelled current subscription",
        error: "Failed to cancel subscription",
        loading: "Cancelling subscription",
      });
    });
  };

  const sub = data?.data?.sub;
  const plan = data?.data?.plan;
  const orders = data?.data?.orders;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-[200px]" />
        {[...Array(6)].map((a, i) => (
          <Skeleton key={i} className="w-full h-[40px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-screen-lg">
        <CardHeader className="grid grid-cols-[auto,200px]">
          <CardTitle>Current Subscription</CardTitle>
          <div className="relative flex justify-end">
            <div className="absolute -bottom-5 right-0 flex gap-4 ">
              {(!plan?.id || plan?.id === "ppd") && (
                <Link
                  href={"/upgrade"}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Upgrade Plan
                </Link>
              )}

              {sub?.id && (
                <Button
                  disabled={pending}
                  size={"sm"}
                  variant={"outline"}
                  onClick={handleCancel}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid grid-cols-[250px,auto] gap-4">
              <p className="text-muted-foreground">Plan</p>
              <p className="flex flex-wrap gap-2">
                <Badge variant="outline">{plan?.name || "Free Plan"}</Badge>
              </p>
              <p className="text-muted-foreground">Current Period</p>
              <p>
                {sub?.current_start && format(sub.current_start, "PP")} -{" "}
                {sub?.current_end && format(sub.current_end, "PP")}
              </p>
              <p className="text-muted-foreground">Price</p>
              <p>
                {formatAmount("INR", Number(plan?.prices.inr || 0) || 0, {
                  fractionDigits: 2,
                })}
              </p>
              {/* <p className="text-muted-foreground ">Total Seats</p>
              <p>
                <Badge variant={"default"}>{data.sub.quantity} employees</Badge>
              </p> */}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-screen-lg">
        <CardHeader className="grid grid-cols-[auto,200px]">
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">ID</TableHead>
                <TableHead className="">Status</TableHead>

                <TableHead className="">Date</TableHead>
                <TableHead className="">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders?.length > 0 ? (
                orders?.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">{d.id}</TableCell>
                    <TableCell>
                      <Badge variant={"outline"}>{d.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(d.created * 1000), "PP")}
                    </TableCell>
                    <TableCell>
                      {formatAmount("INR", Number(d.amount) || 0, {
                        fractionDigits: 2,
                      })}
                    </TableCell>
                    {/* <TableCell>
                      <a
                        href={d.hosted_invoice_url || ""}
                        className="flex items-center gap-2"
                      >
                        View{" "}
                        <ExternalLink
                          className="stroke-muted-foreground size-4"
                          strokeWidth={1.7}
                        />
                      </a>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-96 p-8">
                    <EmptyPage label="No transaction history found." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
