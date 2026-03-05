const defaultRoles = ["owner", "admin", "member"];

function TeamEditor({ team, onUpdate, onRemove }) {
  function updateRoles(role, checked) {
    const roles = checked
      ? [...(team.roles || []), role]
      : (team.roles || []).filter((r) => r !== role);
    onUpdate({ ...team, roles });
  }

  return (
    <div className="rounded-md border border-[#EDEDF0] p-2">
      <div className="mb-2 flex items-center justify-between">
        <input
          type="text"
          value={team.name}
          onChange={(e) => onUpdate({ ...team, name: e.target.value })}
          placeholder="Team name"
          className="w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#8B5CF6]"
        />
        <button
          onClick={onRemove}
          className="ml-2 cursor-pointer border-none bg-transparent text-xs text-[#97979B] hover:text-[#B31212]"
        >
          ✕
        </button>
      </div>

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#97979B]">
        Roles
      </div>
      <div className="flex flex-col gap-1">
        {defaultRoles.map((role) => (
          <label key={role} className="flex items-center gap-1.5 text-xs text-[#2D2D31]">
            <input
              type="checkbox"
              checked={(team.roles || []).includes(role)}
              onChange={(e) => updateRoles(role, e.target.checked)}
              className="accent-[#8B5CF6]"
            />
            {role}
          </label>
        ))}
      </div>

      <input
        type="text"
        value={(team.customRoles || []).join(", ")}
        onChange={(e) =>
          onUpdate({
            ...team,
            customRoles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
          })
        }
        placeholder="Custom roles (comma-separated)"
        className="mt-2 w-full rounded border border-[#EDEDF0] px-2 py-1 text-xs outline-none focus:border-[#8B5CF6]"
      />
    </div>
  );
}

export default function TeamsConfig({ config, onChange }) {
  const teams = config.teams || [];

  function updateTeam(index, updated) {
    const next = [...teams];
    next[index] = updated;
    onChange({ teams: next });
  }

  function removeTeam(index) {
    onChange({ teams: teams.filter((_, i) => i !== index) });
  }

  function addTeam() {
    onChange({
      teams: [...teams, { name: "", roles: ["owner", "admin", "member"], customRoles: [] }],
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#97979B]">
        Teams
      </div>
      {teams.map((team, i) => (
        <TeamEditor
          key={i}
          team={team}
          onUpdate={(t) => updateTeam(i, t)}
          onRemove={() => removeTeam(i)}
        />
      ))}
      <button
        onClick={addTeam}
        className="cursor-pointer border-none bg-transparent text-left text-xs text-[#8B5CF6] hover:underline"
      >
        + Add team
      </button>
    </div>
  );
}
