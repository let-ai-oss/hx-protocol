export interface MsgData {
  module: string;
  id: string;
  kind: "request" | "event";
  payload: unknown;
}

export type MsgReply =
  | { ok: true; payload: unknown }
  | { ok: false; error: string };
