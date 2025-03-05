"use client";

import React, { useTransition } from "react";
// import {
//   getCustomerPortalStripe,
//   getSubscription,
// } from "@/features/stripe/server.actions";
import { format } from "date-fns";
import { ArrowUpRight, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { formatAmount } from "@/lib/intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function SubscriptionInfo({ data }: { data: null }) {
  const [pending, trans] = useTransition();

  const handleClick = () => {
    // trans(async () => {
    //   await getCustomerPortalStripe({})
    //     .then((e) => {
    //       console.log(e);
    //       window.open(e, "_ blank");
    //     })
    //     .catch((err) => {
    //       toast.error(err.message || "Failed to open customer portal.");
    //     });
    // });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-screen-lg">
        <CardHeader className="grid grid-cols-[auto,200px]">
          <CardTitle>Current Subscription</CardTitle>
          <div className="relative flex justify-end">
            <div className="absolute -bottom-5 right-0 flex gap-4">
              <Button
                variant="outline"
                size={"sm"}
                onClick={handleClick}
                disabled={pending}
              >
                Customer Portal <ArrowUpRight />
              </Button>
              <Button size={"sm"} disabled={pending}>
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid grid-cols-[250px,auto] gap-4">
              <p className="text-muted-foreground">Plan</p>
              <p className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {data?.sub.plan || "Unknown Plan"}
                </Badge>
              </p>
              <p className="text-muted-foreground">Current Period</p>
              <p>
                {data?.sub?.start_date && format(data?.sub?.start_date, "PP")} -{" "}
                {data?.sub?.end_date && format(data?.sub?.end_date, "PP")}
              </p>
              <p className="text-muted-foreground">Price</p>
              <p>
                {formatAmount(
                  data?.sub.currency,
                  Number(data?.sub.price) || 0,
                  {
                    fractionDigits: 2,
                  }
                )}
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
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Invoice</TableHead>
                <TableHead></TableHead>
                <TableHead className="">Date</TableHead>
                <TableHead className="">Amount</TableHead>
                <TableHead className=""></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.invoices?.length > 0 ? (
                data?.invoices?.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">{d.number}</TableCell>

                    <TableCell>{d.lines.data[0].description}</TableCell>
                    <TableCell>
                      {format(new Date(d.created * 1000), "PP")}
                    </TableCell>
                    <TableCell>
                      {formatAmount(d.currency, Number(d.total / 100) || 0, {
                        fractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
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
