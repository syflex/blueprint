import BaseNode from "./BaseNode";

export default function FunctionsNode(props) {
  const { config } = props.data;
  const fns = config.functions || [];

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {fns.length > 0 ? (
          fns.map((fn) => (
            <div key={fn.name} className="flex items-center gap-1.5">
              <span className="icon-lightning-bolt text-[10px] text-[#FDCB6E]" />
              <span className="text-xs text-[#2D2D31]">{fn.name}</span>
              <span className="text-[10px] text-[#97979B]">{fn.trigger}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No functions</span>
        )}
      </div>
    </BaseNode>
  );
}
