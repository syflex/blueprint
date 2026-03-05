import BaseNode from "./BaseNode";

export default function RealtimeNode(props) {
  const { config } = props.data;

  return (
    <BaseNode {...props}>
      <span className="text-xs text-[#97979B]">
        {config.autoSubscribe ? "Auto-subscribe enabled" : "Manual subscriptions"}
      </span>
    </BaseNode>
  );
}
