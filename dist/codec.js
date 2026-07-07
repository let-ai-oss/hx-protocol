export function encodeFrame(frame) {
    return JSON.stringify(frame);
}
/**
 * Decode a wire frame, throwing on malformed JSON. The `as T` is an unchecked
 * boundary cast: the caller is trusted to have produced a well-formed frame.
 * For untrusted input (anything off the wire), prefer {@link safeDecodeFrame}.
 */
export function decodeFrame(data) {
    return JSON.parse(data);
}
/**
 * Decode a wire frame without throwing. Returns an error result for malformed
 * JSON or a payload that is not a frame object carrying a string `t`
 * discriminator, so a single bad frame off the wire can't crash the read loop.
 *
 * Note: this validates the envelope (parses, is an object, has a string `t`),
 * not the full shape of `T` — field-level validation stays with the consumer.
 */
export function safeDecodeFrame(data) {
    let parsed;
    try {
        parsed = JSON.parse(data);
    }
    catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "invalid JSON" };
    }
    if (typeof parsed !== "object" || parsed === null || !("t" in parsed) || typeof parsed.t !== "string") {
        return { ok: false, error: "decoded value is not a frame (missing string discriminator 't')" };
    }
    return { ok: true, frame: parsed };
}
