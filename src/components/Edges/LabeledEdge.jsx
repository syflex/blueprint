import { getBezierPath, EdgeLabelRenderer } from "@xyflow/react";

const semanticLabels = {
  auth_permissions: "Permissions",
  auth_context: "Auth Context",
  collection_subscriptions: "Subscribe",
  event_trigger: "Event Trigger",
  send_notification: "Notify",
  crud_operations: "CRUD",
  file_operations: "Files",
  file_references: "File Refs",
};

export default function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = semanticLabels[data?.semantic] || data?.semantic || "";

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{ ...style, strokeWidth: 2, stroke: "#97979B" }}
        markerEnd={markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="rounded-full border border-[#EDEDF0] bg-white px-2 py-0.5 text-[9px] font-medium text-[#97979B] shadow-sm"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
