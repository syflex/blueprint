import { componentRegistry, componentTypes } from "../../registry/componentRegistry";
import { useCanvasStore } from "../../store/canvasStore";

export default function ComponentLibrary() {
  const nodes = useCanvasStore((s) => s.nodes);

  function onDragStart(e, type) {
    e.dataTransfer.setData("application/blueprint-node", type);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div className="flex h-full w-56 flex-shrink-0 flex-col border-r border-[#EDEDF0] bg-white">
      <div className="border-b border-[#EDEDF0] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
          Components
        </h2>
      </div>
      <div className="flex flex-col gap-1.5 overflow-y-auto p-3">
        {componentTypes.map((type) => {
          const def = componentRegistry[type];
          const count = nodes.filter((n) => n.data.componentType === type).length;
          const atLimit = def.maxInstances !== null && count >= def.maxInstances;

          return (
            <div
              key={type}
              draggable={!atLimit}
              onDragStart={(e) => onDragStart(e, type)}
              className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 transition-colors ${
                atLimit
                  ? "cursor-not-allowed border-[#EDEDF0] bg-[#FAFAFB] opacity-50"
                  : "cursor-grab border-[#EDEDF0] bg-white hover:border-[#D8D8DB] hover:shadow-sm active:cursor-grabbing"
              }`}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${def.color}15` }}
              >
                <span
                  className={`${def.icon} text-sm`}
                  style={{ color: def.color }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#2D2D31]">
                  {def.label}
                </span>
                <span className="text-[10px] leading-tight text-[#97979B]">
                  {def.description}
                </span>
              </div>
              {atLimit && (
                <span className="ml-auto text-[10px] text-[#97979B]">
                  max
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
