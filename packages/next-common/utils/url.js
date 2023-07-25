export function ensureProtocol(url) {
  return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
}
