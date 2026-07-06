import assert from "node:assert/strict";
import { test } from "node:test";

import { hashFortressScope } from "./scope-hash.js";

test("order-independent over identities", () => {
  const a = hashFortressScope({
    identities: [
      { userExternalId: "u1", family: "claude", sessionId: "s1" },
      { userExternalId: "u2", family: "claude", sessionId: "s2" },
    ],
  });
  const b = hashFortressScope({
    identities: [
      { userExternalId: "u2", family: "claude", sessionId: "s2" },
      { userExternalId: "u1", family: "claude", sessionId: "s1" },
    ],
  });
  assert.equal(a, b);
});

test("changes when any identity field changes", () => {
  const base = hashFortressScope({
    identities: [{ userExternalId: "u1", family: "claude", sessionId: "s1" }],
  });
  assert.notEqual(
    base,
    hashFortressScope({ identities: [{ userExternalId: "u1", family: "claude", sessionId: "s2" }] }),
  );
  assert.notEqual(
    base,
    hashFortressScope({ identities: [{ userExternalId: "u9", family: "claude", sessionId: "s1" }] }),
  );
});

test("adding an identity changes the hash", () => {
  const one = hashFortressScope({
    identities: [{ userExternalId: "u1", family: "c", sessionId: "s1" }],
  });
  const two = hashFortressScope({
    identities: [
      { userExternalId: "u1", family: "c", sessionId: "s1" },
      { userExternalId: "u1", family: "c", sessionId: "s2" },
    ],
  });
  assert.notEqual(one, two);
});

test("ownerGate participates and is order-independent", () => {
  const withGate = hashFortressScope({
    identities: [{ userExternalId: "u1", family: "c", sessionId: "s" }],
    ownerGate: { activeMemberExternalIds: ["b", "a"] },
  });
  const sameGate = hashFortressScope({
    identities: [{ userExternalId: "u1", family: "c", sessionId: "s" }],
    ownerGate: { activeMemberExternalIds: ["a", "b"] },
  });
  const noGate = hashFortressScope({
    identities: [{ userExternalId: "u1", family: "c", sessionId: "s" }],
  });
  assert.equal(withGate, sameGate);
  assert.notEqual(withGate, noGate);
});

test("empty scope yields a stable non-empty digest", () => {
  const h = hashFortressScope({ identities: [] });
  assert.equal(typeof h, "string");
  assert.ok(h.length > 0);
  assert.equal(h, hashFortressScope({ identities: [] }));
});
