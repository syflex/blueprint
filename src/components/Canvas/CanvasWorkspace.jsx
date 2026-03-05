import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "../Nodes/nodeTypes";
import { useCanvasStore } from "../../store/canvasStore";
import { useUiStore } from "../../store/uiStore";
import { componentRegistry } from "../../registry/componentRegistry";

function CanvasInner() {
  const reactFlowWrapper = useRef(null);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const setSelectedNode = useUiStore((s) => s.setSelectedNode);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/blueprint-node");
      if (!type || !componentRegistry[type]) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      // Calculate position relative to the canvas viewport
      const position = {
        x: e.clientX - bounds.left - 90,
        y: e.clientY - bounds.top - 30,
      };

      const nodeId = addNode(type, position);
      if (nodeId) {
        setSelectedNode(nodeId);
      }
    },
    [addNode, setSelectedNode]
  );

  const onNodeClick = useCallback(
    (_event, node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView={false}
        deleteKeyCode={["Backspace", "Delete"]}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2, stroke: "#97979B" },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E0E0E0" gap={20} size={1} />
        <Controls
          position="bottom-left"
          className="!border-[#EDEDF0] !bg-white !shadow-sm"
        />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            const def = componentRegistry[node.data?.componentType];
            return def?.color || "#97979B";
          }}
          maskColor="rgba(250, 250, 251, 0.7)"
          className="!border-[#EDEDF0] !bg-white"
        />
      </ReactFlow>
    </div>
  );
}

export default function CanvasWorkspace() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
