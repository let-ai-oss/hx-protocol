/** One enumerated in-scope session, by fortress natural key. */
export interface ScopeIdentityLike {
    userExternalId: string;
    family: string;
    sessionId: string;
}
/** The resolved consent scope a read grant commits to. */
export interface HashableScope {
    identities: ScopeIdentityLike[];
    ownerGate?: {
        activeMemberExternalIds: string[];
    };
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
export declare function hashFortressScope(scope: HashableScope): string;
