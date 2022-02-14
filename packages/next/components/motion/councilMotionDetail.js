/* eslint-disable react/jsx-key */
import styled from "styled-components";
import KVList from "next-common/components/kvList";
import MultiKVList from "next-common/components/multiKVList";
import Link from "next/link";

import User from "next-common/components/user";
import MotionProposal from "./motionProposal";
import Links from "next-common/components/links";
import Timeline from "next-common/components/timeline";
import {
  getNode,
  isMotionEnded,
  timeDurationFromNow,
  toPrecision,
} from "utils";
import SectionTag from "components/sectionTag";
import findLastIndex from "lodash.findlastindex";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../../styles/componentCss";
import ArticleContent from "../articleContent";
import { getPostUpdatedAt, isMotionCompleted } from "../../utils/viewfuncs";
import { withLoginUserRedux } from "../../lib";
import { useState } from "react";
import CapitalText from "../capitalText";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import Tag from "next-common/components/tag";
import MotionEnd from "next-common/components/motionEnd";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import { useSelector } from "react-redux";
import Vote from "components/vote";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }

  :hover {
    .edit {
      display: block;
    }
  }
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
`;

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const Info = styled.div`
  font-size: 12px;
  color: #506176;
`;

const TimelineMotionEnd = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 8px;
  }
`;

const MotionEndHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 8px;

  position: static;
  height: 38px;

  background: #f6f7fa;
  border-radius: 4px;

  margin-bottom: 16px;
  color: rgba(80, 97, 118, 1);
`;

function createMotionBusinessData(motion) {
  const height = motion.state.indexer.blockHeight;
  return [
    [
      "Link to",
      <Link
        href={`/democracy/external/${height}_${motion.proposalHash}`}
      >{`External proposal ${motion.proposalHash.slice(0, 8)}`}</Link>,
    ],
  ];
}

const isClosed = (timeline) => {
  return (timeline || []).some((item) => item.method === "Closed");
};

const getClosedTimelineData = (timeline = []) => {
  let firstFoldIndex = timeline.findIndex((item) => item?.method === "Voted");
  const lastFoldIndex = findLastIndex(
    timeline,
    (item) => item?.method === "Voted"
  );
  if (firstFoldIndex > 0) {
    firstFoldIndex--;
  }

  if (firstFoldIndex >= lastFoldIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstFoldIndex && idx <= lastFoldIndex
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstFoldIndex || idx > lastFoldIndex
  );
  return [foldItems, ...notFoldItems];
};

export default withLoginUserRedux(
  ({ loginUser, motion, onReply, chain, type }) => {
    const currentFinalHeight = useSelector(nodesHeightSelector);
    const motionEndHeight = motion.onchainData?.voting?.end;
    const estimatedBlocksTime = useEstimateBlocksTime(
      currentFinalHeight - motionEndHeight
    );
    const motionEnd = isMotionEnded(motion.onchainData);

    const showMotionEnd =
      !motionEnd &&
      motionEndHeight &&
      currentFinalHeight &&
      currentFinalHeight <= motionEndHeight &&
      estimatedBlocksTime;

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const [post, setPost] = useState(motion);
    const [isEdit, setIsEdit] = useState(false);
    const decimals = node.decimals;
    const symbol = node.symbol;

    const postUpdateTime = getPostUpdatedAt(post);
    const timeline = createMotionTimelineData(motion.onchainData, chain);

    let timelineData;
    if (isClosed(timeline)) {
      timelineData = getClosedTimelineData(timeline);
    } else {
      timelineData = timeline;
    }

    let business = [];

    const motionCompleted = isMotionCompleted(motion);
    if (motionCompleted) {
      business.push(createMotionBusinessData(motion, chain));
    }

    if (
      motion.onchainData.treasuryProposals?.length > 0 ||
      motion.onchainData.treasuryBounties?.length > 0
    ) {
      for (const proposal of motion.onchainData.treasuryProposals) {
        business.push([
          [
            "Link to",
            <Link
              href={`/treasury/proposal/${proposal.proposalIndex}`}
            >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
          ],
          [
            "Beneficiary",
            <Flex>
              <User
                chain={chain}
                add={proposal.meta.beneficiary}
                fontSize={14}
              />
              <Links
                chain={chain}
                address={proposal.meta.beneficiary}
                style={{ marginLeft: 8 }}
              />
            </Flex>,
          ],
          [
            "Value",
            `${toPrecision(proposal.meta.value ?? 0, decimals)} ${symbol}`,
          ],
          [
            "Bond",
            `${toPrecision(proposal.meta.bond ?? 0, decimals)} ${symbol}`,
          ],
        ]);
      }

      for (const bounty of motion.onchainData.treasuryBounties) {
        const kvData = [];

        kvData.push([
          "Link to",
          <Link
            href={`/treasury/bounty/${bounty.bountyIndex}`}
          >{`Treasury Bounty #${bounty.bountyIndex}`}</Link>,
        ]);

        const metadata = bounty.meta ? Object.entries(bounty.meta) : [];
        metadata.forEach((item) => {
          switch (item[0]) {
            case "proposer":
            case "beneficiary":
              kvData.push([
                <CapitalText>{item[0]}</CapitalText>,
                <Flex>
                  <User chain={chain} add={item[1]} fontSize={14} />
                  <Links
                    chain={chain}
                    address={item[1]}
                    style={{ marginLeft: 8 }}
                  />
                </Flex>,
              ]);
              break;
            case "value":
            case "bond":
              kvData.push([
                <CapitalText>{item[0]}</CapitalText>,
                `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`,
              ]);
              break;
          }
        });

        business.push(kvData);
      }
    }

    if (motion?.onchainData?.externalProposals?.length > 0) {
      motion?.onchainData?.externalProposals?.forEach((external) => {
        business.push([
          [
            "Link to",
            <Link
              href={`/democracy/external/${external?.indexer.blockHeight}_${external?.proposalHash}`}
            >{`Democracy External #${external?.proposalHash?.slice(
              0,
              6
            )}`}</Link>,
          ],
          ["hash", external.proposalHash],
        ]);
      });
    }

    const motionEndInfo = showMotionEnd ? (
      <TimelineMotionEnd>
        <MotionEnd type="simple" motion={motion.onchainData} chain={chain} />
      </TimelineMotionEnd>
    ) : null;

    const motionEndHeader = showMotionEnd ? (
      <MotionEndHeader>
        <MotionEnd type="full" motion={motion.onchainData} chain={chain} />
      </MotionEndHeader>
    ) : null;

    return (
      <div>
        <Wrapper>
          {!isEdit && (
            <div>
              {motionEndHeader}
              <TitleWrapper>
                {motion?.motionIndex !== undefined && (
                  <Index>{`#${motion.motionIndex}`}</Index>
                )}
                <Title>{post?.title}</Title>
              </TitleWrapper>
              <FlexWrapper>
                <DividerWrapper>
                  <User
                    user={motion?.author}
                    add={motion.proposer}
                    chain={chain}
                    fontSize={12}
                  />
                  {motion.isTreasury && <SectionTag name={"Treasury"} />}
                  {motion?.onchainData?.externalProposals?.length > 0 && (
                    <SectionTag name={"Democracy"} />
                  )}
                  {postUpdateTime && (
                    <Info>Updated {timeDurationFromNow(postUpdateTime)}</Info>
                  )}
                </DividerWrapper>
                {motion.state && <Tag name={motion.state} />}
              </FlexWrapper>
            </div>
          )}
          <ArticleContent
            chain={chain}
            post={post}
            setPost={setPost}
            user={loginUser}
            onReply={onReply}
            type={type}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </Wrapper>
        <Vote chain={chain} />

        <MultiKVList title="Business" data={business} />

        <KVList
          title={"Metadata"}
          data={[
            [
              "Proposer",
              <>
                <User add={motion?.onchainData?.proposer} fontSize={14} />
                <Links
                  chain={chain}
                  address={motion?.onchainData?.proposer}
                  style={{ marginLeft: 8 }}
                />
              </>,
            ],
            ["Index", motion?.motionIndex],
            ["Threshold", motion?.onchainData?.threshold],
            ["Hash", motion?.onchainData?.hash],
            [<MotionProposal motion={motion.onchainData} chain={chain} />],
          ]}
        />

        <Timeline
          motionEndInfo={motionEndInfo}
          data={timelineData}
          chain={chain}
          indent={false}
          type={type}
        />
      </div>
    );
  }
);
