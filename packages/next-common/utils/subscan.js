import { detailPageCategory } from "./consts/business/category";
import getChainSettings from "./consts/settings";

export function getSubscanLink(chain, type, post) {
  if (!post) {
    return null;
  }

  const { subscanDomain } = getChainSettings(chain);
  const sub = subscanDomain || chain;

  const makeLink = (path = "") => {
    return `https://${sub}.subscan.io${path}`;
  };

  // prettier-ignore
  const LINK_MAP = {
    [detailPageCategory.GOV2_REFERENDUM]: makeLink(`/referenda_v2/${post.referendumIndex}`),
    [detailPageCategory.DEMOCRACY_REFERENDUM]: makeLink(`/referenda/${post.referendumIndex}`),
  };

  return LINK_MAP[type];
}
