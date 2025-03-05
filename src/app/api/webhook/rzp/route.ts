// import { db } from "@/_server/db";
import { env } from "@/app/env";
import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const manageSubscriptionStatusChange = async (
  subscription: Subscriptions.RazorpaySubscription
) => {
  console.log(subscription);
  //   const sub = await stripe().subscriptions.retrieve(subscription.id, {
  //     expand: ["plan.product", "latest_invoice"],
  //   });
  //   await db
  //     .updateTable("orgs.list")
  //     .where("id", "=", subscription.metadata.org_id)
  //     .set({
  //       subscription: {
  //         id: subscription.id,
  //         provider: "stripe",
  //         active: subscription.status === "active",
  //         plan: (sub as any).plan.product.name,
  //       },
  //       limits: {
  //         seats: subscription.items.data[0].quantity || 1,
  //       },
  //     })
  //     .executeTakeFirst();
  //   await delCache(redisKeys.org.single(subscription.metadata.org_id));
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("x-razorpay-signature") as string;
  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
  const { event, payload } = await req.json();

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    const isValid = validateWebhookSignature(body, String(sig), webhookSecret);
    if (!isValid) throw Error("Permission denied.");

    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        // case "order.paid":

        case "subscription.charged":
        case "subscription.updated":
        case "subscription.cancelled":
          await manageSubscriptionStatusChange(
            payload.subscription.entity as Subscriptions.RazorpaySubscription
          );
          break;
        default:
          throw new Error("Unhandled relevant event!");
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
