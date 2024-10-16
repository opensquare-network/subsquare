import styled from "styled-components";
import Link from "next/link";
import Timeline from "next-common/components/timeline";
import { isMotionEnded } from "next-common/utils";
import { findLastIndex } from "lodash-es";
import ArticleContent from "next-common/components/articleContent";
import { createMotionTimelineData } from "utils/timeline/motion";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import MotionEnd from "next-common/components/motionEnd";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CollectiveMetadata from "next-common/components/collective/metadata";
import CollectiveCall from "next-common/components/collective/call";
import PostEdit from "next-common/components/post/postEdit";
import { usePost, usePostDispatch } from "next-common/context/post";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useChain } from "next-common/context/chain";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { useDetailType } from "next-common/context/page";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";
import TechcommMotionDetailHeader from "components/motion/techcommMotionDetailHeader";
import Copyable from "next-common/components/copyable";
import AddressUser from "next-common/components/user/addressUser";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

const TimelineMotionEnd = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 8px;
  }
`;

function createMotionBusinessData(motion) {
  const height = motion.state.indexer.blockHeight;
  return [
    [
      "Link to",
      <Link
        key="link-to"
        href={`/democracy/externals/${height}_${motion.proposalHash}`}
        legacyBehavior
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
    Object.keys(data).some((rawData) => rawData === "ok"),
  );
  if (!ok) {
    return false;
  }
  const error = motion.state.data.some((data) =>
    Object.keys(data).some((rawData) => rawData === "error"),
  );
  return !error;
};

const getClosedTimelineData = (timeline = []) => {
  let firstFoldIndex = timeline.findIndex((item) => item?.method === "Voted");
  const lastFoldIndex = findLastIndex(
    timeline,
    (item) => item?.method === "Voted",
  );
  if (firstFoldIndex > 0) {
    firstFoldIndex--;
  }

  if (firstFoldIndex >= lastFoldIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstFoldIndex && idx <= lastFoldIndex,
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstFoldIndex || idx > lastFoldIndex,
  );
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default function TechcommMotionDetail({ motion }) {
  const type = useDetailType();
  const chain = useChain();
  const postDispatch = usePostDispatch();
  const post = usePost();
  const isEdit = useSelector(isEditingPostSelector);
  const setIsEdit = useSetEdit();
  const motionEndHeight = motion.onchainData?.voting?.end;
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(
    blockHeight - motionEndHeight,
  );

  const isTimelineCompact = useIsTimelineCompact();

  if (isEdit) {
    return (
      <PostEdit
        setIsEdit={setIsEdit}
        updatePost={() => fetchAndUpdatePost(postDispatch, type, post._id)}
      />
    );
  }

  const treasuryProposalMeta = motion.treasuryProposal?.meta;
  const timeline = createMotionTimelineData(motion.onchainData);
  const motionEnd = isMotionEnded(motion.onchainData);

  const showMotionEnd =
    !motionEnd &&
    motionEndHeight &&
    blockHeight &&
    blockHeight <= motionEndHeight &&
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
          key="treasury-link-to"
          href={`/treasury/proposals/${motion.treasuryProposalIndex}`}
          legacyBehavior
        >{`Treasury Proposal #${motion.treasuryProposalIndex}`}</Link>,
      ],
      [
        "Beneficiary",
        <AddressUser
          key="beneficiary"
          add={treasuryProposalMeta.beneficiary}
        />,
      ],
      [
        "Value",
        <SymbolBalance key="value" value={treasuryProposalMeta.value} />,
      ],
      ["Bond", <SymbolBalance key="bond" value={treasuryProposalMeta.bond} />],
    ]);
  }

  if (motion?.onchainData?.publicProposals?.length > 0) {
    motion?.onchainData?.publicProposals?.forEach((proposal) => {
      business.push([
        [
          "Link to",
          <Link
            key="link-to"
            href={`/democracy/proposals/${proposal?.proposalIndex}`}
            legacyBehavior
          >{`Democracy Public Proposal #${proposal?.proposalIndex}`}</Link>,
        ],
        ["Hash", <Copyable key="hash">{proposal.hash}</Copyable>],
        ["Proposer", <AddressUser key="proposer" add={proposal?.proposer} />],
      ]);
    });
  }

  const motionEndInfo = showMotionEnd ? (
    <TimelineMotionEnd>
      <MotionEnd type="simple" motion={motion.onchainData} />
    </TimelineMotionEnd>
  ) : null;

  return (
    <div className="flex flex-col gap-y-12">
      <DetailContentBase>
        <TechcommMotionDetailHeader motion={motion} />
        <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
      </DetailContentBase>

      <DetailMultiTabs
        call={
          post?.onchainData?.proposal && (
            <CollectiveCall call={post.onchainData.proposal} />
          )
        }
        business={
          !!business?.length && <MultiKVList title="Business" data={business} />
        }
        metadata={
          <CollectiveMetadata
            index={motion?.motionIndex}
            proposer={motion?.onchainData?.proposer}
            threshold={motion?.onchainData?.threshold}
            hash={motion?.hash}
            call={motion?.onchainData?.proposal}
          />
        }
        timeline={
          <Timeline
            data={timelineData}
            indent={false}
            motionEndInfo={motionEndInfo}
            compact={isTimelineCompact}
          />
        }
      />
    </div>
  );
}
