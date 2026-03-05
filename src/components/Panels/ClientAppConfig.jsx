const frameworks = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "vue", label: "Vue" },
  { value: "flutter", label: "Flutter" },
  { value: "reactNative", label: "React Native" },
];

export default function ClientAppConfig({ config, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        App Name
      </div>
      <input
        type="text"
        value={config.name || ""}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="web-app"
        className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#14B8A6]"
      />

      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Framework
      </div>
      <select
        value={config.framework || "react"}
        onChange={(e) => onChange({ framework: e.target.value })}
        className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#14B8A6]"
      >
        {frameworks.map((fw) => (
          <option key={fw.value} value={fw.value}>
            {fw.label}
          </option>
        ))}
      </select>
    </div>
  );
}
