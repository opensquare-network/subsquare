import styled from "styled-components";
import User from "next-common/components/user";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { GhostCard } from "next-common/components/styled/containers/ghostCard";
import Flex from "next-common/components/styled/flex";
import floor from "lodash.floor";
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Statistics from "next-common/components/styled/paragraph/statistic";
import Loading from "next-common/components/loading";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import useTipMeta from "next-common/utils/hooks/useTipMeta";
import MemberLinks from "components/motion/vote/memberLinks";

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
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
  color: ${(props) => props.theme.textSecondary};
  > :last-child {
    white-space: nowrap;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Items({ isLoading, tips, windowWidth }) {
  if (isLoading) {
    return (
      <ItemsWrapper>
        <LoadingDiv>
          <Loading size={16} />
        </LoadingDiv>
      </ItemsWrapper>
    );
  }

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
          <User
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

export default function TipperList({ tipHash, tipIsFinal, atBlockHeight }) {
  const { width: windowWidth } = useWindowSize();
  const councilTippers = useCouncilMembers();
  const threshold = floor((councilTippers.length + 1) / 2);
  const forceToReadLastBlock = !tipIsFinal;
  const { isLoading, tipMeta } = useTipMeta(
    tipHash,
    atBlockHeight,
    forceToReadLastBlock
  );
  const tips = tipMeta?.tips || [];

  return (
    <GhostCard>
      <StatisticTitleContainer>
        <Flex>
          <span>Tippers</span>
          {!isLoading && (
            <Statistics>
              {tips.length}/{threshold}
            </Statistics>
          )}
        </Flex>
        <div>{isLoading && <Loading size={16} />}</div>
      </StatisticTitleContainer>
      <Items isLoading={isLoading} tips={tips} windowWidth={windowWidth} />
      <MemberLinks />
    </GhostCard>
  );
}
