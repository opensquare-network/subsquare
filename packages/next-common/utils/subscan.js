import { getSubscanDomain } from "next-common/components/links/subscanLink";
import { detailPageCategory } from "./consts/business/category";

export function getSubscanLink(chain, type, post) {
  if (!post) {
    return null;
  }

  const domain = getSubscanDomain(post.indexer, chain);

  if (!domain) {
    return null;
  }

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
