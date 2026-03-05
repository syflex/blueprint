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

  // Teams without Auth
  if (ir.teams && !ir.auth) {
    issues.push({
      level: "warning",
      message: "Teams requires Auth — users must authenticate before joining teams",
    });
  }

  // OAuth without Auth
  if (ir.oauth && !ir.auth) {
    issues.push({
      level: "error",
      message: "OAuth must connect to Auth — OAuth sessions require the Auth service",
    });
  }

  // OAuth with no providers selected
  if (ir.oauth && ir.oauth.providers.length === 0) {
    issues.push({
      level: "warning",
      message: "OAuth has no providers selected — enable at least one OAuth provider",
    });
  }

  // Webhooks with no events configured
  if (ir.webhooks) {
    for (const wh of ir.webhooks.webhooks) {
      if (wh.events.length === 0) {
        issues.push({
          level: "warning",
          message: `Webhook "${wh.name}" has no events — it won't be triggered`,
        });
      }
      if (!wh.url) {
        issues.push({
          level: "error",
          message: `Webhook "${wh.name}" has no URL`,
        });
      }
    }
  }

  // External API validation
  for (const api of ir.externalApis) {
    if (!api.baseUrl) {
      issues.push({
        level: "error",
        message: `External API "${api.name}" has no base URL`,
      });
    }
  }

  // Payment Gateway without Functions
  if (ir.paymentGateway) {
    const hasFnToPayment = ir.connections.some(
      (c) =>
        (c.sourceType === "functions" && c.targetType === "paymentGateway") ||
        (c.sourceType === "paymentGateway" && c.targetType === "functions")
    );
    if (!hasFnToPayment) {
      issues.push({
        level: "warning",
        message: "Payment Gateway has no Functions connection — payments require server-side processing",
      });
    }
  }

  // Client App without Auth
  for (const app of ir.clientApps) {
    const hasAuthConn = ir.connections.some(
      (c) =>
        (c.sourceType === "clientApp" && c.targetType === "auth") ||
        (c.sourceType === "auth" && c.targetType === "clientApp")
    );
    if (!hasAuthConn && ir.auth) {
      issues.push({
        level: "warning",
        message: `Client App "${app.name}" is not connected to Auth — users won't be able to sign in`,
      });
    }
  }

  return issues;
}
