import { useDetailType, usePageProps } from "next-common/context/page";
import { usePost } from "next-common/context/post";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { hashEllipsis } from "next-common/utils";
import getMotionBreadcrumbName from "next-common/utils/collective/breadcrumbName";
import getAnnouncementBreadcrumbName from "next-common/utils/alliance/announcementBread";

const treasury = { content: "Treasury" };

function getIndexField(chainIndex, pageId) {
  return {
    content: `#${chainIndex ?? pageId}`,
  };
}

function getHashField(chainHash, pageId) {
  if (chainHash) {
    return {
      content: `#${hashEllipsis(chainHash)}`,
    };
  }

  const hash = pageId?.split("_").pop();
  if (hash) {
    return {
      content: `#${hashEllipsis(hash)}`,
    };
  }

  return null;
}

function getMotionField(detail, pageId) {
  return {
    content: getMotionBreadcrumbName(pageId, detail),
  };
}

export default function useBreadcrumbs() {
  const type = useDetailType();
  const post = usePost();
  const { id } = usePageProps();

  if (detailPageCategory.POST === type) {
    return [
      {
        content: "Discussions",
        path: "/discussions",
      },
      {
        content: "#" + post?.postUid,
      },
    ];
  } else if (detailPageCategory.PA_POST === type) {
    return [
      {
        content: "Polkassembly",
        path: "/polkassembly/discussions",
      },
      {
        content: "#" + post?.polkassemblyId,
      },
    ];
  } else if (detailPageCategory.TREASURY_PROPOSAL === type) {
    return [
      treasury,
      {
        content: "Proposals",
        path: "/treasury/proposals",
      },
      getIndexField(post?.proposalIndex, id),
    ];
  } else if (detailPageCategory.COMMUNITY_TREASURY_PROPOSAL === type) {
    return [
      { content: "Community Treasury" },
      {
        content: "Proposals",
        path: "/community-treasury/proposals",
      },
      getIndexField(post?.proposalIndex, id),
    ];
  } else if (detailPageCategory.TREASURY_SPEND === type) {
    return [
      treasury,
      {
        content: "Spends",
        path: "/treasury/spends",
      },
      getIndexField(post?.index, id),
    ];
  } else if (detailPageCategory.FELLOWSHIP_TREASURY_SPEND === type) {
    return [
      treasury,
      {
        content: "Spends",
        path: "/fellowship/treasury/spends",
      },
      getIndexField(post?.index, id),
    ];
  } else if (detailPageCategory.TREASURY_BOUNTY === type) {
    return [
      treasury,
      {
        content: "Bounties",
        path: "/treasury/bounties",
      },
      getIndexField(post?.bountyIndex, id),
    ];
  } else if (detailPageCategory.TREASURY_CHILD_BOUNTY === type) {
    return [
      treasury,
      {
        content: "Child Bounties",
        path: "/treasury/child-bounties",
      },
      getIndexField(post?.bountyIndex, id),
    ];
  } else if (detailPageCategory.TREASURY_TIP === type) {
    return [
      treasury,
      {
        content: "Tips",
        path: "/treasury/tips",
      },
      getHashField(post?.hash, id),
    ].filter(Boolean);
  } else if (detailPageCategory.FINANCIAL_MOTION === type) {
    return [
      {
        content: "Financial",
      },
      {
        content: "Motions",
        path: "/financial-council/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.COUNCIL_MOTION === type) {
    return [
      {
        content: "Council",
      },
      {
        content: "Motions",
        path: "/council/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.ADVISORY_MOTION === type) {
    return [
      {
        content: "Advisory Committee",
      },
      {
        content: "Motions",
        path: "/advisory-committee/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.TECH_COMM_MOTION === type) {
    return [
      {
        content: "Tech.Comm.",
      },
      {
        content: "Proposals",
        path: "/techcomm/proposals",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.OPEN_TECH_COMM_PROPOSAL === type) {
    return [
      {
        content: "Open Tech. Comm.",
      },
      {
        content: "Proposals",
        path: "/open-techcomm/proposals",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.ALLIANCE_MOTION === type) {
    return [
      {
        content: "Alliance",
      },
      {
        content: "Motions",
        path: "/alliance/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.TREASURY_COUNCIL_MOTION === type) {
    return [
      {
        content: "Treasury Council",
      },
      {
        content: "Motions",
        path: "/treasury-council/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.COMMUNITY_MOTION === type) {
    return [
      {
        content: "Community Council",
      },
      {
        content: "Motions",
        path: "/community-council/motions",
      },
      getMotionField(post, id),
    ];
  } else if (detailPageCategory.DEMOCRACY_EXTERNAL === type) {
    return [
      {
        content: "Democracy",
      },
      {
        content: "Externals",
        path: "/democracy/externals",
      },
      getHashField(post?.externalProposalHash, id),
    ];
  } else if (detailPageCategory.DEMOCRACY_REFERENDUM === type) {
    return [
      {
        content: "Democracy",
      },
      {
        content: "Referenda",
        path: "/democracy/referenda",
      },
      getIndexField(post?.referendumIndex, id),
    ];
  } else if (detailPageCategory.DEMOCRACY_PROPOSAL === type) {
    return [
      {
        content: "Democracy",
      },
      {
        content: "Proposals",
        path: "/democracy/proposals",
      },
      getIndexField(post?.proposalIndex, id),
    ];
  } else if (detailPageCategory.ALLIANCE_ANNOUNCEMENT === type) {
    return [
      {
        content: "Alliance",
      },
      {
        content: "Announcements",
        path: "/alliance/announcements",
      },
      {
        content: getAnnouncementBreadcrumbName(id, post),
      },
    ];
  } else if (detailPageCategory.FELLOWSHIP_SALARY_CYCLES === type) {
    return [
      {
        content: "Fellowship",
      },
      {
        content: "Salary Cycles",
        path: "/fellowship/salary",
      },
      {
        content: `#${id}`,
      },
    ];
  } else if (detailPageCategory.CORETIME_SALES === type) {
    return [
      {
        content: "Sales",
      },
      {
        content: `#${id}`,
      },
    ];
  }

  return null;
}
