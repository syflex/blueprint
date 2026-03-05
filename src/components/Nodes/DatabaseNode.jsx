import BaseNode from "./BaseNode";

export default function DatabaseNode(props) {
  const { config } = props.data;
  const collections = config.collections || [];

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {collections.length > 0 ? (
          collections.map((col) => (
            <div key={col.name} className="flex items-center gap-1.5">
              <span className="icon-document text-[10px] text-[#6C5CE7]" />
              <span className="text-xs text-[#2D2D31]">{col.name}</span>
              <span className="text-[10px] text-[#97979B]">
                ({col.fields?.length || 0} fields)
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No collections</span>
        )}
      </div>
    </BaseNode>
  );
}
