import React from "react";
import { detailPageCategory } from "../consts/business/category";

export const getShare2SNStext = (post, type) => {
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  let category = "";
  if (detailPageCategory.DEMOCRACY_PROPOSAL === type) {
    category = `Public proposal #${ post.proposalIndex }:`
  } else if (detailPageCategory.DEMOCRACY_REFERENDUM === type) {
    category = `Referendum #${ post.referendumIndex }:`
  } else if (detailPageCategory.DEMOCRACY_EXTERNAL === type) {
    category = `External proposal:`
  } else if (detailPageCategory.TREASURY_PROPOSAL === type) {
    category = `Treasury proposal #${ post.proposalIndex }:`
  } else if (detailPageCategory.TREASURY_BOUNTY === type) {
    category = `Bounty #${ post.bountyIndex }:`
  } else if (detailPageCategory.TREASURY_CHILD_BOUNTY === type) {
    category = `Child bounty #${ post.index }:`
  } else if (detailPageCategory.TREASURY_TIP === type) {
    category = `Tip #${ post.index }:`
  } else if (detailPageCategory.COUNCIL_MOTION === type) {
    category = `Council motion #${ post.motionIndex }:`
  } else if (detailPageCategory.TECH_COMM_MOTION === type) {
    category = `Tech. Comm. motion #${ post.motionIndex }:`
  } else if (detailPageCategory.FINANCIAL_MOTION === type) {
    category = `Financial council motion #${ post.motionIndex }:`
  }

  return `[${ chain }] ${ category }${ post.title }`;
};
