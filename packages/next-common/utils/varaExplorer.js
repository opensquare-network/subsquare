import getChainSettings from "next-common/utils/consts/settings";
import { detailPageCategory } from "./consts/business/category";

export function getVaraExplorerBaseUrl(chain) {
  return getChainSettings(chain)?.integrations?.varaExplorer
    ? "https://explorer.vara.network"
    : null;
}

export function getVaraExplorerPostLink(chain, type, post) {
  const baseUrl = getVaraExplorerBaseUrl(chain);
  if (
    !baseUrl ||
    type !== detailPageCategory.GOV2_REFERENDUM ||
    post?.referendumIndex == null
  ) {
    return null;
  }

  return `${baseUrl}/referenda/${post.referendumIndex}`;
}

export function getVaraExplorerLink(chain, indexer = {}) {
  const baseUrl = getVaraExplorerBaseUrl(chain);
  const { blockHeight, extrinsicIndex, index } = indexer;
  if (!baseUrl || blockHeight == null) {
    return null;
  }

  const extrinsic = extrinsicIndex ?? index;
  return extrinsic != null
    ? `${baseUrl}/extrinsic/${blockHeight}-${extrinsic}`
    : `${baseUrl}/block/${blockHeight}`;
}

export function getVaraExplorerAccountLink(chain, address) {
  const baseUrl = getVaraExplorerBaseUrl(chain);
  return baseUrl && address ? `${baseUrl}/account/${address}` : null;
}
