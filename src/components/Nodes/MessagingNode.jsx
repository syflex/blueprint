import BaseNode from "./BaseNode";

export default function MessagingNode(props) {
  const { config } = props.data;
  const channels = config.channels || [];

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {channels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {channels.map((ch) => (
              <span
                key={ch}
                className="rounded bg-[#E17055]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#E17055]"
              >
                {ch}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-[#97979B]">No channels</span>
        )}
      </div>
    </BaseNode>
  );
}
