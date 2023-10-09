import { addressEllipsis } from "../../index";

export const toPolkassemblyDiscussionAuthor = (author, chain) => ({
  username: addressEllipsis(author?.address) || author?.username,
  ...(author?.address
    ? {
        address: author.address,
      }
    : {}),
  polkassemblyUserLink: `https://${chain}.polkassembly.io/user/${author?.username}`,
});

export default function normalizePolkassemblyDiscussionListItem(chain, item) {
  return {
    ...item,
    time: item.lastActivityAt,
    author: toPolkassemblyDiscussionAuthor(item.author, chain),
    detailLink: `/polkassembly/posts/${item.polkassemblyId}`,
  };
}
