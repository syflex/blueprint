import { useState } from "react";
import { fieldTypes } from "../../registry/fieldTypes";

function CollectionEditor({ collection, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true);

  function updateName(name) {
    onUpdate({ ...collection, name });
  }

  function addField() {
    const fields = [...(collection.fields || [])];
    fields.push({ name: "", type: "string", required: false });
    onUpdate({ ...collection, fields });
  }

  function updateField(index, updates) {
    const fields = [...(collection.fields || [])];
    fields[index] = { ...fields[index], ...updates };
    onUpdate({ ...collection, fields });
  }

  function removeField(index) {
    const fields = (collection.fields || []).filter((_, i) => i !== index);
    onUpdate({ ...collection, fields });
  }

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
            value={collection.name}
            onChange={(e) => updateName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="collection_name"
            className="w-32 border-none bg-transparent text-sm font-medium text-[#2D2D31] outline-none placeholder:text-[#D8D8DB]"
          />
          <span className="text-[10px] text-[#97979B]">
            {collection.fields?.length || 0} fields
          </span>
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
        <div className="border-t border-[#EDEDF0] px-3 py-2">
          {(collection.fields || []).map((field, i) => (
            <div
              key={i}
              className="mb-1.5 flex items-center gap-1.5"
            >
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(i, { name: e.target.value })}
                placeholder="field_name"
                className="w-24 rounded border border-[#EDEDF0] px-2 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#6C5CE7] placeholder:text-[#D8D8DB]"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(i, { type: e.target.value })}
                className="rounded border border-[#EDEDF0] bg-white px-1.5 py-1 text-xs text-[#2D2D31] outline-none focus:border-[#6C5CE7]"
              >
                {fieldTypes.map((ft) => (
                  <option key={ft.value} value={ft.value}>
                    {ft.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-[10px] text-[#97979B]">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(i, { required: e.target.checked })}
                  className="accent-[#6C5CE7]"
                />
                req
              </label>
              <button
                onClick={() => removeField(i)}
                className="cursor-pointer text-xs text-[#D8D8DB] hover:text-[#B31212]"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addField}
            className="mt-1 cursor-pointer text-xs text-[#6C5CE7] hover:underline"
          >
            + Add field
          </button>
        </div>
      )}
    </div>
  );
}

export default function DatabaseConfig({ config, onChange }) {
  const collections = config.collections || [];

  function addCollection() {
    const updated = [
      ...collections,
      { name: `collection_${collections.length + 1}`, fields: [] },
    ];
    onChange({ collections: updated });
  }

  function updateCollection(index, collection) {
    const updated = [...collections];
    updated[index] = collection;
    onChange({ collections: updated });
  }

  function removeCollection(index) {
    onChange({ collections: collections.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Collections
      </label>
      {collections.map((col, i) => (
        <CollectionEditor
          key={i}
          collection={col}
          onUpdate={(c) => updateCollection(i, c)}
          onRemove={() => removeCollection(i)}
        />
      ))}
      <button
        onClick={addCollection}
        className="cursor-pointer rounded-md border border-dashed border-[#D8D8DB] px-3 py-2 text-sm text-[#97979B] hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
      >
        + Add Collection
      </button>
    </div>
  );
}
