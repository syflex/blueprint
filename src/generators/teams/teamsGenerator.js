/**
 * Generate Teams setup script and hooks.
 * @param {import('../../ir/schema').TeamsIR} teamsIR
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateTeamsFiles(teamsIR) {
  if (!teamsIR || teamsIR.teams.length === 0) return [];

  const files = [];

  // Setup script
  const setupLines = teamsIR.teams.map((team) => {
    const allRoles = [...team.roles, ...team.customRoles].map((r) => `"${r}"`).join(", ");
    return `  // Create team: ${team.name}
  try {
    await teams.create("${team.id}", "${team.name}");
    console.log("Created team: ${team.name}");
  } catch (e) {
    if (e.code === 409) console.log("Team ${team.name} already exists");
    else throw e;
  }`;
  });

  files.push({
    path: "scripts/setup-teams.ts",
    content: `import { Client, Teams } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const teams = new Teams(client);

async function setupTeams() {
${setupLines.join("\n\n")}
}

setupTeams().then(() => console.log("Teams setup complete"));
`,
    language: "typescript",
  });

  // useTeams hook
  files.push({
    path: "src/hooks/useTeams.ts",
    content: `import { useCallback, useEffect, useState } from "react";
import { teams } from "../lib/appwrite";
import type { Models } from "appwrite";

export function useTeams() {
  const [teamList, setTeamList] = useState<Models.Team<Models.Preferences>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teams.list();
      setTeamList(response.teams);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (name: string, roles?: string[]) => {
    const team = await teams.create("unique()", name, roles);
    setTeamList((prev) => [...prev, team]);
    return team;
  }, []);

  const invite = useCallback(async (teamId: string, email: string, roles: string[]) => {
    return await teams.createMembership(teamId, roles, email);
  }, []);

  const remove = useCallback(async (teamId: string) => {
    await teams.delete(teamId);
    setTeamList((prev) => prev.filter((t) => t.$id !== teamId));
  }, []);

  useEffect(() => { list(); }, [list]);

  return { teams: teamList, loading, error, list, create, invite, remove };
}
`,
    language: "typescript",
  });

  return files;
}
