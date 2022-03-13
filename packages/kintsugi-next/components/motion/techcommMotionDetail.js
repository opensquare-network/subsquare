/* eslint-disable react/jsx-key */
import styled from "styled-components";
import KVList from "next-common/components/kvList";
import Link from "next/link";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import Timeline from "next-common/components/timeline";
import { getNode, timeDurationFromNow, toPrecision } from "utils";
import SectionTag from "next-common/components/sectionTag";
import findLastIndex from "lodash.findlastindex";
import Flex from "next-common/components/styled/flex";
import ArticleContent from "next-common/components/articleContent";
import { useState } from "react";
import { createMotionTimelineData } from "utils/timeline/motion";
import { getPostUpdatedAt } from "utils/viewfuncs";
import MultiKVList from "next-common/components/multiKVList";
import MotionEnd from "next-common/components/motionEnd";
import { isMotionEnded } from "next-common/utils";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Proposal from "next-common/components/proposal";
import { finalizedHeightSelector } from "next-common/store/reducers/chainSlice";
import { EditablePanel } from "next-common/components/styled/panel";

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

export default function TechcommMotionDetail({
  motion,
  chain,
  onReply,
  loginUser,
  type,
}) {
  const node = getNode(chain);
  const [post, setPost] = useState(motion);
  const [isEdit, setIsEdit] = useState(false);
  const motionEndHeight = motion.onchainData?.voting?.end;
  const currentFinalHeight = useSelector(finalizedHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(
    currentFinalHeight - motionEndHeight
  );
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;
  const treasuryProposalMeta = motion.treasuryProposal?.meta;
  const postUpdateTime = getPostUpdatedAt(post);
  const timeline = createMotionTimelineData(motion.onchainData);
  const motionEnd = isMotionEnded(motion.onchainData);

  const showMotionEnd =
    !motionEnd &&
    motionEndHeight &&
    currentFinalHeight &&
    currentFinalHeight <= motionEndHeight &&
    estimatedBlocksTime;

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

  if (treasuryProposalMeta) {
    business.push([
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
    ]);
  }

  if (motion?.onchainData?.publicProposals?.length > 0) {
    motion?.onchainData?.publicProposals?.forEach((proposal) => {
      business.push([
        [
          "Link to",
          <Link
            href={`/democracy/proposal/${proposal?.proposalIndex}`}
          >{`Democracy Public Proposal #${proposal?.proposalIndex}`}</Link>,
        ],
        ["Hash", proposal.hash],
        [
          "Proposer",
          <Flex>
            <User chain={chain} add={proposal?.proposer} />
            <Links chain={chain} address={proposal?.proposer} />
          </Flex>,
        ],
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
      <EditablePanel>
        <div>
          {!isEdit && (
            <div>
              {motionEndHeader}
              <TitleWrapper>
                {motion?.index !== undefined && (
                  <Index>{`#${motion.index}`}</Index>
                )}
                <Title>{post?.title}</Title>
              </TitleWrapper>
            </div>
          )}
          {!isEdit && (
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
              {motion.state && <StatusWrapper>{motion.state}</StatusWrapper>}
            </FlexWrapper>
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
        </div>
      </EditablePanel>

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
          ...[
            Number.isInteger(motion?.motionIndex)
              ? ["Index", motion?.motionIndex]
              : null,
          ],
          ["Threshold", motion?.onchainData?.threshold],
          ["Hash", motion.hash],
          [<Proposal motion={motion?.onchainData} chain={chain} />],
        ]}
      />

      <Timeline
        data={timelineData}
        chain={chain}
        indent={false}
        type={type}
        motionEndInfo={motionEndInfo}
      />
    </div>
  );
}
