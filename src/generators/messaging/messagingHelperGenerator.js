/**
 * Generates messaging helper utilities.
 */
export function generateMessagingFiles(messagingIR) {
  if (!messagingIR || messagingIR.channels.length === 0) return [];

  return [
    {
      path: "src/lib/messaging.ts",
      content: `// Messaging configuration
// Channels: ${messagingIR.channels.join(", ")}
//
// Note: Messaging in Appwrite is server-side only.
// These helpers are meant to be used in Appwrite Functions.
// The client-side app receives notifications via push/email/sms.

export const MESSAGING_CHANNELS = ${JSON.stringify(messagingIR.channels, null, 2)} as const;

export type MessagingChannel = typeof MESSAGING_CHANNELS[number];

/**
 * Server-side helper to send a message via Appwrite Messaging.
 * Use this inside an Appwrite Function.
 *
 * Example:
 *   import { Messaging } from "node-appwrite";
 *   const messaging = new Messaging(client);
 *   await sendNotification(messaging, "email", ["user-id"], "Subject", "Body");
 */
export async function sendNotification(
  messaging: any,
  channel: MessagingChannel,
  userIds: string[],
  subject: string,
  body: string
) {
  switch (channel) {
    case "email":
      return messaging.createEmail({
        messageId: crypto.randomUUID(),
        subject,
        content: body,
        users: userIds,
      });
    case "push":
      return messaging.createPush({
        messageId: crypto.randomUUID(),
        title: subject,
        body,
        users: userIds,
      });
    case "sms":
      return messaging.createSms({
        messageId: crypto.randomUUID(),
        content: body,
        users: userIds,
      });
    default:
      throw new Error(\`Unknown messaging channel: \${channel}\`);
  }
}
`,
      language: "typescript",
    },
  ];
}
