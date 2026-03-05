import BaseNode from "./BaseNode";

const providerLabels = {
  stripe: "Stripe",
  paddle: "Paddle",
  lemonsqueezy: "Lemon Squeezy",
};

export default function PaymentGatewayNode(props) {
  const { config } = props.data;

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        <span className="rounded bg-[#10B981]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#10B981] w-fit">
          {providerLabels[config.provider] || config.provider}
        </span>
        <span className="text-[10px] text-[#97979B]">
          {config.webhookEvents?.length || 0} webhook events
        </span>
        {config.currency && (
          <span className="text-[10px] text-[#97979B]">
            Currency: {config.currency.toUpperCase()}
          </span>
        )}
      </div>
    </BaseNode>
  );
}
