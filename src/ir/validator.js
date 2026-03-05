/**
 * Validate a SystemGraph IR and return any issues.
 *
 * @param {import('./schema').SystemGraph} ir
 * @returns {{ level: 'error' | 'warning', message: string }[]}
 */
export function validateIR(ir) {
  const issues = [];

  // Database validation
  if (ir.database) {
    for (const col of ir.database.collections) {
      if (!col.name) {
        issues.push({ level: "error", message: "Collection has no name" });
      }
      if (col.fields.length === 0) {
        issues.push({
          level: "warning",
          message: `Collection "${col.name}" has no fields`,
        });
      }
      for (const field of col.fields) {
        if (!field.name) {
          issues.push({
            level: "error",
            message: `Field in collection "${col.name}" has no name`,
          });
        }
      }
    }
  }

  // Storage validation
  if (ir.storage) {
    for (const bucket of ir.storage.buckets) {
      if (!bucket.name) {
        issues.push({ level: "error", message: "Bucket has no name" });
      }
    }
  }

  // Functions validation
  for (const fn of ir.functions) {
    if (!fn.name) {
      issues.push({ level: "error", message: "Function has no name" });
    }
    if (fn.trigger === "schedule" && !fn.schedule) {
      issues.push({
        level: "warning",
        message: `Function "${fn.name}" uses schedule trigger but has no CRON expression`,
      });
    }
  }

  // Realtime requires database connection
  if (ir.realtime && !ir.database) {
    issues.push({
      level: "warning",
      message: "Realtime is configured but no Database is connected",
    });
  }

  if (ir.realtime && ir.database && ir.realtime.subscribedCollections.length === 0) {
    const hasDbToRt = ir.connections.some(
      (c) => c.sourceType === "database" && c.targetType === "realtime"
    );
    if (!hasDbToRt) {
      issues.push({
        level: "warning",
        message: "Realtime has no Database connection — it won't receive events",
      });
    }
  }

  // Functions with crud connections but no database
  const hasFnToDB = ir.connections.some(
    (c) => c.sourceType === "functions" && c.targetType === "database"
  );
  if (hasFnToDB && !ir.database) {
    issues.push({
      level: "warning",
      message: "Functions connected to Database but no Database node with collections exists",
    });
  }

  // Functions with file connections but no storage
  const hasFnToStorage = ir.connections.some(
    (c) => c.sourceType === "functions" && c.targetType === "storage"
  );
  if (hasFnToStorage && !ir.storage) {
    issues.push({
      level: "warning",
      message: "Functions connected to Storage but no Storage node with buckets exists",
    });
  }

  // Messaging requires functions connection
  if (ir.messaging) {
    const hasFnToMsg = ir.connections.some(
      (c) => c.sourceType === "functions" && c.targetType === "messaging"
    );
    if (!hasFnToMsg) {
      issues.push({
        level: "warning",
        message: "Messaging has no Functions connection — notifications require server-side triggers",
      });
    }
  }

  return issues;
}
