/**
 * Generates realtime subscription hooks.
 */
export function generateRealtimeFiles(realtimeIR, databaseIR) {
  if (!realtimeIR) return [];

  const collections = databaseIR?.collections || [];
  const subscribeToAll = realtimeIR.autoSubscribe && collections.length > 0;

  return [
    {
      path: "src/hooks/useRealtime.ts",
      content: `import { useEffect, useRef, useCallback } from "react";
import { client } from "../lib/appwrite";

type RealtimeEvent = {
  events: string[];
  payload: any;
};

type Unsubscribe = () => void;

/**
 * Subscribe to Appwrite Realtime events.
 * @param channels - Array of channel strings, e.g. ["databases.main.collections.posts.documents"]
 * @param callback - Called when an event occurs
 */
export function useRealtime(
  channels: string[],
  callback: (event: RealtimeEvent) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (channels.length === 0) return;

    const unsubscribe: Unsubscribe = client.subscribe(channels, (response) => {
      callbackRef.current({
        events: response.events,
        payload: response.payload,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [channels.join(",")]);
}
${subscribeToAll ? `
/**
 * Pre-configured hook to subscribe to all collection changes.
 */
export function useCollectionRealtime(
  callback: (event: RealtimeEvent) => void
) {
  const channels = [
${collections.map((c) => `    "databases.main.collections.${c.id}.documents",`).join("\n")}
  ];

  useRealtime(channels, callback);
}
` : ""}`,
      language: "typescript",
    },
  ];
}
