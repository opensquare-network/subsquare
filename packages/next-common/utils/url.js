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

export function objectToQueryString(obj) {
  const searchParams = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      searchParams.append(key, obj[key]);
    }
  });
  return searchParams.toString();
}

export function trimEndSlash(url) {
  return url.replace(/\/+$/, "");
}
