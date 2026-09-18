/**
 * Off-chain NFT metadata (collection/item names) lives at a URI stored in
 * on-chain metadata `data` bytes. Verified on Polkadot Asset Hub: the value is
 * UTF-8 text, usually `ipfs://ipfs/<cid>`, `ipfs://<cid>`, a bare CID, an IPFS
 * path like `ipfs://<cid>/2.json`, or a https URL pointing to a JSON document
 * with a `name` field.
 */
const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.filebase.io/ipfs";
const FETCH_TIMEOUT = 15000;
const RETRY_DELAY = 1000;
const MAX_CONCURRENT_FETCHES = 8;

const nameCache = new Map();

function isCid(value) {
  return (
    /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(value) ||
    /^baf[0-9a-z]{50,}$/.test(value)
  );
}

function toFetchUrl(text) {
  let path = text;
  if (path.startsWith("ipfs://ipfs/")) {
    path = path.slice("ipfs://ipfs/".length);
  } else if (path.startsWith("ipfs://")) {
    path = path.slice("ipfs://".length);
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // A CID, optionally followed by a path inside the IPFS directory.
  const [cid] = path.split("/");
  if (isCid(cid)) {
    return `${IPFS_GATEWAY}/${path}`;
  }
  return null;
}

export function decodeMetadataData(data) {
  if (!data || !data.length) {
    return null;
  }
  try {
    return new TextDecoder().decode(data).trim() || null;
  } catch {
    return null;
  }
}

function createLimiter(max) {
  let active = 0;
  const pending = [];

  const next = () => {
    if (active >= max || pending.length === 0) {
      return;
    }
    active += 1;
    const { fn, resolve, reject } = pending.shift();
    fn()
      .then(resolve, reject)
      .finally(() => {
        active -= 1;
        next();
      });
  };

  return (fn) =>
    new Promise((resolve, reject) => {
      pending.push({ fn, resolve, reject });
      next();
    });
}

const limitedFetch = createLimiter(MAX_CONCURRENT_FETCHES);

// Returns the `name` field, null when the document has no name, or undefined
// when the request failed and may be retried.
async function fetchJsonName(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) {
      return undefined;
    }
    const json = await resp.json();
    const { name } = json || {};
    return typeof name === "string" && name ? name : null;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonNameWithRetry(url) {
  const name = await limitedFetch(() => fetchJsonName(url));
  if (name !== undefined) {
    return name;
  }

  // Gateways may fail the first lookup while discovering content providers.
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  return await limitedFetch(() => fetchJsonName(url));
}

async function loadMetadataName(text) {
  if (text.startsWith("{")) {
    try {
      const { name } = JSON.parse(text);
      return typeof name === "string" && name ? name : null;
    } catch {
      return null;
    }
  }

  const url = toFetchUrl(text);
  if (!url) {
    return null;
  }

  const name = await fetchJsonNameWithRetry(url);
  if (name) {
    return name;
  }

  // A gateway embedded in the URI may be unreachable, retry the CID on ours.
  const match = url.match(/\/ipfs\/([^?#]+)/);
  if (match && !url.startsWith(IPFS_GATEWAY)) {
    return fetchJsonNameWithRetry(`${IPFS_GATEWAY}/${match[1]}`);
  }
  return null;
}

export function resolveMetadataName(data) {
  const text = decodeMetadataData(data);
  if (!text) {
    return Promise.resolve(null);
  }

  if (!nameCache.has(text)) {
    nameCache.set(text, loadMetadataName(text));
  }
  return nameCache.get(text);
}
