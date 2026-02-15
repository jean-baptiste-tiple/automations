import { schedules, logger, metadata, retry } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const uptimeMonitor = schedules.task({
  id: "uptime-monitor",
  cron: "*/5 * * * *", // Toutes les 5 minutes
  maxDuration: 60,
  retry: {
    maxAttempts: 1, // Pas de retry pour un health check
  },
  run: async (payload) => {
    const url = "https://www.tiple.io";

    logger.info("Uptime check started", { url });
    metadata.set("status", "checking");
    metadata.set("url", url);

    const startTime = Date.now();

    // Fetch the URL
    const result = await logger.trace("fetch-website", async (span) => {
      span.setAttribute("http.url", url);

      try {
        const response = await retry.fetch(url, {
          method: "GET",
          retry: {
            maxAttempts: 2,
            condition: (response, error) => {
              return (response?.status ?? 0) >= 500;
            },
          },
        });

        const responseTime = Date.now() - startTime;
        span.setAttribute("http.status_code", response.status);
        span.setAttribute("http.response_time_ms", responseTime);

        return {
          ok: response.ok,
          status: response.status,
          responseTime,
        };
      } catch (error) {
        const responseTime = Date.now() - startTime;
        span.setAttribute("http.error", String(error));
        span.setAttribute("http.response_time_ms", responseTime);

        return {
          ok: false,
          status: 0,
          responseTime,
          error: String(error),
        };
      }
    });

    // Evaluate result
    await logger.trace("evaluate-status", async (span) => {
      span.setAttribute("site.is_up", result.ok);

      if (result.ok) {
        logger.info("Site is UP", {
          url,
          status: result.status,
          responseTime: `${result.responseTime}ms`,
        });
        metadata.set("status", "up");
        metadata.set("lastResponseTime", `${result.responseTime}ms`);
      } else {
        logger.warn("Site is DOWN", {
          url,
          status: result.status,
          responseTime: `${result.responseTime}ms`,
          error: result.error,
        });
        metadata.set("status", "down");
        metadata.set("lastError", result.error ?? `HTTP ${result.status}`);

        // TODO: ajouter notification Slack/email ici
      }
    });

    return {
      url,
      isUp: result.ok,
      status: result.status,
      responseTime: result.responseTime,
      checkedAt: new Date().toISOString(),
    };
  },
});
