import styled from "styled-components";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import SymbolBalance from "next-common/components/values/symbolBalance";
import Flex from "next-common/components/styled/flex";
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Statistics from "next-common/components/styled/paragraph/statistic";
import Loading from "next-common/components/loading";
import useTipMeta from "next-common/utils/hooks/useTipMeta";
import MemberLinks from "components/motion/vote/memberLinks";
import useTipThreshold from "next-common/context/post/treasury/tip/tipThreshold";
import useTipIsFinished from "next-common/context/post/treasury/tip/isFinished";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
`;

const ItemsWrapper = styled.div`
  margin-top: 16px;
  padding: 8px 0px;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const TipperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 100%;
  color: var(--textSecondary);
  > :last-child {
    white-space: nowrap;
  }
`;

function Items({ tips, windowWidth }) {
  if (tips.length === 0) {
    return (
      <ItemsWrapper>
        <NoTippers>No tippers</NoTippers>
      </ItemsWrapper>
    );
  }

  return (
    <ItemsWrapper>
      {tips.map(([address, amount]) => (
        <TipperItem key={address}>
          <AddressUser
            add={address}
            fontSize={12}
            {...(windowWidth > 1024 ? { maxWidth: 150 } : {})}
          />
          <div>
            <SymbolBalance value={amount} />
          </div>
        </TipperItem>
      ))}
    </ItemsWrapper>
  );
}

export default function TipperList({ tipHash }) {
  const { width: windowWidth } = useWindowSize();
  const isFinished = useTipIsFinished();
  const tipThreshold = useTipThreshold();
  const { isLoading, tipMeta } = useTipMeta(tipHash);
  const tips = tipMeta?.tips || [];

  return (
    <SecondaryCardDetail>
      <StatisticTitleContainer className="!px-0">
        <Flex>
          <span>Tippers</span>
          <Statistics>
            {tips.length}/{tipThreshold}
          </Statistics>
        </Flex>
        <div>{!isFinished && isLoading && <Loading size={16} />}</div>
      </StatisticTitleContainer>
      <Items tips={tips} windowWidth={windowWidth} />
      <MemberLinks />
    </SecondaryCardDetail>
  );
}
