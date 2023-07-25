export function ensureProtocol(url) {
  return !/^https?:\/\//i.test(url) ? `http://${url}` : url;
}
