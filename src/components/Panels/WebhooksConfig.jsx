const eventOptions = [
  "databases.*.collections.*.documents.*.create",
  "databases.*.collections.*.documents.*.update",
  "databases.*.collections.*.documents.*.delete",
  "users.*.create",
  "users.*.update",
  "users.*.delete",
  "users.*.sessions.*.create",
  "storage.*.files.*.create",
  "storage.*.files.*.update",
  "storage.*.files.*.delete",
  "functions.*.executions.*.create",
  "teams.*.memberships.*.create",
];

function WebhookEditor({ webhook, onUpdate, onRemove }) {
  function toggleEvent(event) {
    const events = webhook.events || [];
    const updated = events.includes(event)
      ? events.filter((e) => e !== event)
      : [...events, event];
    onUpdate({ ...webhook, events: updated });
  }

  return (
    <div className="rounded-md border border-[#EDEDF0] p-2">
      <div className="mb-2 flex items-center justify-between">
        <input
          type="text"
          value={webhook.name}
          onChange={(e) => onUpdate({ ...webhook, name: e.target.value })}
          placeholder="Webhook name"
          className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#EF4444]"
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
        value={webhook.url || ""}
        onChange={(e) => onUpdate({ ...webhook, url: e.target.value })}
        placeholder="https://example.com/webhook"
        className="mb-2 w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#EF4444]"
      />

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
        Events
      </div>
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
        {eventOptions.map((event) => (
          <label key={event} className="flex items-center gap-1.5 text-[10px] text-[#2D2D31]">
            <input
              type="checkbox"
              checked={(webhook.events || []).includes(event)}
              onChange={() => toggleEvent(event)}
              className="accent-[#EF4444]"
            />
            <span className="font-mono">{event.replace(/\.\*\./g, ".")}</span>
          </label>
        ))}
      </div>

      <label className="mt-2 flex items-center gap-1.5 text-xs text-[#2D2D31]">
        <input
          type="checkbox"
          checked={webhook.signatureSecret || false}
          onChange={(e) => onUpdate({ ...webhook, signatureSecret: e.target.checked })}
          className="accent-[#EF4444]"
        />
        Require signature verification
      </label>
    </div>
  );
}

export default function WebhooksConfig({ config, onChange }) {
  const webhooks = config.webhooks || [];

  function updateWebhook(index, updated) {
    const next = [...webhooks];
    next[index] = updated;
    onChange({ webhooks: next });
  }

  function removeWebhook(index) {
    onChange({ webhooks: webhooks.filter((_, i) => i !== index) });
  }

  function addWebhook() {
    onChange({
      webhooks: [...webhooks, { name: "", url: "", events: [], signatureSecret: false }],
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Webhooks
      </div>
      {webhooks.map((wh, i) => (
        <WebhookEditor
          key={i}
          webhook={wh}
          onUpdate={(w) => updateWebhook(i, w)}
          onRemove={() => removeWebhook(i)}
        />
      ))}
      <button
        onClick={addWebhook}
        className="cursor-pointer border-none bg-transparent text-left text-xs text-[#EF4444] hover:underline"
      >
        + Add webhook
      </button>
    </div>
  );
}
