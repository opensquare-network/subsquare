/* eslint-disable react/jsx-key */
import styled from "styled-components";
import KVList from "components/kvList";
import Link from "next/link";
import User from "components/user";
import MotionProposal from "./motionProposal";
import Links from "../timeline/links";
import Timeline from "../timeline";
import { getNode, timeDurationFromNow, toPrecision } from "utils";
import SectionTag from "components/sectionTag";
import findLastIndex from "lodash.findlastindex";
import Flex from "../styled/flex";
import { shadow_100 } from "../../styles/componentCss";
import ArticleContent from "../articleContent";
import { useState } from "react";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import { getPostUpdatedAt } from "../../utils/viewfuncs";
import { TYPE_TECH_COMM_MOTION } from "../../utils/viewConstants";

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

const StatusWrapper = styled.div`
  background: #2196f3;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  color: #ffffff;
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


function createMotionBusinessData(motion, chain) {
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

const isMotionCompleted = (motion) => {
  if (motion.status !== "Executed") {
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
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default function TechcommMotionDetail({ motion, chain,onReply, loginUser }) {
  const node = getNode(chain);
  const [post, setPost] = useState(motion);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;
  const treasuryProposalMeta = motion.treasuryProposal?.meta;
  const postUpdateTime = getPostUpdatedAt(post);
  const timeline = createMotionTimelineData(motion.onchainData);

  let timelineData;

  if (isClosed(timeline)) {
    timelineData = getClosedTimelineData(timeline);
  } else {
    timelineData = timeline;
  }

  let business = null;

  const motionCompleted = isMotionCompleted(motion);

  if (motionCompleted) {
    business = createMotionBusinessData(motion, chain);
  }

  if (treasuryProposalMeta) {
    business = [
      [
        "Link to",
        <Link
          href={`/treasury/proposal/${motion.treasuryProposalIndex}`}
        >{`Treasury Proposal #${motion.treasuryProposalIndex}`}</Link>,
      ],
      [
        "Beneficiary",
        <Flex>
          <User
            chain={chain}
            add={treasuryProposalMeta.beneficiary}
            fontSize={14}
          />
          <Links
            chain={chain}
            address={treasuryProposalMeta.beneficiary}
            style={{ marginLeft: 8 }}
          />
        </Flex>,
      ],
      [
        "Value",
        `${toPrecision(treasuryProposalMeta.value ?? 0, decimals)} ${symbol}`,
      ],
      [
        "Bond",
        `${toPrecision(treasuryProposalMeta.bond ?? 0, decimals)} ${symbol}`,
      ],
    ];
  }

  return (
    <div>
      <Wrapper>
        <div>
          <TitleWrapper>
            {motion?.index !== undefined && <Index>{`#${motion.index}`}</Index>}
            <Title>
              {motion?.title}
            </Title>
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
              {motion.isDemocracy && <SectionTag name={"Democracy"} />}
              {postUpdateTime && (
                <Info>
                  Updated{" "}
                  {timeDurationFromNow(postUpdateTime)}
                </Info>
              )}
            </DividerWrapper>
            {motion.status && <StatusWrapper>{motion.status}</StatusWrapper>}
          </FlexWrapper>
          <ArticleContent
            post={post}
            setPost={setPost}
            user={loginUser}
            onReply={onReply}
            type={TYPE_TECH_COMM_MOTION}
          />
        </div>
      </Wrapper>

      <KVList title="Business" data={business} />

      <KVList
        title={"Metadata"}
        data={[
          [
            "Proposer",
            <>
              <User add={motion.proposer} fontSize={14} />
              <Links
                chain={chain}
                address={motion.proposer}
                style={{ marginLeft: 8 }}
              />
            </>,
          ],
          ["Index", motion?.onchainData?.externalProposals?.motionIndex],
          ["Threshold", motion?.onchainData?.threshold],
          ["Hash", motion.hash],
          [<MotionProposal motion={motion?.onchainData} chain={chain} />],
        ]}
      />

      <Timeline data={timelineData} chain={chain} indent={false} />
    </div>
  );
}
