/**
 * Generate payment processing files.
 * @param {import('../../ir/schema').PaymentGatewayIR} paymentIR
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generatePaymentFiles(paymentIR) {
  if (!paymentIR) return [];

  const files = [];

  if (paymentIR.provider === "stripe") {
    files.push({
      path: "src/lib/payments.ts",
      content: generateStripeHelper(paymentIR),
      language: "typescript",
    });

    files.push({
      path: "functions/payment-webhook/src/main.ts",
      content: generateStripeWebhookHandler(paymentIR),
      language: "typescript",
    });
  } else {
    // Generic payment helper for Paddle / Lemon Squeezy
    files.push({
      path: "src/lib/payments.ts",
      content: generateGenericPaymentHelper(paymentIR),
      language: "typescript",
    });
  }

  return files;
}

function generateStripeHelper(ir) {
  return `import Stripe from "stripe";

/**
 * Stripe payment helper
 * Currency: ${ir.currency.toUpperCase()}
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    currency: "${ir.currency}",
    line_items: [{ price: priceId, quantity: 1 }],
    ...(customerId ? { customer: customerId } : {}),
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createSubscription({
  priceId,
  customerId,
}: {
  priceId: string;
  customerId: string;
}) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
}

export async function getCustomerPortalUrl(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

export { stripe };
`;
}

function generateStripeWebhookHandler(ir) {
  const eventCases = ir.webhookEvents
    .map(
      (event) => `    case "${event}":
      // TODO: Handle ${event}
      log(\`Handling ${event}\`);
      break;`
    )
    .join("\n\n");

  return `import Stripe from "stripe";

/**
 * Stripe webhook handler function.
 * Listens for: ${ir.webhookEvents.join(", ")}
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async ({ req, res, log, error }: any) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    error(\`Webhook signature verification failed: \${err.message}\`);
    return res.json({ error: "Invalid signature" }, 400);
  }

  switch (event.type) {
${eventCases}

    default:
      log(\`Unhandled event type: \${event.type}\`);
  }

  return res.json({ received: true });
};
`;
}

function generateGenericPaymentHelper(ir) {
  return `/**
 * Payment helper for ${ir.provider}
 * Currency: ${ir.currency.toUpperCase()}
 *
 * TODO: Install the ${ir.provider} SDK and implement the payment flow.
 * Webhook events to handle: ${ir.webhookEvents.join(", ")}
 */

export const PAYMENT_PROVIDER = "${ir.provider}";
export const DEFAULT_CURRENCY = "${ir.currency}";

// Placeholder — replace with actual ${ir.provider} SDK integration
export async function createCheckout(options: {
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  throw new Error("${ir.provider} integration not yet implemented");
}
`;
}
