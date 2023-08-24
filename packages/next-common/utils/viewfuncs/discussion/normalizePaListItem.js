import { addressEllipsis } from "../../index";

export const toPolkassemblyDiscussionAuthor = (author) => ({
  username: addressEllipsis(author?.address) || author?.username,
  ...(author?.address
    ? {
        address: author.address,
      }
    : {}),
});

export default function normalizePolkassemblyDiscussionListItem(chain, item) {
  return {
    ...item,
    time: item.lastActivityAt,
    author: toPolkassemblyDiscussionAuthor(item.author),
    detailLink: `/polkassembly/posts/${item.polkassemblyId}`,
  };
}
