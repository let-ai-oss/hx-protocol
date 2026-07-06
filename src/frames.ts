import type { FortressIdentity } from "./identity.js";
import type { MsgData, MsgReply } from "./messages.js";

// --- MCP tunnel — reverse-tunnel MCP transport for a fortress with no public URL ---
export interface McpToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}
export type McpTunnelRequest =
  | { method: "listTools" }
  | { method: "callTool"; name: string; arguments: Record<string, unknown>; userId: string };
export type McpTunnelResult =
  | { method: "listTools"; tools: McpToolDef[] }
  | { method: "callTool"; content: string; isError?: boolean };

export type FortressToHubFrame<TRpcResult = unknown> =
  | ({ t: "enroll"; enrollToken: string } & FortressIdentity)
  | ({ t: "hello"; fortressId: string; credential: string } & FortressIdentity)
  | { t: "heartbeat" }
  | { t: "moduleReply"; id: string; reply: MsgReply }
  | { t: "rpcResult"; id: string; result: TRpcResult }
  | { t: "rpcError"; id: string; error: string }
  // Fortress→cloud realtime invalidation: emitted after an hx ingest
  // so the cloud refreshes the affected user's live "my sessions" queries —
  // including fortress-direct writes the cloud never relayed.
  | { t: "hxInvalidate"; userExternalId: string; orgExternalId: string | null }
  | { t: "moduleInstallResult"; moduleId: string; version: string; ok: true }
  | { t: "moduleInstallResult"; moduleId: string; version: string; ok: false; error: string }
  | { t: "moduleRemoveResult"; moduleId: string; ok: true }
  | { t: "moduleRemoveResult"; moduleId: string; ok: false; error: string }
  | { t: "mcpRpcResult"; id: string; result: McpTunnelResult }
  | { t: "mcpRpcError"; id: string; error: string };

export type HubToFortressFrame<TRpcReq = unknown> =
  | { t: "welcome"; orgId: string; protocolVersion: number; signingPublicKey?: string }
  | {
      t: "enrolled";
      orgId: string;
      fortressId: string;
      credential: string;
      protocolVersion: number;
      signingPublicKey?: string;
    }
  | { t: "moduleMessage"; data: MsgData }
  | { t: "rpc"; id: string; req: TRpcReq }
  | { t: "heartbeatAck" }
  | { t: "fatal"; reason: string }
  | {
      t: "moduleAdvertise";
      moduleId: string;
      version: string;
      artifactUrl: string;
      checksum: string;
    }
  | { t: "moduleRemove"; moduleId: string }
  | { t: "mcpRpc"; id: string; req: McpTunnelRequest };

export type ProtocolFrame = FortressToHubFrame | HubToFortressFrame;
