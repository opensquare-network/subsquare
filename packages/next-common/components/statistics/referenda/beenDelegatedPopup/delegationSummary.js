import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { p_14_medium, p_14_normal } from "next-common/styles/componentCss";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import TracksSVG from "next-common/assets/imgs/icons/tracks.svg";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import User from "next-common/components/user";

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

export default function DelegationSummary({
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  tracksCount,
 }) {
  const node = useChainSettings();

  return (
    <Wrapper>
      <div>
        <Item>
          <Title>
            <AccountSVG />
            Delegatee
          </Title>
          <Value>
            <User add={delegatee} />
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <TracksSVG />
            Tracks
          </Title>
          <Value>{tracksCount}</Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <AddressesSVG />
            Delegators
          </Title>
          <Value>{delegatorsCount}</Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <BalanceSVG />
            Votes
          </Title>
          <Value>
            <ValueDisplay
              value={toPrecision(delegatedVotes || 0, node.decimals)}
              symbol={node.symbol}
            />
          </Value>
        </Item>
      </div>
      <div>
        <Item>
          <Title>
            <SupportSVG />
            Capital
          </Title>
          <Value>
            <ValueDisplay
              value={toPrecision(delegatedCapital || 0, node.decimals)}
              symbol={node.symbol}
            />
          </Value>
        </Item>
      </div>
    </Wrapper>
  );
}
