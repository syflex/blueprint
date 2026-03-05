const providers = [
  { value: "stripe", label: "Stripe" },
  { value: "paddle", label: "Paddle" },
  { value: "lemonsqueezy", label: "Lemon Squeezy" },
];

const stripeEvents = [
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];

export default function PaymentGatewayConfig({ config, onChange }) {
  const events = config.webhookEvents || [];

  function toggleEvent(event) {
    const updated = events.includes(event)
      ? events.filter((e) => e !== event)
      : [...events, event];
    onChange({ webhookEvents: updated });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Provider
      </div>
      <select
        value={config.provider || "stripe"}
        onChange={(e) => onChange({ provider: e.target.value })}
        className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#10B981]"
      >
        {providers.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Currency
      </div>
      <input
        type="text"
        value={config.currency || ""}
        onChange={(e) => onChange({ currency: e.target.value.toLowerCase() })}
        placeholder="usd"
        className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs uppercase outline-none focus:border-[#10B981]"
      />

      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Webhook Events
      </div>
      <div className="flex flex-col gap-1">
        {stripeEvents.map((event) => (
          <label key={event} className="flex items-center gap-1.5 text-[10px] text-[#2D2D31]">
            <input
              type="checkbox"
              checked={events.includes(event)}
              onChange={() => toggleEvent(event)}
              className="accent-[#10B981]"
            />
            <span className="font-mono">{event}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
