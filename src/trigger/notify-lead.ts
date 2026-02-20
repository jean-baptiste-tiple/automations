import { schemaTask, logger, metadata } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { sendAlert } from "../services/slack";

const payloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  source: z.enum(["website", "referral", "ads", "other"]).default("other"),
});

export const notifyLead = schemaTask({
  id: "notify-lead",
  schema: payloadSchema,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30_000,
  },
  run: async (payload) => {
    const alertChannel = process.env.SLACK_ALERTS_CHANNEL;
    if (!alertChannel) throw new Error("SLACK_ALERTS_CHANNEL is required");

    logger.info("New lead received", {
      name: payload.name,
      email: payload.email,
      source: payload.source,
    });
    metadata.set("status", "processing");
    metadata.set("leadEmail", payload.email);

    // Build lead summary
    const fields: Record<string, string> = {
      Name: payload.name,
      Email: payload.email,
      Source: payload.source,
    };
    if (payload.company) {
      fields["Company"] = payload.company;
    }

    // Send Slack notification
    const result = await logger.trace("send-slack-notification", async (span) => {
      span.setAttribute("lead.email", payload.email);
      span.setAttribute("lead.source", payload.source);

      const slackResult = await sendAlert({
        channel: alertChannel,
        title: "New Lead",
        message: `New lead from *${payload.source}*: *${payload.name}* (${payload.email})`,
        status: "ok",
        fields,
      });

      span.setAttribute("slack.message_ts", slackResult.ts);
      return slackResult;
    });

    metadata.set("status", "completed");
    logger.info("Lead notification sent", { slackTs: result.ts });

    return {
      success: true,
      leadEmail: payload.email,
      slackMessageTs: result.ts,
      notifiedAt: new Date().toISOString(),
    };
  },
});
