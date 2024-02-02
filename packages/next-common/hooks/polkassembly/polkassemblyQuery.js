async function fetchGet(postUrl) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);
  const resp = await fetch(postUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-network": process.env.NEXT_PUBLIC_CHAIN,
    },
    signal: controller.signal,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text);
  }

  const result = await resp.json();
  return result;
}

async function fetchOnChainPost(postId, proposalType) {
  return await fetchGet(
    `https://api.polkassembly.io/api/v1/posts/on-chain-post?postId=${postId}&proposalType=${proposalType}`,
  );
}

async function fetchOffChainPost(postId, postType) {
  return await fetchGet(
    `https://api.polkassembly.io/api/v1/posts/off-chain-post?postId=${postId}&postType=${postType}`,
  );
}

function toPolkassemblyApiPostType(postType) {
  switch (postType) {
    case "ReferendumV2": {
      return "referendums_v2";
    }
    case "FellowshipReferendum": {
      return "fellowship_referendums";
    }
    case "Tip": {
      return "tips";
    }
    case "Bounty": {
      return "bounties";
    }
    case "ChildBounty": {
      return "child_bounties";
    }
    case "TreasuryProposal": {
      return "treasury_proposals";
    }
    case "DemocracyProposal": {
      return "democracy_proposals";
    }
    case "Referendum": {
      return "referendums";
    }
    case "CouncilMotion": {
      return "council_motions";
    }
    case "TechCommitteeProposal": {
      return "tech_committee_proposals";
    }
    default: {
      return "discussion";
    }
  }
}

export async function queryPolkassemblyPostComments(postId, postType) {
  const type = toPolkassemblyApiPostType(postType);

  if (postType === "discussion") {
    return await fetchOffChainPost(postId, type);
  }

  return await fetchOnChainPost(postId, type);
}
