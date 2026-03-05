import { create } from "zustand";

export const useUiStore = create((set) => ({
  selectedNodeId: null,
  rightPanel: "config", // "config" | "code" | "validate"
  leftPanelOpen: true,
  showExportDialog: false,
  showTemplatePicker: true,

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setRightPanel: (panel) => set({ rightPanel: panel }),
  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  setShowExportDialog: (show) => set({ showExportDialog: show }),
  setShowTemplatePicker: (show) => set({ showTemplatePicker: show }),
}));
