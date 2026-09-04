import getChainSettings from "next-common/utils/consts/settings";
import { detailPageCategory } from "next-common/utils/consts/business/category";

// Hydration: https://hydration-explorer.neckwork.net
export function getNeckworkDomain(chain) {
  const { integrations = {} } = getChainSettings(chain) || {};
  return integrations?.neckwork?.domain || null;
}

export function getNeckworkBaseUrl(chain) {
  const domain = getNeckworkDomain(chain);
  return domain ? `https://${domain}.neckwork.net` : null;
}

// Neckwork deep links for OpenGov / Democracy referenda, e.g.
// https://hydration-explorer.neckwork.net/referendum/opengov/399
// https://hydration-explorer.neckwork.net/referendum/democracy/205
export function getNeckworkPostLink(chain, type, post) {
  if (!post) {
    return null;
  }

  const baseUrl = getNeckworkBaseUrl(chain);
  if (!baseUrl) {
    return null;
  }

  const makeLink = (path = "") => {
    return `${baseUrl}${path}`;
  };

  // prettier-ignore
  const LINK_MAP = {
    [detailPageCategory.GOV2_REFERENDUM]: makeLink(`/referendum/opengov/${post.referendumIndex}`),
    [detailPageCategory.DEMOCRACY_REFERENDUM]: makeLink(`/referendum/democracy/${post.referendumIndex}`),
  };

  return LINK_MAP[type];
}
