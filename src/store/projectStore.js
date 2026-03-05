import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Project store — manages save/load of Blueprint projects.
 * Uses localStorage via zustand/persist for offline-first persistence.
 * When Appwrite is configured, syncs to the cloud via the appwrite layer.
 */

function generateId() {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      saving: false,

      createProject: (name = "Untitled Project") => {
        const id = generateId();
        const now = new Date().toISOString();
        const project = {
          id,
          name,
          canvas: { nodes: [], edges: [] },
          componentCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          projects: [project, ...s.projects],
          currentProjectId: id,
        }));
        return id;
      },

      saveProject: (id, { nodes, edges, name }) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...(name !== undefined ? { name } : {}),
                  canvas: { nodes, edges },
                  componentCount: nodes.length,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      loadProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        set({ currentProjectId: id });
        return project || null;
      },

      deleteProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          currentProjectId:
            s.currentProjectId === id ? null : s.currentProjectId,
        }));
      },

      renameProject: (id, name) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      setCurrentProject: (id) => set({ currentProjectId: id }),
    }),
    {
      name: "blueprint-projects",
      version: 1,
    }
  )
);
