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

  const MAP = {
    [detailPageCategory.GOV2_REFERENDUM]: makeLink(
      `/referenda_v2/${post.referendumIndex}`,
    ),
    [detailPageCategory.DEMOCRACY_REFERENDUM]: makeLink(
      `/referenda/${post.referendumIndex}`,
    ),
  };

  return MAP[type];
}
