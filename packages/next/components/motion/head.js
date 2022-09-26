import styled from "styled-components";
import User from "next-common/components/user";
import useShowMotionEnd from "./useShowMotionEnd";
import MotionEnd from "next-common/components/motionEnd";
import Tag from "next-common/components/tags/state/tag";
import Flex from "next-common/components/styled/flex";
import { getPostUpdatedAt } from "utils/viewfuncs";
import DemocracyNavigate from "./democracyNavigate";
import UpdateIcon from "next-common/assets/imgs/icons/line-chart.svg";
import Info from "next-common/components/styled/info";
import {
  DemocracyTag,
  TreasuryTag,
} from "next-common/components/tags/business";
import isNil from "lodash.isnil";
import useDuration from "next-common/utils/hooks/useDuration";

const MotionEndHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 8px;

  position: static;
  height: 38px;

  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;

  margin-bottom: 16px;
  color: ${(props) => props.theme.textSecondary};
`;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 20px;
      line-height: 28px;
      color: ${(props) => props.theme.textTertiary};
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
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

export default function MotionHead({ motion, chain, type }) {
  const showMotionEnd = useShowMotionEnd(motion?.onchainData);

  const motionEndHeader = showMotionEnd ? (
    <MotionEndHeader>
      <MotionEnd type="full" motion={motion.onchainData} chain={chain} />
    </MotionEndHeader>
  ) : null;

  const postUpdateTime = getPostUpdatedAt(motion);
  const duration = useDuration(postUpdateTime);

  return (
    <div>
      <DemocracyNavigate motion={motion.onchainData} type={type} />
      {motionEndHeader}
      <TitleWrapper>
        { !isNil(motion?.motionIndex) && (
          <Index>{ `#${ motion.motionIndex }` }</Index>
        ) }
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
          {motion.isTreasury && (
            <div>
              <TreasuryTag />
            </div>
          )}
          {motion?.onchainData?.externalProposals?.length > 0 && (
            <div>
              <DemocracyTag />
            </div>
          )}
          {postUpdateTime && (
            <Info>
              <UpdateIcon />
              {duration}
            </Info>
          )}
        </DividerWrapper>
        {motion.state && <Tag state={motion.state} category={type} />}
      </FlexWrapper>
    </div>
  );
}
