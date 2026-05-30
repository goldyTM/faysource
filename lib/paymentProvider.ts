export type PaymentPlan = {
  id: string;
  title: string;
  description: string;
  amount_cents: number;
};

export const paymentPlans: PaymentPlan[] = [
  {
    id: 'single_supplier',
    title: 'Single Supplier Unlock',
    description: 'Unlock one supplier contact for $5.',
    amount_cents: 500,
  },
  {
    id: 'full_access',
    title: 'Full Access',
    description: 'Unlock all suppliers for $150.',
    amount_cents: 15000,
  },
];

export type ProcessPaymentResult = {
  provider: string;
  provider_payment_id: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
};

export async function processPayment(planId: string): Promise<ProcessPaymentResult> {
  const plan = paymentPlans.find((item) => item.id === planId);
  if (!plan) {
    return {
      provider: 'manual',
      provider_payment_id: 'unknown-plan',
      status: 'failed',
      message: 'Invalid payment plan.',
    };
  }

  // Placeholder implementation for plug-and-play checkout.
  // Replace this with a real gateway integration later.
  return {
    provider: 'manual',
    provider_payment_id: `manual-${plan.id}-${Date.now()}`,
    status: 'completed',
  };
}
