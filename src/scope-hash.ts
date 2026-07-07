import { createHash } from "node:crypto";

/** One enumerated in-scope session, by fortress natural key. */
export interface ScopeIdentityLike {
  userExternalId: string;
  family: string;
  sessionId: string;
}

/** The resolved consent scope a read grant commits to. */
export interface HashableScope {
  identities: ScopeIdentityLike[];
  ownerGate?: { activeMemberExternalIds: string[] };
}

function cmpTuple(a: readonly string[], b: readonly string[]): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return a.length - b.length;
}

/**
 * Deterministic commitment to a resolved fortress read scope.
 *
 * Both the cloud (which MINTS a read grant carrying this hash) and the fortress
 * (which VERIFIES the tool-args scope against the grant) import this one
 * function, so the `base64url(sha256(canonical))` values agree byte-for-byte.
 * The canonical form sorts identities and the owner-gate member set so the hash
 * is order-independent, but it is sensitive to any added/removed/changed member
 * — a tampered scope no longer matches the grant and is rejected (fail-closed).
 */
export function hashFortressScope(scope: HashableScope): string {
  const identities = Array.isArray(scope?.identities) ? scope.identities : [];
  const tuples = identities
    .map(
      (x) =>
        [String(x.userExternalId), String(x.family), String(x.sessionId)] as readonly [
          string,
          string,
          string,
        ],
    )
    .sort(cmpTuple);
  const gate =
    scope?.ownerGate && Array.isArray(scope.ownerGate.activeMemberExternalIds)
      ? [...scope.ownerGate.activeMemberExternalIds].map(String).sort()
      : null;
  const canonical = JSON.stringify({ i: tuples, g: gate });
  return createHash("sha256").update(canonical, "utf8").digest("base64url");
}
