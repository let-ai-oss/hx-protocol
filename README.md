# @let-ai/hx-protocol

Shared HX wire protocol: the transport-neutral frame types and JSON codec
exchanged over the persistent WebSocket between an HX Fortress and the let.ai
hub. Single source of truth consumed by `hx-fortress`, `hx`, and the let.ai
monorepo as a git-dependency pinned to an immutable commit SHA.

Scope is deliberately narrow: wire frame shapes + `encodeFrame`/`decodeFrame`.
Transport (WebSocket dialing, enrollment, auth, heartbeat, reconnect) and the
application RPC payloads live in the consuming layers.

## Install (git dependency)

```json
"@let-ai/hx-protocol": "git+https://github.com/let-ai-oss/hx-protocol.git#<commit-sha>"
```

## Usage

```ts
import { encodeFrame, decodeFrame } from "@let-ai/hx-protocol";
import type { FortressToHubFrame, HubToFortressFrame } from "@let-ai/hx-protocol";
```

The two RPC-payload seams are generic and default to `unknown`; specialize them
per consumer, e.g. `FortressToHubFrame<MyRpcResult>`.

`decodeFrame` throws on malformed JSON and casts without checking — use it only
for trusted input. For frames arriving off the wire, prefer `safeDecodeFrame`,
which never throws and returns `{ ok: true; frame } | { ok: false; error }`.
