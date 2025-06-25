import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SupportSVG from "next-common/assets/imgs/icons/support.svg";
import BalanceSVG from "next-common/assets/imgs/icons/balance.svg";
import AddressesSVG from "next-common/assets/imgs/icons/addresses.svg";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import Descriptions from "next-common/components/Descriptions";
import tw from "tailwind-styled-components";
import LoadableContent from "next-common/components/common/loadableContent";

const Title = tw(Flex)`
  gap-2
  text14Medium text-textPrimary
`;

export default function DelegationSummary({
  delegations,
  beenDelegatedList,
  isLoading,
}) {
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
        <LoadableContent isLoading={isLoading}>
          <ValueDisplay
            value={toPrecision(delegations?.capital || 0, node.decimals)}
            symbol={node.symbol}
          />
        </LoadableContent>
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
        <LoadableContent isLoading={isLoading}>
          <ValueDisplay
            value={toPrecision(delegations?.votes || 0, node.decimals)}
            symbol={node.symbol}
          />
        </LoadableContent>
      ),
    },
  ];

  return <Descriptions items={descriptionsItems} />;
}
