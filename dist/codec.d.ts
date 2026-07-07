export declare function encodeFrame<T>(frame: T): string;
/**
 * Decode a wire frame, throwing on malformed JSON. The `as T` is an unchecked
 * boundary cast: the caller is trusted to have produced a well-formed frame.
 * For untrusted input (anything off the wire), prefer {@link safeDecodeFrame}.
 */
export declare function decodeFrame<T>(data: string): T;
export type DecodeResult<T> = {
    ok: true;
    frame: T;
} | {
    ok: false;
    error: string;
};
/**
 * Decode a wire frame without throwing. Returns an error result for malformed
 * JSON or a payload that is not a frame object carrying a string `t`
 * discriminator, so a single bad frame off the wire can't crash the read loop.
 *
 * Note: this validates the envelope (parses, is an object, has a string `t`),
 * not the full shape of `T` — field-level validation stays with the consumer.
 */
export declare function safeDecodeFrame<T>(data: string): DecodeResult<T>;
