import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { decodeFrame, encodeFrame } from "./codec.js";
import type { FortressToHubFrame, HubToFortressFrame } from "./frames.js";

describe("hx-protocol codec", () => {
  it("mcpRpc down-frame round-trips", () => {
    const f: HubToFortressFrame = {
      t: "mcpRpc",
      id: "1",
      req: { method: "callTool", name: "hx_clarity_list_sessions", arguments: { limit: 5 }, userId: "u1" },
    };
    assert.deepStrictEqual(decodeFrame<HubToFortressFrame>(encodeFrame(f)), f);
  });

  it("mcpRpcResult up-frame round-trips", () => {
    const f: FortressToHubFrame = { t: "mcpRpcResult", id: "1", result: { method: "listTools", tools: [] } };
    assert.deepStrictEqual(decodeFrame<FortressToHubFrame>(encodeFrame(f)), f);
  });

  it("rpc/rpcResult round-trip with a specialized payload", () => {
    const down: HubToFortressFrame<{ op: "ping" }> = { t: "rpc", id: "2", req: { op: "ping" } };
    const up: FortressToHubFrame<{ ok: true }> = { t: "rpcResult", id: "2", result: { ok: true } };
    assert.deepStrictEqual(decodeFrame(encodeFrame(down)), down);
    assert.deepStrictEqual(decodeFrame(encodeFrame(up)), up);
  });
});
