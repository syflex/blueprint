const authMethods = [
  { value: "api_key", label: "API Key" },
  { value: "bearer", label: "Bearer Token" },
  { value: "oauth", label: "OAuth 2.0" },
  { value: "none", label: "None" },
];

function ApiEditor({ api, onUpdate, onRemove }) {
  const headers = api.headers || [];

  function updateHeader(index, key, value) {
    const next = [...headers];
    next[index] = { ...next[index], [key]: value };
    onUpdate({ ...api, headers: next });
  }

  function removeHeader(index) {
    onUpdate({ ...api, headers: headers.filter((_, i) => i !== index) });
  }

  function addHeader() {
    onUpdate({ ...api, headers: [...headers, { key: "", value: "" }] });
  }

  return (
    <div className="rounded-md border border-[#EDEDF0] p-2">
      <div className="mb-2 flex items-center justify-between">
        <input
          type="text"
          value={api.name}
          onChange={(e) => onUpdate({ ...api, name: e.target.value })}
          placeholder="API name"
          className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#F59E0B]"
        />
        <button
          onClick={onRemove}
          className="ml-2 cursor-pointer border-none bg-transparent text-xs text-[#97979B] hover:text-[#B31212]"
        >
          ✕
        </button>
      </div>

      <input
        type="text"
        value={api.baseUrl || ""}
        onChange={(e) => onUpdate({ ...api, baseUrl: e.target.value })}
        placeholder="https://api.example.com/v1"
        className="mb-2 w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#F59E0B]"
      />

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
        Auth Method
      </div>
      <select
        value={api.authMethod || "api_key"}
        onChange={(e) => onUpdate({ ...api, authMethod: e.target.value })}
        className="mb-2 w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#F59E0B]"
      >
        {authMethods.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
        Headers
      </div>
      {headers.map((h, i) => (
        <div key={i} className="mb-1 flex items-center gap-1">
          <input
            value={h.key}
            onChange={(e) => updateHeader(i, "key", e.target.value)}
            placeholder="Key"
            className="w-1/3 rounded border border-[#EDEDF0] px-1.5 py-0.5 text-[10px] outline-none"
          />
          <input
            value={h.value}
            onChange={(e) => updateHeader(i, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 rounded border border-[#EDEDF0] px-1.5 py-0.5 text-[10px] outline-none"
          />
          <button
            onClick={() => removeHeader(i)}
            className="cursor-pointer border-none bg-transparent text-[10px] text-[#97979B] hover:text-[#B31212]"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addHeader}
        className="cursor-pointer border-none bg-transparent text-[10px] text-[#F59E0B] hover:underline"
      >
        + Add header
      </button>
    </div>
  );
}

export default function ExternalApiConfig({ config, onChange }) {
  const apis = config.apis || [];

  function updateApi(index, updated) {
    const next = [...apis];
    next[index] = updated;
    onChange({ apis: next });
  }

  function removeApi(index) {
    onChange({ apis: apis.filter((_, i) => i !== index) });
  }

  function addApi() {
    onChange({
      apis: [...apis, { name: "", baseUrl: "", authMethod: "api_key", headers: [] }],
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        External APIs
      </div>
      {apis.map((api, i) => (
        <ApiEditor
          key={i}
          api={api}
          onUpdate={(a) => updateApi(i, a)}
          onRemove={() => removeApi(i)}
        />
      ))}
      <button
        onClick={addApi}
        className="cursor-pointer border-none bg-transparent text-left text-xs text-[#F59E0B] hover:underline"
      >
        + Add API
      </button>
    </div>
  );
}
