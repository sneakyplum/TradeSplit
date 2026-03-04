import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const { amount, invoiceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["klarna", "card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { 
          name: `Payment for Invoice #${invoiceId}`, // This shows up on the Klarna screen
        },
        unit_amount: Math.round(parseFloat(amount) * 100), // Turn "750.00" into 75000
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?status=cancelled`,
  });

  return Response.json({ url: session.url });
}