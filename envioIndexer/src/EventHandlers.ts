import {
  SubscriptionManager,
  Subscription,
} from "generated";

// Handler for when a new subscription is created
SubscriptionManager.SubscriptionCreated.handler(async ({ event, context }) => {
  const subscriptionId = event.params.subscriptionId.toString();

  const subscriptionEntity: Subscription = {
    id: subscriptionId,
    // 👇 --- THE CHANGE IS HERE ---
    owner: event.params.owner.toLowerCase(), // Save the owner's EOA
    subscriber: event.params.subscriber.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    token: event.params.token.toLowerCase(),
    amount: event.params.amount,
    frequency: event.params.frequency,
    lastPaymentTimestamp: BigInt(event.block.timestamp), 
    isActive: true,
  };

  context.Subscription.set(subscriptionEntity);
});

// Handler for when a subscription is cancelled
SubscriptionManager.SubscriptionCancelled.handler(async ({ event, context }) => {
  const subscriptionId = event.params.subscriptionId.toString();
  let subscription = await context.Subscription.get(subscriptionId);

  if (subscription) {
    const updatedSubscription: Subscription = {
      ...subscription,
      isActive: false,
    };
    context.Subscription.set(updatedSubscription);
  }
});

// Handler for when a payment is made
SubscriptionManager.PaymentMade.handler(async ({ event, context }) => {
  const subscriptionId = event.params.subscriptionId.toString();
  let subscription = await context.Subscription.get(subscriptionId);

  if (subscription) {
    const updatedSubscription: Subscription = {
      ...subscription,
      lastPaymentTimestamp: event.params.paymentTimestamp,
    };
    context.Subscription.set(updatedSubscription);
  }
});
