import BaseNode from "./BaseNode";

export default function AuthNode(props) {
  const { config } = props.data;
  const providerCount = config.providers?.length || 0;

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          {config.providers?.map((p) => (
            <span
              key={p}
              className="rounded bg-[#F02E65]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#F02E65]"
            >
              {p}
            </span>
          ))}
        </div>
        {config.guestAccess && (
          <span className="text-[10px] text-[#97979B]">Guest access enabled</span>
        )}
        {providerCount === 0 && (
          <span className="text-xs text-[#97979B]">No providers configured</span>
        )}
      </div>
    </BaseNode>
  );
}
