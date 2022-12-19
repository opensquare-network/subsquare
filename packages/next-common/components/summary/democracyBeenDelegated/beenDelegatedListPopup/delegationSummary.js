import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { p_14_medium, p_14_normal } from "next-common/styles/componentCss";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    ::before {
      content: "";
      display: block;
      height: 1px;
      width: 100%;
      background: ${(p) => p.theme.grey200Border};
    }
  }
`;

const Item = styled(Flex)`
  justify-content: space-between;
  margin: 12px 0;
`;

const Title = styled(Flex)`
  gap: 8px;

  ${p_14_medium};
  color: ${(p) => p.theme.textPrimary};
`;

const Value = styled.div`
  ${p_14_normal};
  color: ${(p) => p.theme.textPrimary};
`;

export default function DelegationSummary({ delegations, beenDelegatedList }) {
  const node = useChainSettings();

  return (
    <Wrapper>
      <div>
        <Item>
          <Title>
            <BalanceSVG />
            Balance
          </Title>
          <Value>
            <ValueDisplay
              value={toPrecision(delegations?.capital || 0, node.decimals)}
              symbol={node.symbol}
            />
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <SupportSVG />
            Support
          </Title>
          <Value>
            <ValueDisplay
              value={toPrecision(delegations?.votes || 0, node.decimals)}
              symbol={node.symbol}
            />
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <AddressesSVG />
            Address
          </Title>
          <Value>{(beenDelegatedList.length || 0).toLocaleString()}</Value>
        </Item>
      </div>
    </Wrapper>
  );
}
