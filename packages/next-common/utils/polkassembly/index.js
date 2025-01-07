import { detailPageCategory } from "../consts/business/category";
import { flatten } from "lodash-es";
import { encodeAddressToChain } from "next-common/services/address";
import { addressEllipsis } from "next-common/utils";
import { getMotionId } from "next-common/utils/motion";
import { getTitle } from "next-common/utils/post";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";
import Chains from "../consts/chains";

export const PolkassemblyChains = [
  Chains.kusama,
  Chains.polkadot,
  Chains.collectives,
  Chains.zeitgeist,
];

export function getPolkassemblyLink(type, post) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  if (!post) {
    return null;
  }

  switch (type) {
    case detailPageCategory.DEMOCRACY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/proposal/${post.proposalIndex}`;
    }
    case detailPageCategory.DEMOCRACY_REFERENDUM: {
      return `https://${chain}.polkassembly.io/referendum/${post.referendumIndex}`;
    }
    case detailPageCategory.COUNCIL_MOTION: {
      return `https://${chain}.polkassembly.io/motion/${post.motionIndex}`;
    }
    case detailPageCategory.TECH_COMM_MOTION: {
      return `https://${chain}.polkassembly.io/tech/${post.motionIndex}`;
    }
    case detailPageCategory.TREASURY_PROPOSAL: {
      return `https://${chain}.polkassembly.io/treasury/${post.proposalIndex}`;
    }
    case detailPageCategory.TREASURY_BOUNTY: {
      return `https://${chain}.polkassembly.io/bounty/${post.bountyIndex}`;
    }
    case detailPageCategory.TREASURY_TIP: {
      return `https://${chain}.polkassembly.io/tip/${post.hash}`;
    }
    case detailPageCategory.PA_POST: {
      return `https://${chain}.polkassembly.io/post/${post.polkassemblyId}`;
    }
    case detailPageCategory.TREASURY_CHILD_BOUNTY: {
      return `https://${chain}.polkassembly.io/child_bounty/${post.index}`;
    }
    case detailPageCategory.GOV2_REFERENDUM: {
      return `https://${chain}.polkassembly.io/referenda/${post.referendumIndex}`;
    }
    case detailPageCategory.FELLOWSHIP_REFERENDUM: {
      return `https://${chain}.polkassembly.io/member-referenda/${post.referendumIndex}`;
    }
    case detailPageCategory.ADVISORY_MOTION: {
      return `https://${chain}.polkassembly.io/advisory-committee/motions/${post.height}_${post.hash}`;
    }
    default: {
      return null;
    }
  }
}

export const convertPolkassemblyReaction = (paReactions, chain) => {
  const flattened = flatten(
    Object.entries(paReactions || {}).map(([r, { usernames } = {}]) =>
      usernames?.map((u) => [r, u]),
    ),
  );
  const reactions = flattened.map(([r, u]) => ({
    reaction: r === "👍" ? 1 : 0,
    user: {
      username: u,
      address: "",
      polkassemblyUserLink: `https://${chain}.polkassembly.io/user/${u}`,
    },
  }));

  return reactions;
};

export const convertPolkassemblyComment = (chain, comment) => {
  const address =
    comment.proposer && encodeAddressToChain(comment.proposer, chain);
  return {
    reactions: convertPolkassemblyReaction(comment.comment_reactions, chain),
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    comment_source: comment.comment_source || "polkassembly",
    author: {
      username: comment.is_custom_username
        ? comment.username
        : address
        ? addressEllipsis(address)
        : comment.username,
      address,
      polkassemblyUserLink: `https://${chain}.polkassembly.io/user/${comment.username}`,
    },
  };
};

export const toPolkassemblyCommentListItem = (chain, item) => ({
  ...convertPolkassemblyComment(chain, item),
  replies: item.replies?.map((r) => convertPolkassemblyComment(chain, r)),
});

export const toFinancialMotionsListItem = (item) => {
  return {
    ...item,
    index: item.motionIndex,
    title: getTitle(item),
    author: item.author,
    address: item.proposer,
    status: item.state ?? "Unknown",
    detailLink: `/financial-council/motions/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
  };
};
