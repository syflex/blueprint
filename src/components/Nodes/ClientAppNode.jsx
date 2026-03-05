import BaseNode from "./BaseNode";

const frameworkLabels = {
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  flutter: "Flutter",
  reactNative: "React Native",
};

export default function ClientAppNode(props) {
  const { config } = props.data;

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="icon-device-mobile text-[10px] text-[#14B8A6]" />
          <span className="text-xs font-medium text-[#2D2D31]">
            {config.name || "web-app"}
          </span>
        </div>
        <span className="rounded bg-[#14B8A6]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#14B8A6] w-fit">
          {frameworkLabels[config.framework] || config.framework}
        </span>
      </div>
    </BaseNode>
  );
}
