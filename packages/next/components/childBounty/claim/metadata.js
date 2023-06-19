import styled from "styled-components";
import { GhostCard } from "next-common/components/styled/containers/ghostCard";
import { shadow_100 } from "next-common/styles/componentCss";
import { StatisticTitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import { useOnchainData } from "next-common/context/post";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import { useMemo } from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Anchor from "next-common/components/styled/anchor";

const MyGhostCard = styled(GhostCard)`
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  ${shadow_100};
  border-radius: 6px;
  color: var(--textPrimary);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  padding: 12px 0;
  :not(:last-child) {
    border-bottom: 1px solid var(--neutral300);
  }
  font-size: 14px;
  line-height: 20px;
`;

const InfoItemName = styled.div`
  font-weight: 500;
`;

const InfoItemValue = styled.div`
  display: flex;
  justify-content: right;
  flex-grow: 1;
  font-weight: 400;

  > a {
    color: ${(props) => props.theme.secondarySapphire500};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const WRAPPER_WIDTH = 300;

export default function Meta() {
  const onChain = useOnchainData();
  const { decimals, symbol } = useChainSettings();
  const { lg, sm } = useScreenSize();
  const beneficiaryUserMaxWidth = useMemo(() => {
    if (sm) return WRAPPER_WIDTH / 2;
    else if (lg) return 124;
    else return null;
  }, [lg, sm]);

  return <MyGhostCard>
    <StatisticTitleContainer>
      <Flex>
        <span>Overview</span>
      </Flex>
    </StatisticTitleContainer>
    <Info>
      <InfoItem>
        <InfoItemName>Beneficiary</InfoItemName>
        <InfoItemValue>
          <User
            add={onChain.beneficiary}
            fontSize={14}
            maxWidth={beneficiaryUserMaxWidth}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemName>Value</InfoItemName>
        <InfoItemValue>
          <ValueDisplay
            value={toPrecision(onChain.meta.value ?? 0, decimals)}
            symbol={symbol}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemName>Curator fee</InfoItemName>
        <InfoItemValue>
          <ValueDisplay
            value={toPrecision(onChain.meta.fee ?? 0, decimals)}
            symbol={symbol}
          />
        </InfoItemValue>
      </InfoItem>
      <InfoItem>
        <InfoItemName>Parent bounty</InfoItemName>
        <InfoItemValue>
          <Anchor href={`/treasury/bounty/${onChain.parentBountyId}`}>
            {`#${onChain.parentBountyId}`}
          </Anchor>
        </InfoItemValue>
      </InfoItem>
    </Info>
  </MyGhostCard>;
}
