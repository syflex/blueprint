import BaseNode from "./BaseNode";

export default function TeamsNode(props) {
  const { config } = props.data;
  const teams = config.teams || [];
  const named = teams.filter((t) => t.name);

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-1">
        {named.length > 0 ? (
          named.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="icon-user-group text-[10px] text-[#8B5CF6]" />
              <span className="text-xs text-[#2D2D31]">{t.name}</span>
              <span className="text-[10px] text-[#97979B]">
                {t.roles?.length || 0} roles
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-[#97979B]">No teams configured</span>
        )}
      </div>
    </BaseNode>
  );
}
