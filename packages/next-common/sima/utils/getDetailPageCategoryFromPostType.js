import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function getDetailPageCategory(post) {
  const postType = post.refToPost?.postType;
  if (postType === "referendaReferendum") {
    return detailPageCategory.GOV2_REFERENDUM;
  }
  if (postType === "treasuryProposal") {
    return detailPageCategory.TREASURY_PROPOSAL;
  }
  throw new Error(`Unknown post type: ${postType}`);
}
