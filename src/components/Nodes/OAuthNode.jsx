import BaseNode from "./BaseNode";

export default function OAuthNode(props) {
  const { config } = props.data;
  const providers = config.providers || [];

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {providers.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {providers.map((p) => (
              <span
                key={p}
                className="rounded bg-[#3B82F6]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#3B82F6]"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-[#97979B]">No providers selected</span>
        )}
      </div>
    </BaseNode>
  );
}
