import PostTitle from "next-common/components/detail/common/Title";
import TechCommNavigation from "./techCommNavigation";
import PostMeta from "next-common/components/detail/container/Meta";
import MaliciousHead from "next-common/components/detail/maliciousHead";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { usePost } from "next-common/context/post";
import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import MotionEnd from "next-common/components/motionEnd";
import useChainOrScanHeight from "next-common/hooks/height";

export default function TechcommMotionDetailHeader({ motion }) {
  const post = usePost();
  const isEdit = useSelector(isEditingPostSelector);
  const blockHeight = useChainOrScanHeight();
  const motionEndHeight = motion.onchainData?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    blockHeight - motionEndHeight,
  );
  const motionEnd = isMotionEnded(motion.onchainData);
  const showMotionEnd =
    !motionEnd &&
    motionEndHeight &&
    blockHeight &&
    blockHeight <= motionEndHeight &&
    estimatedBlocksTime;

  const motionEndHeader = showMotionEnd ? (
    <CountDownWrapper>
      <MotionEnd type="full" motion={motion.onchainData} />
    </CountDownWrapper>
  ) : null;

  return (
    <>
      {!isEdit && (
        <>
          {post?.isMalicious && <MaliciousHead />}
          <TechCommNavigation motion={motion} />
          {motionEndHeader}
        </>
      )}
      <PostTitle />
      <div className="py-2" />
      <PostMeta />
    </>
  );
}
