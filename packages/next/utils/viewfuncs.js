import { addressEllipsis, stringUpperFirst } from ".";

const TipStateMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export function getPostUpdatedAt(post) {
  if (post.createdAt === post.lastActivityAt) {
    return post?.indexer?.blockTime ?? post.createdAt;
  }
  return post.lastActivityAt;
}

export function getTipState(state) {
  return TipStateMap[state.state ?? state] === "Tipping"
    ? `Tipping (${state.tipsCount})`
    : TipStateMap[state.state ?? state];
}

export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/post/${item.postUid}`,
});

export const toCouncilMotionListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: `${item?.title}`,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  detailLink: `/council/motion/${item.motionIndex}`,
  isTreasury:
    item?.onchainData?.treasuryProposals?.length > 0 ||
    item?.onchainData?.treasuryBounties?.length > 0,
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
  time: getPostUpdatedAt(item),
});

export const toFinancialMotionsListItem = (chain, item) => ({
  ...item,
  index: item.motionIndex,
  title: `${item?.title}`,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  detailLink: `/financial-council/motion/${item.motionIndex}`,
  isTreasury:
    item?.onchainData?.treasuryProposals?.length > 0 ||
    item?.onchainData?.treasuryBounties?.length > 0,
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
  time: getPostUpdatedAt(item),
});

function getTechCommMotionId(motion) {
  if (motion.index !== null && motion.index !== undefined) {
    return motion.index;
  }

  return `${motion.indexer.blockHeight}_${motion.hash}`;
}

export const toTechCommMotionListItem = (chain, item) => ({
  ...item,
  title: item.title,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item?.state ?? "Unknown",
  detailLink: `/techcomm/proposal/${getTechCommMotionId(item)}`,
  time: getPostUpdatedAt(item),
  isDemocracy: item?.onchainData?.externalProposals?.length > 0,
});

export const toTreasuryProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/proposal/${item.proposalIndex}`,
  value: item.onchainData.value,
});

export const toTreasuryBountyListItem = (chain, item) => ({
  ...item,
  index: item.bountyIndex,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/bounty/${item.bountyIndex}`,
  value: item.onchainData.value,
});

export const toReferendaListItem = (chain, item) => ({
  ...item,
  time: getPostUpdatedAt(item),
  status: item.state ?? "Unknown",
  index: item.referendumIndex,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  detailLink: `/democracy/referendum/${item.referendumIndex}`,
});

export const toTipListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.finder),
    addresses: [{ chain, address: item.finder }],
  },
  status: item.state ? getTipState(item.state) : "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/treasury/tip/${item.height}_${item.hash}`,
  value: item?.onchainData?.medianValue,
});

export const toPublicProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  index: item.proposalIndex,
  status: item.state ?? "Unknown",
  time: getPostUpdatedAt(item),
  detailLink: `/democracy/proposal/${item.proposalIndex}`,
});

export const toExternalProposalListItem = (chain, item) => ({
  ...item,
  author: item.author ?? {
    username: addressEllipsis(item.proposer),
    addresses: [{ chain, address: item.proposer }],
  },
  time: getPostUpdatedAt(item),
  hash: item.externalProposalHash,
  status: item.state ?? "Unknown",
  detailLink: `/democracy/external/${item.indexer.blockHeight}_${item.externalProposalHash}`,
});

export const extractLinks = (text) =>
  [...text.matchAll(/(https?:\/\/[^ ]+)/g)].map((item) => item[0]);

export const getLinkNameAndLogo = (link) => {
  try {
    const url = new URL(link);

    let src = "";
    let name = "";
    if (url.host.endsWith("youtube.com") || url.host.endsWith("youtu.be")) {
      src = "/imgs/icons/youtube-logo.svg";
      name = "YouTube";
    } else if (
      url.host.endsWith("github.com") ||
      url.host.endsWith("github.io")
    ) {
      src = "/imgs/icons/github-logo.svg";
      name = "GitHub";
    } else if (url.host.endsWith("medium.com")) {
      src = "/imgs/icons/medium-logo.svg";
      name = "Medium";
    } else if (url.host.endsWith("polkassembly.io")) {
      src = "/imgs/icons/polkassembly-logo.svg";
      name = "Polkassembly";
    } else if (url.host.endsWith("twitter.com")) {
      src = "/imgs/icons/twitter-logo.svg";
      name = "Twitter";
    } else if (url.host === "t.me") {
      src = "/imgs/icons/telegram-logo.svg";
      name = "Telegram";
    } else if (url.host.endsWith("docs.google.com")) {
      src = "/imgs/icons/googledoc-logo.svg";
      name = "Google Docs";
    } else if (url.host.endsWith("drive.google.com")) {
      src = "/imgs/icons/googledrive-logo.svg";
      name = "Google Drive";
    } else if (url.host.endsWith("opensquare.network")) {
      src = "/imgs/icons/opensquare-icon-logo.svg";
      name = "OpenSquare";
    } else if (url.host.endsWith("dotreasury.com")) {
      src = "/imgs/icons/dotreasury-logo.svg";
      name = "doTreasury";
    } else if (url.host.endsWith("subsquare.io")) {
      src = "/imgs/icons/subsquare-logo.svg";
      name = "SubSquare";
    } else {
      src = "/imgs/icons/link-icon.svg";
    }

    if (!name) {
      [, name] = url.host.match(/([^.]*)(?:\.[a-z]+)?$/);
      if (["co", "com"].includes(name)) {
        const m = url.host.match(/([^.]*)(?:\.[a-z]+){2}$/);
        if (m) {
          [, name] = m;
        }
      }
      name = stringUpperFirst(name);
    }

    return [name, src];
  } catch (e) {
    // Broken link or other errors
    return [];
  }
};

export function toApiType(type) {
  if (type === "treasury/bounty") {
    return "treasury/bounties";
  }
  return `${type}s`;
}

export const isMotionCompleted = (motion) => {
  if (motion?.state?.state !== "Executed") {
    return false;
  }
  if (!motion.proposalHash) {
    return false;
  }
  const ok = motion.state.data.some((data) =>
    Object.keys(data).some((rawData) => rawData === "ok")
  );
  if (!ok) {
    return false;
  }
  const error = motion.state.data.some((data) =>
    Object.keys(data).some((rawData) => rawData === "error")
  );
  return !error;
};

export const getMetaDesc = (post, type = "Discussion") => {
  let contentDesc = "";
  const maxDescLength = 60;
  if (post.content) {
    if (post.content.length > maxDescLength) {
      contentDesc = post.content.substr(0, maxDescLength) + "...";
    } else {
      contentDesc = post.content;
    }
  }
  return contentDesc;
};
