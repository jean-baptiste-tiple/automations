import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@trigger.dev/sdk/v3", () => ({
  retry: {
    fetch: vi.fn(),
  },
}));

import { retry } from "@trigger.dev/sdk/v3";
import { sendMessage, sendAlert } from "./slack";

const mockFetch = vi.mocked(retry.fetch);

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

describe("slack service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SLACK_BOT_TOKEN = "xoxb-test-token";
  });

  // ---- Env var validation ----

  it("should throw if SLACK_BOT_TOKEN is missing", async () => {
    delete process.env.SLACK_BOT_TOKEN;

    await expect(
      sendMessage({ channel: "#test", text: "hello" })
    ).rejects.toThrow("SLACK_BOT_TOKEN is required");
  });

  // ---- sendMessage ----

  describe("sendMessage", () => {
    it("should call Slack API with correct headers and body", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({ ok: true, channel: "C123", ts: "1234.5678" })
      );

      await sendMessage({ channel: "#general", text: "Hello" });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer xoxb-test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: "#general",
            text: "Hello",
          }),
        })
      );
    });

    it("should return channel and ts on success", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({ ok: true, channel: "C123", ts: "1234.5678" })
      );

      const result = await sendMessage({ channel: "#general", text: "Hello" });

      expect(result).toEqual(
        expect.objectContaining({ ok: true, channel: "C123", ts: "1234.5678" })
      );
    });

    it("should throw on Slack API error", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({ ok: false, error: "channel_not_found" })
      );

      await expect(
        sendMessage({ channel: "#bad", text: "Hello" })
      ).rejects.toThrow("Slack API error: channel_not_found");
    });
  });

  // ---- sendAlert ----

  describe("sendAlert", () => {
    it("should send formatted alert with fields", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({ ok: true, channel: "C123", ts: "9999.0000" })
      );

      const result = await sendAlert({
        channel: "#alerts",
        title: "Test Alert",
        message: "Something happened",
        status: "warning",
        fields: { Key: "Value" },
      });

      expect(result.ok).toBe(true);
      expect(result.ts).toBe("9999.0000");

      // Verify the body includes blocks
      const callBody = JSON.parse(mockFetch.mock.calls[0][1]!.body as string);
      expect(callBody.blocks).toBeDefined();
      expect(callBody.blocks.length).toBe(4); // header + section + fields + context
    });

    it("should send alert without fields", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({ ok: true, channel: "C123", ts: "9999.0000" })
      );

      await sendAlert({
        channel: "#alerts",
        title: "Test",
        message: "No fields",
        status: "ok",
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1]!.body as string);
      expect(callBody.blocks.length).toBe(3); // header + section + context (no fields block)
    });

    it("should use correct emoji per status", async () => {
      for (const status of ["ok", "warning", "error"] as const) {
        mockFetch.mockResolvedValue(
          jsonResponse({ ok: true, channel: "C123", ts: "1.1" })
        );

        await sendAlert({
          channel: "#alerts",
          title: "Test",
          message: "msg",
          status,
        });

        const callBody = JSON.parse(
          mockFetch.mock.calls[mockFetch.mock.calls.length - 1][1]!.body as string
        );
        const headerText = callBody.blocks[0].text.text;

        const expectedEmoji = {
          ok: ":white_check_mark:",
          warning: ":warning:",
          error: ":rotating_light:",
        }[status];

        expect(headerText).toContain(expectedEmoji);
      }
    });
  });
});
