import { useState } from "react";

function BucketEditor({ bucket, onUpdate, onRemove }) {
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
            value={bucket.name}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate({ ...bucket, name: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="bucket_name"
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
            <label className="mb-1 block text-[10px] text-[#97979B]">Permissions</label>
            <select
              value={bucket.permissionPreset || "auth_read"}
              onChange={(e) => onUpdate({ ...bucket, permissionPreset: e.target.value })}
              className="w-full rounded border border-[#EDEDF0] bg-white px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#00B894]"
            >
              <option value="public_read">Public read (anyone can download)</option>
              <option value="auth_read">Authenticated read</option>
              <option value="admin_only">Admin only</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">
              Allowed file types (comma-separated)
            </label>
            <input
              type="text"
              value={(bucket.allowedTypes || []).join(", ")}
              onChange={(e) =>
                onUpdate({
                  ...bucket,
                  allowedTypes: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="image/png, image/jpeg, application/pdf"
              className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#00B894] placeholder:text-[#D8D8DB]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[#97979B]">
              Max file size (bytes)
            </label>
            <input
              type="number"
              value={bucket.maxSize || ""}
              onChange={(e) =>
                onUpdate({
                  ...bucket,
                  maxSize: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="10000000"
              className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#00B894] placeholder:text-[#D8D8DB]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StorageConfig({ config, onChange }) {
  const buckets = config.buckets || [];

  function addBucket() {
    onChange({
      buckets: [
        ...buckets,
        { name: `bucket_${buckets.length + 1}`, allowedTypes: [], maxSize: null },
      ],
    });
  }

  function updateBucket(index, bucket) {
    const updated = [...buckets];
    updated[index] = bucket;
    onChange({ buckets: updated });
  }

  function removeBucket(index) {
    onChange({ buckets: buckets.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Buckets
      </label>
      {buckets.map((bucket, i) => (
        <BucketEditor
          key={i}
          bucket={bucket}
          onUpdate={(b) => updateBucket(i, b)}
          onRemove={() => removeBucket(i)}
        />
      ))}
      <button
        onClick={addBucket}
        className="cursor-pointer rounded-md border border-dashed border-[#D8D8DB] px-3 py-2 text-sm text-[#97979B] hover:border-[#00B894] hover:text-[#00B894]"
      >
        + Add Bucket
      </button>
    </div>
  );
}
