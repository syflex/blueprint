import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { isConnectionValid, getConnectionSemantic } from "../registry/connectionRules";
import { componentRegistry } from "../registry/componentRegistry";

let nodeIdCounter = 0;

function generateNodeId(type) {
  nodeIdCounter += 1;
  return `${type}-${nodeIdCounter}`;
}

export const useCanvasStore = create((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return;

    const sourceType = sourceNode.data.componentType;
    const targetType = targetNode.data.componentType;

    if (!isConnectionValid(sourceType, targetType)) return;

    // Prevent duplicate connections
    const exists = edges.some(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (exists) return;

    const semantic = getConnectionSemantic(sourceType, targetType);

    const newEdge = {
      ...connection,
      id: `${connection.source}->${connection.target}`,
      type: "default",
      animated: true,
      data: semantic,
    };

    set({ edges: addEdge(newEdge, edges) });
  },

  addNode: (type, position) => {
    const def = componentRegistry[type];
    if (!def) return;

    const { nodes } = get();

    // Enforce maxInstances
    if (def.maxInstances !== null) {
      const count = nodes.filter((n) => n.data.componentType === type).length;
      if (count >= def.maxInstances) return;
    }

    const id = generateNodeId(type);
    const newNode = {
      id,
      type,
      position,
      data: {
        componentType: type,
        label: def.label,
        config: { ...def.defaultConfig },
      },
    };

    set({ nodes: [...nodes, newNode] });
    return id;
  },

  updateNodeConfig: (nodeId, configUpdates) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, config: { ...n.data.config, ...configUpdates } } }
          : n
      ),
    });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [] });
  },
}));
