// ./app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// 1. Initialize Stripe with the 2026 API version. 
// Adding "!" tells TypeScript "I promise this env variable exists."
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', 
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // 2. We need the RAW text body for the signature to work.
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    // 3. This is the "Magic" line that verifies the request actually came from Stripe.
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 4. Handle the specific event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Payment was successful for session:', session.id);
      
      // Look! This is where you grab that metadata we talked about earlier
      const jobberId = session.metadata?.jobberInvoiceId;
      console.log('Jobber Invoice to update:', jobberId);
      
      // TODO: Update your database here
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  // 5. Always return a 200 OK so Stripe stops retrying.
  return NextResponse.json({ received: true });
}