import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req, res) {
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET, {});

  try {
    // Replace 'subscription_id' with the actual subscription ID
    const subscriptionId = "sub_1OOMBSKtuWph5eI6PCskrX2M";
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" });
    }

    // Increase subscription trial by 1 day
    const oneDayInSeconds = 24 * 60 * 60;
    const currentTrialEnd =
      subscription.trial_end || subscription.current_period_end;
    const newTrialEnd = Math.floor(Date.now() / 1000) + oneDayInSeconds; // Use current time + 1 day

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        trial_end: newTrialEnd,
      }
    );

    return NextResponse.json(updatedSubscription);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
