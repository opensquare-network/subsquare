import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import Anchor from "next-common/components/styled/anchor";
import { HoverSecondaryCard } from "./styled/containers/secondaryCard";
import Divider from "./styled/layout/divider";
import {
  MarkdownPreviewer,
  HtmlPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import { getMotionId } from "../utils/motion";
import IdentityOrAddr from "./IdentityOrAddr";
import { prettyHTML } from "../utils/viewfuncs";
import { useChain } from "../context/chain";
import { hashEllipsis, textEllipsis } from "next-common/utils";
import { isNil } from "lodash-es";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: nowrap;
  min-height: 20px;

  > span {
    display: inline-block;
    height: 12px;
  }

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

const Footer = styled(DividerWrapper)`
  > div:first-child {
    color: var(--textSecondary);
  }
  @media screen and (max-width: 768px) {
    > :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 375px) {
    > :nth-child(2) {
      display: none;
    }
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--textSecondary);
  svg {
    margin-right: 4px;
    path {
      stroke: var(--textTertiary);
    }
  }
  .elapseIcon > * {
    margin-left: 8px;
  }
`;

const AutHideInfo = styled(Info)`
  a {
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const TitleWrapper = styled.div`
  overflow: hidden;
  color: var(--textPrimary);
  div.markdown-body,
  div.html-body {
    color: var(--textPrimary);
  }
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .symbol {
    color: var(--textTertiary);
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    > span {
      line-height: 21px;
      flex-basis: 100%;
    }
  }
`;

const getCommentSource = (comment) => {
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
    return [
      "Council Motions",
      comment?.motion.title || `Motion #${motionId}`,
      `/council/motions/${motionId}`,
    ];
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
  const timeAgo = formatTimeAgo(data.updatedAt);
  return (
    <Wrapper>
      <div className="flex-1 overflow-x-scroll overflow-y-hidden scrollbar-pretty">
        <HeadWrapper>
          <TitleWrapper>
            <Anchor href={`${route}#${data.height}`} passHref>
              {data.contentType === "markdown" && (
                <MarkdownPreviewer
                  content={data.content || ""}
                  plugins={[
                    renderMentionIdentityUserPlugin(<IdentityOrAddr />),
                  ]}
                  maxLines={2}
                  markedOptions={{
                    breaks: true,
                  }}
                />
              )}
              {data.contentType === "html" && (
                <HtmlPreviewer
                  content={prettyHTML(data.content)}
                  plugins={[
                    renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
                      targetElement: { tag: "span" },
                    }),
                  ]}
                  maxLines={2}
                />
              )}
            </Anchor>
          </TitleWrapper>
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <Info>{type}</Info>
            <AutHideInfo>
              <Anchor href={route} passHref>
                {title || "Untitled"}
              </Anchor>
            </AutHideInfo>
            {data.updatedAt && <Info>{timeAgo}</Info>}
          </Footer>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
}
