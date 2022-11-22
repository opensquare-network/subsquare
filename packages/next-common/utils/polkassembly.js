import { detailPageCategory } from "./consts/business/category";

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
    default: {
      return null;
    }
  }
}
