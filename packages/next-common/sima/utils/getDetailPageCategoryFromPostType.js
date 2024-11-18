import { isNil } from "lodash-es";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function getDetailPageCategory(post) {
  const refToPost = post.refToPost;
  const postType = refToPost?.postType;
  if (postType === "referendaReferendum") {
    return detailPageCategory.GOV2_REFERENDUM;
  } else if (postType === "fellowshipReferendum") {
    return detailPageCategory.FELLOWSHIP_REFERENDUM;
  } else if (postType === "treasuryProposal") {
    return detailPageCategory.TREASURY_PROPOSAL;
  } else if (postType === "treasurySpend") {
    return detailPageCategory.TREASURY_SPEND;
  } else if (postType === "fellowshipTreasurySpend") {
    return detailPageCategory.FELLOWSHIP_TREASURY_SPEND;
  } else if (postType === "motion") {
    return detailPageCategory.COUNCIL_MOTION;
  } else if (postType === "techCommMotion") {
    return detailPageCategory.TECH_COMM_MOTION;
  } else if (postType === "democracy") {
    if (refToPost?.externalProposalHash) {
      return detailPageCategory.DEMOCRACY_EXTERNAL;
    } else if (!isNil(refToPost?.proposalIndex)) {
      return detailPageCategory.DEMOCRACY_PROPOSAL;
    } else if (!isNil(refToPost?.referendumIndex)) {
      return detailPageCategory.DEMOCRACY_REFERENDUM;
    }
  }
  throw new Error(`Unknown post type: ${postType}`);
}
