import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/flattenedVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import { Conviction, ConvictionSupport } from "../../../utils/referendumCommon";
import GreyInfoPanel from "../styled/greyInfoPanel";
import {
  flex,
  flex_nowrap,
  gap_x,
  items_center,
  whitespace_nowrap,
} from "../../../styles/tailwindcss";
import { no_scroll_bar, p_12_normal } from "../../../styles/componentCss";
import { SM_SIZE } from "../../../utils/responsive";
import AddressUser from "next-common/components/user/addressUser";

const Wrapper = styled(GreyInfoPanel)`
  ${flex_nowrap};
  ${whitespace_nowrap};
  overflow-x: auto;

  @media (min-width: ${SM_SIZE + 1}px) {
    ${no_scroll_bar};
  }
`;

const Item = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(8)};
  ${p_12_normal};

  &:not(:first-child) {
    &::before {
      content: "·";
    }
  }
`;

const TextSecondary = styled.span`
  color: var(--textSecondary);
`;

export default function DemocracySummaryDelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <Wrapper>
      <Item>
        <span>Delegating to</span>
        <AddressUser add={delegating.target} />
        <ValueDisplay
          value={
            <TextSecondary>
              {toPrecision(
                delegating.balance * ConvictionSupport[delegating.conviction],
                node.decimals,
              )}
            </TextSecondary>
          }
          symbol={<TextSecondary>{node.symbol}</TextSecondary>}
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
          value={
            <TextSecondary>
              {toPrecision(delegating.balance, node.decimals)}
            </TextSecondary>
          }
          symbol={<TextSecondary>{node.symbol}</TextSecondary>}
        />
      </Item>
    </Wrapper>
  );
}
