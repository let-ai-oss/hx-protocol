export function encodeFrame<T>(frame: T): string {
  return JSON.stringify(frame);
}

export function decodeFrame<T>(data: string): T {
  return JSON.parse(data) as T;
}
