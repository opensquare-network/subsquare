export function ensureProtocol(url) {
  return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
}

export function removeTrailingSlash(domain = "") {
  if (typeof domain !== "string") {
    return domain;
  }

  if (domain.endsWith("/")) {
    return domain.slice(0, domain.length - 1);
  }

  return domain;
}
