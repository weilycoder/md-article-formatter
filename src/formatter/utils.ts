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

// oxlint-disable-next-line typescript/no-explicit-any
export function getFirstChar(node: any): string | undefined {
  if (node === undefined) return undefined;
  const value = node?.value;
  if (typeof value === "string" && value.length > 0) return value[0];
  const children = node?.children;
  if (Array.isArray(children) && children.length > 0)
    return getFirstChar(children[0]);
  return undefined;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function getLastChar(node: any): string | undefined {
  if (node === undefined) return undefined;
  const value = node?.value;
  if (typeof value === "string" && value.length > 0)
    return value[value.length - 1];
  const children = node?.children;
  if (Array.isArray(children) && children.length > 0)
    return getLastChar(children[children.length - 1]);
  return undefined;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function setFirstChar(node: any, newChar: string): boolean {
  if (node === undefined) return false;
  const value = node?.value;
  if (typeof value === "string" && value.length > 0) {
    node.value = newChar + value.slice(1);
    return true;
  }
  const children = node?.children;
  if (Array.isArray(children) && children.length > 0)
    return setFirstChar(children[0], newChar);
  return false;
}

// oxlint-disable-next-line typescript/no-explicit-any
export function setLastChar(node: any, newChar: string): boolean {
  if (node === undefined) return false;
  const value = node?.value;
  if (typeof value === "string" && value.length > 0) {
    node.value = value.slice(0, -1) + newChar;
    return true;
  }
  const children = node?.children;
  if (Array.isArray(children) && children.length > 0)
    return setLastChar(children[children.length - 1], newChar);
  return false;
}
