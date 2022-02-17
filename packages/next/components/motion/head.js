import styled from "styled-components";
import User from "next-common/components/user";
import useShowMotionEnd from "./useShowMotionEnd";
import MotionEnd from "next-common/components/motionEnd";
import SectionTag from "next-common/components/sectionTag";
import Tag from "next-common/components/tag";
import Flex from "next-common/components/styled/flex";
import { getPostUpdatedAt } from "../../utils/viewfuncs";
import { timeDurationFromNow } from "utils";

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

const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
`;

const Title = styled.div`
  max-width: 750px;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  margin-bottom: 12px;
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
      color: #9da9bb;
      margin: 0 8px;
    }
  }
`;

const Info = styled.div`
  font-size: 12px;
  color: #506176;
`;

export default function MotionHead({ motion, chain }) {
  const showMotionEnd = useShowMotionEnd(motion?.onchainData);

  const motionEndHeader = showMotionEnd ? (
    <MotionEndHeader>
      <MotionEnd type="full" motion={motion.onchainData} chain={chain} />
    </MotionEndHeader>
  ) : null;

  const postUpdateTime = getPostUpdatedAt(motion);

  return (
    <div>
      {motionEndHeader}
      <TitleWrapper>
        {motion?.motionIndex !== undefined && (
          <Index>{`#${motion.motionIndex}`}</Index>
        )}
        <Title>{motion?.title}</Title>
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
  );
}
