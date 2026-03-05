import { useState } from "react";

const TRIGGER_OPTIONS = [
  { value: "http", label: "HTTP" },
  { value: "schedule", label: "Schedule (CRON)" },
  { value: "event", label: "Event Trigger" },
];

const RUNTIME_OPTIONS = [
  { value: "node-18.0", label: "Node.js 18" },
  { value: "node-21.0", label: "Node.js 21" },
  { value: "python-3.11", label: "Python 3.11" },
  { value: "dart-3.1", label: "Dart 3.1" },
  { value: "bun-1.0", label: "Bun 1.0" },
];

function FunctionEditor({ fn, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-md border border-[#EDEDF0] bg-white">
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-[#FAFAFB]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#97979B]">
            {expanded ? "▼" : "▶"}
          </span>
          <input
            type="text"
            value={fn.name}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate({ ...fn, name: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="function_name"
            className="w-32 border-none bg-transparent text-sm font-medium text-[#2D2D31] outline-none placeholder:text-[#D8D8DB]"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="cursor-pointer text-xs text-[#97979B] hover:text-[#B31212]"
        >
          Remove
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 border-t border-[#EDEDF0] px-3 py-2">
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">Trigger</label>
            <select
              value={fn.trigger || "http"}
              onChange={(e) => onUpdate({ ...fn, trigger: e.target.value })}
              className="w-full rounded border border-[#EDEDF0] bg-white px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E]"
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {fn.trigger === "schedule" && (
            <div>
              <label className="mb-1 block text-[10px] text-[#97979B]">
                CRON Schedule
              </label>
              <input
                type="text"
                value={fn.schedule || ""}
                onChange={(e) => onUpdate({ ...fn, schedule: e.target.value })}
                placeholder="*/30 * * * *"
                className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E] placeholder:text-[#D8D8DB]"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">Runtime</label>
            <select
              value={fn.runtime || "node-18.0"}
              onChange={(e) => onUpdate({ ...fn, runtime: e.target.value })}
              className="w-full rounded border border-[#EDEDF0] bg-white px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E]"
            >
              {RUNTIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">Timeout (seconds)</label>
            <input
              type="number"
              min={1}
              max={900}
              value={fn.timeout || 15}
              onChange={(e) => onUpdate({ ...fn, timeout: Number(e.target.value) })}
              className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">Memory (MB)</label>
            <select
              value={fn.memory || 128}
              onChange={(e) => onUpdate({ ...fn, memory: Number(e.target.value) })}
              className="w-full rounded border border-[#EDEDF0] bg-white px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E]"
            >
              <option value={128}>128 MB</option>
              <option value={256}>256 MB</option>
              <option value={512}>512 MB</option>
              <option value={1024}>1024 MB</option>
            </select>
          </div>
          {/* Environment Variables */}
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">Environment Variables</label>
            {(fn.envVars || []).map((env, i) => (
              <div key={i} className="mb-1.5 flex items-center gap-1">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => {
                    const envVars = [...(fn.envVars || [])];
                    envVars[i] = { ...envVars[i], key: e.target.value };
                    onUpdate({ ...fn, envVars });
                  }}
                  placeholder="KEY"
                  className="w-20 rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E] placeholder:text-[#D8D8DB]"
                />
                <span className="text-[10px] text-[#97979B]">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => {
                    const envVars = [...(fn.envVars || [])];
                    envVars[i] = { ...envVars[i], value: e.target.value };
                    onUpdate({ ...fn, envVars });
                  }}
                  placeholder="value"
                  className="flex-1 rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#FDCB6E] placeholder:text-[#D8D8DB]"
                />
                <button
                  onClick={() => {
                    const envVars = (fn.envVars || []).filter((_, j) => j !== i);
                    onUpdate({ ...fn, envVars });
                  }}
                  className="cursor-pointer text-xs text-[#D8D8DB] hover:text-[#B31212]"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const envVars = [...(fn.envVars || []), { key: "", value: "" }];
                onUpdate({ ...fn, envVars });
              }}
              className="cursor-pointer text-xs text-[#FDCB6E] hover:underline"
            >
              + Add variable
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FunctionsConfig({ config, onChange }) {
  const fns = config.functions || [];

  function addFunction() {
    onChange({
      functions: [
        ...fns,
        { name: "", trigger: "http", runtime: "node-18.0", schedule: "" },
      ],
    });
  }

  function updateFunction(index, fn) {
    const updated = [...fns];
    updated[index] = fn;
    onChange({ functions: updated });
  }

  function removeFunction(index) {
    onChange({ functions: fns.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Functions
      </label>
      {fns.map((fn, i) => (
        <FunctionEditor
          key={i}
          fn={fn}
          onUpdate={(f) => updateFunction(i, f)}
          onRemove={() => removeFunction(i)}
        />
      ))}
      <button
        onClick={addFunction}
        className="cursor-pointer rounded-md border border-dashed border-[#D8D8DB] px-3 py-2 text-sm text-[#97979B] hover:border-[#FDCB6E] hover:text-[#FDCB6E]"
      >
        + Add Function
      </button>
    </div>
  );
}
