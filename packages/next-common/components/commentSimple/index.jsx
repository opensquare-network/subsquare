import React from "react";
import Anchor from "next-common/components/styled/anchor";
import Divider from "../styled/layout/divider";
import { getMotionId } from "../../utils/motion";
import { useChain } from "../../context/chain";
import { hashEllipsis, textEllipsis } from "next-common/utils";
import isMoonChain from "next-common/utils/isMoonChain";
import isNil from "lodash.isnil";
import {
  MaxWidthInfo,
  Footer,
  FooterWrapper,
  HeadWrapper,
  Info,
  ContentWrapper,
  Wrapper,
} from "./styled";
import CommentContent from "./content";
import Duration from "../duration";

const getCommentSource = (comment, chain) => {
  if (comment?.financialMotion) {
    const hash = comment?.financialMotion.hash;
    return [
      "Financial Motion",
      comment.financialMotion.title || `Motion #${hashEllipsis(hash)}`,
      `/financial-council/motions/${comment?.financialMotion.indexer.blockHeight}_${hash}`,
    ];
  }

  if (comment?.post) {
    return ["Discussion", comment.post.title, `/posts/${comment.post.postUid}`];
  }
  if (comment?.motion) {
    const motionId = getMotionId(comment?.motion);

    const isMoon = isMoonChain(chain);
    if (isMoon) {
      return [
        "Treasury Council Motion",
        comment?.motion.title || `Treasury motion #${motionId}`,
        `/treasury-council/motions/${motionId}`,
      ];
    } else {
      return [
        "Council Motions",
        comment?.motion.title || `Motion #${motionId}`,
        `/council/motions/${motionId}`,
      ];
    }
  }
  if (comment?.tip) {
    const tipHash = comment?.tip.hash;
    return [
      "Treasury Tips",
      comment?.tip.title || `Tip #${hashEllipsis(tipHash)}`,
      `/treasury/tips/${comment?.tip.height}_${tipHash}`,
    ];
  }
  if (comment?.childBounty) {
    const index = comment?.childBounty.index;
    return [
      "Treasury Child Bounties",
      comment?.childBounty.title || `Child bounty #${index}`,
      `/treasury/child-bounties/${index}`,
    ];
  }
  if (comment?.bounty) {
    const bountyIndex = comment?.bounty.bountyIndex;
    return [
      "Treasury Bounties",
      comment?.bounty.title || `Bounty #${bountyIndex}`,
      `/treasury/bounties/${bountyIndex}`,
    ];
  }
  if (comment?.treasuryProposal) {
    const proposalIndex = comment?.treasuryProposal.proposalIndex;
    return [
      "Treasury Proposals",
      comment?.treasuryProposal.title || `Proposal #${proposalIndex}`,
      `/treasury/proposals/${proposalIndex}`,
    ];
  }
  if (!isNil(comment?.democracy?.proposalIndex)) {
    const proposalIndex = comment?.democracy?.proposalIndex;
    return [
      "Democracy Public Proposals",
      comment?.democracy?.title || `Proposal #${proposalIndex}`,
      `/democracy/proposals/${proposalIndex}`,
    ];
  }
  if (comment?.democracy?.externalProposalHash) {
    return [
      "Democracy External Proposals",
      comment.democracy.title ||
        `Proposal #${hashEllipsis(comment?.democracy.externalProposalHash)}`,
      `/democracy/externals/${comment?.democracy.indexer.blockHeight}_${comment?.democracy.externalProposalHash}`,
    ];
  }
  if (!isNil(comment?.democracy?.referendumIndex)) {
    const referendumIndex = comment?.democracy?.referendumIndex;
    return [
      "Democracy Referendums",
      comment?.democracy?.title || `Referendum #${referendumIndex}`,
      `/democracy/referenda/${referendumIndex}`,
    ];
  }
  if (comment?.techCommMotion) {
    const motionId = getMotionId(comment?.techCommMotion);
    return [
      "Tech. Comm. Proposals",
      comment?.techCommMotion?.title || `Proposal #${motionId}`,
      `/techcomm/proposals/${motionId}`,
    ];
  }
  if (comment?.referendaReferendum) {
    const referendumIndex = comment?.referendaReferendum?.referendumIndex;
    return [
      "OpenGov Referenda",
      comment?.referendaReferendum?.title || `Referendum #${referendumIndex}`,
      `/referenda/${referendumIndex}`,
    ];
  }
  if (comment?.fellowshipReferendum) {
    const referendumIndex = comment?.fellowshipReferendum?.referendumIndex;
    return [
      "OpenGov Fellowships",
      comment?.fellowshipReferendum?.title || `Fellowship #${referendumIndex}`,
      `/fellowship/referenda/${referendumIndex}`,
    ];
  }
  if (comment?.moonCouncil) {
    const motionId = getMotionId(comment?.moonCouncil);
    return [
      "Council Motions",
      comment?.motion.title || `Motion #${motionId}`,
      `/council/motions/${motionId}`,
    ];
  }
  if (comment?.advisoryCommitteeMotion) {
    const motionId = getMotionId(comment?.advisoryCommitteeMotion);
    return [
      "Advisory Committee Motions",
      comment?.advisoryCommitteeMotion?.title || `Motion #${motionId}`,
      `/advisory-committee/motions/${motionId}`,
    ];
  }
  if (comment?.allianceMotion) {
    const motionId = getMotionId(comment?.allianceMotion);
    return [
      "Alliance Motions",
      comment?.allianceMotion?.title || `Motion #${motionId}`,
      `/alliance/motions/${motionId}`,
    ];
  }
  if (comment?.allianceAnnouncement) {
    const cid = comment?.allianceAnnouncement.cid;
    return [
      "Alliance Announcements",
      comment?.allianceAnnouncement?.title ||
        `Announcement #${textEllipsis(cid, 4, 4)}`,
      `/alliance/announcements/${comment?.allianceAnnouncement?.indexer.blockHeight}_${cid}`,
    ];
  }
  if (comment?.openTechCommittee) {
    const motionId = getMotionId(comment?.openTechCommittee);
    return [
      "Open Tech. Comm. Proposals",
      comment?.openTechCommittee?.title || `Proposal #${motionId}`,
      `/open-techcomm/proposals/${motionId}`,
    ];
  }

  return ["Unknown"];
};

export default function CommentSimple({ data }) {
  const chain = useChain();
  const [type, title, route] = getCommentSource(data, chain);
  return (
    <Wrapper>
      <div className="flex-1 overflow-x-scroll overflow-y-hidden scrollbar-pretty">
        <HeadWrapper>
          <ContentWrapper>
            <Anchor href={`${route}#${data.height}`} passHref>
              <CommentContent data={data} />
            </Anchor>
          </ContentWrapper>
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <Info>{type}</Info>
            <MaxWidthInfo>
              <Anchor href={route} passHref>
                {title || "Untitled"}
              </Anchor>
            </MaxWidthInfo>
            {data.updatedAt && (
              <Info>
                <Duration time={data.updatedAt} />
              </Info>
            )}
          </Footer>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
}
