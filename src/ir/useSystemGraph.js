import { useMemo } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { compileToIR } from "./compiler";
import { validateIR } from "./validator";

/**
 * Derives the System Graph IR from the current canvas state.
 * Returns the compiled IR and any validation issues.
 */
export function useSystemGraph() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);

  const ir = useMemo(() => compileToIR(nodes, edges), [nodes, edges]);
  const issues = useMemo(() => validateIR(ir), [ir]);

  return { ir, issues };
}
