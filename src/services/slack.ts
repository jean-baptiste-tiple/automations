import { retry } from "@trigger.dev/sdk/v3";

// ============================================================
// Types
// ============================================================

export interface SlackMessageInput {
  channel: string;
  text: string;
  blocks?: SlackBlock[];
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: Array<{ type: string; text: string; emoji?: boolean }>;
  fields?: Array<{ type: string; text: string }>;
}

export interface SlackMessageResult {
  ok: boolean;
  channel: string;
  ts: string;
}

// ============================================================
// Helpers
// ============================================================

function getToken(): string {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("SLACK_BOT_TOKEN is required");
  return token;
}

// ============================================================
// Operations
// ============================================================

/**
 * Send a message to a Slack channel
 */
export async function sendMessage(input: SlackMessageInput): Promise<SlackMessageResult> {
  const response = await retry.fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: input.channel,
      text: input.text,
      blocks: input.blocks,
    }),
    retry: {
      maxAttempts: 3,
      condition: (response) => {
        return response?.status === 429 || (response?.status ?? 0) >= 500;
      },
    },
  });

  const data = await response.json() as SlackMessageResult & { error?: string };

  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }

  return data;
}

/**
 * Send an alert message with colored sidebar (attachment-style via blocks)
 */
export async function sendAlert(input: {
  channel: string;
  title: string;
  message: string;
  status: "ok" | "warning" | "error";
  fields?: Record<string, string>;
}): Promise<SlackMessageResult> {
  const emoji = { ok: ":white_check_mark:", warning: ":warning:", error: ":rotating_light:" };

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `${emoji[input.status]} ${input.title}`, emoji: true },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: input.message },
    },
  ];

  if (input.fields && Object.keys(input.fields).length > 0) {
    blocks.push({
      type: "section",
      fields: Object.entries(input.fields).map(([key, value]) => ({
        type: "mrkdwn",
        text: `*${key}:*\n${value}`,
      })),
    });
  }

  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `Tiple Automations | ${new Date().toISOString()}` }],
  });

  return sendMessage({
    channel: input.channel,
    text: `${emoji[input.status]} ${input.title}: ${input.message}`,
    blocks,
  });
}
