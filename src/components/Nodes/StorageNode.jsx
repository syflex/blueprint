import BaseNode from "./BaseNode";

export default function StorageNode(props) {
  const { config } = props.data;
  const buckets = config.buckets || [];

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {buckets.length > 0 ? (
          buckets.map((bucket) => (
            <div key={bucket.name} className="flex items-center gap-1.5">
              <span className="icon-folder text-[10px] text-[#00B894]" />
              <span className="text-xs text-[#2D2D31]">{bucket.name}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No buckets</span>
        )}
      </div>
    </BaseNode>
  );
}
