import { detailPageCategory } from "./consts/business/category";
import getChainSettings from "./consts/settings";

export function getSubscanLink(chain, type, post) {
  if (!post) {
    return null;
  }

  const { integrations } = getChainSettings(chain);

  if (!integrations?.subscan) {
    return null;
  }

  const domain = integrations.subscan.domain || chain;

  const makeLink = (path = "") => {
    return `https://${domain}.subscan.io${path}`;
  };

  // prettier-ignore
  const LINK_MAP = {
    [detailPageCategory.GOV2_REFERENDUM]: makeLink(`/referenda_v2/${post.referendumIndex}`),
    [detailPageCategory.DEMOCRACY_REFERENDUM]: makeLink(`/referenda/${post.referendumIndex}`),
  };

  return LINK_MAP[type];
}
