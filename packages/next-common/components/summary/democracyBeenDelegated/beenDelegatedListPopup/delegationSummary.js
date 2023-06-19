import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { p_14_medium } from "next-common/styles/componentCss";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import Descriptions from "next-common/components/Descroptions";

const Title = styled(Flex)`
  gap: 8px;

  ${p_14_medium};
  color: var(--textPrimary);
`;

export default function DelegationSummary({ delegations, beenDelegatedList }) {
  const node = useChainSettings();

  const descriptionsItems = [
    {
      label: (
        <Title>
          <AddressesSVG />
          Delegators
        </Title>
      ),
      value: (beenDelegatedList.length || 0).toLocaleString(),
    },
    {
      label: (
        <Title>
          <BalanceSVG />
          Capital
        </Title>
      ),
      value: (
        <ValueDisplay
          value={toPrecision(delegations?.capital || 0, node.decimals)}
          symbol={node.symbol}
        />
      ),
    },
    {
      label: (
        <Title>
          <SupportSVG />
          Votes
        </Title>
      ),
      value: (
        <ValueDisplay
          value={toPrecision(delegations?.votes || 0, node.decimals)}
          symbol={node.symbol}
        />
      ),
    },
  ];

  return <Descriptions items={descriptionsItems} />;
}
