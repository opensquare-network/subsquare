import { detailPageCategory } from "../consts/business/category";

export const getShare2SNStext = (post, type) => {
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  let category = "";
  if (detailPageCategory.DEMOCRACY_PROPOSAL === type) {
    category = `Public proposal #${post.proposalIndex}:`
  } else if (detailPageCategory.DEMOCRACY_REFERENDUM === type) {
    category = `Referendum #${post.referendumIndex}:`
  } else if (detailPageCategory.DEMOCRACY_EXTERNAL) {
    category = `External proposal:`
  } else if (detailPageCategory.TREASURY_PROPOSAL) {
    category = `Treasury proposal #${post.proposalIndex}:`
  } else if (detailPageCategory.TREASURY_BOUNTY) {
    category = `Bounty #${post.bountyIndex}:`
  } else if (detailPageCategory.TREASURY_CHILD_BOUNTY) {
    category = `Child bounty #${post.index}:`
  } else if (detailPageCategory.TREASURY_TIP) {
    category = `Tip #${post.index}:`
  } else if (detailPageCategory.COUNCIL_MOTION) {
    category = `Council motion #${post.motionIndex}:`
  } else if (detailPageCategory.TECH_COMM_MOTION) {
    category = `Tech. Comm. motion #${post.motionIndex}:`
  } else if (detailPageCategory.FINANCIAL_MOTION) {
    category = `Financial council motion #${post.motionIndex}:`
  }

  return `[${chain}] ${category}${post.title}`;
};
