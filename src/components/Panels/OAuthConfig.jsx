const availableProviders = [
  "google",
  "github",
  "apple",
  "microsoft",
  "discord",
  "facebook",
  "twitter",
  "spotify",
  "linkedin",
];

export default function OAuthConfig({ config, onChange }) {
  const selected = config.providers || [];

  function toggleProvider(provider) {
    const updated = selected.includes(provider)
      ? selected.filter((p) => p !== provider)
      : [...selected, provider];
    onChange({ providers: updated });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        OAuth Providers
      </div>
      <div className="flex flex-col gap-1.5">
        {availableProviders.map((provider) => (
          <label key={provider} className="flex items-center gap-2 text-xs text-[#2D2D31]">
            <input
              type="checkbox"
              checked={selected.includes(provider)}
              onChange={() => toggleProvider(provider)}
              className="accent-[#3B82F6]"
            />
            <span className="capitalize">{provider}</span>
          </label>
        ))}
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Redirect URL
      </div>
      <input
        type="text"
        value={config.redirectUrl || ""}
        onChange={(e) => onChange({ redirectUrl: e.target.value })}
        placeholder="http://localhost:3000/auth/callback"
        className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#3B82F6]"
      />
    </div>
  );
}
