const PROVIDER_OPTIONS = [
  { value: "email", label: "Email/Password" },
  { value: "google", label: "Google" },
  { value: "github", label: "GitHub" },
  { value: "apple", label: "Apple" },
  { value: "facebook", label: "Facebook" },
  { value: "anonymous", label: "Anonymous" },
];

export default function AuthConfig({ config, onChange }) {
  const providers = config.providers || [];

  function toggleProvider(provider) {
    const updated = providers.includes(provider)
      ? providers.filter((p) => p !== provider)
      : [...providers, provider];
    onChange({ providers: updated });
  }

  function toggleGuestAccess() {
    onChange({ guestAccess: !config.guestAccess });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Providers */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#97979B]">
          Auth Providers
        </label>
        <div className="flex flex-col gap-1.5">
          {PROVIDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-[#EDEDF0] px-3 py-2 hover:bg-[#FAFAFB]"
            >
              <input
                type="checkbox"
                checked={providers.includes(opt.value)}
                onChange={() => toggleProvider(opt.value)}
                className="accent-[#FD366E]"
              />
              <span className="text-sm text-[#2D2D31]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guest Access */}
      <div>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#EDEDF0] px-3 py-2 hover:bg-[#FAFAFB]">
          <input
            type="checkbox"
            checked={config.guestAccess || false}
            onChange={toggleGuestAccess}
            className="accent-[#FD366E]"
          />
          <div className="flex flex-col">
            <span className="text-sm text-[#2D2D31]">Guest Access</span>
            <span className="text-[10px] text-[#97979B]">
              Allow unauthenticated users
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
