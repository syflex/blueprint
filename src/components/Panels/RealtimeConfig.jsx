export default function RealtimeConfig({ config, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Realtime Settings
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#EDEDF0] px-3 py-2 hover:bg-[#FAFAFB]">
        <input
          type="checkbox"
          checked={config.autoSubscribe ?? true}
          onChange={(e) => onChange({ autoSubscribe: e.target.checked })}
          className="accent-[#0984E3]"
        />
        <div className="flex flex-col">
          <span className="text-sm text-[#2D2D31]">Auto-subscribe</span>
          <span className="text-[10px] text-[#97979B]">
            Automatically subscribe to connected collection changes
          </span>
        </div>
      </label>
      <p className="text-xs text-[#97979B]">
        Realtime requires a Database connection to subscribe to document events.
      </p>
    </div>
  );
}
