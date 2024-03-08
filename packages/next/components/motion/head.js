import useShowMotionEnd from "./useShowMotionEnd";
import MotionEnd from "next-common/components/motionEnd";
import Tag from "next-common/components/tags/state/tag";
import Flex from "next-common/components/styled/flex";
import DemocracyNavigate from "./democracyNavigate";
import {
  DemocracyTag,
  TreasuryTag,
} from "next-common/components/tags/business";
import UpdatedTime from "next-common/components/detail/common/UpdatedTime";
import PostTitle from "next-common/components/detail/common/Title";
import {
  isDemocracyMotion,
  isTreasuryMotion,
} from "next-common/utils/viewfuncs/motion";
import Info from "next-common/components/styled/info";
import { isNil } from "lodash-es";
import { getMotionStateArgs } from "next-common/utils/collective/result";
import AnnouncementNavigate from "./announcementNavigate";
import MaliciousHead from "next-common/components/detail/maliciousHead";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import PostUser from "next-common/components/detail/container/postMeta/postUser";
import tw from "tailwind-styled-components";

const DividerWrapper = tw(Flex)`
  flex-wrap
  [&>*]:before:content-["·"]
  [&>*]:before:mx-2
  [&>*]:before:text-textTertiary [&>*]:before:text12Medium
  first:[&>*]:before:hidden
`;

function MotionTag({ motion }) {
  let tag = null;
  if (isTreasuryMotion(motion)) {
    tag = <TreasuryTag />;
  } else if (isDemocracyMotion(motion)) {
    tag = <DemocracyTag />;
  }

  if (!tag) {
    return null;
  }

  return <div>{tag}</div>;
}

export default function MotionHead({ motion, type }) {
  const showMotionEnd = useShowMotionEnd(motion?.onchainData);

  const motionEndHeader = showMotionEnd ? (
    <CountDownWrapper>
      <MotionEnd type="full" motion={motion.onchainData} />
    </CountDownWrapper>
  ) : null;

  const noCommentsCount =
    isNil(motion.commentsCount) && isNil(motion.polkassemblyCommentsCount);
  const commentsCount =
    (motion.commentsCount || 0) + (motion.polkassemblyCommentsCount || 0);

  const stateArgs = getMotionStateArgs(motion.onchainData.state);

  return (
    <div>
      {motion?.isMalicious && <MaliciousHead />}
      {motionEndHeader}
      <DemocracyNavigate motion={motion.onchainData} />
      <AnnouncementNavigate />
      <PostTitle />
      <div className="py-2" />
      <div className="flex justify-between flex-nowrap">
        <DividerWrapper>
          <PostUser />
          <MotionTag motion={motion.onchainData} />
          <UpdatedTime />
          {!noCommentsCount && commentsCount > -1 && (
            <Info>{`${commentsCount} Comments`}</Info>
          )}
        </DividerWrapper>
        {motion.state && (
          <Tag state={motion.state} category={type} args={stateArgs} />
        )}
      </div>
    </div>
  );
}
