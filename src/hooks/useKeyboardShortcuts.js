import { useEffect } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { useUiStore } from "../store/uiStore";

/**
 * Global keyboard shortcuts for the canvas page.
 * - Cmd/Ctrl+Z: Undo
 * - Cmd/Ctrl+Shift+Z: Redo
 * - Cmd/Ctrl+S: Save (prevent default)
 * - Cmd/Ctrl+E: Toggle export dialog
 * - Delete/Backspace: Remove selected node
 * - Escape: Deselect node
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e) {
      const isMod = e.metaKey || e.ctrlKey;
      const target = e.target;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Undo: Cmd+Z
      if (isMod && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        useCanvasStore.temporal.getState().undo();
        return;
      }

      // Redo: Cmd+Shift+Z
      if (isMod && e.shiftKey && e.key === "z") {
        e.preventDefault();
        useCanvasStore.temporal.getState().redo();
        return;
      }

      // Save: Cmd+S — just prevent default (auto-save handles persistence)
      if (isMod && e.key === "s") {
        e.preventDefault();
        return;
      }

      // Export: Cmd+E
      if (isMod && e.key === "e") {
        e.preventDefault();
        useUiStore.getState().setShowExportDialog(true);
        return;
      }

      // Don't handle the rest if inside an input
      if (isInput) return;

      // Escape: deselect
      if (e.key === "Escape") {
        useUiStore.getState().setSelectedNode(null);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
