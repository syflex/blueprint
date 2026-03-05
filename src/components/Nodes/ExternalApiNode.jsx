import BaseNode from "./BaseNode";

export default function ExternalApiNode(props) {
  const { config } = props.data;
  const apis = config.apis || [];
  const named = apis.filter((a) => a.name);

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {named.length > 0 ? (
          named.map((api, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="icon-cloud text-[10px] text-[#F59E0B]" />
              <span className="text-xs text-[#2D2D31]">{api.name}</span>
              <span className="truncate text-[10px] text-[#97979B]">
                {api.baseUrl || "no URL"}
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No APIs configured</span>
        )}
      </div>
    </BaseNode>
  );
}
