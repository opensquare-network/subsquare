import styled from "styled-components";
import User from "next-common/components/user";
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
import isNil from "lodash.isnil";
import { getMotionStateArgs } from "next-common/utils/collective/result";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import AnnouncementNavigate from "./announcementNavigate";
import MaliciousHead from "next-common/components/detail/maliciousHead";

const MotionEndHeader = styled(GreyPanel)`
  justify-content: center;
  padding: 12px;
  gap: 8px;

  position: static;
  height: 38px;

  margin-bottom: 16px;
  color: ${(props) => props.theme.textSecondary};
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
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
    <MotionEndHeader>
      <MotionEnd type="full" motion={motion.onchainData} />
    </MotionEndHeader>
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
      <FlexWrapper>
        <DividerWrapper>
          <User user={motion?.author} add={motion.proposer} fontSize={12} />
          <MotionTag motion={motion.onchainData} />
          <UpdatedTime post={motion} />
          {!noCommentsCount && commentsCount > -1 && (
            <Info>{`${commentsCount} Comments`}</Info>
          )}
        </DividerWrapper>
        {motion.state && (
          <Tag state={motion.state} category={type} args={stateArgs} />
        )}
      </FlexWrapper>
    </div>
  );
}
