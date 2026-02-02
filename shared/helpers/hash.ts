export function encodeId(id: string): string {
  return btoa(id)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeId(encoded: string): string {
  const base64 = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  return atob(base64);
}
