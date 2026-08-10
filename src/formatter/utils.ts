export function isCJK(ch: string): boolean {
  if (ch.length !== 1) throw new Error("Input must be a single character.");
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9fff) || // 中文
    (code >= 0x3400 && code <= 0x4dbf) || // 中文扩展
    (code >= 0x3040 && code <= 0x309f) || // 日文平假名
    (code >= 0x30a0 && code <= 0x30ff) || // 日文片假名
    (code >= 0xac00 && code <= 0xd7af) // 韩文
  );
}

export function isLatin(ch: string): boolean {
  if (ch.length !== 1) throw new Error("Input must be a single character.");
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x41 && code <= 0x5a) || // A-Z
    (code >= 0x61 && code <= 0x7a) || // a-z
    (code >= 0x30 && code <= 0x39) // 0-9
  );
}
