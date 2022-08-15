import * as Sentry from "@sentry/react";

export const sentryCaptureException = (err: unknown) => {
  try {
    Sentry.captureException(err);
  } catch (_) {
    // Sentry fails on rate limting
    console.error(err);
  }
};
