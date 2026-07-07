import type { FortressIdentity } from "./identity.js";
import type { MsgData, MsgReply } from "./messages.js";
export interface McpToolDef {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}
export type McpTunnelRequest = {
    method: "listTools";
} | {
    method: "callTool";
    name: string;
    arguments: Record<string, unknown>;
    userId: string;
    /** Cloud-signed capability grant (purpose "read" + a scopeHash commitment
     *  over `arguments.scope`). The fortress verifies it offline against the
     *  pinned per-org key before running the tool; absent ⇒ denied on the read
     *  surface. */
    grant?: string;
};
export type McpTunnelResult = {
    method: "listTools";
    tools: McpToolDef[];
} | {
    method: "callTool";
    content: string;
    isError?: boolean;
};
/** Collection telemetry a Fortress reports to the hub — pure counts from its own
 *  hx Postgres. Recency ("last ingest") is signalled separately via `hxInvalidate`;
 *  liveness via `heartbeat`. `embeddings` is null on a non-pgvector Fortress (the
 *  table is absent), distinct from 0 (present, nothing indexed yet). */
export interface CollectionStats {
    sessions: number;
    turns: number;
    embeddings: number | null;
}
/** Root-signed proof authenticating an org signing-key push (H-2): the cloud
 *  signs `${orgId}|${signingPublicKey}|${notBefore}` with the let.ai root key and
 *  the fortress verifies it against a root public key compiled into its binary,
 *  so a hub can no longer silently swap the token-verification key. */
export interface KeyProof {
    alg: "Ed25519-root";
    notBefore: string;
    /** base64url raw Ed25519 signature over `${orgId}|${signingPublicKey}|${notBefore}`. */
    sig: string;
}
export type FortressToHubFrame<TRpcResult = unknown> = ({
    t: "enroll";
    enrollToken: string;
} & FortressIdentity) | ({
    t: "hello";
    fortressId: string;
    credential: string;
} & FortressIdentity) | {
    t: "heartbeat";
} | {
    t: "collectionStats";
    stats: CollectionStats;
} | {
    t: "moduleReply";
    id: string;
    reply: MsgReply;
} | {
    t: "rpcResult";
    id: string;
    result: TRpcResult;
} | {
    t: "rpcError";
    id: string;
    error: string;
} | {
    t: "hxInvalidate";
    userExternalId: string;
    orgExternalId: string | null;
} | {
    t: "moduleInstallResult";
    moduleId: string;
    version: string;
    ok: true;
} | {
    t: "moduleInstallResult";
    moduleId: string;
    version: string;
    ok: false;
    error: string;
} | {
    t: "moduleRemoveResult";
    moduleId: string;
    ok: true;
} | {
    t: "moduleRemoveResult";
    moduleId: string;
    ok: false;
    error: string;
} | {
    t: "mcpRpcResult";
    id: string;
    result: McpTunnelResult;
} | {
    t: "mcpRpcError";
    id: string;
    error: string;
};
export type HubToFortressFrame<TRpcReq = unknown> = {
    t: "welcome";
    orgId: string;
    protocolVersion: number;
    signingPublicKey?: string;
    keyProof?: KeyProof;
} | {
    t: "enrolled";
    orgId: string;
    fortressId: string;
    credential: string;
    protocolVersion: number;
    signingPublicKey?: string;
    keyProof?: KeyProof;
} | {
    t: "moduleMessage";
    data: MsgData;
} | {
    t: "rpc";
    id: string;
    req: TRpcReq;
    grant?: string;
} | {
    t: "heartbeatAck";
} | {
    t: "fatal";
    reason: string;
} | {
    t: "moduleAdvertise";
    moduleId: string;
    version: string;
    artifactUrl: string;
    checksum: string;
    /** Detached Ed25519 signature verified against a key baked into the
     *  fortress binary — replaces trust in the hub-supplied `checksum` for
     *  authenticity. Optional on the wire during rollout; the loader requires
     *  it before executing a module. */
    signature?: string;
} | {
    t: "moduleRemove";
    moduleId: string;
} | {
    t: "mcpRpc";
    id: string;
    req: McpTunnelRequest;
};
export type ProtocolFrame = FortressToHubFrame | HubToFortressFrame;
