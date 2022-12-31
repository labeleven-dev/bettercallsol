import * as Sentry from "@sentry/react";

export const sentryCaptureException = (err: unknown) => {
  console.error(err);
  try {
    Sentry.captureException(err);
  } catch (_) {
    // Sentry fails on rate limting
  }
};
