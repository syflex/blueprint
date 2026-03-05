import { Handle, Position } from "@xyflow/react";
import { componentRegistry } from "../../registry/componentRegistry";
import { useUiStore } from "../../store/uiStore";

export default function BaseNode({ id, data, children }) {
  const def = componentRegistry[data.componentType];
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const isSelected = selectedNodeId === id;

  if (!def) return null;

  const hasInputs = def.portsIn.length > 0;
  const hasOutputs = def.portsOut.length > 0;

  return (
    <div
      className="relative min-w-[180px] rounded-lg border bg-white shadow-sm transition-shadow"
      style={{
        borderColor: isSelected ? def.color : "#EDEDF0",
        boxShadow: isSelected
          ? `0 0 0 2px ${def.color}30`
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Color accent bar */}
      <div
        className="rounded-t-lg px-3 py-2"
        style={{ backgroundColor: `${def.color}10` }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`${def.icon} text-base`}
            style={{ color: def.color }}
          />
          <span className="text-sm font-medium text-[#2D2D31]">
            {def.label}
          </span>
        </div>
      </div>

      {/* Node body */}
      <div className="px-3 py-2">
        {children || (
          <p className="text-xs text-[#97979B]">{def.description}</p>
        )}
      </div>

      {/* Input handle (left side) */}
      {hasInputs && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#97979B]"
          style={{ top: "50%" }}
        />
      )}

      {/* Output handle (right side) */}
      {hasOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-white"
          style={{ top: "50%", backgroundColor: def.color }}
        />
      )}
    </div>
  );
}
