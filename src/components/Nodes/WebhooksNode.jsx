import BaseNode from "./BaseNode";

export default function WebhooksNode(props) {
  const { config } = props.data;
  const hooks = config.webhooks || [];
  const named = hooks.filter((h) => h.name);

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {named.length > 0 ? (
          named.map((h, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="icon-arrow-right text-[10px] text-[#EF4444]" />
              <span className="text-xs text-[#2D2D31]">{h.name}</span>
              <span className="text-[10px] text-[#97979B]">
                {h.events?.length || 0} events
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No webhooks configured</span>
        )}
      </div>
    </BaseNode>
  );
}
