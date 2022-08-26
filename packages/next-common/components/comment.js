import React from "react";
import styled from "styled-components";
import { timeDurationFromNow } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import { p_14_medium } from "next-common/styles/componentCss";
import Anchor from "next-common/components/styled/anchor";
import { HoverSecondaryCard } from "./styled/containers/secondaryCard";
import Divider from "./styled/layout/divider";
import { MarkdownPreviewer } from "@osn/previewer";
import { getMotionId } from "../utils/motion";

const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;
  min-height: 20px;

  > span {
    display: inline-block;
    height: 12px;
  }

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

const Footer = styled(DividerWrapper)`
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
  color: ${(props) => props.theme.textSecondary};
  svg {
    margin-right: 4px;
    path {
      stroke: ${(props) => props.theme.textTertiary};
    }
  }
  .elapseIcon > * {
    margin-left: 8px;
  }
`;

const AutHideInfo = styled(Info)`
  @media screen and (max-width: 768px) {
    display: none;
  }
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
  color: ${(props) => props.theme.textPrimary};
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  > span {
    display: block;
    ${p_14_medium};
    line-height: 22.4px;
    color: ${(props) => props.theme.textPrimary};
    white-space: nowrap;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: right;
  }

  .symbol {
    color: ${(props) => props.theme.textTertiary};
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    > span {
      line-height: 21px;
      flex-basis: 100%;
    }
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const getCommentSource = (comment, chain) => {
  if (comment?.post) {
    return ["Discussion", comment.post.title, `/post/${comment.post.postUid}`];
  }
  if (comment?.democracy?.externalProposalHash) {
    return ["Democracy External Proposals", comment.democracy.title];
  }
  if (comment?.motion) {
    return [
      "Council Motions",
      comment?.motion.title,
      `/council/motion/${getMotionId(comment?.motion, chain)}`,
    ];
  }
  if (comment?.tip) {
    return [
      "Treasury Tips",
      comment?.tip.title,
      `/treasury/tip/${comment?.tip.height}_${comment?.tip.hash}`,
    ];
  }
  if (comment?.childBounty) {
    return [
      "Treasury Child Bounties",
      comment?.childBounty.title,
      `/treasury/bounty/${comment?.childBounty?.bountyIndex}`,
    ];
  }
  if (comment?.bounty) {
    return [
      "Treasury Bounties",
      comment?.bounty.title,
      `/treasury/bounty/${comment?.bounty.bountyIndex}`,
    ];
  }
  if (comment?.treasuryProposal) {
    return [
      "Treasury Proposals",
      comment?.treasuryProposal.title,
      `/treasury/proposal/${comment?.treasuryProposal.proposalIndex}`,
    ];
  }
  if (comment?.democracy?.proposalIndex) {
    return ["Democracy Public Proposals", comment?.democracy?.title];
  }
  if (comment?.democracy?.referendumIndex > -1) {
    return [
      "Democracy Referendums",
      comment?.democracy?.title,
      `/democracy/referendum/${comment?.democracy?.referendumIndex}`,
    ];
  }
  return ["Unknown"];
};

export default function Comment({ data, chain }) {
  const [type, title, route] = getCommentSource(data, chain);
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          <TitleWrapper>
            <Anchor href={`${route}#${data.height}`} passHref>
              <MarkdownPreviewer
                content={data.content}
                allowedTags={["a"]}
                maxLines={2}
              />
            </Anchor>
          </TitleWrapper>
        </HeadWrapper>

        <Divider margin={12} />
        <FooterWrapper>
          <Footer>
            <div>{type}</div>
            <AutHideInfo>
              <Anchor href={route} passHref>
                {title}
              </Anchor>
            </AutHideInfo>
            {data.updatedAt && (
              <Info>{`${timeDurationFromNow(data.updatedAt)}`}</Info>
            )}
          </Footer>
        </FooterWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}
