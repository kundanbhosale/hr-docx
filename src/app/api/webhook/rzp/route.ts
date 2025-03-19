// import { db } from "@/_server/db";
import { db } from "@/_server/db";
import { appConfig } from "@/app.config";
import { env } from "@/app/env";
import { ClientError } from "@/lib/error";
import { randomUUID } from "crypto";
import { sql } from "kysely";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const relevantEvents = new Set([
  "order.paid",
  "subscription.charged",
  "subscription.updated",
  "subscription.cancelled",
  "subscription.completed",
]);

export const manageSubscriptionStatusChange = async (
  event: string,
  subscription: Subscriptions.RazorpaySubscription
) => {
  console.log("Updating subscription...");
  const plan = appConfig.plans.find((f) => f.id === subscription.plan_id);
  if (!plan) throw new ClientError("Plan not found");

  await db
    .updateTable("orgs.list")
    .where("orgs.list.id", "=", subscription.notes.org_id)
    .set({
      metadata: {
        subscription:
          event === "subscription.cancelled"
            ? null
            : {
                id: subscription.id,
                status: subscription.status,
                current_start:
                  (subscription.current_start &&
                    Number(subscription.current_start * 1000)) ||
                  0,
                current_end:
                  (subscription.current_end &&
                    Number(subscription.current_end * 1000)) ||
                  0,

                plan_id: subscription.plan_id,
                plan: subscription.notes.plan_name,
              },
        credits: {
          download:
            event === "subscription.cancelled" ? 0 : plan.features.downloads,
        },
      },
    })
    .execute();
  console.log("Updated subscription...");
};

export const manageOrderPaid = async (
  order: Orders.RazorpayOrder,
  payment?: Payments.RazorpayPayment
) => {
  console.log("Processing Order paid...");
  const notes = payment?.notes || order.notes;

  if (!notes.org_id) return console.log("Skipping order paid no org-id");
  const org = await db
    .selectFrom("orgs.list")
    .where("orgs.list.id", "=", notes.org_id)
    .selectAll()
    .executeTakeFirstOrThrow();

  await db
    .updateTable("orgs.list")
    .where("orgs.list.id", "=", notes.org_id)
    .set({
      metadata: {
        subscription: {
          id: null,
          plan: notes.plan_name,
          plan_id: notes.plan_id,
        },
        credits: { download: (Number(org.metadata.credits) || 0) + 1 },
      },
    })
    .execute();

  await db
    .insertInto("orgs.orders")
    .values({
      id: randomUUID(),
      ref: order.id,
      org: notes.org_id!,
      created_by: notes.user,
      metadata: order as any,
      updated_at: sql`now()`,
    })
    .onConflict((oc) =>
      oc.column("ref").doUpdateSet({
        metadata: (eb) => eb.ref("excluded.metadata"),
        updated_at: (eb) => eb.ref("excluded.updated_at"),
      })
    )
    .execute();
  console.log("Success order paid...");
};

export async function POST(req: Request) {
  const body = await req.json();

  const sig = req.headers.get("x-razorpay-signature") as string;
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  const { event, payload } = body;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    const isValid = validateWebhookSignature(
      JSON.stringify(body),
      String(sig),
      webhookSecret
    );
    if (!isValid) throw new ClientError("Permission denied.");

    console.log(`🔔  Webhook received: ${event}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event)) {
    try {
      switch (event) {
        case "order.paid":
          await manageOrderPaid(
            payload.order.entity as never,
            payload.payment.entity
          );
          break;
        case "subscription.charged":
        case "subscription.updated":
        case "subscription.cancelled":
          await manageSubscriptionStatusChange(
            event,
            payload.subscription.entity as Subscriptions.RazorpaySubscription
          );
          break;
        default:
          throw new ClientError("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}

// import { logger } from '@/config/logger'
// import {
//     handleOrderPaid,
//     handleSubscriptionComplete,
//     updateRazorpaySub,
// } from '@/helpers/webhooks/payments'
// import { createError } from '@/lib/error'
// import { FastifyReply, FastifyRequest } from 'fastify'
// import Razorpay from "razorpay"
// import { Subscriptions } from "razorpay/dist/types/subscriptions"

// import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils'

// export const rayzorpayWebhook = async (
//     req: FastifyRequest,
//     reply: FastifyReply
// ) => {
//     const signature = req.headers['x-razorpay-signature']

//     const requestedBody = JSON.stringify(req.body)

//     const isValid = validateWebhookSignature(
//         requestedBody,
//         String(signature),
//         process.env.RAZORPAY_WEBHOOK_SECRET!
//     )

//     if (!isValid) throw createError('permission_denied', 'Permission denied.')

//     const { event, payload } = req.body as any
//     logger.info(`Incoming event: ${event}`)
//     switch (event) {
//         case 'order.paid':
//             await handleOrderPaid({
//                 payment: payload.payment.entity,
//                 order: payload.order.entity,
//             })
//             break

//         case 'subscription.charged':
//             await handleSubscriptionComplete({
//                 sub: payload.subscription.entity,
//                 payment: payload.payment.entity,
//             })
//             break

//         case 'subscription.updated':
//             await updateRazorpaySub(payload.subscription.entity)
//             break

//         case 'subscription.cancelled':
//             await updateRazorpaySub(payload.subscription.entity)
//             break
//         default:
//             throw createError('not_found', 'Invalid event!')
//     }

//     return reply.send('Success')
// }
