import { noop } from "lodash";
import getIpfsLink from "../env/ipfsEndpoint";

export default function correctionIpfsEndpointPlugin() {
  const endpoint = process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT;
  const pluginName = "correction-ipfs-endpoint";
  if (!endpoint) {
    return {
      name: pluginName,
      onRenderedHtml: noop,
    };
  }
  return {
    name: pluginName,
    onRenderedHtml: (el) => {
      el.querySelectorAll("img").forEach((img) => {
        if (!img.src?.startsWith(endpoint)) {
          const cid = extractIpfsCid(img.src);
          if (cid) {
            img.src = getIpfsLink(cid);
          }
        }
      });
    },
  };
}

export function extractIpfsCid(rawUrl) {
  let cid;
  try {
    const url = new URL(rawUrl);
    const match = url.pathname.match(/^\/ipfs\/([^/?#]+)/);
    if (match) {
      cid = match[1];
    }

    const subdomainMatch = url.hostname.match(/^(.+)\.ipfs\./);
    if (subdomainMatch) {
      cid = subdomainMatch[1];
    }
  } catch (e) {
    console.error(e);
  }

  return cid;
}
