const CHANNEL_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "push", label: "Push Notifications" },
  { value: "sms", label: "SMS" },
];

export default function MessagingConfig({ config, onChange }) {
  const channels = config.channels || [];

  function toggleChannel(channel) {
    const updated = channels.includes(channel)
      ? channels.filter((c) => c !== channel)
      : [...channels, channel];
    onChange({ channels: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Messaging Channels
      </label>
      <div className="flex flex-col gap-1.5">
        {CHANNEL_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-[#EDEDF0] px-3 py-2 hover:bg-[#FAFAFB]"
          >
            <input
              type="checkbox"
              checked={channels.includes(opt.value)}
              onChange={() => toggleChannel(opt.value)}
              className="accent-[#E17055]"
            />
            <span className="text-sm text-[#2D2D31]">{opt.label}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-[#97979B]">
        Messaging requires a Functions connection to send notifications server-side.
      </p>
    </div>
  );
}
