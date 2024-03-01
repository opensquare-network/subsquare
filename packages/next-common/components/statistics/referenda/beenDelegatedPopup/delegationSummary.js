import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import AccountSVG from "next-common/assets/imgs/icons/account.svg";
import TracksSVG from "next-common/assets/imgs/icons/tracks.svg";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import tw from "tailwind-styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    ::before {
      content: "";
      display: block;
      height: 1px;
      width: 100%;
      background: var(--neutral300);
    }
  }
`;

const Item = styled(Flex)`
  justify-content: space-between;
  margin: 12px 0;
`;

const Title = tw(Flex)`
  gap-2
  text14Medium text-textPrimary
`;

const Value = tw.div`
  text14Medium text-textPrimary
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
            <AddressUser add={delegatee} />
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
