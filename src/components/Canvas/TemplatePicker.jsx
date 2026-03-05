import { templates } from "../../templates/templateDefinitions";
import { useCanvasStore } from "../../store/canvasStore";
import { useUiStore } from "../../store/uiStore";
import { useProjectStore } from "../../store/projectStore";

export default function TemplatePicker() {
  const loadCanvas = useCanvasStore((s) => s.loadCanvas);
  const setShowTemplatePicker = useUiStore((s) => s.setShowTemplatePicker);
  const createProject = useProjectStore((s) => s.createProject);

  const pick = (template) => {
    // Create a named project for this template
    const name = template.id === "blank" ? "Untitled Project" : `${template.name} Project`;
    createProject(name);

    if (template.nodes.length > 0) {
      loadCanvas(template.nodes, template.edges);
    }
    setShowTemplatePicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-[#EDEDF0] bg-white p-6 shadow-xl">
        <div className="mb-1 text-center">
          <h2 className="font-[Poppins] text-xl font-light text-[#2D2D31]">
            Start with a Template
          </h2>
          <p className="mt-1 text-sm text-[#97979B]">
            Pick a starting point or begin with a blank canvas
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => pick(t)}
              className="group flex cursor-pointer flex-col items-start rounded-lg border border-[#EDEDF0] bg-white p-4 text-left transition-all hover:border-[#D8D8DB] hover:shadow-sm"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${t.color}15` }}
              >
                <span
                  className={`${t.icon} text-sm`}
                  style={{ color: t.color }}
                />
              </div>
              <h3 className="text-sm font-medium text-[#2D2D31]">{t.name}</h3>
              <p className="mt-0.5 text-xs text-[#97979B]">{t.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowTemplatePicker(false)}
            className="cursor-pointer text-xs text-[#97979B] hover:text-[#2D2D31]"
          >
            Skip — I'll build from scratch
          </button>
        </div>
      </div>
    </div>
  );
}
