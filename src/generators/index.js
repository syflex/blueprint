import { generateAppwriteClient } from "./shared/appwriteClientGenerator";
import { generateEnv } from "./shared/envGenerator";
import { generatePackageJson } from "./shared/packageJsonGenerator";
import { generateAuthFiles } from "./auth/authSetupGenerator";
import { generateCollectionSetup } from "./database/collectionSetupGenerator";
import { generateCrudHooks } from "./database/crudHookGenerator";
import { generateTypes } from "./database/typeGenerator";
import { generateStorageFiles } from "./storage/storageGenerator";
import { generateFunctionScaffolds } from "./functions/functionScaffoldGenerator";
import { generateValidationSchemas } from "./database/validationSchemaGenerator";
import { generateRealtimeFiles } from "./realtime/realtimeHookGenerator";
import { generateMessagingFiles } from "./messaging/messagingHelperGenerator";
import { generateReadme } from "./shared/readmeGenerator";

/**
 * Generate all files from a SystemGraph IR.
 *
 * @param {import('../ir/schema').SystemGraph} ir
 * @returns {{ path: string, content: string, language: string }[]}
 */
export function generateFiles(ir) {
  const files = [];

  // Shared files (always generated)
  files.push(...generateAppwriteClient(ir));
  files.push(...generateEnv());
  files.push(...generatePackageJson(ir));

  // Auth
  if (ir.auth) {
    files.push(...generateAuthFiles(ir.auth));
  }

  // Database
  if (ir.database) {
    files.push(...generateCollectionSetup(ir.database));
    files.push(...generateCrudHooks(ir.database));
    files.push(...generateTypes(ir.database));
    files.push(...generateValidationSchemas(ir.database));
  }

  // Storage
  if (ir.storage) {
    files.push(...generateStorageFiles(ir.storage));
  }

  // Functions
  if (ir.functions.length > 0) {
    files.push(...generateFunctionScaffolds(ir.functions));
  }

  // Realtime
  if (ir.realtime) {
    files.push(...generateRealtimeFiles(ir.realtime, ir.database));
  }

  // Messaging
  if (ir.messaging) {
    files.push(...generateMessagingFiles(ir.messaging));
  }

  // README
  files.push(...generateReadme(ir));

  return files;
}
