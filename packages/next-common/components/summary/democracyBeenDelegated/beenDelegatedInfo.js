import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import GreyInfoPanel from "../styled/greyInfoPanel";
import tw from "tailwind-styled-components";

const Item = tw.div`
  inline-flex items-center gap-x-2 text12Medium
  before:content-["·"]
  first:before:hidden
`;

const TextSecondary = tw.span`
  text-textSecondary
`;

export default function BeenDelegatedInfo({ delegations, addressesCount }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <GreyInfoPanel className="overflow-x-auto !flex-nowrap whitespace-nowrap scrollbar-hidden">
      <Item>
        <span>Been delegated</span>
        <ValueDisplay
          value={toPrecision(delegations?.votes || 0, decimals)}
          symbol={symbol}
        />
      </Item>
      <Item>
        <span>Capital</span>
        <ValueDisplay
          value={toPrecision(delegations?.capital || 0, decimals)}
          symbol={symbol}
        />
      </Item>
      <Item>
        <span>By</span>
        <TextSecondary>
          {addressesCount} {addressesCount === 1 ? "Address" : "Addresses"}
        </TextSecondary>
      </Item>
    </GreyInfoPanel>
  );
}
