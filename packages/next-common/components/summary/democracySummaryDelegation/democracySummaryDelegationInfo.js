import React from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import { Conviction, ConvictionSupport } from "../../../utils/referendumCommon";
import GreyInfoPanel from "../styled/greyInfoPanel";
import AddressUser from "next-common/components/user/addressUser";
import tw from "tailwind-styled-components";

const Item = tw.div`
  inline-flex items-center gap-x-2 text12Medium
  before:content-["·"]
  first:before:hidden
`;

const TextSecondary = tw.span`
  text-textSecondary
`;

export default function DemocracySummaryDelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <GreyInfoPanel className="overflow-x-auto !flex-nowrap whitespace-nowrap scrollbar-hidden !rounded">
      <Item>
        <span>Delegating to</span>
        <AddressUser add={delegating.target} />
        <ValueDisplay
          value={toPrecision(
            delegating.balance * ConvictionSupport[delegating.conviction],
            node.decimals,
          )}
          symbol={node.symbol}
        />
      </Item>

      <Item>
        <span>Conviction</span>
        <TextSecondary>
          <VoteLabel conviction={conviction} />
        </TextSecondary>
      </Item>

      <Item>
        <span>Capital</span>
        <ValueDisplay
          value={toPrecision(delegating.balance, node.decimals)}
          symbol={node.symbol}
        />
      </Item>
    </GreyInfoPanel>
  );
}
